import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  users : User[];	
  user : User;	
  userForm;
  isZichtbaarList: boolean = true;
  isZichtbaarForm: boolean = false;

  constructor(private route: ActivatedRoute, private userService : UserService, private messageService: MessageService, private formBuilder: FormBuilder) { 
	  this.userForm = this.formBuilder.group({
      	nameUser: ''
  	});
  }

  ngOnInit(): void {
	this.route.params.subscribe(routeParams => {
		if (routeParams.action ==  'new') {
			this.createUserForm();
		} else {
			this.getUsers()
		} 
	});
  }

  getUsers() : void {
	this.userService.getUsers()
		.subscribe(users => this.users = users);	
  }

  getUser(id: number) : void {
	this.userService.getUser(id)
		.subscribe(user => this.user = user);	
  }
  async deleteUser(id: number) {
	let deletedUser  = await this.userService.deleteUser(id);
	if (deletedUser.deleted > 0) {
		this.messageService.clear();
		this.messageService.add('User ' + deletedUser.deleted + ' was deleted!')
		this.getUsers();	
	}
  }

  async createUser(name: string) {
	let newUser  = await this.userService.createUser(name);
	if (newUser.created > 0) {
		window.location.reload();
		this.messageService.clear();
		this.messageService.add('User "' + name +'" (' + newUser.created + ') was created!')
	}
  }

  createUserForm() : void {
		this.hideList();
		this.showForm();
  }

  private showForm() {
	this.isZichtbaarForm = true;
  }

  private hideForm() {
	this.isZichtbaarForm = false;
  }

  private showList() {
	this.isZichtbaarList = true;
  }

  private hideList() {
	this.isZichtbaarList = false;
  }


  onSubmit(userData) : void {
	this.createUser(userData.nameUser);
	this.userForm.reset();
	
  }
}
