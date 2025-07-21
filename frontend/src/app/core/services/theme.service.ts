import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('light');
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);

  public theme$ = this.themeSubject.asObservable();
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
    this.setupMediaQuery();
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.saveTheme(theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  private initializeTheme(): void {
    const savedTheme = this.getSavedTheme();
    const theme = savedTheme || 'light';
    this.setTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const body = document.body;
    const isDark = this.shouldUseDarkMode(theme);
    
    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme');
    
    // Add new theme class
    if (isDark) {
      body.classList.add('dark-theme', 'dark');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark');
    }
    
    this.isDarkModeSubject.next(isDark);
  }

  private shouldUseDarkMode(theme: Theme): boolean {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    
    // Auto mode - check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private setupMediaQuery(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', () => {
      const currentTheme = this.themeSubject.value;
      if (currentTheme === 'auto') {
        this.applyTheme('auto');
      }
    });
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(environment.storageKeys.theme, theme);
  }

  private getSavedTheme(): Theme | null {
    const saved = localStorage.getItem(environment.storageKeys.theme);
    return saved as Theme || null;
  }
}