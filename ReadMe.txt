    SMART HOUSE
  Система управления освещением и
контролем температуры в доме через
браузер вашего устройства

    Описание проекта
  Данный проект осуществляет возможность управления
освещением в квартире в трёх режимах:
• «ручной» режим включение и выключение света производится
путём нажатия на соответствующий выключатель в режиме
реального времени;
• режим «рассвет/закат» в этом режиме включение и
выключение света производится программой на основе
полученных с сервиса OpenWeatherMap данных;
• режим «по расписанию» включение и выключение света
производится на основе заданных пользователем даты и времени

  Также проект осуществляет возможность контроля за
температурой в квартире в двух режимах:
• «ручной» режим включение и выключение кондиционера
производится путём нажатия на соответствующий выключатель в
режиме реального времени;
• режим « SP » ( температурная уставка задаётся
пользователем, после чего программа анализирует полученные
данные с температурных датчиков и на основе этих данных
включает и выключает кондиционер по необходимости

  Программа предусматривает авторизацию пользователей с
различными видами доступа:
• Администратор имеет все виды доступа, также может
добавлять и редактировать доступ пользователей;
• User имеет доступ к контролю за освещением в доме;
• Super User помимо освещения, может контролировать
кондиционирование в доме

Логин и пароль админа:
Login: MHDev
Password: 4w104uxh

Логин и пароль обычного пользователя:
Login: User
Password: 1234pass

Логин и пароль пользователя с расширенным функционалом:
Login: SuperUser
Password: 1234pass

    Цели и задачи проекта
  Целью проекта является обеспечение пользователя
максимально удобным и комфортным контролем за освещением и
температурой в своём доме посредством интуитивно понятного
интерфейса программы.
  Задача проекта заинтересовать клиента на дальнейшее
развитие функциональных возможностей системы и перспективу
на долгосрочное сотрудничество.

    Коммерческое использование
  Система “Smart House” будет продаваться только после
непосредственного выезда специалиста компании на объект и
оценки им выполняемых работ и требуемого оборудования.
  Удаленная отрисовка план схемы квартиры заказчиком не
представляется возможным, так как система требует установки
оборудования в доме заказчика, требует выезда специалистов
компании на объект для оценки работ и установки необходимого
оборудования, поэтому отрисовка план схемы квартиры будет
производится непосредственно на месте.

    Применяемые технологии
  Для реализации данного проекта я использовал:
• программируемый логический контроллер ОВЕН ПЛК 110 32;
• модуль аналогового ввода ОВЕН МВ110 224.8А;
• датчики ОВЕН ДТС термосопротивления для измерения температуры воздуха;
• блок питания ОВЕН ИБП60Б
  Для написания программы использовался
• язык программирования Python 3.9 ;
• в качестве фреймворка используется Django
• связь программы с ПЛК осуществляется через интерфейс RS 485 по протоколу
Modbus RTU;
• для обмена данными с контроллером я использовал библиотеки python Serial и
Modbus_tk;
• для правильного считывания данных я использовал многопоточность Threading и
упорядочивание потоков при помощи библиотеки Queue;
• данные о рассвете и закате программа получает из онлайн сервиса
OpenWeatherMap
• страница сайта написана на языке разметки HTML, языке стилей CSS, также
используются скрипты JavaScript технологии библиотеки jQuery, AJAX
• план схема помещения отрисовывается JavaScript’ ом на HTML элементе Canvas;
• для программирования ПЛК применяется среда программирования CoDeSys2.3 и
язык и программирования ST (Structured Text) и FBD (Functional Block Diagram)

    Функциональные возможности
  Интерфейс программы создан интуитивно понятным. В каждой комнате есть выбор режимов управления светом, при
наведении на них курсором они подсвечиваются, при клике они фиксируют выбранный режим. При выборе ручного режима
управления светом становится активным выключатель света. Нарисованные круги отображают включен свет или нет. При
выборе режима работы света по расписанию активным становится окно с выбором времени включения и выключения света
внизу экрана. При выборе режима включения и выключения света по закату и рассвету соответственно программа сама
контролирует когда нужно включить или выключить свет.
  Цвета фона комнат меняются в зависимости от измеренного значения температуры в комнате: от синего (холодного) 
к красному (тёплому). В каждой комнате отображается значение температуры в градусах Цельсия. Также реализована 
возможность контроля температуры в доме. При выборе режима работы кондиционера «ручной» активным становится 
включатель кондиционера. При включении кондиционера включается анимация вращения лопастей. При выборе режима 
кондиционера « SP » (уставка), программа рассчитывает среднюю температуру в трех комнатах и контролирует 
включение и выключения кондиционера в зависимости от выставленной уставки.


pip install django-crispy-forms

docker build -t web-smart .
docker run --rm --name web -p 8000:8000 web-smart
