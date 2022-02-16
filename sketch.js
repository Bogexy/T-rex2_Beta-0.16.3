var PLAY = 1;
var END = 0;
var gameState = PLAY;
var healt = 3;
var sky; 

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloud2, cloudsGroup, cloudImage, cloudImage2;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obsMe,obsMePng,ObsMeGroup,obspt,obspt1,obsptGroup;

var score,hiScore,Vscore;

var gameOver,reStart,gameOverImg,reStartImg;

var checkpoint,die,jump;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  obspt1 = loadAnimation("obspt1.png","obspt2.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  cloudImage2 = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  obsMePng = loadImage("meteorito1.png");
  
  
  
  reStartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  checkpoint = loadSound("checkpoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  sky = createSprite(300,-5,600,10);

  
  trex = createSprite(50,180,17,45);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;

  
  
  //ground = createSprite(200,180,400,20);
  ground = createSprite(width/2,height-15,width,10);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(width/2,height/4);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.4;
  reStart = createSprite(width/2,height/2-50);
  reStart.addImage(reStartImg);
  reStart.scale = 0.7;

  //crear grupos de obstáculos y nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  ObsMeGroup = new Group();
  obsptGroup = new Group();

  trex.setCollider("circle", 0,0,39);

  //trex.debug = true;
  sky.setCollider("rectangle", 1,10,600,10);
  //sky.debug = true;
  
  console.log("Hola" + 5);
  
  hiScore = 0;
  score = 0;
  Vscore = 0;

}

function draw() {
  background(180);
  text("Score: "+ score, width/2+210,height/8);
  text("HI Score: "+ hiScore, width/2+100,height/8);
  text("V Score: "+ Vscore, width/2+310,height/8);
  console.log(Vscore);

  if(gameState === PLAY){

    gameOver.visible = false;
    reStart.visible = false;

    trex.collide(sky);
   
    trex.changeAnimation("running", trex_running);

    //mover el suelo
    //ground.velocityX = -4;
    ground.velocityX = -(4 + 3*score/100);


    //score = score + Math.round(frameCount/369);
    score = score + Math.round(getFrameRate()/60);
    
    if (hiScore < score){
      hiScore = score;
    }

    if(keyDown("a")){
      score = score +1000;
    }

    if(score >  0 && score % 100 === 0){
      checkpoint.play();
    }

    if (keyDown("c")){
      trex.debug = true;
    }
    if (keyDown("v")){
      trex.debug = false;
    }

    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if((touches.length > 0 || keyDown("space"))  && trex.y >= height-106.7 ) {
      //trex.velocityY = -13;
      trex.velocityY = -13;

      touches=[];
      jump.play();
    }
    
    if(keyDown("m") && trex.y >= 220 ) {
      trex.velocityY = +12;
      jump.play();
    }

    trex.velocityY = trex.velocityY + 0.8;
  
    //aparecer nubes
  spawnClouds();
  //aparecer obstáculos en el suelo
  spawnObstacles();
  //aparecer el meteorito 
  SpawnObsMe();
  //aparecer los ptdoractilos
  spawnPt();

  VSC();
  
  if(obstaclesGroup.isTouching(trex) || ObsMeGroup.isTouching(trex) || obsptGroup.isTouching(trex)){
      die.play();
    gameState = END;
   
  }
 
  /*if(ObsMeGroup.isTouching(trex)){
      
    gameState = END;
   
  }*/
    

    

  }
  else if(gameState === END){
    gameOver.visible = true;
    reStart.visible = true;
    //detener el suelo
    trex.velocityY = +12;
    ground.velocityX = 0;
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    if(keyDown("shift") && keyDown("r")){
      reset();
    }

    if((touches.length > 0 || mousePressedOver(reStart) || keyDown("SPACE"))){
      touches=[];
      reset();
    }

    //testing
    /*if(keyDown("shift") && keyDown("g")){
      cloudsGroup.destroyEach();
      obstaclesGroup.destroyEach();
      ObsMeGroup.destroyEach();

      trex.changeAnimation("running", trex_running);
      
      gameState = PLAY;

    }*/
    
    
  }
  
  trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes 
  if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-300,10,10);
    cloud.y = Math.round(random(10,295));
    cloud.addImage(cloudImage);
    cloud.scale = random(0.8,1.5);
    cloud.velocityX = -3;
    
     //asignar ciclo de vida a la variable
    cloud.lifetime = 500;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar nube al grupo
   cloudsGroup.add(cloud);
  }

    if (frameCount % 639  === 0){
      cloud2 = createSprite(width+20,height-20,width,10);
    cloud2.addImage(cloudImage2);
    cloud2.y = Math.round(random(495,585));
    cloud2.scale =random(2,2.5);
    cloud2.velocityX = -3;
    
    //asignar tiempo de vida a una variable
    cloud2.lifetime = 500;
    
    //ajustar la profundidad
    cloud2.depth = cloud2.depth + 1;
                     
  }
}
function spawnObstacles(){
  
    if (frameCount % 60 === 0){
      var obstacle = createSprite(width+20,height-35,width,10);
      obstacle.velocityX = -(6 + 3*Vscore/200);
   
        //generar obstáculos al azar
      var rand = Math.round(random(1,6));
      switch(rand) {
          case 1: obstacle.addImage(obstacle1);
              break;
          case 2: obstacle.addImage(obstacle2);
              break;
          case 3: obstacle.addImage(obstacle3);
              break;
          case 4: obstacle.addImage(obstacle4);
              break;
          case 5: obstacle.addImage(obstacle5);
              break;
          case 6: obstacle.addImage(obstacle6);
              break;
          default: break;
    }
   
    //asignar escala y ciclo de vida al obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 500;
   
   //agregar cada obstáculo al grupo
   obstaclesGroup.add(obstacle);
    }  
}


function SpawnObsMe(){
  //Easy
  if (score <= 1550  ){ 
    if (frameCount % 60 === 0){
      var obsMe = createSprite(width-900,height-600,width,15);
        obsMe.addImage(obsMePng);
      obsMe.scale = random(0.89,1.21); 
      obsMe.x = Math.round(random(640,2000));
      obsMe.velocityY = +(8 + 1*Vscore/300);
      obsMe.velocityX = -(7 + 3*Vscore/200);
      //obsMe.velocityX = -9;
      obsMe.lifetime = 180;
      ObsMeGroup.add(obsMe); 
    }
  }

  //Hard
  else if (score >= 1550 && score <= 9150){ 
    if (frameCount % 50 === 0){
      var obsMe = createSprite(width-900,height-600,width,15);
        obsMe.addImage(obsMePng);
      obsMe.scale = random(0.89,1.21); 
      obsMe.x = Math.round(random(640,2000));
      obsMe.velocityY = +(8 + 1*Vscore/300);
      obsMe.velocityX = -(7 + 3*Vscore/200);
      //obsMe.velocityX = -9;
      obsMe.lifetime = 180;
      ObsMeGroup.add(obsMe); 
    }
  } 

  //Demonic
  else if (score >= 9150 && score <= 39369){ 
    if (frameCount % 30 === 0){
      var obsMe = createSprite(width-900,height-600,width,15);
        obsMe.addImage(obsMePng);
      obsMe.scale = random(0.89,1.21); 
      obsMe.x = Math.round(random(640,2000));
      obsMe.velocityY = +(8 + 1*Vscore/300);
      obsMe.velocityX = -(7 + 3*Vscore/200);
      //obsMe.velocityX = -9;
      obsMe.lifetime = 180;
      ObsMeGroup.add(obsMe); 
    }
  } 

  //Infernal
  else if (score >= 39369 && score <= 136369 ){ 
    if (frameCount % 15 === 0){
      var obsMe = createSprite(width-900,height-600,width,15);
        obsMe.addImage(obsMePng);
      obsMe.scale = random(0.88,1.22); 
      obsMe.x = Math.round(random(640,2000));
      obsMe.velocityY = +(8 + 1*Vscore/300);
      obsMe.velocityX = -(7 + 3*Vscore/200);
      //obsMe.velocityX = -9;
      obsMe.lifetime = 180;
      ObsMeGroup.add(obsMe); 
    }
  } 

  //Impossible
  else if (score >= 136369 ){ 
    if (frameCount % 8 === 0){
      var obsMe = createSprite(width-900,height-600,width,15);
        obsMe.addImage(obsMePng);
      obsMe.scale = random(0.88,1.22); 
      obsMe.x = Math.round(random(640,2000));
      obsMe.velocityY = +(8 + 1*Vscore/300);
      obsMe.velocityX = -(7 + 3*Vscore/200);
      //obsMe.velocityX = -9;
      obsMe.lifetime = 180;
      ObsMeGroup.add(obsMe); 
    }
  } 

}

function spawnPt() {
  //escribir aquí el código para aparecer las nubes 
  if (frameCount % 540 === 0) {
    obspt = createSprite(width+20,height-95,5,5);
    obspt.addAnimation("fly",obspt1);
    obspt.scale = random(0.4,0.5);
    
    obspt.velocityX = -(6+3*Vscore/200);
    
     //asignar ciclo de vida a la variable
    obspt.lifetime = 500;
    
    //ajustar la profundidad
    
    
    
    //agregar nube al grupo
   obsptGroup.add(obspt);
  }

  if (frameCount % 360 === 0) {
    obspt = createSprite(width+20,height-95,5,5);
    obspt.addAnimation("fly",obspt1);
    obspt.scale = random(0.4,0.5);
    
    obspt.velocityX = -(6+3*Vscore/200);
    
     //asignar ciclo de vida a la variable
    obspt.lifetime = 500;
    
    //ajustar la profundidad
    
    
    
    //agregar nube al grupo
   obsptGroup.add(obspt);
  }

}

function reset(){
  gameState = PLAY;

  gameOver.visible = false;
  reStart.visible = false;

  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  ObsMeGroup.destroyEach();

  score = 0;
  Vscore = 0;
  //trex.changeAnimation("running", trex_running);
}

function VSC(){
  //Vscore = score;
  if (score <= 20000){
    Vscore = Vscore + Math.round(getFrameRate()/60);
  }
  

  if (score > 20000){
    Vscore = Vscore + Math.round(getFrameRate()/30);
  }

  if(Vscore === 9000){
    Vscore = 1500;
  }


}

  


