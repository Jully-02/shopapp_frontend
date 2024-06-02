import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrl: './category.admin.component.scss'
})
export class CategoryAdminComponent implements OnInit{
  categories: Category[] = [];

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ){}
  
  ngOnInit() {
    this.getCategories(0, 100);
  }

  getCategories (page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger
        this.categories = categories;
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        console.error('Error fetching categories: ', error);
      }
    });
  }

  insertCategory () {
    debugger
    // Điều hướng đến trang detail-category với categoryId là tham số
    this.router.navigate(['/admin/categories/insert']);
  }

  updateCategory(categoryId: number) {
    debugger
    this.router.navigate(['/admin/categories/update', categoryId]);
  }

  deleteCategory(category: Category) {
    const confirmation = window.confirm("Are you sure you want to delete this category?");
    if (confirmation) {
      debugger
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response: string) => {
          debugger
          alert('Delete successful!');
          location.reload();
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger
          alert(error.error);
          console.error('Error fetching categories: ', error);
        }
      });
    }
  }
}
