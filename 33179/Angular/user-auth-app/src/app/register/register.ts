import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  user = { name: '', email: '', password: '' };
  auth = new AuthService();

  registerUser() {
    this.auth.register(this.user);
    alert('Registration Successful');
  }
}