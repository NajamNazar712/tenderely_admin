import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ngx-app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>(`${environment.baseUrl}/admin/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.admin._id);
          this.router.navigate(['/pages/dashboard']); // redirect after login
        } else {
          this.error = res.msg || 'Login failed';
        }
      },
      error: (err) => {
        this.error = err.error?.msg || 'Server error';
      }
    });
  }
}
