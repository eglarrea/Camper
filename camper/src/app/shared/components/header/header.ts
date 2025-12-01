import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { LanguageService, Language } from '../../../core/services/language';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(Auth);
  languageService = inject(LanguageService);
  
  get userName(): string {
    const user = this.authService.getUser();
    return user ? user.nombrePersona : 'Usuario';
  }

  logout() {
    this.authService.logout();
  }

  onLangChange(lang: Language) {
    this.languageService.changeLanguage(lang);
  }
}