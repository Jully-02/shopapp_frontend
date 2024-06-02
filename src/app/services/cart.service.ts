import { Injectable } from "@angular/core";

@Injectable ({
    providedIn: 'root',
})

export class CartService {
     // Dùng Mapp để lưu trữ giỏ hàng, key là id sản phẩm, value là số lượng
    private cart: Map<number, number>;

    constructor() {
        this.cart = new Map();
        // Lấy dữ liệu giỏ hàng từ localStorage khi khởi tạo service
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            this.cart = new Map(JSON.parse(storedCart));
        }
    }

    addToCart (productId: number, quantity: number = 1): void {
        debugger
        if (this.cart.has(productId)) {
            // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên `quantity`
            this.cart.set(productId, this.cart.get(productId)! + quantity);
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm vào với sô lượng là `quantity`
            this.cart.set(productId, quantity);
        }
        // Sau khi thay đổi giỏ hàng, lưu trữ nó vào localStorage
        this.saveCartToLocalStorage();
    }

    getCart(): Map<number, number> {
        return this.cart;
    }

    // Lưu trữ giỏ hàng vào localStorage
    private saveCartToLocalStorage (): void {
        debugger
        localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
    }

    // Hàm xóa dữ liệu giỏ hàng và cập nhật localStorage
    clearCart(): void {
        // Xóa toàn bộ dữ liệu trong giỏ hàng
        this.cart.clear();  
        // Lưu giỏ hàng mới vào localStorage (trống)
        this.saveCartToLocalStorage();

    }
}