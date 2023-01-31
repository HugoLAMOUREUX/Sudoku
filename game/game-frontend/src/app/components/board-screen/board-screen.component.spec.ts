import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardScreenComponent } from './board-screen.component';

describe('BoardScreenComponent', () => {
  let component: BoardScreenComponent;
  let fixture: ComponentFixture<BoardScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
