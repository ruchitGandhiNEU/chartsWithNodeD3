import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import {UserServices} from '../user.service';
import {Router} from '@angular/router';
import {User} from '../signup/user.model';
import {NotificationService} from '../../shared/notification.service';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss']
})
export class UpdateAccountComponent implements OnInit {

  constructor(private userService: UserServices,
              private router: Router,
              private notifyService: NotificationService) {

  }
  updateForm: FormGroup;
  passwordMatchError = false;


  getEmailErrorMessage() {
    return this.updateForm.controls.email.hasError('required') ? 'You must enter a value' :
      this.updateForm.controls.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPhoneErrorMessage() {
    return this.updateForm.controls.phone.hasError('required') ? 'You must enter a value' :
      this.updateForm.controls.phone.hasError('pattern') ? 'Not a valid Number' : '';

  }

  getPasswordErrorMessage() {
    return this.updateForm.controls.password.hasError('required') ? 'You must enter a value' :
      this.updateForm.controls.password.hasError('minlength') ? 'Password must be minimum 8 characters long' : '';
  }

  onSubmit(user: User, isValid: boolean) {
    if (isValid) {
      if (user.password !== user.confirmPassword) {
        this.passwordMatchError = true;
        return;
      }
      console.log(user);
      let observable = this.userService.createUser(user);

      observable.subscribe((data: any) => {
        this.notifyService.notification.next(data.message);
        this.router.navigate(['/login']);
      }, error => {
        this.notifyService.notification.next(error);
      });
    }
  }

  ngOnInit() {
    this.updateForm = new FormGroup({
      firstname: new FormControl('', [<any>Validators.required]),
      lastname: new FormControl('', [<any>Validators.required]),
      email: new FormControl('', [<any>Validators.required, <any>Validators.email]),
      phone: new FormControl('', [<any>Validators.required,
        <any>Validators.pattern(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)]),
      username: new FormControl('', [<any>Validators.required]),
      password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(8)]),
      confirmPassword: new FormControl('', [<any>Validators.required, <any>Validators.minLength(8)])
    });
  }

}