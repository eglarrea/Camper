import { Injectable, signal } from '@angular/core';

export type Language = 'es' | 'en' | 'eu';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<Language>(
    (localStorage.getItem('lang') as Language) || 'es'
  );

  changeLanguage(lang: Language) {
    this.currentLang.set(lang);
    localStorage.setItem('lang', lang);
    console.log('Idioma cambiado a:', lang);
  }
}