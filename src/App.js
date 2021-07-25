import './App.css';
import * as d3 from 'd3';
import { Fragment, useEffect, useRef, createRef } from 'react';
import Lines from './pages/Lines';
import { Typography } from '@material-ui/core';
import '@fontsource/roboto';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import WSB from './assets/images/wsb.jpeg';

const theme = createTheme({
  props: {
    MuiTypography: {
      variantMapping: {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        subtitle1: 'h4',
        subtitle2: 'h5',
        body1: 'span',
        body2: 'span',
      },
    },
  },
});

function App() {

  return (
    <div class="wrap">
    <img
    class="bg"
    src={WSB}
    alt="WSB"/>
    <div class="content">
    <ThemeProvider theme={theme}>
    <div className="App">
      <Typography variant='h4'>
      <h1> CS 416 Data Visualization Project</h1>
      </Typography>
      <Typography variant='h5'>
      <h4>An Analysis of Meme Stock Price and Volume during the meme stock craze</h4>
      </Typography>
    </div>
    <Lines/>
    </ThemeProvider>
    </div>
    </div>
  );
}

export default App;
