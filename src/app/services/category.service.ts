import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Category } from "../models/category";
import { UpdateCategoryDTO } from "../dtos/category/update.category.dto";
import { InsertCategoryDTO } from "../dtos/category/insert.category.dto";

@Injectable({
    providedIn: 'root',
})

export class CategoryService {
    private apiGetCategory = `${environment.apiBaseUrl}/categories`;

    constructor(private http: HttpClient) {}

    getCategories(page: number, limit: number):Observable<Category[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<Category[]>(this.apiGetCategory, { params });
    }

    getDetailCategory(id: number):Observable<Category> {
        return this.http.get<Category>(`${environment.apiBaseUrl}/categories/${id}`);
    }

    deleteCategory(id: number): Observable<string>{
        debugger
        return this.http.delete(`${environment.apiBaseUrl}/categories/${id}`, { responseType: 'text'});
    }

    updateCategory(id: number, updateCategory: UpdateCategoryDTO): Observable<any>{
        return this.http.put(`${environment.apiBaseUrl}/categories/${id}`, updateCategory, { responseType: 'text'});
    }

    insertCategory(insertCategoryDTO: InsertCategoryDTO): Observable<any>{
        // Add a new category
        return this.http.post(`${environment.apiBaseUrl}/categories`,insertCategoryDTO, { responseType: 'text'});
    }
}

