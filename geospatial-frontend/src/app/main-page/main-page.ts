import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserServices } from '../services/user.services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-main-page',
  imports: [ReactiveFormsModule, RouterModule, CardModule, ButtonModule, CarouselModule, DialogModule, TagModule, DividerModule,
    CommonModule
  ],
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

  cards = [
  {
    title: 'Explore Trails',
    description: 'Looking forward to explore trails around Epirus? This is the right place!',
    image: 'assets/images/explore.jpg',
    link: '/trail-list'
    //TODO make browse and filters
  },
  {
    title: 'View All Trails',
    description: 'View detailed info for each trail, including distance, difficulty, reviews etc!',
    image: 'assets/images/traillist.jpg',
    link: '/trail-list'
  },
    {
    title: 'Create A Trail',
    description: 'Add your favourite trails so other people can visit and see what you saw!',
    image: 'assets/images/create.jpg',
    link: '/create-trail'
  }
];

carouselImages = [
  'assets/images/mainpage1.jpg',
  'assets/images/mainpage2.jpeg',
  'assets/images/mainpage3.jpg'
];


}
