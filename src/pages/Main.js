import * as d3 from 'd3';
import { useEffect, useRef, useState, Fragment } from 'react';
import { AMCClose, GMEClose } from '../data/close_prices.js';
import { AMCVolume, GMEVolume } from '../data/volume.js';
import { Grid, Button } from '@material-ui/core';
import { AnnotationLabel, AnnotationCalloutCircle, AnnotationBracket, SubjectCircle, ConnectorElbow, ConnectorEndDot, Note } from 'react-annotation';


const Main = () => {
    
    const d3Ref = useRef();

    const monthFormat = d3.timeFormat("%m/%d");

    const [ gmeButton, setGMEButton ] = useState(true);
    const [ amcButton, setAMCButton ] = useState(true);
    const [ annotation, setannotation ] = useState(0);
    const [ hover, setHover ] = useState(false);

    const useRenderChartToCanvas = () => {
    useEffect(() => {

    // SVG Bounds
    const margin = {top: 50, right: 150, bottom: 200, left: 150}
    const width = window.innerWidth - margin.left * 2 - margin.right * 2
    const height = window.innerHeight - margin.bottom * 2 - margin.top * 2

    
    // Dates range
    const unixDates = Object.keys(AMCClose)
    // const first = unixDates[0]

    // Raw data arrays
    // const cleanDates = unixDates.map(dateFormat)
    const AMCAdjClose = Object.values(AMCClose)
    const GMEAdjClose = Object.values(GMEClose)

    // Define ranges
    const xMinDate = d3.min(unixDates, d => {
        return d
    })

    const xMaxDate = d3.max(unixDates, d => {
        return d
    })

    // const yMinAdjClose = d3.min(Object.values(GMEClose), d => {
    //   return d
    // })

    const yMaxAdjClose = d3.max(Object.values(GMEClose), d => {
      return d
    })


    const amcyMaxAdjClose = d3.max(Object.values(AMCClose), d => {
      return d
    })


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
       .call(d3.axisBottom(xAxis).ticks(20).tickFormat(monthFormat))
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

    if (gmeButton && annotation > 0) {
    // Add GME annotations
      // svg.append('text')
      //     .attr("id", "annotate1")
      //     .attr('x',(width/5.3))
      //     .attr('y', (margin.top/4.8))
      //     .attr('text-anchor', 'middle')
      //     .attr('font-size', '20px')
      //     .attr('fill','blue')
      //     .text('<--- Peak tendies 🍗🐔🍗')

        svg.append('text')
          .attr("id", "annotate1")
          .attr('x',(width/5))
          .attr('y', (margin.top + 50))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','blue')
          .text(d3.format("($.2f") (yMaxAdjClose))

    } else {
      d3.selectAll("#annotate1").remove()
    }

    if (gmeButton && annotation > 1) {
    
      svg.append('text')
          .attr("id", "annotate2")
          .attr('x',(width/3.5))
          .attr('y', (margin.top * 1.5))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','blue')
          .text('')
    } else {
      d3.selectAll("#annotate2").remove()
    }

    if (gmeButton && annotation > 2) {

          svg.append('text')
          .attr("id", "annotate3")
          .attr('x',(width/1.3))
          .attr('y', (margin.top))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','blue')
          .text('')

    } else {
      
      d3.selectAll("#annotate3").remove()
    }

    if (amcButton && annotation > 3) {
          // Add AMC annotations
        svg.append('text')
          .attr("id", "annotate4")
          .attr('x',(width/6))
          .attr('y', (height - 40))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','blue')
          .text('') 
    } else {
      d3.selectAll("#annotate4").remove()

    }

    if (amcButton && annotation > 4) {
      svg.append('text')
          .attr("id", "annotate5")
          .attr('x',(width/3.5))
          .attr('y', (height - 40))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','blue')
          .text('')
    } else {

      d3.selectAll("#annotate5").remove()
    }

    if (amcButton && annotation > 5) {
          // svg.append('text')
          // .attr("id", "annotate6")
          // .attr('x',(width/1.4))
          // .attr('y', (height - 80))
          // .attr('text-anchor', 'middle')
          // .attr('font-size', '20px')
          // .attr('fill','blue')
          // .text('Peak tendies 🍗🐔🍗 --->')

          svg.append('text')
          .attr("id", "annotate6")
          .attr('x',(width/1.1))
          .attr('y', (height/1.1))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','red')
          .text(d3.format("($.2f") (amcyMaxAdjClose))

    } else {
      d3.selectAll("#annotate6").remove()
    }

    // GME Volume
    const GMEVolumeVals = Object.values(GMEVolume);
    const GMEVolumeValMap = GMEVolumeVals.map(valMap);

    const yMinVolGME = d3.min(GMEVolumeVals, d=> {
      return d
    })

    const yMaxVolGME = d3.max(GMEVolumeVals, d=> {
      return d
    })

    const GMEVolumeCombined = [] 
    
    for (let i = 0; i < mappedDate.length; i++){
      GMEVolumeCombined.push(Object.assign({}, mappedDate[i], GMEVolumeValMap[i]))
    }

    if (gmeButton) {

      const yVolAxisGME = d3.scaleLinear()
      .domain([0, yMaxVolGME])
      .range([height, 400])

    svg.selectAll()
       .data(GMEVolumeCombined)
       .enter()
       .append('rect')
       .attr('id', 'GMEVolume')
       .attr('x', d => {
         return xAxis(d['date'])
       })
       .attr('y', d => {
         return yVolAxisGME(d['value'])
       })
      .attr('fill', 'black')
      .attr('width', 3)      
      .attr('height', d => {
        return window.innerHeight - margin.bottom * 2.5 - yVolAxisGME(d['value']);
      });
    } else {
      d3.selectAll("#GMEVolume").remove()
    }

    // AMC Volume
    const AMCVolumeVals = Object.values(AMCVolume);
    const AMCVolumeValMap = AMCVolumeVals.map(valMap);

    const yMinVolAMC = d3.min(AMCVolumeVals, d=> {
      return d
    })

    const yMaxVolAMC = d3.max(AMCVolumeVals, d=> {
      return d
    })

    const AMCVolumeCombined = [] 
    
    for (let i = 0; i < mappedDate.length; i++){
      AMCVolumeCombined.push(Object.assign({}, mappedDate[i], AMCVolumeValMap[i]))
    }


    if (amcButton && !gmeButton) {
      const yVolAxisAMC = d3.scaleLinear()
        .domain([0, yMaxVolAMC])
        .range([height, 400])

      svg.selectAll()
         .data(AMCVolumeCombined)
         .enter()
         .append('rect')
         .attr('id', 'AMCVolume')
         .attr('x', d => {
           return xAxis(d['date'])
         })
         .attr('y', d => {
           return yVolAxisAMC(d['value'])
         })
        .attr('fill', 'grey')
        .attr('width', 3)      
        .attr('height', d => {
          return window.innerHeight - margin.bottom * 2.5 - yVolAxisAMC(d['value']);
        });
      } else {
        d3.selectAll("#AMCVolume").remove()
      }

      

  }, [gmeButton, amcButton, annotation])
}

useRenderChartToCanvas()

  const handleGMEClick = () => {
    setGMEButton(!gmeButton)
    d3.selectAll("#AMCVolume").remove()
  }

  const handleAMCClick = () => {
    setAMCButton(!amcButton)
  }

  const handlePlay = () => {
    setannotation(annotation + 1)
  }

  const handleReverse = () => {
    if (annotation > 0) {
    setannotation(annotation - 1)
    } else {
      return
    }
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
      onClick={handleReverse}
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
      onClick={handlePlay}
      >&gt;&gt;</Button>
      &nbsp;&nbsp;
      </Grid>
      </Grid>
      <div id='d3div'>
      <svg ref={d3Ref}>
        { annotation > 0 ?  
      <AnnotationCalloutCircle
        x={window.innerWidth/5.5}
        y={50}
        dy={60}
        dx={162}
        color={"#000fff"}
        note={{"title":"GME Peak",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
        subject={{"radius":60,"radiusPadding":5}}
      />
       : "" }
       { annotation > 1 ?
        <AnnotationCalloutCircle
        x={window.innerWidth/3.5}
        y={175}
        dy={80}
        dx={240}
        color={"#000fff"}
        note={{"title":"GME Recovery",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
        subject={{"radius":60,"radiusPadding":5}}
      />
      : ""}
      { annotation > 2 ?
        <AnnotationCalloutCircle
        x={window.innerWidth/1.7}
        y={140}
        dy={80}
        dx={240}
        color={"#000fff"}
        note={{"title":"GME Near Peak",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
        subject={{"radius":60,"radiusPadding":5}}
      />
      : ""}
      { annotation > 3 ?
        <AnnotationCalloutCircle
        x={window.innerWidth/5.5}
        y={780}
        dy={10}
        dx={162}
        color={"red"}
        note={{"title":"AMC Near Peak",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
        subject={{"radius":60,"radiusPadding":5}}
      />
      : ""}
      { annotation > 4 ?
        <AnnotationBracket
        x={window.innerWidth/3.5}
        y={680}
        dy={10}
        dx={162}
        color={"red"}
        note={{"title":"No subsequent AMC recovery", "padding": 2}}
        subject={{"height":70,"type":"curly"}}
      />
      : ""}
      { annotation > 5 ?
        <AnnotationCalloutCircle
        x={window.innerWidth/1.7}
        y={700}
        dy={80}
        dx={240}
        color={"red"}
        note={{"title":"AMC Peak",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
        subject={{"radius":60,"radiusPadding":5}}
      />
      : ""}
      </svg>
      </div>
      </Fragment>
  );
}

export default Main;
