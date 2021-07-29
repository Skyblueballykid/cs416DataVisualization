import React, {Fragment} from 'react';
import './About.css';
import { Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const About = () => {
    return(
        <Fragment>
    <div className="full-height">
    <Link to="/analysis">
      <Button variant="contained">
        Previous Page
        </Button>
        </Link>
    <br/>
    <br/>
    <br/>
    <h1>Sources</h1>
    <br/>
    <br/>
    <ul>
    <li>
    <h3>Data sourced using python yfinance library and data.py script</h3>
    </li>
    <li>
    <h3>Wallstreet Bets Subreddit user growth data sourced from: <a href="https://subredditstats.com/r/wallstreetbets">https://subredditstats.com/r/wallstreetbets</a></h3>
    </li>
    <li>
        <h3>GameStop Short interest: <a href="https://www.reuters.com/article/us-retail-trading-gamestop-short-idUSKBN2BG28H">https://www.reuters.com/article/us-retail-trading-gamestop-short-idUSKBN2BG28H</a></h3>
    </li>
    </ul>
    </div>
    </Fragment>
    )
}

export default About;