import * as d3 from 'd3';
import { useEffect, useRef, useState, Fragment } from 'react';
import { BBClose, KOSSClose, SNDLClose } from '../data/close_prices.js';
import { BBVolume, KOSSVolume, SNDLVolume } from '../data/volume.js';
import { Grid, Button, Card, CardContent, Typography  } from '@material-ui/core';
import { AnnotationLabel, AnnotationBracket } from 'react-annotation';
import StopIcon from '@material-ui/icons/Stop';

const SmallCaps = () => {
    
    const d3Ref = useRef();

    const monthFormat = d3.timeFormat("%m/%d");

    const [ KOSSButton, setKOSSButton ] = useState(true);
    const [ BBButton, setBBButton ] = useState(true);
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
    const unixDates = Object.keys(BBClose)
    // const first = unixDates[0]

    // Raw data arrays
    // const cleanDates = unixDates.map(dateFormat)
    const BBAdjClose = Object.values(BBClose)
    const KOSSAdjClose = Object.values(KOSSClose)

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


    const BByMaxAdjClose = d3.max(Object.values(BBClose), d => {
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

    const BBmappedVals = BBAdjClose.map(valMap);
    const KOSSmappedVals = KOSSAdjClose.map(valMap);

    const BBcombined = []
    const KOSScombined = []

    for (let i = 0; i < mappedDate.length; i++){
      BBcombined.push(Object.assign({}, mappedDate[i], BBmappedVals[i]))
    }

    for (let i = 0; i < mappedDate.length; i++){
      KOSScombined.push(Object.assign({}, mappedDate[i], KOSSmappedVals[i]))
    }

    const line = d3.line()
                   .x(d => xAxis(d.date))
                   .y(d => yAxis(d.value));



    if (BBButton) {
    // Add BB data
    svg.append('path')
       .data([BBcombined])
       .attr("id", "BB")
       .style('fill', 'none')
       .attr('stroke', 'steelblue')
       .attr('stroke-width', 2)
       .attr('d', line)

    } else { 
      d3.selectAll("#BB").remove()
      d3.selectAll("#annotate1").remove()
      d3.selectAll("#annotate2").remove()
      d3.selectAll("#annotate3").remove()
    }

    if (KOSSButton) {
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
       .text('KOSS and BB Price January 3, 2021 - July 12, 2021')

    if (KOSSButton && annotation > 0) {
    // Add KOSS annotations
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

    if (KOSSButton && annotation > 1) {
    
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

    if (KOSSButton && annotation > 2) {

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

    if (BBButton && annotation > 3) {
          // Add BB annotations
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

    if (BBButton && annotation > 4) {
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

    if (BBButton && annotation > 5) {
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
          .text(d3.format("($.2f") (BByMaxAdjClose))

    } else {
      d3.selectAll("#annotate6").remove()
    }

    // KOSS Volume
    const KOSSVolumeVals = Object.values(KOSSVolume);
    const KOSSVolumeValMap = KOSSVolumeVals.map(valMap);

    // const yMinVolKOSS = d3.min(KOSSVolumeVals, d=> {
    //   return d
    // })

    const yMaxVolKOSS = d3.max(KOSSVolumeVals, d=> {
      return d
    })

    const KOSSVolumeCombined = [] 
    
    for (let i = 0; i < mappedDate.length; i++){
      KOSSVolumeCombined.push(Object.assign({}, mappedDate[i], KOSSVolumeValMap[i]))
    }

    if (KOSSButton) {

      const yVolAxisKOSS = d3.scaleLinear()
      .domain([0, yMaxVolKOSS])
      .range([height, 400])

    svg.selectAll()
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
        return window.innerHeight - margin.bottom * 2.5 - yVolAxisKOSS(d['value']);
      });
    } else {
      d3.selectAll("#KOSSVolume").remove()
    }

    // BB Volume
    const BBVolumeVals = Object.values(BBVolume);
    const BBVolumeValMap = BBVolumeVals.map(valMap);

    // const yMinVolBB = d3.min(BBVolumeVals, d=> {
    //   return d
    // })

    const yMaxVolBB = d3.max(BBVolumeVals, d=> {
      return d
    })

    const BBVolumeCombined = [] 
    
    for (let i = 0; i < mappedDate.length; i++){
      BBVolumeCombined.push(Object.assign({}, mappedDate[i], BBVolumeValMap[i]))
    }


    if (BBButton && !KOSSButton) {
      const yVolAxisBB = d3.scaleLinear()
        .domain([0, yMaxVolBB])
        .range([height, 400])

      svg.selectAll()
         .data(BBVolumeCombined)
         .enter()
         .append('rect')
         .attr('id', 'BBVolume')
         .attr('x', d => {
           return xAxis(d['date'])
         })
         .attr('y', d => {
           return yVolAxisBB(d['value'])
         })
        .attr('fill', 'grey')
        .attr('width', 3)      
        .attr('height', d => {
          return window.innerHeight - margin.bottom * 2.5 - yVolAxisBB(d['value']);
        });
      } else {
        d3.selectAll("#BBVolume").remove()
      }



  }, [KOSSButton, BBButton, annotation]) //resizeListener
}

useRenderChartToCanvas();

  const handleKOSSClick = () => {
    setKOSSButton(!KOSSButton)
    d3.selectAll("#BBVolume").remove()
  }

  const handleBBClick = () => {
    setBBButton(!BBButton)
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
      <br/>
      <br/>
      <br/>
      <br/>
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
      onClick={handleBBClick}
      >
        BB
      </Button>
      &nbsp;&nbsp;
      <Button variant="contained"
      color="secondary"
      onClick={handlePlay}
      >&gt;&gt;</Button>
      &nbsp;&nbsp;
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
          <StopIcon fontSize="small" style={{ color: "green" }}></StopIcon> KOSS Corporation &nbsp;
          </Typography>
          <br/>
          <Typography variant="body1" component="body1">
          <StopIcon fontSize="small" style={{ color: "steelblue" }}></StopIcon> BlackBerry Limited
          </Typography>
        </CardContent>
      </Card>
      </Grid>
      
      </Grid>
      <div id='d3div'>
      <svg ref={d3Ref}>
        { annotation > 0 ?  
      <AnnotationLabel
        x={window.innerWidth/5.5}
        y={50}
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
       { annotation > 1 ?
        <AnnotationLabel
        x={window.innerWidth/3.5}
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
      : ""}
      { annotation > 2 ?
        <AnnotationLabel
        x={window.innerWidth/1.7}
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
      { annotation > 3 ?
        <AnnotationLabel
        x={window.innerWidth/5.5}
        y={540}
        dy={10}
        dx={162}
        color={"red"}
        note={{"title":"BB Peak",
          "label":"",
          "lineType":"horizontal",
          "align":"middle"}}
        connector={{"type":"line","end":null}}
      />
      : ""}
      { annotation > 4 ?
        <AnnotationBracket
        x={window.innerWidth/3.5}
        y={440}
        dy={10}
        dx={162}
        color={"red"}
        note={{"title":"No subsequent BB recovery", "padding": 0}}
        subject={{"height":70,"type":"curly"}}
      />
      : ""}
      </svg>
      </div>
      </Fragment>
  );
}

export default SmallCaps;
