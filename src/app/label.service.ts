import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { Label } from './label';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class LabelService {
	
  private labelUrl = 'https://rocky-unmarred-medusaceratops.glitch.me/noteLabels'; 			//The Labels linked to notes 
  private allLabelUrl = 'https://rocky-unmarred-medusaceratops.glitch.me/labels'; 			//All Labels 
  private labelTextUrl = 'https://rocky-unmarred-medusaceratops.glitch.me/noteLabelText';	//Add Text directly to note as label 
  constructor(private http: HttpClient, private messageService: MessageService) { }

  getLabels(noteId: number) : Observable<Label[]> {
	return this.http.get<Label[]>(this.labelUrl + '/'+noteId)
		.pipe(catchError(this.handleError<Label[]>('getLabels', [])));
  }

  getAllLabels() : Observable<Label[]> {
	return this.http.get<Label[]>(this.allLabelUrl)
		.pipe(catchError(this.handleError<Label[]>('getLabels', [])));
  }

  async deleteNoteLabel(id: number) : Promise<any> {
	let response = await this.http.delete(this.labelUrl + '/' + id).toPromise();
	return response;
  }

  async createNoteLabel(noteId: number, labelId: number) : Promise<any> {
	let response = await this.http.post(this.labelUrl + '/' + noteId,  { label: labelId }).toPromise();
	return response;
  }

  async createNoteLabelText(noteId: number, labelText: string) : Promise<any> {
	let response = await this.http.post(this.labelTextUrl + '/' + noteId,  { label: labelText }).toPromise();
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
