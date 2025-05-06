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

        const possp = new lib2d_v2.TPosition(350, 230); //utgangspunkt posisjon for alt

        pos.y = 230;
        pos.x= 350;
        this.#spButtonPlay = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Play, pos);
        this.#spButtonPlay.onClick = startGame;

        pos.y = 50;
        pos.x= 30;
        this.#spGameOver = new libSprite_v2.TSprite(aSpriteCanvas, SheetData.GameOver, pos);

        pos.y = 230;
        pos.x= 350;
        this.#spResume = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Resume, pos);
        this.#spResume.onClick = resumeGame;

        pos.y = 230;
        pos.x= 350;
        this.#baitScore= new libSprite_v2.TSpriteNumber(aSpriteCanvas, SheetData.Number, pos);
        this.#baitScore.scale = 0.5;
        this.#baitScore.alpha = 0.5;
        this.#baitScore.value = 50; //value er score poeng.


        pos.y = 398;
        pos.x= 645;
        this.#spRestart = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Retry, pos);
        this.#spRestart.onClick = startGame;

        pos.y = 398;
        pos.x= 95;
        this.#spHome = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Home, pos);
        this.#spHome.onClick = homeScreen;


    }

draw() {
    switch (GameProps.gameStatus) {
      case EGameStatus.Idle:
        this.#spButtonPlay.draw();
        break;
      case EGameStatus.GameOver:
        this.#spGameOver.draw();
        this.#spRestart.draw();
        //this.#spScore.draw();
        this.#spHome.draw();
        break;
      case EGameStatus.Playing:
        this.#baitScore.draw();
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



} 