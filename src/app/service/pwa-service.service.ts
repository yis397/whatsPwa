import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb-browser';
const pouchDB = (PouchDB as any).default.defaults();


@Injectable({
  providedIn: 'root'
})
export class PwaServiceService{
  pouchdb: PouchDB.Database;
  constructor() { 
    this.pouchdb = new pouchDB("db");
  }
   setData(data:any){
    if (navigator.onLine) {
      return true
    }
    
    this.pouchdb.put({_id:Date.now().toString(),data})

    return false
  }

  async postAll(){
   const data= this.pouchdb.allDocs({ include_docs: true }).then( docs => {
       return docs.rows.map(e=>{
        const data=(e.doc as any).data
         this.pouchdb.remove( e.doc?? {_id:'0',_rev:'0'});
          return data
        })
    })
    const mas=await data
    return mas
    
  
  }
}
