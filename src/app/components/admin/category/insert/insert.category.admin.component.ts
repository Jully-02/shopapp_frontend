import { Component, OnInit } from "@angular/core";
import { InsertCategoryDTO } from "../../../../dtos/category/insert.category.dto";
import { Category } from "../../../../models/category";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "../../../../services/category.service";
import { ProductService } from "../../../../services/product.service";

@Component({
    selector: 'app-insert.category.admin',
    templateUrl: './insert.category.admin.component.html',
    styleUrl: './insert.category.admin.component.scss'
})
export class InsertCategoryAdminComponent implements OnInit {
    insertCategoryDTO: InsertCategoryDTO = {
        name: '',
    }
    categories: Category[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private categoryService: CategoryService,
    ) {

    }

    ngOnInit(): void {
        
    }

    insertCategory() {
        this.categoryService.insertCategory(this.insertCategoryDTO).subscribe({
            next: (response) => {
                debugger
                this.router.navigate(['/admin/categories']);
            },
            error: (error) => {
                debugger
                // Hanble error while inserting the category
                alert(error.error);
                console.error('Error inserting category: ', error);
            }
        });
    }
}