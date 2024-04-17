import { Component, OnInit, } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileDataFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder, public userService: UserService) { }

  private PasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasDigit = /\d/.test(value);
      const hasValidLength = value.length >= 8;

      const isValid = hasUpperCase && hasLowerCase && hasDigit && hasValidLength;

      return isValid ? null : { invalidPassword: true };
    };
  }

  private MatchPasswordValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get(passwordKey);
      const confirmPassword = control.get(confirmPasswordKey);

      if (!password || !confirmPassword) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        return { passwordsNotMatch: true };
      }

      return null;
    };
  }

  ngOnInit(): void {
    this.profileDataFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: [''],
      password: ['', [this.PasswordValidator(), Validators.required]],
      confirmPassword: ['']
    }, { validator: this.MatchPasswordValidator('password', 'confirmPassword') });
  }

  public changeData(): void {
    if (!this.profileDataFormGroup.valid) {
      this.profileDataFormGroup.markAllAsTouched();
      return;
    }

    const userId = this.userService.currentUser().id;

    combineLatest([
      this.userService.changeNameAndEmail(userId, this.profileDataFormGroup.get('name')?.value,
        this.profileDataFormGroup.get('email')?.value), this.userService.changePassword(userId, this.profileDataFormGroup.get('password')?.value, this.profileDataFormGroup.get('confirmPassword')?.value)])
      .subscribe(([nameAndEmailResponse, passwordResponse]) => {
        this.userService.currentUser.set({ ...this.userService.currentUser(), name: nameAndEmailResponse.data.name, email: nameAndEmailResponse.data.email, password: passwordResponse.data });
      });
  }
}
