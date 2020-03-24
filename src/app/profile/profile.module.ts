import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Profile } from './profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

export const routes = [
  {path: '', component: Profile, pathMatch: 'full'},
  {path:'editProfile', component: EditProfileComponent, pathMatch:'full' }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    Profile,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class ProfileModule {
  static routes = routes;
}
