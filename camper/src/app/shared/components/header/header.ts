import { Component, HostListener, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { LanguageService, Language } from '../../../core/services/language';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, NgIf, RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authService = inject(Auth);
  languageService = inject(LanguageService);
  menuOpen = false;

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

  get isLogged(): boolean {
    return !!this.authService.getUser();
  }

  toggleMenu(event: Event) {
    event.stopPropagation();  // evita que el click se propague al documento
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.menuOpen) return;

    const target = event.target as HTMLElement;

    const insideMenu =
      target.closest('.user-menu') ||
      target.closest('.user-icon-wrapper');

    if (!insideMenu) {
      this.menuOpen = false;
    }
  }
}
