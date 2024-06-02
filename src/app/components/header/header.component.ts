import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../responses/user/user.response';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from '../../services/token.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements  OnInit {
    userResponse?: UserResponse | null;
    isPopoverOpen = false;
    activeNavItem: number = 0;

    constructor (
      private router: Router,
      private userService: UserService,
      private popoverConfig: NgbPopoverConfig,
      private tokenService: TokenService
    ) {}

    togglePopover(event: Event): void {
      event.preventDefault();
      this.isPopoverOpen = !this.isPopoverOpen;
    }

    ngOnInit(): void {
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
    }

    handleItemClick (index: number): void {
      // alert(`Clicked on "${index}"`);
      if (index === 0) {
        this.router.navigate(['/user-profile']);
      } else if (index === 2) {
        this.userService.removeUserFromLocalStorage();
        this.tokenService.removeToken();
        this.userResponse = this.userService.getUserResponseFromLocalStorage();
      }
      this.isPopoverOpen = false; // Close the popover after clicking an item
    }

    setActiveNavItem (index: number) {
      this.activeNavItem = index;
    }
}
