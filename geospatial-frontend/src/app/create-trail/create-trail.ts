import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TrailService } from '../services/trail.service';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';




@Component({
  selector: 'app-create-trail',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule, FileUploadModule, ButtonModule, ToastModule],
  providers: [],
  templateUrl: './create-trail.html',
  styleUrl: './create-trail.css',
})



export class CreateTrail {
  
  selectedFile: File | null = null;

  
  onFileSelect(event: any) {
  const file = event.files[0];

  if (file) {
    this.selectedFile = file;
    this.trailForm.patchValue({
      image: file
    });
  }
}

    trailForm!: FormGroup;
  
constructor(
  private fb: FormBuilder,
  private trailService: TrailService,
  private router: Router
){
  this.trailForm = this.fb.group({
    name: ['', Validators.required],
    location: ['', Validators.required],
    lengthKm: [
    null,
    [
      Validators.required,
      Validators.pattern(/^\d+(\.\d+)?$/)
    ]
  ],
  duration: [
    null,
    [
      Validators.required,
      Validators.pattern(/^\d+(\.\d+)?$/)
    ]
  ],
    difficulty: ['', Validators.required],
    description: ['', Validators.required],
    image: [null, Validators.required]

  })
}

createTrail(): void {
  if (this.trailForm.invalid) return;

  const formValue = this.trailForm.value;

  const formData = new FormData(); 

  formData.append('name', formValue.name);
  formData.append('location', formValue.location);
  formData.append('lengthKm', formValue.lengthKm);
  formData.append('duration', formValue.duration);
  formData.append('difficulty', formValue.difficulty);
  formData.append('description', formValue.description);
  formData.append('image', formValue.image); 

  this.trailService.createTrail(formData).subscribe({
    next: (res) => {
      console.log("Trail created:", res);
      this.router.navigate(['']); 
    },
    error: (err) => console.error("Error:", err)
  });
}
}



