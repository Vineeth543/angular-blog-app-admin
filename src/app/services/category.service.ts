import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Category } from '../models/category';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private afs: AngularFirestore, private toastr: ToastrService) {}

  saveData(categoryData: Category): void {
    this.afs
      .collection('categories')
      .add(categoryData)
      .then((docRef) => {
        console.log('Document written: ', docRef);
        this.toastr.success('Category added successfully');
      })
      .catch((error) => console.error('Error adding document: ', error));
  }
}
