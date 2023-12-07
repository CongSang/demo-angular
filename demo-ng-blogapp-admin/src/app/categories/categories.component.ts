
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ICategoryResponse } from '../models/category';
import { CategoriesService } from '../services/categories.service';
import { ModalService } from '../services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categoryForm!: FormGroup;
  categoryList: Array<ICategoryResponse> = [];
  formStatus: string = 'Add';
  categoryId: string = null;

  constructor(
    private categoryService: CategoriesService,
    private modalService: ModalService,
    private fb : FormBuilder
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      category: ['', Validators.required]
    });

    this.categoryService.getCategories().subscribe((value) => {
      this.categoryList = value;
    });
  }

  onValidateField(field: string) {
    return this.categoryForm.controls[field].touched && this.categoryForm.controls[field].invalid
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      let categoryData = {
        category: this.categoryForm.value.category,
      }

      if (this.formStatus === 'Add') {
        this.categoryService.createCategory(categoryData);
      } else if (this.formStatus === 'Edit'){
        this.categoryService.updateCategories(this.categoryId, categoryData);
        this.formStatus = 'Add';
        this.categoryId = null;
      }
      
      this.categoryForm.reset();
    }
  }

  onEdit(item: ICategoryResponse) {
    this.formStatus = 'Edit';
    this.categoryForm.controls['category'].setValue(item.data.category);
    this.categoryId = item.id;
  }

  onDelete(item: ICategoryResponse, ref: TemplateRef<any>) {
    this.modalService.open(
      ref, 
      'Confirm', 
      `Are you sure to delete category <span class='text-theme'>${item.data.category}</span>?`
    ).subscribe((action) => {
      if (action === 'confirm') {
        this.categoryService.deleteCategory(item.id);
      }
    });
  }
}
