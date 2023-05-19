import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.less'],
})
export class CategoriesComponent {
  constructor(private categoryService: CategoryService) {}

  onSubmit(formData: NgForm): void {
    this.categoryService.saveData(formData.value);
    formData.resetForm();
  }
}
