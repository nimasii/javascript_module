var increasing = true;
var size = 1;
var shoot = false;

function startGame() {
    myGameArea.start();
    ball = new component(20, 20, 'white', 10, 240)
    hole = new component(30, 30, 'green', 950, 240)
    wall = new component(100, 300, 'grey', 500, 0)
    power = new component(200, 50, 'grey', 800, 450)
    slide = new component(2, 49, 'blue', 801, 451)
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.size = 0;
    this.increasing = true;
    this.shoot = false;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.slideUpdate = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        if (shoot == false) {
            if (size <= 200 && increasing == true) {
                ctx.fillRect(this.x, this.y, (size += 4), this.height);
            } else if (size > 200 && increasing == true) {
                ctx.fillRect(this.x, this.y, (size), this.height);
                increasing = false;
                size = 199
            } else if (size > 0) {
                ctx.fillRect(this.x, this.y, (size -= 4), this.height);
            } else {
                ctx.fillRect(this.x, this.y, (size), this.height);
                size = 1;
                increasing = true;
            }
        } else {
            ctx.fillRect(this.x, this.y, (size), this.height);
        }
    }
    this.newPos = function() {
        if (shoot == true && ball.speedX > 0) {
            this.x += this.speedX;
            this.speedX -= .2;
            if (this.x < 0) {
                this.x = 0;
            }
        } else {
            shoot = false
        }
    }
    this.collide = function() {

    }
  }

function updateGameArea() {
    myGameArea.clear();
    ball.newPos();
    ball.update();
    hole.update();
    wall.update();
    power.update();
    slide.slideUpdate();
}

function takeShot() {
    ball.speedX += size / 10; 
    shoot = true;
}

document.addEventListener('keypress', event => {
    if (event.code == 'Space') {
      takeShot();
    }
  })