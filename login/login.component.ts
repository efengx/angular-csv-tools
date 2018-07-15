import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide: Boolean = true;


  formModel: FormGroup;
  // 创建了一个表单数据模型
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
  ) {
    this.formModel = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit () {

  }
  login () {
    let jsj = this.formModel.controls.username.value === 'admin' && this.formModel.controls.password.value === 'admin123456';
    if (this.formModel.valid && jsj) {
      // 这个snackBar.open必须要有三个参数
      this.snackBar.open('登陆成功！', '', {
        duration: 2000,
      });
      setTimeout(() => {
        this.router.navigate(['/home/table/1/大学']);
      }, 2000);
    } else {
      this.snackBar.open('用户名或密码有误！', '', {
        duration: 2000,
      });
    }
  }
}
