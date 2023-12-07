import { IPost, IPostResponse } from 'src/app/models/post';
import { PostsService } from './../../services/posts.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.scss']
})
export class AllPostComponent implements OnInit {

  postList: Array<IPostResponse> = [];

  constructor(private postsService: PostsService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.postsService.getPosts().subscribe((value) => {
      this.postList = value;
    })
  }

  onDelete(path: string, id: string, ref: TemplateRef<any>) {
    this.modalService.open(
      ref, 
      'Confirm', 
      `Are you sure to delete this post <span class='text-theme'>${id}</span>?`
    ).subscribe((action) => {
      if (action === 'confirm') {
        this.postsService.deleteImage(path, id);
      }
    });
  }

  onFeatured(item: IPostResponse, value: boolean) {
    const data = { ...item.data, isFeatured: value };

    this.postsService.updatePost(item.id, data);
  }

}
