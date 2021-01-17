import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { Note } from './note';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class NotesService {

  private noteUrl = 'https://rocky-unmarred-medusaceratops.glitch.me/note';		//used for retrieving a single note
  private notesUrl = 'https://rocky-unmarred-medusaceratops.glitch.me/notes'; 	//used for Creating, Updating and Deleting a note
  private usersUrl = 'https://rocky-unmarred-medusaceratops.glitch.me/users'; 	//used for retrieving a single user
  private searchUrl = 'https://rocky-unmarred-medusaceratops.glitch.me/search'; //used for searching a notes

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getNotes(id: number) : Observable<Note[]> {
	return this.http.get<Note[]>(this.notesUrl + '/' + id)
		.pipe(catchError(this.handleError<Note[]>('getNotes', [])));
  }
	
  searchNotes(userId: number, searchType: string, searchTekst: string, searchLabel: number) : Observable<Note[]> {
	//https://rocky-unmarred-medusaceratops.glitch.me/search/14/Beiden/1/1
	if (searchTekst == '') {
		searchTekst = 'blanco';
	}
	return this.http.get<Note[]>(this.searchUrl + '/' + userId + '/' + searchType + '/' + searchTekst + '/' + searchLabel)
		.pipe(catchError(this.handleError<Note[]>('getNotes', [])));
  }
  async createNote(noteUserId: number, noteText: string) : Promise<any> {
	let response = await this.http.post(this.notesUrl + '/' + noteUserId,  { note: noteText }).toPromise();
	return response;
  }

  async updateNote(noteId: number, noteText: string) : Promise<any> {
	let response = await this.http.put(this.notesUrl + '/' + noteId,  { text: noteText }).toPromise();
	return response;
  }

  async deleteNote(id: number) : Promise<any> {
	let response = await this.http.delete(this.notesUrl + '/' + id).toPromise();
	return response;
  }

  async getNote(id: number) : Promise<any> {
	let response = await this.http.get(this.noteUrl + '/' + id).toPromise();
	return response;
  }

  async getUser(id: number) : Promise<any> {
	let response = await this.http.get(this.usersUrl + '/' + id).toPromise();
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