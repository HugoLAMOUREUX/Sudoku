import { Component, OnInit } from '@angular/core';
import { UndoableSnapshot } from 'interacto';
import { Game } from 'src/app/classes/game';
import { SetValue } from 'src/app/command/set-value';
import { GameService } from 'src/app/services/game-service.service';

@Component({
  selector: 'app-board-screen',
  templateUrl: './board-screen.component.html',
  styleUrls: ['./board-screen.component.css'],
})
export class BoardScreenComponent implements OnInit {
  game!: Game;
  showRanking: boolean = false;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.game = this.gameService.currentGame;
  }

  public get name(): string {
    return this.game.player.name;
  }

  public get score(): number {
    return this.game.player.score;
  }

  public get gameEnded(): boolean {
    return this.game.ended;
  }

  public changeShowRanking() {
    this.showRanking = !this.showRanking;
    this.gameService.refreshScores();
  }
  public setRankingFalse() {
    this.showRanking = false;
  }

  public updateName(event: any) {
    this.game.player.name = event.target.value;
  }

  public rootRenderer(): UndoableSnapshot {
    return SetValue.getSnapshot(this.gameService.currentGame);
  }
}
