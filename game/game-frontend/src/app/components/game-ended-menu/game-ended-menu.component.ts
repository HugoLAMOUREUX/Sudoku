import { Component, HostListener, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game-service.service';

@Component({
  selector: 'app-game-ended-menu',
  templateUrl: './game-ended-menu.component.html',
  styleUrls: ['./game-ended-menu.component.css'],
})
export class GameEndedMenuComponent implements OnInit {
  constructor(private gameService: GameService) {}

  ngOnInit(): void {}

  public get name() {
    return this.gameService.currentGame.player.name;
  }

  public get score() {
    return this.gameService.currentGame.player.score;
  }

  public endGame() {
    this.gameService.endGame(
      this.gameService._currentGame!.originalValues,
      this.name,
      this.score
    );
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }
}
