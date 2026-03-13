import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  public readonly auth = inject(AuthService);
  public readonly router = inject(Router);
  public readonly fb = inject(FormBuilder);

  loading: boolean = false;
  changeSubscribe: Subscription = new Subscription();
  msgError: string = '';

  changeForm: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: ['', [Validators.required]],
    },
    { validators: [this.confirmPassword] },
  );

  submitForm() {
    if (this.changeForm.valid) {
      this.changeSubscribe.unsubscribe();
      this.loading = true;
      const { password, newPassword } = this.changeForm.value;

      const payload = {
        password: password,
        newPassword: newPassword,
      };
      this.changeSubscribe = this.auth.changePassword(payload).subscribe({
        next: (res) => {
          // console.log(res);
          localStorage.setItem('socialToken', '');
          this.router.navigate(['/login']);
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
      this.changeForm.markAllAsTouched();
    }
  }

  showPass(e: HTMLInputElement): void {
    e.type = e.type === 'password' ? 'text' : 'password';
  }

  confirmPassword(g: AbstractControl) {
    const newPassword = g.get('newPassword')?.value;
    const rePassword = g.get('rePassword')?.value;
    if (newPassword !== rePassword && rePassword !== '') {
      g.get('rePassword')?.setErrors({ missmatch: true });
      return { missmatch: true };
    }
    return null;
  }
}
