import * as d3 from 'd3';
import { useEffect, useRef, createRef, useState, Fragment } from 'react';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import { AMCClose, GMEClose, BBClose, KOSSClose, SNDLClose } from '../data/close_prices.js';
import { AMCVolume, GMEVolume, BBVolume, KOSSVolume, SNDLVolume } from '../data/volume.js';
import data from './data.csv';
import { Grid, Button } from '@material-ui/core';

const Lines = () => {
    // console.log(AMCClose)
    // console.log(AMCVolume)
    
    const d3Ref = useRef();

    const timeParser = d3.timeFormat("%B %d, %Y");

    const dateFormat  = d3.timeFormat("%d/%m/%Y");

    const monthFormat = d3.timeFormat("%m/%d/%y");

    const [ gmeButton, setGMEButton ] = useState(true);
    const [ amcButton, setAMCButton ] = useState(true);
    // console.log(gmeButton)
    // console.log(amcButton)

  useEffect(() => {

    // SVG Bounds
    const margin = {top: 100, right: 100, bottom: 200, left: 100}
    const width = window.innerWidth - margin.left * 2 - margin.right * 2
    const height = window.innerHeight - margin.bottom * 2 - margin.top * 2

    

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

    if (amcButton) {
    // Add AMC data
    svg.append('path')
       .data([AMCcombined])
       .attr("id", "AMC")
       .style('fill', 'none')
       .attr('stroke', 'steelblue')
       .attr('stroke-width', 2)
       .attr('d', line)
    } else {
      d3.selectAll("#AMC").remove()
    }

    if (gmeButton) {
    // Add GME data
      svg.append('path')
       .data([GMEcombined])
       .attr("id", "GME")
       .style('fill', 'none')
       .attr('stroke', 'green')
       .attr('stroke-width', 2)
       .attr('d', line)
    } else {
      d3.selectAll("#GME").remove()
    }

    // Add title
      svg.append('text')
       .attr('x',(width/2))
       .attr('y', (margin.top/5))
       .attr('text-anchor', 'middle')
       .attr('font-size', '16px')
       .attr('fill','steelblue')
       .text('GME and AMC Price January 3, 2021 - July 12, 2021')

    // Volume

    const GMEVolumeVals = Object.values(GMEVolume)

    const yMinVol = d3.min(GMEVolumeVals, d=> {
      return d
    })

    const yMaxVol = d3.max(GMEVolumeVals, d=> {
      return d
    })

    const yVolAxis = d3.scaleLinear()
                       .domain([yMinVol, yMaxVol])
                       .range([height, 0])

    const GMEVolumeCombined = [] 
    
    for (let i = 0; i < mappedDate.length; i++){
      GMEVolumeCombined.push(Object.assign({}, mappedDate[i], GMEVolumeVals[i]))
    }

    // svg.selectAll()
    //    .data([GMEVolumeCombined])
    //    .enter()
    //    .append('rect')
    //    .attr('x', d=> {
    //      return xAxis(d['date'])
    //    })
    //    .attr('y', d=> {
    //      return yVolAxis(d['value'])
    //    })
    //    .attr('fill', (d, i) => {
    //     if (i === 0) {
    //       return '#03a678';
    //     } else {  
    //       return GMEVolumeCombined[i - 1].value > d.value ? '#c0392b' : '#03a678'; 
    //     }
    //   })
    //   .attr('width', 100)      
    //   .attr('height', d => {
    //     return height;
    //   });

    // Mouse over
    // svg.on('mousemove', function(event) {
    //   let coords = d3.pointer(event);
    //   console.log( coords ) // log the mouse position
    // })

  }, [gmeButton, amcButton])

  return (
      <Fragment>
      <Grid 
      container
      direction="row"   
      justifyContent="center"
      alignItems="center">
      <Grid>
      <Button 
      variant="contained" 
      color="primary"
      onClick={() => setGMEButton(!gmeButton)}
      >
        GME
      </Button>
      </Grid>
      &nbsp;&nbsp;
      <Grid>
      <Button 
      variant="contained" 
      color="primary"
      onClick={() => setAMCButton(!amcButton)}
      >
        AMC
      </Button>
      </Grid>
      </Grid>
      <div id='d3div'>
      <svg ref={d3Ref}></svg>
      {/* <SimpleDateTime>{1609718400}</SimpleDateTime> */}
      </div>
      </Fragment>
  );
}

export default Lines;
