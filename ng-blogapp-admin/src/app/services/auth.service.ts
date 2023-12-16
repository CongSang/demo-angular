import { Auth, authState, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { ILogin } from '../models/login';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user$ = new BehaviorSubject<any>(null);
  isLoggedIn: boolean = false;

  public get getUser$(): Observable<any> {
    return this.user$.asObservable();
  }

  constructor(private auth: Auth, private toast: ToastrService, private router: Router) { 
    this.auth.onAuthStateChanged((user) => {
      this.retrieveUserData(user);
    });
  }

  login(data: ILogin) {
    signInWithEmailAndPassword(this.auth, data.email, data.password).then(async (res) => {
      this.toast.success('Logged In Successfully!');

      this.router.navigate(['/']);
    }).catch((err) => {
      this.toast.error(err);
    })
  }

  private getUser() {
    authState(this.auth).subscribe(user => {
      this.user$.next(JSON.parse(JSON.stringify(user)));
      localStorage.setItem('user', JSON.stringify(user));
    })
  }

  logOut() {
    this.auth.signOut()
  }

  private retrieveUserData(user: any) {
    if (!user) {
      this.isLoggedIn = false;

      this.user$.next(null);
      localStorage.removeItem('user');
      this.router.navigate(['/login']);

      return;
    } else {
      this.isLoggedIn = true;

      this.getUser();
    }
    
  }
}
