import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  console.log('Token en el interceptor:', token);

  const clonedRequest = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req.clone({ setHeaders: { Authorization: '' } }); // Agrega una cabecera vacía si no hay token

  return next(clonedRequest);
};