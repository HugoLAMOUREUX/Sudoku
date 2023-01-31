import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalGridComponent } from './global-grid.component';

describe('GlobalGridComponent', () => {
  let component: GlobalGridComponent;
  let fixture: ComponentFixture<GlobalGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
