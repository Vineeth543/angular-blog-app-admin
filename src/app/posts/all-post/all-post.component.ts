import { Component } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.less'],
})
export class AllPostComponent {
  posts$ = this.postService.loadData().pipe();

  constructor(private postService: PostsService) {}

  formatDate(date: any): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date.seconds * 1000));
  }
}
