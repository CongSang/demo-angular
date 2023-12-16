import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { ICategoryResponse } from '../../models/category';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './category-navbar.component.html',
  styleUrl: './category-navbar.component.scss'
})
export class CategoryNavbarComponent implements OnInit {

  categoryList: Array<ICategoryResponse> = [];

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((value) => {
      this.categoryList = value;
    })
  }
}
