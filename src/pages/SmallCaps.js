import * as d3 from 'd3';
import * as d3v4 from 'd3';
import { useEffect, useRef, createRef, useState, Fragment } from 'react';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import { BBClose, KOSSClose, SNDLClose } from '../data/close_prices.js';
import { BBVolume, KOSSVolume, SNDLVolume } from '../data/volume.js';
import { Grid, Button } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const Smallcaps = () => {
    return(
        <h1>Smallcaps</h1>
    )
}

export default Smallcaps;