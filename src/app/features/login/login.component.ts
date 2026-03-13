import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public readonly auth = inject(AuthService);
  public readonly router = inject(Router);
  public readonly fb = inject(FormBuilder);

  loading: boolean = false;
  registerSubscribe: Subscription = new Subscription();
  msgError: string = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ],
    ],
  });

  submitForm() {
    if (this.loginForm.valid) {
      this.registerSubscribe.unsubscribe();
      this.loading = true;
      this.registerSubscribe = this.auth.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          // console.log(res);
          localStorage.setItem('socialToken', res.data.token);
          localStorage.setItem('socialUser', JSON.stringify(res.data.user));
          this.router.navigate(['/feed']);
        },
        error: (err: HttpErrorResponse) => {
          // console.log(err);

          this.msgError = err.error.message;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  showPass(e: HTMLInputElement): void {
    e.type = e.type === 'password' ? 'text' : 'password';
  }
}
