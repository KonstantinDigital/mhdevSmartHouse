import serial
from threading import Thread, RLock, BoundedSemaphore
from queue import Queue
import modbus_tk.defines as mb_cst
import modbus_tk.modbus_rtu as mb_rtu


class ModbusRegister(Thread):
    # инициализация переменных для подключения modbus
    ser = serial.Serial(parity=serial.PARITY_NONE, stopbits=1, bytesize=8, timeout=1)
    com_number = 4
    ser.port = "COM{}".format(com_number)
    ser.baudrate = 19200

    def __init__(self, register, memory_type):
        Thread.__init__(self)
        self.device = 16
        self.register = register
        self.memory_type = memory_type
        # инициализация переменных для очереди
        self.q = Queue()
        self.r_lock = RLock()
        self.b_semaphore = BoundedSemaphore(value=1)
        self.in_queue = 0
        self.programm_stopped = False

    # метод подключает протокол модбас
    def connect_modbus(self):
        try:
            # если порт не открыт, то подключаемся
            if not self.ser.is_open:
                self.ser.open()
                self.check_connect()
                print("Port " + self.ser.port + " is open on " + str(self.ser.baudrate) + " baudrate")
            # если порт открыт и номер порта и скорость соединения равны с прошлым подключением
            elif self.ser.is_open and self.get_comport() == self.number \
                    and int(self.get_baudrate()) == self.ser.baudrate:
                print("Port " + self.ser.port + " is already OPEN on " + str(self.ser.baudrate) + " baudrate")
            # если порт открыт, но изменились данные для подключения
            else:
                self.ser.close()
                self.ser.baudrate = int(self.get_baudrate())
                self.number = self.get_comport()
                self.ser.port = "COM{}".format(self.number)
                self.ser.open()
                self.check_connect()
                print("Port " + self.ser.port + " is open on other baudrate " + str(self.ser.baudrate))
        except Exception as e:
            self.check_connect()
            print(e)

    # метод проверки соединения
    def check_connect(self):
        if self.ser.is_open:
            self.status_window.configure(bg="green")
            self.create_register()
        else:
            self.status_window.configure(bg="red")
            self.destroy_register()
