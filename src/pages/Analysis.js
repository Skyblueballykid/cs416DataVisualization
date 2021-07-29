import * as d3 from 'd3';
import * as d3v4 from 'd3';
import { useRef, Fragment } from 'react';
import { AMCClose } from '../data/close_prices.js';
import { Typography } from '@material-ui/core';

const redditData = require('./subreddit.json')

console.log(redditData)

const Analysis = () => {

    const ScatterPlotRef = useRef();

    const monthFormat = d3.timeFormat("%m/%d");

    // Dates range
    const unixDates = Object.keys(AMCClose)
    // const first = unixDates[0]

    // Raw data arrays
    // const cleanDates = unixDates.map(dateFormat)
    const AMCAdjClose = Object.values(AMCClose)

    // Define ranges
    const xMinDate = d3.min(unixDates, d => {
        return d
    })

    const xMaxDate = d3.max(unixDates, d => {
        return d
    })

    // SVG Bounds
    const margin = {top: 150, right: 150, bottom: 150, left: 150}
    const width = window.innerWidth - 500
    const height = window.innerHeight - 200

    const svg = d3.select(ScatterPlotRef.current)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.bottom + margin.top)
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.bottom + margin.top))
    // .classed("svg-content", true)
    .append('g')
      .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')');

    const xAxis = d3.scalePow()
      .domain([0, 11000000])
      .range([0, width])

        // Scales
    const xAxisDate = d3.scaleTime()
        .domain([xMinDate, xMaxDate])
        .range([0, width])

    svg.append("g")
        .attr('id', 'xAxis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis).ticks(5))
        .style("font-size","18px")
        .style("color", "black")

    svg.append('text')
        .attr("id", "yLabel")
        .attr('x',(-height/2.5))
        .attr('y', (-100))
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .attr('font-size', '28px')
        .attr('fill','black')
        .text('Posts')

    svg.append("g")
        .attr('id', 'xAxisDate')
        .attr("transform", "translate(0," + (height + 70)+ ")")
        .call(d3.axisBottom(xAxisDate).ticks(20).tickFormat(monthFormat))
        .style("font-size","18px")
        .style("color", "black")

    const yAxis = d3.scaleLinear()
        .domain([0, 75000])
        .range([height, 0])

    svg.append("g")
    .attr('id', 'yAxis')
    .call(d3.axisLeft(yAxis).ticks(10))
    .style("font-size","18px")
    .style("color", "black")

        // Add dots
    svg.append("g")
       .attr("id", "dot")
       .selectAll("dot")
        .data(redditData)
        .enter()
        .append("circle")
        .attr("cx", function(redditData) {return xAxis(redditData.Users)})
        .attr("cy", function(redditData) {return yAxis(redditData.Posts)})
        .attr("r", function(d) {return (d.Posts/d.Users)*10000})
        .style("fill", "#69b3a2")
        .style("opacity", 0.8)


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