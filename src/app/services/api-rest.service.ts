import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  private apiUrl = "http://167.99.11.184:90/";
  private token = '';
  public authenticationState = new BehaviorSubject(false);

  constructor(private http: HttpClient, private storage: Storage, private router: Router) {}  

  authenticationStateObservable(){

    return this.authenticationState.asObservable();
  }

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

    return new Promise((resolve, reject) => {    

      let querystring = Object.keys(loginInfo).map(key => {

        return key + "=" + loginInfo[key]
      }).join('&');

      this.http.post(this.apiUrl + 'login/', querystring, {headers: this.getHeadersAuth()}).subscribe((response:any) => {

        this.storage.set('token', response.token).then(response => {

          this.authenticationState.next(true);

          resolve(response);
        })       
      },
      response => {

        reject(response)
      });
    });
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

  logout(){

    return new Promise((resolve, reject) => {

      this.storage.remove('token').then(() => {

        this.router.navigate(['/login']).then(() => {

          resolve({});
        })        
        
      })
      .catch(() => {

        reject({});
      })
    });   
  }
}
