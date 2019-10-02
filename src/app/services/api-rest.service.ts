import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  private apiUrl = "http://localhost:7000/";

  constructor(private http: HttpClient) {}

  getHeaders(){

    return new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTcwMTEwMTQyLCJqdGkiOiI2ZDVlODQxODExOWE0MmQyYjQ4ZTI0ZjA1Y2MxZjMwOSIsInVzZXJfaWQiOiI3YWY5ZTNkNi1mN2Y3LTRiZWUtYjM0Yy1jYzJlZTI4NGFmZTcifQ.Z8-3ERx2MSLNKpZdA7MpvF54vABkG6REXNkuM8ZWwfA'
    });
  }

  listadoProyectos(){
    
    return this.http.get(this.apiUrl + 'proyectos/list/', {headers: this.getHeaders()});    
  }
}
