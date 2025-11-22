import { Component, OnInit } from '@angular/core';
import { Trail } from '../models/trail.model';
import { TrailService } from '../services/trail.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trail-list',
  imports: [CommonModule, RouterModule],
  providers: [TrailService],
  templateUrl: './trail-list.html',
  styleUrl: './trail-list.css',
})
export class TrailList implements OnInit{

  trails: Trail[] = [];

  constructor(private trailService: TrailService, private router: Router){}
  ngOnInit(): void {
    this.getTrails();
  }

  getTrails(){
    this.trailService.getTrails().subscribe((data: Trail[]) =>{
      this.trails = data;
    })
  }

  getUserTrails(){
    this.trailService.getUserTrails().subscribe((data: Trail[]) =>{
      this.trails = data;
    })
  }

  deleteTrail(id: number){
    this.trailService.deleteTrail(id).subscribe(data =>{
      this.getTrails();
    })
  }

  createReview(id: number){
    this.router.navigate([`create-review/${id}`])
  }

  getReviews(id: number){
    this.router.navigate([`review-list/${id}`])
  }

}