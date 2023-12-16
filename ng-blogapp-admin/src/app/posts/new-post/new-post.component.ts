import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategoryResponse } from '../../models/category';
import { IPost } from '../../models/post';
import { PostsService } from '../../services/posts.service';
import { CategoriesService } from '../../services/categories.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [AngularEditorModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent implements OnInit {

  postForm!: FormGroup;
  imgSrc: any = './assets/images/NoPicture.png';
  imgFile: any = null;
  categoryOptions: Array<ICategoryResponse> = [];
  docId: string = '';
  postDetail: IPost | null = null;
  formStatus: string = 'Add New';

  constructor(
    private fb: FormBuilder, 
    private categoryService: CategoriesService, 
    private postsService: PostsService,
    private router: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((value) => {
      this.categoryOptions = value;
    })

    this.router.queryParams.subscribe((value) => {
      this.docId = value['id'];

      if (!value['id']) {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: ['', Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          postImg: ['', Validators.required],
          category: ['', Validators.required],
          content: ['', Validators.required],
        });
      } else {
        this.postsService.getPostById(value['id']).then((post) => {
          this.postDetail = post;

          this.postsService.getImageByPath(post.postImgUrl).then((image) => {
            this.imgFile = image;
          });

          this.postForm = this.fb.group({
            title: [this.postDetail.title, [Validators.required, Validators.minLength(10)]],
            permalink: [this.postDetail.permalink, Validators.required],
            excerpt: [this.postDetail.excerpt, [Validators.required, Validators.minLength(50)]],
            postImg: ['', Validators.nullValidator],
            category: [`${this.postDetail.category.categoryId}-${this.postDetail.category.categoryName}`, Validators.required],
            content: [this.postDetail.content, Validators.required],
          });

          this.imgSrc = this.postDetail.postImgUrl;
          this.formStatus = 'Edit';
        });
      }
    })
  }

  onValidateField(field: string, type: string) {
    return (this.postForm.controls[field].errors?.[type] && 
          this.postForm.controls[field].touched && 
          this.postForm.controls[field].invalid)
  }

  onTitleKeyup(event: any) {
    const value = event.target.value;
    let permalink = value.replace(/\s/g, '-');
    
    this.postForm.controls['permalink'].setValue(permalink);
  }

  onShowPreview(event: any) {
    if (event.target.files?.length) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgSrc = e.target?.result;
      }
      reader.readAsDataURL(event.target.files[0])

      this.imgFile = event.target.files[0];
    }
  }

  onSubmit() {
    let splitted = this.postForm.value.category.split('-');

    const postData: IPost = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitted[0],
        categoryName: splitted[1],
      },
      postImgUrl: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    }

    if (!this.imgFile?.timeCreated) {
      this.postsService.uploadImage(this.imgFile, postData, this.docId, this.formStatus);
    } else {
      postData.postImgUrl = this.imgSrc;
      this.postsService.updatePost(this.docId, postData);
    }

    this.postForm.reset();
    this.imgSrc = './assets/images/NoPicture.png';
  }
}
