declare var google: any;
import { Component, inject, NgZone, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ServiceService } from '../services/service.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  private router = inject(Router);
  data = {
    key:'',
    userD:{
      password:'',
      email:'',
      email_verified:true,
      name:'',
      picture:''
    },
    todoData:[]
  }
  signupForm:FormGroup=new FormGroup({
    FullName:new FormControl('',[Validators.required]),
    username:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required]),
    confirmPassword:new FormControl('')
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
  get email(){
    return this.signupForm.get('username')
  }
  get name(){
    return this.signupForm.get('FullName')
  }
  get pass(){
    return this.signupForm.get('password')
  }
  signup(){
    let man = 'manual';
    let modUser = this.signupForm.value.username.concat(man);
    let existing = localStorage.getItem(modUser);
    if (this.signupForm.value.password!=this.signupForm.value.confirmPassword) {
      alert('check the password');
    }
    else if (existing) {
      alert('user already exists');
    }
    else{
      this.data.key = this.signupForm.value.username;
      this.data.userD.email = this.signupForm.value.username;
      this.data.userD.name = this.signupForm.value.FullName;
      this.data.userD.password = this.signupForm.value.password;
      this.data.userD.picture = 'public/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg';
      localStorage.setItem(modUser,JSON.stringify(this.data));
      this.service.setData(modUser);
      this.zone.run(() => {
        this.router.navigate(['home']);
      });
    }
  }
}
