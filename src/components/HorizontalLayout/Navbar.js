import React, { Component } from "react"
import PropTypes from "prop-types"
import { Row, Col, Collapse } from "reactstrap"
import { Link, withRouter } from "react-router-dom"
import classname from "classnames"

//i18n
import { withTranslation } from "react-i18next"

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    let matchingMenuItem = null
    const ul = document.getElementById("navigation")
    const items = ul.getElementsByTagName("a")
    for (let i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem)
    }
  }

  activateParentDropdown = item => {
    item.classList.add("active")
    const parent = item.parentElement
    if (parent) {
      parent.classList.add("active") // li
      const parent2 = parent.parentElement
      parent2.classList.add("active") // li
      const parent3 = parent2.parentElement
      if (parent3) {
        parent3.classList.add("active") // li
        const parent4 = parent3.parentElement
        if (parent4) {
          parent4.classList.add("active") // li
          const parent5 = parent4.parentElement
          if (parent5) {
            parent5.classList.add("active") // li
            const parent6 = parent5.parentElement
            if (parent6) {
              parent6.classList.add("active") // li
            }
          }
        }
      }
    }
    return false
  }

  render() {


    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    if (obj.isAdmin== true ){
    return (
      <React.Fragment>
        <div className="topnav">
          <div className="container-fluid">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
              <Collapse
                isOpen={this.props.menuOpen}
                className="navbar-collapse"
                id="topnav-menu-content"
              >
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/dashboard"
                      // onClick={e => {
                      //   e.preventDefault()
                      //   this.setState({ isDashboard: !this.state.isDashboard })
                      // }}
                      // to="/dashboard"
                    >
                      <i className="bx bx-home-circle me" />
                      {this.props.t("Dashboard")} {this.props.menuOpen}
                      <div className="arrow-down" />
                    </Link>
                    {/* <div
                      className={classname("dropdown-menu", {
                        show: this.state.isDashboard,
                      })}
                    >
                      <Link to="/dashboard" className="dropdown-item">
                        {this.props.t("Default")}
                      </Link>
                     
                    </div> */}
                  </li>

                  <li className="nav-item dropdown">
                    <Link
                      to="/busbooking"
                      // onClick={e => {
                      //   e.preventDefault()
                      //   this.setState({ uiState: !this.state.uiState })
                      // }}
                      className="nav-link dropdown-toggle arrow-none"
                    >
                      <i className="bx bx-tone me" />
                      {this.props.t("Book Ticket")}{" "}
                      <div className="arrow-down" />
                    </Link>
                    {/* <div
                      className={classname(
                        "dropdown-menu mega-dropdown-menu dropdown-menu-left dropdown-mega-menu-xl",
                        { show: this.state.uiState }
                      )}
                    > */}
                   
                  </li>



                    <li className="nav-item dropdown">
                    <Link
                      to="/ticketreport"
                      // onClick={e => {
                      //   e.preventDefault()
                      //   this.setState({ uiState: !this.state.uiState })
                      // }}
                      className="nav-link dropdown-toggle arrow-none"
                    >
                      <i className="bx bx-tone me" />
                      {this.props.t("Ticket Report")}{" "}
                      <div className="arrow-down" />
                    </Link>
                   
                  </li>

                  
                    <li className="nav-item dropdown">
                    <Link
                      to="/masters-membermaster"
                      // onClick={e => {
                      //   e.preventDefault()
                      //   this.setState({ uiState: !this.state.uiState })
                      // }}
                      className="nav-link dropdown-toggle arrow-none"
                    >
                      <i className="bx bx-tone me" />
                      {this.props.t("Agent")}{" "}
                      <div className="arrow-down" />
                    </Link>
                   
                  </li>
                </ul>
              </Collapse>
            </nav>
          </div>
        </div>
      </React.Fragment>
    )
                        }

                        else if (obj.roleid == 1) {
                          return (
                            <React.Fragment>
                              <div className="topnav">
                                <div className="container-fluid">
                                  <nav
                                    className="navbar navbar-light navbar-expand-lg topnav-menu"
                                    id="navigation"
                                  >
                                    <Collapse
                                      isOpen={this.props.menuOpen}
                                      className="navbar-collapse"
                                      id="topnav-menu-content"
                                    >
                                      <ul className="navbar-nav">
                                      <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/dashboard"
                      // onClick={e => {
                      //   e.preventDefault()
                      //   this.setState({ isDashboard: !this.state.isDashboard })
                      // }}
                      // to="/dashboard"
                    >
                      <i className="bx bx-home-circle me" />
                      {this.props.t("Dashboard")} {this.props.menuOpen}
                      <div className="arrow-down" />
                    </Link>
                    {/* <div
                      className={classname("dropdown-menu", {
                        show: this.state.isDashboard,
                      })}
                    >
                      <Link to="/dashboard" className="dropdown-item">
                        {this.props.t("Default")}
                      </Link>
                     
                    </div> */}
                  </li>
                      
                                        <li className="nav-item dropdown">
                                          <Link
                                            to="/#"
                                            onClick={e => {
                                              e.preventDefault()
                                              this.setState({ uiState: !this.state.uiState })
                                            }}
                                            className="nav-link dropdown-toggle arrow-none"
                                          >
                                            <i className="bx bx-tone me" />
                                            {this.props.t("Master")}{" "}
                                            <div className="arrow-down" />
                                          </Link>
                                          {/* <div
                                            className={classname(
                                              "dropdown-menu mega-dropdown-menu dropdown-menu-left dropdown-mega-menu-xl",
                                              { show: this.state.uiState }
                                            )}
                                          > */}
                                           <div
                                            className={classname("dropdown-menu", {
                                              show: this.state.appState,
                                            })}
                                          >
                                          
                                                <div>
                                                <Link className="dropdown-item" to={"/profile/"+obj.F_MemberMaster}>
                                                  {this.props.t("Profile")}
                                                </Link>
                                                </div>
                                             
                                          </div>
                                        </li>
                      
                                      
                      
                                        <li className="nav-item dropdown">
                                          <Link
                                            to="/#"
                                            className="nav-link dropdown-toggle arrow-none"
                                            onClick={e => {
                                              e.preventDefault()
                                              this.setState({
                                                componentState: !this.state.componentState,
                                              })
                                            }}
                                          >
                                            <i className="bx bx-collection me" />
                                            {this.props.t("Transaction")}{" "}
                                            <div className="arrow-down" />
                                          </Link>
                                          <div
                                            className={classname("dropdown-menu", {
                                              show: this.state.componentState,
                                            })}
                                          >
                                            
                                              
                                            <Link className="dropdown-item" to="/add-Balancedetails">
                                              {this.props.t("Balance Add")}
                                            </Link>
                                      
                                               
                                            <Link className="dropdown-item" to="fundrequest">{this.props.t("Fund Request")}</Link>
                                         <Link className="dropdown-item" to={"/fundrequestreport"}>
                                            {this.props.t("Fund Report")}
                                          </Link>
                                          
                                        
                                          </div>
                                        </li>
                      
                                        <li className="nav-item dropdown">
                                          <Link
                                            className="nav-link dropdown-toggle arrow-none"
                                            to="/#"
                                            onClick={e => {
                                              e.preventDefault()
                                              this.setState({ extraState: !this.state.extraState })
                                            }}
                                          >
                                            <i className="bx bx-file me" />
                                            {this.props.t("Reports")}{" "}
                                            <div className="arrow-down" />
                                          </Link>
                                          <div
                                            className={classname("dropdown-menu", {
                                              show: this.state.extraState,
                                            })}
                                          >
                                                
                                                <Link className="dropdown-item" to={"/distaccountstatement"}>
                                              {this.props.t("Account Statement")}
                                            </Link>

                                            {/* <Link className="dropdown-item" to={"/comissionreport"}>
                                              {this.props.t("Comission Report")}
                                            </Link> */}
                                                      
                                                
                                          </div>
                                        </li>
                      
                                        
                                        <li className="nav-item dropdown">
                                          <Link
                                            className="nav-link dropdown-toggle arrow-none"
                                            to="/#"
                                            onClick={e => {
                                              e.preventDefault()
                                              this.setState({ extraState: !this.state.extraState })
                                            }}
                                          >
                                            <i className="bx bx-file me" />
                                            {this.props.t("Help")}{" "}
                                            <div className="arrow-down" />
                                          </Link>
                                          <div
                                            className={classname("dropdown-menu", {
                                              show: this.state.extraState,
                                            })}
                                          >
                                        
                                                    
                                          </div>
                                        </li>
                                      </ul>
                                    </Collapse>
                                  </nav>
                                </div>
                              </div>
                            </React.Fragment>
                          )
                                              }


                                              else if (obj.roleid == 2) {
                                                return (
                                                  <React.Fragment>
                                                    <div className="topnav">
                                                      <div className="container-fluid">
                                                        <nav
                                                          className="navbar navbar-light navbar-expand-lg topnav-menu"
                                                          id="navigation"
                                                        >
                                                          <Collapse
                                                            isOpen={this.props.menuOpen}
                                                            className="navbar-collapse"
                                                            id="topnav-menu-content"
                                                          >
                                                            <ul className="navbar-nav">
                                                            <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/dashboard"
                      // onClick={e => {
                      //   e.preventDefault()
                      //   this.setState({ isDashboard: !this.state.isDashboard })
                      // }}
                      // to="/dashboard"
                    >
                      <i className="bx bx-home-circle me" />
                      {this.props.t("Dashboard")} {this.props.menuOpen}
                      <div className="arrow-down" />
                    </Link>
                    {/* <div
                      className={classname("dropdown-menu", {
                        show: this.state.isDashboard,
                      })}
                    >
                      <Link to="/dashboard" className="dropdown-item">
                        {this.props.t("Default")}
                      </Link>
                     
                    </div> */}
                  </li>
                                            
                                                              <li className="nav-item dropdown">
                                                                <Link
                                                                  to="/#"
                                                                  onClick={e => {
                                                                    e.preventDefault()
                                                                    this.setState({ uiState: !this.state.uiState })
                                                                  }}
                                                                  className="nav-link dropdown-toggle arrow-none"
                                                                >
                                                                  <i className="bx bx-tone me" />
                                                                  {this.props.t("Master")}{" "}
                                                                  <div className="arrow-down" />
                                                                </Link>
                                                                {/* <div
                                                                  className={classname(
                                                                    "dropdown-menu mega-dropdown-menu dropdown-menu-left dropdown-mega-menu-xl",
                                                                    { show: this.state.uiState }
                                                                  )}
                                                                > */}
                                                                 <div
                                                                  className={classname("dropdown-menu", {
                                                                    show: this.state.appState,
                                                                  })}
                                                                >
                                                                
                                                                      <div>
                                                                      <Link className="dropdown-item" to={"/profile/"+obj.F_MemberMaster}>
                                                                        {this.props.t("Profile")}
                                                                      </Link>
                                                                      </div>
                                                                   
                                                                </div>
                                                              </li>
                                            
                                                            
                                            
                                                              <li className="nav-item dropdown">
                                                                <Link
                                                                  to="/#"
                                                                  className="nav-link dropdown-toggle arrow-none"
                                                                  onClick={e => {
                                                                    e.preventDefault()
                                                                    this.setState({
                                                                      componentState: !this.state.componentState,
                                                                    })
                                                                  }}
                                                                >
                                                                  <i className="bx bx-collection me" />
                                                                  {this.props.t("Transaction")}{" "}
                                                                  <div className="arrow-down" />
                                                                </Link>
                                                                <div
                                                                  className={classname("dropdown-menu", {
                                                                    show: this.state.componentState,
                                                                  })}
                                                                >
                                                                  
                                                                    
                                                                  <Link className="dropdown-item" to="/add-Balancedetails">
                                                                    {this.props.t("Balance Add")}
                                                                  </Link>
                                                            
                                                                  <Link className="dropdown-item" to="fundrequest">{this.props.t("Fund Request")}</Link>
                                         <Link className="dropdown-item" to={"/fundrequestreport"}>
                                            {this.props.t("Fund Report")}
                                          </Link>
                                                                   
                                                                
                                                              
                                                                </div>
                                                              </li>
                                            
                                                              <li className="nav-item dropdown">
                                                                <Link
                                                                  className="nav-link dropdown-toggle arrow-none"
                                                                  to="/#"
                                                                  onClick={e => {
                                                                    e.preventDefault()
                                                                    this.setState({ extraState: !this.state.extraState })
                                                                  }}
                                                                >
                                                                  <i className="bx bx-file me" />
                                                                  {this.props.t("Reports")}{" "}
                                                                  <div className="arrow-down" />
                                                                </Link>
                                                                <div
                                                                  className={classname("dropdown-menu", {
                                                                    show: this.state.extraState,
                                                                  })}
                                                                >
                                                                      
                                                                      <Link className="dropdown-item" to={"/distaccountstatement"}>
                                                                    {this.props.t("Account Statement")}
                                                                  </Link>
                      
                                                                  {/* <Link className="dropdown-item" to={"/comissionreport"}>
                                                                    {this.props.t("Comission Report")}
                                                                  </Link> */}
                                                                            
                                                                      
                                                                </div>
                                                              </li>
                                            
                                                              
                                                              <li className="nav-item dropdown">
                                                                <Link
                                                                  className="nav-link dropdown-toggle arrow-none"
                                                                  to="/#"
                                                                  onClick={e => {
                                                                    e.preventDefault()
                                                                    this.setState({ extraState: !this.state.extraState })
                                                                  }}
                                                                >
                                                                  <i className="bx bx-file me" />
                                                                  {this.props.t("Help")}{" "}
                                                                  <div className="arrow-down" />
                                                                </Link>
                                                                <div
                                                                  className={classname("dropdown-menu", {
                                                                    show: this.state.extraState,
                                                                  })}
                                                                >
                                                              
                                                                          
                                                                </div>
                                                              </li>
                                                            </ul>
                                                          </Collapse>
                                                        </nav>
                                                      </div>
                                                    </div>
                                                  </React.Fragment>
                                                )
                                                                    }




                                                                    else if (obj.roleid == 3) {
                                                                      return (
                                                                        <React.Fragment>
                                                                          <div className="topnav">
                                                                            <div className="container-fluid">
                                                                              <nav
                                                                                className="navbar navbar-light navbar-expand-lg topnav-menu"
                                                                                id="navigation"
                                                                              >
                                                                                <Collapse
                                                                                  isOpen={this.props.menuOpen}
                                                                                  className="navbar-collapse"
                                                                                  id="topnav-menu-content"
                                                                                >
                                                                                  <ul className="navbar-nav">
                                                                                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/dashboard"
                      // onClick={e => {
                      //   e.preventDefault()
                      //   this.setState({ isDashboard: !this.state.isDashboard })
                      // }}
                      // to="/dashboard"
                    >
                      <i className="bx bx-home-circle me" />
                      {this.props.t("Dashboard")} {this.props.menuOpen}
                      <div className="arrow-down" />
                    </Link>
                    {/* <div
                      className={classname("dropdown-menu", {
                        show: this.state.isDashboard,
                      })}
                    >
                      <Link to="/dashboard" className="dropdown-item">
                        {this.props.t("Default")}
                      </Link>
                     
                    </div> */}
                  </li>
                                                                  
                                                                                    <li className="nav-item dropdown">
                                                                                      <Link
                                                                                        to="/#"
                                                                                        onClick={e => {
                                                                                          e.preventDefault()
                                                                                          this.setState({ uiState: !this.state.uiState })
                                                                                        }}
                                                                                        className="nav-link dropdown-toggle arrow-none"
                                                                                      >
                                                                                        <i className="bx bx-tone me" />
                                                                                        {this.props.t("Master")}{" "}
                                                                                        <div className="arrow-down" />
                                                                                      </Link>
                                                                                      {/* <div
                                                                                        className={classname(
                                                                                          "dropdown-menu mega-dropdown-menu dropdown-menu-left dropdown-mega-menu-xl",
                                                                                          { show: this.state.uiState }
                                                                                        )}
                                                                                      > */}
                                                                                       <div
                                                                                        className={classname("dropdown-menu", {
                                                                                          show: this.state.appState,
                                                                                        })}
                                                                                      >
                                                                                      
                                                                                            <div>
                                                                                            <Link className="dropdown-item" to={"/profile/"+obj.F_MemberMaster}>
                                                                                              {this.props.t("Profile")}
                                                                                            </Link>
                                                                                            </div>
                                                                                         
                                                                                      </div>
                                                                                    </li>
                                                                  
                                                                                  
                                                                  
                                                                                    <li className="nav-item dropdown">
                                                                                      <Link
                                                                                        to="/#"
                                                                                        className="nav-link dropdown-toggle arrow-none"
                                                                                        onClick={e => {
                                                                                          e.preventDefault()
                                                                                          this.setState({
                                                                                            componentState: !this.state.componentState,
                                                                                          })
                                                                                        }}
                                                                                      >
                                                                                        <i className="bx bx-collection me" />
                                                                                        {this.props.t("Transaction")}{" "}
                                                                                        <div className="arrow-down" />
                                                                                      </Link>
                                                                                      <div
                                                                                        className={classname("dropdown-menu", {
                                                                                          show: this.state.componentState,
                                                                                        })}
                                                                                      >
                                                                                        
                                                                                          
                                                                                        <Link className="dropdown-item" to="/add-Balancedetails">
                                                                                          {this.props.t("Balance Add")}
                                                                                        </Link>
                                                                                        <Link className="dropdown-item" to="fundrequest">{this.props.t("Fund Request")}</Link>
                                         <Link className="dropdown-item" to={"/fundrequestreport"}>
                                            {this.props.t("Fund Report")}
                                          </Link>
                                                                                           
                                                                                         
                                                                                      
                                                                                    
                                                                                      </div>
                                                                                    </li>
                                                                  
                                                                                    <li className="nav-item dropdown">
                                                                                      <Link
                                                                                        className="nav-link dropdown-toggle arrow-none"
                                                                                        to="/#"
                                                                                        onClick={e => {
                                                                                          e.preventDefault()
                                                                                          this.setState({ extraState: !this.state.extraState })
                                                                                        }}
                                                                                      >
                                                                                        <i className="bx bx-file me" />
                                                                                        {this.props.t("Reports")}{" "}
                                                                                        <div className="arrow-down" />
                                                                                      </Link>
                                                                                      <div
                                                                                        className={classname("dropdown-menu", {
                                                                                          show: this.state.extraState,
                                                                                        })}
                                                                                      >
                                                                                            
                                                                                            <Link className="dropdown-item" to={"/distaccountstatement"}>
                                                                                          {this.props.t("Account Statement")}
                                                                                        </Link>
{/*                                             
                                                                                        <Link className="dropdown-item" to={"/comissionreport"}>
                                                                                          {this.props.t("Comission Report")}
                                                                                        </Link> */}
                                                                                                  
                                                                                            
                                                                                      </div>
                                                                                    </li>
                                                                  
                                                                                    
                                                                                    <li className="nav-item dropdown">
                                                                                      <Link
                                                                                        className="nav-link dropdown-toggle arrow-none"
                                                                                        to="/#"
                                                                                        onClick={e => {
                                                                                          e.preventDefault()
                                                                                          this.setState({ extraState: !this.state.extraState })
                                                                                        }}
                                                                                      >
                                                                                        <i className="bx bx-file me" />
                                                                                        {this.props.t("Help")}{" "}
                                                                                        <div className="arrow-down" />
                                                                                      </Link>
                                                                                      <div
                                                                                        className={classname("dropdown-menu", {
                                                                                          show: this.state.extraState,
                                                                                        })}
                                                                                      >
                                                                                    
                                                                                                
                                                                                      </div>
                                                                                    </li>
                                                                                  </ul>
                                                                                </Collapse>
                                                                              </nav>
                                                                            </div>
                                                                          </div>
                                                                        </React.Fragment>
                                                                      )
                                                                                          }






                                                                                          else if (obj.roleid == 4) {
                                                                                            return (
                                                             <React.Fragment>
                                                               <div className="topnav">
                                                                 <div className="container-fluid">
                                                                   <nav
                                                                     className="navbar navbar-light navbar-expand-lg topnav-menu"
                                                                     id="navigation"
                                                                   >
                                                                     <Collapse
                                                                       isOpen={this.props.menuOpen}
                                                                       className="navbar-collapse"
                                                                       id="topnav-menu-content"
                                                                     >
                                                                       <ul className="navbar-nav">
                                                                       <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/dashboard"
                      // onClick={e => {
                      //   e.preventDefault()
                      //   this.setState({ isDashboard: !this.state.isDashboard })
                      // }}
                      // to="/dashboard"
                    >
                      <i className="bx bx-home-circle me" />
                      {this.props.t("Dashboard")} {this.props.menuOpen}
                      <div className="arrow-down" />
                    </Link>
                    {/* <div
                      className={classname("dropdown-menu", {
                        show: this.state.isDashboard,
                      })}
                    >
                      <Link to="/dashboard" className="dropdown-item">
                        {this.props.t("Default")}
                      </Link>
                     
                    </div> */}
                  </li>
                                                       
                                                                         <li className="nav-item dropdown">
                                                                           <Link
                                                                             to="/#"
                                                                             onClick={e => {
                                                                               e.preventDefault()
                                                                               this.setState({ uiState: !this.state.uiState })
                                                                             }}
                                                                                                              className="nav-link dropdown-toggle arrow-none"
                                                           >
                                                             <i className="bx bx-tone me" />
                                                             {this.props.t("Master")}{" "}
                                                             <div className="arrow-down" />
                                                           </Link>
                                                           {/* <div
                                                             className={classname(
                                                               "dropdown-menu mega-dropdown-menu dropdown-menu-left dropdown-mega-menu-xl",
                                                               { show: this.state.uiState }
                                                             )}
                                                           > */}
                                                            <div
                                                             className={classname("dropdown-menu", {
                                                               show: this.state.appState,
                                                             })}
                                                           >
                                                           
                     <div>
                     <Link className="dropdown-item" to={"/profile/"+obj.F_MemberMaster}>
                       {this.props.t("Profile")}
                     </Link>
                     {obj.IsDMR ? 
                      <Link className="dropdown-item" to={"/remitter"}>
                      {this.props.t("Fund Transfer")}
                    </Link> : null}

                    {obj.IsIndoNepal ? 
                    <Link className="dropdown-item" to={"/indonepal"}>
                      {this.props.t("Indo Nepal")}
                    </Link> : null}

                    {obj.IsAEPS ?
                    <>
                      <Link className="dropdown-item" to={"/aepsregistration"}>
                      {this.props.t("AEPS Authenticate")}
                    </Link>
                    <Link className="dropdown-item" to={"/aeps"}>
                      {this.props.t("AEPS")}
                    </Link> </>: null}

                       <Link className="dropdown-item" to={"/psonboarding/"+obj.F_MemberMaster}>
                          {this.props.t("PS Onboarding")}
                        </Link>

                    {obj.IsRecharge ? 
                    <Link className="dropdown-item" to={"/recharge"}>
                      {this.props.t("Recharge")}
                    </Link>
                    :  null}
                    
                     </div>
                  
                                                           </div>
                                                         </li>
                                       
                                                       
                                       
                                                  
                                                                        
                                                   <li className="nav-item dropdown">
                                                    <Link
                                                      className="nav-link dropdown-toggle arrow-none"
                                                      to="/#"
                                                      onClick={e => {
                                                        e.preventDefault()
                                                        this.setState({ report: !this.state.report })
                                                      }}
                                                    >
                                                      <i className="bx bx-file me" />
                                                      {this.props.t("Reports")}{" "}
                                                      <div className="arrow-down" />
                                                    </Link>
                                                    <div
                                                      className={classname("dropdown-menu", {
                                                        show: this.state.report,
                                                      })}
                                                    >
                                                          
                                                          <Link className="dropdown-item" to={"/accountstatement"}>
                                                        {this.props.t("Account Statement")}
                                                      </Link>
           
                                                      <Link className="dropdown-item" to={"/comissionreport"}>
                                                        {this.props.t("Comission Report")}
                                                      </Link>

                                                      {/* {obj.IsDMR ?  */}
                                                      <Link className="dropdown-item" to={"/dmrreport"}>
                                                        {this.props.t("Fund Transfer Report")}
                                                      </Link> 
                                                      {/* : null} */}

                                                      {/* {obj.IsIndoNepal ?  */}
                                                      <Link className="dropdown-item" to={"/indonepalreport"}>
                                                        {this.props.t("Indo Nepal Report")}
                                                      </Link> 
                                                      {/* : null} */}

                                                      {/* {obj.IsRecharge ? */}
                                                      <Link className="dropdown-item" to={"/rechargetran"}>
                                                        {this.props.t("Recharges")}
                                                      </Link>

                                                      <Link className="dropdown-item" to={"/PPwalletreport"}>
                                                                  {this.props.t("PP Wallet Report")}
                                                                </Link>
                                                      {/* : null} */}

                                                      {/* {obj.IsAEPS ? */}
                                                      <Link className="dropdown-item" to={"/aepsreport"}>
                                                        {this.props.t("AEPS Report")}
                                                      </Link>


                                                      <Link className="dropdown-item" to={"/loanreport"}>
                                                        {this.props.t("Loan Report")}
                                                      </Link>



                                                      {/* : null}     */}
                                                          
                                                    </div>
                                                                                                          </li>
                                                                                        
                                        
                                        <li className="nav-item dropdown">
                                          <Link
                                            className="nav-link dropdown-toggle arrow-none"
                                            to="/#"
                                            onClick={e => {
                                              e.preventDefault()
                                              this.setState({ help: !this.state.help })
                                            }}
                                          >
                                            <i className="bx bx-file me" />
                                            {this.props.t("Help")}{" "}
                                            <div className="arrow-down" />
                                          </Link>
                                          <div
                                            className={classname("dropdown-menu", {
                                              show: this.state.help,
                                            })}
                                          >
                                         <Link className="dropdown-item" to="fundrequest">{this.props.t("Fund Request")}</Link>
                                         <Link className="dropdown-item" to={"/fundrequestreport"}>
                                            {this.props.t("Fund Report")}
                                          </Link>
                                          <Link className="dropdown-item" to={"/tickets"}>
                                            {this.props.t("Raise Ticket")}
                                          </Link>
                                          <Link className="dropdown-item" to={"/loanmaster"}>
                    {this.props.t("Apply Loan")}
                  </Link>
                                                    
                                          </div>
                                        </li>
                                                                                                        </ul>
                                                                                                      </Collapse>
                                                                                                    </nav>
                                                                                                  </div>
                                                                                                </div>
                                                                                              </React.Fragment>
                                                                                            )
                                                                                                                }
                      


  }
}

Navbar.propTypes = {
  location: PropTypes.object,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(Navbar))
