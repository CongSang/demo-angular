import { Injectable } from '@angular/core';
import { Storage, deleteObject, getDownloadURL, getMetadata, ref, uploadBytes } from '@angular/fire/storage';
import { IPost, IPostResponse } from '../models/post';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { refFromURL } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage: Storage, private ngFs: Firestore, private toast: ToastrService, private router: Router) { }

  createPost(data: IPost) {
    addDoc(collection(this.ngFs, 'posts'), data).then((res) => {
      this.toast.success('Data Saved Successfully!');

      this.router.navigate(['/posts']);
    }).catch((err) => {
      this.toast.error(err);
    });;
  }

  uploadImage(image: any, data: IPost, id: string, formStatus: string) {
    const filePath = `postIMG/${Date.now()}`

    uploadBytes(ref(this.storage, filePath), image).then(() => {
      getDownloadURL(ref(this.storage, filePath)).then((url) => {
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
    const data = new Observable((observe) => {
      return onSnapshot(collection(this.ngFs, 'posts'),
        (action) => {
          observe.next(action.docs);
        }
      )
    })

    return data.pipe(
      map((action: any) => {
        return action.map((item: any): IPostResponse => {
          const data = item.data();
          const id = item.id;

          return { id, data }
        })
      })
    )
  }

  async getImageByPath(path: string): Promise<any> {
    return getMetadata(ref(this.storage, path)).then((res) => {
      return res
    })
  }

  async getPostById(id: string) {
    return await getDoc(doc(this.ngFs, `posts`, id)).then((action) => {
      return action.data() as IPost
    });
  }

  updatePost(id: string, data: IPost) {
    updateDoc(doc(this.ngFs, `posts`, id), {...data}).then((res) => {
      this.toast.success('Data Updated Successfully!');

      this.router.navigate(['/posts']);
    }).catch((err) => {
      this.toast.error(err);
    });
  }

  deleteImage(path: string, id: string) {
    deleteObject(ref(this.storage, path)).then(() => {
      this.deletePost(id);
    });
  }

  deletePost(id: string) {
    deleteDoc(doc(this.ngFs, `posts`, id)).then((res) => {
      this.toast.success('Data Deleted Successfully!');
    }).catch((err) => {
      this.toast.error(err);
    });
  }
}
