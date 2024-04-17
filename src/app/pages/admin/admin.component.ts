import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { take } from 'rxjs';
import { Author } from 'src/app/interfaces/author.interface';
import { Role } from 'src/app/interfaces/role.interface';
import { RoleService } from 'src/app/services/roles/role.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  roleSelector = new FormControl(0);
  roleNameInput = new FormControl('');
  permissionSelector = new FormControl([]);
  roles: Role[] = [];
  selectedRoleUsers: Author[] = [];
  others: Author[] = [];

  constructor(private roleService: RoleService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().pipe(take(1)).subscribe((object) => {
      object.data.map((user: Author) =>
        user.role === this.roleSelector.value ? this.selectedRoleUsers.push(user) : this.others.push(user))
    })
    this.roleService.getRoles().pipe(take(1)).subscribe((object) => this.roles = object.data);
  }

  public onRoleChange(): void {
    this.selectedRoleUsers = [];
    this.others = [];
    this.userService.users.map((user: Author) =>
      user.role === this.roleSelector.value ? this.selectedRoleUsers.push(user) : this.others.push(user));
  }

  public drop(event: CdkDragDrop<Author[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  public save(): void {
    const newRole: Role = {
      id: this.roleSelector.value || 0,
      name: this.roleNameInput.value || '',
      rights: this.getPermissionValue(),
    };
    this.roleService.modifyRole(newRole).pipe(take(1)).subscribe();
  }

  private getPermissionValue(): number {
    let selectedValues: number[] = [];
    if (Array.isArray(this.permissionSelector.value)) {
      selectedValues = (this.permissionSelector.value || []).map((value: string) => parseInt(value, 10));
    } else if (typeof this.permissionSelector.value === 'string') {
      selectedValues.push(parseInt(this.permissionSelector.value, 10));
    }
    let summary = selectedValues.reduce((acc, val) => acc + val, 0);
    return (summary);
  }

}
