const btnPlay = document.querySelector('.btnPlay');
const btnRestart = document.querySelector('.btnRestart');

class Board {
  private _cells: Cell[][] = [];
  private _cols: number;
  private _rows: number;
  private _nextAction: string;
  private _restartButton: HTMLElement;
  private _popup: HTMLElement;
  private _cellsAmount: number;
  private _gameBody: HTMLElement;
  private _gameStarted: boolean;

  constructor(x: number = 3, y: number = 3) {
    this._gameBody = document.querySelector('.game');
    this._gameBody.innerHTML = '';
    this._nextAction = 'cross'
    this._cellsAmount = 0;
    this._cols = x;
    this._rows = y;
    this._gameStarted = true;

    for (let i: number = 0; i < x; i++) {
      this._cells[i] = [];
      for (let j: number = 0; j < y; j++) {
        this._cells[i][j] = new Cell(this);
        this._cellsAmount++;
      }
    }

    this._restartButton = this.createRestartButton();
    this._popup = this.createPopup();
  }

  get nextAction(): string {
    return this._nextAction;
  }

  set nextAction(value: string) {
    this._nextAction = value;
  }

  get gameStarted(): boolean {
    return this._gameStarted;
  }

  private resetGame(that: Board): void {
    that = new Board(that._cols, that._rows);
    that.create();
  }

  private createRestartButton(): HTMLElement {
    const element: HTMLElement = document.createElement('button');

    element.classList.add("btnRestart");
    element.textContent = "Restart";
    this._gameBody.appendChild(element);
    element.addEventListener('click', () => this.handleRestartButton(this));

    return element;
  }

  private showRestartButton(): void {
    this._restartButton.classList.add('visible');
  }

  private hideRestartButton(): void {
    this._restartButton.classList.remove('visible');
  }

  private handleRestartButton(that: Board): void {
    that.hideRestartButton();
    that.hidePopup();
    that.resetGame(that);
  }

  private createPopup(): HTMLElement {
    const element: HTMLElement = document.createElement('div');
    element.classList.add("popupStyle");
    this._gameBody.appendChild(element);

    return element;
  }

  private showPopup(titleValue: string): void {
    const title: HTMLElement = document.createElement('h2');

    title.innerText = titleValue;
    this._popup.appendChild(title);
    this._popup.classList.add('visible');
    this._gameStarted = false;

    this.showRestartButton();
  }

  private hidePopup(): void {
    this._popup.innerHTML = "";
    this._popup.classList.remove('visible');
  }

  public decreaseCellsAmount(): void {
    this._cellsAmount--;
  }

  public checkWinSituation(): void {
    let result: string;

    result = this.checkRows() || this.checkCols() || this.checkMainDiagonal() || this.checkAntiDiagonal();
    if (result !== '') result += ' won!';
    if (result === '' && this._cellsAmount === 0) result = 'draw';
    if (result !== '') this.showPopup(result);
  }

  private checkRows(): string {
    for (let i: number = 0; i < this._rows; i++) {
      let result: boolean;
      const firstCell: string = this._cells[i][0].value || "";

      for (let j: number = 0; j < this._cols; j++) {
        result = this._cells[i][j].value === firstCell;
        if (!result) break;
      }

      if (result) return firstCell;
    }

    return "";
  }

  private checkCols(): string {
    for (let i: number = 0; i < this._cols; i++) {
      let result: boolean;
      const firstCell: string = this._cells[0][i].value || "";

      for (let j: number = 0; j < this._rows; j++) {
        result = this._cells[j][i].value === firstCell;
        if (!result) break;
      }

      if (result) return firstCell;
    }

    return "";
  }

  private checkMainDiagonal(): string {
    let result: boolean;
    const firstCell: string = this._cells[0][0].value || "";

    for (let i: number = 0; i < this._cols; i++) {
      result = this._cells[i][i].value === firstCell;
      if (!result) return "";
    }

    return firstCell;
  }

  private checkAntiDiagonal(): string {
    let result: boolean;
    const firstCell: string = this._cells[0][this._rows - 1].value || "";

    for (let i: number = 0; i < this._cols; i++) {
      result = this._cells[i][this._rows - 1 - i].value === firstCell;
      if (!result) return "";
    }

    return firstCell;
  }

  public changeNextAction(): void {
    if (this.nextAction === 'cross') this.nextAction = 'nought';
    else this.nextAction = 'cross';
  }

  public create(): void {
    const board: HTMLElement = document.createElement('div');
    board.classList.add('board');

    for (let i: number = 0; i < this._cells.length; i++) {
      for (let j: number = 0; j < this._cells[i].length; j++) {
        board.appendChild(this._cells[i][j].DOMElement);
      }
    }

    this._gameBody.appendChild(board);
  }
}

class Cell {
  private _value: string;
  private _DOMElement: HTMLElement;
  private _board: Board;

  constructor(board: Board) {
    this._board = board;
    this._DOMElement = this.createElement();
    this.addListener(this._DOMElement, 'click', this.handleClick);
  }

  private createElement(): HTMLElement {
    const element = document.createElement('div');
    element.classList.add('cell');
    return element;
  }

  private addListener(element: HTMLElement, event: string, callback: Function): void {
    element.addEventListener(event, () => callback(this));
  }

  private handleClick(that: Cell): void {
    if (that.isFilled() || that._board.gameStarted === false) return;

    const action: string = that._board.nextAction;

    if (action === "cross") {
      that.DOMElement.classList.add('fas');
      that.DOMElement.classList.add('fa-times');
    } else if (action === "nought") {
      that.DOMElement.classList.add('far');
      that.DOMElement.classList.add('fa-circle');
    }

    that.value = action;
    that._board.changeNextAction();
    that._board.decreaseCellsAmount();
    that._board.checkWinSituation();
  }

  private isFilled(): boolean {
    return this.value !== undefined;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  get DOMElement(): any {
    return this._DOMElement;
  }
}

const newBoard = new Board();
newBoard.create();

const handleClickPlay = () => {
  btnPlay.classList.add('btnPlay-displayblock');
  btnRestart.classList.remove('btnRestart-displayblock');
}

const handleClickreStart = () => {
  btnPlay.classList.remove('btnPlay-displayblock');
  btnRestart.classList.add('btnRestart-displayblock');
}

