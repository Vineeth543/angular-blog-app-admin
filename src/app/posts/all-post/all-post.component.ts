import { tap } from 'rxjs';
import { Component } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.less'],
})
export class AllPostComponent {
  isLoad: boolean = true;
  posts$ = this.postService.loadData().pipe(tap(() => (this.isLoad = false)));

  constructor(private postService: PostsService) {}

  formatDate(date: any): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date.seconds * 1000));
  }

  onDelete(postId: string, postImgPath: string): void {
    if (confirm('Are you sure to delete this post?')) {
      this.postService.deleteImage(postId, postImgPath);
    }
  }
}
