import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { NotesComponent } from './notes/notes.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/user/new', pathMatch: 'full'},
  { path: 'user/:action', component: UsersComponent},
  { path: 'user/detail/:id', component: UserDetailComponent},
  { path: 'notes/:action/:id', component: NotesComponent},
  { path: 'users', component: UsersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }