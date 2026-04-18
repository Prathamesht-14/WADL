export class AuthService {

  register(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(email: string, password: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user.email === email && user.password === password) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  getUser() {
    return JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  }

  logout() {
    localStorage.removeItem('loggedInUser');
  }
}