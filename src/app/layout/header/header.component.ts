import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Author } from 'src/app/interfaces/author.interface';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userSelector = new FormControl(0);
  users: Author[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((object) => this.users = object.data);
  }

  public onSelectUser() {
    const selctedUser = this.users.filter((user) => user.id === this.userSelector.value)[0];
    if (!!selctedUser) {
      this.userService.currentUser.set(selctedUser);
    }
  }
}
