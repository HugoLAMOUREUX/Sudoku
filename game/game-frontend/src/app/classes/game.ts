import { HighScore } from '../models/high-score.model';
import { Player } from '../models/player.model';

export class Game {
  private _player: Player;
  private _suggestedValues: Map<number, number[]>;
  private _showSuggestions: boolean;
  private _highScores: Map<string, number>;
  private _ranks: HighScore[] = [];

  private _id: number;
  private _gridValues: (number | undefined)[];
  private _originalValues: (number | undefined)[];
  private _gridBooleanValues: boolean[];
  private _gridSuggestions: string[];
  private _gameEnded: boolean;

  constructor(
    values: (number | undefined)[],
    showSuggestions: boolean,
    name: string,
    id?: number
  ) {
    this._gridValues = values;
    this._originalValues = [...values]; //cloning not to have the same pointer
    this._gridBooleanValues = new Array<boolean>(81);
    this._gridSuggestions = new Array<string>(81);

    this._gameEnded = false;
    this._showSuggestions = showSuggestions;
    this._suggestedValues = new Map();
    this._highScores = new Map();
    if (id !== undefined) this._id = id;
    else this._id = -1;
    this._gridBooleanValues.fill(true);

    if (name === undefined || name === '') {
      name = this.generateRandomName();
    }
    this._player = new Player(name, 0);
    this._suggestedValues = this.getSuggestions(values);
  }

  /**
   * Called if no name has been input
   *
   * @returns Name(string) generated randomly
   */
  private generateRandomName(): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   *
   * @param index Index of the tile to change
   * @param newValue New value of the index's tile
   */
  public jouerCoup(index: number, newValue: number) {
    this.setGridValue(index, newValue);
    this.incrementPlayerScore();
  }

  /**
   * This function updates the attributes gameEnded and gridBooleanValues
   *
   * @returns boolean value to check if the game is ended
   */
  public checkGrid(): boolean {
    let res: boolean = true;
    let gridValues = this.values;
    let resGridBoolean: boolean[] = this._gridBooleanValues;
    let gridCheckedByColumns = this.checkColumns(this._gridValues);
    let gridCheckedByRows = this.checkRows(this._gridValues);

    for (let i: number = 0; i < 81; i++) {
      if (gridValues[i] == 0 || gridValues[i] == undefined) {
        res = false;
      }
      if (gridCheckedByColumns[i] == false || gridCheckedByRows[i] == false)
        res = false;
      resGridBoolean[i] = gridCheckedByColumns[i] && gridCheckedByRows[i];
    }
    this.gridBooleanValues = resGridBoolean;
    this.ended = res;

    return res;
  }

  /**
   *
   * @param gridValues gridValues of the game
   * @returns indexes of tiles that doesn't respect the column constraint
   */
  public checkColumns(gridValues: (number | undefined)[]): boolean[] {
    let boolTab = new Array<boolean>(81);
    let numberMap = new Map<number, number>();
    boolTab.fill(true);

    for (let j = 0; j < 9; j++) {
      numberMap.clear();
      for (let i = j; i < 81; i += 9) {
        if (gridValues[i]) {
          if (numberMap.has(gridValues[i]!)) {
            boolTab[numberMap.get(gridValues[i]!)!] = false;
            boolTab[i] = false;
          } else {
            numberMap.set(gridValues[i]!, i);
          }
        }
      }
    }
    return boolTab;
  }

  /**
   *
   * @param gridValues gridValues of the game
   * @returns indexes of tiles that doesn't respect the row constraint
   */
  public checkRows(gridValues: (number | undefined)[]): boolean[] {
    let boolTab = new Array<boolean>(81);
    let numberMap = new Map<number, number>();
    boolTab.fill(true);

    for (let i = 0; i < 9; i++) {
      numberMap.clear();
      for (let j = 0; j < 9; j++) {
        if (gridValues[9 * i + j]) {
          if (numberMap.has(gridValues[9 * i + j]!)) {
            boolTab[9 * i + j] = false;
            boolTab[numberMap.get(gridValues[9 * i + j]!)!] = false;
          } else {
            numberMap.set(gridValues[9 * i + j]!, 9 * i + j);
          }
        }
      }
    }
    return boolTab;
  }

  /**
   * This function updates the gridSuggestions and suggestedValues attributes
   *
   * @param gridValues gridValues of the game
   * @returns A map containing the empty tiles with their suggestions
   */
  public getSuggestions(
    gridValues: (number | undefined)[]
  ): Map<number, number[]> {
    let res: Map<number, number[]> = new Map<number, number[]>();
    let gridSuggestions: string[] = new Array<string>(81);
    //initialize the gridSuggestions tab
    for (let i = 0; i < 81; i++) {
      gridSuggestions[i] = '';
    }
    for (let i = 0; i < 81; i++) {
      //check if the case needs suggestions
      if (
        !this.booleanValues[i] ||
        this.values[i] == 0 ||
        this.values[i] == undefined
      ) {
        res.set(i, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        //deleting the numbers already presents on the column
        for (let j = i % 9; j < 81; j += 9) {
          if (this.booleanValues[j] == true) {
            res.set(
              i,
              res.get(i)!.filter((obj) => obj != this.values[j])
            );
          }
        }
        //deleting the numbers already presents on the line
        for (let j = 0; j < 9; j++) {
          if (this.booleanValues[9 * Math.floor(i / 9) + j] != false) {
            res.set(
              i,
              res
                .get(i)!
                .filter((obj) => obj !== this.values[9 * Math.floor(i / 9) + j])
            );
          }
        }
        res.get(i)!.forEach((v) => {
          gridSuggestions[i] += v.toString();
        });
      } else {
        gridSuggestions[i] = '';
      }
    }
    this._gridSuggestions = gridSuggestions;
    this._suggestedValues = res;
    return res;
  }

  /*
   *Setters and getters
   */

  public setGridValue(index: number, value: number) {
    //not a classical angular set because 2 arguments are needed
    this._gridValues[index] = value;

    this.checkGrid();
    this.suggestions = this.getSuggestions(this.values);
  }

  public get player() {
    return this._player;
  }

  public set player(p: Player) {
    this._player = p;
  }

  public get values() {
    return this._gridValues;
  }

  public get booleanValues() {
    return this._gridBooleanValues;
  }

  public getScore(): number {
    return this._player.score;
  }

  public set gridBooleanValues(resGridBoolean: boolean[]) {
    this._gridBooleanValues = resGridBoolean;
  }

  public set ended(value: boolean) {
    this._gameEnded = value;
  }

  public get ended() {
    return this._gameEnded;
  }

  public incrementPlayerScore() {
    this._player.incrementScore();
  }

  public set topScores(scores: Map<string, number>) {
    this._highScores = scores;
  }

  public get topScores() {
    return this._highScores;
  }

  public get id() {
    return this._id;
  }

  public get ranks() {
    return this._ranks;
  }

  public set ranks(ranks: HighScore[]) {
    this._ranks = ranks;
  }

  public set suggestions(values: Map<number, number[]>) {
    this._suggestedValues = values;
  }

  public get suggestions() {
    return this._suggestedValues;
  }

  public set showSuggestions(showSuggestions: boolean) {
    this._showSuggestions = showSuggestions;
  }
  public get showSuggestions() {
    return this._showSuggestions;
  }

  public get gridSuggestions() {
    return this._gridSuggestions;
  }

  public set gridSuggestions(value: string[]) {
    this._gridSuggestions = value;
  }

  public get originalValues() {
    return this._originalValues;
  }
}
