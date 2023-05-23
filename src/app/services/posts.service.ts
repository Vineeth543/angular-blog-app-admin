import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private toastr: ToastrService,
    private storage: AngularFireStorage
  ) {}

  uploadImage(file: File): void {
    const filePath = `postIMG/${Date.now()}-${file.name}`;
    this.storage
      .upload(filePath, file)
      .then(() => this.toastr.success('Image uploaded successfully..!'))
      .catch((err) => this.toastr.error('Error while uploading image..!'));
  }
}
