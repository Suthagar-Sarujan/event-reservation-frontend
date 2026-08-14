export interface EventSummary {
  eventId: number;
  name: string;
  type: string | null;
  taxonomyName: string | null;
  taxonomySubName: string | null;
  datetimeUtc: string;
  venueName: string;
  venueCity: string | null;
  venueState: string | null;
  minPrice: number | null;
  ticketsRemaining: number;
  performers: string[];
  imageUrl: string | null;
}

export interface Listing {
  listingId: string;
  section: string | null;
  sectionFull: string | null;
  rowLabel: string | null;
  quantityRemaining: number;
  deliveryType: string | null;
  unitPrice: number;
}

export interface EventDetail {
  eventId: number;
  name: string;
  type: string | null;
  taxonomyName: string | null;
  taxonomySubName: string | null;
  datetimeUtc: string;
  venueName: string;
  venueAddress: string | null;
  venueCity: string | null;
  venueState: string | null;
  venueCountry: string | null;
  venueCapacity: number | null;
  performers: string[];
  listings: Listing[];
  imageUrl: string | null;
}

export interface RecommendedEvent {
  event: EventSummary;
  score: number;
  reason: string;
}

export interface EventListResponse {
  total: number;
  page: number;
  pageSize: number;
  items: EventSummary[];
}

export interface EventFilters {
  types: string[];
  subCategories: string[];
}

export interface BookingItem {
  listingId: string;
  section: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Booking {
  bookingId: number;
  bookingReference: string;
  eventId: number;
  eventName: string;
  eventDatetimeUtc: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: BookingItem[];
}

export interface AuthResponse {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

// ---------------------------------------------------------------------------
// Organizer
// ---------------------------------------------------------------------------

export interface VenueOption {
  venueId: number;
  name: string;
  addressCity: string | null;
  addressState: string | null;
}

export interface NewVenueRequest {
  name: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressCountry?: string;
  capacity?: number;
}

export interface CreateListingRequest {
  section?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateEventRequest {
  name: string;
  taxonomyName: string;
  taxonomySubName: string;
  performerName?: string;
  venueId?: number;
  newVenue?: NewVenueRequest;
  datetimeUtc: string;
  listings: CreateListingRequest[];
  imageUrl?: string;
}

export interface OrganizerEventSummary {
  eventId: number;
  name: string;
  datetimeUtc: string;
  venueName: string;
  status: string;
  listingCount: number;
  ticketsSold: number;
  ticketsRemaining: number;
  revenue: number;
  imageUrl: string | null;
}

export interface OrganizerListing {
  listingId: string;
  section: string | null;
  quantity: number;
  quantityRemaining: number;
  unitPrice: number;
  listingStatus: string;
}

export interface OrganizerEventDetail {
  eventId: number;
  name: string;
  taxonomyName: string;
  taxonomySubName: string;
  datetimeUtc: string;
  status: string;
  venueName: string;
  performers: string[];
  listings: OrganizerListing[];
  ticketsSold: number;
  revenue: number;
  imageUrl: string | null;
}

export interface OrganizerBooking {
  bookingId: number;
  bookingReference: string;
  buyerName: string;
  buyerEmail: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalOrganizers: number;
  totalAdmins: number;
  totalEvents: number;
  totalImportedEvents: number;
  totalOrganizerEvents: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface AdminUser {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AdminEvent {
  eventId: number;
  name: string;
  datetimeUtc: string;
  venueName: string;
  status: string;
  source: string;
  creatorEmail: string | null;
  ticketsSold: number;
  revenue: number;
  imageUrl: string | null;
}

export interface AdminBooking {
  bookingId: number;
  bookingReference: string;
  buyerName: string;
  buyerEmail: string;
  eventId: number;
  eventName: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface PagedResult<T> {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
}
