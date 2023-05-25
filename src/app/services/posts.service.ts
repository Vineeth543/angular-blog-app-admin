import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/post';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private storage: AngularFireStorage
  ) {}

  uploadImage(
    file: File,
    postId: string,
    postData: Post,
    formStatus: string
  ): void {
    const filePath = `postIMG/${Date.now()}-${file.name}`;
    this.storage
      .upload(filePath, file)
      .then(() =>
        this.storage
          .ref(filePath)
          .getDownloadURL()
          .subscribe((url) => {
            postData.postImgPath = url;
            if (formStatus === 'Update') {
              this.updatePost(postId, postData);
            } else {
              this.saveData(postData);
            }
          })
      )
      .catch(() => this.toastr.error('Error while uploading image. 😭'));
  }

  saveData(postData: Post): void {
    this.afs
      .collection('posts')
      .add(postData)
      .then(() => {
        this.toastr.success('Post added successfully. 😊');
        this.router.navigate(['/posts']);
      })
      .catch(() => this.toastr.error('Error while adding post. 😭'));
  }

  loadData() {
    return this.afs
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const id = a.payload.doc.id;
            const data = a.payload.doc.data() as Post;
            return { id, data };
          })
        )
      );
  }

  loadPostById(postId: string): Observable<Post> {
    return <Observable<Post>>this.afs.doc(`posts/${postId}`).valueChanges();
  }

  updatePost(postId: string, postData: Post): void {
    this.afs
      .doc(`posts/${postId}`)
      .update(postData)
      .then(() => {
        this.router.navigate(['/posts']);
        this.toastr.success('Post updated successfully. 😊');
      })
      .catch(() => this.toastr.error('Error while updating post. 😭'));
  }

  deleteImage(postId: string, postImgPath: string): void {
    this.storage.storage
      .refFromURL(postImgPath)
      .delete()
      .then(() => this.deletePost(postId))
      .catch(() => this.toastr.error('Error while deleting image. 😭'));
  }

  deletePost(postId: string): void {
    this.afs
      .doc(`posts/${postId}`)
      .delete()
      .then(() => this.toastr.warning('Post deleted successfully. 😊'))
      .catch(() => this.toastr.error('Error while deleting post. 😭'));
  }

  markFeatured(postId: string, isFeatured: boolean): void {
    this.afs
      .doc(`posts/${postId}`)
      .update({ isFeatured: isFeatured })
      .then(() => this.toastr.info('Featured status updated successfully. 😊'))
      .catch(() => this.toastr.error('Error while updating post. 😭'));
  }
}
