import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

    const decoded = jwtDecode<JwtPayload>(token);

    if (decoded.exp > Date.now() / 1000) {
      return true;
    }

  localStorage.removeItem('token');
  router.navigate(['/login']);
  return false;
};
