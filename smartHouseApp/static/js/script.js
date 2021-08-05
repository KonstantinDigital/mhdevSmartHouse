let isFirstStart = true;
//крайняя записанная темепература
let lastTemperatureRoom1;
let lastTemperatureRoom2;
let lastTemperatureRoom3;
let lastTemperatureRoom4;
let lastTemperatureRoom5;
let lastTemperatureRoom6;
//крайнее записанное положение выключателя света
let isLightSwitchOnRoom1 = false;
let isLightSwitchOnRoom2 = false;
let isLightSwitchOnRoom3 = false;
let isLightSwitchOnRoom4 = false;
let isLightSwitchOnRoom5 = false;
let isLightSwitchOnRoom6 = false;
//состояние режима OpenWeatherMap
let isOwmModeOnRoom1 = false;
let isOwmModeOnRoom2 = false;
let isOwmModeOnRoom3 = false;
let isOwmModeOnRoom4 = false;
let isOwmModeOnRoom5 = false;
let isOwmModeOnRoom6 = false;
//состояние режима SheduleMode
let isSheduleModeOnRoom1 = false;
let isSheduleModeOnRoom2 = false;
let isSheduleModeOnRoom3 = false;
let isSheduleModeOnRoom4 = false;
let isSheduleModeOnRoom5 = false;
let isSheduleModeOnRoom6 = false;
//крайнее записанное положение выключателя кондиционера
let isConditionerSwitchOn = false;
//крайнее зафиксированное состояние кондиционера
let lastConditionerState = false;
//начальное значение вращения лопастей
let stepRound = 0;
//изображение лопастей
let conditionerImage = document.getElementById("conditioner2ImgId");
//крайний нажатый выключатель света
let lastPressedButton = 0;
//изображение режима работы включения света
let imgLightModeRoom1 = "static/images/lightModeHand.png";
let imgLightModeRoom2 = "static/images/lightModeHand.png";
let imgLightModeRoom3 = "static/images/lightModeHand.png";
let imgLightModeRoom4 = "static/images/lightModeHand.png";
let imgLightModeRoom5 = "static/images/lightModeHand.png";
let imgLightModeRoom6 = "static/images/lightModeHand.png";
//изображение режима работы включения кондиционера
let imgConditionerMode = "static/images/conditionerHandMode.png";
//запуск функции обновления элементов экрана с осрочкой 10 сек
let timerDataReload = setTimeout(dataReload, 10000);
let isOwmFromButton = false;
let isSheduleFromButton = false;
let timerCheckOwm = setTimeout(sunsetSunriseMode, 10000);
clearTimeout(timerCheckOwm);
let timerCheckShedule = setTimeout(sheduleMode, 10000);
clearTimeout(timerCheckShedule);
//функция отрисовки план схемы квартиры
function draw() {
    var canvas = document.getElementById('appLayout');
    if (appLayout.getContext) {
        var ctx = appLayout.getContext('2d');

        //всё пространство
        ctx.fillStyle = 'LightSkyBlue';
        ctx.fillRect(0, 0, 1500, 700);

        //освобождаем место для план-схемы
        ctx.clearRect(50, 50, 1400, 600);

        //стилизация линии
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'blue';

        //контур план-схемы с закругленными краями
        roundedRect(ctx, 50, 50, 1400, 600, 5);

        //контуры комнат с дверьми
        ctx.beginPath();
        ctx.moveTo(1100, 50);
        ctx.lineTo(1100, 100);
        ctx.moveTo(1100, 200);
        ctx.lineTo(1100, 650);
        ctx.moveTo(1100, 250);
        ctx.lineTo(700, 250);
        ctx.moveTo(600, 250);
        ctx.lineTo(550, 250);
        ctx.lineTo(550, 650);
        ctx.moveTo(550, 350);
        ctx.lineTo(500, 350);
        ctx.moveTo(400, 350);
        ctx.lineTo(50, 350);
        ctx.moveTo(350, 350);
        ctx.lineTo(350, 320);
        ctx.moveTo(350, 230);
        ctx.lineTo(350, 170);
        ctx.moveTo(350, 80);
        ctx.lineTo(350, 50);
        ctx.moveTo(350, 200);
        ctx.lineTo(50, 200);
        ctx.stroke();

        //ванная - пространство комнаты 1
        ctx.fillStyle = 'rgb(0, 0, 255, 0.4)';
        ctx.fillRect(53, 53, 294, 144);

        //прихожая - пространство комнаты 2
        ctx.fillStyle = 'rgb(0, 0, 255, 0.4)';
        ctx.fillRect(353, 53, 744, 194);
        ctx.fillRect(353, 247, 195, 100);

        //детская - пространство комнаты 3
        ctx.fillStyle = 'rgb(0, 0, 255, 0.4)';
        ctx.fillRect(1103, 53, 344, 594);

        //туалет - пространство комнаты 4
        ctx.fillStyle = 'rgb(0, 0, 255, 0.4)';
        ctx.fillRect(53, 203, 294, 144);

        //кухня - пространство комнаты 5
        ctx.fillStyle = 'rgb(0, 0, 255, 0.4)';
        ctx.fillRect(53, 353, 494, 294);

        //зал - пространство комнаты 6
        ctx.fillStyle = 'rgb(0, 0, 255, 0.4)';
        ctx.fillRect(553, 253, 544, 394);
        //изменение цвета комнаты 1
        changeColorInRoom1 = function(rgba, lightState) {
            ctx.clearRect(53, 53, 294, 144);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(53, 53, 294, 144);
            if (lightState == true){
                for (i=0;i<10;i++){
                    ctx.beginPath();
                    ctx.arc(200,125,7+7*i,0,Math.PI*2,true);
                    ctx.fill();
                }
            }
        }
        //изменение цвета комнаты 2
        changeColorInRoom2 = function(rgba, lightState) {
            ctx.clearRect(353, 53, 744, 194);
            ctx.clearRect(353, 247, 195, 100);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(353, 53, 744, 194);
            ctx.fillRect(353, 247, 195, 100);
            if (lightState == true){
                for (i=0;i<10;i++){
                    ctx.beginPath();
                    ctx.arc(725,150,9+9*i,0,Math.PI*2,true);
                    ctx.fill();
                }
            }
        }
        //изменение цвета комнаты 3
        changeColorInRoom3 = function(rgba, lightState) {
            ctx.clearRect(1103, 53, 344, 594);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(1103, 53, 344, 594);
            if (lightState == true){
                for (i=0;i<10;i++){
                    ctx.beginPath();
                    ctx.arc(1275,350,17+17*i,0,Math.PI*2,true);
                    ctx.fill();
                }
            }
        }
        //изменение цвета комнаты 4
        changeColorInRoom4 = function(rgba, lightState) {
            ctx.clearRect(53, 203, 294, 144);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(53, 203, 294, 144);
            if (lightState == true){
                for (i=0;i<10;i++){
                    ctx.beginPath();
                    ctx.arc(200,275,7+7*i,0,Math.PI*2,true);
                    ctx.fill();
                }
            }
        }
        //изменение цвета комнаты 5
        changeColorInRoom5 = function(rgba, lightState) {
            ctx.clearRect(53, 353, 494, 294);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(53, 353, 494, 294);
            if (lightState == true){
                for (i=0;i<10;i++){
                    ctx.beginPath();
                    ctx.arc(300,500,14+14*i,0,Math.PI*2,true);
                    ctx.fill();
                }
            }
        }
        //изменение цвета комнаты 6
        changeColorInRoom6 = function(rgba, lightState) {
            ctx.clearRect(553, 253, 544, 394);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(553, 253, 544, 394);
            if (lightState == true){
                for (i=0;i<10;i++){
                    ctx.beginPath();
                    ctx.arc(825,450,19+19*i,0,Math.PI*2,true);
                    ctx.fill();
                }
            }
        }
        //сброс отсрочки запуска функции обновления элементво экран и запуск этой функции
        clearTimeout(timerDataReload);
        timerDataReload = setTimeout(dataReload);
    }
}
//функция срабатывает при изменении выбора уставки температуры кондиционера
function changeSetPoint(){
    console.log("onchange");
}
//функция меняет картинку включателя света в зависимости от его состояния
function lightImgSwitcher(room, state){
    let lightSwitcher = document.getElementById("lightSwitcherRoom" + room);
    if (state == true) {
        lightSwitcher.setAttribute("src", "static/images/lightOff.png");
    } else {
        lightSwitcher.setAttribute("src", "static/images/lightOn.png");
    }
}
//функция по клику на кнопку 1
function onClick1LightButton() {
    if (isLightSwitchOnRoom1 == false) {
        isLightSwitchOnRoom1 = true;
    }
    else {
        isLightSwitchOnRoom1 = false;
    }
    lightImgSwitcher(1, isLightSwitchOnRoom1);
    lastPressedButton = 1;
    changeLightButtonState();
}
//функция по клику на кнопку 2
function onClick2LightButton() {
    if (isLightSwitchOnRoom2 == false) {
        isLightSwitchOnRoom2 = true;
    }
    else {
        isLightSwitchOnRoom2 = false;
    }
    lightImgSwitcher(2, isLightSwitchOnRoom2);
    lastPressedButton = 2;
    changeLightButtonState();
}
//функция по клику на кнопку 3
function onClick3LightButton() {
    if (isLightSwitchOnRoom3 == false) {
        isLightSwitchOnRoom3 = true;
    }
    else {
        isLightSwitchOnRoom3 = false;
    }
    lightImgSwitcher(3, isLightSwitchOnRoom3);
    lastPressedButton = 3;
    changeLightButtonState();
}
//функция по клику на кнопку 4
function onClick4LightButton() {
    if (isLightSwitchOnRoom4 == false) {
        isLightSwitchOnRoom4 = true;
    }
    else {
        isLightSwitchOnRoom4 = false;
    }
    lightImgSwitcher(4, isLightSwitchOnRoom4);
    lastPressedButton = 4;
    changeLightButtonState();
}
//функция по клику на кнопку 5
function onClick5LightButton() {
    if (isLightSwitchOnRoom5 == false) {
        isLightSwitchOnRoom5 = true;
    }
    else {
        isLightSwitchOnRoom5 = false;
    }
    lightImgSwitcher(5, isLightSwitchOnRoom5);
    lastPressedButton = 5;
    changeLightButtonState();
}
//функция по клику на кнопку 6
function onClick6LightButton() {
    if (isLightSwitchOnRoom6 == false) {
        isLightSwitchOnRoom6 = true;
    }
    else {
        isLightSwitchOnRoom6 = false;
    }
    lightImgSwitcher(6, isLightSwitchOnRoom6);
    lastPressedButton = 6;
    changeLightButtonState();
}
//функция по клику на кнопку включения кондиционера
function onClickConditionerButton() {
    if (lastConditionerState == false){
        lastConditionerState = true;
        requestAnimationFrame(runConditioner);
    }
    let conditionerButtonImg = document.getElementById("conditOn");
    if (isConditionerSwitchOn == false) {
        isConditionerSwitchOn = true;
        conditionerButtonImg.setAttribute("src", "static/images/red_button.png");
    }
    else {
        isConditionerSwitchOn = false;
        conditionerButtonImg.setAttribute("src", "static/images/blue_button.png");
    }
    changeLightButtonState();
}
//функция меняет изображение включенной кнопки
function conditionerButtonImgSwitcher(){
    let conditionerButtonImg = document.getElementById("conditOn");
    if (isConditionerSwitchOn == false) {
        conditionerButtonImg.setAttribute("src", "static/images/blue_button.png");
    }
    else {
        conditionerButtonImg.setAttribute("src", "static/images/red_button.png");
    }
}
//функция отправляет на запись измененные состояния при нажатии кнопок
function changeLightButtonState() {
    $.ajax({
        url: "writeSwitchClick",
        method: "GET",
        cache: false,
        dataType: "html",
        data: {isLightSwitchOnRoom1: isLightSwitchOnRoom1, isLightSwitchOnRoom2: isLightSwitchOnRoom2,
            isLightSwitchOnRoom3: isLightSwitchOnRoom3, isLightSwitchOnRoom4: isLightSwitchOnRoom4,
            isLightSwitchOnRoom5: isLightSwitchOnRoom5, isLightSwitchOnRoom6: isLightSwitchOnRoom6,
            isConditionerSwitchOn: isConditionerSwitchOn},
        success: function(data) {
            let parseData = JSON.parse(data);
            let new1Color = parseData["room1_color"];
            let new2Color = parseData["room2_color"];
            let new3Color = parseData["room3_color"];
            let new4Color = parseData["room4_color"];
            let new5Color = parseData["room5_color"];
            let new6Color = parseData["room6_color"];

            if (lastPressedButton == 1){
                lastPressedButton = 0;
                changeColorInRoom1(new1Color, isLightSwitchOnRoom1);
            } else if (lastPressedButton == 2){
                lastPressedButton = 0;
                changeColorInRoom2(new2Color, isLightSwitchOnRoom2);
            } else if (lastPressedButton == 3){
                lastPressedButton = 0;
                changeColorInRoom3(new3Color, isLightSwitchOnRoom3);
            } else if (lastPressedButton == 4){
                lastPressedButton = 0;
                changeColorInRoom4(new4Color, isLightSwitchOnRoom4);
            } else if (lastPressedButton == 5){
                lastPressedButton = 0;
                changeColorInRoom5(new5Color, isLightSwitchOnRoom5);
            } else if (lastPressedButton == 6){
                lastPressedButton = 0;
                changeColorInRoom6(new6Color, isLightSwitchOnRoom6);
            }
        }
    })
}
//функции по клику на выбор режима включения освещения "закат/рассвет"
function onclick1owmMode(){
    isOwmModeOnRoom1 = true;
    isOwmFromButton = true;
    isSheduleModeOnRoom1 = false;
    sunsetSunriseMode();
}

function onclick2owmMode(){
    isOwmModeOnRoom2 = true;
    isOwmFromButton = true;
    isSheduleModeOnRoom2 = false;
    sunsetSunriseMode();
}

function onclick3owmMode(){
    isOwmModeOnRoom3 = true;
    isOwmFromButton = true;
    isSheduleModeOnRoom3 = false;
    sunsetSunriseMode();
}

function onclick4owmMode(){
    isOwmModeOnRoom4 = true;
    isOwmFromButton = true;
    isSheduleModeOnRoom4 = false;
    sunsetSunriseMode();
}

function onclick5owmMode(){
    isOwmModeOnRoom5 = true;
    isOwmFromButton = true;
    isSheduleModeOnRoom5 = false;
    sunsetSunriseMode();
}

function onclick6owmMode(){
    isOwmModeOnRoom6 = true;
    isOwmFromButton = true;
    isSheduleModeOnRoom6 = false;
    sunsetSunriseMode();
}

//функции по клику на выбор режима включения освещения "ручной"
function onclick1handMode(){
    isOwmModeOnRoom1 = false;
    isSheduleModeOnRoom1 = false;
}

function onclick2handMode(){
    isOwmModeOnRoom2 = false;
    isSheduleModeOnRoom2 = false;
}

function onclick3handMode(){
    isOwmModeOnRoom3 = false;
    isSheduleModeOnRoom3 = false;
}

function onclick4handMode(){
    isOwmModeOnRoom4 = false;
    isSheduleModeOnRoom4 = false;
}

function onclick5handMode(){
    isOwmModeOnRoom5 = false;
    isSheduleModeOnRoom5 = false;
}

function onclick6handMode(){
    isOwmModeOnRoom6 = false;
    isSheduleModeOnRoom6 = false;
}

//функции по клику на выбор режима включения освещения "shedule"
function onClickInputSheduleMode() {
    isSheduleFromButton = true;
    sheduleMode();
}

function onclick1sheduleMode(){
    isSheduleModeOnRoom1 = true;
    isSheduleFromButton = true;
    isOwmModeOnRoom1 = false;
    sheduleMode();
}

function onclick2sheduleMode(){
    isSheduleModeOnRoom2 = true;
    isSheduleFromButton = true;
    isOwmModeOnRoom2 = false;
    sheduleMode();
}

function onclick3sheduleMode(){
    isSheduleModeOnRoom3 = true;
    isSheduleFromButton = true;
    isOwmModeOnRoom3 = false;
    sheduleMode();
}

function onclick4sheduleMode(){
    isSheduleModeOnRoom4 = true;
    isSheduleFromButton = true;
    isOwmModeOnRoom4 = false;
    sheduleMode();
}

function onclick5sheduleMode(){
    isSheduleModeOnRoom5 = true;
    isSheduleFromButton = true;
    isOwmModeOnRoom5 = false;
    sheduleMode();
}

function onclick6sheduleMode(){
    isSheduleModeOnRoom6 = true;
    isSheduleFromButton = true;
    isOwmModeOnRoom6 = false;
    sheduleMode();
}
//функция отправляет запрос на open weather map для получения данных о закате и рассвете
function sunsetSunriseMode() {
    $.ajax({
        url: "writeOwmClick",
        method: "GET",
        cache: false,
        dataType: "html",
        data: {isOwmModeOnRoom1: isOwmModeOnRoom1, isOwmModeOnRoom2: isOwmModeOnRoom2,
            isOwmModeOnRoom3: isOwmModeOnRoom3, isOwmModeOnRoom4: isOwmModeOnRoom4,
            isOwmModeOnRoom5: isOwmModeOnRoom5, isOwmModeOnRoom6: isOwmModeOnRoom6},
        success: function(data) {
            if (isOwmFromButton == true) {
                isOwmFromButton = false;
                clearTimeout(timerDataReload);
                timerDataReload = setTimeout(dataReload, 1000);
            }
            checkOwmMode();
        }
    })
}
//если хотя бы один переключатель выбора режима освещения находится в режиме "закат/рассвет" то функция периодически проверяет данные по OWM
function checkOwmMode(){
    if ((isOwmModeOnRoom1 == true) || (isOwmModeOnRoom2 == true) || (isOwmModeOnRoom3 == true) ||
        (isOwmModeOnRoom4 == true) || (isOwmModeOnRoom5 == true) || (isOwmModeOnRoom6 == true)) {
        clearTimeout(timerCheckOwm);
        timerCheckOwm = setTimeout(sunsetSunriseMode, 60000);
    } else {
        clearTimeout(timerCheckOwm);
    }
}
//функция отправляет запрос на open weather map для получения данных о закате и рассвете
function sheduleMode() {
    $.ajax({
        url: "writeSheduleClick",
        method: "GET",
        cache: false,
        dataType: "html",
        data: {isSheduleModeOnRoom1: isSheduleModeOnRoom1, isSheduleModeOnRoom2: isSheduleModeOnRoom2,
            isSheduleModeOnRoom3: isSheduleModeOnRoom3, isSheduleModeOnRoom4: isSheduleModeOnRoom4,
            isSheduleModeOnRoom5: isSheduleModeOnRoom5, isSheduleModeOnRoom6: isSheduleModeOnRoom6,
            timeToLightOn: document.lightSheduleModeForm.sheduleLightOn.value,
            timeToLightOff: document.lightSheduleModeForm.sheduleLightOff.value},
        success: function(data) {
            if (isSheduleFromButton == true) {
                isSheduleFromButton = false;
                clearTimeout(timerDataReload);
                timerDataReload = setTimeout(dataReload, 1000);
            }
            checkSheduleMode();
        }
    })
}
//если хотя бы один переключатель выбора режима освещения находится в режиме "закат/рассвет" то функция периодически проверяет данные по OWM
function checkSheduleMode(){
    if ((isSheduleModeOnRoom1 == true) || (isSheduleModeOnRoom2 == true) || (isSheduleModeOnRoom3 == true) ||
        (isSheduleModeOnRoom4 == true) || (isSheduleModeOnRoom5 == true) || (isSheduleModeOnRoom6 == true)) {
        clearTimeout(timerCheckShedule);
        timerCheckShedule = setTimeout(sheduleMode, 60000);
    } else {
        clearTimeout(timerCheckShedule);
    }
}
//функция периодически обновляет переменные и при изменении их состояния меняет соответствующие элементы на экране
function dataReload() {
    $.ajax({
        url: "getNewData",
        method: "GET",
        cache: false,
        dataType: "html",
        data: {},
        success: function(data) {
            console.log("DATA_RELOAD");
            clearTimeout(timerDataReload);

            let parseData = JSON.parse(data);
            let new1Color = parseData["room1_color"];
            let new2Color = parseData["room2_color"];
            let new3Color = parseData["room3_color"];
            let new4Color = parseData["room4_color"];
            let new5Color = parseData["room5_color"];
            let new6Color = parseData["room6_color"];

            let new1temperature = parseData["temperature1"];
            let new2temperature = parseData["temperature2"];
            let new3temperature = parseData["temperature3"];
            let new4temperature = parseData["temperature4"];
            let new5temperature = parseData["temperature5"];
            let new6temperature = parseData["temperature6"];

            let new1lightState = parseData["light1_state"];
            let new2lightState = parseData["light2_state"];
            let new3lightState = parseData["light3_state"];
            let new4lightState = parseData["light4_state"];
            let new5lightState = parseData["light5_state"];
            let new6lightState = parseData["light6_state"];

            let newConditionerState = parseData["conditioner_state"];

            if (isFirstStart == true) {
                isFirstStart = false;
                let lightSwitchArray = [new1lightState, new2lightState, new3lightState, new4lightState, new5lightState,
                                        new6lightState];
                for(let i=0; i<6; i++){
                    lightImgSwitcher(i+1, lightSwitchArray[i]);
                }
            }


            if (newConditionerState != isConditionerSwitchOn) {
                isConditionerSwitchOn = newConditionerState;
                conditionerButtonImgSwitcher();
                runConditioner();
            }

            if ((new1temperature != lastTemperatureRoom1) || (new1lightState != isLightSwitchOnRoom1)) {
                changeColorInRoom1(new1Color, new1lightState);
                lightImgSwitcher(1, new1lightState);
                changeTemperature(new1temperature, 1);
                lastTemperatureRoom1 = new1temperature;
                isLightSwitchOnRoom1 = new1lightState;
            }

            if ((new2temperature != lastTemperatureRoom2) || (new2lightState != isLightSwitchOnRoom2)) {
                changeColorInRoom2(new2Color, new2lightState);
                lightImgSwitcher(2, new2lightState);
                changeTemperature(new2temperature, 2);
                lastTemperatureRoom2 = new2temperature;
                isLightSwitchOnRoom2 = new2lightState;
            }

            if ((new3temperature != lastTemperatureRoom3) || (new3lightState != isLightSwitchOnRoom3)) {
                changeColorInRoom3(new3Color, new3lightState);
                lightImgSwitcher(3, new3lightState);
                changeTemperature(new3temperature, 3);
                lastTemperatureRoom3 = new3temperature;
                isLightSwitchOnRoom3 = new3lightState;
            }

            if ((new4temperature != lastTemperatureRoom4) || (new4lightState != isLightSwitchOnRoom4)) {
                changeColorInRoom4(new4Color, new4lightState);
                lightImgSwitcher(4, new4lightState);
                changeTemperature(new4temperature, 4);
                lastTemperatureRoom4 = new4temperature;
                isLightSwitchOnRoom4 = new4lightState;
            }

            if ((new5temperature != lastTemperatureRoom5) || (new5lightState != isLightSwitchOnRoom5)) {
                changeColorInRoom5(new5Color, new5lightState);
                lightImgSwitcher(5, new5lightState);
                changeTemperature(new5temperature, 5);
                lastTemperatureRoom5 = new5temperature;
                isLightSwitchOnRoom5 = new5lightState;
            }

            if ((new6temperature != lastTemperatureRoom6) || (new6lightState != isLightSwitchOnRoom6)) {
                changeColorInRoom6(new6Color, new6lightState);
                lightImgSwitcher(6, new6lightState);
                changeTemperature(new6temperature, 6);
                lastTemperatureRoom6 = new6temperature;
                isLightSwitchOnRoom6 = new6lightState;
            }
            timerDataReload = setTimeout(dataReload, 10000);
        }
    })
}
//функция для отрисовки прямоугольника с закругленными углами
function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
}
//функция изменяет значение температуры в комнатах
function changeTemperature(temp, room) {
    let tempInRoom = document.getElementById("temp" + room + "now");
    tempInRoom.innerHTML = String(temp) + "&#176;C";
}
//функция запускает анимацию вращения лопастей кондиционера
function runConditioner() {
    if (isConditionerSwitchOn == true) {
        stepRound += 15;
        conditionerImage.style.transform = "rotate(" + stepRound + "deg)";
        requestAnimationFrame(runConditioner);
    } else {
        lastConditionerState = false;
    }
}


$("#light1handMode").hover(function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", imgLightModeRoom1);
})

$("body").on("click", "#light1handMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom1");
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    imgLightModeRoom1 = "static/images/lightModeHand.png";
    })

$("#light1owmMode").hover(function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", imgLightModeRoom1);
})

$("body").on("click", "#light1owmMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom1");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    imgLightModeRoom1 = "static/images/lightModeOWM.png";
    })

$("#light1sheduleMode").hover(function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", imgLightModeRoom1);
})

$("body").on("click", "#light1sheduleMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom1");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    imgLightModeRoom1 = "static/images/lightModeShedule.png";
    })


$("#light2handMode").hover(function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", imgLightModeRoom2);
})

$("body").on("click", "#light2handMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom2");
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    imgLightModeRoom2 = "static/images/lightModeHand.png";
    })

$("#light2owmMode").hover(function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", imgLightModeRoom2);
})

$("body").on("click", "#light2owmMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom2");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    imgLightModeRoom2 = "static/images/lightModeOWM.png";
    })

$("#light2sheduleMode").hover(function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", imgLightModeRoom2);
})

$("body").on("click", "#light2sheduleMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom2");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    imgLightModeRoom2 = "static/images/lightModeShedule.png";
    })


$("#light3handMode").hover(function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", imgLightModeRoom3);
})

$("body").on("click", "#light3handMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom3");
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    imgLightModeRoom3 = "static/images/lightModeHand.png";
    })

$("#light3owmMode").hover(function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", imgLightModeRoom3);
})

$("body").on("click", "#light3owmMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom3");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    imgLightModeRoom3 = "static/images/lightModeOWM.png";
    })

$("#light3sheduleMode").hover(function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", imgLightModeRoom3);
})

$("body").on("click", "#light3sheduleMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom3");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    imgLightModeRoom3 = "static/images/lightModeShedule.png";
    })


$("#light4handMode").hover(function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", imgLightModeRoom4);
})

$("body").on("click", "#light4handMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom4");
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    imgLightModeRoom4 = "static/images/lightModeHand.png";
    })

$("#light4owmMode").hover(function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", imgLightModeRoom4);
})

$("body").on("click", "#light4owmMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom4");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    imgLightModeRoom4 = "static/images/lightModeOWM.png";
    })

$("#light4sheduleMode").hover(function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", imgLightModeRoom4);
})

$("body").on("click", "#light4sheduleMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom4");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    imgLightModeRoom4 = "static/images/lightModeShedule.png";
    })


$("#light5handMode").hover(function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", imgLightModeRoom5);
})

$("body").on("click", "#light5handMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom5");
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    imgLightModeRoom5 = "static/images/lightModeHand.png";
    })

$("#light5owmMode").hover(function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", imgLightModeRoom5);
})

$("body").on("click", "#light5owmMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom5");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    imgLightModeRoom5 = "static/images/lightModeOWM.png";
    })

$("#light5sheduleMode").hover(function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", imgLightModeRoom5);
})

$("body").on("click", "#light5sheduleMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom5");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    imgLightModeRoom5 = "static/images/lightModeShedule.png";
    })


$("#light6handMode").hover(function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", imgLightModeRoom6);
})

$("body").on("click", "#light6handMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom6");
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    imgLightModeRoom6 = "static/images/lightModeHand.png";
    })

$("#light6owmMode").hover(function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", imgLightModeRoom6);
})

$("body").on("click", "#light6owmMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom6");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    imgLightModeRoom6 = "static/images/lightModeOWM.png";
    })

$("#light6sheduleMode").hover(function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", imgLightModeRoom6);
})

$("body").on("click", "#light6sheduleMode", function () {
    let lightSwitcher = document.getElementById("lightSwitcherRoom6");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    imgLightModeRoom6 = "static/images/lightModeShedule.png";
    })


$("#conditHandMode").hover(function () {
    let img = document.getElementById("conditionerModeId");
    img.setAttribute("src", "static/images/conditionerHandMode.png");
}, function () {
    let img = document.getElementById("conditionerModeId");
    img.setAttribute("src", imgConditionerMode);
})

$("body").on("click", "#conditHandMode", function () {
    let conditionerSp = document.getElementById("tempSP");
    conditionerSp.setAttribute("disabled", "True");
    conditionerSp.setAttribute("class", "selectOpacity");
    let conditionerSwitcher = document.getElementById("conditOn");
    if (isConditionerSwitchOn == false) {
        conditionerSwitcher.setAttribute("src", "static/images/blue_button.png");
    }
    else {
        conditionerSwitcher.setAttribute("src", "static/images/red_button.png");
    }
    conditionerSwitcher.removeAttribute("disabled");
    conditionerSwitcher.removeAttribute("class");
    let img = document.getElementById("conditionerModeId");
    img.setAttribute("src", "static/images/conditionerHandMode.png");
    imgConditionerMode = "static/images/conditionerHandMode.png";
    })

$("#conditSpMode").hover(function () {
    let img = document.getElementById("conditionerModeId");
    img.setAttribute("src", "static/images/conditionerSpMode.png");
}, function () {
    let img = document.getElementById("conditionerModeId");
    img.setAttribute("src", imgConditionerMode);
})

$("body").on("click", "#conditSpMode", function () {
    let conditionerSwitcher = document.getElementById("conditOn");
    conditionerSwitcher.setAttribute("src", "static/images/white_button.png");
    conditionerSwitcher.setAttribute("disabled", "True");
    conditionerSwitcher.setAttribute("class", "switchOpacity");
    let conditionerSp = document.getElementById("tempSP");
    conditionerSp.removeAttribute("disabled");
    conditionerSp.removeAttribute("class");
    let img = document.getElementById("conditionerModeId");
    img.setAttribute("src", "static/images/conditionerSpMode.png");
    imgConditionerMode = "static/images/conditionerSpMode.png";
    })



$("body").on("click", ".lightSheduleModeClass", function () {
    let containerSheduleMode = document.getElementById("containerSheduleLightModeId");
    containerSheduleMode.setAttribute("class", "containerSheduleLightMode");
    let inputSheduleLightOn = document.getElementById("sheduleLightOnId");
    let inputSheduleLightOff = document.getElementById("sheduleLightOffId");
    inputSheduleLightOn.removeAttribute("disabled");
    inputSheduleLightOff.removeAttribute("disabled");
    inputSheduleLightOn.setAttribute("class", "sheduleInput");
    inputSheduleLightOff.setAttribute("class", "sheduleInput");
    })

$("body").on("click", ".lightNotSheduleModeClass", function () {
    if ((isSheduleModeOnRoom1 == false) && (isSheduleModeOnRoom2 == false) && (isSheduleModeOnRoom3 == false) &&
        (isSheduleModeOnRoom4 == false) && (isSheduleModeOnRoom5 == false) && (isSheduleModeOnRoom6 == false)) {
            let containerSheduleMode = document.getElementById("containerSheduleLightModeId");
            containerSheduleMode.setAttribute("class", "containerSheduleLightModeDisabled");
            let inputSheduleLightOn = document.getElementById("sheduleLightOnId");
            let inputSheduleLightOff = document.getElementById("sheduleLightOffId");
            inputSheduleLightOn.setAttribute("disabled", "True");
            inputSheduleLightOff.setAttribute("disabled", "True");
            inputSheduleLightOn.setAttribute("class", "sheduleInputDisabled");
            inputSheduleLightOff.setAttribute("class", "sheduleInputDisabled");
        }
    })

/* функция добавления ведущих нулей */
/* (если число меньше десяти, перед числом добавляем ноль) */
function zero_first_format(value)
{
    if (value < 10)
    {
        value='0'+value;
    }
    return value;
}

/* функция получения текущей даты и времени */
function date_time()
{
    var current_datetime = new Date();
    var day = zero_first_format(current_datetime.getDate());
    var month = zero_first_format(current_datetime.getMonth()+1);
    var year = current_datetime.getFullYear();
    var hours = zero_first_format(current_datetime.getHours());
    var minutes = zero_first_format(current_datetime.getMinutes());
    var seconds = zero_first_format(current_datetime.getSeconds());

    return day+"."+month+"."+year+" "+hours+":"+minutes+":"+seconds;
}
/* каждую секунду получаем текущую дату и время */
/* и вставляем значение в блок с id "current_date_time_block2" */
setInterval(function () {
    document.getElementById('current_date_time_block').innerHTML = date_time();
}, 1000);
