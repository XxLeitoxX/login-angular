import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
private apikey = 'AIzaSyCybjybKr6RaV-M3Dv9Rzv3BG34xkbgojs';

usertoken: string;


	//Crear nuevos usuarios

//	https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]

//Login

// https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]

  constructor(private http: HttpClient) {

  		this.leerToken();

   }

  logout(){

    localStorage.removeItem('token');

  }

  login(usuario: UsuarioModel){

  	const authData = {
  		...usuario,
  		returnSecureToken: true
  	};

  	return this.http.post(
  		`${this.url}/verifyPassword?key=${ this.apikey}`,
  		authData
  	).pipe(
  		map(res => {
  			this.GuardarToken(res ['idToken']);
  			return res;
  		})

  	);

  }

  nuevoUsuario(usuario: UsuarioModel){

  	const authData = {
  		email: usuario.email,
  		password: usuario.password,
  		returnSecureToken: true
  	};

  	return this.http.post(
  		`${this.url}/signupNewUser?key=${ this.apikey}`,
  		authData
  	).pipe(
  		map(res => {
  			this.GuardarToken(res ['idToken']);
  			return res;
  		})

  	);

  }


  private GuardarToken( idToken: string ){

  	this.usertoken = idToken;
  	localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString());


  }

  leerToken(){

  	if(localStorage.getItem('token')){
  		this.usertoken = localStorage.getItem('token');
  	}else{
  		this.usertoken = '';
  	}

  	return this.usertoken;

  }


  estaAutenticado(): boolean{


    if(this.usertoken.length < 2){
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if( expiraDate > new Date()){
      return true
    }else{
      return false;
    }
  }




}
