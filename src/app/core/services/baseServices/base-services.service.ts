import {inject, Injectable} from '@angular/core';
import { environmentDev } from '../../../../environments/environmentDev';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { AuthentificationService } from '../authenticate/authentification.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BaseServicesService {
  private baseUrl: string = environmentDev.baseUrl;

  constructor(private http: HttpClient, private authenticate: AuthentificationService) {

  }
  private getHeader(): HttpHeaders{
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' +this.authenticate.getToken(),
    });
  }

  getOne(id: number, endpoint: string): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/${id}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }


  getOneWithToken(slug: string|null, endpoint: string): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/${slug}/`;
    return this.http.get(url,{headers: this.getHeader() }).pipe();
  }


  getAll(endpoint: string): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http
      .get(url)
      .pipe(shareReplay(1), catchError(this.handleError));
  }


  getAllWithToken(endpoint: string): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http
      .get(url, {headers: this.getHeader()})
      .pipe(shareReplay(1), catchError(this.handleError));
  }


  post(endpoint: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/`;
    return this.http.post(url, data).pipe(catchError(this.handleError));
  }


  postWithToken(endpoint: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/`;
    return this.http.post(url, data, { headers: this.getHeader() });
  }


  patch(endpoint: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/`;
    return this.http.patch(url, data, { headers: this.getHeader() });
  }

  patchWithSlug(endpoint: string, slug: any, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/${slug}/`;
    return this.http.patch(url, data, { headers: this.getHeader() });
  }


  put(endpoint: string, id: number, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/${id}`;
    return this.http.put(url, data, { headers: this.getHeader() });
  }


  putWithToken(endpoint: string, slug: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/${slug}/`;
    return this.http.put(url, data, { headers: this.getHeader() });
  }


  putWithTokenWithoutId(endpoint: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/`;
    return this.http.put(url, data, {headers: this.getHeader() });
  }



  delete(endpoint: string, id: number): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}/${id}`;
    return this.http.delete(url).pipe(this.handleError);
  }


  private handleError(error: any): any {
    let errorMessage: string = 'Oups quelque chose a mal tourné';
    console.log(error.error.detail)
    switch (error) {
      case 400:
        errorMessage = 'Le formulaire est invalide';
        break;
      case 401:
        errorMessage = "Vous n'êtes pas authentifié";
        break;
      case 403:
        errorMessage = "Vous n'avez pas les droits nécessaires";
        break;
      case 404:
        errorMessage = "La page demandée n'existe pas";
        break;
      case 500:
        errorMessage = "Une erreur interne du serveur s'est produite";
        break;
      default:
        errorMessage = `Erreur : ${error.status} - ${error.message}`;
    }
    return throwError(new Error(errorMessage));
  }
}
