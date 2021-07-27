from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import serial
from threading import Thread, RLock, BoundedSemaphore
from queue import Queue
import modbus_tk.defines as mb_cst
import modbus_tk.modbus_rtu as mb_rtu
import time


class ModbusConnect:
    def __init__(self):
        # инициализация переменных для подключения modbus
        self.ser = serial.Serial(parity=serial.PARITY_NONE, stopbits=1, bytesize=8, timeout=1)
        self.com_number = 3
        self.ser.port = "COM{}".format(self.com_number)
        self.ser.baudrate = 19200
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


def create_registers():
    switches = ModbusRegister(512, "holding_registers")
    switches_state = ModbusRegister(513, "input_registers")
    temperature1 = ModbusRegister(514, "input_registers")
    temperature2 = ModbusRegister(515, "input_registers")
    temperature3 = ModbusRegister(516, "input_registers")
    temperature4 = ModbusRegister(517, "input_registers")
    temperature5 = ModbusRegister(518, "input_registers")
    temperature6 = ModbusRegister(519, "input_registers")
    music_volume = ModbusRegister(520, "input_registers")
    obj_lst = [switches, switches_state, temperature1, temperature2, temperature3, temperature4, temperature5,
               temperature6, music_volume]
    for obj in obj_lst:
        obj.setDaemon(True)
        obj.start()
    test_func = Thread(target=test_function, args=[switches, switches_state, temperature1, temperature2, temperature3,
                                                   temperature4, temperature5, temperature6, music_volume], daemon=True)
    test_func.start()


def test_function(switches, switches_state, temperature1, temperature2, temperature3,
                  temperature4, temperature5, temperature6, music_volume):
    print(switches.cmd_light1_on)
    print(switches.cmd_light2_on)
    print(switches.cmd_light3_on)
    print(switches.cmd_light4_on)
    print(switches.cmd_light5_on)
    print(switches.cmd_light6_on)
    print(switches.cmd_conditioner_on)
    print(switches.cmd_music_on)
    print(switches_state.mask)
    print(temperature1.mask)
    print(temperature2.mask)
    print(temperature3.mask)
    print(temperature4.mask)
    print(temperature5.mask)
    print(temperature6.mask)
    print(music_volume.mask)
    time.sleep(2)
    test_function(switches, switches_state, temperature1, temperature2, temperature3, temperature4, temperature5,
                  temperature6, music_volume)


modbus_master = ModbusConnect()
