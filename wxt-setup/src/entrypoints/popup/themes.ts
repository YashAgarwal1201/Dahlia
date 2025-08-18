// src/themes.ts
export type ThemeId = 'md-light' | 'md-dark' | 'paper' | 'high-contrast-dark';

export const THEMES: Record<ThemeId, Record<string, string>> = {
  'md-light': {
    '--bg': '#FFFFFF',
    '--on-bg': '#1F1F1F',
    '--card': '#F8F9FA',
    '--on-card': '#1F1F1F',
    '--primary': '#6750A4',
    '--on-primary': '#FFFFFF',
    '--link': '#1A73E8',
    '--muted': '#5F6368',
  },
  'md-dark': {
    '--bg': '#121212',
    '--on-bg': '#E6E1E5',
    '--card': '#1E1E1E',
    '--on-card': '#E6E1E5',
    '--primary': '#CFBCFF',
    '--on-primary': '#371E73',
    '--link': '#8AB4F8',
    '--muted': '#A1A1AA',
  },
  'paper': {
    '--bg': '#FAF7F2',
    '--on-bg': '#28231D',
    '--card': '#FFFFFF',
    '--on-card': '#28231D',
    '--primary': '#3E5F8A',
    '--on-primary': '#FFFFFF',
    '--link': '#1259C3',
    '--muted': '#6B6B6B',
  },
  'high-contrast-dark': {
    '--bg': '#000000',
    '--on-bg': '#FFFFFF',
    '--card': '#0A0A0A',
    '--on-card': '#FFFFFF',
    '--primary': '#00FFFF',
    '--on-primary': '#000000',
    '--link': '#7FDBFF',
    '--muted': '#D0D0D0',
  },
};
