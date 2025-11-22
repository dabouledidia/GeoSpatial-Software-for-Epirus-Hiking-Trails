import { Component, OnInit } from '@angular/core';
import { Review } from '../models/review.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,  Router, RouterModule } from '@angular/router';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-review-list',
  imports: [CommonModule, RouterModule],
  providers: [ReviewService],  templateUrl: './review-list.html',
  styleUrl: './review-list.css',
})
export class ReviewList implements OnInit{

    constructor(private reviewService: ReviewService, private router: Router, private route: ActivatedRoute){}


  reviews: Review[] = [];
  trailId!: number;


  ngOnInit(): void {
  this.trailId = Number(this.route.snapshot.paramMap.get('id'));
  this.getReviews(this.trailId);
}

  getReviews(trailId: number){
    this.reviewService.getReviews(trailId).subscribe((data: Review[]) =>{
          this.reviews = data;
        })
  }

}
