import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Game } from '../classes/game';
import { GridData } from '../models/grid-back';
import { HighScore } from '../models/high-score.model';
import { GridService } from './grid-service.service';

export type Difficulty =
  | 'easy'
  | 'medium'
  | 'hard'
  | 'very-hard'
  | 'insane'
  | 'inhuman';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  _currentGame: Game | undefined;

  constructor(
    private gridService: GridService,
    private router: Router,
    private http: HttpClient
  ) {}

  /**
   * Initialize the currentGame attribute, either with an already existent grid,
   * or a new random one
   *
   * @param difficulty
   * @param showSuggestions boolean
   * @param name of the player
   * @param grid gridValues and gridId (type GridData)
   * @returns
   */
  public async startGame(
    difficulty: Difficulty,
    showSuggestions: boolean,
    name: string,
    grid?: GridData
  ): Promise<Game> {
    let tab: (number | undefined)[];

    if (grid) {
      tab = grid.values;
    } else {
      tab = await this.gridService.generateRemoteGrid(difficulty);
    }
    this._currentGame = new Game(tab, showSuggestions, name, grid?.id);
    this.refreshScores();

    return this._currentGame;
  }

  /**
   * Get the highScores from the backend for the currentGame and stock them into the currentGame attribute
   */
  public refreshScores() {
    if (this.currentGame != undefined) {
      this.gridService.getTop5Scores(this._currentGame!.id).then((v) => {
        this._currentGame!.topScores = new Map(Object.entries(v));
      });
      let highScores: Map<string, number> = this.currentGame!.topScores;
      let ranksTemp: HighScore[] = [];
      highScores.forEach((value: number, key: string) => {
        ranksTemp.push({ rank: 0, name: key, score: value });
      });
      ranksTemp = ranksTemp
        .sort((a, b) => (a.score < b.score ? -1 : 1))
        .slice(0, 5);

      this._currentGame!.ranks = ranksTemp;
    }
  }

  public get currentGame(): Game {
    if (this._currentGame) {
      return this._currentGame;
    } else {
      //if we refresh the page we go back to the home page
      this.router.navigate(['/menu']);
      return new Game(this.gridService.generateFullGrid('easy'), true, '');
    }
  }

  /**
   *
   * @param index of the selected tile
   * @param newValue of the selected tile
   */
  public jouerCoup(index: number, newValue: number) {
    this._currentGame?.jouerCoup(index, newValue);
  }

  /**
   * Send the values to the back-end if non-suggestions mode and redirects to the home
   *
   * @param values OriginalValues of the game
   * @param name Name of the player
   * @param score
   */
  public endGame(values: (number | undefined)[], name: string, score: number) {
    if (this._currentGame!.showSuggestions) {
      //on n'enregistre pas les parties avec suggestion
      this.router.navigate(['/menu']);
    } else {
      lastValueFrom(
        this.http.post<void>('/game/grids/score', {
          values: values,
          player: name,
          score: score,
        })
      );
      this.router.navigate(['/menu']);
    }
  }
}
