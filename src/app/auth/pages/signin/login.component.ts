import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,

    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      userId: [20240351, [Validators.required]],
      password: ['admin123', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['home']);
    } 
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let loginPayload = {
        userId: this.loginForm.value.userId,
        password: this.loginForm.value.password,
      };

      this.authService.login(loginPayload).subscribe({
        next: (resp) => {
          // console.log('login succesful', resp);
          this.authService.sessionStart();
          this.router.navigate(['home']);
        },
        error: (error) => {
          console.error('login error', error);
        },
      });
    } else {
      console.log('form is invalid');
    }
  }
}
