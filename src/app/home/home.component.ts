import { Component, inject } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { ServiceService } from '../services/service.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private router = inject(Router);
  list:any[] = [];
  key = '';
  data = {
    key:'',
    userD:{},
    todoData:[] as any
  }
  userData:any;
  todoForm: FormGroup = new FormGroup({
    todoInput:new FormControl('',[Validators.required])
  })
  constructor(private service:ServiceService,){
    this.key = service.getData();
    let stringData:any;
    stringData = localStorage.getItem(this.key);
    if (stringData==null) {
      this.router.navigate(['']);
    }
    else{
      this.data = JSON.parse(stringData);
      this.userData = this.data.userD;
      this.list = this.data.todoData;      
    }
  }
  addItem(){
    if (this.todoForm.valid) {
      this.list.push({id:this.list.length,name:this.todoForm.value.todoInput});
      this.saveData();
    }
  }
  removeT(id:number){
    this.list = this.list.filter(item=>item.id!==id);
    this.saveData();
  }
  newUserDet ='';
  userDetailUp(){
    let val:any;
    val = localStorage.getItem(this.key);
    this.newUserDet =  JSON.parse(val).userD;
  }
  saveData(){
    this.userDetailUp();
    this.data.key = this.key;
    this.data.userD = this.newUserDet;
    this.data.todoData = this.list;
    localStorage.removeItem(this.key);
    localStorage.setItem(this.key,JSON.stringify(this.data));
  }
  logout(){
    this.router.navigate(['']);
  }
  deleteAcc(){
    localStorage.removeItem(this.key);
    this.router.navigateByUrl('');
  }
}
