import * as d3 from 'd3';
import * as d3v4 from 'd3';
import { useEffect, useRef, createRef, useState, Fragment } from 'react';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import { BBClose, KOSSClose, SNDLClose } from '../data/close_prices.js';
import { BBVolume, KOSSVolume, SNDLVolume } from '../data/volume.js';
import { Grid, Button } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const Analysis = () => {

    const ScatterPlotRef = useRef();

    useEffect(() => {

    // SVG Bounds
    const margin = {top: 50, right: 50, bottom: 50, left: 50}
    const width = window.innerWidth
    const height = window.innerHeight

    const svg = d3.select(ScatterPlotRef.current)
    .attr('width', width)
    .attr('height', height)
    .attr("viewBox", "0 0" + width + " " + height)
    // .classed("svg-content", true)
    .append('g')
      .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')');

    d3.csv("./subreddit-data.csv", function(d) {
        console.log(d)
    }) 

    }, [])

    return(
        <Fragment>
        <h1>Subreddit User Analysis</h1>
        <div id='d3div'>
        <svg ref={ScatterPlotRef}>
        </svg>
        </div>
        </Fragment>
    )
}

export default Analysis;