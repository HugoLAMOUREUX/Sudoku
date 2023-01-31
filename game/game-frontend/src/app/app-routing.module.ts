import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardScreenComponent } from './components/board-screen/board-screen.component';
import { HomeScreenComponent } from './components/home-screen/home-screen.component';

const routes: Routes = [
  {path:"",component:HomeScreenComponent},
  {path:"board",component:BoardScreenComponent},
  {path:"menu",component:HomeScreenComponent},
  {path:"**",component:HomeScreenComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
