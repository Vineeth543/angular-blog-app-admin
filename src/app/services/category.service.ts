import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Category } from '../models/category';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

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
      .then((docRef) => {
        console.log('Document written: ', docRef);
        this.toastr.success('Category added successfully');
      })
      .catch((error) => console.error('Error adding document: ', error));
  }
}
