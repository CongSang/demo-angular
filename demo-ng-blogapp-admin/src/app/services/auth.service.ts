import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ILogin } from '../models/login';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user$ = new BehaviorSubject<any>(null);

  public get getUser$(): Observable<any> {
    return this.user$.asObservable();
  }

  constructor(private auth: AngularFireAuth, private toast: ToastrService, private router: Router) { 
    this.auth.onAuthStateChanged((user) => {
      this.retrieveUserData(user);
    });
  }

  login(data: ILogin) {
    this.auth.signInWithEmailAndPassword(data.email, data.password).then(async (res) => {
      this.toast.success('Logged In Successfully!');
      
      await this.getUser();
      this.router.navigate(['/']);
    }).catch((err) => {
      this.toast.error(err);
    })
  }

  private async getUser() {
    this.auth.authState.subscribe(user => {
      this.user$.next(user);
      localStorage.setItem('user', JSON.stringify(user));
    })
  }

  logOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  private async retrieveUserData(user: any): Promise<void> {
    if (!user) {
      this.user$.next(null);
      localStorage.removeItem('user');
      return;
    }

    await this.getUser();
  }
}
