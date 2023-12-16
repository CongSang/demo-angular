import { Injectable } from '@angular/core';
import { ICategoryResponse, ICategory } from '../models/category';
import { Firestore, collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, addDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private ngFs: Firestore, private toast: ToastrService) { }

  createCategory(data: ICategory) {
    addDoc(collection(this.ngFs, 'categories'), data).then((res) => {
      this.toast.success('Data Saved Successfully!');
    }).catch((err) => {
      this.toast.error(err);
    });
  }

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

  updateCategories(id: string, editData: ICategory) {
    updateDoc(doc(this.ngFs, `categories`, id), {...editData}).then((res) => {
      this.toast.success('Data Updated Successfully!');
    }).catch((err) => {
      this.toast.error(err);
    });
  }

  deleteCategory(id: string) {
    deleteDoc(doc(this.ngFs, `categories`, id)).then((res) => {
      this.toast.success('Data Deleted Successfully!');
    }).catch((err) => {
      this.toast.error(err);
    });
  }
}
