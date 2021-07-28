
function draw() {
    var canvas = document.getElementById('appLayout');
    if (appLayout.getContext) {
        var ctx = appLayout.getContext('2d');

        //всё пространство
        ctx.fillStyle = 'rgb(50, 50, 50, 0.5)';
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
//        ctx.moveTo(550, 250);
//        ctx.lineTo(350, 250);
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
        ctx.fillStyle = 'rgb(32, 0, 255, 0.2)';
        ctx.fillRect(53, 53, 294, 144);
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(200,125,7+7*i,0,Math.PI*2,true);
            ctx.fill();
        }

        //прихожая - пространство комнаты 2
//        ctx.beginPath();
//        ctx.moveTo(350, 50);
//        ctx.lineTo(1100, 50);
//        ctx.lineTo(1100, 250);
//        ctx.lineTo(550, 250);
//        ctx.lineTo(550, 350);
//        ctx.lineTo(350, 350);
//        ctx.closePath();
        ctx.fillStyle = 'rgb(32, 0, 255, 0.2)';
//        ctx.fill();
        ctx.fillRect(353, 53, 744, 194);
        ctx.fillRect(353, 247, 195, 100);
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(725,150,9+9*i,0,Math.PI*2,true);
            ctx.fill();
        }

        //детская - пространство комнаты 3
        ctx.fillStyle = 'rgb(32, 0, 255, 0.2)';
        ctx.fillRect(1103, 53, 344, 594);
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(1275,350,17+17*i,0,Math.PI*2,true);
            ctx.fill();
        }

        //туалет - пространство комнаты 4
        ctx.fillStyle = 'rgb(32, 0, 255, 0.2)';
        ctx.fillRect(53, 203, 294, 144);
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(200,275,7+7*i,0,Math.PI*2,true);
            ctx.fill();
        }

        //кухня - пространство комнаты 5
        ctx.fillStyle = 'rgb(32, 0, 255, 0.2)';
        ctx.fillRect(53, 353, 494, 294);
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(300,500,14+14*i,0,Math.PI*2,true);
            ctx.fill();
        }

        //зал - пространство комнаты 6
        ctx.fillStyle = 'rgb(32, 0, 255, 0.2)';
        ctx.fillRect(553, 253, 544, 394);
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(825,450,19+19*i,0,Math.PI*2,true);
            ctx.fill();
        }

        change1Color = function(rgba) {
            ctx.clearRect(53, 53, 294, 144);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(53, 53, 294, 144);
            for (i=0;i<10;i++){
                ctx.beginPath();
                ctx.arc(200,125,7+7*i,0,Math.PI*2,true);
                ctx.fill();
            }
        }

        change2Color = function(rgba) {
            ctx.clearRect(353, 53, 744, 194);
            ctx.clearRect(353, 247, 195, 100);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(353, 53, 744, 194);
            ctx.fillRect(353, 247, 195, 100);
            for (i=0;i<10;i++){
                ctx.beginPath();
                ctx.arc(725,150,9+9*i,0,Math.PI*2,true);
                ctx.fill();
            }
        }

        change3Color = function(rgba) {
            ctx.clearRect(1103, 53, 344, 594);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(1103, 53, 344, 594);
            for (i=0;i<10;i++){
                ctx.beginPath();
                ctx.arc(1275,350,17+17*i,0,Math.PI*2,true);
                ctx.fill();
            }
        }

        change4Color = function(rgba) {
            ctx.clearRect(53, 203, 294, 144);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(53, 203, 294, 144);
            for (i=0;i<10;i++){
                ctx.beginPath();
                ctx.arc(200,275,7+7*i,0,Math.PI*2,true);
                ctx.fill();
            }
        }

        change5Color = function(rgba) {
            ctx.clearRect(53, 353, 494, 294);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(53, 353, 494, 294);
            for (i=0;i<10;i++){
                ctx.beginPath();
                ctx.arc(300,500,14+14*i,0,Math.PI*2,true);
                ctx.fill();
            }
        }

        change6Color = function(rgba) {
            ctx.clearRect(553, 253, 544, 394);
            ctx.fillStyle = 'rgb(' + rgba + ')';
            ctx.fillRect(553, 253, 544, 394);
            for (i=0;i<10;i++){
                ctx.beginPath();
                ctx.arc(825,450,19+19*i,0,Math.PI*2,true);
                ctx.fill();
            }
        }

        dataReload();

    }
}

let old1Color = "32, 0, 255, 0.2";
let old2Color = "32, 0, 255, 0.2";
let old3Color = "32, 0, 255, 0.2";
let old4Color = "32, 0, 255, 0.2";
let old5Color = "32, 0, 255, 0.2";
let old6Color = "32, 0, 255, 0.2";

let old1temperature = 15;
let old2temperature = 15;
let old3temperature = 15;
let old4temperature = 15;
let old5temperature = 15;
let old6temperature = 15;

function dataReload() {
    $.ajax({
        url: "getNewData",
        method: "GET",
        cache: false,
        dataType: "html",
        data: {},
        success: function(data) {
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

            if (new1Color != old1Color) {
                console.log("new1Color");
                change1Color(new1Color);
            }
            old1Color = new1Color;

            if (new2Color != old2Color) {
                console.log("new2Color");
                change2Color(new2Color);
            }
            old2Color = new2Color;

            if (new3Color != old3Color) {
                console.log("new3Color");
                change3Color(new3Color);
            }
            old3Color = new3Color;

            if (new4Color != old4Color) {
                console.log("new4Color");
                change4Color(new4Color);
            }
            old4Color = new4Color;

            if (new5Color != old5Color) {
                console.log("new5Color");
                change5Color(new5Color);
            }
            old5Color = new5Color;

            if (new6Color != old6Color) {
                console.log("new6Color");
                change6Color(new6Color);
            }
            old6Color = new6Color;

            if (new1temperature != old1temperature) changeTemperature(new1temperature, 1);
            old1temperature = new1temperature;

            if (new2temperature != old2temperature) changeTemperature(new2temperature, 2);
            old2temperature = new2temperature;

            if (new3temperature != old3temperature) changeTemperature(new3temperature, 3);
            old3temperature = new3temperature;

            if (new4temperature != old4temperature) changeTemperature(new4temperature, 4);
            old4temperature = new4temperature;

            if (new5temperature != old5temperature) changeTemperature(new5temperature, 5);
            old5temperature = new5temperature;

            if (new6temperature != old6temperature) changeTemperature(new6temperature, 6);
            old6temperature = new6temperature;

            setTimeout(dataReload, 5000);
        }
    })
}

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

function changeTemperature(temp, room) {
    let tempInRoom = document.getElementById("temp" + room + "now");
    tempInRoom.innerHTML = String(temp) + "&#176;C";
}

let light1modes = "static/images/lightModeHand.png";

$("#light1handMode").hover(function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", "static/images/lightModeHand.png");
}, function () {
    let img = document.getElementById("light1modeId");
    img.setAttribute("src", light1modes);
})

$("body").on("click", "#light1handMode", function () {
    let lightSwitcher = document.getElementById("light1on");
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


let light2modes = "static/images/lightModeHand.png";

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


let light3modes = "static/images/lightModeHand.png";

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


let light4modes = "static/images/lightModeHand.png";

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


let light5modes = "static/images/lightModeHand.png";

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


let light6modes = "static/images/lightModeHand.png";

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
