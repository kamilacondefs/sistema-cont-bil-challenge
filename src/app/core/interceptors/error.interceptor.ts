import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.status === 401) {
        // Handle 401 Unauthorized
        errorMessage = 'Sessão expirada ou credenciais inválidas. Por favor, faça login novamente.';
        toastService.error(errorMessage);
        // Optional: Redirect to login or logout
      } else if (error.status === 400) {
        // Handle 400 Bad Request
        errorMessage = error.error?.message || 'Requisição inválida.';
        toastService.error(errorMessage);
      } else if (error.status === 500) {
        // Handle 500 Internal Server Error
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        toastService.error(errorMessage);
      } else {
         errorMessage = error.message || errorMessage;
         // Only show toast for other errors if needed, or rely on component handling
         // For now, let's show it to be safe
         toastService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
