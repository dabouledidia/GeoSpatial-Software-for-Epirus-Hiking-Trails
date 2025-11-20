import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TrailService } from '../services/trail.service';

@Component({
  selector: 'app-create-trail',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  providers: [TrailService],
  templateUrl: './create-trail.html',
  styleUrl: './create-trail.css',
})
export class CreateTrail {

    trailForm!: FormGroup;
  
constructor(
  private fb: FormBuilder,
  private trailService: TrailService,
  private router: Router
){
  this.trailForm = this.fb.group({
    name: ['', Validators.required],
    location: ['', Validators.required],
    lengthKm: ['', [Validators.required]],
    duration: ['', Validators.required],
    difficulty: ['', Validators.required],
    description: ['', Validators.required],
  })
}

createTrail(): void {
  if (this.trailForm.invalid) return

  this.trailService.createTrail(this.trailForm.value).subscribe({
    next: (res) => console.log("Trail created:", res),
    error: (err) => console.error("Error:", err)
  });
    this.router.navigate(['']);
  
}
}


