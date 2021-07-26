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
                print("Port " + self.ser.port + " is open on " + str(self.ser.baudrate) + " baudrate")
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

    # метод проверки соединения
    def check_connect(self):
        if self.ser.is_open:
            self.attempt = 0
            self.add_register()
        else:
            self.attempt += 1
            time.sleep(0.5)
            self.connect_modbus()

    # метод создает новый обьект класса Register
    def add_register(self):
        pass
        # try:
        #     self.obj_count += 1
        #     self.shift += 180
        #     self.scroll_shift += 180
        #     obj_name = "obj{}".format(self.obj_count)
        #     globals()[obj_name] = Register(obj_name, self.get_number_device(), self.get_register_number(),
        #                                    self.get_memory_type(), self, self.scroll_shift, self.frame,
        #                                    self.obj_count, self.shift)
        #     globals()[obj_name].setDaemon(True)
        #     globals()[obj_name].start()
        # except Exception as e:
        #     print(e)


class ModbusRegister(Thread):
    def __init__(self, register, memory_type):
        Thread.__init__(self)
        self.device = 16
        self.register = register
        self.memory_type = memory_type
        self.master = mb_rtu.RtuMaster(ModbusConnect().ser)
        self.m_defines = mb_cst
        self.read_flag = False
        self.mask = 0

    def run(self):
        self.master.set_timeout(0.3)
        self.start_read_register()

    def start_read_register(self):
        if not ModbusConnect().programm_stopped:
            ModbusConnect().q.put(Thread(target=self.read_register, daemon=True))
            ModbusConnect().in_queue += 1
            ModbusConnect().q.get().start()
            time.sleep(0.85)
            self.start_read_register()

    def read_register(self):
        with ModbusConnect().b_semaphore:
            try:
                ModbusConnect().r_lock.acquire()
                self.reading_register()
            except Exception as e:
                print("Error: " + str(e))
            finally:
                if not self.read_flag:
                    self.read_flag = True
                ModbusConnect().in_queue -= 1
                ModbusConnect().r_lock.release()

    def reading_register(self):
        if self.memory_type == 0:
            get_data = self.master.execute(16, self.m_defines.READ_INPUT_REGISTERS,
                                           0, 1)
            print("try")
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
