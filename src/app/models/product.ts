import { ProductImage } from "./product.images";

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  category_id: number;
  url: string;
  product_images: ProductImage[];
}
