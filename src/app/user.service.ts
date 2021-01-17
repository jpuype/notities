import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { User } from './user';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {
	
  private usersUrl = 'https://rocky-unmarred-medusaceratops.glitch.me/users';

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getUsers() : Observable<User[]> {
	return this.http.get<User[]>(this.usersUrl)
		.pipe(catchError(this.handleError<User[]>('getUsers', [])));
  }
	
  getUser(id: number) : Observable<User> {
	this.messageService.clear();
	this.messageService.add('Details for user (' + id + ') were retrieved!');
	return this.http.get<User>(this.usersUrl + '/' + id)
		.pipe(catchError(this.handleError<User>('getUser')));
  }

  async deleteUser(id: number) : Promise<any> {
	let response = await this.http.delete(this.usersUrl + '/' + id).toPromise();
	return response;
  }

  async createUser(name: string) : Promise<any> {
	let response = await this.http.post(this.usersUrl,  { name: name }).toPromise();
	return response;
  }

  private handleError<T>(operation = 'operation', result?: T) {
	return (error: any): Observable<T> => {
	
	  // TODO: send the error to remote logging infrastructure
	  console.error(error); // log to console instead
	
	  // TODO: better job of transforming error for user consumption
	  this.log(`${operation} failed: ${error.message}`);
	
	  // Let the app keep running by returning an empty result.
	  return of(result as T);
	};
  }
	
  private log(message: string) {
	this.messageService.add(`UserService: ${message}`);
  }
}
