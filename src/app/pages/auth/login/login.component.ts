import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent   {
  public isError:boolean=false;
  public msg:string="";
  formLogin:FormGroup=this.fb.group({
    tel:['',[Validators.required,Validators.minLength(6)]],
    password:['',[Validators.required,Validators.minLength(6)]],
  })
  constructor(private fb:FormBuilder,private authSer:AuthService,private ruta:Router) { }


   validCampos(name:string){
   return this.formLogin.controls[name].errors
   && this.formLogin.controls[name].touched
  }
   login(){
    const {tel,password}=this.formLogin.value
    this.authSer.login({tel,password})
    .subscribe(data=>{
      if (data.ok) {
        this.formLogin.reset()
        this.isError=false
        setTimeout(() => {
          
          this.ruta.navigateByUrl('/chat')
        }, 1000);
        return
      }
      this.msg=data.msg
      this.isError=true
      setTimeout(() => {
        this.isError=false
      }, 2000);
    })
  }

}
