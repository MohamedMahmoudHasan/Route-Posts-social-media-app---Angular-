import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly httpClient = inject(HttpClient);

  header: object = {
    headers: {
      AUTHORIZATION: `Bearer ${localStorage.getItem('socialToken')}`,
    },
  };

  getPostComment(postId: string): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `/posts/${postId}/comments?page=1&limit=10`,
      this.header,
    );
  }

  creatComment(postId: string, data: object): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `/posts/${postId}/comments?page=1&limit=10`,
      data,
      this.header,
    );
  }
  updateComment(postId: string, commentId: string, data: object): Observable<any> {
    return this.httpClient.put(
      environment.baseUrl + `/posts/${postId}/comments/${commentId}`,
      data,
      this.header,
    );
  }
  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(
      environment.baseUrl + `/posts/${postId}/comments/${commentId}`,
      this.header,
    );
  }
}
