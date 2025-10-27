import React from "react"
import PropTypes from 'prop-types'
import { Route, Redirect } from "react-router-dom";


const AppRoute = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  onRouteChange,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      const custId = localStorage.getItem("CustID");
    if(Number(custId)>0){
      const obj2 = localStorage.getItem("authUser");

      sessionStorage.setItem("authUser", obj2);
    }
      if (isAuthProtected && !sessionStorage.getItem("authUser")) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
      onRouteChange();
      return (
        <Layout >
          <Component {...props}  />
        </Layout>
      )
    }}
  />
)

AppRoute.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
  topbarTheme: PropTypes.any,
  onRouteChange: PropTypes.func
}

export default AppRoute
