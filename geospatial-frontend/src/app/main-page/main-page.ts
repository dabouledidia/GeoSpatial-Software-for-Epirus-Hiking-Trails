import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserServices } from '../services/user.services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-main-page',
  imports: [ReactiveFormsModule, RouterModule, CardModule, ButtonModule],
  providers: [],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {

}
