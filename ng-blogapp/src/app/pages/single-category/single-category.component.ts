import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../models/category';
import { IPostResponse } from '../../models/post';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { PostCardComponent } from '../../layouts/post-card/post-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-category',
  standalone: true,
  imports: [PostCardComponent, CommonModule],
  templateUrl: './single-category.component.html',
  styleUrl: './single-category.component.scss'
})
export class SingleCategoryComponent implements OnInit {

  category?: ICategory;
  postList: Array<IPostResponse> = [];

  constructor(private postsService: PostsService, private route: ActivatedRoute, private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.route.params.subscribe((value) => {
      this.categoriesService.getCategoryById(value['id']).then((data) => {
        this.category = data;
      })

      this.postsService.getPostsByCategoryId(value['id']).subscribe((data) => {
        this.postList = data;
      })
    })
  }

}
