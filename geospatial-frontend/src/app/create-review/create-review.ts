import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../services/review.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingModule, ButtonModule],
  templateUrl: './create-review.html',
  styleUrl: './create-review.css',
})
export class CreateReview implements OnInit{
  trailId!: number;
  rating: number = 0;
  comment: string = '';

  constructor(private route: ActivatedRoute, private reviewService: ReviewService, private router: Router) {}

  ngOnInit() {
    this.trailId = Number(this.route.snapshot.paramMap.get('id'));
  }

  submitReview() {
    const reviewData = {
      rating: this.rating,
      comment: this.comment
    };

    this.reviewService.addReview(this.trailId, reviewData).subscribe({
    next: (res) => alert("Created!!"),
    error: (err) => alert("You have to login to create a review")
  });
    this.router.navigate(["trail-list"]);
  }
}
