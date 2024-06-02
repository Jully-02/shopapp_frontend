import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginDTO } from '../../dtos/users/login.dtos';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginResponse } from '../../responses/user/login.response';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';
import { UserResponse } from '../../responses/user/user.response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string;
  password: string; 
  roles: Role[]; // Mảng roles
  rememberMe: boolean;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse;

  constructor(
    private router : Router, 
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService
    ) {
      this.phoneNumber = '0905323576';
      this.password =  'Jully_232305';
      this.roles = [];
      this.rememberMe = true;
  }

  ngOnInit () {
    // Gọi API lấy danh sách rolé và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => { // Sử dụng kiểu khác Role[]
        debugger
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: any) => {
        debugger
        console.error('Error getting roles: ', error);
      }
    });
  }

  login () {
    const message = `phone: ${this.phoneNumber}` +
                    `password: ${this.password}`;
    // alert(message);
    debugger
    const loginDTO: LoginDTO = {
            phone_number: this.phoneNumber,
            password: this.password,
            role_id: this.selectedRole?.id ?? 1

    };
    this.userService.login(loginDTO).subscribe(
      {
        next: (response: LoginResponse) => {
          // Want to use tokens in API requests
          debugger
          const {token} = response;
          if (this.rememberMe) {
            this.tokenService.setToken(token);
            debugger
            this.userService.getUserDetail(token).subscribe({
              next: (response: any) => {
                debugger
                this.userResponse = {
                  ...response,
                  date_of_birth: new Date(response.date_of_birth), 
                }
                this.userService.saveUserResponseToLocalStorage(this.userResponse);
                if (this.userResponse?.role.name === 'admin') {
                  this.router.navigate(['/admin']);
                }
                else if (this.userResponse?.role.name === 'user') {
                  this.router.navigate(['/']);
                }
              },
              complete: () => {
                debugger
              },
              error: (error: any) => {
                debugger
                alert(error.error.message);
              }
            })
          }
        },
        complete: () => {
          debugger
        },
        error: (error: any) => {
          debugger
          // console.error('Đăng nhập không thành công: ', error);
          alert(error?.error?.message);
        }
      }
    )
  }
  
  onPhoneNumberChange () {
    console.log(`Phone typed: ${this.phoneNumber}`);
    // how to validate ? phone number must be at least 6 characters
  }
}
