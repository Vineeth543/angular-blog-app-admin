import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.less'],
})
export class NewPostComponent {
  permalink!: string;
  imgSrc: string = './assets/image-placeholder.png';
  postForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    permalink: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    excerpt: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  });

  categories$ = this.categoryService.loadData();

  constructor(private categoryService: CategoryService) {}

  generatePermalink($event: Event): void {
    const title = ($event.target as HTMLInputElement).value;
    this.permalink = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  showPreview($event: Event): void {
    const file = ($event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.imgSrc = reader.result as string);
      reader.readAsDataURL(file);
    }
  }
}
