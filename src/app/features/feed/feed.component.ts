import { Component, inject, OnInit } from '@angular/core';
import { PostComponent } from '../../shared/ui/post/post.component';
import { PostsService } from '../../core/services/posts.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-feed',
  imports: [PostComponent, ReactiveFormsModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  private readonly posts = inject(PostsService);

  postList: Post[] = [];

  saveFile!: File;

  imgUrl: string | ArrayBuffer | null | undefined = '';

  content: FormControl = new FormControl();
  privacy: FormControl = new FormControl('public');

  postBtnCheck: boolean = this.content.value !== null && this.imgUrl !== '' ? false : true;

  userName: String = JSON.parse(localStorage.getItem('socialUser')!)?.name;

  userId: string = JSON.parse(localStorage.getItem('socialUser')!)?._id;

  userImg: string = JSON.parse(localStorage.getItem('socialUser')!)?.photo;

  ngOnInit(): void {
    this.getHomePostsData();
  }

  getAllPostsData(): void {
    this.posts.getAllPosts().subscribe({
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

  getHomePostsData(): void {
    this.posts.getHomePosts().subscribe({
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

  userPostsData(userId: string): void {
    this.posts.userPosts(userId).subscribe({
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

  getBookmarksPostsData(): void {
    this.posts.getBookmarksPosts().subscribe({
      next: (res) => {
        console.log(res.data);
        this.postList = res.data.bookmarks;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  changeImg(e: Event) {
    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      // console.log(input.files[0]);
      this.saveFile = input.files[0];
      this.readFile(this.saveFile);
    }
  }

  readFile(file: File): void {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      this.imgUrl = e.target?.result;
    };
  }

  clearPreview(e: PointerEvent): void {
    e.preventDefault();
    this.imgUrl = '';
  }

  submitForm(e: SubmitEvent, form: HTMLFormElement): void {
    e.preventDefault();
    // console.log(this.content.value);
    // console.log(this.privacy.value);
    // console.log(this.saveFile);

    const formData = new FormData();
    if (this.content.value) formData.append('body', this.content.value);
    if (this.privacy.value) formData.append('privacy', this.privacy.value);
    if (this.saveFile) formData.append('image', this.saveFile);

    this.posts.createPost(formData).subscribe({
      next: (res) => {
        // console.log(res);
        if (res.success) {
          form.reset();
          this.imgUrl = '';
          this.getHomePostsData();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deletePostItem(postId: string) {
    this.posts.deletePost(postId).subscribe({
      next: (res) => {
        // console.log(res);
        if (res.success) {
          this.getHomePostsData();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
