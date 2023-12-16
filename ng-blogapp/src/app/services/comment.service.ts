import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAfter } from '@angular/fire/firestore';
import { IComment, ICommentResponse } from '../models/comment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private ngFs: Firestore) { }

  addComment (data: IComment, postId: string) {
    return addDoc(collection(this.ngFs, `posts`, postId, 'comments'), data);
  }

  countComment(postId: string) {
    const data = new Observable((observe) => {
      return onSnapshot(collection(this.ngFs, 'posts', postId, 'comments'),
        (action) => {
          observe.next(action.docs);
        }
      )
    })

    return data.pipe(
      map((action: any) => {
        return action.map((item: any): ICommentResponse => {
          const data = item.data();
          const id = item.id;

          return { id, data }
        })
      })
    )
  }

  getComments (postId: string) {
    return getDocs(query(
      collection(this.ngFs, 'posts', postId, 'comments'), 
      orderBy('createdAt', "desc"), 
      limit(5)
    ))
  }

  loadMoreComments (postId: string, latestComment: any) {
    return getDocs(query(
      collection(this.ngFs, 'posts', postId, 'comments'), 
      orderBy('createdAt', "desc"), 
      startAfter(latestComment || null), 
      limit(5)
    ))
  }

  async getCommentById(id: string, postId: string) {
    return await getDoc(doc(this.ngFs, 'posts', postId, 'comments', id))
      .then((action) => {
        return action.data() as IComment
      });
  }
}
