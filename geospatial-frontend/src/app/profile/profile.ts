import { Component, OnInit } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Trail } from '../models/trail.model';
import { TrailService } from '../services/trail.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review } from '../models/review.model';
import { ReviewService } from '../services/review.service';
import { UserServices } from '../services/user.services';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, FormsModule, SelectButtonModule, ButtonModule, AvatarModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  stateOptions = [
    { label: 'My Trails', value: 'trails' },
    { label: 'My Reviews', value: 'reviews' }
  ];

  ngOnInit() {
  this.loadMyTrails();
  this.loadMyReviews();
  }

  selectedOption: 'trails' | 'reviews' = 'trails';

  myTrails: Trail[] = [];
  myReviews: Review[] = [];
  reviews: Review[] = [];

  constructor(
    private trailService: TrailService,
    private reviewService: ReviewService, 
    public userService: UserServices,
    private router: Router
  ) {}

  loadMyTrails() {
    this.trailService.getUserTrails().subscribe(data => {
      this.myTrails = data;
    });
  }

  loadMyReviews() {
    this.reviewService.getUserReviews().subscribe(data => {
      this.myReviews = data;
    });
  }

  onOptionChange() {
    if (this.selectedOption === 'trails' && this.myTrails.length === 0) {
      this.loadMyTrails();
    }

    if (this.selectedOption === 'reviews' && this.myReviews.length === 0) {
      this.loadMyReviews();
    }
  }

  deleteTrail(id: number){
    this.trailService.deleteTrail(id).subscribe(data =>{
      this.loadMyTrails();
    })
  }

   getReviews(id: number){
    this.router.navigate([`review-list/${id}`])
  }

  deleteReview(reviewId: number) {
  this.reviewService.deleteReview(reviewId).subscribe(() => {
      this.loadMyReviews();
  });
}
}
