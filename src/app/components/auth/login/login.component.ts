import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  response = true;
  message: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["/menu"]);
    }
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    let value = this.loginForm.value;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.response = true;
      return;
    }

    this.authService.login(this.form.username.value, this.form.password.value).subscribe(response => {
      console.log(response);
      if (response['response']) {
          this.router.navigate(["/menu"]);
      } else {
        this.response = response['response'];
        this.message = response['message'];
      }
    });

  }

}
