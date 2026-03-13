import { PostsService } from './../../core/services/posts.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostComponent } from '../../shared/ui/post/post.component';

@Component({
  selector: 'app-details',
  imports: [PostComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  postId: string = '';
  post: Post = {} as Post;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      // console.log(param.get('id'));
      this.postId = param.get('id')!;
      this.getSinglePost();
    });
  }

  getSinglePost(): void {
    this.postsService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        // console.log(res.data.post);
        this.post = res.data.post;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
