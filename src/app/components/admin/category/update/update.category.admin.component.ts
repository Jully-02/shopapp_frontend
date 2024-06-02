import { Component, OnInit } from "@angular/core";
import { Category } from "../../../../models/category";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "../../../../services/category.service";
import { UpdateCategoryDTO } from "../../../../dtos/category/update.category.dto";

@Component({
    selector: 'app-update.category.admin',
    templateUrl: './update.category.admin.component.html',
    styleUrl: './update.category.admin.component.scss'
})
export class UpdateCategoryAdminComponent implements OnInit {
    categoryId: number;
    updatedCategory: Category;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private categoryService: CategoryService
    ) {
        this.categoryId = 0;
        this.updatedCategory = {} as Category;
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            debugger
            this.categoryId = Number(params.get('id'));
            debugger
            this.getCategoryDetails();
        });
    }

    getCategoryDetails(): void {
        this.categoryService.getDetailCategory(this.categoryId).subscribe({
            next: (category: Category) => {
                debugger
                this.updatedCategory = {...category};
            },
            complete: () => {

            },
            error: (error: any) => {
                console.error(error.error);
            }
        });
    }

    updateCategory() {
        // Implement your update logic here
        const updateCategoryDTO: UpdateCategoryDTO = {
            name: this.updatedCategory.name,
        };
        debugger
        console.log(this.updatedCategory);
        this.categoryService.updateCategory(this.updatedCategory.id, updateCategoryDTO).subscribe({
            next: (response: any) => {
                debugger
            },
            complete: () => {
                debugger
                this.router.navigate(['/admin/categories']);
            },
            error: (error: any) => {
                debugger
                console.error('Error fetching categories: ', error);
            }
        });
    }
}