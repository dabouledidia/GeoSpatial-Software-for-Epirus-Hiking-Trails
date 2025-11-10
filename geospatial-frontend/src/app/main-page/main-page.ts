import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserServices } from '../services/user.services';

@Component({
  selector: 'app-main-page',
  imports: [ReactiveFormsModule, RouterModule],
  providers: [],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {

}
