"use strict";

//-----------------------------------------------------------------------------------------
//----------- Import modules, mjs files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import libSprite from "../../common/libs/libSprite_v2.mjs";
import { TGameBoard, GameBoardSize, TBoardCell } from "./gameBoard.mjs";
import { TSnake, EDirection} from "./snake.mjs";
import { TBait } from "./bait.mjs";
import { TMenu } from "./menu.mjs";

//-----------------------------------------------------------------------------------------
//----------- variables and object --------------------------------------------------------
//-----------------------------------------------------------------------------------------
const cvs = document.getElementById("cvs");
const spcvs = new libSprite.TSpriteCanvas(cvs);
let gameSpeed = 4; // Game speed multiplier;
let hndUpdateGame = null;
export const EGameStatus = { Idle: 0, Playing: 1, Pause: 2, GameOver: 3 };

const maxValue = 30;

// prettier-ignore
export const SheetData = {
  Head:     { x:   0, y:   0, width:  38, height:  38, count:  4 },
  Body:     { x:   0, y:  38, width:  38, height:  38, count:  6 },
  Tail:     { x:   0, y:  76, width:  38, height:  38, count:  4 },
  Bait:     { x:   0, y: 114, width:  38, height:  38, count:  1 },
  Play:     { x:   0, y: 155, width: 202, height: 202, count: 10 },
  GameOver: { x:   0, y: 647, width: 856, height: 580, count:  1 },
  Home:     { x:  65, y: 995, width: 169, height: 167, count:  1 },
  Retry:    { x: 614, y: 995, width: 169, height: 167, count:  1 },
  Resume:   { x:   0, y: 357, width: 202, height: 202, count: 10 },
  Number:   { x:   0, y: 560, width:  81, height:  86, count: 10 },
};

export const GameProps = {
  gameBoard: null,
  gameStatus: EGameStatus.Idle,
  snake: null,
  bait: null, 
  menu: null,
  score: 0,
  tailTimeOut: null,
};


let hndUpdateBaitValue = null;

//------------------------------------------------------------------------------------------
//----------- Exported functions -----------------------------------------------------------
//------------------------------------------------------------------------------------------

export function newGame() {
  GameProps.gameBoard = new TGameBoard();
  GameProps.snake = new TSnake(spcvs, new TBoardCell(5, 5)); // Initialize snake with a starting position
  GameProps.bait = new TBait(spcvs); // Initialize bait with a starting position
  gameSpeed = 4; // Reset game speed
  GameProps.score = 0; //resetter når nytt game
  GameProps.menu.baitValue = maxValue;
  GameProps.menu.playScore = 0;


  //Dette er farten som snaken er i starten.
  clearInterval(hndUpdateGame); 
  requestAnimationFrame(drawGame);
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed);

  //Bait timer
  if (hndUpdateBaitValue === null ){
    hndUpdateBaitValue = setInterval(() => {
      GameProps.menu.baitValue--;
    
    }, 1000);
  }
  

  

}

export function baitIsEaten() {

  GameProps.score += GameProps.menu.baitValue; //get vi lagde i menu.
  console.log("score" + GameProps.score);


  GameProps.menu.baitValue = maxValue; // vi setter timeren tilbake til 50.
  GameProps.menu.playScore = GameProps.score; // Oppdaterer poengene i sammtid under spill 
  
  console.log("Bait eaten!");
  GameProps.bait.update(); //spawner ny bait


  increaseGameSpeed(); // Increase game speed

 GameProps.snake.expand(GameProps.menu.baitValue);

 //const tailTimeOut = setTimeout(Body, 1000);

}


//------------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//------------------------------------------------------------------------------------------

function loadGame() {
  cvs.width = GameBoardSize.Cols * SheetData.Head.width;
  cvs.height = GameBoardSize.Rows * SheetData.Head.height;

  GameProps.gameStatus = EGameStatus.Playing; // change game status to Idle

  /* Create the game menu here */ 
  GameProps.menu = new TMenu(spcvs);
  newGame();

  //requestAnimationFrame(drawGame);
  //console.log("Game canvas is rendering!");
  //hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed); 
  //console.log("Game canvas is updating!");
}

function drawGame() {
  // Clear the canvas
  spcvs.clearCanvas();

  //Tegner gameboardet
  switch (GameProps.gameStatus) {
    case EGameStatus.Playing:
      GameProps.menu.draw();
      GameProps.snake.draw();
      GameProps.bait.draw();
      break;
    case EGameStatus.Pause:
      GameProps.bait.draw();
      GameProps.snake.draw();
      GameProps.menu.draw();
      break;
    case EGameStatus.Idle:
      GameProps.menu.draw();
      break;
    case EGameStatus.GameOver:
      GameProps.menu.draw();
      break;
  }
  // Request the next frame
  requestAnimationFrame(drawGame);
}

function updateGame() {
  // Update game logic here
  switch (GameProps.gameStatus) {
    case EGameStatus.Playing:
      if (!GameProps.snake.update()) {
        GameProps.menu.gameOverScore = GameProps.score; // Når slangen dør, lagres poengsummen til Game Over-skjermen
        GameProps.gameStatus = EGameStatus.GameOver;
        console.log("Game over!");
      }
      break;
  }
  
}


function increaseGameSpeed() {
// Øker hastigheten til snake ila spillet
  const maxSpeed = 15;
  if (gameSpeed < maxSpeed) {
    const increaseSpeed = 0.5;
    gameSpeed = gameSpeed + increaseSpeed;

    clearInterval(hndUpdateGame);
    hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed);
    console.log("Increase game speed!");
    }
  }

  //Har laget funksjoner som forteller om statusen er idle, playing, pause, gameover.
export function startGame(){ 
  newGame();
  GameProps.gameStatus = EGameStatus.Playing;
 
}

export function homeScreen(){
  GameProps.gameStatus = EGameStatus.Idle;
  

}

export function resumeGame(){
  GameProps.gameStatus = EGameStatus.Playing;
  
 
  
}
//-----------------------------------------------------------------------------------------
//----------- Event handlers --------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function onKeyDown(event) {
  switch (event.key) {
    case "ArrowUp":
      GameProps.snake.setDirection(EDirection.Up);
      break;
    case "ArrowDown":
      GameProps.snake.setDirection(EDirection.Down);
      break;
    case "ArrowLeft":
      GameProps.snake.setDirection(EDirection.Left);
      break;
    case "ArrowRight":
      GameProps.snake.setDirection(EDirection.Right);
      break;
    case " ":
      if (GameProps.gameStatus === EGameStatus.Playing) {
        GameProps.gameStatus = EGameStatus.Pause;
      }
      /* Pause the game logic here */
      
      break;
    default:
      console.log(`Key pressed: "${event.key}"`);
  }
}
//-----------------------------------------------------------------------------------------
//----------- main -----------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

spcvs.loadSpriteSheet("./Media/spriteSheet.png", loadGame);
document.addEventListener("keydown", onKeyDown);

// alle attributtene feks knapper. kan settes til false og forsvinne. visible = false usynlig, men kan klikkes, disabeled = settes false eller true og kan være usynlig og ikke klikkbar. . toggle funksjon = sette til false eller true.