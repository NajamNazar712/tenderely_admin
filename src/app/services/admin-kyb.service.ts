import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface KybItem {
  _id: string;                // company id
  companyName: string;
  industry?: string;
  country?: string;

  documentId: string;         // uploaded doc id
  documentUrl: string;        // url to image/pdf
  fileType?: string;          // "image/png", "application/pdf", etc.

  submittedBy?: {
    _id: string;
    fullName: string;
    email: string;
  };

  submittedAt: string;        // ISO date
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
}

export interface KybListResponse {
  items: KybItem[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class AdminKybService {
    private base = environment.baseUrl || 'http://localhost:8080';

    constructor(private http: HttpClient) {}

    // If you have a lot of data, switch to server-side pagination later.
    getPending(): Observable<any> {
        return this.http.get<any>(`${this.base}/users/kyb/pending`);
    }

    approveKyb(id: string) {
        return this.http.put(`${this.base}/users/kyb/${id}/approve`, {});
    }
    rejectKyb(id: string) {
        return this.http.put(`${this.base}/users/kyb/${id}/reject`, {}); // add { reason } if you support it
    }
}
