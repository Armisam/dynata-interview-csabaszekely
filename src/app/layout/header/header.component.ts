import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  userSelector = new FormControl(0);

  constructor(public userService: UserService) { }

  public onSelectUser() {
    const selctedUser = this.userService.users.filter((user) => user.id === this.userSelector.value)[0];
    if (!!selctedUser) {
      this.userService.currentUser.set(selctedUser);
    }
  }
}
