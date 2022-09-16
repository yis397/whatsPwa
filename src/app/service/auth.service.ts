import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';
import { IUser } from '../interfaces/models';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseurl=environment.baseUrl
  private user:IUser={tel:"",uid:""};
  private readonly KEY=environment.KEYPUSH

  constructor(private http:HttpClient,private swPus: SwPush) {
    this.subscriptPush()
   }
  setUser(user:IUser){
   
    this.user=user
  }
  subscriptPush(){
    this.swPus.requestSubscription({serverPublicKey:this.KEY}).then(
      resp=>{
        const token=JSON.parse(JSON.stringify(resp))
        localStorage.setItem('x-push',token)
      }
    ).catch(err=>console.log)
  }
  getUser(){
    return this.user
  }
  registro(data:{username:string,password:string,tel:string,push:string}){
    const urll=`${this.baseurl}/auth/register`
    return this.http.post(urll,data)
    .pipe(
      tap(({ok,user,token}:any)=>{
         if (ok) {
          localStorage.setItem('x-token',token)
          localStorage.setItem('user',JSON.stringify(user))
          this.user=user;
         }
      }),
      map(resp=>resp),
      catchError(err=>of(err.error)
      ))
  }

  login(data:{password:string,tel:string,push:string}){
    const url=`${this.baseurl}/auth/login`
    return this.http.post(url,data)
    .pipe(
      tap(({ok,user,token}:any)=>{
         if (ok) {
          localStorage.setItem('x-token',token)
          localStorage.setItem('user',JSON.stringify(user))
          this.user=user
         }
      }),
      map(resp=>resp),
      catchError(err=>of(err.error),
      ))
  }

}
