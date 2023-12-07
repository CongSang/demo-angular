import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILogin } from 'src/app/models/login';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

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
