import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  header: object = {
    headers: {
      AUTHORIZATION: `Bearer ${localStorage.getItem('socialToken')}`,
    },
  };

  getAllPosts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/posts`, this.header);
  }

  getHomePosts(): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `/posts/feed?only=following&limit=10`,
      this.header,
    );
  }
  getBookmarksPosts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/users/bookmarks`, this.header);
  }

  createPost(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/posts`, data, this.header);
  }

  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/posts/${postId}`, this.header);
  }

  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/posts/${postId}`, this.header);
  }

  likePost(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/posts/${postId}/like`, '');
  }

  userPosts(userId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/users/${userId}/posts`);
  }

  updatePost(postId: string, data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/posts/${postId}`, data);
  }
}
