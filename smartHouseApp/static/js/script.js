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

        //ванная - пространство комнаты
        ctx.fillStyle = 'rgb(255, 0, 0, 0.2)';
        ctx.fillRect(50, 50, 300, 150);
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(200,125,7+7*i,0,Math.PI*2,true);
            ctx.fill();
        }


        //туалет - пространство комнаты
        ctx.fillStyle = 'rgb(0, 123, 123, 0.2)';
        ctx.fillRect(50, 200, 300, 150);
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(200,275,7+7*i,0,Math.PI*2,true);
            ctx.fill();
        }

        //кухня - пространство комнаты
        ctx.fillStyle = 'rgb(0, 255, 0, 0.2)';
        ctx.fillRect(50, 350, 500, 300);
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(300,500,14+14*i,0,Math.PI*2,true);
            ctx.fill();
        }

        //зал - пространство комнаты
        ctx.fillStyle = 'rgb(0, 0, 255, 0.2)';
        ctx.fillRect(550, 250, 550, 400);
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(825,450,19+19*i,0,Math.PI*2,true);
            ctx.fill();
        }

        //детская - пространство комнаты
        ctx.fillStyle = 'rgb(123, 0, 123, 0.2)';
        ctx.fillRect(1100, 50, 350, 600);
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(1275,350,17+17*i,0,Math.PI*2,true);
            ctx.fill();
        }

        //прихожая - пространство комнаты
        ctx.beginPath();
        ctx.moveTo(350, 50);
        ctx.lineTo(1100, 50);
        ctx.lineTo(1100, 250);
        ctx.lineTo(550, 250);
        ctx.lineTo(550, 350);
        ctx.lineTo(350, 350);
        ctx.closePath();
        ctx.fillStyle = 'rgb(123, 123, 0, 0.2)';
        ctx.fill();
        for (i=0;i<10;i++){
            ctx.beginPath();
            ctx.arc(725,150,9+9*i,0,Math.PI*2,true);
            ctx.fill();
        }
    }
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
