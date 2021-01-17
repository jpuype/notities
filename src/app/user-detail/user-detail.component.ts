import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserService} from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input() user: User;

  constructor( 
	  private route: ActivatedRoute,
	  private userService: UserService,
	  private location: Location
  ) {}

  ngOnInit(): void {
	this.route.params.subscribe(routeParams => {
		this.getUser(routeParams.id)
	});
  }

  getUser(id: number): void{
	this.userService.getUser(id)
		.subscribe(user => this.user = user)
  }

    goBack(): void {
	this.location.back();
  }
}
