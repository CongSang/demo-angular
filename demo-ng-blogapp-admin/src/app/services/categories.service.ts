import { Injectable } from '@angular/core';
import { ICategoryResponse, ICategory } from '../models/category';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private ngFs: AngularFirestore, private toast: ToastrService) { }

  createCategory(data: ICategory) {
    this.ngFs.collection('categories').add(data).then((res) => {
      this.toast.success('Data Saved Successfully!');
    }).catch((err) => {
      this.toast.error(err);
    });
  }

  getCategories() {
    return this.ngFs.collection('categories').snapshotChanges().pipe(
      map((action) => {
        return action.map((category: any): ICategoryResponse => {
          const data = category.payload.doc.data();
          const id = category.payload.doc.id;

          return { id, data }
        })
      })
    )
  }

  updateCategories(id: string, editData: any) {
    this.ngFs.collection('categories').doc(id).update(editData).then((res) => {
      this.toast.success('Data Updated Successfully!');
    }).catch((err) => {
      this.toast.error(err);
    });
  }

  deleteCategory(id: string) {
    this.ngFs.collection('categories').doc(id).delete().then((res) => {
      this.toast.success('Data Deleted Successfully!');
    }).catch((err) => {
      this.toast.error(err);
    });
  }
}
