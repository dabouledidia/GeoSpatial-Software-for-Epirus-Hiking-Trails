import { Component, OnInit } from '@angular/core';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,  Router, RouterModule } from '@angular/router';
import { ReviewService } from '../services/review.service';
import { UserServices } from '../services/user.services';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-review-list',
  imports: [CommonModule, RouterModule, TableModule, RatingModule, FormsModule, DialogModule],
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
                this.calculateReviewStats(); 

          this.reviews = data;
        })
  }


  getReviews(trailId: number){
    this.reviewService.getReviews(trailId).subscribe((data: Review[]) =>{
          this.reviews = data;
          this.calculateReviewStats(); 
        })
  }

  deleteReview(reviewId: number) {
  this.reviewService.deleteReview(reviewId).subscribe(() => {
      this.reviews = this.reviews.filter(r => r.id !== reviewId);
  });
}

fullComment: string = '';
displayCommentDialog: boolean = false;

showFullComment(text: string) {
  this.fullComment = text;
  this.displayCommentDialog = true;
}

averageRating = 0;

ratingCounts: Record<number, number> = {  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0
};

calculateReviewStats() {

  if (!this.reviews.length) {
    this.averageRating = 0;
    return;
  }

  const total = this.reviews.reduce(
    (sum, r) => sum + r.rating,
    0
  );

  this.averageRating = total / this.reviews.length;

  this.ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  this.reviews.forEach(r => {
    this.ratingCounts[r.rating]++;
  });
}

  

}
