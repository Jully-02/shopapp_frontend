import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from "@angular/router";
import { TokenService } from "../services/token.service";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { UserResponse } from "../responses/user/user.response";

@Injectable ({
    providedIn: 'root'
})

export class AdminGuard {
    userResponse?: UserResponse | null;
    constructor(
        private tokenService: TokenService,
        private userService: UserService,
        private router: Router
    ){}

    canActivate (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isTokenExpired = this.tokenService.isTokenExpired();
        const isUserIdValid = this.tokenService.getUserId() > 0;
        this.userResponse = this.userService.getUserResponseFromLocalStorage();
        const isAdmin = this.userResponse?.role.name == 'admin';
        debugger
        if (!isTokenExpired && isUserIdValid && isAdmin) {
            return true;
        } else {
            // Nếu không authenticated, bạn có thể redirect hoặc trả về một UrlTree khác
            // Ví dụ trả về trang login:
            this.router.navigate(['/']);
            return false;
        }
    }
}

export const AdminGuardFn: CanActivateFn = (
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot 
    ): boolean => {
        debugger
        return inject(AdminGuard).canActivate(next,state);
}