from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import serial
import serial.tools.list_ports
from threading import Thread, RLock, BoundedSemaphore
from queue import Queue
import modbus_tk.defines as mb_cst
import modbus_tk.modbus_rtu as mb_rtu
import time
from pyowm import OWM
from datetime import datetime


# обьект класса устанавливает связь с модбас устройством
class ModbusConnect:
    def __init__(self):
        # инициализация переменных для подключения modbus
        self.ser = serial.Serial(parity=serial.PARITY_NONE, stopbits=1, bytesize=8, timeout=1)
        self.com_number = 3
        self.ser.port = "COM{}".format(self.com_number)
        self.ser.baudrate = 115200
        # инициализация переменных для очереди
        self.q = Queue()
        self.r_lock = RLock()
        self.b_semaphore = BoundedSemaphore(value=1)
        self.in_queue = 0
        self.programm_stopped = False
        self.attempt = 0

    # метод подключает протокол модбас
    def connect_modbus(self):
        try:
            # если порт не открыт, то подключаемся
            if not self.ser.is_open and self.attempt < 5:
                ports = serial.tools.list_ports.comports(include_links=True)
                for port in ports:
                    print(port)
                self.ser.open()
                self.attempt = 0
                return True
            elif self.ser.is_open:
                print("Port " + self.ser.port + " is already open on " + str(self.ser.baudrate) + " baudrate")
                return True
            return False
        except Exception as e:
            print("Error def connect_modbus: " + str(e))
            self.attempt += 1
            time.sleep(1)
            self.connect_modbus()


# объект класса создает методы записи/чтения с регистрами модбас устройства
class ModbusRegister(Thread):
    def __init__(self, register, memory_type):
        Thread.__init__(self)
        self.device = 16
        self.register = register
        self.memory_type = memory_type
        self.master = mb_rtu.RtuMaster(modbus_master.ser)
        self.m_defines = mb_cst
        self.read_flag = False
        self.get_data = [0, ]
        self.mask = 0
        if self.memory_type == "holding_registers":
            self.cmd_light1_on = False
            self.cmd_light2_on = False
            self.cmd_light3_on = False
            self.cmd_light4_on = False
            self.cmd_light5_on = False
            self.cmd_light6_on = False
            self.cmd_conditioner_on = False
            self.test_switch_on = False

    def run(self):
        self.master.set_timeout(0.3)
        self.start_read_register()

    # если это input регистры (входы устройства), то чтение делаем циклическим; если это holding регисры (выходы),
    # то чтение однократно при инициализации объекта, далее чтение/запись по вызову метода
    def start_read_register(self):
        if not modbus_master.programm_stopped:
            if self.memory_type == "input_registers":
                modbus_master.q.put(Thread(target=self.read_register, daemon=True))
                modbus_master.in_queue += 1
                modbus_master.q.get().start()
                time.sleep(0.85)
                self.start_read_register()
            elif self.memory_type == "holding_registers":
                modbus_master.q.put(Thread(target=self.read_register, daemon=True))
                modbus_master.in_queue += 1
                modbus_master.q.get().start()

    # метод очередности чтения регистров
    def read_register(self):
        with modbus_master.b_semaphore:
            try:
                modbus_master.r_lock.acquire()
                self.reading_register()
            except Exception as e:
                print("Error def read_register: " + str(e))
            finally:
                if not self.read_flag:
                    self.read_flag = True
                modbus_master.in_queue -= 1
                modbus_master.r_lock.release()

    # метод чтения регистра
    def reading_register(self):
        if self.memory_type == "input_registers":
            self.get_data = self.master.execute(self.device, self.m_defines.READ_INPUT_REGISTERS, self.register, 1)
            self.mask = self.get_data[0]
        elif self.memory_type == "holding_registers":
            self.get_data = self.master.execute(self.device, self.m_defines.READ_HOLDING_REGISTERS, self.register, 1)

            self.mask = self.get_data[0]
            mask_arr = []
            str_mask = str(bin(self.get_data[0])[2:])
            for i in range(len(str_mask)):
                mask_arr.append(int(str_mask[i]))
            while len(mask_arr) < 16:
                mask_arr.insert(0, 0)
            if mask_arr[15] == 0:
                self.cmd_light1_on = False
            else:
                self.cmd_light1_on = True
            if mask_arr[14] == 0:
                self.cmd_light2_on = False
            else:
                self.cmd_light2_on = True
            if mask_arr[13] == 0:
                self.cmd_light3_on = False
            else:
                self.cmd_light3_on = True
            if mask_arr[12] == 0:
                self.cmd_light4_on = False
            else:
                self.cmd_light4_on = True
            if mask_arr[11] == 0:
                self.cmd_light5_on = False
            else:
                self.cmd_light5_on = True
            if mask_arr[10] == 0:
                self.cmd_light6_on = False
            else:
                self.cmd_light6_on = True
            if mask_arr[9] == 0:
                self.cmd_conditioner_on = False
            else:
                self.cmd_conditioner_on = True
            if mask_arr[8] == 0:
                self.test_switch_on = False
            else:
                self.test_switch_on = True

    # метод очередности записи регисра
    def start_write_register(self):
        if not modbus_master.programm_stopped:
            modbus_master.q.put(Thread(target=self.write_register, daemon=True))
            modbus_master.in_queue += 1
            modbus_master.q.get().start()

    # метод записи регистра
    def write_register(self):
        with modbus_master.b_semaphore:
            try:
                print("try write register")
                modbus_master.r_lock.acquire()
                write_mask = 0
                if self.cmd_light1_on:
                    write_mask += 1
                if self.cmd_light2_on:
                    write_mask += 2
                if self.cmd_light3_on:
                    write_mask += 4
                if self.cmd_light4_on:
                    write_mask += 8
                if self.cmd_light5_on:
                    write_mask += 16
                if self.cmd_light6_on:
                    write_mask += 32
                if self.cmd_conditioner_on:
                    write_mask += 64
                self.master.execute(self.device, self.m_defines.WRITE_SINGLE_REGISTER, self.register,
                                    output_value=write_mask)
                print("finish write register")
            except Exception as e:
                print("Error def write_register: " + str(e))
            finally:
                f = open(log_file, encoding="utf-8", mode="a")
                f.write("".join("\n" + str(datetime.fromtimestamp(int(time.time()))) + ": Свет в комнате 1 - " +
                                str(self.cmd_light1_on) + "; Свет в комнате 2 - " + str(self.cmd_light2_on) +
                                "; Свет в комнате 3 - " + str(self.cmd_light3_on) + "; Свет в комнате 4 - " +
                                str(self.cmd_light4_on) + "; Свет в комнате 5 - " + str(self.cmd_light5_on) +
                                "; Свет в комнате 6 - " + str(self.cmd_light6_on) + "; Кондиционер - " +
                                str(self.cmd_conditioner_on)))
                f.close()
                modbus_master.in_queue -= 1
                modbus_master.r_lock.release()
                self.start_read_register()


# запуск главного окна программы требует авторизации
@login_required(login_url="/login/")
def index(request):
    if modbus_master.connect_modbus():
        print("Port " + modbus_master.ser.port + " is open on " + str(modbus_master.ser.baudrate) + " baudrate")
        create_registers()
    else:
        print("Connection false")
    return render(request, "index.html")


# функция возвращает состояние входов освещения
def state_of_light(request):
    context = {
        "light1_state": state_mask_converting(switches_state.mask, 1),
        "light2_state": state_mask_converting(switches_state.mask, 2),
        "light3_state": state_mask_converting(switches_state.mask, 3),
        "light4_state": state_mask_converting(switches_state.mask, 4),
        "light5_state": state_mask_converting(switches_state.mask, 5),
        "light6_state": state_mask_converting(switches_state.mask, 6)
    }
    return JsonResponse(context)


# функция конвертирует прочитанную маску входов из целочисленного в побитовое значение
def state_mask_converting(mask, bit):
    mask_arr = []
    str_mask = str(bin(mask)[2:])
    for i in range(len(str_mask)):
        mask_arr.append(int(str_mask[i]))
    while len(mask_arr) < 16:
        mask_arr.insert(0, 0)
    if bit == 1:
        return mask_arr[15] == 1
    elif bit == 2:
        return mask_arr[14] == 1
    elif bit == 3:
        return mask_arr[13] == 1
    elif bit == 4:
        return mask_arr[12] == 1
    elif bit == 5:
        return mask_arr[11] == 1
    elif bit == 6:
        return mask_arr[10] == 1
    elif bit == 7:
        return mask_arr[9] == 1
    elif bit == 8:
        return mask_arr[8] == 1
    elif bit == 9:
        return mask_arr[7] == 1
    elif bit == 10:
        return mask_arr[6] == 1
    elif bit == 11:
        return mask_arr[5] == 1
    elif bit == 12:
        return mask_arr[4] == 1
    elif bit == 13:
        return mask_arr[3] == 1
    elif bit == 14:
        return mask_arr[2] == 1
    elif bit == 15:
        return mask_arr[1] == 1
    else:
        return mask_arr[0] == 1


# функция создает объекты (модбас регистры) в своих потоках
def create_registers():
    global switches, switches_state, temperature1, temperature2, temperature3, temperature4, temperature5, \
        temperature6
    switches = ModbusRegister(0, "holding_registers")  # 512
    switches_state = ModbusRegister(1, "input_registers")  # 513
    temperature1 = ModbusRegister(2, "input_registers")  # 514
    temperature2 = ModbusRegister(3, "input_registers")  # 515
    temperature3 = ModbusRegister(4, "input_registers")  # 516
    temperature4 = ModbusRegister(5, "input_registers")  # 517
    temperature5 = ModbusRegister(6, "input_registers")  # 518
    temperature6 = ModbusRegister(7, "input_registers")  # 519
    obj_lst = [switches, switches_state, temperature1, temperature2, temperature3, temperature4, temperature5,
               temperature6]
    for obj in obj_lst:
        obj.setDaemon(True)
        obj.start()


# функция конвертирует значение температуры в rgb цвет для окраски комнаты
def change_room_color(temp):
    if temp < 16:
        temp = 16
    if temp > 30:
        temp = 30
    return room_color[temp]


room_color = {16: "0, 0, 255, 0.4", 17: "0, 25, 255, 0.4", 18: "0, 50, 255, 0.4", 19: "0, 75, 255, 0.4",
              20: "0, 100, 255, 0.4", 21: "0, 125, 255, 0.4", 22: "0, 150, 255, 0.4", 23: "0, 175, 255, 0.4",
              24: "0, 200, 255, 0.4", 25: "255, 200, 0, 0.4", 26: "255, 175, 0, 0.4", 27: "255, 150, 0, 0.4",
              28: "255, 100, 0, 0.4", 29: "255, 50, 0, 0.4", 30: "255, 0, 0, 0.4"}


# функция возвращает значения всех регистров (состояния входов и прочитанных темеператур)
def get_data(request):
    context = {
        "room1_color": change_room_color(temperature1.mask),
        "room2_color": change_room_color(temperature2.mask),
        "room3_color": change_room_color(temperature3.mask),
        "room4_color": change_room_color(temperature4.mask),
        "room5_color": change_room_color(temperature5.mask),
        "room6_color": change_room_color(temperature6.mask),
        "temperature1": temperature1.mask,
        "temperature2": temperature2.mask,
        "temperature3": temperature3.mask,
        "temperature4": temperature4.mask,
        "temperature5": temperature5.mask,
        "temperature6": temperature6.mask,
        "light1_state": state_mask_converting(switches_state.mask, 1),
        "light2_state": state_mask_converting(switches_state.mask, 2),
        "light3_state": state_mask_converting(switches_state.mask, 3),
        "light4_state": state_mask_converting(switches_state.mask, 4),
        "light5_state": state_mask_converting(switches_state.mask, 5),
        "light6_state": state_mask_converting(switches_state.mask, 6),
        "conditioner_state": state_mask_converting(switches_state.mask, 7)
    }
    return JsonResponse(context)


# функция записывает в модбас устройство новые полученные значения и возвращает новые цвета комнат исходя из полученных
# темепратур
def write_switches(request):
    string_cmd_light1_on = request.GET["isLightSwitchOnRoom1"]
    if string_cmd_light1_on == "true":
        switches.cmd_light1_on = True
    elif string_cmd_light1_on == "false":
        switches.cmd_light1_on = False

    string_cmd_light2_on = request.GET["isLightSwitchOnRoom2"]
    if string_cmd_light2_on == "true":
        switches.cmd_light2_on = True
    elif string_cmd_light2_on == "false":
        switches.cmd_light2_on = False

    string_cmd_light3_on = request.GET["isLightSwitchOnRoom3"]
    if string_cmd_light3_on == "true":
        switches.cmd_light3_on = True
    elif string_cmd_light3_on == "false":
        switches.cmd_light3_on = False

    string_cmd_light4_on = request.GET["isLightSwitchOnRoom4"]
    if string_cmd_light4_on == "true":
        switches.cmd_light4_on = True
    elif string_cmd_light4_on == "false":
        switches.cmd_light4_on = False

    string_cmd_light5_on = request.GET["isLightSwitchOnRoom5"]
    if string_cmd_light5_on == "true":
        switches.cmd_light5_on = True
    elif string_cmd_light5_on == "false":
        switches.cmd_light5_on = False

    string_cmd_light6_on = request.GET["isLightSwitchOnRoom6"]
    if string_cmd_light6_on == "true":
        switches.cmd_light6_on = True
    elif string_cmd_light6_on == "false":
        switches.cmd_light6_on = False

    string_cmd_conditioner_on = request.GET["isConditionerSwitchOn"]
    if string_cmd_conditioner_on == "true":
        switches.cmd_conditioner_on = True
    elif string_cmd_conditioner_on == "false":
        switches.cmd_conditioner_on = False

    switches.start_write_register()

    context = {
        "room1_color": change_room_color(temperature1.mask),
        "room2_color": change_room_color(temperature2.mask),
        "room3_color": change_room_color(temperature3.mask),
        "room4_color": change_room_color(temperature4.mask),
        "room5_color": change_room_color(temperature5.mask),
        "room6_color": change_room_color(temperature6.mask),
    }
    return JsonResponse(context)


# функция получает данные по рассвету и закату в выбранном регионе с ресурса Open Weather Map, и на основе полученных
# данных включает или выключает свет в комнатах
def sunset_sunrise_owm(request):
    owm1mode = request.GET["isOwmModeOnRoom1"]
    owm2mode = request.GET["isOwmModeOnRoom2"]
    owm3mode = request.GET["isOwmModeOnRoom3"]
    owm4mode = request.GET["isOwmModeOnRoom4"]
    owm5mode = request.GET["isOwmModeOnRoom5"]
    owm6mode = request.GET["isOwmModeOnRoom6"]
    owm = OWM("61030a1cc48f4ccbcbaf3cd7db4c106d")
    mngr = owm.weather_manager()
    observation = mngr.weather_at_place("Rostov-na-Donu, RU")
    weather = observation.weather
    now_unix = time.time()
    sunrise_unix = weather.sunrise_time(timeformat='unix')
    sunset_unix = weather.sunset_time(timeformat='unix')
    now_date_from_unix = datetime.fromtimestamp(int(time.time()))
    sunrise_date_from_unix = datetime.fromtimestamp(weather.sunrise_time(timeformat='unix'))
    sunset_date_from_unix = datetime.fromtimestamp(weather.sunset_time(timeformat='unix'))
    print("РАССВЕТ: ", sunrise_date_from_unix)
    print("ЗАКАТ: ", sunset_date_from_unix)
    print("СЕЙЧАС: ", now_date_from_unix)
    if now_unix < sunrise_unix or now_unix >= sunset_unix:
        light_on = True
    else:
        light_on = False
    print("ОСВЕЩЕНИЕ: ", light_on)

    f = open(log_file, encoding="utf-8", mode="a")
    f.write("".join("\n" + str(datetime.fromtimestamp(int(time.time()))) + ": РАССВЕТ - " +
                    str(sunrise_date_from_unix) + "; ЗАКАТ - " + str(sunset_date_from_unix) +
                    "; СЕЙЧАС - " + str(now_date_from_unix) + "; ОСВЕЩЕНИЕ - " +
                    str(light_on)))
    f.close()

    if owm1mode == "true" and light_on:
        switches.cmd_light1_on = True
    elif owm1mode == "true" and not light_on:
        switches.cmd_light1_on = False

    if owm2mode == "true" and light_on:
        switches.cmd_light2_on = True
    elif owm2mode == "true" and not light_on:
        switches.cmd_light2_on = False

    if owm3mode == "true" and light_on:
        switches.cmd_light3_on = True
    elif owm3mode == "true" and not light_on:
        switches.cmd_light3_on = False

    if owm4mode == "true" and light_on:
        switches.cmd_light4_on = True
    elif owm4mode == "true" and not light_on:
        switches.cmd_light4_on = False

    if owm5mode == "true" and light_on:
        switches.cmd_light5_on = True
    elif owm5mode == "true" and not light_on:
        switches.cmd_light5_on = False

    if owm6mode == "true" and light_on:
        switches.cmd_light6_on = True
    elif owm6mode == "true" and not light_on:
        switches.cmd_light6_on = False

    switches.start_write_register()
    context = {}
    return JsonResponse(context)


# функция получает данные из формы включения выключения света по расписаню, и на основе полученных
# данных включает или выключает свет в комнатах
def light_shedule_mode(request):
    is_shedule_mode_room1 = request.GET["isSheduleModeOnRoom1"]
    is_shedule_mode_room2 = request.GET["isSheduleModeOnRoom2"]
    is_shedule_mode_room3 = request.GET["isSheduleModeOnRoom3"]
    is_shedule_mode_room4 = request.GET["isSheduleModeOnRoom4"]
    is_shedule_mode_room5 = request.GET["isSheduleModeOnRoom5"]
    is_shedule_mode_room6 = request.GET["isSheduleModeOnRoom6"]
    time_to_light_on = None
    time_to_light_off = None
    try:
        str_time_to_light_on = request.GET["timeToLightOn"]
        time_to_light_on = datetime.strptime(str_time_to_light_on[:-6] + str_time_to_light_on[11:], "%Y-%m-%d%H:%M")
        unix_time_to_light_on = int(time.mktime(time_to_light_on.timetuple()))
    except Exception:
        unix_time_to_light_on = None
    try:
        str_time_to_light_off = request.GET["timeToLightOff"]
        time_to_light_off = datetime.strptime(str_time_to_light_off[:-6] + str_time_to_light_off[11:], "%Y-%m-%d%H:%M")
        unix_time_to_light_off = int(time.mktime(time_to_light_off.timetuple()))
    except Exception:
        unix_time_to_light_off = None
    now_unix = int(time.time())
    print("ВКЛЮЧИТЬ: ", time_to_light_on)
    print("ВЫКЛЮЧИТЬ: ", time_to_light_off)
    print("СЕЙЧАС: ", datetime.fromtimestamp(now_unix))
    if unix_time_to_light_on is None and unix_time_to_light_off is None:
        light_on = False
    elif unix_time_to_light_on is None and now_unix < unix_time_to_light_off:
        light_on = True
    elif unix_time_to_light_on is None and now_unix > unix_time_to_light_off:
        light_on = False
    elif now_unix < unix_time_to_light_on and unix_time_to_light_off is None:
        light_on = False
    elif now_unix > unix_time_to_light_on and unix_time_to_light_off is None:
        light_on = True
    elif now_unix < unix_time_to_light_on and now_unix < unix_time_to_light_off:
        light_on = False
    elif unix_time_to_light_on > now_unix > unix_time_to_light_off:
        light_on = False
    elif now_unix > unix_time_to_light_on and now_unix > unix_time_to_light_off:
        light_on = False
    elif unix_time_to_light_on < now_unix < unix_time_to_light_off:
        light_on = True
    else:
        light_on = False
    print("ОСВЕЩЕНИЕ: ", light_on)

    f = open(log_file, encoding="utf-8", mode="a")
    f.write("".join("\n" + str(datetime.fromtimestamp(int(time.time()))) + ": ВКЛЮЧИТЬ - " +
                    str(time_to_light_on) + "; ВЫКЛЮЧИТЬ - " + str(time_to_light_off) +
                    "; СЕЙЧАС - " + str(datetime.fromtimestamp(now_unix)) + "; ОСВЕЩЕНИЕ - " +
                    str(light_on)))
    f.close()

    if is_shedule_mode_room1 == "true" and light_on:
        switches.cmd_light1_on = True
    elif is_shedule_mode_room1 == "true" and not light_on:
        switches.cmd_light1_on = False

    if is_shedule_mode_room2 == "true" and light_on:
        switches.cmd_light2_on = True
    elif is_shedule_mode_room2 == "true" and not light_on:
        switches.cmd_light2_on = False

    if is_shedule_mode_room3 == "true" and light_on:
        switches.cmd_light3_on = True
    elif is_shedule_mode_room3 == "true" and not light_on:
        switches.cmd_light3_on = False

    if is_shedule_mode_room4 == "true" and light_on:
        switches.cmd_light4_on = True
    elif is_shedule_mode_room4 == "true" and not light_on:
        switches.cmd_light4_on = False

    if is_shedule_mode_room5 == "true" and light_on:
        switches.cmd_light5_on = True
    elif is_shedule_mode_room5 == "true" and not light_on:
        switches.cmd_light5_on = False

    if is_shedule_mode_room6 == "true" and light_on:
        switches.cmd_light6_on = True
    elif is_shedule_mode_room6 == "true" and not light_on:
        switches.cmd_light6_on = False

    switches.start_write_register()
    context = {}
    return JsonResponse(context)


# функция получает данные по температурной уставке пользователя, и на основе полученных данных включает или выключает
# кондиционер с учётом гистрезиса на выключение в 2 градуса Цельсия и гистерезиса на включение в 1 градус Цельсия - во
# избежание дребезга контактов (постоянного включения выключения) на границе температурной уставки; среднюю температуру
# расчитываем из текущих показаний датчиков в трех жилых комнатах (в расчет не берем туалет, ванную комнату и прихожую)
def conditioner_sp_mode(request):
    is_conditioner_sp_mode = request.GET["isConditionerSpModeOn"]
    temperature_set_point = int(request.GET["conditionerSetPoint"])
    temperature_in_room3 = temperature3.mask
    temperature_in_room5 = temperature5.mask
    temperature_in_room6 = temperature6.mask
    temperature_average = int((temperature_in_room3 + temperature_in_room5 + temperature_in_room6) / 3)
    conditioner_switch_on = state_mask_converting(switches_state.mask, 7)
    print("@@@@@", conditioner_switch_on)
    if is_conditioner_sp_mode == "true":
        if conditioner_switch_on and temperature_average < temperature_set_point - 1:
            switches.cmd_conditioner_on = False
        elif not conditioner_switch_on and temperature_average > temperature_set_point:
            switches.cmd_conditioner_on = True
    switches.start_write_register()
    print("@@@@@", temperature_in_room3, temperature_in_room5, temperature_in_room6)
    print("@@@@@", temperature_average, temperature_set_point, switches.cmd_conditioner_on)
    f = open(log_file, encoding="utf-8", mode="a")
    f.write("".join("\n" + str(datetime.fromtimestamp(int(time.time()))) + ": Т комната 3 - " +
                    str(temperature_in_room3) + "; Т комната 5 - " + str(temperature_in_room5) +
                    "; Т комната 6 - " + str(temperature_in_room6) + "; Средняя Т - " +
                    str(temperature_average) + "; Уставка - " + str(temperature_set_point) +
                    "; Кондиционер - " + str(switches.cmd_conditioner_on)))
    f.close()
    context = {
        "conditioner_state": switches.cmd_conditioner_on
    }
    return JsonResponse(context)


log_file = "C:\\smart_house_log.txt"
# создаем подключение по модбас протоколу через интерфейс RS-485
modbus_master = ModbusConnect()
