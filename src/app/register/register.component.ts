import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataProviderService } from '../data-provider.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  userData;
  userRegisterForm!: FormGroup;
  successMessage = false;
  constructor(
    private api: DataProviderService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initiateRegisterForm();
  }
  initiateRegisterForm() {
    this.userRegisterForm = this.formBuilder.group({
      userEmailId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', Validators.required],
      userName: ['', Validators.required],
    });
  }
  get form() {
    return this.userRegisterForm.controls;
  }

  addNewuser() {
    this.api.newUSer(this.userRegisterForm.value).subscribe(
      (data) => {
        console.log(data);
        this.successMessage = true;
        this.userRegisterForm.reset();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
