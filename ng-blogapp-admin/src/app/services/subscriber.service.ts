import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, onSnapshot } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { map, observeOn } from 'rxjs/operators';
import { ISubscriberResponse } from '../models/subscriber';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor(private ngFs: Firestore, private toast: ToastrService) { }

  getSubscribers() {
    const data = new Observable((observe) => {
        return onSnapshot(collection(this.ngFs, 'subscribers'),
          (action) => {
            observe.next(action.docs);
          }
      )
    })

    return data.pipe(
      map((action: any) => {
        return action.map((item: any): ISubscriberResponse => {
          const data = item.data();
          const id = item.id;

          return { id, data }
        })
      })
    )
  }

  deleteSubscriber(id: string) {
    deleteDoc(doc(this.ngFs, `subscribers`, id)).then((res) => {
      this.toast.success('Data Deleted Successfully!');
    }).catch((err) => {
      this.toast.error(err);
    });
  }
}
