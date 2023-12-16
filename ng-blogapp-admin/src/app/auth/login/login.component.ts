import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ILogin } from '../../models/login';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private location: Location) { 
    if (
      this.authService.isLoggedIn ||
      (localStorage.getItem('user') && localStorage.getItem('user') !== 'null')
    ) {
      this.location.back();
    } 
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onValidateField(field: string, type: string) {
    return (this.loginForm.controls[field].errors?.[type] && 
          this.loginForm.controls[field].touched && 
          this.loginForm.controls[field].invalid)
  }

  onSubmit() {
    const data: ILogin = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }

    this.authService.login(data)
  }
}