var sketchProc=function(processingInstance){ with (processingInstance){
size(600, 600); 
frameRate(60);

keys = [];
control = 1;
invert = 0;
firemode = 1;
screenstate = 0;
transitiondir = 2;
flashy = 1;
game = new gameObj();
player = new playerObj();

var startScreen = function(x) {
    background(abs(255*invert-71), abs(255*invert - 71), abs(255*invert -71));
    fill(abs(255*invert -150*flashy), abs(255*invert -150*flashy), abs(255*invert -25));
    textSize(50);
    text("\"Working Title\"", 140-x, 80);
    fill(abs(255*invert -255), abs(255*invert -255), abs(255*invert -255));
    textSize(30);
    text("START GAME", 200-x, 240);
    text("OPTIONS", 235-x,300);
    textSize(15);
    text("Ryan Slatten", 10-x, 580);
    if (flashy > 1) {
        flashy -= 1;
    }
};

var optionsScreen = function(x) {
    fill(abs(255*invert -255), abs(255*invert -255), abs(255*invert -255));
    textSize(25);
    text("Controls:", 200+x, 50);
    if (control < 0) {
        text("ARROWS", 320+x, 50);
    } else {
        text("WASD", 320+x, 50);
    }
    text("Invert Colors:", 150+x, 100);
    if (invert) {
        text("YES", 330+x, 100);
    } else {
        text(" NO", 330+x, 100);
    }
    text("Fire Mode:", 180+x, 150);
    if (firemode > 0) {
        text("MOUSE", 320+x, 150);
    } else {
        text("SPACE", 320+x, 150);
    }
    text("Main Menu", 235+x, 300);
};

draw = function() {
    if (screenstate === 1) {
        // Begin Game
    } else if (screenstate === 0) {
        startScreen(transitiondir);
    } else if (screenstate === -2) {
        if (transitiondir > 0) {
            if (transitiondir < 620) {
                startScreen(transitiondir);
                optionsScreen(600-transitiondir);
                transitiondir += 140;
            } else {
                transitiondir = -2;
                screenstate = -1;
            }
        } else {
            if (transitiondir > -620) {
                startScreen(transitiondir+600);
                optionsScreen(600-(transitiondir+600));
                transitiondir -= 140;
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
    if (screenstate > 0) {
        if (control > 0) {
            // Fire bullet
        }
    } else if( screenstate < 0) {
        if (mouseX > 320 && mouseX < 430 && mouseY > 30 && mouseY < 60) {
        control *= -1;
    } else if (mouseX > 330 && mouseX < 380 && mouseY > 80 && mouseY < 110) {
        if(invert === 1) {
            invert = 0;
        } else {
            invert = 1;
        }
    } else if (mouseX > 320 && mouseX < 430 && mouseY > 130 && mouseY < 160) {
        firemode *= -1;
    } else if (mouseX > 230 && mouseX < 370 && mouseY > 280 && mouseY < 305) {
        screenstate = -2;
    }
    } else {
        if (screenstate === 0 && mouseX > 200 && mouseX < 390 && mouseY > 220 && mouseY < 240) {
            //screenstate = 1;
    } else if (mouseX > 230 && mouseX < 370 && mouseY > 280 && mouseY < 305) {
        screenstate = -2;
    } else if (mouseX > 130 && mouseX < 460 && mouseY > 40 && mouseY < 90) {
        if (flashy < 4) {
           flashy *= 15; 
        }
    }
    }
    if ((screenstate === 0 || screenstate === -1) && mouseX > 130 && mouseX < 270 && mouseY > 280 && mouseY < 300) {
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
    
};

}};