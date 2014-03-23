
// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 256;
canvas.height = 248;
document.body.appendChild(canvas);

var overworldWidth = 16;
var overworldHeight = 16;
var overworld = [
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
                [1,1,1,1,9,1,2,0,0,1,1,1,1,1,1,1],
                [1,1,1,2,0,0,0,0,0,1,1,1,1,1,1,1],
                [1,1,2,0,0,0,0,0,0,1,1,1,1,1,1,1],
                [1,2,0,0,0,0,0,0,0,3,1,1,1,1,1,1],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ];
var worlds = [];
var minimap = [];
var myY = 0;
var myX = 0;
var minimapX = 8;
var minimapY = 7;
// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function paintWorld(){
    //alert(overworld[1][4]);
    for (var e = 0; e < (overworldHeight); e++) {
        for (var i = 0; i < (overworldWidth); i++) {
            if (overworld[e][i] == 1){
                worlds.push({ pos: [i*16,  e*16],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/overworld.png', [120, 52], [16, 16]),
                           type: 0 });
            }
            if (overworld[e][i] == 0){
                worlds.push({ pos: [i*16,  e*16],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/overworld.png', [137, 1], [16, 16]),
                           type: 0 });
            }
            if (overworld[e][i] == 2){
                worlds.push({ pos: [i*16,  e*16],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/overworld.png', [137, 52], [16, 16]),
                           type: 2 });
            }
            if (overworld[e][i] == 3){
                worlds.push({ pos: [i*16,  e*16],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/overworld.png', [103, 52], [16, 16]),
                           type: 3 });
            }
            if (overworld[e][i] == 9){
                worlds.push({ pos: [i*16, e*16],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/overworld.png', [69, 18], [16, 16]),
                           type: 9 });
            }
            if (overworld[e][i] == -1){
                worlds.push({ pos: [i*16, e*16],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/overworld.png', [69, 18], [16, 16]),
                           type: 9 });
            }
        }
    }

    minimap.push({ pos: [1*16, 32],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/minimap/back.jpg', [0, 0], [64, 32]),
                           type: 1 });

    minimap.push({ pos: [(16)+(minimapX*4), 32+(minimapY*4)-1],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/minimap/loc.jpg', [0, 0], [4, 4]),
                           type: 1 });
}
function init() {
    //terrainPattern = ctx.createPattern(resources.get('img/overworld.png'), 'repeat');
    paintWorld();
    reset();
    lastTime = Date.now();
    renderEntitiesInit(worlds);
    renderEntitiesInit(minimap);
    main();
}

resources.load([
    'img/sprites.png',
    'img/terrain.png',
    'img/overworld.png',
    'img/links.png',
    'img/minimap/back.jpg',
    'img/minimap/cover.jpg',
    'img/minimap/loc.jpg',

]);
resources.onReady(init);

// Game state
var player = {
    pos: [0, 0],
    sprite: new Sprite('img/links.png', [0, 0], [16, 16], 16, [0, 2])
};

//var bullets = [];
//var enemies = [];
//var explosions = [];

var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
//var terrainPattern;

//var score = 0;


// Speed in pixels per second


var btnLastPressed = "";
// Update game objects
function update(dt) {
    gameTime += dt;

    handleInput(dt);
    updateEntities(dt);


    checkCollisions(dt);


};
function inputCalc( direction, dt ){
    var counts = 0;
    var counts2 = 0;
        for (var e = 0; e < (overworldHeight); e++) {
            for (var i = 0; i < (overworldWidth); i++) {
                if (overworld[e][i] != 0){
                    if (direction == 'down')
                        if (((e-1)*16) <= (player.pos[1])){
                            var isHit = boxCollides([player.pos[0],(player.pos[1]+4)], [16,16], [i*16,e*16], [16 ,16]);
                            if (isHit) counts++;
                        }
                    if (direction == 'up')
                        if (((e+1)*16) >= player.pos[1]){
                            var isHit = boxCollides([player.pos[0],(player.pos[1]-4)], [16,16], [i*16,e*16], [16 ,16]);
                            if (isHit) counts2++;
                        }

                };
            }
        }

        if (direction == 'down') {
            if (counts == 0){
                player.pos[1] += 2;
                player.sprite.pos = [0,0];
            }
            player.sprite.frames = [0,1];
        } else if (direction == 'up'){
            if (counts2 == 0){
                player.pos[1] -= 2;
                player.sprite.pos = [64,0];
            }
            player.sprite.frames = [0,1];
        }

        player.sprite.update(dt);
}
function handleInput(dt) {
    if( (input.isDown('DOWN') || input.isDown('s')) && !(input.isDown('UP') || input.isDown('w'))) {
        inputCalc('down', dt);
        btnLastPressed = "D";
    }

    else if( (input.isDown('UP') || input.isDown('w')) && !(input.isDown('DOWN') || input.isDown('s'))) {
        inputCalc('up', dt);
        btnLastPressed = "U";
    }

    if ( (input.isDown('LEFT') || input.isDown('a')) && !(input.isDown('right') || input.isDown('d')) ){

        myX = Math.ceil((player.pos[0])/16);
         var counts3 = 0;
         var counts3b = 0;
        for (var e = 0; e < (overworldHeight); e++) {
            for (var i = 0; i < (overworldWidth); i++) {
                if (overworld[e][i] != 0){
                    var isHit = boxCollides([(player.pos[0]-4),(player.pos[1])], [16,10], [i*16,e*16], [16 ,13]);
                    if (isHit) counts3++;

                };
            }
        }
        //alert(counts);

        if (counts3 == 0){
            player.pos[0] -= 2;
            player.sprite.pos = [32,0];
            player.sprite.frames = [0,1];
            player.sprite.update(dt);
        } else {
            //player.pos[0] += 2;
        }

        btnLastPressed = "L";
        //screenTransition(dt);
    }
    else
    if(input.isDown('RIGHT') || input.isDown('d')) {
       myY = Math.round((player.pos[1])/16);
        myX = Math.floor((player.pos[0])/16);
        var counts4 = 0;
        var counts4b = 0;
        for (var e = 0; e < (overworldHeight); e++) {
            for (var i = 0; i < (overworldWidth); i++) {
                if (overworld[e][i] != 0){
                    var isHit = boxCollides([(player.pos[0]+4),(player.pos[1])], [16,10], [i*16,e*16], [16 ,13]);
                    if (isHit) counts4++;

                };
            }
        }
        //alert(counts);

        if (counts4 == 0){
            player.pos[0] += 2;
            player.sprite.pos = [98,0];

        } else {
            //player.pos[0] -= 2;
        }
        player.sprite.frames = [0,1];
        player.sprite.update(dt);

        btnLastPressed = "R";
    }


}

function updateEntities(dt) {


}

// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions(dt) {
    checkPlayerBounds(dt);

}

function checkPlayerBounds(dt) {
    // Check bounds
    if(player.pos[0] < 0) {
        //player.pos[0] = 0;
        screenTransition("left", dt);
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}
function screenTransition(pos, dt){

        player.pos[0] += 2;
        player.sprite.update(dt);
        renderEntity(player);
        if ((player.pos[0] < (canvas.width - player.sprite.size[0] - 16)))
        setTimeout(function(){}, 1000);
        screenTransition(pos, dt)

}
// Draw everything
function render() {
    // Render the player if the game isn't over
    renderEntities(worlds);

    if(!isGameOver) {
        renderEntity(player);
    }

    //renderEntities(bullets);

};

function renderEntities(list) {
    myY = Math.round((player.pos[1])/16)*16;
    myX = Math.round((player.pos[0])/16)*16;

    for(var i=0; i<list.length; i++) {
        if (    ((list[i].pos[0] == myX) || (list[i].pos[0] == (myX+16)) || (list[i].pos[0] == (myX-16))) &&
                ((list[i].pos[1] == myY) || (list[i].pos[1] == (myY+16)) || (list[i].pos[1] == (myY-16)))   )
        renderEntity(list[i]);
    }
}

function renderEntitiesInit(list) {

    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }
}
function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

// Game over
function gameOver() {
    isGameOver = true;
}

// Reset game to original state
function reset() {
    isGameOver = false;
    gameTime = 0;
    score = 0;

    myX = 70;
    myY = canvas.height / 2;
    player.pos = [70, canvas.height / 2];
};

