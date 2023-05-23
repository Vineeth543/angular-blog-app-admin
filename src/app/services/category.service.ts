import { map } from 'rxjs';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../models/category';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private afs: AngularFirestore, private toastr: ToastrService) {}

  loadData() {
    return this.afs
      .collection('categories')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const id = a.payload.doc.id;
            const data = a.payload.doc.data() as Category;
            return { id, data };
          })
        )
      );
  }

  saveData(categoryData: Category): void {
    this.afs
      .collection('categories')
      .add(categoryData)
      .then(() => this.toastr.success('Category added successfully. 😊'))
      .catch(() => this.toastr.error('Error while adding category. 😭'));
  }

  updateData(categoryId: string, categoryData: Category): void {
    this.afs
      .doc(`categories/${categoryId}`)
      .set(categoryData)
      .then(() => this.toastr.success('Category updated successfully. 😊'))
      .catch(() => this.toastr.error('Error while updating category. 😭'));
  }

  deleteData(categoryId: string): void {
    this.afs
      .doc(`categories/${categoryId}`)
      .delete()
      .then(() => this.toastr.success('Category deleted successfully. 😊'))
      .catch(() => this.toastr.error('Error while deleting category. 😭'));
  }
}
