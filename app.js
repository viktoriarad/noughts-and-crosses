const btnPlay = document.querySelector('.btnPlay');
const btnRestart = document.querySelector('.btnRestart');
class Board {
    constructor(x = 3, y = 3) {
        this._cells = [];
        this._gameBody = document.querySelector('.game');
        this._gameBody.innerHTML = '';
        this._nextAction = 'cross';
        this._cellsAmount = 0;
        this._cols = x;
        this._rows = y;
        this._gameStarted = true;
        for (let i = 0; i < x; i++) {
            this._cells[i] = [];
            for (let j = 0; j < y; j++) {
                this._cells[i][j] = new Cell(this);
                this._cellsAmount++;
            }
        }
        this._restartButton = this.createRestartButton();
        this._popup = this.createPopup();
    }
    get nextAction() {
        return this._nextAction;
    }
    set nextAction(value) {
        this._nextAction = value;
    }
    get gameStarted() {
        return this._gameStarted;
    }
    resetGame(that) {
        that = new Board(that._cols, that._rows);
        that.create();
    }
    createRestartButton() {
        const element = document.createElement('button');
        element.classList.add("btnRestart");
        element.textContent = "Restart";
        this._gameBody.appendChild(element);
        element.addEventListener('click', () => this.handleRestartButton(this));
        return element;
    }
    showRestartButton() {
        this._restartButton.classList.add('visible');
    }
    hideRestartButton() {
        this._restartButton.classList.remove('visible');
    }
    handleRestartButton(that) {
        that.hideRestartButton();
        that.hidePopup();
        that.resetGame(that);
    }
    createPopup() {
        const element = document.createElement('div');
        element.classList.add("popupStyle");
        this._gameBody.appendChild(element);
        return element;
    }
    showPopup(titleValue) {
        const title = document.createElement('h2');
        title.innerText = titleValue;
        this._popup.appendChild(title);
        this._popup.classList.add('visible');
        this._gameStarted = false;
        this.showRestartButton();
    }
    hidePopup() {
        this._popup.innerHTML = "";
        this._popup.classList.remove('visible');
    }
    decreaseCellsAmount() {
        this._cellsAmount--;
    }
    checkWinSituation() {
        let result;
        result = this.checkRows() || this.checkCols() || this.checkMainDiagonal() || this.checkAntiDiagonal();
        if (result !== '')
            result += ' won!';
        if (result === '' && this._cellsAmount === 0)
            result = 'draw';
        if (result !== '')
            this.showPopup(result);
    }
    checkRows() {
        for (let i = 0; i < this._rows; i++) {
            let result;
            const firstCell = this._cells[i][0].value || "";
            for (let j = 0; j < this._cols; j++) {
                result = this._cells[i][j].value === firstCell;
                if (!result)
                    break;
            }
            if (result)
                return firstCell;
        }
        return "";
    }
    checkCols() {
        for (let i = 0; i < this._cols; i++) {
            let result;
            const firstCell = this._cells[0][i].value || "";
            for (let j = 0; j < this._rows; j++) {
                result = this._cells[j][i].value === firstCell;
                if (!result)
                    break;
            }
            if (result)
                return firstCell;
        }
        return "";
    }
    checkMainDiagonal() {
        let result;
        const firstCell = this._cells[0][0].value || "";
        for (let i = 0; i < this._cols; i++) {
            result = this._cells[i][i].value === firstCell;
            if (!result)
                return "";
        }
        return firstCell;
    }
    checkAntiDiagonal() {
        let result;
        const firstCell = this._cells[0][this._rows - 1].value || "";
        for (let i = 0; i < this._cols; i++) {
            result = this._cells[i][this._rows - 1 - i].value === firstCell;
            if (!result)
                return "";
        }
        return firstCell;
    }
    changeNextAction() {
        if (this.nextAction === 'cross')
            this.nextAction = 'nought';
        else
            this.nextAction = 'cross';
    }
    create() {
        const board = document.createElement('div');
        board.classList.add('board');
        for (let i = 0; i < this._cells.length; i++) {
            for (let j = 0; j < this._cells[i].length; j++) {
                board.appendChild(this._cells[i][j].DOMElement);
            }
        }
        this._gameBody.appendChild(board);
    }
}
class Cell {
    constructor(board) {
        this._board = board;
        this._DOMElement = this.createElement();
        this.addListener(this._DOMElement, 'click', this.handleClick);
    }
    createElement() {
        const element = document.createElement('div');
        element.classList.add('cell');
        return element;
    }
    addListener(element, event, callback) {
        element.addEventListener(event, () => callback(this));
    }
    handleClick(that) {
        if (that.isFilled() || that._board.gameStarted === false)
            return;
        const action = that._board.nextAction;
        if (action === "cross") {
            that.DOMElement.classList.add('fas');
            that.DOMElement.classList.add('fa-times');
        }
        else if (action === "nought") {
            that.DOMElement.classList.add('far');
            that.DOMElement.classList.add('fa-circle');
        }
        that.value = action;
        that._board.changeNextAction();
        that._board.decreaseCellsAmount();
        that._board.checkWinSituation();
    }
    isFilled() {
        return this.value !== undefined;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    get DOMElement() {
        return this._DOMElement;
    }
}
const newBoard = new Board();
newBoard.create();
const handleClickPlay = () => {
    btnPlay.classList.add('btnPlay-displayblock');
    btnRestart.classList.remove('btnRestart-displayblock');
};
const handleClickreStart = () => {
    btnPlay.classList.remove('btnPlay-displayblock');
    btnRestart.classList.add('btnRestart-displayblock');
};
