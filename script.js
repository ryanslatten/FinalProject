//  *HOW GAME IS PLAYED*  \\
// The players goal is to find the exit to each level and raise their score defeating enemies and finding treasures
// The game starts at level 1 and can either go on forever or stop at level 10
// each level is a 10x10 block grid and each block is a 25x25 space
// each map has a starting room, an exit room, and a path between them
// the room types are boss, normal, and treasure
// normal rooms hold regular minions to fight. Common
// boss rooms hold a boss that is difficult to defeat but grants a reward. Uncommon
// treasure rooms hold a reward for the player. Rare
// all rooms must be connected with a pathway
// there can be multiple paths to an exit, and there can be multiple paths in a row
// s is the starting room, . is empty space, r is a room, p is a pathway, and e is the exit room

var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);
/* 
    @pjs preload=
        'data/title.png',
        'data/snowman.png',
        'data/pRightFace.png'
    ; 
*/

// Images:
var b = loadImage('data/title.png');

// Global variables:
var keys = [];
var control = 1, invert = 0, leveltype = 1;
var over = false, score = 0, level = 1;
var transitiondir = 2, flashy = 1, transparent = 0;
var gamex = 0, gamey = 0;
var screenstate = 0;
var walls = [], grounds = [];

var playerObj = function(x,y) {
    this.pos = new PVector(x,y);
    this.dir = 0;
    this.health = 100;
};

playerObj.prototype.move = function() {
    if(control === 1) {
        if (keys[87] === 1) {
            this.pos.y -= 4;
        } 
        if (keys[83] === 1) {
            this.pos.y += 4;
        }
        if (keys[65] === 1) {
            this.pos.x -= 4;
        }
        if (keys[68] === 1) {
            this.pos.x += 4;
        }
    } else {
        if (keys[38] === 1) {
            this.pos.y -= 4;
        } 
        if (keys[40] === 1) {
            this.pos.y += 4;
        }
        if (keys[37] === 1) {
            this.pos.x -= 4;
        }
        if (keys[39] === 1) {
            this.pos.x += 4;
        }
    }
    gamex = this.pos.x - 200;
    gamey = this.pos.y - 200;
    if (gamex < 0) {
        gamex = 0;
    } else if (gamex > 10000) {
        gamex = 9600;
    }
    if (gamey < 0) {
        gamey = 0;
    } else if (gamey > 10000) {
        gamey = 9600;
    }
};

playerObj.prototype.draw = function() {
    fill(39, 0, 196);
    ellipse(this.pos.x,this.pos.y,10,20);
};

var bulletObj = function(x,y,direction) {
    this.pos = new PVector(x,y);
    this.v = new PVector(cos(direction)*5,sin(direction)*5);
};

bulletObj.prototype.move = function() {
    this.pos.add(this.v);
};

bulletObj.prototype.draw = function() {
    fill(abs(255*invert-255),abs(255*invert-255),abs(255*invert-255));
    ellipse(this.pos.x,this.pos.y,3,3);
};

var minionObj = function(x,y) {
    this.pos = new PVector(x,y);
    this.dir = 0;
};

minionObj.prototype.action = function(direction) {

};

minionObj.prototype.draw = function() {
    
};

var bossObj = function(x,y) {
    this.x = x;
    this.y = y;
};

bossObj.prototype.action = function(direction) {

};

bossObj.prototype.draw = function(direction) {

};

var wallObj = function(x,y) {
    this.pos = new PVector(x,y);
};

wallObj.prototype.draw = function() {
    noStroke();
    fill(194,100,0);
    rect(this.pos.x,this.pos.y, 20,20);
    stroke(0,0,0);
};
    
var groundObj = function(x,y) {
    this.pos = new PVector(x,y);
};

groundObj.prototype.draw = function() {
    fill(255, 140, 0);
    rect(this.pos.x,this.pos.y,20,20);
};

var player = new playerObj(200,200);
var minions = [], bosses = [], bullets = [];

var sampleMap = [
    "......wwwwwwwwww......",
    "......wggggggggw......",
    "......wggggggggw......",
    "......wggggggggw......",
    "......wggggggggw......",
    "......wggggggggw......",
    "......wggggggggw......",
    "......wggggggggw......",
    "......wggggggggw......",
    "......wggggggggw......",
    "......wwwggggwww......",
    "......wwwggggwww......",
    "......wwwggggwww......",
    "......wwwggggwww......",
    "......wwwggggwww......",
    "......wwwggggwww......",
    "......wwwggggwww......",
    "......wwwggggwww......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wwggwwww......",
    "......wwggwwww......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wwwggwww......",
    "......wwwggwww......",
    "......wwwggwww......",
    "......wwwggwww......",
    "......wwwggwww......",
    "......wwwggwww......",
    "......wwwggwww......",
    "......wwwggwww......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wggggggw......",
    "......wwwwwwww......",
    ];
    
var initMap = function() {
    for (var j = 0; j < sampleMap.length; j++) {
        for (var i = 0; i < sampleMap[j].length; i++) {
            if (sampleMap[j][i] === "w") {
                walls.push(new wallObj(i*20,j*20));
            } else if (sampleMap[j][i] === 'g') {
                grounds.push(new groundObj(i*20,j*20));
            } 
        }
    }
};

var startScreen = function(x) {
    background(abs(255*invert), abs(255*invert), abs(255*invert));
    image(b, 20,150,360,360);
    fill(abs(255*invert -150*flashy), abs(255*invert -150*flashy), abs(255*invert -25), transparent);
    textSize(50);
    text("Bool's Realm", 60-x, 80);
    fill(abs(255*invert -255), abs(255*invert -255), abs(255*invert -255), transparent);
    textSize(30);
    text("START GAME", 100-x, 240);
    text("OPTIONS", 135-x,300);
    textSize(15);
    text("Ryan Slatten", 10-x, 380);
    if (flashy > 1) {
        flashy -= 1;
    }
    noStroke();
    for(var i = 0; i < 3; i++) {
        fill(abs(255*invert),abs(255*invert),abs(255*invert),70+12*i);
        rect(100+transparent+i*6,0,400,400);
        fill(abs(255*invert),abs(255*invert),abs(255*invert),60+5*i);
        rect(0,transparent+i*6,400,100);
    }
    stroke(0,0,0);
};

var optionsScreen = function(x) {
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
    text("Infinite Levels:", 40+x, 150);
    if (leveltype > 0) {
        text("OFF", 230+x, 150);
    } else {
        text("ON", 230+x, 150);
    }
    text("Main Menu", 135+x, 300);
};

var overScreen = function() {

};

var drawMap = function() {

};

var update = function() {
    background(abs(255*invert -25),abs(255*invert -25),abs(255*invert -25));
    for (var i = 0; i < walls.length; i++) {
        walls[i].draw();
    }
    for (i = 0; i < grounds.length; i++) {
        grounds[i].draw();
    }
    for (i = 0; i < minions.length; i++) {
        minions[i].action();
        minions[i].draw();
    }
    for (i = 0; i < bosses.length; i++) {
        bosses[i].action();
        bosses[i].draw();
    }
    for (i = 0; i < bullets.length; i++) {
        bullets[i].move();
        bullets[i].draw();
    }
    player.move();
    player.draw();
};

startObj = function(x,y) {
    this.walls = [];
    for (i = 0; i < 5; i++) {
        this.walls.push(new wallObj(x+i*20, y));
    }
    for(i = 0; i < 4; i++) {
        this.walls.push(new wallObj(x+180, y+i*20));
    }
    for(i = 0; i < 4; i++) {
        this.walls.push(new wallObj(x+i*20, y+180));
    }
    for(i = 0; i < 3; i++) {
        this.walls.push(new wallObj(x, y+i*20));
    }
};

startObj.prototype.draw = function() {
    
};

pathObj = function(x,y) {
    this.walls = [];
    
};

pathObj.prototype.draw = function() {
    
};

roomObj = function(x,y) {
    this.walls = [];
    for (i = 0; i < 10; i++) {
        this.walls.push(new wallObj(x+i*20, y));
    }
    for(i = 0; i < 9; i++) {
        this.walls.push(new wallObj(x+180, y+i*20));
    }
    for(i = 0; i < 9; i++) {
        this.walls.push(new wallObj(x+i*20, y+180));
    }
    for(i = 0; i < 8; i++) {
        this.walls.push(new wallObj(x, y+i*20));
    }
    var type = random();
    if (type < 0.1) { // treasure

    } else if (type < 0.3) { // boss

    } else { // normal

    }
};

roomObj.prototype.draw = function() {
    
};

exitObj = function(x,y) {
    this.walls = [];
};

exitObj.prototype.draw = function() {

};

draw = function() {
    if (screenstate === 1) {
        pushMatrix();
        translate(-gamex,-gamey);
        drawMap();
        update();
        popMatrix();
        if (over) {
            screenstate = -3;
        }
    } else if (screenstate === 0) {
        if(transparent < 255) {
            transparent+=1.5;
        }
        startScreen(transitiondir);
    } else if (screenstate === -1) {
        background(abs(255*invert), abs(255*invert), abs(255*invert));
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

var mousePressed = function() {
    if(transparent > 254) {
        if (screenstate === 1) {
            // Fire bullet
            
        } else if (screenstate === -1) {
            if (mouseX > 220 && mouseX < 330 && mouseY > 30 && mouseY < 60) {
                control *= -1;
            } else if (mouseX > 230 && mouseX < 280 && mouseY > 80 && mouseY < 110) {
                if(invert === 1) {
                    invert = 0;
                } else {
                    invert = 1;
                }
            } else if (mouseX > 230 && mouseX < 280 && mouseY > 130 && mouseY < 160) {
                leveltype *= -1;
            } else if (mouseX > 130 && mouseX < 270 && mouseY > 280 && mouseY < 305) {
                screenstate = -2;
            }
        } else if (screenstate === 0) {
            if (mouseX > 100 && mouseX < 290 && mouseY > 220 && mouseY < 240) {
                initMap();
                screenstate = 1;
            } else if (mouseX > 130 && mouseX < 270 && mouseY > 280 && mouseY < 305) {
                screenstate = -2;
            } else if (mouseX > 30 && mouseX < 360 && mouseY > 40 && mouseY < 90) {
                if (flashy < 4) {
                   flashy *= 15; 
                }
            }
        } else if (screenstate === -3) {
            var player = new playerObj(200,200);
            var minions = [], bosses = [];
            over = false;
            screenstate = 0;
        }
    }
};

var keyPressed = function() {
    keys[keyCode] = 1;
};

var keyReleased = function() {
    keys[keyCode] = 0;
};
}};