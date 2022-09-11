export interface IUser{
  username?:string
  tel:string,
  uid:string,
}
export interface IContacto{
  username?:string
  tel:string,
  online?:boolean,
  uid:string,
  newMensaje?:boolean
}
export interface IMensajes{
  remitente:string,
  destino:string,
  mensaje:string,
  createdAt?:string,
  isenviado:boolean,
}
export interface INewMensage{
  user:IContacto,
  mensage?:IMensajes
}
