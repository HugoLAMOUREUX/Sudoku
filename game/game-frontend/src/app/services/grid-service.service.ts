//import { HttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Difficulty } from './game-service.service';
import { lastValueFrom, Observable } from 'rxjs';
import { GridData } from '../models/grid-back';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  constructor(private http: HttpClient) {}

  /**
   * Only used in case the page is refreshed, this game returned is
   * in the component for only a very small period because we go to home page when the
   * page is refreshed
   *
   * @param difficulty
   * @returns return a new Game with only 1
   */
  public generateFullGrid(difficulty: Difficulty): number[] {
    let gridValues: number[] = new Array<number>(81);
    let i: number = 0;
    for (i; i < 81; i++) {
      gridValues[i] = 1;
    }
    return gridValues;
  }

  /**
   * Get grid from remote provider
   * @param difficulty desired difficulty of the grid
   * @returns Promise of array of numbers, with the grid values
   */
  public async generateRemoteGrid(
    difficulty: Difficulty
  ): Promise<(number | undefined)[]> {
    let numbers: (number | undefined)[] = Array(81);

    await lastValueFrom(
      this.http.get('/sudoku-provider/' + difficulty, { responseType: 'text' })
    ).then((string) => {
      numbers = string
        .split('')
        .map(Number)
        .map((nb) => {
          if (nb == 0) {
            return undefined;
          } else {
            return nb;
          }
        });
    });

    return numbers;
  }

  /**
   *
   * @param id Id of grid
   * @returns A promise of Record of Sring number representing the highScores
   */
  public getTop5Scores(id: number): Promise<Record<string, number>> {
    let res: Promise<Record<string, number>> = lastValueFrom(
      this.http.get<Record<string, number>>(
        '/game/grids/' + id + '/gridHighScore'
      )
    );
    return res;
  }

  /**
   *
   * @returns An observable of array with all the grids on the back-end
   */
  public getAllGridsObservable(): Observable<Array<GridData>> {
    return this.http.get<Array<GridData>>('/game/grids/allGrids');
  }
}
