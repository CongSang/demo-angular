import { Component, OnInit, TemplateRef } from '@angular/core';
import { IPostResponse } from '../../models/post';
import { PostsService } from '../../services/posts.service';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-all-post',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ModalComponent],
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.scss'
})
export class AllPostComponent implements OnInit {

  postList: Array<IPostResponse> = [];

  constructor(private postsService: PostsService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.postsService.getPosts().subscribe((value) => {
      this.postList = value;
    })
  }

  onDelete(event: any, path: string, id: string, ref: TemplateRef<any>) {
    event.stopPropagation();
    
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

  onFeatured(event: any, item: IPostResponse, value: boolean) {
    event.stopPropagation();

    const data = { ...item.data, isFeatured: value };

    this.postsService.updatePost(item.id, data);
  }

}
