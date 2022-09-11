import { Component, OnDestroy, OnInit,HostListener  } from '@angular/core';
import { ChatserviceService } from '../../service/chatservice.service';
import { AuthService } from '../../service/auth.service';
import { IUser,IContacto, IMensajes, INewMensage } from 'src/app/interfaces/models';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { PwaServiceService } from '../../service/pwa-service.service';


interface IListMensaje{
  mensajes:IMensajes[],
  contacto:IContacto
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit,OnDestroy {
   public user:IUser={tel:"",uid:""};
   public idContacto:IContacto=null!
   public isChat:boolean=false;
   public newMessenger:INewMensage={user:{tel:"",uid:""}};
   public listMensajes:IListMensaje[]=[];
   public selectConversacion:IListMensaje={mensajes:[],contacto:{uid:"",tel:"",online:false}};
   isSelectChat:boolean=false;
   public subscribeNewMensaje:Subscription=null!;
   constructor(private chatService:ChatserviceService,private authS:AuthService,private pwaS:PwaServiceService) { }

   ngOnInit(): void {

     const token=localStorage.getItem('x-token')
     const user=JSON.parse(localStorage.getItem('user')??"")
     if (token) {
       this.user=user
       this.chatService.sendToken(token)
       this.authS.setUser(user)
      }
      this.subscribeNewMensaje=this.chatService.listen('mensaje').subscribe(data=>{
        if(this.selectConversacion.contacto.tel!==(data as any).user.tel){
          this.newMessenger={...(data as any)}
          this.listMensajes.map(i=>{
            if (i.contacto.uid==(data as any).mensage.remitente) {
              i.mensajes.push((data as any).mensage )
              return
            }
          })
          return
        }
        this.selectConversacion.mensajes.push((data as any).mensage )
      })

    }
 /*    @HostListener('window:offline')
    setNetworkOffline(): void {

    } */

    @HostListener('window:online')
    setNetworkOnline(): void {

      this.sendAuto()

    }
    ngOnDestroy(): void {
      this.subscribeNewMensaje.unsubscribe()
    }
  openChat(){
    this.isChat=!this.isChat
  }
  getMensajes(contacto:IContacto){

    const exist=this.listMensajes.find(e=>e.contacto.uid===contacto.uid)
    this.selectConversacion.contacto=contacto
    if(exist){
      this.selectConversacion={mensajes:exist.mensajes,contacto}
      this.isChat=true
      return
    }
    this.isChat=false


      this.chatService.getMensaje(contacto.uid).subscribe(data=>{
        if (data.ok) {
          const mensajes=data.mensajes.map((e:IMensajes)=>{
            return {...e,isenviado:true}
          })
          this.listMensajes.push({contacto:contacto,mensajes:mensajes})
          this.selectConversacion.mensajes=mensajes
        }
      })
      this.isChat=true

  }
   sendMensage(form2:NgForm){
    const mensaje=form2.value.mensage
    const data:IMensajes={destino:this.selectConversacion.contacto.uid,remitente:this.user.uid,mensaje,isenviado:false}
    if (this.pwaS.setData(data)) {

      this.chatService.sendMensaje(data)
    }
    this.selectConversacion.mensajes.push({...data,isenviado:navigator.onLine})
  }
  async sendAuto(){
    (await this.pwaS.postAll()).map(e=>{
      this.chatService.sendMensaje(e)
   })
  }
  selectChat(){

    this.isChat=!this.isChat
   }

}
