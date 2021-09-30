const SERVE = 0;
const PLAY = 1;
const END = 2;
const WIN = 3;

var gameState = SERVE;
var background_img;
var backgr;
var astronaut_Flying_img;
var astronaut_Flying;
var asteroids_img, alien_img, alien2_img;
var asteroidGroup, alienGroup;
var destination,destination_img;
var gameOver;
var distance = 0;
var gameEndSound;
var restart, restart_img,restart2, restart2_img;
var reset;
var gameWin, gameWin_img;
var fireShooter,fireBall
var temp_fire,fire;

function preload() 
{
    background_img = loadImage("assets/images/space-background.png");
    astronaut_Flying_img = loadImage("assets/images/astronaut3.png");
    asteroids_img = loadImage("assets/images/asteroids.png");
    alien_img = loadImage("assets/images/alien.png");
    alien2_img = loadImage("assets/images/alien2.png");
    destination_img = loadImage("assets/images/astronaut-reached-moon.jpg");
    gameOverSprite = loadImage("assets/images/game-oversprite.png");
    restart_img = loadImage("assets/images/reset-button.png");
    restart2_img = loadImage("assets/images/play-again-button.png");
    gameWin_img = loadImage("assets/images/you-win-sprite.png");
    fireShooter_img = loadImage("assets/images/shoot-balls.png");


    gameEndSound = loadSound("assets/sound/destroySound.mp3");
    gameOverSound = loadSound("assets/sound/cometSound.mp3");
    gameOver2Sound = loadSound("assets/sound/alien2Siren.mp3");
    checkpoint = loadSound("assets/sound/checkpoint.mp3");
}

function setup()
{
    var canvas = createCanvas(windowWidth,windowHeight);

   //adding background and giving velocity
    asteroidGroup = new Group();
    alienGroup = new Group();
    alien2Group = new Group();
    fireGroup = new Group();

    

    backgr = createSprite(600,0,1200,1200);
    backgr.addImage(background_img);
    backgr.y=backgr.height/2;
    
    backgr.scale = 4;
    
    //Flying astronaut
    astronautFlying =  createSprite(750,600,20,20);
    astronautFlying.addImage(astronaut_Flying_img);
    astronautFlying.scale = 0.12;
    astronautFlying.visible = true;
     
    destination = createSprite(750,350,1000,1200);
    destination.addImage(destination_img);
    destination.scale = 0.383;
    destination.visible = false;
    
    restart = createSprite(750,400,10,10);
    restart.addImage(restart_img);
    restart.visible = false; 

    restart2 = createSprite(1000,320,10,10);
    restart2.addImage(restart2_img);
    restart2.visible = false; 
    restart2.scale = 0.5

    gameOver = createSprite(750,320,0,0);
    gameOver.addImage(gameOverSprite);
    gameOver.visible = false;
    gameOver.scale = 0.3;

    gameWin = createSprite(1000,140,0,0);
    gameWin.addImage(gameWin_img);
    gameWin.scale = 0.75
    gameWin.visible = false;
}


function draw(){
    background(0);
    if(keyDown("space")){
        gameState = PLAY;
    }
    
    if(gameState === PLAY)
    {
        backgr.velocityY = - (6 + 3*distance/500);
        distance = distance + Math.round(getFrameRate()/50);
        asteroids();
        aliens();
        
        if (backgr.y > 400) 
        {
            backgr.y = backgr.height/2;
        }

        if (distance>0 && distance%500 === 0)
    {
      checkpoint.play();
    }
        backgr.velocityY = 4;
        astronautFlying.x = World.mouseX;

        if(keyDown("s")){
            temp_fire = createFire();
            temp_fire.x = astronautFlying.x;
        }
        

        //if asteroids hit astronaut
        
        if(fireGroup.isTouching(alienGroup)){
            alienGroup.destroyEach()
            fireGroup.destroyEach()
            distance=distance + 50;
        }
        if(fireGroup.isTouching(asteroidGroup)){
            asteroidGroup.destroyEach()
            fireGroup.destroyEach()
            distance=distance + 30;

        }
        if(fireGroup.isTouching(alien2Group)){
            alien2Group.destroyEach()
            fireGroup.destroyEach()
            distance=distance + 100;

        }
        
        if( alienGroup.isTouching(astronautFlying))
        {
            gameState = END;
            restart.visible = true;

            gameEndSound.play();
        }

        if( alien2Group.isTouching(astronautFlying))
        {
            gameState = END;
            restart.visible = true;

            gameOver2Sound.play();
        }
    
       if(asteroidGroup.isTouching(astronautFlying))
        {
            gameState = END;
            restart.visible = true;
            gameOverSound.play();
        }

        if(distance === 10000){
            gameState = WIN;
        }
    }else if(gameState === END){
        //astronautFlying.visible = false;
        
        gameOver.visible = true;
        stopEverything();
            
    }else if(gameState === WIN){
        
        gameWin.visible = true;
        restart2.visible = true;
        destination.visible = true;
        stopEverything();
    }
    //game ends once it reaches distance of 200
    

    if(mousePressedOver(restart)) 
    {
      reset();
      astronautFlying.x = 750;
    }
    if(mousePressedOver(restart2)) 
    {
      reset();
      astronautFlying.x = 750;
    }
    
    
    
    drawSprites();

    if(gameState === SERVE){
        text("PRESS SPACE TO START THE GAME", 500, 300,fill("gold"),textSize(30),textFont("Georgia"));
        text("WHEN THE ASTRONAUT REACHES THE DISTANCE OF 5000 MILES WITHOUT BEING HIT BY OBSTACLES, YOU WIN", 270,350,fill("orange"),textSize(18),textFont("Algerian"),textStyle(BOLD));
        text("IF THE ASTRONAUT HITS THE ALIENS OR ASTEROIDS, GAME OVER", 460,390,textSize(18));
        text("DONE BY S.VISHVADHARMAN, S.KAVIN VEL, A.RICHIE JOEN",355,450,textSize(28))
    }

    text("DISTANCE :" + distance +" Miles", 10,60,textSize(30),fill("lightgreen"),textFont("Bookman Old Style"),textStyle(BOLD));
}   

function reset()
{
  gameState = SERVE;
  destination.visible = false;
  gameWin.visible = false;
  gameOver.visible = false;
  restart.visible = false;
  restart2.visible = false;
  astronautFlying.visible = true;
  distance = 0;
}




function asteroids(){
    if(World.frameCount % 60 === 0){
        asteroid = createSprite(random(100,1400),0,40,40);
        asteroid.addImage(asteroids_img);
        asteroid.velocityY = 6 + 3*distance/500;
        asteroid.lifetime = 240;
        asteroidGroup.add(asteroid);
        
    }
}
function createFire(){
    fire = createSprite(910,570,15,20);
    fire.addImage(fireShooter_img)
    fire.velocityY = -7;
    fire.lifetime = 60;
    fire.scale=0.05;
    fireGroup.add(fire);
    return fire;
}

function aliens(){
    if(World.frameCount % 150 === 0){
        alien = createSprite(random(50,1000),0,40,40);
        alien.scale = 2;
        alien.addImage(alien_img);
        alien.velocityY = 6 + 3*distance/500;
        alien.lifetime = 240;
        alienGroup.add(alien);  
    }

    if(World.frameCount % 320 === 0){
        alien2 = createSprite(random(200,600),0,40,40);
        alien2.scale = 0.25;
        alien2.addImage(alien2_img);
        alien2.velocityY = 6 + 3*distance/500;
        alien2.lifetime = 240;
        alien2Group.add(alien2);
    }
}
function stopEverything(){
    backgr.velocityY = 0;
    astronautFlying.visible = false;
    asteroidGroup.destroyEach();
    asteroidGroup.setVelocityYEach(0);
    asteroidGroup.setLifetimeEach(-1);
    alienGroup.destroyEach();
    alienGroup.setVelocityYEach(0);
    alienGroup.setLifetimeEach(-1); 
    alien2Group.destroyEach();
    alien2Group.setVelocityYEach(0);
    alien2Group.setLifetimeEach(-1);   
    fireGroup.destroyEach();
    fireGroup.setVelocityYEach(0);
}
