import './App.css';
import * as d3 from 'd3';
import { Fragment, useEffect, useRef, createRef } from 'react';
import Lines from './pages/Lines';

function App() {

  return (
    <Fragment>
    <div className="App">
      <h1> CS 416 Data Visualization Project</h1>
      <p>Meme Stock Price and Volume</p>
    </div>
    <Lines/>
    </Fragment>
  );
}

export default App;
