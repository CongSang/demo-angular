import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { IPost, IPostResponse } from '../models/post';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage: AngularFireStorage, private ngFs: AngularFirestore, private toast: ToastrService, private router: Router) { }

  createPost(data: IPost) {
    this.ngFs.collection('posts').add(data).then((res) => {
      this.toast.success('Data Saved Successfully!');

      this.router.navigate(['/posts']);
    }).catch((err) => {
      this.toast.error(err);
    });;
  }

  uploadImage(image: any, data: IPost, id: string, formStatus: string) {
    const filePath = `postIMG/${Date.now()}`

    this.storage.upload(filePath, image).then(() => {
      this.storage.ref(filePath).getDownloadURL().subscribe((url) => {
        data.postImgUrl = url;

        if (formStatus === 'Edit') {
          this.updatePost(id, data);
        } else {
          this.createPost(data);
        }
      })
    })
  }

  getPosts() {
    return this.ngFs.collection('posts').snapshotChanges().pipe(
      map((action) => {
        return action.map((post: any): IPostResponse => {
          const data = post.payload.doc.data();
          const id = post.payload.doc.id;

          return { id, data }
        })
      })
    )
  }

  async getImageByPath(path: string): Promise<any> {
    return this.storage.storage.refFromURL(path).getMetadata().then((data) => {
      return data
    });
  }

  getPostById(id: string) {
    return this.ngFs.collection('posts').doc(id).valueChanges().pipe(map((action) => {
      return action as IPost
    }));
  }

  updatePost(id: string, data: IPost) {
    this.ngFs.collection('posts').doc(id).update(data).then((res) => {
      this.toast.success('Data Updated Successfully!');

      this.router.navigate(['/posts']);
    }).catch((err) => {
      this.toast.error(err);
    });
  }

  deleteImage(path: string, id: string) {
    this.storage.storage.refFromURL(path).delete().then(() => {
      this.deletePost(id);
    });
  }

  deletePost(id: string) {
    this.ngFs.collection('posts').doc(id).delete().then((res) => {
      this.toast.success('Data Deleted Successfully!');
    }).catch((err) => {
      this.toast.error(err);
    });
  }
}
