import { createTheme } from '@mantine/core';

// Space-themed colors
export const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 6,
  colors: {
    blue: [
      '#E6F2FF',
      '#CCE6FF',
      '#99C9FF',
      '#66ADFF',
      '#3391FF',
      '#0066CC',
      '#0B3D91', // NASA blue
      '#082A68',
      '#06204F',
      '#041433',
    ],
    orange: [
      '#FFF3E6',
      '#FFE7CC',
      '#FFCE99',
      '#FFB466',
      '#FF9A33',
      '#FF8000',
      '#FC3D21', // NASA red
      '#D93000',
      '#B32800',
      '#8C1F00',
    ],
    gray: [
      '#F5F5F6',
      '#E9EAEB',
      '#D2D3D5',
      '#BCBEC0',
      '#A5A8AA',
      '#8F9295',
      '#747679',
      '#5A5D61',
      '#1E2022', // Dark gray for text
      '#16181A',
    ],
  },
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  radius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
});