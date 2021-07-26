import * as d3 from 'd3';
// import * as d3v4 from 'd3';
import { useEffect, useRef, createRef, useState, Fragment } from 'react';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import { AMCClose, GMEClose } from '../data/close_prices.js';
import { AMCVolume, GMEVolume } from '../data/volume.js';
import { Grid, Button } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const Main = () => {
    
    const d3Ref = useRef();

    const timeParser = d3.timeFormat("%B %d, %Y");

    const dateFormat  = d3.timeFormat("%d/%m/%Y");

    const monthFormat = d3.timeFormat("%m/%d/%y");

    const [ gmeButton, setGMEButton ] = useState(true);
    const [ amcButton, setAMCButton ] = useState(true);
    const [ annotation1, setAnnotation1 ] = useState(false);
    const [ annotation2, setAnnotation2 ] = useState(false);

    const useRenderChartToCanvas = () => {
    useEffect(() => {

    // SVG Bounds
    const margin = {top: 50, right: 150, bottom: 200, left: 150}
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


    const amcyMaxAdjClose = d3.max(Object.values(AMCClose), d => {
      return d
    })

    // console.log(dateFormat(xMinDate))
    // console.log(dateFormat(xMaxDate))
    // console.log(yMinAdjClose)
    // console.log(yMaxAdjClose)

    // Create SVG 
    const svg = d3.select(d3Ref.current)
    // .attr('class', 'svg-container')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 600 1000")
    // .classed("svg-content", true)
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
       .style("font-size","12px");
       
    svg.append('g')
       .attr('id', 'yAxis')
       .call(d3.axisLeft(yAxis).tickFormat(d3.format("$,.0f")))
       .style("font-size","12px");

    // Map the data arrays to the appropriate series format
    const dateMap = d => ({'date': d})
    const valMap = v => ({'value': v})

    //Date doesn't change so only need to do this once
    const mappedDate = unixDates.map(dateMap);

    const AMCmappedVals = AMCAdjClose.map(valMap);
    const GMEmappedVals = GMEAdjClose.map(valMap);

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
      d3.selectAll("#annotate1").remove()
      d3.selectAll("#annotate2").remove()
      d3.selectAll("#annotate3").remove()
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
      d3.selectAll("#annotate4").remove()
      d3.selectAll("#annotate5").remove()
      d3.selectAll("#annotate6").remove()
    }

    // Add title
      svg.append('text')
       .attr('x',(width/1.9))
       .attr('y', (margin.top/4.8))
       .attr('text-anchor', 'middle')
       .attr('font-size', '22px')
       .attr('fill','steelblue')
       .text('GME and AMC Price January 3, 2021 - July 12, 2021')

    if (gmeButton && annotation1) {
    // Add GME annotations
      svg.append('text')
          .attr("id", "annotate1")
          .attr('x',(width/5.3))
          .attr('y', (margin.top/4.8))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','red')
          .text('<--- Peak tendies 🍗🐔🍗')
      
        svg.append('text')
        .attr("id", "annotate1")
        .attr('x',(width/5.7))
        .attr('y', (margin.top/2))
        .attr('text-anchor', 'middle')
        .attr('font-size', '20px')
        .attr('fill','black')
        .text(d3.format("($.2f") (yMaxAdjClose))

      svg.append('text')
          .attr("id", "annotate2")
          .attr('x',(width/3.5))
          .attr('y', (margin.top * 1.5))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','red')
          .text('Recovery --->')

          svg.append('text')
          .attr("id", "annotate3")
          .attr('x',(width/1.3))
          .attr('y', (margin.top))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','red')
          .text('Near peak --->')

    } else {
      d3.selectAll("#annotate1").remove()
      d3.selectAll("#annotate2").remove()
      d3.selectAll("#annotate3").remove()
    }

    if (amcButton && annotation2) {
          // Add AMC annotations
        svg.append('text')
          .attr("id", "annotate4")
          .attr('x',(width/6))
          .attr('y', (margin.top * 6.5))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','red')
          .text('<--- Near peak')

      svg.append('text')
          .attr("id", "annotate5")
          .attr('x',(width/3.5))
          .attr('y', (margin.top * 6.5))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','red')
          .text('No subsequent recovery')

          svg.append('text')
          .attr("id", "annotate6")
          .attr('x',(width/1.4))
          .attr('y', (margin.top * 6))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','red')
          .text('Peak tendies 🍗🐔🍗 --->')

          svg.append('text')
          .attr("id", "annotate6")
          .attr('x',(width/1.4))
          .attr('y', (margin.top * 6.3))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','black')
          .text(d3.format("($.2f") (amcyMaxAdjClose))

    } else {
      d3.selectAll("#annotate4").remove()
      d3.selectAll("#annotate5").remove()
      d3.selectAll("#annotate6").remove()
    }

    // GME Volume
    // console.log("GMEVolume", GMEVolume)
    const GMEVolumeVals = Object.values(GMEVolume);
    const GMEVolumeValMap = GMEVolumeVals.map(valMap);

    const yMinVol = d3.min(GMEVolumeVals, d=> {
      return d
    })

    const yMaxVol = d3.max(GMEVolumeVals, d=> {
      return d
    })

    const yVolAxis = d3.scaleLinear()
                       .domain([0, yMaxVol])
                       .range([height, 600])

    const GMEVolumeCombined = [] 
    
    for (let i = 0; i < mappedDate.length; i++){
      GMEVolumeCombined.push(Object.assign({}, mappedDate[i], GMEVolumeValMap[i]))
    }

    // console.log(GMEVolumeCombined)

    if (gmeButton) {
    svg.selectAll()
       .data(GMEVolumeCombined)
       .enter()
       .append('rect')
       .attr('id', 'GMEVolume')
       .attr('x', d => {
         return xAxis(d['date'])
       })
       .attr('y', d => {
         return yVolAxis(d['value'])
       })
      .attr('fill', 'black')
      .attr('width', 3)      
      .attr('height', d => {
        return height - yVolAxis(d['value']);
      });
    } else {
      d3.selectAll("#GMEVolume").remove()
    }

      

  }, [gmeButton, amcButton, annotation1, annotation2])
}

useRenderChartToCanvas()

  const handleGMEClick = () => {
    setGMEButton(!gmeButton)
    setAnnotation1(false)
    // d3.select('#d3div').selectAll("svg").remove()
  }

  const handleAMCClick = () => {
    setAMCButton(!amcButton)
    setAnnotation2(false)
    // d3.select('#d3div').selectAll("svg").remove()
  }

  return (
      <Fragment>
      <Grid 
      container
      direction="row"   
      justifyContent="center"
      alignItems="center">
      <Grid>
      <Button variant="contained"
      color="secondary"
      >&lt;&lt;</Button>
      &nbsp;&nbsp;
      <Button 
      variant="contained" 
      color="primary"
      onClick={handleGMEClick}
      >
        GME
      </Button>
      </Grid>
      &nbsp;&nbsp;
      <Grid>
        
      <Button 
      variant="contained" 
      color="primary"
      onClick={handleAMCClick}
      >
        AMC
      </Button>
      &nbsp;&nbsp;
      <Button variant="contained"
      color="secondary"
      >&gt;&gt;</Button>
      &nbsp;&nbsp;
      </Grid>
      </Grid>
      <br/>
      <br/>
      <Grid 
      container
      direction="row"   
      justifyContent="center"
      alignItems="center">
      <Grid>
      <Button variant="contained"
      onClick={() => setAnnotation1(!annotation1)}
      >GME Play ▶️</Button>
      </Grid>
      </Grid>
      <br/>
      <Grid 
      container
      direction="row"   
      justifyContent="center"
      alignItems="center">
      <Grid>
      <Button variant="contained"
      onClick={() => setAnnotation2(!annotation2)}
      >AMC Play ▶️</Button>
      </Grid>
      </Grid>
      <div id='d3div'>
      <svg ref={d3Ref}></svg>
      </div>
      </Fragment>
  );
}

export default Main;
