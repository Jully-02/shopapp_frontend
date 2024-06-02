import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductImage } from '../../models/product.images';
import { environment } from '../../environments/environment';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss'
})

export class DetailProductComponent implements OnInit{
  product?: Product;
  productId: number;
  currentImageIndex: number;
  quantity: number;

  constructor (
    private productService: ProductService,
    private cartService: CartService,
    // private categoryService: CategoryService,
    // private router: Router,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.productId = 0;
    this.currentImageIndex = 0;
    this.quantity = 1;
  }

  ngOnInit(): void {
    // Lấy productId từ URL
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    debugger
    // this.cartService.clearCart();
    // const idParam = 9; // fake tạm 1 giá trị
    if (idParam != null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe ({
        next: (response: any) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          debugger
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
              debugger
              console.log(product_image.image_url);
            });
          }  
          debugger
          this.product = response;
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },
        complete: () => {
          debugger
        },
        error: (error: any) => {
          debugger
          console.error('Error fetching detail: ', error);
        }
      });
    } else {
      console.error('Invalid productId: ', idParam);
    }
  }
  
  showImage(index: number): void {
    debugger
    if (this.product && this.product.product_images && 
        this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = this.product.product_images.length - 1;
      } else if (index >= this.product.product_images.length) {
        if (index == this.product.product_images.length - 1) {
          index = this.product.product_images.length - 1;
        }
        else {
          index = 0;
        }
      }        
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }

  thumbnailClick (index: number) {
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }

  previousImage (): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }

  nextImage (): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  increaseQuantity ():void{
    this.quantity++;
  }

  decreaseQuantity (): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart (): void {
    debugger
    if (this.product) {
      this.cartService.addToCart(this.productId, this.quantity);
    }
    else {
      // Xử lý khi product là null
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null')
    }
  }

  buyNow(): void {
    this.router.navigate(['/orders']);
  }


}
