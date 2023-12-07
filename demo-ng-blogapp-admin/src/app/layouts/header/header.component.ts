import { AuthService } from 'src/app/services/auth.service';
import { AfterContentChecked, Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userInfo: any;

  constructor(private authService: AuthService) {
    
  }

  ngOnInit(): void {
    this.authService.getUser$?.subscribe(user => {
      this.userInfo =  JSON.parse(JSON.stringify(user))
    });
  }

  onLogout() {
    this.authService.logOut();
  }

}
