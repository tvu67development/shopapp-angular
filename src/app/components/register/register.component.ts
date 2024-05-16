import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterDTO } from 'src/app/dtos/user/register.dto';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
@ViewChild('registerForm') registerForm!: NgForm;

  phoneNumber: string = "";
  password: string ="";
  retypePassword: string="";
  fullName: string="";
  address:string="";
  isAccepted: boolean=true;
  dateOfBirth: Date=new Date();
  
  constructor(private userService: UserService, private router:Router) {
    // this.phoneNumber = "";
    // this.password="";
    // this.retypePassword="";
    // this.address="";
    // this.fullName="";
    // this.isAccepted=false;
    // this.dateOfBirth=new Date() ;
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear()-18);
  }
  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }
  register() {
    const message = `phone: ${this.phoneNumber}`+
                    `password: ${this.password}`+
                    `retypePassword: ${this.retypePassword}`+
                    `address: ${this.address}`+
                    `fullName: ${this.fullName}`+
                    `isAccepted: ${this.isAccepted}`+
                    `dateOfBirth: ${this.dateOfBirth}`;
  
    const registerDTO:RegisterDTO = {
      "fullname": this.fullName,
        "phone_number": this.phoneNumber,
        "address": this.address,
        "password": this.password,
        "retype_password": this.retypePassword,
        "date_of_birth": this.dateOfBirth,
        "facebook_account_id": 0,
        "google_account_id": 0,
        "role_id": 1
  }
  this.userService.register(registerDTO)
  .subscribe({
    next: () => {
      this.router.navigate(['/login']);          
    },
    complete: () => {
    },
    error: (error: any) => {          
      alert(`Cannot register, error: ${error.error}`)          
    }
  })
  }

  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({'passwordMissmatch' : true});
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }

  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dateDiff = today.getDate() - birthDate.getDate();
      if (monthDiff <0 || (monthDiff===0 && dateDiff < 0 )) {
        age--;
      }
      if (age<18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({'under18ages' : true});
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
}
