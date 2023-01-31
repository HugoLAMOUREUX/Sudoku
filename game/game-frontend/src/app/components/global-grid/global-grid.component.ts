import { Component, HostListener, OnInit } from '@angular/core';
import { PartialPointBinder, TreeUndoHistory } from 'interacto';
import { PartialMatSelectBinder } from 'interacto-angular';
import { SetValue } from 'src/app/command/set-value';
import { GameService } from 'src/app/services/game-service.service';
import { GridService } from 'src/app/services/grid-service.service';

@Component({
  selector: 'app-global-grid',
  templateUrl: './global-grid.component.html',
  styleUrls: ['./global-grid.component.css'],
})
export class GlobalGridComponent implements OnInit {
  constructor(
    public gridService: GridService,
    public gameService: GameService,
    private undoHistory: TreeUndoHistory
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.undoHistory.clear();
  }

  // Interacto binding that maps the selection of a value in an Angular Material Select
  // for producing an undoable command SetValue
  public setValue(binder: PartialMatSelectBinder, index: number) {
    binder
      .toProduce(
        (i) =>
          new SetValue(i.change?.value, index, this.gameService.currentGame)
      )
      .bind();
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }

  // Interacto binding that maps a click with the right button on an Angular Material Select
  // for producing an undoable command SetValue that durectly uses the first suggested value
  public directSet(binder: PartialPointBinder, index: number) {
    binder
      .toProduce(
        () =>
          new SetValue(
            this.gameService.currentGame.suggestions.get(index)![0],
            index,
            this.gameService.currentGame
          )
      )
      .when((i) => i.button === 2)
      .bind();
  }

  public get gridBooleanValues() {
    return this.gameService.currentGame.booleanValues;
  }

  public get showSuggestions() {
    return this.gameService.currentGame.showSuggestions;
  }

  public get gridSuggestions() {
    return this.gameService.currentGame.gridSuggestions;
  }

  public get values() {
    return this.gameService.currentGame.values;
  }
}
