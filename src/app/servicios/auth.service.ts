import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const URL = environment.API_URL;
// ID para el rol del invitado
const ROLID = 'e52ec910-0f33-4f94-879f-2e83258dde0b';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string = null;
  private user: User;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController
  ) { }

  querystring(obj: object): string {
    return Object.keys(obj)
      .map(key => {
        return key + '=' + obj[key];
      }).join('&');
  }

  login(email: string, password: string) {

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const querystring = this.querystring({ username: email, password });

    return this.http.post(URL + '/login/', querystring, { headers })
      .pipe(map(async (resp: any) => {
        await this.saveToken(resp.token);
        await this.saveUser(resp.user);
      }), catchError(this.handleError));
  }

  registro(userfullname: string, useremail: string, userpassword: string) {

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const querystring = this.querystring({ userfullname, useremail, userpassword, rolid: ROLID });

    return this.http.post(URL + '/usuarios/store/', querystring, { headers })
      .pipe(catchError(this.handleError));

  }

  logout() {
    this.token = null;
    this.user = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', { animated: true });
  }

  getUser() {
    if (!this.user.id) {
      this.checkToken();
    }
    return { ...this.user };
  }

  async saveToken(token: string) {
    this.token = 'Bearer ' + token;
    await this.storage.set('token', this.token);
    await this.checkToken();
  }

  async saveUser(user: User) {
    this.user = user;
    await this.storage.set('user', user);
    await this.checkToken();
  }

  async loadToken() {
    this.token = await this.storage.get('token') || null;
    this.user = await this.storage.get('user') || null;
  }

  async checkToken(): Promise<boolean> {
    await this.loadToken();
    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }
    return Promise.resolve(true);

  }


  /**
   * Handles error
   * @param error type `HttpErrorResponse`
   * @returns throwError
   */
  private handleError(error: HttpErrorResponse) {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.log(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error.message}`);
    console.log(error);
    // return an observable with a user-facing error message
    return throwError(error.error);
  }
}
