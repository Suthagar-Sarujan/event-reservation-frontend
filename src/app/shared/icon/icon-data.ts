// Hand-authored, stroke-based icon set (24x24 viewBox, Feather-style) so the
// app has no external icon-font/CDN dependency. Rendered via <app-icon name="...">.
export const ICONS: Record<string, string> = {
  ticket:
    '<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z"/><path d="M13 5v2M13 11v2M13 17v2"/>',
  calendar:
    '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M16 2.5v4M8 2.5v4M3 9.5h18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  'map-pin':
    '<path d="M20 10.5c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10.5" r="2.5"/>',
  'dollar-sign':
    '<path d="M12 2.5v19M17 6.8c0-1.8-2-3.3-5-3.3s-5 1.3-5 3.4c0 4.2 10 2 10 6.2 0 2.1-2 3.4-5 3.4s-5-1.5-5-3.3"/>',
  users:
    '<circle cx="9" cy="8" r="3.3"/><path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/><path d="M16.5 4.3a3.3 3.3 0 0 1 0 6.4M21.5 20c0-3-2.1-5.5-5-6.3"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5"/>',
  'bar-chart':
    '<path d="M4 20V10M12 20V4M20 20v-7"/><path d="M2.5 20h19" stroke-linecap="round"/>',
  'layout-dashboard':
    '<rect x="3" y="3" width="8" height="9" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/>',
  briefcase:
    '<rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7M2.5 12.5h19"/>',
  shield:
    '<path d="M12 2.5 4 5.5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10v-6Z"/>',
  home: '<path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9v10.5a1 1 0 0 0 1 1H9V15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5.5h2.5a1 1 0 0 0 1-1V9"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.5-4.5"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8Z"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  edit: '<path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="m14.5 6.5 3 3"/>',
  trash: '<path d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7M18.5 7l-.8 12.1a2 2 0 0 1-2 1.9H8.3a2 2 0 0 1-2-1.9L5.5 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  'log-out': '<path d="M9 20H5.5a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 5.5 4H9"/><path d="M16 16.5 21 12l-5-4.5M21 12H9"/>',
  menu: '<path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17"/>',
  bell: '<path d="M18 15.5V11a6 6 0 1 0-12 0v4.5L4 18.5h16Z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  star: '<path d="m12 3 2.7 5.9 6.3.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.1 1.4-6.3-4.8-4.3 6.3-.6Z"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3.5 6.5 8.5 7 8.5-7"/>',
  'trending-up': '<path d="M4 16.5 10 10l4 4 6.5-7.5"/><path d="M15 6.5h5.5V12"/>',
  'party-popper':
    '<path d="M4 21 13.5 4l6.5 6.5L3 20Z"/><path d="M14 3l1.5 1.5M18 6l1.5 1.5M11 7l1 1M16 12l1 1"/>',
  building:
    '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 8v.01"/>',
  'alert-triangle':
    '<path d="M10.3 4.5 2.9 18a1.5 1.5 0 0 0 1.3 2.2h15.6a1.5 1.5 0 0 0 1.3-2.2L13.7 4.5a1.6 1.6 0 0 0-2.8 0Z"/><path d="M12 10v4M12 17.5v.01"/>',
  wallet:
    '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5V8H5.5A2.5 2.5 0 0 1 3 5.5"/><rect x="3" y="8" width="18" height="12" rx="2"/><circle cx="16" cy="14" r="1.3"/>',
};
