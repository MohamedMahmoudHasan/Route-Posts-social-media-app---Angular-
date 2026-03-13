import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { PostsService } from '../../../core/services/posts.service';
import { CommentComponent } from './components/comment/comment.component';
import { RouterLink } from '@angular/router';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-post',
  imports: [CommentComponent, RouterLink, TimeAgoPipe, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly renderer = inject(Renderer2);
  @Input({ required: true }) post!: Post;
  @Output() deleteItemId: EventEmitter<string> = new EventEmitter();
  userId: string = '';

  postEdit: boolean = false;

  @ViewChild('commentCount') commentCount!: ElementRef;
  @ViewChild('likeBtn') likeBtn!: ElementRef;
  @ViewChild('likeCount') likeCount!: ElementRef;

  content: FormControl = new FormControl();

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('socialUser')!)?._id;
  }

  deletePostItem(postId: string) {
    this.deleteItemId.emit(postId);
  }

  updateCount(count: number): void {
    this.commentCount.nativeElement.innerText = count;
  }
  editPost(): void {
    this.content.setValue(this.post.body);
    this.postEdit = true;
  }

  updatePost(e: SubmitEvent, form: HTMLFormElement): void {
    e.preventDefault();
    const formData = new FormData();

    if (this.content.value) {
      formData.append('body', this.content.value);
      formData.append('image', this.post.image);
      // formData.append('privcy', this.post.privacy);
      this.postsService.updatePost(this.post.id, formData).subscribe((res) => {
        // console.log(res);
        this.post.body = this.content.value;
        form.reset();
        this.postEdit = false;
      });
    }
  }

  likePost(postId: string): void {
    this.postsService.likePost(postId).subscribe((res) => {
      this.likeBtn.nativeElement.classList.toggle('text-rose-600');
      this.likeCount.nativeElement.innerText = res.data.likesCount;
    });
  }
}
