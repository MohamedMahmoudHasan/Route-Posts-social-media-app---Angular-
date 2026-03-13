import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly httpClient = inject(HttpClient);
  public readonly router = inject(Router);

  signIn(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/users/signin', data);
  }

  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/users/signup', data);
  }

  changePassword(data: object): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + '/users/change-password', data);
  }

  signOut(): void {
    localStorage.removeItem('socialToken');
    this.router.navigate(['/login']);
  }

  getMyProfile(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + '/users/profile-data');
  }
}
