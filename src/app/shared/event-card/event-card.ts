import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventSummary } from '../../core/models/models';
import { Icon } from '../icon/icon';
import { fallbackEventImage } from '../event-image';

const TYPE_ICON: Record<string, string> = {
  mlb: 'ticket',
  nba: 'ticket',
  nfl: 'ticket',
  nhl: 'ticket',
};

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard {
  @Input({ required: true }) event!: EventSummary;
  @Input() reason: string | null = null;

  categoryIcon(): string {
    return TYPE_ICON[this.event.type ?? ''] ?? 'party-popper';
  }

  backgroundImageUrl(): string {
    return this.event.imageUrl ?? fallbackEventImage(this.event.type, this.event.eventId);
  }
}
