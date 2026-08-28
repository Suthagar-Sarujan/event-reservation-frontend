import { Component, Input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventSummary } from '../../../core/models/models';
import { preloadEventPhoto } from '../event-image';

const TYPE_ICON: Record<string, string> = {
  mlb: 'pi-ticket',
  nba: 'pi-ticket',
  nfl: 'pi-ticket',
  nhl: 'pi-ticket',
};

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
})
export class EventCard implements OnChanges {
  @Input({ required: true }) event!: EventSummary;
  @Input() reason: string | null = null;

  // Stays null until the real photo loads, at which point the template
  // cross-fades it in over the card's plain background color.
  photoImageUrl = signal<string | null>(null);

  ngOnChanges(): void {
    if (this.event.imageUrl) {
      this.photoImageUrl.set(this.event.imageUrl);
      return;
    }
    this.photoImageUrl.set(null);
    preloadEventPhoto(this.event.type, this.event.eventId, (url) => this.photoImageUrl.set(url));
  }

  categoryIcon(): string {
    return TYPE_ICON[this.event.type ?? ''] ?? 'pi-sparkles';
  }
}
