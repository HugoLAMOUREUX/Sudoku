import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { HighScore } from 'src/app/models/high-score.model';
import { GameService } from 'src/app/services/game-service.service';

@Component({
  selector: 'app-ranking-table',
  templateUrl: './ranking-table.component.html',
  styleUrls: ['./ranking-table.component.css'],
})
export class RankingTableComponent implements OnInit {
  ranks: HighScore[] = [];
  sortedData: HighScore[] = [];

  constructor(private gameService: GameService) {
    this.fillData();
  }

  ngOnInit(): void {}

  public fillData() {
    this.ranks = this.gameService.currentGame.ranks;
    this.ranks.forEach((element) => {
      element.rank = this.getRank(element.score);
    });
    this.sortedData = this.ranks.slice();
  }

  public getRank(score: number): number {
    let resRank: number = 1;
    this.ranks.forEach(function (value) {
      if (value.score < score) resRank++;
    });
    return resRank;
  }

  sortData(sort: Sort) {
    const data = this.ranks.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'rank':
          return compare(a.rank, b.rank, isAsc);
        case 'score':
          return compare(a.score, b.score, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
