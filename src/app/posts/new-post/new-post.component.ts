import { Observable, of, tap } from 'rxjs';
import { Post } from 'src/app/models/post';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { CategoryService } from 'src/app/services/category.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.less'],
})
export class NewPostComponent implements OnInit {
  imgFile!: File;
  postId!: string;
  isLoad: boolean = true;
  post$!: Observable<Post>;
  formStatus: string = 'Add';
  imgSrc: string = './assets/image-placeholder.png';
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
    private route: ActivatedRoute,
    private postService: PostsService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(({ id }) => (this.postId = id));
    this.postId && this.getPostData();
    !this.postId && (this.post$ = of({} as Post));
  }

  getPostData(): void {
    this.post$ = this.postService.loadPostById(this.postId).pipe(
      tap((post: Post) => {
        console.log(post);
        this.postForm.patchValue({
          title: post.title,
          permalink: post.permalink,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category.categoryId + '-' + post.category.category,
        });
        this.imgSrc = post.postImgPath;
        this.formStatus = 'Update';
        this.isLoad = false;
      })
    );
  }

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
    this.imgFile = ($event.target as HTMLInputElement).files?.[0]!;
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
    this.postService.uploadImage(this.imgFile!, postData);
    this.postForm.reset();
    this.imgSrc = './assets/image-placeholder.png';
  }
}
