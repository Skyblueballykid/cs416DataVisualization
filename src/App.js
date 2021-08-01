import './App.css';
import { Fragment} from 'react';
import { Route, Switch, Redirect, Link, BrowserRouter as Router } from "react-router-dom";
import Main from './pages/Main';
import About from './pages/About';
import Smallcaps from './pages/SmallCaps';
import Analysis from './pages/Analysis';
import { Typography, Tabs, Tab } from '@material-ui/core';
import '@fontsource/roboto';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import WSB from './assets/images/wsb.jpeg';

const theme = createTheme({
  props: {
    MuiTypography: {
      variantMapping: {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        subtitle1: 'h4',
        subtitle2: 'h5',
        body1: 'span',
        body2: 'span',
      },
    },
  },
});

function App() {


  return (
    <Fragment>
      <Router>
        <Switch>
          
    <div class="wrap">
    <img
    class="bg"
    src={WSB}
    alt="WSB"/>
    <div class="content">
    <ThemeProvider theme={theme}>
    <div className="App">

      <Tabs>
            <Tab label="Main Stocks" to="/main" component={Link}></Tab>
            <Tab label="Other Stocks" to="/smallcaps" component={Link}></Tab>
            <Tab label="Subreddit User Analysis" to="/analysis" component={Link}></Tab>
            <Tab label="About" to="about" component={Link}></Tab>
      </Tabs>

      <Typography variant='h4'>
      <h2> r/Wallstreetbets: An internet phenomenon</h2>
      </Typography>
      <Typography variant='h5'>
      <h5>An interactive exploration of the meme stock craze</h5>
      </Typography>

    <Route path="/main" component={Main}/>
    <Route path="/smallcaps" component={Smallcaps}/>
    <Route path="/analysis" component={Analysis}/>
    <Route path="/about" component={About}/>
    <Redirect from="/" to="/main"/>
    </div>
    </ThemeProvider>
    </div>
    </div>
    </Switch>
    </Router>
    </Fragment>
  );
}

export default App;
