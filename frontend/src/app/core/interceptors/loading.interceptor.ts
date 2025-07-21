import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent,
  HttpResponse 
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Start loading
    this.loadingService.setLoading(true, req.url);

    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // Stop loading on success
            this.loadingService.setLoading(false, req.url);
          }
        },
        (error: any) => {
          // Stop loading on error
          this.loadingService.setLoading(false, req.url);
        }
      )
    );
  }
}