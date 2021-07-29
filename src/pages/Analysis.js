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

    const [ data, setData ] = useState([]);

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

    const xAxis = d3.scalePow()
      .domain([8000000, 11000000])
      .range([0, width])

    svg.append("g")
    .attr('id', 'xAxis')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xAxis).ticks(5))
    .style("font-size","18px")
    .style("color", "green")

    const yAxis = d3.scaleLinear()
        .domain([0, 75000])
        .range([height, 0])

    svg.append("g")
    .attr('id', 'yAxis')
    .call(d3.axisLeft(yAxis).ticks(10))
    .style("font-size","18px")
    .style("color", "green")

    d3v4.csv("https://raw.githubusercontent.com/Skyblueballykid/cs416DataVisualization/master/src/data/subreddit-data.csv", function(d) {
        // console.log("Posts Count: " + d.Posts, "User Count: " +  d.Users)

        setData(d)
        console.log(d)
    })
    
        // Add dots
    svg.selectAll()
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(data) {return xAxis(data.Users)})
        .attr("cy", function(data) {return yAxis(data.Posts)})
        .attr("r", 1) //function(d) {return d.Posts * d.Users/10000000000}
        .style("fill", "steelblue")


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