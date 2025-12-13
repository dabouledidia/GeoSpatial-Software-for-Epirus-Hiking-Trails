import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  
  // Check if the JWT token exists in local storage
  // (Ensure this matches the key you use in your Login component)
  const token = localStorage.getItem('jwt'); 

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};