import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';
import { IUser } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseurl=environment.baseUrl
  private user:IUser={tel:"",uid:""};

  constructor(private http:HttpClient) {
   }
  setUser(user:IUser){
   
    this.user=user
  }
  getUser(){
    return this.user
  }
  registro(data:{username:string,password:string,tel:string}){
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

  login(data:{password:string,tel:string}){
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
