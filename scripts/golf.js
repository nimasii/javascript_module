var increasing = true;
var size = 1;
var shoot = false;
var start = false;

//$(document).ready(startGame());

function startGame() {
    myGameArea.start();
    ball = new component(20, 20, 'white', 10, 240)
    hole = new component(30, 500, 'green', 970, 0)
    wall = new component(100, 300, 'black', 500, 0)
    power = new component(200, 50, 'black', 800, 450)
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
        if (shoot == true && (this.speedX > 0.3 || this.speedX < 0.2) && (this.speedY > 0.3 || this.speedY < 0.2)) {
            this.x += this.speedX;
            this.y += this.speedY
            if (this.speedX > 0) {
                this.speedX -= .2;
            } else if (this.speedX < 0) {
                this.speedX += .3;
            } else {
                this.speedX = 0;
            }
            if (this.speedY > 0) {
                this.speedY -= .2;
            } else if (this.speedY < 0) {
                this.speedY += .3;
            } else {
                this.speedY = 0;
            }
        } else {
            shoot = false
            this.speedX = 0;
            this.speedY = 0;
        }
    }
    this.collide = function(wall) {
        var ballLeft = this.x;
        var ballRight = this. x + this.width;
        var ballTop = this.y;
        var ballBottom = this.y + this.height;
        var wallLeft = wall.x;
        var wallRight = wall.x + wall.width;
        var wallBottom = wall.y + wall.height;
        var wallTop = wall.y
        var boundaryLeft = 0;
        var boundaryRight = 1000;
        var boundaryTop = 0;
        var boundaryBottom = 500;

        if (ballBottom > boundaryBottom || ballTop < boundaryTop) {
            return 1;
        } else if (ballLeft < boundaryLeft || ballRight > boundaryRight) {
            return 2;
        } else if (ballTop < wallBottom && ballRight > wallLeft && ballLeft < wallRight) {
            if (ballTop > 299) {
                return 1;
            } else {
                return 2;
            }
        } else {
            return 0;
        }
    }
  }

function updateGameArea() {
        myGameArea.clear();
        if (ball.collide(wall) == 1) {
            ball.speedY = ball.speedY * -1;
        } else if (ball.collide(wall) == 2) {
            ball.speedX = ball.speedX * -1;
        } else if (ball.collide(hole) == 1 || ball.collide(hole) == 2) {
            alert("You Win!");
        }
        ball.newPos();
        ball.update();
        hole.update();
        wall.update();
        power.update();
        slide.slideUpdate();
}

function takeShot() {
    if (ball.speedX == 0 && ball.speedY == 0) {
        ball.speedX += size / (Math.random() * 10 + 10); 
        if (Math.random() < .5) {
            ball.speedX *= -1;
        }
        ball.speedY += size / (Math.random() * 10 + 10); 
        if (Math.random() < .5) {
            ball.speedY *= -1;
        }
        shoot = true;
    } 
}

document.addEventListener('keypress', event => {
    if (event.code == 'Space') {
      takeShot();
    }
})