// Initializing our global variables
var increasing = true; // Determines whether or not the shot meter is increasing
var size = 1; // Shows the current size of the shot meter
var shoot = false; // Determines whether or not a shot has or can be taken
var counter = 0 // This is the shot counter for the game

// This is from Jquery. It will run the function when the page is clicked
$(document).click(function() {
    startGame(); // Officially starts the Mini Golf game
    $("p").hide(); // Hides the instructional text once the game has been started
});

// This function starts the game and created all the components
function startGame() {
    myGameArea.start(); // Calls the start function from the myGameArea var
    ball = new component(20, 20, 'white', 10, 240) // Creates a new component that will be our ball
    hole = new component(30, 500, 'green', 970, 0) // Creates a new component that will be the hole or finish line
    wall = new component(100, 300, 'black', 500, 0) // Creates a new component that will be a wall or obstacle
    power = new component(200, 50, 'black', 800, 450) // Creates a new component that will be the frame for the power meter
    slide = new component(2, 49, 'blue', 801, 451) // Creates a new component that will be the moving power meter
}

// This is a global variable for our game area
var myGameArea = {
    canvas : document.createElement("canvas"), // Starts by creating a canvas for the game to be played on
    // This function sets up the canvas with the desired settings
    start : function() {
        this.canvas.width = 1000; // The width of the canvas
        this.canvas.height = 500; // The height of the canvas
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20); //Creates an interval that will update the game area
    },
    // This function completely clears the game area
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// This function creates and manages the components of the game
function component(width, height, color, x, y) {
    // General variables for all components
    this.width = width; // Sets the width of the component
    this.height = height; // Sets the height of the component
    this.x = x; // Sets the x position of the component
    this.y = y; // Sets the y position of the component
    this.speedX = 0; // Sets the current horizontal speed of the component
    this.speedY = 0; // Sets the current vertical speed of the component

    // Variables used by the shot meter
    this.size = 0; // Sets the size of the shot meter
    this.increasing = true; // Determines whether or not the shot meter is increasing or decreasing
    this.shoot = false; // Determines whether a shot has been or can be taken

    // This function will update the components in the game area
    this.update = function() { 
        ctx = myGameArea.context;
        ctx.fillStyle = color; // Sets the color of the component
        ctx.fillRect(this.x, this.y, this.width, this.height); // Puts the component in it's new position
    }
    //This function is similar to the update function, but has specific code for the shot meter
    this.slideUpdate = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        // This will only run if a shot has not been taken
        // The second statement will run when a shot cannot be taken
        if (shoot == false) {
            // These if and else ifs will determine whether or not the shot meter is still increasing or decreasing
            // It will the update it in the correct direction
            if (size <= 200 && increasing == true) {
                // Will increase the shot meter
                ctx.fillRect(this.x, this.y, (size += 4), this.height);
            } else if (size > 200 && increasing == true) {
                // Maxes out the shot meter and switches to decreasing
                ctx.fillRect(this.x, this.y, (size), this.height); 
                increasing = false;
                size = 199
            } else if (size > 0) {
                // Will decrease the shot meter
                ctx.fillRect(this.x, this.y, (size -= 4), this.height);
            } else {
                // Empties the shot meter and switches to increasing
                ctx.fillRect(this.x, this.y, (size), this.height);
                size = 1;
                increasing = true;
            }
        } else {
            // A shot has been taken and the shot meter stays where it's at
            ctx.fillRect(this.x, this.y, (size), this.height);
        }
    }
    // This function will update the balls position based on its speed
    this.newPos = function() {
        // Runs if the a shot has been taken and the ball is still moving
        if (shoot == true && (this.speedX > 0.3 || this.speedX < 0.2) && (this.speedY > 0.3 || this.speedY < 0.2)) {
            this.x += this.speedX; // Sets the x position to the speed of the ball
            this.y += this.speedY // Sets the y position to the speed of the ball

            // This group of if statements will decrease the x and y speed of the ball based on the direction it is moving
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
            // Runs when the ball is not moving anymore
            shoot = false
            this.speedX = 0;
            this.speedY = 0;
        }
    }
    // This function detects collisions of the ball with different components
    this.collide = function(wall) {
        // Creates a variable for each edge of the ball and other component
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

        // These if statements detect if there was a collision and which direction the bounce needs to be in
        if (ballBottom > boundaryBottom || ballTop < boundaryTop) {
            // The ball collided with a horizontal wall so revers the y speed
            return 1;
        } else if (ballLeft < boundaryLeft || ballRight > boundaryRight) {
            // The ball collided with a vertical wall so revers the x speed
            return 2;
        } else if (ballTop < wallBottom && ballRight > wallLeft && ballLeft < wallRight) {
            if (ballTop > 299) {
                // The ball collided with a horizontal wall so revers the y speed
                return 1;
            } else {
                // The ball collided with a vertical wall so revers the x speed
                return 2;
            }
        } else {
            // There was no collision so return 0
            return 0;
        }
    }
  }

// This function runs at every interval
function updateGameArea() {
        myGameArea.clear(); // Clears the game area

        // If there was a collision, the ball will change directions accordingly
        if (ball.collide(wall) == 1) { 
            ball.speedY = ball.speedY * -1;
        } else if (ball.collide(wall) == 2) {
            ball.speedX = ball.speedX * -1;
        } else if (ball.collide(hole) == 1 || ball.collide(hole) == 2) {
            // If the ball hit the finish line, send an alert
            alert("You Win!\nYou took " + counter + " shots!");
        }
        ball.newPos(); // Updates the position of the ball
        ball.update(); // Draw the ball in its new position
        hole.update(); // Draw the hole
        wall.update(); // Draw the wall
        power.update(); // Draw the box for the power meter
        slide.slideUpdate(); // Updates the power meter at its new size
}

// This function handles taking a shot
function takeShot() {
    // Makes sure that the ball is not moving
    if (ball.speedX == 0 && ball.speedY == 0) {
        ball.speedX += size / (Math.random() * 10 + 10); // Sets a random horizontal speed
        if (Math.random() < .5) {
            // Sets a 50% chance for which direction the ball will move
            ball.speedX *= -1;
        }
        ball.speedY += size / (Math.random() * 10 + 10);  // Sets a random horizontal speed
        if (Math.random() < .5) {
            // Sets a 50% chance for which direction the ball will move
            ball.speedY *= -1;
        }
        shoot = true; // Sets shoot to true
        counter = counter + 1; // Adds one to the shot counter
    } 
}

// Listens for the space bar to be clicked
document.addEventListener('keypress', event => {
    if (event.code == 'Space') {
      takeShot(); // Take a shot when space is pressed
    }
})