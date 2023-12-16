import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import moment from 'moment';
import { ICommentResponse } from '../../models/comment';
import { CommentService } from '../../services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommentReplyFormComponent } from '../comment-reply-form/comment-reply-form.component';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, CommentReplyFormComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss'
})
export class CommentListComponent implements OnInit, OnChanges {

  @Input() newComment?: ICommentResponse | null | undefined;

  latestComment: any = null;
  commentList: Array<ICommentResponse> = [];
  isLoadMore: boolean = false;
  loading: boolean = false;
  totalComments: number = 0;

  constructor(private commentService: CommentService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((value) => {
      this.commentService.countComment(value['id']).subscribe((res) => {
        this.totalComments = res.length;
      })

      this.commentService.getComments(value['id']).then((data) => {
        if (data.empty) {
          this.isLoadMore = false;
        } else {
          if (data.docs.length < 5) {
            this.isLoadMore = false;
          } else {
            this.isLoadMore = true;
          }

          let parse =  data.docs.map((cmt: any): ICommentResponse => {
            const data = cmt.data();
            const id = cmt.id;
  
            return { id, data }
          })

          this.commentList = parse;
          this.latestComment = data.docs[data.docs.length - 1];
        }
      })

    })
  }

  onLoadMoreComments() {
    this.loading = true;

    this.route.params.subscribe((value) => {
      this.commentService.loadMoreComments(value['id'], this.latestComment).then((data) => {
        if (data.empty) {
          this.isLoadMore = false;
        } else {
          if (data.docs.length < 5) {
            this.isLoadMore = false;
          } else {
            this.isLoadMore = true;
          }

          let parse =  data.docs.map((cmt: any): ICommentResponse => {
            const data = cmt.data();
            const id = cmt.id;
  
            return { id, data }
          })

          this.commentList = [...this.commentList, ...parse];
          this.latestComment = data.docs[data.docs.length - 1];
        }
      }).finally(() => {
        this.loading = false;
      })

    })
  }

  onReturnDate(value: any) {
    let time = value?.toDate();
    return moment(time).startOf('seconds').fromNow();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['newComment'].currentValue) {
      this.commentList = [changes['newComment'].currentValue, ...this.commentList]
    }
  }

}
