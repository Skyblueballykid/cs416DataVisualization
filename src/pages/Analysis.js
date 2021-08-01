import * as d3 from 'd3';
import { transition } from 'd3-transition';
import { useRef, useEffect, Fragment } from 'react';
import { AMCClose } from '../data/close_prices.js';
import { Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { AnnotationLabel } from 'react-annotation';

const redditData = require('./subreddit.json')

const Analysis = () => {

    const ScatterPlotRef = useRef();

    const monthFormat = d3.timeFormat("%m/%d/%Y");

    useEffect(() => {

    // Dates range, just pull it from AMC dataset
    const unixDates = Object.keys(AMCClose)
    // const first = unixDates[0]


    // Define ranges
    const xMinDate = d3.min(unixDates, d => {
        return d
    })

    const xMaxDate = d3.max(unixDates, d => {
        return d
    })

    // SVG Bounds
    const margin = {top: 150, right: 150, bottom: 150, left: 150}
    const width = window.innerWidth/1.7
    const height = window.innerHeight/1.7

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

    svg.append('text')
       .attr("id", "annotate0")
       .attr('x',(width/2))
       .attr('y', (height + 50))
       .attr('text-anchor', 'middle')
       .attr('font-size', '24px')
       .attr('fill','black')
       .text('Users')

    // svg.append('text')
    //    .attr("id", "annotate0")
    //    .attr('x',(width/2))
    //    .attr('y', (height + 140))
    //    .attr('text-anchor', 'middle')
    //    .attr('font-size', '24px')
    //    .attr('fill','black')
    //    .text('Date')

    // svg.append("g")
    //     .attr('id', 'xAxisDate')
    //     .attr("transform", "translate(0," + (height + 90)+ ")")
    //     .call(d3.axisBottom(xAxisDate).ticks(10).tickFormat(monthFormat))
    //     .style("font-size","18px")
    //     .style("color", "black")

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
   

    d3.transition()
      .selectAll("circle")
      .filter(function(d) {
        //   console.log(d)
          return (d.Posts/d.Users)*10000 > 5
      })
      .style("fill", "black")
      .duration(4000)

}, [])

    return(
    <Fragment>
        <Link to="/smallcaps">
      <Button variant="contained">
        Previous Page
        </Button>
        </Link>
        &nbsp;&nbsp;&nbsp;
      <Link to="/about">
      <Button variant="contained"
      >
        Next Page
        </Button>
      </Link>
        <h1>Subreddit User Analysis</h1>
        <Typography variant="h5" component="h5" color="secondary">This visualization illustrates the ratio of r/Wallstreetbets users to the number of daily posts by those users over the 6-month period from January 3, 2021 to July 12, 2021. A color transition occurs when this ratio surpasses the arbitrary cutoff of 5, which coincides well with the trading volume and price appreciation seen in the stocks highlighted. </Typography>
        <div id='d3div'>
        <svg ref={ScatterPlotRef}>
        <AnnotationLabel
        x={700}
        y={250}
        dy={80}
        dx={240}
        color={"#000fff"}
        note={{"title":"Peak activity",
          "label":"68,250 posts by 4,949,083 users on January 27, 2021",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
      />
        </svg>
        </div>

        </Fragment>
    )
}

export default Analysis;