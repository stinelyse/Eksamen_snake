"use strict";
import libSprite_v2 from "../../common/libs/libSprite_v2.mjs";
import lib2d_v2 from "../../common/libs/lib2d_v2.mjs";
import { SheetData, GameProps, EGameStatus} from "./game.mjs";
import { startGame, homeScreen, resumeGame } from "./game.mjs";
/* Use this file to create the menu for the snake game. */

export class TMenu { //når elementene i klassen er private #, så må draw ligge inne i klassen.
    #spButtonPlay;
    #spGameOver;
    #spResume;
    #spRestart;
    #spGameOverScore;
    #spPlayScore;
    #spHome;
    #spcvs;
    #baitScore;
    
    constructor(aSpriteCanvas) {
        this.#spcvs = aSpriteCanvas;
        GameProps.gameStatus = EGameStatus.Idle;

        const pos = new lib2d_v2.TPosition(350, 230); //utgangspunkt posisjon for alt

        pos.y = 230;
        pos.x = 350;
        this.#spButtonPlay = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Play, pos);
        this.#spButtonPlay.onClick = startGame;

        pos.y = 50;
        pos.x= 30;
        this.#spGameOver = new libSprite_v2.TSprite(aSpriteCanvas, SheetData.GameOver, pos);

        pos.y = 230;
        pos.x= 350;
        this.#spResume = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Resume, pos);
        this.#spResume.onClick = resumeGame; 

       //trenger egen pos fordi denne spriten vises samtidig som playscore.
        this.#baitScore= new libSprite_v2.TSpriteNumber(aSpriteCanvas, SheetData.Number,  new lib2d_v2.TPosition(10, 10));
        this.#baitScore.scale = 0.8;
        this.#baitScore.alpha = 0.8;
        this.#baitScore.value = 50; //value er score poeng.

      
        this.#spPlayScore= new libSprite_v2.TSpriteNumber(aSpriteCanvas, SheetData.Number, new lib2d_v2.TPosition(10, 90));
        this.#spPlayScore.scale = 0.8;
        this.#spPlayScore.alpha = 0.8;


        pos.y = 398;
        pos.x= 645;
        this.#spRestart = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Retry, pos);
        this.#spRestart.onClick = startGame;

        pos.y = 398;
        pos.x= 95;
        this.#spHome = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Home, pos);
        this.#spHome.onClick = homeScreen;

        pos.y = 250;
        pos.x= 550;
        this.#spGameOverScore= new libSprite_v2.TSpriteNumber(aSpriteCanvas, SheetData.Number, pos);


    }

draw() {
    switch (GameProps.gameStatus) {
      case EGameStatus.Idle:
        this.#spButtonPlay.draw();
        break;
      case EGameStatus.GameOver:
        this.#spGameOver.draw();
        this.#spRestart.draw();
        this.#spHome.draw();
        this.#spGameOverScore.draw();
        break;
      case EGameStatus.Playing:
        this.#baitScore.draw();
        this.#spPlayScore.value = GameProps.score; // Oppdaterer poengene under spill 
        this.#spPlayScore.draw();
        break;
      case EGameStatus.Pause:
        this.#spResume.draw();
        break;
        }   
    }

    get baitValue(){
      return this.#baitScore.value;
      
    }

    set baitValue(aValue){
      if(this.#baitScore.value> 1){
        this.#baitScore.value = aValue;
      }
     
    } // virker for -- 

    get gameOverScore(){
      return this.#spGameOverScore.value;
    } // Henter poengsummen som skal vises på Game Over

    set gameOverScore(aValue) {
      this.#spGameOverScore.value = aValue;
    } // Setter poengsummen som skal vises på Game Over

} 