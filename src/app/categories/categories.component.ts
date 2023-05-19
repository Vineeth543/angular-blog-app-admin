import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.less'],
})
export class CategoriesComponent implements OnInit {
  constructor(private afs: AngularFirestore) {}

  ngOnInit(): void {}

  onSubmit(formData: NgForm): void {
    let subcategoriesData = {
      subCategory: 'subCategory2',
    };
    this.afs
      .collection('categories')
      .add(formData.value)
      .then((docRef) => {
        console.log('Document written: ', docRef);
        this.afs
          .collection('categories')
          .doc(docRef.id)
          .collection('subcategories')
          .add(subcategoriesData)
          .then((docRef) => console.log('Document written: ', docRef));
      })
      .catch((error) => console.error('Error adding document: ', error));
  }
}
