import React, { Component } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { withRouter, Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

// users
import user1 from "../../../assets/images/users/defuser.jpg";

import { connect } from "react-redux";
import { Fn_CheckBalance } from "store/functions";
import Loader from "pages/loader";



const getUserName = () => {
  if (sessionStorage.getItem("authUser")) {
    const obj = JSON.parse(sessionStorage.getItem("authUser"))
    return obj;
  }
}
function formatNumber(number) {
  if (!number) {
    return "0";
  }

  // Convert the input to a number if it's not already
  const numericValue = parseFloat(number);

  // Check if the numericValue is a valid number
  if (!isNaN(numericValue)) {
    // Format the number with commas for thousands and add the rupee sign
    return "₹" + numericValue.toLocaleString("en-IN");
  } else {
    // Handle the case where the input is not a valid number
    return "Invalid Number";
  }
}
class ProfileMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: false,
      name: "Admin",
      refreshing : true,
      Balance : 0,
      isloading : false
    }
    this.obj = this;
    this.toggle = this.toggle.bind(this)
    this.handrefresh  = this.handrefresh.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu,
    }))
  }

  componentDidMount() {
    const userData = getUserName();
    if (userData) {
      this.setState({ name: userData.username })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.success !== this.props.success) {
      const userData = getUserName();
      if (userData) {
        this.setState({ name: userData.username })
      }
    }
  }
handrefresh () {
  this.setState({isloading : true});

  const authUserJSON = sessionStorage.getItem("authUser");
  const obj = JSON.parse(authUserJSON);
  Fn_CheckBalance(this.obj, obj.F_LedgerMaster);
  setTimeout(() => {
    this.setState({ Balance: 0 });
  }, 5000); // 5000 milliseconds = 5 seconds
  
}


  render() {
    return (
      <React.Fragment>

        {/* {this.state.isloading ? 
        
      <Loader/> : null}

        <div style={{marginTop : 20, color:'white'}}>

          {this.state.Balance > 0 ? 
           <span className="d-none d-xl-inline-block ms-1" style={{marginRight:'10px'}}>
           {formatNumber(this.state.Balance)}
         </span>
        
      
      :
      <span className="d-none d-xl-inline-block ms-1" style={{marginRight:'10px', cursor : 'pointer'}} onClick={this.handrefresh}>
      
          View Balance
          </span>
      
      }
       
          

        </div> */}
        <Dropdown
          isOpen={this.state.menu}
          toggle={this.toggle}
          className="d-inline-block"
        >
          <DropdownToggle
            className="btn header-item"
            id="page-header-user-dropdown"
            tag="button"
          >
            

          
          <span className="d-none d-xl-inline-block ms-1" style={{marginRight:'10px'}}>
          <img
              className="rounded-circle header-profile-user"
              src={user1}
              alt="Header Avatar"
            />{" "}
          </span>
        

           {" "}
            <span className="d-none d-xl-inline-block ms-1">
              {this.state.name}
            </span>
            <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem tag="a" href="/profile">
              <i className="bx bx-user font-size-16 align-middle ms-1" />
              {this.props.t("Profile")}
            </DropdownItem>
            {/* <DropdownItem tag="a" href="/crypto-wallet">
              <i className="bx bx-wallet font-size-16 align-middle me-1" />
              {this.props.t("My Wallet")}
            </DropdownItem> */}

            {/* <DropdownItem tag="a" href="#">
              <span className="badge bg-success float-end">11</span>
              <i className="bx bx-wrench font-size-17 align-middle me-1" />
              {this.props.t("Settings")}
            </DropdownItem> */}
            <DropdownItem tag="a" href="auth-lock-screen">
              <i className="bx bx-lock-open font-size-16 align-middle me-1" />
              {this.props.t("Lock screen")}
            </DropdownItem>
            
            <Link to="/changepassword" className="dropdown-item">
            <i className="bx bx-pencil font-size-17 align-middle me-1" />
            <span> {this.props.t("Change Password")}</span></Link>
            <div className="dropdown-divider" />
            <Link to="/logout" className="dropdown-item">
              <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
              <span>{this.props.t("Logout")}</span>
            </Link>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    )
  }
}

ProfileMenu.propTypes = {
  t: PropTypes.any,
  success: PropTypes.string
}

const mapStateToProps = state => {
  const { success } = state.Profile
  return { success }
}

export default withRouter(
  connect(mapStateToProps, {})(withTranslation()(ProfileMenu))
)
