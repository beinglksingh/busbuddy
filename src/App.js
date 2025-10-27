import React, { Component } from "react"
import PropTypes from "prop-types"
import { BrowserRouter as Router, Switch } from "react-router-dom"
import { connect } from "react-redux"

// Import Routes
import { authProtectedRoutes, publicRoutes } from "./routes/"
import AppRoute from "./routes/route"
import { topBarThemeTypes } from "constants/layout"
// layouts
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"
import { Fn_CheckBalance } from "store/functions"

// Import scss
import "./assets/scss/theme.scss"

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper"

// Import fackbackend Configuration file
import fakeBackend from "./helpers/AuthType/fakeBackend"

// Activating fake backend
fakeBackend()

function isDevToolsOpened() {
  let widthThreshold = 160;
  let heightThreshold = 100;

  // Check if window outer dimensions are below a certain threshold
  if (
    window.outerWidth - window.innerWidth > widthThreshold ||
    window.outerHeight - window.innerHeight > heightThreshold
  ) {
    return true;
  }

  // Check for common dev tool properties
  if (window.console && window.console.firebug) {
    return true;
  }

  return false;
}

// Activating fake firebase
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// init firebase backend
// initFirebaseBackend(firebaseConfig);

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDev : false
    }
     this.obj = this;
    this.getLayout = this.getLayout.bind(this)
    this.handleRouteChange  = this.handleRouteChange.bind(this);
    this.contextMenuOpen = false;
    
  }

  handleRouteChange() {

    const authUserJSON = sessionStorage.getItem("authUser");

if (authUserJSON) {
  // const obj = JSON.parse(authUserJSON);
  // Fn_CheckBalance(obj, obj.F_LedgerMaster);
}
  }

  

  componentDidMount() {
    // Check if dev tools are open
// if (isDevToolsOpened()) {
//   this.setState({isDev:true});

//   alert('Please close dev tools and reload');
//   // Developer tools might be open, handle as needed
//   // For example, prevent loading your site
//   console.log('Developer tools might be open');
//   // Add code here to handle the situation, like not loading your site
// } else {
//   this.setState({isDev:false});
//   // Developer tools might not be open
//   // Continue loading your site
//   console.log('Developer tools are closed');
//   // Add code here to load your site
// }
  }

  
  getLayout = () => {
    let layoutCls = HorizontalLayout

    switch (this.props.layout.layoutType) {
      case "vertical":
          layoutCls = VerticalLayout
        break
        default:
        layoutCls = HorizontalLayout
        
        break
    }
    return layoutCls
  }

  render() {
    const Layout = this.getLayout()

 

    return (

      
      <React.Fragment>

        {this.state.isDev ? null : 
        <Router>
          <Switch>
            {publicRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
                onRouteChange={this.handleRouteChange} 
              />
            ))}

            {authProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
               
                topbarTheme={topBarThemeTypes.DARK}
                isAuthProtected={true}
                exact
                onRouteChange={this.handleRouteChange} 
              />
            ))}
          </Switch>
        </Router>}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

App.propTypes = {
  layout: PropTypes.object,
}

export default connect(mapStateToProps, null)(App)
