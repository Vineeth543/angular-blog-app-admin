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

  uploadImage(file: File, postData: Post): void {
    const filePath = `postIMG/${Date.now()}-${file.name}`;
    this.storage
      .upload(filePath, file)
      .then(() =>
        this.storage
          .ref(filePath)
          .getDownloadURL()
          .subscribe((url) => {
            postData.postImgPath = url;
            this.saveData(postData);
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
}
