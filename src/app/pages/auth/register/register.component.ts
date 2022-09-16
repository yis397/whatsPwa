import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public  isError:boolean=false;
  public  msg:string="false";
  formRegister:FormGroup=this.fb.group({
    tel:['',[Validators.required,Validators.minLength(6)]],
    username:['',[Validators.required]],
    password:['',[Validators.required,Validators.minLength(6)]],
    password2:['',[Validators.required,this.isEqual('password','password2')]]
  },)
  constructor(private fb:FormBuilder,
              private authServ:AuthService,
              private ruta:Router) { }

  ngOnInit(): void {
  }
  isEqual(pass1:string,pass2:string){
    return (formGroup:AbstractControl):ValidationErrors|null=>{
      const pas1=formGroup.get(pass1)?.value;
      const pas2=formGroup.get(pass2)?.value;
      if (pas1!==pas2) {
       return{ equal:true}
      }
      return null
    }
  }
  validCampos(name:string){
    return this.formRegister.controls[name].errors
    && this.formRegister.controls[name].touched
   }
  registerUser(){
    const {username,tel,password}=this.formRegister.value
    this.authServ.registro({username,tel,password,push:localStorage.getItem('x-push')??'nel'})
    .subscribe(data=>{
      if (data.ok) {
        setTimeout(() => {
          this.ruta.navigate(['chat'])
          
        }, 1000);
        return
      }

      this.isError=true
      this.msg=data.msg
      setTimeout(() => {
        this.isError=false
      }, 2000);
    })
  }

}
