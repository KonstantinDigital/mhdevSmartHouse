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
            print(e)
            self.attempt += 1
            time.sleep(0.5)
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
        self.mask = 0

    def run(self):
        self.master.set_timeout(0.3)
        if self.memory_type == 0:
            self.start_read_register()

    def start_read_register(self):
        if not modbus_master.programm_stopped:
            modbus_master.q.put(Thread(target=self.read_register, daemon=True))
            modbus_master.in_queue += 1
            modbus_master.q.get().start()
            time.sleep(0.85)
            self.start_read_register()

    def read_register(self):
        with modbus_master.b_semaphore:
            try:
                modbus_master.r_lock.acquire()
                self.reading_register()
            except Exception as e:
                print("Error: " + str(e))
            finally:
                if not self.read_flag:
                    self.read_flag = True
                modbus_master.in_queue -= 1
                modbus_master.r_lock.release()

    def reading_register(self):
        if self.memory_type == 0:
            get_data = self.master.execute(16, self.m_defines.READ_INPUT_REGISTERS,
                                           0, 1)
        else:
            get_data = self.master.execute(int(self.device), self.m_defines.READ_HOLDING_REGISTERS,
                                           int(self.register), 1)
        self.mask = get_data[0]
        # mask_arr = []
        # str_mask = str(mask[2:])
        # for i in range(len(str_mask)):
        #     mask_arr.append(int(str_mask[i]))
        # while len(mask_arr) < 16:
        #     mask_arr.insert(0, 0)


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
    test = ModbusRegister(0, 0)
    test.setDaemon(True)
    test.start()
    test_func = Thread(target=test_function, args=[test])
    test_func.setDaemon(True)
    test_func.start()


def test_function(obj):
    print(obj.mask)
    time.sleep(0.85)
    test_function(obj)


modbus_master = ModbusConnect()
