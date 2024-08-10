declare var google: any;
import { Component, inject, NgZone, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {FormGroup,FormControl,FormControlName, ReactiveFormsModule} from '@angular/forms';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  data = {
    key:'',
    userD:{},
    todoData:[]
  }
  loginForm:FormGroup = new FormGroup({
    username:new FormControl(''),
    password: new FormControl('')
  })
  constructor(private zone: NgZone,private service:ServiceService){}
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id:'806053061246-ald0m6a9rhmuca3p78kh54ahsfu0jnlj.apps.googleusercontent.com',
      callback: (resp:any)=>{ this.handleLogin(resp)}
    });
    google.accounts.id.renderButton(document.getElementById("google-btn"),{
      theme:'filled_blue',
      size:'large',
      shape:'rectangle',
      width:350,
    })
  }
  private decodeToken(token:string){
    return JSON.parse(atob(token.split(".")[1]));
  }
  handleLogin(response:any){
    if (response) {
      const payLoad = this.decodeToken(response.credential);
      console.log(payLoad);
      this.data.key = payLoad.email;
      this.data.userD = payLoad;
      let pastData = localStorage.getItem(this.data.key);
      if (pastData==null) {
        localStorage.setItem(this.data.key,JSON.stringify(this.data));
        this.service.setData(this.data.key);
        this.zone.run(() => {
          this.router.navigate(['home']);
        });
      } else {
        let pastTodoD = JSON.parse(pastData).todoData;
        this.data.todoData = pastTodoD;
        localStorage.removeItem(this.data.key);
        localStorage.setItem(this.data.key,JSON.stringify(this.data));
        this.service.setData(this.data.key);
        this.zone.run(() => {
          this.router.navigate(['home']);
        });
      }
    }
  }
  login(){
    let man = 'manual';
    let modUser = this.loginForm.value.username.concat(man);
    let existing:any = localStorage.getItem(modUser);
    let existingInjson = JSON.parse(existing);
    if (existing==null) {
      alert('user doesnt exist');
    }
    else if(existingInjson.userD.password!=this.loginForm.value.password){
      alert('Invalid Credencials');
    }
    else{
      this.service.setData(modUser);
      this.zone.run(() => {
        this.router.navigate(['home']);
      });
    }
  }
}
