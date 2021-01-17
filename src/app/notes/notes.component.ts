import { Component, OnInit, Input } from '@angular/core';
import { CommonModule} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { MessageService } from '../message.service';

import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormsModule } from '@angular/forms';

import { NotesService} from '../notes.service';
import { LabelService} from '../label.service';
import { Note } from '../note';
import { User } from '../user';
import { Label } from '../label';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notes : Note[];	
  note : Note;	
  labels : Label[];
  allLabels : Label[];
  label : Label;	
  searchResults : Note[];
  tabelLength = 4;
  newNoteForm;
  noteSearchForm;
  isZichtbaarNew 	: boolean = false; 
  isZichtbaarList 	: boolean = true; 
  isZichtbaarSearch : boolean = false; 
  isZichtbaarSearchForm : boolean = false; 
  isZichtbaarSearchResults : boolean = false; 
  notesTitle : string = 'Notities';
  activeUserId : number = 0;
  selectedLabel : number = -1;
  newLabelText : string = '';

  constructor( 
	  private route: ActivatedRoute,
	  private notesService: NotesService,
	  private messageService: MessageService, 
	  private labelService: LabelService, 
	  private formBuilder: FormBuilder
	) { 
	  	this.newNoteForm = this.formBuilder.group({
			noteId : 0,
			noteUserId : 0, 
			noteText: '',
			labelText: ''
		});
	  	this.noteSearchForm = this.formBuilder.group({
			noteUserId : 0, 
			searchString: '',
			searchType: 'Beiden',
			searchLabel: -1
		})
  };

  ngOnInit(): void {
	this.route.params.subscribe(routeParams => {
		if (routeParams.action ==  'list') {
			this.getNotesList(routeParams.id);
		} else if (routeParams.action ==  'add') {
			this.createNote(routeParams.id);
		} 
	});
  }

 getNotesList(noteUserId: number) {
	this.getUser(noteUserId).then(data => {
		this.notesTitle = 'Notities van ' + data.name;
		this.activeUserId = noteUserId;
	});
	this.hideForm();
	this.hideSearch();
	this.showList();
	this.notesService.getNotes(noteUserId)
		.subscribe(notes => this.notes = notes);	
 }

 getLabelList(noteId: number) {
	this.labelService.getLabels(noteId)
		.subscribe(labels => this.labels = labels);	
 }

 getLabels() {
	this.labelService.getAllLabels()
 		.subscribe(labels => {
			this.allLabels = labels
			this.selectedLabel = labels[0].id;	
		});	
}

 async getNote(id: number) {
	let myNote = await this.notesService.getNote(id);
	return myNote;
 }

 async getUser(id: number) {
	let myUser = await this.notesService.getUser(id);
	return myUser;
 }

 async insertNote(noteUserId: number, noteText: string) {
	let newNote = await this.notesService.createNote(noteUserId, noteText);
	if (newNote.created > 0) {
		this.messageService.clear();
		this.messageService.add('Note ' + newNote.created + ' was created!')
		this.getNotesList(noteUserId);	
	}
 }
 async updateNote(noteId: number, noteText: string) {
	let updatedNote = await this.notesService.updateNote(noteId, noteText);
	if (updatedNote.updated > 0) {
		this.messageService.clear();
		this.messageService.add('Note ' + updatedNote.updated + ' was updated!')
		this.getNotesList(this.activeUserId);	
	}
 }

 async deleteNote(id: number) {
	let deletedNote   = await this.notesService.deleteNote(id);
	if (deletedNote.deleted > 0) {
		this.messageService.clear();
		this.messageService.add('Note ' + deletedNote.deleted + ' was deleted!')
		//this.getNotesList(this.activeUserId);
		window.location.reload();
	}
  }

 async deleteNoteLabel(id: number) {
	let deletedNote   = await this.labelService.deleteNoteLabel(id);
	if (deletedNote.deleted > 0) {
		this.messageService.clear();
		this.messageService.add('Label ' + deletedNote.deleted + ' was deleted!')
		this.getLabelList(this.newNoteForm.get('noteId').value);	
	}
  }

  editNote(id: number) {
	this.hideList();
	this.hideSearch();
	this.showForm();
	this.getLabelList(id);
	this.getLabels();
	this.getNote(id).then(data => {
		this.newNoteForm.setValue({
	      noteId: data.id,
	      noteUserId: data.userId,
		  noteText: data.noteText,
		  labelText: ''
	    });
	});
  }

  createNote(noteUserId: number) {
	this.getUser(noteUserId).then(data => {
		this.notesTitle = 'Notities van ' + data.name;
	});
	this.labels = [];
	this.hideList();
	this.hideSearch();
	this.getLabels();
	this.showForm();
	this.newNoteForm.setValue({
      noteId: 0,
      noteUserId: noteUserId,
	  noteText: '',
	  labelText : ''
	});
  }

  clearTextNote() {
	this.newNoteForm.setValue({
	  noteId: this.newNoteForm.get('noteId').value,
	  noteUserId: this.newNoteForm.get('noteUserId').value,
	  noteText: '',
	  labelText: this.newNoteForm.get('labelText').value
	});
  }

  clearTextLabel() {
	this.newNoteForm.setValue({
	  noteId: this.newNoteForm.get('noteId').value,
	  noteUserId: this.newNoteForm.get('noteUserId').value,
	  noteText: this.newNoteForm.get('noteText').value,
	  labelText: ''
	});
  }
  searchNotesForm(noteUserId: number) {
	this.getLabels();
	this.noteSearchForm.setValue({
	  	noteUserId: noteUserId,
 		searchString: '',
		searchType: 'Beiden',
		searchLabel: -1
	});
	this.hideList();
	this.hideForm();
	this.hideSearchResults();
	this.showSearchForm();
	this.showSearch();
  }

  onSubmit(noteData) : void {
	this.hideForm();
	if (noteData.noteId > 0) {
		this.updateNote(noteData.noteId, noteData.noteText);
	} else {		
		this.insertNote(noteData.noteUserId, noteData.noteText);
	}
	this.newNoteForm.reset();	
	this.showList();
  }

  onOptionsSelected(id: number) {
	this.selectedLabel = id;
  }

  insertNoteLabel() {
	let noteId = this.newNoteForm.get('noteId').value;
	this.addNoteLabel(noteId, this.selectedLabel).then();
  }

  insertNoteLabelText(){
	let noteId = this.newNoteForm.get('noteId').value;
	let labelText = this.newNoteForm.get('labelText').value;
	this.addNoteLabelText(noteId, labelText).then();
	this.clearTextLabel();
  }

  async addNoteLabelText(noteId: number, labelText: string) {
	let newNoteLabel = await this.labelService.createNoteLabelText(noteId, labelText);
	if (newNoteLabel.created > 0) {
		this.messageService.clear();
		this.messageService.add('NoteLabel ' + newNoteLabel.created + ' was created!')
		this.getLabelList(noteId);	
		this.getLabels();	
	}
  }
 
 async addNoteLabel(noteId: number, labelId: number) {
	let newNoteLabel = await this.labelService.createNoteLabel(noteId, labelId);
	if (newNoteLabel.created > 0) {
		this.messageService.clear();
		this.messageService.add('NoteLabel ' + newNoteLabel.created + ' was created!')
		this.getLabelList(noteId);	
	}
 }

  back() : void {
	this.hideForm();
	this.hideSearch();
	this.showList();
  }

  doSearch(searchData) {
	this.searchResults = [];
	this.hideSearchForm();
	this.hideList();
	this.showSearchResults();
	this.notesService.searchNotes(searchData.noteUserId, searchData.searchType, searchData.searchString, searchData.searchLabel)
		.subscribe(notes => this.searchResults = notes);	
  }

  private showForm() {
	this.isZichtbaarNew = true;
  }

  private hideForm() {
	this.isZichtbaarNew = false;
  }

  private showList() {
	this.isZichtbaarList = true;
  }

  private hideList() {
	this.isZichtbaarList = false;
  }

  private showSearch() {
	this.isZichtbaarSearch = true;
  }

  private hideSearch() {
	this.isZichtbaarSearch = false;
  }

  private showSearchForm() {
	this.isZichtbaarSearchForm = true;
  }

  private hideSearchForm() {
	this.isZichtbaarSearchForm = false;
  }

  private showSearchResults() {
	this.isZichtbaarSearchResults = true;
  }

  private hideSearchResults() {
	this.isZichtbaarSearchResults = false;
  }
}



