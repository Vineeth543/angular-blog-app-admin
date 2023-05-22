import { Component } from '@angular/core';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.less'],
})
export class NewPostComponent {
  permalink!: string;

  generatePermalink($event: Event): void {
    const title = ($event.target as HTMLInputElement).value;
    this.permalink = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}
