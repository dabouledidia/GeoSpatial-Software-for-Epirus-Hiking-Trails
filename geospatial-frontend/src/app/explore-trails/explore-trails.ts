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
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-explore-trails',
  standalone: true,
  imports: [CommonModule, DialogModule, RouterModule, DataViewModule, PaginatorModule, ButtonModule, CardModule, CarouselModule],
  templateUrl: './explore-trails.html',
  styleUrl: './explore-trails.css',
})
export class ExploreTrails implements OnInit{
  trail!: Trail;
  trails: Trail[] = [];


  allTrails: Trail[] = [];

  activeFilter: string = 'all';

  private readonly difficultyOrder: Record<string, number> = {
    'Easy': 1,
    'Mid': 2,
    'Hard': 3
  };

  constructor(public userService: UserServices, private trailService: TrailService, private router: Router){}
  ngOnInit(): void {
    this.getTrails();
  }

  getTrails(){
    this.trailService.getTrails().subscribe((data: Trail[]) =>{
      this.allTrails = data;
      this.trails = data;
      this.activeFilter = 'all';
      this.currentPage = 0;
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

  getTrail(id: number){
    this.router.navigate([`trail-page/${id}`])
  }

  /* =======================================================
     FILTERS
     ======================================================= */

  applyFilter(filter: string): void {
    this.activeFilter = filter;
    this.currentPage = 0;

    switch (filter) {
      case 'all':
        this.trails = this.allTrails;
        break;

      case 'shortest':
        this.trails = [...this.allTrails]
          .sort((a, b) => parseFloat(a.lengthKm) - parseFloat(b.lengthKm))
          .slice(0, 5);
        break;

      case 'longest':
        this.trails = [...this.allTrails]
          .sort((a, b) => parseFloat(b.lengthKm) - parseFloat(a.lengthKm))
          .slice(0, 5);
        break;

      case 'hardest':
        this.trails = [...this.allTrails]
          .sort((a, b) => this.difficultyOrder[b.difficulty] - this.difficultyOrder[a.difficulty])
          .slice(0, 5);
        break;

      case 'easiest':
        this.trails = [...this.allTrails]
          .sort((a, b) => this.difficultyOrder[a.difficulty] - this.difficultyOrder[b.difficulty])
          .slice(0, 5);
        break;

      case 'quickest':
        this.trails = [...this.allTrails]
          .sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration))
          .slice(0, 5);
        break;
    }
  }

}