import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from './icon-data';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `<svg
    class="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    [innerHTML]="markup"
  ></svg>`,
})
export class Icon {
  private _name = '';
  markup: SafeHtml = '';

  @Input({ required: true })
  set name(value: string) {
    this._name = value;
    this.markup = this.sanitizer.bypassSecurityTrustHtml(ICONS[value] ?? '');
  }
  get name(): string {
    return this._name;
  }

  constructor(private sanitizer: DomSanitizer) {}
}
