import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { MatModule } from 'src/app/mat/mat.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports:[MatModule,HttpClientModule,ReactiveFormsModule,FormsModule,BrowserModule,
        AppRoutingModule,BrowserAnimationsModule]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Loading behavior', () => {
    expect(component).toBeTruthy();
    expect(component.isLoading).toBe(false);
    let testForm = new NgForm([], []);
 
    setTimeout(() => {
      testForm.setValue({
        email: "amank@dox2u.com",
        password: "Test@123"
      });
      component.onLogIn(testForm);
      expect(component.isLoading).toBe(true);
    },500);
  });

  it('service Testing', () => {
    expect(component).toBeTruthy();
  });
});
