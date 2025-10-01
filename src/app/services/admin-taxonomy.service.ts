import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface ModelType { _id: string; typeName?: string;} // adapt to your schema
export interface Category  { _id: string; modelName: string; categoryName: string; }
export interface SubCat    { _id: string; categoryId: string; subCategoryName: string; }

@Injectable({ providedIn: 'root' })
export class AdminTaxonomyService {
  private base = environment.baseUrl; // adjust if needed

  constructor(private http: HttpClient) {}

  // GET /get-modules
  getModelTypes(): Observable<{ success: boolean; modelTypes: ModelType[] }> {
    return this.http.get<{ success: boolean; modelTypes: ModelType[] }>(`${this.base}/category/get-modules`);
  }

  // GET /get-categories?modelName=
  getCategories(modelName?: string): Observable<{ success: boolean; categories: Category[] }> {
    const url = modelName ? `${this.base}/category/get-categories?modelName=${encodeURIComponent(modelName)}` 
                          : `${this.base}/category/get-categories`;
    return this.http.get<{ success: boolean; categories: Category[] }>(url);
  }

  // POST /add-category
  addCategory(payload: { modelName: string; categoryName: string }) {
    return this.http.post<{ success: boolean; category: Category }>(`${this.base}/category/add-category`, payload);
  }

  // POST /addSubCategory
  addSubCategory(payload: { categoryId: string; subCategoryName: string }) {
    return this.http.post<{ success: boolean; subcategory: SubCat }>(`${this.base}/category/addSubCategory`, payload);
  }

  // GET /get-subcategories/:categoryId
  getSubcategories(categoryId: string) {
    return this.http.get<{ success: boolean; subcategories: SubCat[] }>(`${this.base}/category/get-subcategories/${categoryId}`);
  }
}
