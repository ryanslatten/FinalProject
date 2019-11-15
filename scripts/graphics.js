var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);
keys = [];
control = 1, invert = 0, firemode = 1;
screenstate = 0;
transitiondir = 2, flashy = 1;
game = new gameObj, player = new playerObj;

function startScreen(x) {
    background(abs(255*invert-71), abs(255*invert - 71), abs(255*invert -71));
    fill(abs(255*invert -150*flashy), abs(255*invert -150*flashy), abs(255*invert -25));
    textSize(50);
    text("Bool's Realm", 60-x, 80);
    fill(abs(255*invert -255), abs(255*invert -255), abs(255*invert -255));
    textSize(30);
    text("START GAME", 100-x, 240);
    text("OPTIONS", 135-x,300);
    textSize(15);
    text("Ryan Slatten", 10-x, 380);
    if (flashy > 1) {
        flashy -= 1;
    }
};

function optionsScreen(x) {
    fill(abs(255*invert -255), abs(255*invert -255), abs(255*invert -255));
    textSize(25);
    text("Controls:", 100+x, 50);
    if (control < 0) {
        text("ARROWS", 220+x, 50);
    } else {
        text("WASD", 220+x, 50);
    }
    text("Invert Colors:", 50+x, 100);
    if (invert) {
        text("YES", 230+x, 100);
    } else {
        text(" NO", 230+x, 100);
    }
    text("Fire Mode:", 80+x, 150);
    if (firemode > 0) {
        text("MOUSE", 220+x, 150);
    } else {
        text("SPACE", 220+x, 150);
    }
    text("Main Menu", 135+x, 300);
};

function overScreen() {

};

draw = function() {
    if (screenstate === 1) {
        // Begin Game
        background(5,5,5);

    } else if (screenstate === 0) {
        startScreen(transitiondir);
    } else if (screenstate === -1) {
        background(abs(255*invert-71), abs(255*invert - 71), abs(255*invert -71));
        optionsScreen(transitiondir);
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
        overScreen();
    }
};

mousePressed = function() {
    if (screenstate === 1) {
        if (control > 0) {
            // Fire bullet
        }
    } else if (screenstate === -1) {
        if (mouseX > 220 && mouseX < 330 && mouseY > 30 && mouseY < 60) {
            control *= -1;
        } else if (mouseX > 230 && mouseX < 280 && mouseY > 80 && mouseY < 110) {
            if(invert === 1) {
                invert = 0;
            } else {
                invert = 1;
            }
        } else if (mouseX > 220 && mouseX < 330 && mouseY > 130 && mouseY < 160) {
            firemode *= -1;
        } else if (mouseX > 130 && mouseX < 270 && mouseY > 280 && mouseY < 305) {
            screenstate = -2;
        }
    } else if (screenstate === 0) {
        if (mouseX > 100 && mouseX < 290 && mouseY > 220 && mouseY < 240) {
            //screenstate = 1;
        } else if (mouseX > 130 && mouseX < 270 && mouseY > 280 && mouseY < 305) {
            screenstate = -2;
        } else if (mouseX > 30 && mouseX < 360 && mouseY > 40 && mouseY < 90) {
            if (flashy < 4) {
               flashy *= 15; 
            }
        }
    } else if (screenstate === -3) {
        player = new playerObj;
        game.reset();
        screenstate = 0;
    }
};

keyPressed = function() {
    keys[keyCode] = 1;
};

keyReleased = function() {
    keys[keyCode] = 0;
};

mouseScrolled = function() {
    screentate = -2;
};
}};