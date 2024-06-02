import {
    IsString, 
    IsNotEmpty, 
    IsPhoneNumber,     
} from 'class-validator';

export class UpdateProductDTO {
    @IsPhoneNumber()
    title: string;

    price: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    category_id: number;

    constructor(data: any) {
        this.title = data.title;
        this.price = data.price;
        this.description = data.description;
        this.category_id = data.category_id;
    }
}