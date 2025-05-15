// src/theme.js
import { createTheme } from '@mui/material/styles';

// Create your theme with palette, typography, and component overrides.
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
    // Using a font that complements the natural elegance of your brand.
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    // Override MuiButton styles for print media to ensure exact color adjustments.
    MuiButton: {
      styleOverrides: {
        root: {
          '@media print': {
            WebkitPrintColorAdjust: 'exact', // Vendor-prefixed property for Safari and older browsers
            printColorAdjust: 'exact',       // Standard property for browsers that support it
          },
        },
      },
    },
    // Override MuiBox styles to enforce proper vendor prefix ordering for non-selectable text.
    MuiBox: {
      styleOverrides: {
        root: {
          WebkitUserSelect: 'none',  // Vendor-prefixed properties first
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',        // Standard property listed last
        },
      },
    },
    // If you have animations that need to hide/show elements, consider using
    // opacity or transform properties (which do not trigger reflows) rather than display.
    // The following is an example override for Collapse transitions.
    MuiCollapse: {
      defaultProps: {
        timeout: 500, // Adjust timeout if needed; this uses opacity-based transitions
      },
    },
    // Additional overrides can be added here as required for your project.
  },
});

export default theme;