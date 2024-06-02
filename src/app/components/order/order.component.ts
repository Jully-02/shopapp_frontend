import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { OrderDTO } from '../../dtos/order/order.dto';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit{
  orderForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu của form
  cartItems: {product : Product, quantity: number} [] = [];
  couponCode: string = ''; // Coupon code
  totalAmount: number = 0; // Total money
  orderData: OrderDTO = {
    user_id: 0, // Thay bằng user_id thích hợp
    fullname: '', // Khởi tạo rỗng, sẽ được điền từ form
    email: '', // Khởi tạo rỗng, sẽ được điền từ form
    phone_number: '', // Khởi tạo rỗng, sẽ được điền từ form
    address: '', // Khởi tạo rỗng, sẽ được điền từ form
    note: '', // Có thể thêm trường ghi chú nếu cần
    total_money: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    payment_method: 'cod', // Mặc định là thanh toán khi nhận hàng
    shipping_method: 'express', // Mặc định là vận chuyển nhanh
    coupon_code: '', // Sẽ được điền từ form khi áp dụng mã giảm giá
    cart_items: []
  };

  constructor (
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private router: Router,
  ) {
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.formBuilder.group ({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc
      email: ['', Validators.email], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['', [Validators.required, Validators.minLength(5)]], // Address bắt buộc và ít nhất là 5 ký tự
      note: [''],
      shipping_method: ['express'],
      payment_method: ['cod'],
    });
  }
  ngOnInit(): void {
      debugger
      // this.cartService.clearCart();
      this.orderData.user_id = this.tokenService.getUserId();
      // Lấy danh sách sản phẩm từ giỏ hàng
      debugger
      const cart = this.cartService.getCart();
      const productIds = Array.from(cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng

      // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
      debugger
      this.productService.getProductByIds(productIds).subscribe({
        next: (products) => {
          debugger
          // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm từ giỏ hàng
          this.cartItems = productIds.map((productId)=> {
            debugger
            const product = products.find((p) => p.id === productId);
            if (product) {
              product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
            }
            return {
              product: product!,
              quantity: cart.get(productId)!
            };
          });
        },
        complete: () => {
          debugger
          this.calculateTotal()
        },
        error: (error: any) => {
          debugger
          console.error('Error fetching detail: ', error);
        }
      });
  }

  calculateTotal (): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  }

  placeOrder () {
    debugger
    if (this.orderForm.valid) {
      // Gán giá trị từ form vào đối tượng orderData
      /*
      this.orderData.fullname = this.orderForm.get('fullname')!.value;
      this.orderData.email = this.orderForm.get('email')!.value;
      this.orderData.phone_number = this.orderForm.get('phone_number')!.value;
      this.orderData.address = this.orderForm.get('address')!.value;
      this.orderData.note = this.orderForm.get('note')!.value;
      this.orderData.shipping_method = this.orderForm.get('shipping_method')!.value;
      this.orderData.payment_method = this.orderForm.get('payment_method')!.value;
      */
     // Sử dụng toán từ spread (...) để sao chép giá trị từ form vào orderData
     this.orderData = {
      ...this.orderData,
      ...this.orderForm.value
     };

     this.orderData.cart_items = this.cartItems.map(cartItem => ({
      product_id: cartItem.product.id,
      quantity: cartItem.quantity,
     }));

     this.orderData.total_money = this.totalAmount;

     // Dữ liệu hợp lệ, bạn có thể gửi đơn hàng đi
     this.orderService.placeOrder(this.orderData).subscribe ({
      next: (response: Order) => {
        debugger
        alert('Order Success!');
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      complete: () => {
        debugger
        this.calculateTotal();
      },
      error: (error: any) => {
        debugger
        alert(`Error when ordering: ${error}`);
      },
     });
    } else {
      // Hiện thị thông báo lỗi hoặc xử lý khác
      alert('Invalid data. Please check again.')
    }
  } 

  // Hàm xử lý việc áp dụng mã giảm giá
  applyCoupon (): void {
    
  }
}
