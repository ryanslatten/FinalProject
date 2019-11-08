var playerObj = function(x,y) {
    this.pos = new PVector(x,y);
    this.dir = 0;
};

playerObj.prototype.move = function(direction) {
    move = new PVector(cos(direction)/2,sin(direction)/2);
    this.pos.add(move);
};

playerObj.prototype.draw = function() {

};

var minionObj = function(x,y) {
    this.pos = new PVector(x,y);
    this.dir = 0;
};

minionObj.prototype.move = function(direction) {

};

var bossObj = function(x,y) {
    this.x = x;
    this.y = y;


};

var gameObj = function() {
    this.player = new playerObj();
    this.minions = [];
};