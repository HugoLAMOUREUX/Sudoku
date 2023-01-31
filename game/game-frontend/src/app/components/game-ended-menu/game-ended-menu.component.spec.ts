import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEndedMenuComponent } from './game-ended-menu.component';

describe('GameEndedMenuComponent', () => {
  let component: GameEndedMenuComponent;
  let fixture: ComponentFixture<GameEndedMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameEndedMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEndedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
