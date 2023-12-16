import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { ICategory, ICategoryResponse } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private ngFs: Firestore) { }

  getCategories() {
    const data = new Observable((observe) => {
      return onSnapshot(collection(this.ngFs, 'categories'),
        (action) => {
          observe.next(action.docs);
        }
      )
    })

    return data.pipe(
      map((action: any) => {
        return action.map((item: any): ICategoryResponse => {
          const data = item.data();
          const id = item.id;

          return { id, data }
        })
      })
    )
  }

  async getCategoryById(id: string) {
    return await getDoc(doc(this.ngFs, `categories`, id))
      .then((action) => {
        return action.data() as ICategory
      });
  }
}
