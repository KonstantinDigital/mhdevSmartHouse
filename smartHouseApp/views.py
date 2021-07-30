from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import serial
from threading import Thread, RLock, BoundedSemaphore
from queue import Queue
import modbus_tk.defines as mb_cst
import modbus_tk.modbus_rtu as mb_rtu
import time

# test_temp_1room = 26
# test_temp_2room = 27
# test_temp_3room = 28
# test_temp_4room = 29
# test_temp_5room = 30
# test_temp_6room = 31


class ModbusConnect:
    def __init__(self):
        # инициализация переменных для подключения modbus
        self.ser = serial.Serial(parity=serial.PARITY_NONE, stopbits=1, bytesize=8, timeout=1)
        self.com_number = 3
        self.ser.port = "COM{}".format(self.com_number)
        self.ser.baudrate = 9600
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
            self.cmd_music_on = False

    def run(self):
        self.master.set_timeout(0.3)
        self.start_read_register()

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
                self.cmd_music_on = False
            else:
                self.cmd_music_on = True

    def start_write_register(self):
        if not modbus_master.programm_stopped:
            modbus_master.q.put(Thread(target=self.write_register, daemon=True))
            modbus_master.in_queue += 1
            modbus_master.q.get().start()

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
                if self.cmd_music_on:
                    write_mask += 128
                self.master.execute(self.device, self.m_defines.WRITE_SINGLE_REGISTER, self.register,
                                    output_value=write_mask)
                print("finish write register", write_mask)
            except Exception as e:
                print("Error def write_register: " + str(e))
            finally:
                modbus_master.in_queue -= 1
                modbus_master.r_lock.release()
                self.start_read_register()


# Create your views here.
@login_required(login_url="/login/")
def index(request):
    if modbus_master.connect_modbus():
        print("Port " + modbus_master.ser.port + " is open on " + str(modbus_master.ser.baudrate) + " baudrate")
        create_registers()
    else:
        print("Connection false")
    return render(request, "index.html")


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


def create_registers():
    global switches, switches_state, temperature1, temperature2, temperature3, temperature4, temperature5, \
        temperature6, music_volume
    switches = ModbusRegister(0, "holding_registers")  # 512
    switches_state = ModbusRegister(1, "input_registers")  # 513
    temperature1 = ModbusRegister(2, "input_registers")  # 514
    temperature2 = ModbusRegister(3, "input_registers")  # 515
    temperature3 = ModbusRegister(4, "input_registers")  # 516
    temperature4 = ModbusRegister(5, "input_registers")  # 517
    temperature5 = ModbusRegister(6, "input_registers")  # 518
    temperature6 = ModbusRegister(7, "input_registers")  # 519
    music_volume = ModbusRegister(8, "input_registers")  # 520
    obj_lst = [switches, switches_state, temperature1, temperature2, temperature3, temperature4, temperature5,
               temperature6, music_volume]
    for obj in obj_lst:
        obj.setDaemon(True)
        obj.start()
    # test_func = Thread(target=test_function, daemon=True)
    # test_func.start()


# def test_function():
#     print(switches.cmd_light1_on)
#     print(switches.cmd_light2_on)
#     print(switches.cmd_light3_on)
#     print(switches.cmd_light4_on)
#     print(switches.cmd_light5_on)
#     print(switches.cmd_light6_on)
#     print(switches.cmd_conditioner_on)
#     print(switches.cmd_music_on)
#     print(switches_state.mask)
#     print(temperature1.mask)
#     print(temperature2.mask)
#     print(temperature3.mask)
#     print(temperature4.mask)
#     print(temperature5.mask)
#     print(temperature6.mask)
#     print(music_volume.mask)
#     time.sleep(2)
#     test_function()


def change_room_color(temp):
    if temp < 16:
        temp = 16
    if temp > 30:
        temp = 30
    return room_color[temp]


def get_data(request):
    # temperature1.mask = test_temp_1room
    # temperature2.mask = test_temp_2room
    # temperature3.mask = test_temp_3room
    # temperature4.mask = test_temp_4room
    # temperature5.mask = test_temp_5room
    # temperature6.mask = test_temp_6room
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
        "light6_state": state_mask_converting(switches_state.mask, 6)
    }
    return JsonResponse(context)


def write_switches(request):
    string_cmd_light1_on = request.GET["light1switch"]
    if string_cmd_light1_on == "true":
        switches.cmd_light1_on = True
    elif string_cmd_light1_on == "false":
        switches.cmd_light1_on = False

    string_cmd_light2_on = request.GET["light2switch"]
    if string_cmd_light2_on == "true":
        switches.cmd_light2_on = True
    elif string_cmd_light2_on == "false":
        switches.cmd_light2_on = False

    string_cmd_light3_on = request.GET["light3switch"]
    if string_cmd_light3_on == "true":
        switches.cmd_light3_on = True
    elif string_cmd_light3_on == "false":
        switches.cmd_light3_on = False

    string_cmd_light4_on = request.GET["light4switch"]
    if string_cmd_light4_on == "true":
        switches.cmd_light4_on = True
    elif string_cmd_light4_on == "false":
        switches.cmd_light4_on = False

    string_cmd_light5_on = request.GET["light5switch"]
    if string_cmd_light5_on == "true":
        switches.cmd_light5_on = True
    elif string_cmd_light5_on == "false":
        switches.cmd_light5_on = False

    string_cmd_light6_on = request.GET["light6switch"]
    if string_cmd_light6_on == "true":
        switches.cmd_light6_on = True
    elif string_cmd_light6_on == "false":
        switches.cmd_light6_on = False

    switches.start_write_register()

    # temperature1.mask = test_temp_1room
    # temperature2.mask = test_temp_2room
    # temperature3.mask = test_temp_3room
    # temperature4.mask = test_temp_4room
    # temperature5.mask = test_temp_5room
    # temperature6.mask = test_temp_6room

    context = {
        "room1_color": change_room_color(temperature1.mask),
        "room2_color": change_room_color(temperature2.mask),
        "room3_color": change_room_color(temperature3.mask),
        "room4_color": change_room_color(temperature4.mask),
        "room5_color": change_room_color(temperature5.mask),
        "room6_color": change_room_color(temperature6.mask),
    }
    return JsonResponse(context)


modbus_master = ModbusConnect()

# switches = object
# switches_state = object
# temperature1 = object
# temperature2 = object
# temperature3 = object
# temperature4 = object
# temperature5 = object
# temperature6 = object
# music_volume = object

# room_color = {16: "32, 0, 255, 0.2", 17: "0, 0, 255, 0.2", 18: "0, 57, 255, 0.2", 19: "0, 96, 255, 0.2",
#               20: "0, 121, 255, 0.2", 21: "0, 153, 255, 0.2", 22: "0, 185, 255, 0.2", 23: "0, 204, 255, 0.2",
#               24: "0, 255, 242, 0.2", 25: "255, 249, 0, 0.2", 26: "255, 217, 0, 0.2", 27: "255, 198, 0, 0.2",
#               28: "255, 115, 0, 0.2", 29: "255, 70, 0, 0.2", 30: "255, 0, 0, 0.2"}
room_color = {16: "0, 0, 255, 0.4", 17: "0, 25, 255, 0.4", 18: "0, 50, 255, 0.4", 19: "0, 75, 255, 0.4",
              20: "0, 100, 255, 0.4", 21: "0, 125, 255, 0.4", 22: "0, 150, 255, 0.4", 23: "0, 175, 255, 0.4",
              24: "0, 200, 255, 0.4", 25: "255, 200, 0, 0.4", 26: "255, 175, 0, 0.4", 27: "255, 150, 0, 0.4",
              28: "255, 100, 0, 0.4", 29: "255, 50, 0, 0.4", 30: "255, 0, 0, 0.4"}
