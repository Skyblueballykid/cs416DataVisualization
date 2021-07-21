import * as d3 from 'd3';
import { useEffect, useRef, createRef } from 'react';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import { AMCClose, GMEClose, BBClose, KOSSClose, SNDLClose } from '../data/close_prices.js';
import { AMCVolume, GMEVolume, BBVolume, KOSSVolume, SNDLVolume } from '../data/volume.js';
import data from './data.csv';

const Lines = () => {
    // console.log(AMCClose)
    // console.log(AMCVolume)
    
    const d3Ref = useRef();

    const timeParser = d3.timeFormat("%B %d, %Y");

    const dateFormat  = d3.timeFormat("%d/%m/%Y");

    const monthFormat = d3.timeFormat("%m/%d/%y");


  useEffect(() => {

    // SVG Bounds
    const margin = {top: 100, right: 200, bottom: 200, left: 100}
    const width = window.innerWidth - margin.left - margin.right
    const height = window.innerHeight - margin.bottom - margin.top

    // Dates range
    const unixDates = Object.keys(AMCClose)
    const first = unixDates[0]
    // console.log('first', first)
    var start = new Date((first/1))
    // console.log('date', timeParser(start))

    // Raw data arrays
    const cleanDates = unixDates.map(dateFormat)
    const AMCAdjClose = Object.values(AMCClose)
    const GMEAdjClose = Object.values(GMEClose)

    // Define ranges
    const xMinDate = d3.min(unixDates, d => {
        return d
    })

    const xMaxDate = d3.max(unixDates, d => {
        return d
    })

    const yMinAdjClose = d3.min(Object.values(GMEClose), d => {
      return d
    })

    const yMaxAdjClose = d3.max(Object.values(GMEClose), d => {
      return d
    })

    // console.log(dateFormat(xMinDate))
    // console.log(dateFormat(xMaxDate))
    // console.log(yMinAdjClose)
    // console.log(yMaxAdjClose)

    // Create SVG 
    const svg = d3.select(d3Ref.current)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')');

    // Scales
    const xAxis = d3.scaleTime()
                    .domain([xMinDate, xMaxDate])
                    .range([0, width])

    // y axis 
    const yAxis = d3.scaleLinear()
                    .domain([0, yMaxAdjClose])
                    .range([height, 0])
    
    // Draw axes
    svg.append('g')
       .attr('id', 'xAxis')
       .attr('transform', 'translate(0,' + height + ')')
       .call(d3.axisBottom(xAxis).ticks(25).tickFormat(monthFormat))
       
    svg.append('g')
       .attr('id', 'yAxis')
       .call(d3.axisLeft(yAxis).tickFormat(d3.format("$,.0f")))

    // Map the data arrays to the appropriate series format
    const dateMap = d => ({'date': d})
    const valMap = v => ({'value': v})

    //Date doesn't change so only need to do this once
    const mappedDate = unixDates.map(dateMap);

    const AMCmappedVals = AMCAdjClose.map(valMap);
    const GMEmappedVals = GMEAdjClose.map(valMap)

    const AMCcombined = []
    const GMEcombined = []

    for (let i = 0; i < mappedDate.length; i++){
      AMCcombined.push(Object.assign({}, mappedDate[i], AMCmappedVals[i]))
    }
    for (let i = 0; i < mappedDate.length; i++){
      GMEcombined.push(Object.assign({}, mappedDate[i], GMEmappedVals[i]))
    }

    const line = d3.line()
                   .x(d => xAxis(d.date))
                   .y(d => yAxis(d.value));

    // Add data
    svg.append('path')
       .data([AMCcombined])
       .style('fill', 'none')
       .attr('stroke', 'steelblue')
       .attr('stroke-width', 2)
       .attr('d', line)

      svg.append('path')
       .data([GMEcombined])
       .style('fill', 'none')
       .attr('stroke', 'green')
       .attr('stroke-width', 2)
       .attr('d', line)

      svg.append('text')
       .attr('x',(width/2))
       .attr('y', (margin.top/5))
       .attr('text-anchor', 'middle')
       .attr('font-size', '16px')
       .attr('fill','steelblue')
       .text('GME and AMC Price January 3, 2021 - July 12, 2021')

    

  }, [])

  return (

      <div id='d3div'>
      <svg ref={d3Ref}></svg>
      {/* <SimpleDateTime>{1609718400}</SimpleDateTime> */}
      </div>

  );
}

export default Lines;
