import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {


  authToken:any;
  user:any;
  userId  = localStorage.getItem('userId');
  

  constructor(private http: HttpClient) { }

  getUserDetails(){
    return this.http.get(`${environment.baseUrl}/admin/getLoggedInUserDetails/${this.userId}`);
  }
}