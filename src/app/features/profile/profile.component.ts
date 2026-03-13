import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { DatePipe } from '@angular/common';
import { PostsService } from '../../core/services/posts.service';
import { PostComponent } from '../../shared/ui/post/post.component';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, PostComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly AuthService = inject(AuthService);
  private readonly postsService = inject(PostsService);

  userImg: string = JSON.parse(localStorage.getItem('socialUser')!)?.photo;
  user: User = {} as User;
  postList: Post[] = [];

  ngOnInit(): void {
    this.getMyProfileData();
  }

  getMyProfileData(): void {
    this.AuthService.getMyProfile().subscribe((res) => {
      this.user = res.data.user;
      this.userPostsData(this.user._id);
    });
  }

  userPostsData(userId: string): void {
    this.postsService.userPosts(userId).subscribe({
      next: (res) => {
        // console.log(res.data);
        this.postList = res.data.posts;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  deletePostItem(postId: string) {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        // console.log(res);
        if (res.success) {
          this.getMyProfileData();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
