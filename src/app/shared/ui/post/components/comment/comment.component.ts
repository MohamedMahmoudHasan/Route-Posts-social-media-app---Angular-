import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommentService } from './services/comment.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../../../pipes/time-ago-pipe';

@Component({
  selector: 'app-comment',
  imports: [ReactiveFormsModule, TimeAgoPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent implements OnInit {
  private readonly comment = inject(CommentService);

  userName: String = JSON.parse(localStorage.getItem('socialUser')!)?.['username'];
  userImg: String = JSON.parse(localStorage.getItem('socialUser')!)?.['photo'];

  commentList: Comment[] = [];

  @Input() postId: string = '';

  @Output() setCommentsCount: EventEmitter<number> = new EventEmitter();

  imgUrl: string | ArrayBuffer | null | undefined = '';
  content: FormControl = new FormControl();
  saveFile!: File;

  userId: string = '';

  commentEdit: boolean = false;
  commentId: string = '';
  commentPost: string = '';
  commentEditImg: string = '';

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('socialUser')!)?._id;
    this.getAllComments();
  }

  getAllComments(): void {
    this.comment.getPostComment(this.postId).subscribe({
      next: (res) => {
        // console.log(res);
        this.commentList = res.data.comments;
        this.emitCommentLength();
      },
      error: (err) => {
        console.log(err);
      },
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

  submitForm(e: SubmitEvent, form: HTMLFormElement): void {
    e.preventDefault();
    const formData = new FormData();
    if (this.commentEdit) {
      if (this.content.value) {
        formData.append('content', this.content.value);
        // formData.append('image', this.commentEditImg);
        this.comment.updateComment(this.commentPost, this.commentId, formData).subscribe((res) => {
          this.getAllComments();
          form.reset();
          this.commentEdit = false;
        });
      }
    } else {
      if (this.content.value) formData.append('content', this.content.value);
      if (this.saveFile) formData.append('image', this.saveFile);

      this.comment.creatComment(this.postId, formData).subscribe({
        next: (res) => {
          if (res.success) {
            form.reset();
            this.imgUrl = '';
            this.getAllComments();
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {},
      });
    }
  }

  clearPreview(e: PointerEvent): void {
    e.preventDefault();
    this.imgUrl = '';
  }

  emitCommentLength() {
    this.setCommentsCount.emit(this.commentList.length);
  }

  editComment(commentValue: string, commentId: string, postId: string, commentImg: string): void {
    this.content.setValue(commentValue);
    this.commentEdit = true;
    this.commentId = commentId;
    this.commentPost = postId;
    this.commentEditImg = commentImg;
  }

  deleteComment(commentId: string, postId: string): void {
    this.comment.deleteComment(postId, commentId).subscribe(() => {
      this.getAllComments();
    });
  }

  // updateComment(e: SubmitEvent, form: HTMLFormElement): void {}
}
