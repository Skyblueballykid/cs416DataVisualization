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
    const margin = {top: 150, right: 150, bottom: 150, left: 150}
    const width = window.innerWidth - 500
    const height = window.innerHeight - 500

    const svg = d3.select(ScatterPlotRef.current)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.bottom + margin.top)
    .attr("viewBox", "0 0" + (width + margin.left + margin.right) + " " + (height + margin.bottom + margin.top))
    // .classed("svg-content", true)
    .append('g')
      .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')');

    d3.csv("https://raw.githubusercontent.com/Skyblueballykid/cs416DataVisualization/master/src/data/subbreddit-data.csv", function(d) {
        // console.log("Posts Count: " + d['Posts count'], "User Count: " +  d['User Count'])
        
        // const maxPosts = d3.max(d['Posts count'], d => {
        //     return d
        // })

        // console.log("Max Posts: ", maxPosts)

        const xAxis = d3.scalePow()
                        .domain([0, 11000000])
                        .range([0, width])
        
        svg.append("g")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(xAxis).ticks(5))
           .style("font-size","16px");

        const yAxis = d3.scaleLinear()
                        .domain([30000, 75000])
                        .range([height, 0])

        svg.append("g")
           .call(d3.axisLeft(yAxis).ticks(5))
           .style("font-size","16px");

        // Add dots
        svg.append('g')
           .selectAll("dot")
           .data(d)
           .enter()
           .append("circle")
           .attr("cx", function(d) {return xAxis(d[0])})
           .attr("cy", function(d) {return yAxis(d[1])})
           .attr("r", 1)
           .style("fill", "steelblue")

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