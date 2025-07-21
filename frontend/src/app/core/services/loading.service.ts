import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingMap = new Map<string, boolean>();

  public loading$ = this.loadingSubject.asObservable();

  setLoading(loading: boolean, url?: string): void {
    if (!url) {
      this.loadingSubject.next(loading);
      return;
    }

    if (loading) {
      this.loadingMap.set(url, loading);
      this.loadingSubject.next(true);
    } else {
      this.loadingMap.delete(url);
    }

    if (this.loadingMap.size === 0) {
      this.loadingSubject.next(false);
    }
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}