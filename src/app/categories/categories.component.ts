import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.less'],
})
export class CategoriesComponent {
  categoryId!: string;
  formCategory!: string;
  formStatus: string = 'Add';

  constructor(private categoryService: CategoryService) {}

  categories$ = this.categoryService.loadData();

  onSubmit(formData: NgForm): void {
    if (this.formStatus === 'Add') {
      this.categoryService.saveData(formData.value);
    } else if (this.formStatus === 'Update') {
      this.categoryService.updateData(this.categoryId, formData.value);
      this.formStatus = 'Add';
    }
    formData.resetForm();
  }

  onUpdate(category: string, categoryId: string): void {
    this.formCategory = category;
    this.categoryId = categoryId;
    this.formStatus = 'Update';
  }

  onDelete(categoryId: string): void {
    this.categoryService.deleteData(categoryId);
  }
}
