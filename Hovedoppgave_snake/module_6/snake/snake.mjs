"use strict";
//------------------------------------------------------------------------------------------
//----------- Import modules, mjs files  ---------------------------------------------------
//------------------------------------------------------------------------------------------
import libSprite from "../../common/libs/libSprite_v2.mjs";
import lib2D from "../../common/libs/lib2d_v2.mjs";
import { GameProps, SheetData, baitIsEaten } from "./game.mjs";
import { TBoardCell, EBoardCellInfoType } from "./gameBoard.mjs";
import { TMenu } from "./menu.mjs";

//------------------------------------------------------------------------------------------
//----------- variables and object ---------------------------------------------------------
//------------------------------------------------------------------------------------------
const ESpriteIndex = {
  UR: 0,
  LD: 0,
  RU: 1,
  DR: 1,
  DL: 2,
  LU: 2,
  RD: 3,
  UL: 3,
  RL: 4,
  UD: 5,
};
export const EDirection = { Up: 0, Right: 1, Left: 2, Down: 3 };

//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
class TSnakePart extends libSprite.TSprite {
  constructor(aSpriteCanvas, aSpriteInfo, aBoardCell) {
    const pos = new lib2D.TPoint(
      aBoardCell.col * aSpriteInfo.width,
      aBoardCell.row * aSpriteInfo.height
    );
    super(aSpriteCanvas, aSpriteInfo, pos);
    this.boardCell = aBoardCell;
    let boardCellInfo = GameProps.gameBoard.getCell(
      aBoardCell.row,
      aBoardCell.col
    );
    this.direction = boardCellInfo.direction;
    boardCellInfo.infoType = EBoardCellInfoType.Snake;
    this.index = this.direction;
  }

  update() {
    this.x = this.boardCell.col * this.spi.width;
    this.y = this.boardCell.row * this.spi.height;
  }
} // class TSnakePart

class TSnakeHead extends TSnakePart {
  constructor(aSpriteCanvas, aBoardCell) {
    super(aSpriteCanvas, SheetData.Head, aBoardCell);
    this.newDirection = this.direction;
  }

  setDirection(aDirection) {
    if (
      (this.direction === EDirection.Right ||
        this.direction === EDirection.Left) &&
      (aDirection === EDirection.Up || aDirection === EDirection.Down)
    ) {
      this.newDirection = aDirection;
    } else if (
      (this.direction === EDirection.Up ||
        this.direction === EDirection.Down) &&
      (aDirection === EDirection.Right || aDirection === EDirection.Left)
    ) {
      this.newDirection = aDirection;
    }
  }

  update() {
    GameProps.gameBoard.getCell(
      this.boardCell.row,
      this.boardCell.col
    ).direction = this.newDirection;
    switch (this.newDirection) {
      case EDirection.Up:
        this.boardCell.row--;
        break;
      case EDirection.Right:
        this.boardCell.col++;
        break;
      case EDirection.Left:
        this.boardCell.col--;
        break;
      case EDirection.Down:
        this.boardCell.row++;
        break;
    }
    this.direction = this.newDirection;
    this.index = this.direction;
    if (this.checkCollision()) {
      return false; // Collision detected, do not continue
    }
    // Update the position of the snake element (subclass)
    super.update();
    //Check if the snake head is on a bait cell
    const boardCellInfo = GameProps.gameBoard.getCell(
      this.boardCell.row,
      this.boardCell.col
    );
    if (boardCellInfo.infoType === EBoardCellInfoType.Bait) {
      baitIsEaten();
    } else {
      /* Decrease the score if the snake head is not on a bait cell */
    }

    // Den delen her forteller at det er en slange i cellen, når snaken spiser og halen ikke blir oppdtert, sier den i fra at cellen forran halen er tom,
    // denne koden har en bug, som gjør at dette ikke alltid skjer og dermed medfører at slangen kolliderer med seg selv.
    boardCellInfo.infoType = EBoardCellInfoType.Snake; // Set the cell to Snake

    return true; // No collision, continue
  }

  checkCollision() {
    let collision =
      this.boardCell.row < 0 ||
      this.boardCell.row >= GameProps.gameBoard.rows ||
      this.boardCell.col < 0 ||
      this.boardCell.col >= GameProps.gameBoard.cols;
    if (!collision) {
      const boardCellInfo = GameProps.gameBoard.getCell(
        this.boardCell.row,
        this.boardCell.col
      ); 
      collision = boardCellInfo.infoType === EBoardCellInfoType.Snake; //Hvis man fjerner denne koden, så kan slangen kollidere med seg selv uten å dø.
    }
    return collision; // Collision detected
  }
}

class TSnakeBody extends TSnakePart {
  constructor(aSpriteCanvas, aBoardCell) {
    super(aSpriteCanvas, SheetData.Body, aBoardCell);
    this.index = ESpriteIndex.RL;
  }

  update() {
    let spriteIndex = ESpriteIndex.RL;
    let boardCellInfo;
    switch (this.direction) {
      case EDirection.Up:
        this.boardCell.row--;
        boardCellInfo = GameProps.gameBoard.getCell(
          this.boardCell.row,
          this.boardCell.col
        );
        if (boardCellInfo.direction !== this.direction) {
          switch (boardCellInfo.direction) {
            case EDirection.Left:
              spriteIndex = ESpriteIndex.UL;
              break;
            case EDirection.Right:
              spriteIndex = ESpriteIndex.UR;
              break;
          }
        } else {
          spriteIndex = ESpriteIndex.UD;
        }
        break;
      case EDirection.Right:
        this.boardCell.col++;
        boardCellInfo = GameProps.gameBoard.getCell(
          this.boardCell.row,
          this.boardCell.col
        );
        if (boardCellInfo.direction !== this.direction) {
          switch (boardCellInfo.direction) {
            case EDirection.Up:
              spriteIndex = ESpriteIndex.RU;
              break;
            case EDirection.Down:
              spriteIndex = ESpriteIndex.RD;
              break;
          }
        } else {
          spriteIndex = ESpriteIndex.RL;
        }
        break;
      case EDirection.Left:
        this.boardCell.col--;
        boardCellInfo = GameProps.gameBoard.getCell(
          this.boardCell.row,
          this.boardCell.col
        );
        if (boardCellInfo.direction !== this.direction) {
          switch (boardCellInfo.direction) {
            case EDirection.Up:
              spriteIndex = ESpriteIndex.LU;
              break;
            case EDirection.Down:
              spriteIndex = ESpriteIndex.LD;
              break;
          }
        } else {
          spriteIndex = ESpriteIndex.RL;
        }
        break;
      case EDirection.Down:
        this.boardCell.row++;
        boardCellInfo = GameProps.gameBoard.getCell(
          this.boardCell.row,
          this.boardCell.col
        );
        if (boardCellInfo.direction !== this.direction) {
          switch (boardCellInfo.direction) {
            case EDirection.Left:
              spriteIndex = ESpriteIndex.DR;
              break;
            case EDirection.Right:
              spriteIndex = ESpriteIndex.DL;
              break;
          }
        } else {
          spriteIndex = ESpriteIndex.UD;
        }
        break;
    }
    this.direction = boardCellInfo.direction;
    this.index = spriteIndex;
    super.update();
  }
  clone(){
    const newBody = new TSnakeBody(this.spcvs, new TBoardCell(this.boardCell.col, this.boardCell.row));
    newBody.index = this.index;
    newBody.direction = this.direction;
    return newBody;
  }

  clone_new() {
    // kloner slange-kroppen og setter nye posisjoner avhenging av retning
    var col = 0;
    var row = 0;
    switch (this.direction) {
      case EDirection.Up:
        row++;
        break;
      case EDirection.Right:
        col--;
        break;
      case EDirection.Left:
        col++;
        break;
      case EDirection.Down:
        row--;
        break;
    }
    const newBody = new TSnakeBody(
      this.spcvs,
      new TBoardCell(this.boardCell.col + col, this.boardCell.row + row)
    );
    newBody.index = this.index;
    newBody.direction = this.direction;
    return newBody;
  }
} // class TSnakeBody

class TSnakeTail extends TSnakePart {
  constructor(aSpriteCanvas, aCol, aRow) {
    super(aSpriteCanvas, SheetData.Tail, aCol, aRow);
  }

  update() {
    let boardCellInfo = GameProps.gameBoard.getCell(
      this.boardCell.row,
      this.boardCell.col
    );
    boardCellInfo.infoType = EBoardCellInfoType.Empty; // Clear the cell, when the tail moves

    switch (this.direction) {
      case EDirection.Up:
        this.boardCell.row--;
        break;
      case EDirection.Right:
        this.boardCell.col++;
        break;
      case EDirection.Left:
        this.boardCell.col--;
        break;
      case EDirection.Down:
        this.boardCell.row++;
        break;
    }

    boardCellInfo = GameProps.gameBoard.getCell(
      this.boardCell.row,
      this.boardCell.col
    );
    this.direction = boardCellInfo.direction;
    this.index = this.direction;
    super.update();
  }
} // class TSnakeTail

let baitEaten = false;

export class TSnake {
  #isDead = false;
  #head = null;
  #body = null;
  #tail = null;
  constructor(aSpriteCanvas, aBoardCell) {
    this.#head = new TSnakeHead(aSpriteCanvas, aBoardCell);
    let col = aBoardCell.col - 1;
    this.#body = [
      new TSnakeBody(aSpriteCanvas, new TBoardCell(col, aBoardCell.row)),
    ];
    col--;
    this.#tail = new TSnakeTail(
      aSpriteCanvas,
      new TBoardCell(col, aBoardCell.row)
    );
  } // constructor

  expand(aBaitValue) {
    GameProps.menu.baitValue = aBaitValue;
    const dev = aBaitValue / 6; // Antall poeng blir delt på 6, og så mange elemnter legges til kroppen for vanskeligere spill.
    baitEaten += Math.ceil(dev); // settes til antall elementer som skal inn i slangen.
  }

  draw() {
    this.#head.draw();
    for (let i = 0; i < this.#body.length; i++) {
      this.#body[i].draw();
    }
    this.#tail.draw();
  } // draw

  //Returns true if the snake is alive
  update() {
    if (this.#isDead) {
      return false; // Snake is dead, do not continue
    }
    let newClone = null;
    if (baitEaten) {
      baitEaten -= 1; //mink denne med 1.
      newClone = this.#body[this.#body.length - 1].clone(); //bruker array til å legge til ny element før halen.
    } else {
      this.#tail.update();    // hvis bait er eaten, skal ikke tail oppdateres denne gangen for å flytte den en celle bak
    }
    
    if (this.#head.update()) {
      for (let i = 0; i < this.#body.length; i++) {
        this.#body[i].update();
        
      }

      if (newClone) {
        this.#body.push(newClone);
      }

    } else if (!this.#isDead) {
      this.#isDead = true;
      return false; // Collision detected, do not continue
    }
    return true; // No collision, continue
  }

  setDirection(aDirection) {
    this.#head.setDirection(aDirection);
  } // setDirection
}
