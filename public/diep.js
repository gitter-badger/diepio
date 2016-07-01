//PJS
var sketchProc = function(processingInstance) {
    with(processingInstance) {
        size(window.innerWidth, window.innerHeight);
        frameRate(30);
        //Code Goes Here
        frameRate(30); //Set The Frame Rate
        /** World **/
        var world = {
            w: 2000,
            h: 2000,
        };
        var marginx = world.w - width / 2;
        var marginy = world.h - height / 2;
        /** Enemies **/
        var squares = [];
        var triangles = [];
        var pentagons = [];
        var Square = function(x, y) {
            this.pos = new PVector(x, y);
            this.r = 0;
        };
        Square.prototype.run = function() {
            this.display();
            this.update();
        };
        Square.prototype.display = function() {};
        Square.prototype.update = function() {};
        var Triangle = function(x, y) {
            this.pos = new PVector(x, y);
            this.r = 0;
        };
        Triangle.prototype.run = function() {
            this.display();
            this.update();
        };
        Triangle.prototype.display = function() {};
        Triangle.prototype.update = function() {};
        var Pentagon = function(x, y) {
            this.pos = new PVector(x, y);
            this.r = 0;
        };
        Pentagon.prototype.run = function() {
            this.display();
            this.update();
        };
        Pentagon.prototype.display = function() {};
        Pentagon.prototype.update = function() {};
        /** Player **/
        var keys = {};
        var keyPressed = function() {
            keys[keyCode] = true;
        };
        var keyReleased = function() {
            keys[keyCode] = false;
        };
        var Player = function(x, y) {
            this.pos = new PVector(x, y);
            this.w = 40;
            this.h = 40;
            this.speed = 5;
            this.pmx = 0;
            this.pmy = 0;
        };
        Player.prototype.run = function() {
            this.display();
            this.update();
        };
        Player.prototype.display = function() {
            stroke(62);
            strokeWeight(2.5);
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            rotate(atan2(mouseY - height / 2, mouseX - width / 2) -
                90);
            fill(153);
            rect(-8.75, 5, 17.5, 35);
            popMatrix();
            fill(0, 178, 225);
            ellipse(this.pos.x, this.pos.y, this.w, this.h);
        };
        Player.prototype.update = function() {
            if (keys[UP] && this.pos.y > 0) {
                this.pos.sub(0, this.speed);
                if (this.pos.y >= marginy && this.pos.y <= marginy +
                    this.pmy) {
                    this.pmy -= 5;
                }
            }
            if (keys[DOWN] && this.pos.y < world.h) {
                this.pos.add(0, this.speed);
                if (this.pos.y >= marginy + this.pmy) {
                    this.pmy += 5;
                }
            }
            if (keys[RIGHT] && this.pos.x < world.w) {
                this.pos.add(this.speed, 0);
                if (this.pos.x >= marginx + this.pmx) {
                    this.pmx += 5;
                }
            }
            if (keys[LEFT] && this.pos.x > 0) {
                this.pos.sub(this.speed, 0);
                if (this.pos.x >= marginx && this.pos.x <= marginx +
                    this.pmx) {
                    this.pmx -= 5;
                }
            }
            if (this.pos.x <= marginx) {
                this.pmx = 0;
            }
        };
        var player = new Player(world.w / 2, world.h / 2);
        /** Minimap **/
        var miniMap = function(x, y, x2, y2) {
            this.pos = new PVector(x, y);
            this.x = x2;
            this.y = y2;
        };
        miniMap.prototype.run = function() {
            this.display();
        };
        miniMap.prototype.display = function() {
            stroke(100);
            strokeWeight(5);
            fill(207, 207, 207, 200);
            rect(this.pos.x, this.pos.y, 125, 125);
            stroke(0, 139, 139);
            point(this.x, this.y);
            this.x = constrain(this.x, this.pos.x, this.pos.x + 125);
            this.y = constrain(this.y, this.pos.y, this.pos.y + 125);
        };
        var minimap = new miniMap(width - 135, height - 135, player.pos
            .x, player.pos.y);
        /** Map Camera **/
        var mapCamera = {
            pos: new PVector(player.pos.x, player.pos.y),
            right: -world.w,
            bottom: -world.h,
            ox: 0,
            oy: 0,
            run: function() {
                this.pos.x = constrain(this.pos.x + (width / 2 -
                        player.pos.x - this.pos.x) / 5,
                    this.right, 0);
                this.pos.y = constrain(this.pos.y + (height / 2 -
                        player.pos.y - this.pos.y) / 5,
                    this.bottom, 0);
                translate(this.pos.x, this.pos.y);
                translate(player.pmx, player.pmy);
            }
        };
        /** Draw Function **/
        var draw = function() {
            size(window.innerWidth, window.innerHeight);
            background(205); //Background Color
            pushMatrix();
            mapCamera.run(); //Map Camera
            stroke(179); //Grid Background this line and the next 7 lines
            strokeWeight(1);
            for (var w = 0; w < world.w; w += 22.5) {
                line(w, 0, w, world.w);
            }
            for (var h = 0; h < world.h; h += 22.5) {
                line(0, h, world.h, h);
            }
            player.run(); //The Player
            popMatrix();
            //minimap.run(); //Minimap
        };
    }
};
var canvas = document.getElementById("mycanvas");
var processingInstance = new Processing(canvas, sketchProc);
