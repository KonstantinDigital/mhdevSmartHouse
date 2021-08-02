let firstStart = true;
//крайняя записанная темепература
let old1temperature = 16;
let old2temperature = 16;
let old3temperature = 16;
let old4temperature = 16;
let old5temperature = 16;
let old6temperature = 16;
//крайнее записанное положение выключателя света
let light1switch = false;
let light2switch = false;
let light3switch = false;
let light4switch = false;
let light5switch = false;
let light6switch = false;
//крайнее записанное положение выключателя кондиционера
let conditionerSwitch = false;
//крайнее зафиксированное состояние кондиционера
let lastConditionerState = false;
//начальное значение вращения лопастей
let stepRound = 0;
//изображение лопастей
let conditionerImage = document.getElementById("conditioner2ImgId");
//крайний нажатый выключатель света
let lastPressedButton = 0;
//изображение режима работы включения света
let light1modes = "static/images/lightModeHand.png";
let light2modes = "static/images/lightModeHand.png";
let light3modes = "static/images/lightModeHand.png";
let light4modes = "static/images/lightModeHand.png";
let light5modes = "static/images/lightModeHand.png";
let light6modes = "static/images/lightModeHand.png";
//изображение режима работы включения кондиционера
let conditionerModes = "static/images/conditionerHandMode.png";
//запуск функции обновления элементов экрана с осрочкой 10 сек
let timerId = setTimeout(dataReload, 10000);
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
        change1Color = function(rgba, lightState) {
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
        change2Color = function(rgba, lightState) {
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
        change3Color = function(rgba, lightState) {
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
        change4Color = function(rgba, lightState) {
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
        change5Color = function(rgba, lightState) {
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
        change6Color = function(rgba, lightState) {
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
        clearTimeout(timerId);
        timerId = setTimeout(dataReload);
    }
}
//функция срабатывает при изменении выбора уставки температуры кондиционера
function changeSetPoint(){
    console.log("onchange");
}
//функция меняет картинку включателя света в зависимости от его состояния
function lightImgSwitcher(room, state){
    let lightSwitcher = document.getElementById("light" + room + "on");
    if (state == true) {
        lightSwitcher.setAttribute("src", "static/images/lightOff.png");
    } else {
        lightSwitcher.setAttribute("src", "static/images/lightOn.png");
    }
}
//функция по клику на кнопку 1
function onClick1LightButton() {
    if (light1switch == false) {
        light1switch = true;
    }
    else {
        light1switch = false;
    }
    lightImgSwitcher(1, light1switch);
    lastPressedButton = 1;
    changeLightButtonState();
}
//функция по клику на кнопку 2
function onClick2LightButton() {
    if (light2switch == false) {
        light2switch = true;
    }
    else {
        light2switch = false;
    }
    lightImgSwitcher(2, light2switch);
    lastPressedButton = 2;
    changeLightButtonState();
}
//функция по клику на кнопку 3
function onClick3LightButton() {
    if (light3switch == false) {
        light3switch = true;
    }
    else {
        light3switch = false;
    }
    lightImgSwitcher(3, light3switch);
    lastPressedButton = 3;
    changeLightButtonState();
}
//функция по клику на кнопку 4
function onClick4LightButton() {
    if (light4switch == false) {
        light4switch = true;
    }
    else {
        light4switch = false;
    }
    lightImgSwitcher(4, light4switch);
    lastPressedButton = 4;
    changeLightButtonState();
}
//функция по клику на кнопку 5
function onClick5LightButton() {
    if (light5switch == false) {
        light5switch = true;
    }
    else {
        light5switch = false;
    }
    lightImgSwitcher(5, light5switch);
    lastPressedButton = 5;
    changeLightButtonState();
}
//функция по клику на кнопку 6
function onClick6LightButton() {
    if (light6switch == false) {
        light6switch = true;
    }
    else {
        light6switch = false;
    }
    lightImgSwitcher(6, light6switch);
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
    if (conditionerSwitch == false) {
        conditionerSwitch = true;
        conditionerButtonImg.setAttribute("src", "static/images/red_button.png");
    }
    else {
        conditionerSwitch = false;
        conditionerButtonImg.setAttribute("src", "static/images/blue_button.png");
    }
    changeLightButtonState();
}
//функция меняет изображение включенной кнопки
function conditionerButtonImgSwitcher(){
    let conditionerButtonImg = document.getElementById("conditOn");
    if (conditionerSwitch == false) {
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
        data: {light1switch: light1switch, light2switch: light2switch, light3switch: light3switch, light4switch:
            light4switch, light5switch: light5switch, light6switch: light6switch, conditionerSwitch: conditionerSwitch},
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
                change1Color(new1Color, light1switch);
            } else if (lastPressedButton == 2){
                lastPressedButton = 0;
                change2Color(new2Color, light2switch);
            } else if (lastPressedButton == 3){
                lastPressedButton = 0;
                change3Color(new3Color, light3switch);
            } else if (lastPressedButton == 4){
                lastPressedButton = 0;
                change4Color(new4Color, light4switch);
            } else if (lastPressedButton == 5){
                lastPressedButton = 0;
                change5Color(new5Color, light5switch);
            } else if (lastPressedButton == 6){
                lastPressedButton = 0;
                change6Color(new6Color, light6switch);
            }
        }
    })
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
            clearTimeout(timerId);


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

            if (firstStart == true) {
                firstStart = false;
                let lightSwitchArray = [new1lightState, new2lightState, new3lightState, new4lightState, new5lightState,
                                        new6lightState];
                for(let i=0; i<6; i++){
                    lightImgSwitcher(i+1, lightSwitchArray[i]);
                }
            }


            if (newConditionerState != conditionerSwitch) {
                conditionerSwitch = newConditionerState;
                conditionerButtonImgSwitcher();
                runConditioner();
            }

            if ((new1temperature != old1temperature) || (new1lightState != light1switch)) {
                change1Color(new1Color, new1lightState);
                changeTemperature(new1temperature, 1);
                old1temperature = new1temperature;
                light1switch = new1lightState;
            }

            if ((new2temperature != old2temperature) || (new2lightState != light2switch)) {
                change2Color(new2Color, new2lightState);
                changeTemperature(new2temperature, 2);
                old2temperature = new2temperature;
                light2switch = new2lightState;
            }

            if ((new3temperature != old3temperature) || (new3lightState != light3switch)) {
                change3Color(new3Color, new3lightState);
                changeTemperature(new3temperature, 3);
                old3temperature = new3temperature;
                light3switch = new3lightState;
            }

            if ((new4temperature != old4temperature) || (new4lightState != light4switch)) {
                change4Color(new4Color, new4lightState);
                changeTemperature(new4temperature, 4);
                old4temperature = new4temperature;
                light4switch = new4lightState;
            }

            if ((new5temperature != old5temperature) || (new5lightState != light5switch)) {
                change5Color(new5Color, new5lightState);
                changeTemperature(new5temperature, 5);
                old5temperature = new5temperature;
                light5switch = new5lightState;
            }

            if ((new6temperature != old6temperature) || (new6lightState != light6switch)) {
                change6Color(new6Color, new6lightState);
                changeTemperature(new6temperature, 6);
                old6temperature = new6temperature;
                light6switch = new6lightState;
            }
            timerId = setTimeout(dataReload, 10000);
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
    if (conditionerSwitch == true) {
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
    img.setAttribute("src", light1modes);
})

$("body").on("click", "#light1handMode", function () {
    let lightSwitcher = document.getElementById("light1on");
    if (light1switch == true) {
        lightSwitcher.setAttribute("src", "static/images/lightOff.png");
    } else {
        lightSwitcher.setAttribute("src", "static/images/lightOn.png");
    }
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    light1modes = "static/images/lightModeHand.png";
    })

$("#light1owmMode").hover(function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", light1modes);
})

$("body").on("click", "#light1owmMode", function () {
    let lightSwitcher = document.getElementById("light1on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    light1modes = "static/images/lightModeOWM.png";
    })

$("#light1sheduleMode").hover(function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", light1modes);
})

$("body").on("click", "#light1sheduleMode", function () {
    let lightSwitcher = document.getElementById("light1on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    light1modes = "static/images/lightModeShedule.png";
    })


$("#light2handMode").hover(function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", light2modes);
})

$("body").on("click", "#light2handMode", function () {
    let lightSwitcher = document.getElementById("light2on");
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    light2modes = "static/images/lightModeHand.png";
    })

$("#light2owmMode").hover(function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", light2modes);
})

$("body").on("click", "#light2owmMode", function () {
    let lightSwitcher = document.getElementById("light2on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    light2modes = "static/images/lightModeOWM.png";
    })

$("#light2sheduleMode").hover(function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", light2modes);
})

$("body").on("click", "#light2sheduleMode", function () {
    let lightSwitcher = document.getElementById("light2on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light2modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    light2modes = "static/images/lightModeShedule.png";
    })


$("#light3handMode").hover(function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", light3modes);
})

$("body").on("click", "#light3handMode", function () {
    let lightSwitcher = document.getElementById("light3on");
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    light3modes = "static/images/lightModeHand.png";
    })

$("#light3owmMode").hover(function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", light3modes);
})

$("body").on("click", "#light3owmMode", function () {
    let lightSwitcher = document.getElementById("light3on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    light3modes = "static/images/lightModeOWM.png";
    })

$("#light3sheduleMode").hover(function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", light3modes);
})

$("body").on("click", "#light3sheduleMode", function () {
    let lightSwitcher = document.getElementById("light3on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light3modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    light3modes = "static/images/lightModeShedule.png";
    })


$("#light4handMode").hover(function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", light4modes);
})

$("body").on("click", "#light4handMode", function () {
    let lightSwitcher = document.getElementById("light4on");
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    light4modes = "static/images/lightModeHand.png";
    })

$("#light4owmMode").hover(function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", light4modes);
})

$("body").on("click", "#light4owmMode", function () {
    let lightSwitcher = document.getElementById("light4on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    light4modes = "static/images/lightModeOWM.png";
    })

$("#light4sheduleMode").hover(function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", light4modes);
})

$("body").on("click", "#light4sheduleMode", function () {
    let lightSwitcher = document.getElementById("light4on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light4modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    light4modes = "static/images/lightModeShedule.png";
    })


$("#light5handMode").hover(function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", light5modes);
})

$("body").on("click", "#light5handMode", function () {
    let lightSwitcher = document.getElementById("light5on");
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    light5modes = "static/images/lightModeHand.png";
    })

$("#light5owmMode").hover(function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", light5modes);
})

$("body").on("click", "#light5owmMode", function () {
    let lightSwitcher = document.getElementById("light5on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    light5modes = "static/images/lightModeOWM.png";
    })

$("#light5sheduleMode").hover(function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", light5modes);
})

$("body").on("click", "#light5sheduleMode", function () {
    let lightSwitcher = document.getElementById("light5on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light5modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    light5modes = "static/images/lightModeShedule.png";
    })


$("#light6handMode").hover(function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", light6modes);
})

$("body").on("click", "#light6handMode", function () {
    let lightSwitcher = document.getElementById("light6on");
    lightSwitcher.removeAttribute("disabled");
    lightSwitcher.removeAttribute("class");
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
    light6modes = "static/images/lightModeHand.png";
    })

$("#light6owmMode").hover(function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
}, function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", light6modes);
})

$("body").on("click", "#light6owmMode", function () {
    let lightSwitcher = document.getElementById("light6on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeOWM.png");
    light6modes = "static/images/lightModeOWM.png";
    })

$("#light6sheduleMode").hover(function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
}, function () {
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", light6modes);
})

$("body").on("click", "#light6sheduleMode", function () {
    let lightSwitcher = document.getElementById("light6on");
    lightSwitcher.setAttribute("disabled", "True");
    lightSwitcher.setAttribute("class", "switchOpacity");
    let img = document.getElementById("light6modeId");
    img.setAttribute("src", "static/images/lightModeShedule.png");
    light6modes = "static/images/lightModeShedule.png";
    })


$("#conditHandMode").hover(function () {
    let img = document.getElementById("conditionerModeId");
    img.setAttribute("src", "static/images/conditionerHandMode.png");
}, function () {
    let img = document.getElementById("conditionerModeId");
    img.setAttribute("src", conditionerModes);
})

$("body").on("click", "#conditHandMode", function () {
    let conditionerSp = document.getElementById("tempSP");
    conditionerSp.setAttribute("disabled", "True");
    conditionerSp.setAttribute("class", "selectOpacity");
    let conditionerSwitcher = document.getElementById("conditOn");
    if (conditionerSwitch == false) {
        conditionerSwitcher.setAttribute("src", "static/images/blue_button.png");
    }
    else {
        conditionerSwitcher.setAttribute("src", "static/images/red_button.png");
    }
    conditionerSwitcher.removeAttribute("disabled");
    conditionerSwitcher.removeAttribute("class");
    let img = document.getElementById("conditionerModeId");
    img.setAttribute("src", "static/images/conditionerHandMode.png");
    conditionerModes = "static/images/conditionerHandMode.png";
    })

$("#conditSpMode").hover(function () {
    let img = document.getElementById("conditionerModeId");
    img.setAttribute("src", "static/images/conditionerSpMode.png");
}, function () {
    let img = document.getElementById("conditionerModeId");
    img.setAttribute("src", conditionerModes);
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
    conditionerModes = "static/images/conditionerSpMode.png";
    })
