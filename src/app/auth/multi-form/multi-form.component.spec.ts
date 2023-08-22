import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFormComponent } from './multi-form.component';

describe('MultiFormComponent', () => {
  let component: MultiFormComponent;
  let fixture: ComponentFixture<MultiFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiFormComponent]
    });
    fixture = TestBed.createComponent(MultiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
