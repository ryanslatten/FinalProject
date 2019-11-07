var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);

var keys = [];
var control = 1;
var invert = 0;
var firemode = 1;
var screenstate = 0;
var transitiondir = 2;
var flashy = 1;
var game = new gameObj();
var player = new playerObj();

var startScreen = function(x) {
    background(abs(255*invert-71), abs(255*invert - 71), abs(255*invert -71));
    fill(abs(255*invert -150*flashy), abs(255*invert -150*flashy), abs(255*invert -25));
    textSize(50);
    text("\"Working Title\"", 40-x, 80);
    fill(abs(255*invert -255), abs(255*invert -255), abs(255*invert -255));
    textSize(30);
    text("START GAME", 100-x, 240);
    text("OPTIONS", 135-x,300);
    textSize(15);
    text("Ryan Slatten", 10-x, 380);
    if(flashy > 1) {
        flashy -= 1;
    }
};

var optionsScreen = function(x) {
    fill(abs(255*invert -255), abs(255*invert -255), abs(255*invert -255));
    textSize(25);
    text("Controls:", 100+x, 50);
    if(control < 0) {
        text("ARROWS", 220+x, 50);
    } else {
        text("WASD", 220+x, 50);
    }
    text("Invert Colors:", 50+x, 100);
    if(invert) {
        text("YES", 230+x, 100);
    } else {
        text(" NO", 230+x, 100);
    }
    text("Fire Mode:", 80+x, 150);
    if(firemode > 0) {
        text("MOUSE", 220+x, 150);
    } else {
        text("SPACE", 220+x, 150);
    }
    text("Main Menu", 135+x, 300);
};

draw = function() {
    if(screenstate === 1) {
        // Begin Game
    } else if(screenstate === 0) {
        startScreen(transitiondir);
    } else if(screenstate === -2) {
        if(transitiondir > 0) {
            if(transitiondir < 420) {
                startScreen(transitiondir);
                optionsScreen(400-transitiondir);
                transitiondir += 30;
            } else {
                transitiondir = -2;
                screenstate = -1;
            }
        } else {
            if(transitiondir > -420) {
                startScreen(transitiondir+400);
                optionsScreen(400-(transitiondir+400));
                transitiondir -= 30;
            } else {
                transitiondir = 2;
                screenstate = 0;
            }
        }
    } else {
        background(abs(255*invert-71), abs(255*invert - 71), abs(255*invert -71));
        optionsScreen(transitiondir);
    }
};

var mousePressed = function() {
    if(screenstate > 0) {
        // Begin Game
    } else if(screenstate < 0) {
        if(mouseX > 220 && mouseX < 330 && mouseY > 30 && mouseY < 60) {
        control *= -1;
    } else if(mouseX > 230 && mouseX < 280 && mouseY > 80 && mouseY < 110) {
        if(invert === 1) {
            invert = 0;
        } else {
            invert = 1;
        }
    } else if(mouseX > 220 && mouseX < 330 && mouseY > 130 && mouseY < 160) {
        firemode *= -1;
    } else if(mouseX > 130 && mouseX < 270 && mouseY > 280 && mouseY < 305) {
        screenstate = -2;
    }
    } else {
        if(screenstate === 0 && mouseX > 100 && mouseX < 290 && mouseY > 220 && mouseY < 240) {
        //screenstate = 1;
    } else if(mouseX > 130 && mouseX < 270 && mouseY > 280 && mouseY < 305) {
        screenstate = -2;
    } else if(mouseX > 30 && mouseX < 360 && mouseY > 40 && mouseY < 90) {
        if(flashy < 4) {
           flashy *= 15; 
        }
    }
    }
    if((screenstate === 0 || screenstate === -1) && mouseX > 130 && mouseX < 270 && mouseY > 280 && mouseY < 300) {
        screenstate = -2;
    }
};
var keyPressed = function() {
    keys[keyCode] = 1;
};
var keyReleased = function() {
    keys[keyCode] = 0;
};

var mouseScrolled = function() {
    noLoop();
};

}};