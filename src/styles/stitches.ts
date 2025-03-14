// styles/stitches.js
import { createStitches } from '@stitches/react';

export const { styled, css } = createStitches({
  theme: {
    colors: {
      hiContrast: 'hsl(206,10%,5%)',
      loContrast: 'white',
      // Define other colors as needed
    },
  },
  // Define other theme properties as needed
});

export const darkTheme = css({
  // Define dark theme styles
  backgroundColor: 'hsl(206,10%,5%)',
  color: 'white',
});

export const lightTheme = css({
  // Define light theme styles
  backgroundColor: 'white',
  color: 'hsl(206,10%,5%)',
});
