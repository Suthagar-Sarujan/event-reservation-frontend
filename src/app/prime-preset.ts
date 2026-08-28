import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Points PrimeNG's design tokens at this app's existing CSS custom
 * properties (styles.css) instead of a static palette, so every PrimeNG
 * component automatically follows the per-user light/dark/system theme
 * that ThemeService already drives via `:root[data-theme]` - no separate
 * dark-mode wiring needed on the PrimeNG side. Light and dark color-scheme
 * blocks below intentionally hold the *same* var references for this
 * reason: the variable itself is what changes, not which block is active.
 */
const colorScheme = {
  primary: {
    color: 'var(--primary)',
    contrastColor: 'var(--text-on-primary)',
    hoverColor: 'var(--primary-hover)',
    activeColor: 'var(--primary-hover)',
  },
  highlight: {
    background: 'var(--primary-tint)',
    focusBackground: 'var(--primary-tint-strong)',
    color: 'var(--primary-text)',
    focusColor: 'var(--primary-text)',
  },
  surface: {
    0: 'var(--surface)',
    50: 'var(--surface-sunken)',
    100: 'var(--surface-hover)',
    200: 'var(--border)',
    300: 'var(--border-strong)',
    400: 'var(--border-strong)',
    500: 'var(--text-tertiary)',
    600: 'var(--text-secondary)',
    700: 'var(--text-secondary)',
    800: 'var(--text)',
    900: 'var(--text)',
    950: 'var(--text)',
  },
  text: {
    color: 'var(--text)',
    hoverColor: 'var(--text)',
    mutedColor: 'var(--text-secondary)',
    hoverMutedColor: 'var(--text)',
  },
  content: {
    background: 'var(--surface)',
    hoverBackground: 'var(--surface-hover)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
    hoverColor: 'var(--text)',
  },
  overlay: {
    select: {
      background: 'var(--surface)',
      borderColor: 'var(--border)',
      color: 'var(--text)',
    },
    popover: {
      background: 'var(--surface)',
      borderColor: 'var(--border)',
      color: 'var(--text)',
    },
    modal: {
      background: 'var(--surface)',
      borderColor: 'var(--border)',
      color: 'var(--text)',
    },
  },
  formField: {
    background: 'var(--surface)',
    disabledBackground: 'var(--surface-sunken)',
    filledBackground: 'var(--surface-sunken)',
    filledFocusBackground: 'var(--surface-sunken)',
    borderColor: 'var(--border-strong)',
    hoverBorderColor: 'var(--color-warm-400)',
    focusBorderColor: 'var(--primary-text)',
    invalidBorderColor: 'var(--danger)',
    color: 'var(--text)',
    disabledColor: 'var(--text-tertiary)',
    placeholderColor: 'var(--text-tertiary)',
    invalidPlaceholderColor: 'var(--danger)',
    iconColor: 'var(--text-tertiary)',
  },
  list: {
    option: {
      focusBackground: 'var(--surface-hover)',
      selectedBackground: 'var(--primary-tint)',
      selectedFocusBackground: 'var(--primary-tint-strong)',
      color: 'var(--text)',
      focusColor: 'var(--text)',
      selectedColor: 'var(--primary-text)',
      selectedFocusColor: 'var(--primary-text)',
    },
  },
  navigation: {
    item: {
      focusBackground: 'var(--surface-hover)',
      activeBackground: 'var(--primary-tint)',
      color: 'var(--text)',
      focusColor: 'var(--text)',
      activeColor: 'var(--primary-text)',
    },
  },
};

export const AppThemePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: 'var(--primary-tint)',
      100: 'var(--primary-tint)',
      200: 'var(--primary-tint-strong)',
      300: 'var(--primary-tint-strong)',
      400: 'var(--primary)',
      500: 'var(--primary)',
      600: 'var(--primary)',
      700: 'var(--primary-hover)',
      800: 'var(--primary-hover)',
      900: 'var(--primary-hover)',
      950: 'var(--primary-hover)',
    },
    focusRing: {
      color: 'var(--primary-text)',
      shadow: 'var(--shadow-focus)',
    },
    colorScheme: {
      light: colorScheme,
      dark: colorScheme,
    },
  },
});
