import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  private apiUrl = "http://localhost:7000/";
  private token = '';

  constructor(private http: HttpClient, private storage: Storage) {}  

  getHeadersQuery(){
    
    return new Promise((resolve, reject) => {

      this.storage.get('token')
      .then(response => {

        let token = response
        
        let headers = {
          Authorization: 'Bearer ' + token
        }

        console.log(response)
        resolve(headers)
      })
      .catch(() => {

        reject("Error");
      });
    });   
  }

  getHeadersAuth(){

    return {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  }

  login(loginInfo:object){

    let querystring = Object.keys(loginInfo).map(key => {

      return key + "=" + loginInfo[key]
    }).join('&');

    return this.http.post(this.apiUrl + 'login/', querystring, {headers: this.getHeadersAuth()});
  }

  listadoProyectos(){    

    return new Promise((resolve, reject) => {

      this.getHeadersQuery()
      .then((response:any) => {

        this.http.get(this.apiUrl + 'proyectos/list/', {headers: new HttpHeaders(response) })
        .subscribe(
          (response) => {

            resolve(response)
          },
          () => reject("error")
        );    
      })
    })

  }

  detalleProyecto(id){

    return new Promise((resolve, reject) => {

      this.getHeadersQuery()
      .then((response:any) => {

        this.http.get(this.apiUrl + 'proyectos/detail/' + id, {headers: new HttpHeaders(response)})
        .subscribe(
          (response) => {

            resolve(response)
          },
          () => reject("error")
        );    
      })
    })   
  }
}
