import { Component, OnInit } from '@angular/core';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,  Router, RouterModule } from '@angular/router';
import { ReviewService } from '../services/review.service';
import { UserServices } from '../services/user.services';

@Component({
  selector: 'app-review-list',
  imports: [CommonModule, RouterModule],
  providers: [],  templateUrl: './review-list.html',
  styleUrl: './review-list.css',
})
export class ReviewList implements OnInit{

    constructor(public userService: UserServices, private reviewService: ReviewService, private router: Router, private route: ActivatedRoute){}


  reviews: Review[] = [];
  trailId!: number;


  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) this.getReviews(Number(id));
  else this.getUserReviews();
  }

  getUserReviews() {
    this.reviewService.getUserReviews().subscribe((data: Review[]) =>{
          this.reviews = data;
        })
  }


  getReviews(trailId: number){
    this.reviewService.getReviews(trailId).subscribe((data: Review[]) =>{
          this.reviews = data;
        })
  }

  deleteReview(reviewId: number) {
  this.reviewService.deleteReview(reviewId).subscribe(() => {
      this.reviews = this.reviews.filter(r => r.id !== reviewId);
  });
}
  

}
