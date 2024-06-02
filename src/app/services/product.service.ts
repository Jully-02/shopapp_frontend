import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Product } from "../models/product";
import { UpdateProductDTO } from "../dtos/product/update.product.dto";
import { InsertProductDTO } from "../dtos/product/insert.product.dto";

@Injectable ({
    providedIn: 'root',
})

export class ProductService {
    private apiGetProducts = `${environment.apiBaseUrl}/products`;

    constructor(private http: HttpClient) {}

    getProducts(keyword: string, categoryId: number, page: number, limit: number): Observable<Product[]> {
        const params = new HttpParams()
            .set('keyword', keyword)
            .set('category_id', categoryId)
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<Product[]>(this.apiGetProducts, { params });
    }

    getDetailProduct (productId: number): Observable<Product> {
        return this.http.get<Product>(`${environment.apiBaseUrl}/products/${productId}`);
    }

    getProductByIds (productIds: number []): Observable<Product[]> {
        // Chuyển danh sách ID thành một chuỗi và truyền vào params
        debugger
        const params = new HttpParams().set('ids', productIds.join(','));
        return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, {params});
    }

    deleteProduct(productId: number): Observable<string> {
        debugger
        return this.http.delete<string>(`${environment.apiBaseUrl}/products/${productId}`);
    }

    updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<UpdateProductDTO> {
        return this.http.put<Product>(`${environment.apiBaseUrl}/products/${productId}`, updatedProduct);
    }

    insertProduct(insertProductDTO: InsertProductDTO): Observable<any> {
        return this.http.post(`${environment.apiBaseUrl}/products`, insertProductDTO);
    }

    uploadImages(productId: number, files: File[]): Observable<any> {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        // Upload images for the specified product id
        return this.http.post(`${environment.apiBaseUrl}/products/uploads/${productId}`, formData);
    }

    deleteProductImage(id: number): Observable<any> {
        debugger
        return this.http.delete<string>(`${environment.apiBaseUrl}/product_images/${id}`);
    }
}
// update.category.admin.component.html