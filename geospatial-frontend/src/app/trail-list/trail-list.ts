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
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 



@Component({
  selector: 'app-trail-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataViewModule, PaginatorModule,
    ConfirmDialogModule, ButtonModule, CardModule, DividerModule, DialogModule],
  providers: [ConfirmationService],
  templateUrl: './trail-list.html',
  styleUrl: './trail-list.css',
})
export class TrailList implements OnInit{

  trails: Trail[] = [];

  // Πλήρης λίστα, χωρίς φίλτρο αναζήτησης — το search() δουλεύει πάνω σε
  // αυτήν, ποτέ πάνω στο ήδη-φιλτραρισμένο `trails`.
  allTrails: Trail[] = [];

  searchQuery: string = '';

  constructor(public userService: UserServices, private trailService: TrailService, private router: Router, private confirmationService: ConfirmationService
){}
  ngOnInit(): void {
    this.getTrails();
  }

  getTrails(){
    this.trailService.getTrails().subscribe((data: Trail[]) =>{
      this.allTrails = data;
      this.trails = data;
      this.searchQuery = '';
      this.currentPage = 0;
    })
  }

  getUserTrails(){
    this.trailService.getUserTrails().subscribe((data: Trail[]) =>{
      this.allTrails = data;
      this.trails = data;
      this.searchQuery = '';
      this.currentPage = 0;
    })
  }

  deleteTrail(id: number){
    this.trailService.deleteTrail(id).subscribe(data =>{
      this.getTrails();
    })
  }

  getTrail(id: number){
    this.router.navigate([`trail-page/${id}`])
 
  }

  createReview(id: number){
    this.router.navigate([`create-review/${id}`])
  }

  getReviews(id: number){
    this.router.navigate([`review-list/${id}`])
  }

  currentPage = 0;
rowsPerPage = 4;

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

  confirmDeleteTrail(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this trail?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteTrail(id);
      }
    });
  }

  /* =======================================================
     SEARCH
     ======================================================= */

  search(query: string): void {
    this.searchQuery = query;
    this.currentPage = 0;

    const q = query.trim().toLowerCase();

    if (!q) {
      this.trails = this.allTrails;
      return;
    }

    this.trails = this.allTrails.filter(trail =>
      trail.trailName.toLowerCase().includes(q) ||
      trail.location.toLowerCase().includes(q)
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 0;
    this.trails = this.allTrails;
  }

}