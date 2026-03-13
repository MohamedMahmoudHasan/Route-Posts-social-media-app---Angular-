import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  public readonly auth = inject(AuthService);

  userName: String = JSON.parse(localStorage.getItem('socialUser')!)?.name;

  userImg: string = JSON.parse(localStorage.getItem('socialUser')!)?.photo;

  logOut(): void {
    this.auth.signOut();
  }
}
