import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UserServices } from '../services/user.services';
import { TrailService } from '../services/trail.service';
import { Trail } from '../models/trail.model';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MapViewComponent } from '../map-view/map-view.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-trail',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, RouterModule, CommonModule, RouterModule, DataViewModule, ButtonModule, CardModule, MapViewComponent],
  templateUrl: './trail.html',
  styleUrl: './trail.css',
})
export class TrailPage implements OnInit {

  trailId!: number;
  trail!: Trail;

  constructor(
    public userService: UserServices,
    private trailService: TrailService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.trailId = Number(id);  
    this.getTrail(this.trailId);
  }
}

getTrail(id: number) {
  this.trailService.getTrail(id).subscribe({
    next: (data) => {
      this.trail = data;
    },
    error: (err) => {
      console.error('Failed to load trail', err);
    }
  });
}

  deleteTrail(id: number){
    this.trailService.deleteTrail(id)
    this.router.navigate([`trail-list/${id}`])
  }

  getReviews(id: number){
    this.router.navigate([`review-list/${id}`])
  }

  createReview(id: number){
    this.router.navigate([`create-review/${id}`])
  }
}