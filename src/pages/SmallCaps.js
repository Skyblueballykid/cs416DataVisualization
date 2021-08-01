import * as d3 from 'd3';
import { useEffect, useRef, useState, Fragment } from 'react';
import { KOSSClose, SNDLClose } from '../data/close_prices.js';
import { KOSSVolume, SNDLVolume } from '../data/volume.js';
import { Grid, Button, Card, CardContent, Typography } from '@material-ui/core';
import { AnnotationLabel, AnnotationBracket } from 'react-annotation';
import StopIcon from '@material-ui/icons/Stop';
import { Link } from 'react-router-dom';

const SmallCaps = () => {
    
    const d3Ref = useRef();

    const monthFormat = d3.timeFormat("%m/%d");

    const [ kossButton, setkossButton ] = useState(true);
    const [ sndlButton, setsndlButton ] = useState(false);
    const [ annotation, setannotation ] = useState(0);

    // SVG Bounds
    const margin = {top: 50, right: 150, bottom: 200, left: 150}
    const width = window.innerWidth/1.5
    const height = window.innerHeight/1.5

    useEffect(() => {

    // Dates range
    const unixDates = Object.keys(SNDLClose)
    // const first = unixDates[0]

    // Raw data arrays
    // const cleanDates = unixDates.map(dateFormat)
    const sndlAdjClose = Object.values(SNDLClose)
    const kossAdjClose = Object.values(KOSSClose)

    // Define ranges
    const xMinDate = d3.min(unixDates, d => {
        return d
    })

    const xMaxDate = d3.max(unixDates, d => {
        return d
    })

    // const yMinAdjClose = d3.min(Object.values(KOSSClose), d => {
    //   return d
    // })

    const yMaxAdjClose = d3.max(Object.values(KOSSClose), d => {
      return d
    })


    const sndlyMaxAdjClose = d3.max(Object.values(SNDLClose), d => {
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

    const SNDLmappedVals = sndlAdjClose.map(valMap);
    const KOSSmappedVals = kossAdjClose.map(valMap);

    const SNDLcombined = []
    const KOSScombined = []

    for (let i = 0; i < mappedDate.length; i++){
      SNDLcombined.push(Object.assign({}, mappedDate[i], SNDLmappedVals[i]))
    }

    for (let i = 0; i < mappedDate.length; i++){
      KOSScombined.push(Object.assign({}, mappedDate[i], KOSSmappedVals[i]))
    }

    const line = d3.line()
                   .x(d => xAxis(d.date))
                   .y(d => yAxis(d.value));

    // Add title
    svg.append('text')
        .attr('x',(width/1.9))
        .attr('y', (margin.top/4.8))
        .attr('text-anchor', 'middle')
        .attr('font-size', '22px')
        .attr('fill','steelblue')
        .text('KOSS and SNDL Price January 3, 2021 - July 12, 2021')


    if (sndlButton) {
    setkossButton(false)
    // Add SNDL data
    svg.append('path')
       .data([SNDLcombined])
       .attr("id", "SNDL")
       .style('fill', 'none')
       .attr('stroke', 'steelblue')
       .attr('stroke-width', 2)
       .attr('d', line)

    } else { 
      d3.selectAll("#SNDL").remove()
      d3.selectAll("#annotate1").remove()
    }

    if (kossButton) {
    setsndlButton(false)
    // Add KOSS data
      svg.append('path')
       .data([KOSScombined])
       .attr("id", "KOSS")
       .style('fill', 'none')
       .attr('stroke', 'green')
       .attr('stroke-width', 2)
       .attr('d', line)
    } else {
      d3.selectAll("#KOSS").remove()
      d3.selectAll("#annotate2").remove()
    }

    if (kossButton && annotation > 0) {
    // Add KOSS annotations

        svg.append('text')
          .attr("id", "annotate1")
          .attr('x',(width/5))
          .attr('y', (margin.top + 100))
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','blue')
          .text(d3.format("($.2f") (yMaxAdjClose))

    } else {
      d3.selectAll("#annotate1").remove()
    }

    if (kossButton && annotation > 1) {
      d3.selectAll("#annotate1").remove()
    }

    if (annotation < 4) {
      d3.selectAll("#SNDL").remove()
      setsndlButton(false);
      setkossButton(true);
    }

    if (annotation > 3) {
        setkossButton(false);
        setsndlButton(true);
    } 

    if ( annotation > 6 ) {
      setannotation(0)
      d3.selectAll("#AMC").remove()
      setsndlButton(false);
      setkossButton(true);
    }

    if (sndlButton && annotation === 4) {

          svg.append('text')
          .attr("id", "annotate2")
          .attr('x',(width/4.5))
          .attr('y', height/1.2)
          .attr('text-anchor', 'middle')
          .attr('font-size', '20px')
          .attr('fill','red')
          .text(d3.format("($.2f") (sndlyMaxAdjClose))

    } else {
      d3.selectAll("#annotate2").remove()
    }

    if (sndlButton && annotation > 6) {
      d3.selectAll("#annotate2").remove()
    }


    // KOSS Volume
    const KOSSVolumeVals = Object.values(KOSSVolume);
    const KOSSVolumeValMap = KOSSVolumeVals.map(valMap);

    const yMinVolKOSS = d3.min(KOSSVolumeVals, d=> {
      return d
    })

    const yMaxVolKOSS = d3.max(KOSSVolumeVals, d=> {
      return d
    })

    const KOSSVolumeCombined = [] 
    
    for (let i = 0; i < mappedDate.length; i++){
      KOSSVolumeCombined.push(Object.assign({}, mappedDate[i], KOSSVolumeValMap[i]))
    }

    if (kossButton) {

      const yVolAxisKOSS = d3.scaleLinear()
      .domain([yMinVolKOSS, yMaxVolKOSS])
      .range([height, 600])

    svg.append("g")
       .selectAll()
       .data(KOSSVolumeCombined)
       .enter()
       .append('rect')
       .attr('id', 'KOSSVolume')
       .attr('x', d => {
         return xAxis(d['date'])
       })
       .attr('y', d => {
         return yVolAxisKOSS(d['value'])
       })
      .attr('fill', 'black')
      .attr('width', 3)      
      .attr('height', d => {
        return height - yVolAxisKOSS(d['value']);
      });
    } else {
      d3.selectAll("#KOSSVolume").remove()
    }

    // SNDL Volume
    const SNDLVolumeVals = Object.values(SNDLVolume);
    const SNDLVolumeValMap = SNDLVolumeVals.map(valMap);

    const yMinVolSNDL = d3.min(SNDLVolumeVals, d=> {
      return d
    })

    const yMaxVolSNDL = d3.max(SNDLVolumeVals, d=> {
      return d
    })

    const SNDLVolumeCombined = [] 
    
    for (let i = 0; i < mappedDate.length; i++){
      SNDLVolumeCombined.push(Object.assign({}, mappedDate[i], SNDLVolumeValMap[i]))
    }


    if (sndlButton && !kossButton) {
      const yVolAxisSNDL = d3.scaleLinear()
        .domain([yMinVolSNDL, yMaxVolSNDL])
        .range([height, 600])

      svg.selectAll()
         .data(SNDLVolumeCombined)
         .enter()
         .append('rect')
         .attr('id', 'SNDLVolume')
         .attr('x', d => {
           return xAxis(d['date'])
         })
         .attr('y', d => {
           return yVolAxisSNDL(d['value'])
         })
        .attr('fill', 'grey')
        .attr('width', 3)      
        .attr('height', d => {
          return height - yVolAxisSNDL(d['value']);
        });
      } else {
        d3.selectAll("#SNDLVolume").remove()
      }



  }, [kossButton, sndlButton, annotation, width, height])


  const handleKOSSClick = () => {
    setkossButton(!kossButton)
    setsndlButton(false)
    setannotation(0)
  }

  const handleSNDLClick = () => {
    setsndlButton(!sndlButton)
    setkossButton(false)
    setannotation(4)
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
    setsndlButton(false)
    setkossButton(true)
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
      onClick={handleKOSSClick}
      >
        KOSS
      </Button>
      </Grid>
      &nbsp;&nbsp;
      <Grid>
      <Button 
      variant="contained" 
      color="primary"
      onClick={handleSNDLClick}
      >
        SNDL
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
        <Link to="/main">
      <Button variant="contained">
            Previous Page
        </Button>
        </Link>
        &nbsp;&nbsp;&nbsp;
      <Button variant="contained"
      onClick={handleReset}
      >
      Restart
      </Button>
      &nbsp;&nbsp;&nbsp;
      <Link to="/analysis">
      <Button variant="contained"
      >
        Next Page
        </Button>
      </Link>
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
          <StopIcon fontSize="small" style={{ color: "green" }}></StopIcon> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KOSS  Corporation &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Typography>
          <br/>
          <Typography variant="body1" component="body1">
          <StopIcon fontSize="small" style={{ color: "steelblue" }}></StopIcon> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Sundial Growers Inc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
      <Typography variant="h5" component="h5" color="secondary">Koss Corporation, a headphone manufacturer, and Sundial Growers, Inc., a Canadian cannabis producer, experienced similar price action as GME and AMC, but arguably with no appreciable catalysts to drive price appreciation. While GME had notable short interest of over 100%, KOSS and SNDL experienced price appreciation largely due to hype. <a href="https://www.nasdaq.com/articles/the-meme-stock-update-for-the-ever-growing-reddit-buzz-2021-06-04">(source)</a></Typography>
      : ""}
      {annotation === 1 ?
      <Typography variant="h5" component="h5" color="secondary">Despite a largely hype driven narrative, the price for Koss Corporation largely followed that of GME with a peak in January, followed by a subsequent massive decline.</Typography>
      : ""}
      {annotation === 2 ?
      <Typography variant="h5" component="h5" color="secondary">Koss experienced a price recovery after the significant loss that occured in January and February.</Typography>
      : ""}
      {annotation === 3 ?
      <Typography variant="h5" component="h5" color="secondary">Similar to GME, the stock experienced a near peak price again in June.</Typography>
      : ""}
      {annotation === 4 ?
      <Typography variant="h5" component="h5" color="secondary">The chart of Sundial growers is distinctly different from Koss Corporation and GameStop and illustrates the effect of a completely hype driven stock narrative. SNDL price peaked in January, similar to KOSS and GME.</Typography>
      : ""}
      {annotation === 5 ?
      <Typography variant="h5" component="h5" color="secondary">Sundial experienced no subsequent price recovery after the initial peak, as was seen in GameStop and Koss Corporation.</Typography>
      : ""}
      {annotation === 6 ?
      <Typography variant="h5" component="h5" color="secondary">Despite a slight price recovery and higher trading volume in June, the long term fundamental outlook for Sundial appears bleak. The company took advantage of the January price appreciation to issue more stock and dilute the value of shares held by existing investors. <a href="https://www.fool.com/investing/2021/02/02/5-ultra-popular-stocks-avoid-like-plague-february/">(Source)</a></Typography>
      : ""}
      </Grid>
      <div id='d3div'>
      <svg ref={d3Ref}>
        { annotation === 1 ?  
      <AnnotationLabel
        x={width/4.5}
        y={70}
        dy={60}
        dx={162}
        color={"#000fff"}
        note={{"title":"KOSS Peak",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
      />
       : "" }
       { annotation === 2 ?
       <Fragment>
        <AnnotationLabel
        x={width/2}
        y={175}
        dy={80}
        dx={240}
        color={"#000fff"}
        note={{"title":"KOSS Recovery",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
      />
      </Fragment>
      : ""}
      { annotation === 3 ?
        <AnnotationLabel
        x={width/1.2}
        y={140}
        dy={80}
        dx={240}
        color={"#000fff"}
        note={{"title":"KOSS Near Peak",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
      />
      : ""}
      { annotation === 4 ?
        <AnnotationLabel
        x={width/4.5}
        y={height/1.1}
        dy={10}
        dx={162}
        color={"red"}
        note={{"title":"SNDL Peak",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
      />
      : ""}
      { annotation === 5 ?
        <AnnotationBracket
        x={width/2}
        y={height/1.1}
        dy={10}
        dx={162}
        color={"red"}
        note={{"title":"No subsequent SNDL recovery", "padding": 0}}
        subject={{"height":70,"type":"curly"}}
      />
      : ""}
      { annotation === 6 ?
        <AnnotationLabel
        x={width/1.2}
        y={height/1.1}
        dy={80}
        dx={240}
        color={"red"}
        note={{"title":"SNDL slight recovery",
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

export default SmallCaps;
