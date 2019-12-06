//  *HOW GAME IS DESIGNED*  \\
// The players goal is to find the exit to each level and raise their score defeating enemies and finding treasures
// The game starts at level 1 and can either go on forever or stop at level 10
// each level is a 10x10 grid of blocks and each block is a 20x20 space and each space is 40x40 pixels
// each map has a starting room, an exit room, and a path between them
// the room types are boss, normal, and treasure
// normal rooms hold regular minions to fight. Common
// boss rooms hold a boss that is difficult to defeat but grants a reward. Uncommon
// treasure rooms hold a reward for the player. Rare
// all rooms must be connected with a pathway
// there can be multiple paths to an exit, and there can be multiple paths in a row
// s is the starting room, . is empty space, r is a room, p is a pathway, and e is the exit room

var sketchProc=function(processingInstance){ with (processingInstance){
size(600, 600); 
frameRate(60);

/* 
    @pjs preload=
        'data/title.png',
        'data/snowman.png',
        'data/pRightFace.png',
        'data/gobblerMan.png'; 
*/

// Images:
var playerImg = loadImage('data/title.png');
var minion1Img = loadImage('data/pRightFace.png');
var minion2Img = loadImage('data/snowman.png');
var minion3Img = loadImage('data/gobblerMan.png');

// Global variables:
var keys = [];
var control = 1, invert = 0, leveltype = 1;
var over = false, score = 0, level = 1;
var transitiondir = 2, flashy = 1, transparent = 0;
var gamex = 0, gamey = 0;
var screenstate = 0;
var player, minions = [], bosses = [], bullets = [], treasures = [];
var walls = [], grounds = [], exitLoc;

/* Game objects and functions */

var checkWalls = function(xpos,ypos,xdir,ydir) {
    for(var i = 0; i < walls.length; i++) {
        if(xpos+xdir < walls[i].pos.x+40 && xpos+xdir + 40 > walls[i].pos.x &&
        ypos+ydir < walls[i].pos.y + 40 &&
        ypos+ydir + 40 > walls[i].pos.y) {
            return false;
        }
    }
    return true;
};

var playerObj = function(x,y) {
    this.pos = new PVector(x,y);
    this.dir = 0;
    this.health = 100;
    this.atExit = false;
};

playerObj.prototype = {
    move : function() {
        if(control === 1) {
            if (keys[87] === 1) {
                if(checkWalls(this.pos.x,this.pos.y,0,-8)) {
                    this.pos.y -= 8;
                }
            }
            if (keys[83] === 1) {
                if(checkWalls(this.pos.x,this.pos.y,0,8)) {
                    this.pos.y += 8;
                }
            }
            if (keys[65] === 1) {
                if(checkWalls(this.pos.x,this.pos.y,-8,0)) {
                    this.pos.x -= 8;
                }
            }
            if (keys[68] === 1) {
                if(checkWalls(this.pos.x,this.pos.y,8,0)) {
                    this.pos.x += 8;
                }
            }
        } else {
            if (keys[38] === 1) {
                if(checkWalls(this.pos.x,this.pos.y,0,-8)) {
                    this.pos.y -= 8;
                }
            } 
            if (keys[40] === 1) {
                if(checkWalls(this.pos.x,this.pos.y,0,8)) {
                    this.pos.y += 8;
                }
            }
            if (keys[37] === 1) {
                if(checkWalls(this.pos.x,this.pos.y,-8,0)) {
                    this.pos.x -= 8;
                }
            }
            if (keys[39] === 1) {
                if(checkWalls(this.pos.x,this.pos.y,8,0)) {
                    this.pos.x += 8;
                }
            }
        }
        gamex = this.pos.x - 200;
        gamey = this.pos.y - 200;
        if (gamex < 0) {
            gamex = 0;
        } else if (gamex > 8000) {
            gamex = 7800;
        }
        if (gamey < 0) {
            gamey = 0;
        } else if (gamey > 8000) {
            gamey = 7800;
        }
    },

    draw : function() {
        image(playerImg, this.pos.x, this.pos.y, 40,40);
    }
};

var bulletObj = function(x,y,direction) {
    this.pos = new PVector(x,y);
    this.v = new PVector(cos(direction)*5,sin(direction)*5);
};

bulletObj.prototype = {
    move : function() {
        this.pos.add(this.v);
        if(checkWalls(this.pos.x, this.pos.y,0,0)) {
            return 1;
        }
        return 0;
    },
    draw : function() {
        fill(255*invert-84, 255*invert-80, 255*invert-80, 170);
        ellipse(200,200,13,13);
        fill(255*invert-255, 255*invert-0, 255*invert-0,210);
        ellipse(200,200,10,10);
    }
};

var minionObj = function(x,y) {
    this.pos = new PVector(x,y);
    this.dir = 0;
};

minionObj.prototype = {
    action : function() {

    },
    draw : function() {
        var x = random();
        if (x < 0.33) {
            image(minion1Img,this.pos.x,this.pos.y,40,40);
        } else if (x < 0.66) {
            image(minion2Img,this.pos.x,this.pos.y,40,40);
        } else {
            image(minion3Img,this.pos.x,this.pos.y,40,40);
        }
    }
};

var bossObj = function(x,y) {
    this.x = x;
    this.y = y;
};

bossObj.prototype = {
    action : function() {

    },
    draw : function() {

    }
};

var treasureObj = function(x,y) {

};

treasureObj.prototype = {

};

var wallObj = function(x,y) {
    this.pos = new PVector(x,y);
};

wallObj.prototype = {
    draw : function() {
        noStroke();
        fill(194,100,0);
        rect(this.pos.x,this.pos.y, 40,40);
        stroke(0,0,0);
    }
    
};
    
var groundObj = function(x,y) {
    this.pos = new PVector(x,y);
};

groundObj.prototype = {
    draw : function() {
        fill(255, 140, 0);
        rect(this.pos.x,this.pos.y,40,40);
    }
};

/* Map Objects and functions */

var sampleMap = [
    "....sprr..",
    "....p.....",
    "....r.....",
    "....p.....",
    "....r.....",
    "...pppr...",
    "....p.....",
    "....r.....",
    "....pp....",
    ".....e...."
];

var startObj = function(x,y,up,down,left,right) {
    player.pos.x = x+400;
    player.pos.y = y+400;
    var i;
    if (up === 1) {
        for (i = 5; i < 8; i++) {
            walls.push(new wallObj(x+i*40,y+200));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x+i*40,y+200));
        }
        for (i; i < 15; i++) {
            walls.push(new wallObj(x+i*40,y+200));
        }
        for (i = 0; i < 5; i++) {
            walls.push(new wallObj(x+280,y+i*40));
        }
        for (i = 0; i < 5; i++) {
            walls.push(new wallObj(x+480,y+i*40));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+320,y+i*40));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+360,y+i*40));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+400,y+i*40));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+440,y+i*40));
        }
    } else {
        for (i = 5; i < 15; i++) {
            walls.push(new wallObj(x+i*40,y+200));
        }
    }
    if (down === 1){
        for (i = 5; i < 8; i++) {
            walls.push(new wallObj(x+i*40,y+560));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x+i*40,y+560));
        }
        for (i; i < 15; i++) {
            walls.push(new wallObj(x+i*40,y+560));
        }
        for (i = 15; i < 20; i++) {
            walls.push(new wallObj(x+280,y+i*40));
        }
        for (i = 15; i < 20; i++) {
            walls.push(new wallObj(x+480,y+i*40));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+320,y+i*40));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+360,y+i*40));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+400,y+i*40));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+440,y+i*40));
        }
    } else {
        for (i = 5; i < 15; i++) {
            walls.push(new wallObj(x+i*40,y+560));
        }
    }
    if (left === 1){
        for (i = 5; i < 8; i++) {
            walls.push(new wallObj(x+200,y+i*40));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x+200,y+i*40));
        }
        for (i; i < 15; i++) {
            walls.push(new wallObj(x+200,y+i*40));
        
        for (i = 0; i < 5; i++) {
            walls.push(new wallObj(x+i*40,y+480));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+i*40,y+320));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+i*40,y+360));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+i*40,y+400));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+i*40,y+440));
        }}
        for (i = 0; i < 5; i++) {
            walls.push(new wallObj(x+i*40,y+280));
        }
    } else {
        for (i = 5; i < 15; i++) {
            walls.push(new wallObj(x+200,y+i*40));
        }
    }
    if (right === 1){
        for (i = 5; i < 8; i++) {
            walls.push(new wallObj(x+560,y+i*40));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x+560,y+i*40));
        }
        for (i; i < 15; i++) {
            walls.push(new wallObj(x+560,y+i*40));
        }
        for (i = 15; i < 20; i++) {
            walls.push(new wallObj(x+i*40,y+480));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+320));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+360));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+400));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+440));
        }
        for (i = 14; i < 20; i++) {
            walls.push(new wallObj(x+i*40,y+280));
        }
    } else {
        for (i = 5; i < 15; i++) {
            walls.push(new wallObj(x+560,y+i*40));
        }
    }
    for (var i = 6; i < 14; i++) {
        for (var j = 6; j < 14; j++) {
            grounds.push(new groundObj(x+j*40,y+i*40));
        }
    }
};

var pathObj = function(x,y,up,down,left,right) {
    var i;
    if (up === 1) {
        for (i = 0; i < 8; i++) {
            walls.push(new wallObj(x+280,y+i*40));
        }
        for (i = 0; i < 8; i++) {
            walls.push(new wallObj(x+480,y+i*40));
        }
        for (i = 0; i < 8; i++) {
            grounds.push(new groundObj(x+320,y+i*40));
        }
        for (i = 0; i < 8; i++) {
            grounds.push(new groundObj(x+360,y+i*40));
        }
        for (i = 0; i < 8; i++) {
            grounds.push(new groundObj(x+400,y+i*40));
        }
        for (i = 0; i < 8; i++) {
            grounds.push(new groundObj(x+440,y+i*40));
        }
    } else {
        for (i = 7; i < 13; i++) {
            walls.push(new wallObj(x+i*40,y+280));
        }
    }
    if (down === 1){
        for (i = 12; i < 20; i++) {
            walls.push(new wallObj(x+280,y+i*40));
        }
        for (i = 12; i < 20; i++) {
            walls.push(new wallObj(x+480,y+i*40));
        }
        for (i = 12; i < 20; i++) {
            grounds.push(new groundObj(x+320,y+i*40));
        }
        for (i = 12; i < 20; i++) {
            grounds.push(new groundObj(x+360,y+i*40));
        }
        for (i = 12; i < 20; i++) {
            grounds.push(new groundObj(x+400,y+i*40));
        }
        for (i = 12; i < 20; i++) {
            grounds.push(new groundObj(x+440,y+i*40));
        }
    } else {
        for (i = 7; i < 13; i++) {
            walls.push(new wallObj(x+i*40,y+480));
        }
    }
    if (left === 1){
        for (i = 0; i < 7; i++) {
            walls.push(new wallObj(x+i*40,y+280));
        }
        for (i = 0; i < 7; i++) {
            walls.push(new wallObj(x+i*40,y+480));
        }
        for (i = 0; i < 8; i++) {
            grounds.push(new groundObj(x+i*40,y+320));
        }
        for (i = 0; i < 8; i++) {
            grounds.push(new groundObj(x+i*40,y+360));
        }
        for (i = 0; i < 8; i++) {
            grounds.push(new groundObj(x+i*40,y+400));
        }
        for (i = 0; i < 8; i++) {
            grounds.push(new groundObj(x+i*40,y+440));
        }
    } else {
        for (i = 8; i < 12; i++) {
            walls.push(new wallObj(x+280,y+i*40));
        }
    }
    if (right === 1){
        for (i = 13; i < 20; i++) {
            walls.push(new wallObj(x+i*40,y+280));
        }
        for (i = 13; i < 20; i++) {
            walls.push(new wallObj(x+i*40,y+480));
        }
        for (i = 12; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+320));
        }
        for (i = 12; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+360));
        }
        for (i = 12; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+400));
        }
        for (i = 12; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+440));
        }
    } else {
        for (i = 8; i < 12; i++) {
            walls.push(new wallObj(x+480,y+i*40));
        }
    }
    grounds.push(new groundObj(x+320,y+320));
    grounds.push(new groundObj(x+320,y+360));
    grounds.push(new groundObj(x+320,y+400));
    grounds.push(new groundObj(x+320,y+440));
    grounds.push(new groundObj(x+360,y+320));
    grounds.push(new groundObj(x+360,y+360));
    grounds.push(new groundObj(x+360,y+400));
    grounds.push(new groundObj(x+360,y+440));
    grounds.push(new groundObj(x+400,y+320));
    grounds.push(new groundObj(x+400,y+360));
    grounds.push(new groundObj(x+400,y+400));
    grounds.push(new groundObj(x+400,y+440));
    grounds.push(new groundObj(x+440,y+320));
    grounds.push(new groundObj(x+440,y+360));
    grounds.push(new groundObj(x+440,y+400));
    grounds.push(new groundObj(x+440,y+440));
};

var roomObj = function(x,y,up,down,left,right) {
    this.type;
    var i;
    if (up === 1) {
        for (i = 0; i < 8; i++) {
            walls.push(new wallObj(x+i*40,y));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x+i*40,y));
        }
        for (i; i < 20; i++) {
            walls.push(new wallObj(x+i*40,y));
        }
    } else {
        for (i = 0; i < 20; i++) {
            walls.push(new wallObj(x+i*40,y));
        }
    }
    if (down === 1){
        for (i = 0; i < 8; i++) {
            walls.push(new wallObj(x+i*40,y+760));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x+i*40,y+760));
        }
        for (i; i < 20; i++) {
            walls.push(new wallObj(x+i*40,y+760));
        }
    } else {
        for (i = 0; i < 20; i++) {
            walls.push(new wallObj(x+i*40,y+760));
        }
    }
    if (left === 1){
        for (i = 0; i < 8; i++) {
            walls.push(new wallObj(x,y+i*40));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x,y+i*40));
        }
        for (i; i < 20; i++) {
            walls.push(new wallObj(x,y+i*40));
        }
    } else {
        for (i = 0; i < 20; i++) {
            walls.push(new wallObj(x,y+i*40));
        }
    }
    if (right === 1){
        for (i = 0; i < 8; i++) {
            walls.push(new wallObj(x+760,y+i*40));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x+760,y+i*40));
        }
        for (i; i < 20; i++) {
            walls.push(new wallObj(x+760,y+i*40));
        }
    } else {
        for (i = 0; i < 20; i++) {
            walls.push(new wallObj(x+760,y+i*40));
        }
    }
    for (var i = 1; i < 19; i++) {
        for (var j = 1; j < 19; j++) {
            grounds.push(new groundObj(x+j*40,y+i*40));
        }
    }
    var x = random();
    if (x < 0.1) {
        this.type = 'treasure';
    } else if (x < 0.35) {
        this.type = 'boss';
        x = random();
        if (x < 0.3) {
            bosses.push(new bossObj(x+200,y+200));
            bosses.push(new bossObj(x+250,y+200));
        } else {
            bosses.push(new bossObj(x+225,y+200));
        }
    } else {
        this.type = 'normal';
        x = floor(random(3,10));
        for (var i = 0; i < x; i++) {
            minions.push(new minionObj(x+150,y+200));
        }
    }
};

var exitObj = function(x,y,up,down,left,right) {
    exitLoc = new PVector(x+400,y+400);
    var i;
    if (up === 1) {
        for (i = 5; i < 8; i++) {
            walls.push(new wallObj(x+i*40,y+200));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x+i*40,y+200));
        }
        for (i; i < 15; i++) {
            walls.push(new wallObj(x+i*40,y+200));
        }
        for (i = 0; i < 5; i++) {
            walls.push(new wallObj(x+280,y+i*40));
        }
        for (i = 0; i < 5; i++) {
            walls.push(new wallObj(x+480,y+i*40));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+320,y+i*40));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+360,y+i*40));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+400,y+i*40));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+440,y+i*40));
        }
    } else {
        for (i = 5; i < 15; i++) {
            walls.push(new wallObj(x+i*40,y+200));
        }
    }
    if (down === 1){
        for (i = 5; i < 8; i++) {
            walls.push(new wallObj(x+i*40,y+560));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x+i*40,y+560));
        }
        for (i; i < 15; i++) {
            walls.push(new wallObj(x+i*40,y+560));
        }
        for (i = 15; i < 20; i++) {
            walls.push(new wallObj(x+280,y+i*40));
        }
        for (i = 15; i < 20; i++) {
            walls.push(new wallObj(x+480,y+i*40));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+320,y+i*40));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+360,y+i*40));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+400,y+i*40));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+440,y+i*40));
        }
    } else {
        for (i = 5; i < 15; i++) {
            walls.push(new wallObj(x+i*40,y+560));
        }
    }
    if (left === 1){
        for (i = 5; i < 8; i++) {
            walls.push(new wallObj(x+200,y+i*40));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x+200,y+i*40));
        }
        for (i; i < 15; i++) {
            walls.push(new wallObj(x+200,y+i*40));
        
        for (i = 0; i < 5; i++) {
            walls.push(new wallObj(x+i*40,y+480));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+i*40,y+320));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+i*40,y+360));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+i*40,y+400));
        }
        for (i = 0; i < 6; i++) {
            grounds.push(new groundObj(x+i*40,y+440));
        }}
        for (i = 0; i < 5; i++) {
            walls.push(new wallObj(x+i*40,y+280));
        }
    } else {
        for (i = 5; i < 15; i++) {
            walls.push(new wallObj(x+200,y+i*40));
        }
    }
    if (right === 1){
        for (i = 5; i < 8; i++) {
            walls.push(new wallObj(x+560,y+i*40));
        }
        for (i; i < 12; i++) {
            grounds.push(new groundObj(x+560,y+i*40));
        }
        for (i; i < 15; i++) {
            walls.push(new wallObj(x+560,y+i*40));
        }
        for (i = 15; i < 20; i++) {
            walls.push(new wallObj(x+i*40,y+480));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+320));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+360));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+400));
        }
        for (i = 14; i < 20; i++) {
            grounds.push(new groundObj(x+i*40,y+440));
        }
        for (i = 14; i < 20; i++) {
            walls.push(new wallObj(x+i*40,y+280));
        }
    } else {
        for (i = 5; i < 15; i++) {
            walls.push(new wallObj(x+560,y+i*40));
        }
    }
    for (var i = 6; i < 14; i++) {
        for (var j = 6; j < 14; j++) {
            grounds.push(new groundObj(x+j*40,y+i*40));
        }
    }
};

var exitDraw = function() {
    fill(255,0,0);
    rect(exitLoc.x-40,exitLoc.y-40,80,80);
};

var generateMap = function(tileMap) {
    for (var j = 0; j < tileMap.length; j++) {
        for (var i = 0; i < tileMap[j].length; i++) {
            var u = 0, d = 0, l = 0, r = 0;
            if (i > 0 && tileMap[j][i-1] != '.') { // left
                l = 1;
            }
            if (i < 9 && tileMap[j][i+1] != '.') { // right
                r = 1;
            }
            if (j > 0 && tileMap[j-1][i] != '.') { // up
                u = 1;
            }
            if (j < 9 && tileMap[j+1][i] != '.') { // down
                d = 1;
            }
            switch (tileMap[j][i]) {
                case 's': new startObj(i*800,j*800,u,d,l,r);
                    break;
                case 'p': new pathObj(i*800,j*800,u,d,l,r);
                    break;
                case 'r': new roomObj(i*800,j*800,u,d,l,r);
                    break;
                case 'e': new exitObj(i*800,j*800,u,d,l,r);
            }
        }
    }
};

var resetMap = function() {
    walls = [], grounds = [], minions = [], bosses = [], bullets = [], treasures = [];
};

/* Screen functions */

var startScreen = function(x) {
    background(abs(255*invert), abs(255*invert), abs(255*invert));
    image(playerImg, 20-x,150,360,360);
    fill(abs(255*invert -150*flashy), abs(255*invert -150*flashy), abs(255*invert -25), transparent);
    textSize(50);
    text("Bool's Realm", 160-x, 80);
    fill(abs(255*invert -255), abs(255*invert -255), abs(255*invert -255), transparent);
    textSize(30);
    text("START GAME", 200-x, 240);
    text("OPTIONS", 235-x,320);
    textSize(15);
    text("By Ryan Slatten", 10-x, 580);
    if (flashy > 1) {
        flashy -= 1;
    }
    noStroke();
    for(var i = 0; i < 3; i++) {
        fill(abs(255*invert),abs(255*invert),abs(255*invert),70+12*i);
        rect(100+transparent+i*6,0,600,600);
        fill(abs(255*invert),abs(255*invert),abs(255*invert),60+5*i);
        rect(0,transparent+i*6,600,300);
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
    background(abs(255*invert -25),abs(255*invert -25),abs(255*invert -25));
    fill(abs(255*invert -125),abs(255*invert -125),abs(255*invert -125));
    textSize(50);
    text("Game Over.",20,100);
    text("Score: "+score,40,200);
    textSize(35);
    text("Click anywhere to go back.", 80, 300);
};

/* Main functions and event listeners */

var update = function() {
    background(abs(255*invert -25),abs(255*invert -25),abs(255*invert -25));
    for (var i = 0; i < walls.length; i++) {
        walls[i].draw();
    }
    for (var i = 0; i < grounds.length; i++) {
        grounds[i].draw();
    }
    for (var i = 0; i < minions.length; i++) {
        minions[i].action();
        minions[i].draw();
    }
    for (var i = 0; i < bosses.length; i++) {
        bosses[i].action();
        bosses[i].draw();
    }
    exitDraw();
    player.move();
    player.draw();
    if(player.pos.dist(exitLoc) < 25) {
        level++;
        if (level === 11) {
            screenstate = -3;
        } else {
            resetMap();
            generateMap();
        }
    }
};

draw = function() {
    if (screenstate === 1) {
        pushMatrix();
        translate(-gamex,-gamey);
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
            bullets.push(new bulletObj(player.pos.x,player.pos.y,player.dir));
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
            if (mouseX > 200 && mouseX < 390 && mouseY > 220 && mouseY < 240) {
                player = new playerObj(0,0);
                generateMap(sampleMap);
                screenstate = 1;
            } else if (mouseX > 230 && mouseX < 370 && mouseY > 300 && mouseY < 325) {
                screenstate = -2;
            } else if (mouseX > 130 && mouseX < 460 && mouseY > 40 && mouseY < 90) {
                if (flashy < 4) {
                   flashy *= 15; 
                }
            }
        } else if (screenstate === -3) {
            player = new playerObj(0,0);
            resetMap();
            over = false, score = 0, level = 1;
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