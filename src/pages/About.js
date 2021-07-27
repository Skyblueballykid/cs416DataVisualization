import React, {Fragment} from 'react';

const About = () => {
    return(
        <Fragment>
    <h1>About this</h1>
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
    </Fragment>
    )
}

export default About;