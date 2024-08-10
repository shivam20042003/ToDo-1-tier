import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  keyData = '';
  constructor() { }
  setData(val:string){
    this.keyData = val;
  }
  getData(){
    return this.keyData;
  }
}
