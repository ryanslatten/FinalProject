var playerObj = function(x,y) {
    this.x = x;
    this.y = y;

};

var minionObj = function(x,y) {
    this.x = x;
    this.y = y;

};

var bossObj = function(x,y) {
    this.x = x;
    this.y = y;


};

var gameObj = function() {
    this.player = new playerObj();
    this.minions = [];
};