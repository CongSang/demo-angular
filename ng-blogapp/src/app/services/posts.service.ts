import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  limit,
  onSnapshot, 
  orderBy, 
  query, 
  updateDoc, 
  where, 
  increment, collectionChanges
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { IPost, IPostResponse } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private ngFs: Firestore) { }

  getFeaturedPosts() {
    const data = new Observable((observe) => {
      return onSnapshot(query(
        collection(this.ngFs, 'posts'), 
        where('isFeatured', '==', true), 
        limit(4)
      ), (action) => {
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

  getLatestPosts() {
    const data = new Observable((observe) => {
      return onSnapshot(query(
        collection(this.ngFs, 'posts'), 
        orderBy('createdAt', 'desc'), 
        limit(6)
      ), (action) => {
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

  getPostsByCategoryId(categoryId: string) {
    const data = new Observable((observe) => {
      return onSnapshot(query(
        collection(this.ngFs, 'posts'), 
        where('category.categoryId', '==', categoryId)
      ), (action) => {
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

  async getPostById(id: string) {
    return await getDoc(doc(this.ngFs, `posts`, id)).then((action) => {
      return action.data() as IPost
    });
  }

  getSimilarPosts(categoryId: string) {
    const data = new Observable((observe) => {
      return onSnapshot(query(
        collection(this.ngFs, 'posts'), 
        where('category.categoryId', '==', categoryId), 
        limit(4)
      ), (action) => {
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

  countViews(postId: string, views: number) {
    const data = {
      views,
    }

    updateDoc(doc(this.ngFs, `posts`, postId), data)
  }
}
