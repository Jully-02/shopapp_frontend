import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { UpdateUserDTO } from '../../dtos/users/update.user.dto';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit{
  userResponse?: UserResponse;
  userProfileForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu cua form
  token: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userSerivce: UserService,
    private tokenService: TokenService,

  ) {
    // Tạo FormGroup và các FormControl tương ứng
    this.userProfileForm = this.formBuilder.group({
      fullname: ['',], // fullname là FormControl bắt buộc
      address: ['', Validators.minLength(10)], 
      password: [''],
      retype_password: [''],
      date_of_birth: [Date.now()],
    }, {
      validators: this.passwordMatchValidator // Custom validator function for password match
    })

  }

  ngOnInit(): void {
      debugger
      this.token = this.tokenService.getToken();
      this.userSerivce.getUserDetail(this.token).subscribe({
        next: (response: any) => {
          debugger
          this.userResponse = {
            ...response,
            date_of_birth: new Date(response.date_of_birth),
          };
          this.userResponse?.date_of_birth.setDate(this.userResponse.date_of_birth.getDate() + 1);
          this.userProfileForm.patchValue({
            fullname: this.userResponse?.fullname ?? '',
            address: this.userResponse?.address ?? '',
            date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0,10),
          });
          this.userSerivce.saveUserResponseToLocalStorage(this.userResponse);
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

  passwordMatchValidator (): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const retype_password = formGroup.get('retype_password')?.value;
      if (password !== retype_password) {
        return { passwordMismatch: true};
      }
      return null;
    }
  }

  save (): void {
    debugger
    if (this.userProfileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        fullname: this.userProfileForm.get('fullname')?.value,
        address: this.userProfileForm.get('address')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value
      };

      this.userSerivce.updateUserDetail(this.token, updateUserDTO)
        .subscribe({
          next: (response: any) => {
            this.userSerivce.removeUserFromLocalStorage();
            this.tokenService.removeToken();
            this.router.navigate(['/login']);
          },
          error: (error: any) => {
            alert(error.error.message);
          }
      });
    } else {
      if (this.userProfileForm.hasError('passwordMismatch')) {
        alert('Re-enter the password incorrectly!');
      }
    }
  }
}
