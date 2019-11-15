playerObj = function(x,y) {
    this.pos = new PVector(x,y);
    this.dir = 0;
};

playerObj.prototype.move = function(direction) {
    move = new PVector(cos(direction)/2,sin(direction)/2);
    this.pos.add(move);
};

playerObj.prototype.draw = function() {

};

minionObj = function(x,y) {
    this.pos = new PVector(x,y);
    this.dir = 0;
};

minionObj.prototype.move = function(direction) {

};

minionObj.prototype.draw = function() {

};

bossObj = function(x,y) {
    this.x = x;
    this.y = y;


};

bossObj.prototype.move = function(direction) {

};

bossObj.prototype.draw = function(direction) {

};