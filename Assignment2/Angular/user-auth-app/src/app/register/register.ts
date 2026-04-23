import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  user = { name: '', email: '', password: '' };
  auth = new AuthService();

  constructor(private router: Router) {}

  registerUser() {
    this.auth.register(this.user);
    alert('Registration Successful');
    this.router.navigate(['/login']);
  }
}