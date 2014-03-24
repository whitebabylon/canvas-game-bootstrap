
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

/****************************************************************************
*
*                               Draw Canvas
*
****************************************************************************/
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 256;
canvas.height = 248;
document.body.appendChild(canvas);
/****************************************************************************
*
*                               Variables
*
****************************************************************************/
var screenTrans = false;
var screenTransDir = "";
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
var overworldTemp = [];


var worlds = [];
var minimap = [];
var myY = 0;
var myX = 0;
var minimapX = 8;
var minimapY = 7;
var lastTime;
var player = {
    pos: [0, 0],
    sprite: new Sprite('img/links.png', [0, 0], [16, 16], 16, [0, 2])
};
var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var btnLastPressed = "";
var printScreenAgain = false;
/****************************************************************************
*
*                               Main
*
****************************************************************************/
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

            //renderEntitiesInit(worlds);
          //  renderEntitiesInit(minimap);
    lastTime = now;
    requestAnimFrame(main);
};


function populateTempScreen(){
    overworldTemp = [
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
    [-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10],
                                    ];
}
function changeScreen(){
    if (minimapX == 99 && minimapY == 7){
        overworldTemp = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                        ];
    }else
    if (minimapX == 99 && minimapY == 6){
        alert("NE");
        overworldTemp = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                        ];
    }else{
        overworldTemp = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [1,1,1,1,1,1,0,0,0,1,1,1,0,0,1,1],
        [1,1,1,1,1,1,0,0,0,1,1,1,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1]
                        ];
    }
}
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
/**********************************************************************************************************
*
*                           TEMP WORLD
*
*********************************************************************************************************/
            var xPos = i* 16;
            var yPos = e*16;
            if (screenTransDir == "left")  xPos = (i*16)-(16*16);
            if (screenTransDir == "right") xPos = (i*16)+(16*16);
            if (screenTransDir == "up") yPos = (e*16)-(16*11);
            if (screenTransDir == "down") yPos = (e*16)+(16*11);
           if (yPos > (16*5))
            if (overworldTemp[e][i] == 1){
                worlds.push({ pos: [xPos,  yPos],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/overworld.png', [120, 52], [16, 16]),
                           type: 0 });
            }
            else if (overworldTemp[e][i] == 0){
                worlds.push({ pos: [xPos,  yPos],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/overworld.png', [137, 1], [16, 16]),
                           type: 0 });
            }
            else if (overworldTemp[e][i] == 2){
                worlds.push({ pos: [xPos,  yPos],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/overworld.png', [137, 52], [16, 16]),
                           type: 2 });
            }
            else if (overworldTemp[e][i] == 3){
                worlds.push({ pos: [xPos,  yPos],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/overworld.png', [103, 52], [16, 16]),
                           type: 3 });
            }
            else if (overworldTemp[e][i] == 9){
                worlds.push({ pos: [xPos, yPos],
                           size: 16,
                           dir: 'forward',
                           sprite: new Sprite('img/overworld.png', [69, 18], [16, 16]),
                           type: 9 });
            }
            else if (overworldTemp[e][i] == -1){
                worlds.push({ pos: [xPos, yPos],
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

function checkPlayerBounds(dt) {
    // Check bounds
    if(player.pos[0] < 0) {
        //player.pos[0] = 0;
        screenTrans = true;
        screenTransDir = "left";
        //minimapX -= 1;

        changeScreen();
        paintWorld();
        overworld = overworldTemp;

    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0] + 5) {
        //player.pos[0] = canvas.width - player.sprite.size[0];
        screenTrans = true;
        screenTransDir = "right";


        changeScreen();
        paintWorld();
        overworld = overworldTemp;
    }

    if(player.pos[1] < (0+(16*5)+2)) {
        screenTrans = true;
        screenTransDir = "up";
        //minimapY -= 1;

        changeScreen();
        paintWorld();
        overworld = overworldTemp;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        //player.pos[1] = canvas.height - player.sprite.size[1];
        screenTrans = true;
        screenTransDir = "down";
        //minimapY -= 1;

        changeScreen();
        paintWorld();
        overworld = overworldTemp;
    }
}
function screenTransition(pos, dt){
        renderEntitiesTrans(worlds);
        var condition;
        if (screenTransDir == "left"){ player.pos[0] += 8; condition = ((player.pos[0]+5) > canvas.width - player.sprite.size[0]); }
        if (screenTransDir == "right"){ player.pos[0] -= 8;  condition = ((player.pos[0]-7) < 0 ); }
        if (screenTransDir == "up"){ player.pos[1] += 8;condition =  ((player.pos[1]+27) > canvas.height - player.sprite.size[1]);}
        if (screenTransDir == "down"){ player.pos[1] -= 8;condition =  (player.pos[1]-27 < (0+(16*5)+2));}

        player.sprite.update(dt);
        renderEntity(player);
        if (   condition
                    ){
            screenTrans = false;
            overworldTemp = [];
            changeScreen();
            worlds = [];
            //minimap = [];
            paintWorld();
            renderEntitiesInit(worlds);
            renderEntitiesInit(minimap);
            printScreenAgain = true;

            if (screenTransDir == "left") minimapX -= 1;
            if (screenTransDir == "right") minimapX += 1;
            if (screenTransDir == "up") minimapY -= 1;
            if (screenTransDir == "down") minimapY += 1;
            //paintWorld();
            //alert("HI");

        }



}
// Draw everything












function init() {
    //terrainPattern = ctx.createPattern(resources.get('img/overworld.png'), 'repeat');
    populateTempScreen();
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


// Update game objects
function update(dt) {
    gameTime += dt;
    if (screenTrans == true){
        screenTransition(screenTransDir, dt);
    } else {
        if (printScreenAgain == true){
          //  paintWorld();
            printScreenAgain = false;
        }
        handleInput(dt);
        updateEntities(dt);
        checkCollisions(dt);

    }
};

function inputCalc( direction, dt ){
    var counts = 0;
    var counts2 = 0;
    var counts3 = 0;
    var counts4 = 0;
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
                    if (direction == 'left')
                        if (((i+1)*16) >= player.pos[0]){
                            var isHit = boxCollides([(player.pos[0]-4),(player.pos[1])], [16,10], [i*16,e*16], [16 ,13]);
                            if (isHit) counts3++;
                        }
                    if (direction == 'right')
                        if (((i-1)*16) <= player.pos[0]){
                            var isHit = boxCollides([(player.pos[0]+4),(player.pos[1])], [16,10], [i*16,e*16], [16 ,13]);
                            if (isHit) counts4++;
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
        } else if (direction == 'left'){
            if (counts3 == 0){
                player.pos[0] -= 2;
                player.sprite.pos = [32,0];
            }
            player.sprite.frames = [0,1];
        } else if (direction == 'right'){
            if (counts4 == 0){
                player.pos[0] += 2;
                player.sprite.pos = [98,0];
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
        inputCalc('left', dt);
        btnLastPressed = "L";

        //screenTransition(dt);
    }
    else
    if(input.isDown('RIGHT') || input.isDown('d')) {
        inputCalc('right', dt);
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
function renderEntitiesTrans(list) {

    for(var i=0; i<list.length; i++) {
        if (list[i].pos[1] > (5*16)){
            if (screenTransDir == "left")   list[i].pos[0] += 8;
            if (screenTransDir == "up")     list[i].pos[1] += 8;
            if (screenTransDir == "right")  list[i].pos[0] -= 8;
            if (screenTransDir == "down")   list[i].pos[1] -= 8;
            renderEntity(list[i]);
        }
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

