import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { ISubscript } from '../models/subscript';

@Injectable({
  providedIn: 'root'
})
export class SubsciptService {

  constructor(private ngFs: Firestore) { }

  addSubscription (data: ISubscript) {
    addDoc(collection(this.ngFs, 'subscribers'), data);
  }

  checKSubsEmail (email: string) {
    let doc = query(collection(this.ngFs, 'subscribers'), where('email', '==', email))

    return getDocs(doc);
  }
}
