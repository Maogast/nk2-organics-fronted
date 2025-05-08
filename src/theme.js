// src/theme.js
import { createTheme } from '@mui/material/styles';

// You can adjust these hex values based on your logo's exact shade.
// Here, we're using a deep green for primary and a warm complementary hue for secondary.
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',  // A deep, natural green
    },
    secondary: {
      main: '#FFB74D',  // A warm, earthy tone to complement the green
    },
    background: {
      default: '#f9f9f9',  // A light, neutral background to allow your products and branding to shine
    },
  },
  typography: {
    // Consider using a font that complements the natural elegance of your brand.
    // You might experiment with fonts like "Roboto" or even organic typefaces available from Google Fonts.
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;