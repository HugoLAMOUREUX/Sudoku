import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GridData } from 'src/app/models/grid-back';
import { Difficulty, GameService } from 'src/app/services/game-service.service';
import { GridService } from 'src/app/services/grid-service.service';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css'],
})
export class HomeScreenComponent implements OnInit {
  gridsData: Array<GridData> | undefined;
  gridsSnapShots: Array<HTMLImageElement> = [];

  playerFormGroup = new FormGroup({
    playerId: new FormControl(''),
    suggestions: new FormControl(false),
    difficulty: new FormControl('easy'),
  });

  constructor(
    private gameService: GameService,
    private router: Router,
    private gridService: GridService
  ) {}

  ngOnInit(): void {
    this.gridService.getAllGridsObservable().subscribe((gridsDataTab) => {
      gridsDataTab.forEach(
        (gridData) =>
          (gridData.values = gridData.values.map((val) => {
            if (val == 0) {
              return undefined;
            } else {
              return val;
            }
          }))
      );
      this.gridsData = gridsDataTab;
      gridsDataTab.forEach((griddata, index) => {
        this.gridsSnapShots[index] = HomeScreenComponent.getGridPreview(
          griddata.values
        );
      });
    });
  }

  async onSubmit() {
    this.startGame();
  }

  async launchExistingGrid(id: number) {
    this.startGame(id);
  }

  /**
   * Starts a game in gameService with the selected parameters
   *
   * @param id optional : if a grid is selected, id of the the chosen grid
   */
  async startGame(id?: number) {
    await this.gameService.startGame(
      this.playerFormGroup.get('difficulty')?.value! as Difficulty,
      this.playerFormGroup.get('suggestions')?.value!,
      this.playerFormGroup.get('playerId')?.value!,
      this.selectedGrid(id)
    );

    this.router.navigate(['/board']);
  }

  /**
   *
   * @param id of the selected grid
   * @returns The grid data corresponding to a given id
   */
  selectedGrid(id?: number): GridData | undefined {
    if (this.gridsData && id !== undefined) {
      return this.gridsData[id];
    } else {
      return undefined;
    } //moche
  }

  /**
   *
   * @param values content of the grid
   * @returns an HTML canvas of the grid
   */
  public static getGridPreview(
    values: (number | undefined)[]
  ): HTMLImageElement {
    const imgCache = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    // Use the HTML Canvas API to fill the canvas, API examples:
    const tileSize = 110;
    canvas.width = 1000;
    canvas.height = 1000;

    let earl = '';
    earl += "url('../../../assets/BodoAmat.ttf')format('woff2')";
    let f = new FontFace('jelleBodoebold', earl);
    f.load().then(function () {
      ctx.font = '100px Bodo';
      ctx.fillStyle = 'black';

      for (let i = 0; i < values.length; i++) {
        ctx.fillText(
          values[i]?.toString() ?? '',
          (i % 9) * tileSize + 30,
          Math.floor(i / 9) * tileSize + 85
        );
      }
      for (let i = 1; i < 9; i++) {
        ctx.moveTo(i * tileSize, 0);
        ctx.lineTo(i * tileSize, canvas.height);
        ctx.moveTo(0, i * tileSize);
        ctx.lineTo(canvas.width, i * tileSize);
      }
      ctx.stroke(); // Draw the content

      imgCache.src = canvas.toDataURL('image/png');
    });
    return imgCache;
  }
}
