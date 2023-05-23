import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/models/post';
import { CategoryService } from 'src/app/services/category.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.less'],
})
export class NewPostComponent {
  imgSrc: string = './assets/image-placeholder.png';
  imgFile: File | undefined;
  postForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(10)]),
    permalink: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    excerpt: new FormControl('', [
      Validators.required,
      Validators.minLength(50),
    ]),
    content: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    postImg: new FormControl('', [Validators.required]),
  });

  categories$ = this.categoryService.loadData();

  constructor(
    private postService: PostsService,
    private categoryService: CategoryService
  ) {}

  showFormErrors(field: string): string | void {
    const targetField = this.postForm.get(field);
    if (targetField?.touched && !targetField.valid) {
      if (targetField.errors?.['required']) {
        return field[0].toUpperCase() + field.slice(1) + ' is required';
      }
      if (targetField.errors?.['minlength']) {
        return (
          field[0].toUpperCase() +
          field.slice(1) +
          ' must be at least ' +
          targetField.errors?.['minlength'].requiredLength +
          ' characters long'
        );
      }
    }
  }

  generatePermalink($event: Event): void {
    const link = ($event.target as HTMLInputElement).value;
    this.postForm.patchValue({
      permalink: link
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, ''),
    });
  }

  showPreview($event: Event): void {
    this.imgFile = ($event.target as HTMLInputElement).files?.[0];
    if (this.imgFile) {
      const reader = new FileReader();
      reader.onload = () => (this.imgSrc = reader.result as string);
      reader.readAsDataURL(this.imgFile);
    }
  }

  onSubmit(): void {
    this.postForm.get('permalink')!.enable();
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: this.postForm.value.category.split('-')[0],
        category: this.postForm.value.category.split('-')[1],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    };
    this.postForm.get('permalink')!.disable();
    this.postService.uploadImage(this.imgFile!);
  }
}
