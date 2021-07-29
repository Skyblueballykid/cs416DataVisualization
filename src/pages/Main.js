import * as d3 from 'd3';
import { useEffect, useRef, useState, Fragment } from 'react';
import { AMCClose, GMEClose } from '../data/close_prices.js';
import { AMCVolume, GMEVolume } from '../data/volume.js';
import { Grid, Button, Card, CardContent, Typography } from '@material-ui/core';
import { AnnotationLabel, AnnotationBracket } from 'react-annotation';
import StopIcon from '@material-ui/icons/Stop';

const Main = () => {
    
    const d3Ref = useRef();

    const monthFormat = d3.timeFormat("%m/%d");

    const [ gmeButton, setGMEButton ] = useState(true);
    const [ amcButton, setAMCButton ] = useState(false);
    const [ annotation, setannotation ] = useState(0);

    //Just use this to trigger a rerender
    // const [ reset, setReset ] = useState(false);

    // // Rerender on resize
    // let [width, setWidth] = useState(window.innerWidth);
    // const getWidth = () => window.innerWidth;

    // const resizeListener = () => {
    //   setWidth(getWidth)
    //   d3.selectAll("g > *").remove()
    //   setReset(!reset);
    // };

    // // set resize listener
    // window.addEventListener('resize', resizeListener);

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
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
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
    setGMEButton(false)
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
    setAMCButton(false)
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

    svg.append('text')
       .attr("id", "annotate0")
       .attr('x',(width/2))
       .attr('y', (height + 60))
       .attr('text-anchor', 'middle')
       .attr('font-size', '24px')
       .attr('fill','black')
       .text('')
    
    svg.append('text')
       .attr("id", "annotate0")
       .attr('x',(width/2))
       .attr('y', (height + 90))
       .attr('text-anchor', 'middle')
       .attr('font-size', '24px')
       .attr('fill','black')
       .text('')
    

    if (gmeButton && annotation > 0) {

      d3.selectAll("#annotate0").remove()
    // Add GME annotations
      svg.append('text')
          .attr("id", "annotate1")
          .attr('x',(width/2))
          .attr('y', (height + 60))
          .attr('text-anchor', 'middle')
          .attr('font-size', '24px')
          .attr('fill','black')
          .text("")
      
          svg.append('text')
          .attr("id", "annotate1")
          .attr('x',(width/2))
          .attr('y', (height + 90))
          .attr('text-anchor', 'middle')
          .attr('font-size', '24px')
          .attr('fill','black')
        .text("")
          
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

      d3.selectAll("#annotate1").remove()
      svg.append('text')
          .attr("id", "annotate2")
          .attr('x',(width/2))
          .attr('y', (height + 60))
          .attr('text-anchor', 'middle')
          .attr('font-size', '24px')
          .attr('fill','black')
          .text('')
    } else {
      d3.selectAll("#annotate2").remove()
    }

    if (gmeButton && annotation > 2) {
        d3.selectAll("#annotate2").remove()

          svg.append('text')
          .attr("id", "annotate3")
          .attr('x',(width/2))
          .attr('y', (height + 90))
          .attr('text-anchor', 'middle')
          .attr('font-size', '24px')
          .attr('fill','black')
          .text('')

    } else {
      
      d3.selectAll("#annotate3").remove()
    }

    if (amcButton && annotation > 3) {
        d3.selectAll("#annotate3").remove()
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

    // const yMinVolGME = d3.min(GMEVolumeVals, d=> {
    //   return d
    // })

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

    svg.append("g")
       .selectAll()
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

    // const yMinVolAMC = d3.min(AMCVolumeVals, d=> {
    //   return d
    // })

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



  }, [gmeButton, amcButton, annotation]) //resizeListener
}

useRenderChartToCanvas();

  const handleGMEClick = () => {
    setGMEButton(!gmeButton)
    setAMCButton(false)
    d3.selectAll("#AMCVolume").remove()
  }

  const handleAMCClick = () => {
    setAMCButton(!amcButton)
    setGMEButton(false)
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

  const handleReset = () => {
    setannotation(0)
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
      <br/>
      <br/>
      <br/>
      <br/>
      <Grid 
      container
      direction="row"   
      justifyContent="center"
      alignItems="center">
      <Button variant="contained"
      onClick={handleReset}
      >
      Restart
      </Button>
      </Grid>
      <br/>
      <Grid 
      container
      direction="row"   
      justifyContent="center"
      alignItems="center">
      <p><i>Toggle the stock charts and click the red buttons to add and remove annotations.</i></p>
      </Grid>
      <br/>
      <br/>
      <br/>
      <Grid 
      container
      direction="row"   
      justifyContent="center"
      alignItems="center">
      <Card style={{backgroundColor: 'transparent'}}>
        <CardContent>
          <Typography variant="h6" component="h6">
            <b>Legend</b>
          </Typography>
          <Typography variant="body1" component="body1">
          <StopIcon fontSize="small" style={{ color: "green" }}></StopIcon> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GameStop Corporation &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Typography>
          <br/>
          <Typography variant="body1" component="body1">
          <StopIcon fontSize="small" style={{ color: "steelblue" }}></StopIcon> AMC Entertainment Holdings, Inc.
          </Typography>
        </CardContent>
      </Card>
      </Grid>
      </Grid>
      <br/>
      <br/>
      <Grid 
      container
      direction="row"   
      justifyContent="center"
      alignItems="center">
      {annotation === 0 ?
      <Typography variant="h5" component="h5" color="secondary">Our story begins when saavy retail stock traders identified stocks with heavy short interest from institutional investors on wallstreet. These stocks collectively became known as the "meme stocks".</Typography>
      : ""}
      {annotation === 1 ?
      <Typography variant="h5" component="h5" color="secondary">The most heavily shorted of these, GameStop Corporation, at one time had short interest of as much as 141% <a href="https://www.reuters.com/article/us-retail-trading-gamestop-short-idUSKBN2BG28H">(source)</a>. Retail traders, led by /u/RoaringKitty and others, banded together on the popular subreddit r/Wallstreetbets and their collective buying power drove the price to a peak of $347.51.</Typography>
      : ""}
      {annotation === 2 ?
      <Typography variant="h5" component="h5" color="secondary">After the massive price action, the stock price quickly collapsed, but then saw a subsequent recovery 1 month later.</Typography>
      : ""}
      {annotation === 3 ?
      <Typography variant="h5" component="h5" color="secondary">The stock traded with high volatility until nearly recovering losses in June.</Typography>
      : ""}
      </Grid>
      <div id='d3div'>
      <svg ref={d3Ref}>
        { annotation === 1 ?  
      <AnnotationLabel
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
      />
       : "" }
       { annotation === 2 ?
       <Fragment>
        <AnnotationLabel
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
      />
      </Fragment>
      : ""}
      { annotation === 3 ?
        <AnnotationLabel
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
      />
      : ""}
      { annotation === 4 ?
        <AnnotationLabel
        x={window.innerWidth/5.5}
        y={540}
        dy={10}
        dx={162}
        color={"red"}
        note={{"title":"AMC Near Peak",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
      />
      : ""}
      { annotation === 5 ?
        <AnnotationBracket
        x={window.innerWidth/3.5}
        y={440}
        dy={10}
        dx={162}
        color={"red"}
        note={{"title":"No subsequent AMC recovery", "padding": 0}}
        subject={{"height":70,"type":"curly"}}
      />
      : ""}
      { annotation === 6 ?
        <AnnotationLabel
        x={window.innerWidth/2}
        y={450}
        dy={80}
        dx={240}
        color={"red"}
        note={{"title":"AMC Peak",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
      />
      : ""}
      </svg>
      </div>
       </Fragment>
  );
}

export default Main;
