import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate,CanLoad {
  private user:any=null
  constructor(private authServce: AuthService,private ruta:Router){
    if (localStorage.getItem('user')) {
      
      this.user=JSON.parse(localStorage.getItem('user')??"")
    }
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (!this.user){
        this.ruta.navigate(['auth/login'])
 
        return false
      }
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.user){
        this.ruta.navigate(['auth/login'])
        return false
      }
      console.log(this.authServce.getUser());
    return true;
  }
}
