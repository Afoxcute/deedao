import { createTheme, Theme } from '@mui/material';

declare module '@mui/material/styles/createPalette' {
  interface SimplePaletteColorOptions {
    opaque?: string;
  }

  interface PaletteColor {
    opaque: string;
  }

  interface PaletteOptions {
    lend?: PaletteColorOptions;
    borrow?: PaletteColorOptions;
    backstop?: PaletteColorOptions;
    menu?: PaletteColorOptions;
    positive?: PaletteColorOptions;
    accent?: PaletteColorOptions;
  }

  interface Palette {
    lend: PaletteColor;
    borrow: PaletteColor;
    backstop: PaletteColor;
    menu: PaletteColor;
    positive: PaletteColor;
    accent: PaletteColor;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    lend: true;
    borrow: true;
    backstop: true;
    positive: true;
    accent: true;
    menu: false;
  }
}

const FONT: string = '"DM Sans", Roboto';

const pxToRem = (px: number) => {
  const remVal = px / 16;
  return `${remVal.toFixed(3)}rem`;
};

const theme: Theme = createTheme({
  palette: {
    mode: 'dark',
    tonalOffset: 0,
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    primary: {
      main: '#4CAF50',
      opaque: '#4CAF5026',
      contrastText: 'white',
    },
    secondary: {
      main: '#66BB6A',
      opaque: '#66BB6A26',
    },
    lend: {
      main: '#81C784',
      opaque: '#81C78426',
    },
    borrow: {
      main: '#66BB6A',
      opaque: '#66BB6A26',
    },
    backstop: {
      main: '#388E3C',
      opaque: '#388E3C26',
    },
    positive: {
      main: '#A5D6A7',
      opaque: '#A5D6A726',
    },
    accent: {
      main: '#424242',
      opaque: '#424242',
    },
    menu: {
      main: '#212121',
      light: '#21212193',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#BDBDBD',
    },
    warning: {
      main: '#FFD700',
      opaque: '#FFD70026',
    },
    error: {
      main: '#FF4500',
      opaque: '#FF450026',
    },
  },
  typography: {
    fontFamily: FONT,
    h1: {
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: pxToRem(20),
      lineHeight: 1.6,
    },
    h2: {
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: pxToRem(18),
      lineHeight: 1.473,
    },
    h3: {
      fontFamily: FONT,
      fontWeight: 500,
      fontSize: pxToRem(18),
      lineHeight: 1.473,
    },
    h4: {
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: pxToRem(16),
      lineHeight: 1.3125,
    },
    h5: {
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: pxToRem(16),
      lineHeight: 1.3125,
    },
    h6: undefined,
    subtitle1: undefined,
    subtitle2: undefined,
    body1: {
      fontFamily: FONT,
      fontWeight: 500,
      fontSize: pxToRem(16),
      lineHeight: 1.3125,
    },
    body2: {
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: pxToRem(14),
      lineHeight: 1.125,
    },
    button: {
      textTransform: 'none',
      fontFamily: FONT,
      fontWeight: 500,
      fontSize: pxToRem(16),
      lineHeight: 1.3125,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 420, // marker for the mobile layout requirement
      md: 640,
      lg: 850, // marker for compact layout requirements
      xl: 1024,
    },
  },
});

export default theme;
