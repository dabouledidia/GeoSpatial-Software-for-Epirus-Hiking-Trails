import { Component, OnInit } from '@angular/core';
import { Trail } from '../models/trail.model';
import { TrailService } from '../services/trail.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserServices } from '../services/user.services';
import { DataViewModule } from 'primeng/dataview';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { CarouselModule } from 'primeng/carousel';




@Component({
  selector: 'app-explore-trails',
  imports: [CommonModule, RouterModule, DataViewModule, PaginatorModule, ButtonModule, CardModule, CarouselModule],
  templateUrl: './explore-trails.html',
  styleUrl: './explore-trails.css',
})
export class ExploreTrails implements OnInit{

  trails: Trail[] = [];

  constructor(public userService: UserServices, private trailService: TrailService, private router: Router){}
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

  currentPage = 0;
rowsPerPage = 6;

paginatedTrails() {
  const start = this.currentPage * this.rowsPerPage;
  return this.trails.slice(start, start + this.rowsPerPage);
}

onPageChange(event: any) {
  this.currentPage = event.page;
}

fullComment: string = '';
displayCommentDialog: boolean = false;

showFullComment(text: string) {
  this.fullComment = text;
  this.displayCommentDialog = true;
}

  carouselImages = [
  'assets/images/mainpage1.jpg',
  'assets/images/mainpage2.jpeg',
  'assets/images/mainpage3.jpg'
];

}
