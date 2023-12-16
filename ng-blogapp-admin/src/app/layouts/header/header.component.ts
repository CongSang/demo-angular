import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  userInfo: any;

  constructor(private authService: AuthService) {
    
  }

  ngOnInit(): void {
    this.authService.getUser$?.subscribe(user => {
      this.userInfo =  user
    });
  }

  onLogout() {
    this.authService.logOut();
  }

}
