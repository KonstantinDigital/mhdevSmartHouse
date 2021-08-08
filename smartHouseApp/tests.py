from django.test import TestCase
from django.urls import reverse
from smartHouseApp.models import SmartHouseUser
from smartHouseApp.views import ModbusConnect, ModbusRegister, state_mask_converting, change_room_color


# Create your tests here.
class ProjectTestCase(TestCase):
    def test_view_redirect(self):
        """Проверяем ответ на главную страницу, если с неё идет перенаправление, то код ответа 302"""
        response = self.client.get('http://127.0.0.1:8000/')
        self.assertEqual(response.status_code, 302)

    def test_view_response(self):
        """Проверяем ответ на страницу-редирект, код ответа 200"""
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)

    def test_view_no_response(self):
        """Проверяем ответ на несуществующую страницу код ответа 404"""
        no_response = self.client.get('/post')
        self.assertEqual(no_response.status_code, 404)

    def test_create_user(self):
        """Проверяем создание обЪекта модели User"""
        test_user = SmartHouseUser.objects.create_user(username="test_user")
        self.assertEqual(test_user.username, "test_user")
        self.assertNotEqual(test_user.username, "user")

    def test_connection(self):
        """Проверяем подключение к COM порту, is_open
           возвращает True, если подключение успешно"""
        self.modbus_master = ModbusConnect()
        self.modbus_master.connect_modbus()
        self.assertTrue(self.modbus_master.ser.is_open)

    def test_create_register(self):
        """Проверяем создание объекта регистра
           переменная cmd_light1_on по умолчанию
           создаётся в булевом значении False"""
        test_register = ModbusRegister(0, "holding_registers")
        data = test_register.cmd_light1_on
        self.assertFalse(data)

    def test_read_register(self):
        """Проверяем чтение регистра
           для этого в ПЛК в 8 регистр
           предварительно записано значение 10"""
        test_read = ModbusRegister(8, "input_registers")
        test_read.setDaemon(True)
        test_read.start()
        test_read.reading_register()
        data = test_read.mask
        self.assertEqual(data, 10)

    def test_write_register(self):
        """Проверяем запись регистра
        для этого в ПЛК в 0 регистр
        пробуем произвести запись"""
        test_write = ModbusRegister(0, "holding_registers")
        test_write.setDaemon(True)
        test_write.start()
        test_write.reading_register()
        test_write.test_switch_on = False
        test_write.write_register()
        test_write.reading_register()
        data = test_write.test_switch_on
        self.assertEqual(data, True)

    def test_mask_converting(self):
        """Проверяем работу нашего конвертора битовых масок
           Число 202 в двоичной системе выглядит как 1100 1010
           Функция возвращает нам булевые значения, поэтому
           правильный результат начиная с первого бита будет:
           False, True, False, True, False, False, True, True"""
        bit_mask = 202
        self.assertFalse(state_mask_converting(bit_mask, 1))
        self.assertTrue(state_mask_converting(bit_mask, 2))
        self.assertFalse(state_mask_converting(bit_mask, 3))
        self.assertTrue(state_mask_converting(bit_mask, 4))
        self.assertFalse(state_mask_converting(bit_mask, 5))
        self.assertFalse(state_mask_converting(bit_mask, 6))
        self.assertTrue(state_mask_converting(bit_mask, 7))
        self.assertTrue(state_mask_converting(bit_mask, 8))

    def test_room_color(self):
        """Проверяем работу нашего конвертора значения температуры в RGB цвет
        окраса комнаты, для 25 градусов значение должно быть 255, 200, 0, 0.4"""
        temperature = 25
        self.assertEqual(change_room_color(temperature), "255, 200, 0, 0.4")
