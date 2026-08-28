import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrganizerService } from '../../../services/organizer.service';
import { CreateListingRequest, VenueOption } from '../../../models/models';

interface ListingRow {
  section: string;
  quantity: number;
  unitPrice: number;
}

@Component({
  selector: 'app-organizer-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './organizer-event-form.html',
  styleUrl: './organizer-event-form.scss',
})
export class OrganizerEventForm implements OnInit {
  venues = signal<VenueOption[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  name = '';
  taxonomyName = 'concerts';
  taxonomySubName = '';
  performerName = '';
  datetimeLocal = '';
  imageUrl = '';

  venueMode: 'existing' | 'new' = 'existing';
  selectedVenueId: number | null = null;
  newVenue = { name: '', addressStreet: '', addressCity: '', addressState: '', addressCountry: '', capacity: null as number | null };

  listings: ListingRow[] = [{ section: 'General Admission', quantity: 50, unitPrice: 25 }];

  constructor(
    private organizerService: OrganizerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.organizerService.venues().subscribe((venues) => {
      this.venues.set(venues);
      if (venues.length) this.selectedVenueId = venues[0].venueId;
    });
  }

  addListingRow(): void {
    this.listings.push({ section: '', quantity: 10, unitPrice: 20 });
  }

  removeListingRow(index: number): void {
    this.listings.splice(index, 1);
  }

  submit(): void {
    this.error.set(null);

    if (!this.name.trim() || !this.taxonomySubName.trim() || !this.datetimeLocal) {
      this.error.set('Please fill in the event name, category and date.');
      return;
    }
    if (this.venueMode === 'existing' && !this.selectedVenueId) {
      this.error.set('Select a venue, or switch to "New venue".');
      return;
    }
    if (this.venueMode === 'new' && !this.newVenue.name.trim()) {
      this.error.set('Enter a name for the new venue.');
      return;
    }
    if (this.listings.some((l) => !l.quantity || l.quantity < 1 || l.unitPrice < 0)) {
      this.error.set('Each listing needs a quantity of at least 1 and a non-negative price.');
      return;
    }

    this.loading.set(true);
    const listingRequests: CreateListingRequest[] = this.listings.map((l) => ({
      section: l.section || undefined,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
    }));

    this.organizerService
      .createEvent({
        name: this.name.trim(),
        taxonomyName: this.taxonomyName,
        taxonomySubName: this.taxonomySubName.trim(),
        performerName: this.performerName.trim() || undefined,
        venueId: this.venueMode === 'existing' ? this.selectedVenueId! : undefined,
        newVenue:
          this.venueMode === 'new'
            ? {
                name: this.newVenue.name.trim(),
                addressStreet: this.newVenue.addressStreet || undefined,
                addressCity: this.newVenue.addressCity || undefined,
                addressState: this.newVenue.addressState || undefined,
                addressCountry: this.newVenue.addressCountry || undefined,
                capacity: this.newVenue.capacity ?? undefined,
              }
            : undefined,
        datetimeUtc: new Date(this.datetimeLocal).toISOString(),
        listings: listingRequests,
        imageUrl: this.imageUrl.trim() || undefined,
      })
      .subscribe({
        next: (created) => {
          this.loading.set(false);
          this.router.navigate(['/organizer/events', created.eventId]);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message ?? 'Could not create the event. Please try again.');
        },
      });
  }
}
