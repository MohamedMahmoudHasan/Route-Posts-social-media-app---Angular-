import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public readonly httpClient = inject(HttpClient);

  getNotification(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + '/notifications?unread=true&page=1&limit=10');
  }
}
