"use strict";
import libSprite_v2 from "../../common/libs/libSprite_v2.mjs";
import lib2d_v2 from "../../common/libs/lib2d_v2.mjs";
import { SheetData, GameProps, EGameStatus} from "./game.mjs";
import { startGame, homeScreen, resumeGame } from "./game.mjs";
/* Use this file to create the menu for the snake game. */

export class TMenu { //når elementene i klassen er private #, så må funksjonen draw ligge inne i klassen.
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
        this.#spcvs = aSpriteCanvas; //Bruker this for å hente ut fra klassen. 
        GameProps.gameStatus = EGameStatus.Idle;

        const pos = new lib2d_v2.TPosition(350, 230); //utgangspunkt posisjon for alt

        pos.y = 230; //posisjon
        pos.x = 350;
        this.#spButtonPlay = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Play, pos); //Bruker TSpriteButton siden dette er en knapp. 
        this.#spButtonPlay.onClick = startGame;
        this.#spButtonPlay.animateSpeed = 17;
        
        pos.y = 50;
        pos.x= 30;
        this.#spGameOver = new libSprite_v2.TSprite(aSpriteCanvas, SheetData.GameOver, pos); //Bruker TSprite fordi det er en sprite som ikke skal klikkes på. 

        pos.y = 230;
        pos.x= 350;
        this.#spResume = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Resume, pos);
        this.#spResume.onClick = resumeGame; 
        this.#spResume.animateSpeed = 17;

       //trenger egen pos fordi denne spriten vises samtidig som playscore.
        this.#baitScore= new libSprite_v2.TSpriteNumber(aSpriteCanvas, SheetData.Number,  new lib2d_v2.TPosition(10, 10)); //Bruker TSpriteNumber siden dette er et nummer.
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

draw() { //Tegner menyen utifra status
    switch (GameProps.gameStatus) {

      case EGameStatus.Idle:
        this.#spButtonPlay.draw();
        this.#spButtonPlay.visible = true; 
        this.#spButtonPlay.disable = false; 
        //skjuler game over knappene
        this.#spHome.visible = false; 
        this.#spHome.disable = true;
        this.#spRestart.visible = false;
        this.#spRestart.disable = true;
        // skjuler resume knappen
        this.#spResume.visible = false;
        this.#spResume.disable = true;
        
        break;

      case EGameStatus.GameOver:
        this.#spGameOver.draw();
        this.#spRestart.draw();
        this.#spHome.draw();
        this.#spGameOverScore.draw();
        //skjuler play knappen
        this.#spButtonPlay.visible = false; 
        this.#spButtonPlay.disable = true; 
        //skjuler resume knappen
        this.#spResume.visible = false; 
        this.#spResume.disable = true;
        //Game over knappene er synlig
        this.#spHome.visible = true;
        this.#spHome.disable = false;
        this.#spRestart.visible = true;
        this.#spRestart.disable = false;
        newGame(); //Starter nytt game etter gameover, slik at alt resetter seg. 
        
        break;

      case EGameStatus.Playing: 
        this.#baitScore.draw();
        this.#spPlayScore.draw();
        //skjuler alle knappene
        this.#spRestart.visible = false;
        this.#spRestart.disable = true;
        this.#spHome.visible = false;
        this.#spHome.disable = true;
        this.#spResume.visible = false; 
        this.#spResume.disable = true;
        this.#spButtonPlay.visible = false; 
        this.#spButtonPlay.disable = true;
        break;

      case EGameStatus.Pause:
        this.#spResume.draw();
       //viser resume knappen
        this.#spResume.visible = true; 
        this.#spResume.disable = false;
      //skjuler alle de andre knappene
        this.#spHome.visible = false;
        this.#spHome.disable = true;
        this.#spRestart.visible = false; 
        this.#spRestart.disable = true;
        this.#spButtonPlay.visible = false; 
        this.#spButtonPlay.disable = true; 
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

    get playScore() {
      return this.#spPlayScore.value;
    }

    set playScore(aValue) {
      this.#spPlayScore.value = aValue;
    }
  
    
  }

