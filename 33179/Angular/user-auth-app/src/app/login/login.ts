import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  email = '';
  password = '';
  auth = new AuthService();

  constructor(private router: Router) {}

  loginUser() {
    if (this.auth.login(this.email, this.password)) {
      alert('Login Successful');
      this.router.navigate(['/profile']);
    } else {
      alert('Invalid Credentials');
    }
  }
}