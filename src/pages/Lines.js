import * as d3 from 'd3';
import { useEffect, useRef, createRef } from 'react';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import { AMCClose, GMEClose, BBClose, KOSSClose, SNDLClose } from '../data/close_prices.js';
import { AMCVolume, GMEVolume, BBVolume, KOSSVolume, SNDLVolume } from '../data/volume.js';

const Lines = () => {
    console.log(AMCClose)
    console.log(AMCVolume)
    
    const d3Ref = useRef();

  useEffect(() => {

    // SVG Bounds
    const margin = {top: 10, right: 10, bottom: 10, left: 10}
    const width = parseInt(d3.select('#d3div').style('width')) 
    const height = parseInt(d3.select('#d3div').style('height'))

    // Dates range
    const dates = Object.keys(AMCClose)
    const first = dates[0]
    console.log('first', first)
    var start = new Date((first/1))
    console.log('date', start)

    // Define ranges
    const xMinClose = d3.min(dates, d => {
        return d
    })

    const xMaxClose = d3.max(dates, d => {
        return d
    })

    console.log(xMinClose)
    console.log(xMaxClose)


    const svg = d3.select(d3Ref.current)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')');
  }, [])

  return (

      <div id='d3div'>
      <svg ref={d3Ref}></svg>
      <SimpleDateTime>{1609718400}</SimpleDateTime>
      </div>

  );
}

export default Lines;
