var increasing = true;
var size = 1;
var shoot = false;

function startGame() {
    myGameArea.start();
    ball = new component(20, 20, 'white', 10, 240)
    hole = new component(30, 30, 'green', 950, 240)
    wall = new component(100, 300, 'black', 500, 0)
    power = new component(200, 50, 'black', 800, 450)
    slide = new component(2, 49, 'blue', 801, 451)
    aim = new component (5, 100, 'white', (ball.x + 7.5), (ball.y + 10))
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
    this.bounce = 0;
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
        if (shoot == true && (this.speedX > 0.3 || this.speedX < 0.2)) {
            this.x += this.speedX;
            if (this.speedX > 0) {
                this.speedX -= .2;
            } else if (this.speedX < 0) {
                this.speedX += .3;
            } else {
                this.speedX = 0;
            }
        } else {
            shoot = false
            this.speedX =0;
        }
    }
    this.collide = function(wall) {
        var ballLeft = this.x;
        var ballRight = this. x + this.width;
        var ballTop = this.y + this.height;
        var ballBottom = this.y;
        var wallLeft = wall.x;
        var wallRight = wall.x + wall.width;
        var wallTop = wall.y;
        var wallBottom = wall.y + wall.height;
        var crash = true;

        if ((ballBottom < wallTop) || (ballTop > wallBottom) || (ballRight < wallLeft) || (ballLeft > wallRight)) {
            crash = false;
        } 
        return crash;
    }
    this.boundary = function(wall) {
        var ballLeft = this.x;
        var ballRight = this. x + this.width;
        var ballTop = this.y + this.height;
        var ballBottom = this.y;
        var wallLeft = 0 + this.width;
        var wallRight = wall.width;
        var wallTop = wall.height;
        var wallBottom = 0 + this.width;
        var crash = true;

        if ((ballBottom > wallTop) || (ballTop < wallBottom) || (ballRight > wallLeft) || (ballLeft < wallRight)) {
            crash = false;
        } 
        return crash;
    }
  }

function updateGameArea() {
    myGameArea.clear();
    if (ball.collide(wall) || ball.boundary(myGameArea)) {
        ball.speedX = ball.speedX * -1;
        ball.speedY = ball.speedY * -1;
    }
    if (ball.collide(hole)) {
        console.log('You Win!')
    }
    ball.newPos();
    ball.update();
    hole.update();
    wall.update();
    power.update();
    slide.slideUpdate();
    aim.update();
}

function takeShot() {
    if (ball.speedX == 0) {
        ball.speedX += size / 10; 
        shoot = true;
    } 
}

document.addEventListener('keypress', event => {
    if (event.code == 'Space') {
      takeShot();
    }
  })