// each block is a 10x10 space
// each map has a starting room, an exit room, and a path between them
// the room types are boss, normal, and treasure
// normal rooms hold regular minions to fight. Common
// boss rooms hold a boss that is difficult to defeat but grants a reward. Uncommon
// treasure rooms hold a reward for the player. Rare
// all rooms must be connected with a pathway
// there can be multiple paths to an exit, and there can be multiple paths in a row
// s is the starting room
// . is empty space
// r is a room
// p is a pathway
// e is an exit room

class Map {

    constructor(width, height) {
        
    }

    
};

sampleMap = [
"....s.....",
"....p.....",
"....p.....",
"....r.....",
"bprppprpt.",
"....p.....",
"....r.....",
"....p.....",
"....p.....",
"....e....."
];

startObj = function(x,y,lvl) {

};

pathObj = function(x,y,lvl) {

};

roomObj = function(x,y,lvl) {
    var type = random();
    if (type < .05) {

    } else if (type < .2) {

    } else {

    }
};

exitObj = function(x,y,lvl) {

};

