import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibleversionsComponent } from './bibleversions.component';

describe('BibleversionsComponent', () => {
  let component: BibleversionsComponent;
  let fixture: ComponentFixture<BibleversionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibleversionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibleversionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
