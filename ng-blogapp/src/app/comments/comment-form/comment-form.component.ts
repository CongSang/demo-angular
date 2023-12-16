import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { IComment } from '../../models/comment';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [NgClass, CommonModule, ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent implements OnInit {

  @Output() submitEvent = new EventEmitter();

  commentForm!: FormGroup;
  postId: string = '';

  constructor(private fb: FormBuilder, private commentService: CommentService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((value) => {
      this.postId = value['id'];
    })

    this.commentForm = this.fb.group({
      name: ['', Validators.required],
      comment: ['', [Validators.required]],
    });
  }

  onValidateField(field: string, type: string) {
    return (this.commentForm.controls[field].errors?.[type] && 
          this.commentForm.controls[field].touched && 
          this.commentForm.controls[field].invalid)
  }

  onSubmit() {
    const data: IComment = {
      name: this.commentForm.value.name,
      comment: this.commentForm.value.comment,
      createdAt: new Date(),
    };

    this.commentService.addComment(data, this.postId).then(async (res) => {
      const dataEmit = { id: res.id, data: await this.commentService.getCommentById(res.id, this.postId) };
      
      this.submitEvent.emit(dataEmit);
    });
    
    this.commentForm.reset();
  }

}
