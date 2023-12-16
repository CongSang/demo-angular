import { Component, OnInit } from '@angular/core';
import { IPost, IPostResponse } from '../../models/post';
import { ICommentResponse } from '../../models/comment';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import moment from 'moment';
import { CommentFormComponent } from '../../comments/comment-form/comment-form.component';
import { CommentListComponent } from '../../comments/comment-list/comment-list.component';
import { PostCardComponent } from '../../layouts/post-card/post-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-post',
  standalone: true,
  imports: [CommentFormComponent, CommentListComponent, PostCardComponent, CommonModule],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.scss'
})
export class SinglePostComponent implements OnInit {

  postDetail?: IPost;
  similarPosts: IPostResponse[] = [];
  imageError: boolean = false;
  newComment?: ICommentResponse | null | undefined = null;

  constructor(private postsService: PostsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((value) => {
      this.postsService.getPostById(value['id']).then((data) => {
        this.postDetail = { ...data, views: data.views + 1 };
        
        this.postsService.countViews(value['id'], this.postDetail.views)

        this.onGetSimilarPosts(data.category.categoryId, value['id']);
      })
    })
  }

  onGetSimilarPosts(id: string, postId: string) {
    this.postsService.getSimilarPosts(id).subscribe((data) => {
      this.similarPosts = data?.filter((item: IPostResponse) => item.id === postId);
    });
  }

  onErrorImage(event: any) {
    if (event) {
      this.imageError = true;
    }
  }

  onReturnDate(value: any) {
    let time = value?.toDate();
    return moment(time).startOf('seconds').fromNow();
  }

  onSubmit(event: any) {
    this.newComment = event;
  }
}
