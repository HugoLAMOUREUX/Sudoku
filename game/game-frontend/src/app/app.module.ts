import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { InteractoModule, interactoTreeUndoProviders } from 'interacto-angular';
import { GlobalGridComponent } from './components/global-grid/global-grid.component';
import { GameService } from './services/game-service.service';
import { GridService } from './services/grid-service.service';
import { HomeScreenComponent } from './components/home-screen/home-screen.component';
import { BoardScreenComponent } from './components/board-screen/board-screen.component';
import { GameEndedMenuComponent } from './components/game-ended-menu/game-ended-menu.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { RankingTableComponent } from './components/ranking-table/ranking-table.component';
import { MatSortModule } from '@angular/material/sort';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';

@NgModule({
  declarations: [
    AppComponent,
    GlobalGridComponent,
    HomeScreenComponent,
    BoardScreenComponent,
    GameEndedMenuComponent,
    RankingComponent,
    RankingTableComponent,
    SuggestionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InteractoModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    MatCheckboxModule,
    RouterModule,
    ReactiveFormsModule,
    MatSortModule,
  ],
  providers: [interactoTreeUndoProviders(true), GameService, GridService],
  bootstrap: [AppComponent],
})
export class AppModule {}
