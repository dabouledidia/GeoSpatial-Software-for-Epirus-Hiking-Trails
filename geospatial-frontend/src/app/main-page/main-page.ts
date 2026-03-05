import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserServices } from '../services/user.services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';



@Component({
  selector: 'app-main-page',
  imports: [ReactiveFormsModule, RouterModule, CardModule, ButtonModule, CarouselModule, DialogModule],
  providers: [],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {

  aboutVisible = false;
  privacyVisible = false;
  termsVisible = false;

  showAbout() {
    this.aboutVisible = true;
  }

  showPrivacy() {
    this.privacyVisible = true;
  }

  showTerms() {
    this.termsVisible = true;
  }

}
