import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  private apiUrl = "http://167.99.11.184:90/";

  constructor(private http: HttpClient) {}

  getHeaders(){

    return new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTcwMTk4MjMwLCJqdGkiOiIxYWZlZWVjOTdhN2Q0YzFlODNiYzZhNGVkMWNjZjkyZCIsInVzZXJfaWQiOiI3YWY5ZTNkNi1mN2Y3LTRiZWUtYjM0Yy1jYzJlZTI4NGFmZTcifQ.b-87XVTa_5JOxeIEJzQN-S85nWHE0Iti4YsmV0Tw5bA'
    });
  }

  listadoProyectos(){
    
    return this.http.get(this.apiUrl + 'proyectos/list/', {headers: this.getHeaders()});    
  }

  detalleProyecto(id){

    return this.http.get(this.apiUrl + 'proyectos/detail/' + id, {headers:this.getHeaders()});
  }
}
