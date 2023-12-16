import { Component, OnInit } from '@angular/core';
import { IPostResponse } from '../../models/post';
import { PostsService } from '../../services/posts.service';
import { PostCardComponent } from '../../layouts/post-card/post-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostCardComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  featuredPostList: Array<IPostResponse> = [];
  latestPostList: Array<IPostResponse> = [];

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.postsService.getFeaturedPosts().subscribe((value) => {
      this.featuredPostList = value;
    })

    this.postsService.getLatestPosts().subscribe((value) => {
      this.latestPostList = value;
    })
  }

}
