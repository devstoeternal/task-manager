import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { LoadingInterceptor } from './app/core/interceptors/loading.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      AppRoutingModule,
      MatSnackBarModule
    ),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error(err));