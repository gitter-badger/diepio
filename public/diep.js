//PJS
var sketchProc = function(processingInstance) {
    with(processingInstance) {
        size(window.innerWidth, window.innerHeight);

        frameRate(60); //Set The Frame Rate
        var startMS = millis();
        var lastMS = 0;

        /** World **/
        var world = {
            w: 6000,
            h: 6000,
        };
        var marginx = world.w - width / 2;
        var marginy = world.h - height / 2;

        /** Bullets **/
        var bullets = [];
        var Bullet = function(position, velocity, speed) {
            this.position = position;
            this.velocity = velocity;
            this.speed = speed;
            this.velocity.normalize();
            this.velocity.mult(this.speed);
        };
        Bullet.prototype.display = function() {
            stroke(85);
            strokeWeight(2.5);
            fill(241,78,84);
            ellipse(this.position.x, this.position.y, 20, 20);
        };
        Bullet.prototype.update = function() {
            this.position.add(this.velocity);
        };
        Bullet.prototype.run = function() {
            this.display();
            this.update();
        };

        /** Enemies **/
        var squares = [];
        var triangles = [];
        var pentagons = [];

        var Square = function(x, y) {
            this.pos = new PVector(x, y);
            this.r = random(0, 360);
            this.w = 35;
            this.h = 35;
        };
        Square.prototype.run = function() {
            this.display();
            this.update();
        };
        Square.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            rotate(this.r);
            stroke(85);
            strokeWeight(4);
            fill(255, 232, 105);
            rect(-this.w / 2, -this.h / 2, this.w, this.h);
            popMatrix();
        };
        Square.prototype.update = function() {
            this.r += random(0.025);
        };
        while(squares.length<150){
            squares.push(new Square(random(0, world.w), random(0, world.h)));
        }

        var Triangle = function(x, y) {
            this.pos = new PVector(x, y);
            this.r = random(0, 360);
            this.w = 20;
            this.h = 20;
        };
        Triangle.prototype.run = function() {
            this.display();
            this.update();
        };
        Triangle.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            rotate(this.r);
            stroke(85);
            strokeWeight(4);
            fill(252, 118, 119);
            triangle(0, 0 - this.h / 1.25, 0 - this.w, 0 + this.h, 0 + this.w, 0 + this.h);
            popMatrix();
        };
        Triangle.prototype.update = function() {
            this.r += random(0.025);
        };
        while(triangles.length<100){
            triangles.push(new Triangle(random(0, world.w), random(0, world.h)));
        }

        var Pentagon = function(x, y) {
            this.pos = new PVector(x, y);
            this.r = random(0, 360);
            this.w = 35;
            this.h = 35;
        };
        Pentagon.prototype.run = function() {
            this.display();
            this.update();
        };
        Pentagon.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            rotate(this.r);
            stroke(85);
            strokeWeight(4);
            fill(118, 141, 252);
            beginShape();
            endShape();
            popMatrix();
        };
        Pentagon.prototype.update = function() {
            this.r += random(0.025);
        };
        while(pentagons.length<50){
            pentagons.push(new Pentagon(random(0, world.w), random(0, world.h)));
        }

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
            this.pmx = 0;
            this.pmy = 0;
            this.screenx = 0;
            this.screenx = 0;
            this.reloadTime = 0;
            this.shooting = false;
            this.stats = {
                health: 100,
                regeneration: 1,
                bodyDamage: 1,
                bulletSpeed: 5,
                bulletPenetration: 1,
                bulletDamage: 1,
                reload: 1,
                movementSpeed: 2.5,
            };
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
            rotate(atan2(mouseY - height / 2, mouseX - width / 2) +
                (-width + -height / 2));
            fill(153);
            rect(-8.75, 5, 17.5, 35);
            popMatrix();
            fill(0, 178, 225);
            ellipse(this.pos.x, this.pos.y, this.w, this.h);
        };
        Player.prototype.update = function() {
            if (keys[UP] && this.pos.y > 0) {
                this.pos.sub(0, this.stats.movementSpeed);
                if (this.pos.y >= marginy && this.pos.y <= marginy +
                    this.pmy) {
                    this.pmy -= 5;
                }
            }
            if (keys[DOWN] && this.pos.y < world.h) {
                this.pos.add(0, this.stats.movementSpeed);
                if (this.pos.y >= marginy + this.pmy) {
                    this.pmy += 5;
                }
            }
            if (keys[RIGHT] && this.pos.x < world.w) {
                this.pos.add(this.stats.movementSpeed, 0);
                if (this.pos.x >= marginx + this.pmx) {
                    this.pmx += 5;
                }
            }
            if (keys[LEFT] && this.pos.x > 0) {
                this.pos.sub(this.stats.movementSpeed, 0);
                if (this.pos.x >= marginx && this.pos.x <= marginx +
                    this.pmx) {
                    this.pmx -= 5;
                }
            }
            if (this.pos.x <= marginx) {
                this.pmx = 0;
            }
            if (this.shooting && this.reloadTime === 0) {
                bullets.push(new Bullet(new PVector(this.pos.x, this.pos.y), new PVector(mouseX - this.screenx, mouseY - this.screeny), this.stats.bulletSpeed));
                this.reloadTime = this.stats.reload;
                lastMS = millis() - startMS + this.stats.reload * 100;
            }
        };
        var player = new Player(random(width, world.w-width), random(height, world.h-height));

        /** Minimap **/
        var miniMap = function(x, y) {
            this.pos = new PVector(width - 135, height - 135);
        };
        miniMap.prototype.run = function() {
            this.display();
        };
        miniMap.prototype.display = function() {
            if (this.pos.x < width - 135 || this.pos.x > width - 135 || this.pos.y < height - 135 || this.pos.y > height - 135){
                this.pos.set(width - 135, height - 135);
            }
            stroke(100);
            strokeWeight(5);
            fill(207, 207, 207, 200);
            rect(this.pos.x, this.pos.y, 125, 125);
        };
        var minimap = new miniMap(player.pos.x, player.pos.y);

        /** Map Camera **/
        var mapCamera = {
            pos: new PVector(player.pos.x, player.pos.y),
            right: -world.w,
            bottom: -world.h,
            ox: 0,
            oy: 0,
            run: function() {
                this.pos.x = constrain(this.pos.x + (width / 2 - player.pos.x - this.pos.x) / 5, this.right, 0);
                this.pos.y = constrain(this.pos.y + (height / 2 -   player.pos.y - this.pos.y) / 5, this.bottom, 0);
                translate(this.pos.x, this.pos.y);
                translate(player.pmx, player.pmy);
                player.screenx = player.pos.x + this.pos.x + player.pmx;
                player.screeny = player.pos.y + this.pos.y + player.pmy;
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
            for (var i = 0; i < squares.length; i += 1) {
                squares[i].run();
            }
            for (var i = 0; i < triangles.length; i += 1) {
                triangles[i].run();
            }
            for (var i = 0; i < pentagons.length; i += 1) {
                pentagons[i].run();
            }
            for (var i = 0; i < bullets.length; i += 1) {
                bullets[i].run();
            }
            player.run(); //The Player
            popMatrix();
            minimap.run(); //Minimap
            if (millis() - startMS > lastMS + player.stats.reload * 1000) {
                player.reloadTime = 0;
            }
        };

        /** Shooting Stuff **/
        mousePressed = function(){
            player.shooting = true;
        };
        mouseReleased = function() {
            player.shooting = false;
        }
    }
};
var canvas = document.getElementById("mycanvas");
var processingInstance = new Processing(canvas, sketchProc);
