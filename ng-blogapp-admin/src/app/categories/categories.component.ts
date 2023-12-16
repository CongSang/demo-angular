import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategoryResponse } from '../models/category';
import { CategoriesService } from '../services/categories.service';
import { ModalService } from '../services/modal.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, RouterLink, AsyncPipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  categoryForm!: FormGroup;
  categoryList: Array<ICategoryResponse> = [];
  formStatus: string = 'Add';
  categoryId: string = '';

  constructor(
    private categoryService: CategoriesService,
    private modalService: ModalService,
    private fb : FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      category: ['', Validators.required],
      description: ['', Validators.required]
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
        description: this.categoryForm.value.description
      }

      if (this.formStatus === 'Add') {
        this.categoryService.createCategory(categoryData);
      } else if (this.formStatus === 'Edit'){
        this.categoryService.updateCategories(this.categoryId, categoryData);
        this.formStatus = 'Add';
        this.categoryId = '';
      }
      
      this.categoryForm.reset();
    }
  }

  onEdit(item: ICategoryResponse) {
    this.formStatus = 'Edit';
    this.categoryForm.controls['category'].setValue(item.data.category);
    this.categoryForm.controls['description'].setValue(item.data.description);
    this.categoryId = item.id;
  }

  onCancelEdit() {
    this.formStatus = 'Add';
    this.categoryForm.reset();
    this.categoryId = '';
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
