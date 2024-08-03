// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // black color
    },
    secondary: {
      main: '#ff3366', // red color
    },
    text: {
      primary: '#ffffff', // white text
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
  },
});

export default theme;
