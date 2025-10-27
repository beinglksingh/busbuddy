import PropTypes from "prop-types";
import React, { Component } from "react";

//Simple bar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.refDiv = React.createRef();
    this.state = {
      roleid: 0
    };
  }

  componentDidMount() {
    this.initMenu();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, ss) {
    if (this.props.type !== prevProps.type) {
      this.initMenu();
    }
  }

  initMenu() {
    new MetisMenu("#side-menu");

    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    for (let i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  // componentDidUpdate() {}

  scrollElement = item => {
    setTimeout(() => {
      if (this.refDiv.current !== null) {
        if (item) {
          const currentPosition = item.offsetTop;
          if (currentPosition > window.innerHeight) {
            if (this.refDiv.current)
              this.refDiv.current.getScrollElement().scrollTop =
                currentPosition - 300;
          }
        }
      }
    }, 300);
  };

  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;

    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      this.scrollElement(item);
      return false;
    }
    this.scrollElement(item);
    return false;
  };

  render() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
 
//Admin
if (obj.isAdmin == true){
  return  (
    <React.Fragment>
      <SimpleBar autoHide={false}   className="h-100"  ref={this.refDiv}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{this.props.t("Menu")}</li>
            <li>
              <Link to="/#">
                <i className="bx bx-home-circle" />
                <span className="badge rounded-pill bg-info float-end">
                  04
                </span>
                <span>{this.props.t("Dashboards")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/dashboard">{this.props.t("Default")}</Link>
                </li>
              
              </ul>
            </li>

            <li className="menu-title">{this.props.t("Apps")}</li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store" />
                <span>{this.props.t("Masters")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/masters-membermaster">
                    {this.props.t("Member Master")}
                  </Link>
                </li>
             
                <li>
                  <Link to="/masters-ledgermaster">
                    {this.props.t("Ledger Master")}
                  </Link>
                </li>

                <li>
                  <Link to="/masters-planmaster">
                    {this.props.t("Plan Master")}
                  </Link>
                </li>

                <li>
                  <Link to="/add-plan">
                    {this.props.t("Plan Add")}
                  </Link>
                </li>
                <li>
                  <Link to="/bankupload">
                    {this.props.t("Bank Data Upload")}
                  </Link>
                  
                </li>
                <li>
                  <Link to="/masters-bankmaster">
                    {this.props.t("Bank Master")}
                  </Link>
                </li>

             

                <li>
                  <Link to="/transactioncodemaster">
                    {this.props.t("DMR Status Code ")}
                  </Link>
                </li>

                <li>
                  <Link to="/ifscswap">
                    {this.props.t("IFSC Swap")}
                  </Link>
                </li>

                <li>
                  <Link to={"/masters-rechargeoperator"}>
                    {this.props.t("Recharge Operator")}
                  </Link>
                </li>

             

               

               
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store" />
                <span>{this.props.t("API Manage")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                
              <li>
                  <Link to={"/masters-rechargeapi"}>
                    {this.props.t("Recharge API")}
                  </Link>
                </li>
                <li>
                  <Link to="/smsapi">
                    {this.props.t("SMS API")}
                  </Link>
                </li>
               
              </ul>
            </li>


            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store" />
                <span>{this.props.t("Transaction")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                
              <li>
                  <Link to="/add-Balancedetails">
                    {this.props.t("Balance Add")}
                  </Link>
                </li>
                <li>
                  <Link to={"/managevoucher"}>
                    {this.props.t("Manage Voucher")}
                  </Link>
                </li>
               
              </ul>
            </li>

            
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store" />
                <span>{this.props.t("Reports")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                

              <li>
                  <Link to={"/LedgerDetails"}>
                    {this.props.t("Ledger Report")}
                  </Link>
                </li>
              <li>
                  <Link to={"/dmrreport"}>
                    {this.props.t("DMR Report")}
                  </Link>
                </li>
                <li>
                  <Link to={"/indonepalreport"}>
                    {this.props.t("Indo Nepal Report")}
                  </Link>
                </li>

                <li>
                  <Link to={"/rechargetran"}>
                    {this.props.t("Recharge Report")}
                  </Link>
                </li>
                <li>
                  <Link to={"/aepsreport"}>
                    {this.props.t("AEPS Report")}
                  </Link>
                </li>

                <li>
                  <Link to={"/tdsreportforadmin"}>
                    {this.props.t("TDS MAIN Report")}
                  </Link>
                </li>

                <li>
                  <Link to={"/updateutrlist"}>
                    {this.props.t("Update UTR")}
                  </Link>
                </li>

                <li>
                  <Link to={"/fundrequestreport"}>
                    {this.props.t("Fund Report")}
                  </Link>
                </li>



               
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-receipt" />
                <span>{this.props.t("Help")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
              <li>
                  <Link to="GlobalOptions">{this.props.t("Global Options")}</Link>
                </li>
                <li>
                  <Link to="#">{this.props.t("User Help")}</Link>
                </li>
              </ul>
            </li>


            
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
}

//Master Distributor
   
else if (obj.roleid == 1) {

    return  (
      <React.Fragment>
        <SimpleBar autoHide={false}   className="h-100"  ref={this.refDiv}>
          <div id="sidebar-menu">
            <ul className="metismenu list-unstyled" id="side-menu">
              <li className="menu-title">{this.props.t("Menu")}</li>
              <li>
                <Link to="/#">
                  <i className="bx bx-home-circle" />
                  <span className="badge rounded-pill bg-info float-end">
                    04
                  </span>
                  <span>{this.props.t("Dashboards")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="false">
                  <li>
                    <Link to="/dashboard">{this.props.t("Default")}</Link>
                  </li>
                
                </ul>
              </li>

              

              
  
              <li className="menu-title">{this.props.t("Apps")}</li>
              <li>
                <Link to="/#" className="has-arrow">
                  <i className="bx bx-store" />
                  <span>{this.props.t("Masters")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="false">
                  <li>
                    <Link to={"/profile/"+obj.F_MemberMaster}>
                      {this.props.t("Profile")}
                    </Link>
                  </li>

                  
                 
                </ul>
              </li>

              <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store" />
                <span>{this.props.t("Reports")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                
                <li>
                  <Link to={"/accountstatement"}>
                    {this.props.t("Account Statement")}
                  </Link>
                </li>

                <li>
                  <Link to={"/comissionreport"}>
                    {this.props.t("Comission Report")}
                  </Link>
                </li>
               
              </ul>
            </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <i className="bx bx-receipt" />
                  <span>{this.props.t("Help")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="false">
                  <li>
                    <Link to="#">{this.props.t("User Help")}</Link>
                  </li>
                </ul>
              </li>
  
  
              
            </ul>
          </div>
        </SimpleBar>
      </React.Fragment>
    );

}




//Super Distributor

else if (obj.roleid == 2) {

  return  (
    <React.Fragment>
      <SimpleBar autoHide={false}   className="h-100"  ref={this.refDiv}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{this.props.t("Menu")}</li>
            <li>
              <Link to="/#">
                <i className="bx bx-home-circle" />
                <span className="badge rounded-pill bg-info float-end">
                  04
                </span>
                <span>{this.props.t("Dashboards")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/dashboard">{this.props.t("Default")}</Link>
                </li>
              
              </ul>
            </li>

            <li className="menu-title">{this.props.t("Apps")}</li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store" />
                <span>{this.props.t("Masters")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to={"/profile/"+obj.F_MemberMaster}>
                    {this.props.t("Profile")}
                  </Link>
                </li>
                <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store" />
                <span>{this.props.t("Reports")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                
                <li>
                  <Link to={"/accountstatement"}>
                    {this.props.t("Account Statement")}
                  </Link>
                </li>

                <li>
                  <Link to={"/comissionreport"}>
                    {this.props.t("Comission Report")}
                  </Link>
                </li>
               
              </ul>
            </li>
                
               
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-receipt" />
                <span>{this.props.t("Help")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="#">{this.props.t("User Help")}</Link>
                </li>
              </ul>
            </li>


            
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );

}

//Distributor

else if (obj.roleid == 3) {

  return  (
    <React.Fragment>
      <SimpleBar autoHide={false}   className="h-100"  ref={this.refDiv}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{this.props.t("Menu")}</li>
            <li>
              <Link to="/#">
                <i className="bx bx-home-circle" />
                <span className="badge rounded-pill bg-info float-end">
                  04
                </span>
                <span>{this.props.t("Dashboards")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/dashboard">{this.props.t("Default")}</Link>
                </li>
              
              </ul>
            </li>

            <li className="menu-title">{this.props.t("Apps")}</li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store" />
                <span>{this.props.t("Masters")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to={"/profile/"+obj.F_MemberMaster}>
                    {this.props.t("Profile")}
                  </Link>
                </li>
                <li>
                  <Link to="/add-Balancedetails">
                    {this.props.t("Balance Add")}
                  </Link>
                </li>
                <li>
                  <Link to={"/accountstatement"}>
                    {this.props.t("Account Statement")}
                  </Link>
                </li>
                <li>
                  <Link to={"/comissionreport"}>
                    {this.props.t("Comission Report")}
                  </Link>
                </li>

                
               
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-receipt" />
                <span>{this.props.t("Help")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="#">{this.props.t("User Help")}</Link>
                </li>
              </ul>
            </li>


            
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );

}

//Retialer

else if (obj.roleid == 4) {

  return  (
    <React.Fragment>
      <SimpleBar autoHide={false}   className="h-100"  ref={this.refDiv}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{this.props.t("Menu")}</li>
            <li>
              <Link to="/#">
                <i className="bx bx-home-circle" />
                <span className="badge rounded-pill bg-info float-end">
                  04
                </span>
                <span>{this.props.t("Dashboards")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/dashboard">{this.props.t("Default")}</Link>
                </li>
              
              </ul>
            </li>

            <li className="menu-title">{this.props.t("Apps")}</li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store" />
                <span>{this.props.t("Masters")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to={"/profile/"+obj.F_MemberMaster}>
                    {this.props.t("Profile")}
                  </Link>
                </li>
                <li>
                  <Link to={"/remitter"}>
                    {this.props.t("Money Transfer")}
                  </Link>
                </li>

                <li>
                  <Link to={"/indonepal"}>
                    {this.props.t("Indo Nepal")}
                  </Link>
                </li>

                <li>
                  <Link to={"/aepsregistration"}>
                    {this.props.t("AEPS Authenticate")}
                  </Link>
                </li>

                <li>
                  <Link to={"/aeps"}>
                    {this.props.t("AEPS")}
                  </Link>
                </li>

                <li>
                  <Link to={"/recharge"}>
                    {this.props.t("Recharge")}
                  </Link>
                </li>
                <li>
                  <Link to={"/aepsreport"}>
                    {this.props.t("AEPS Report")}
                  </Link>
                </li>

                
               
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store" />
                <span>{this.props.t("Reports")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                
                <li>
                  <Link to={"/accountstatement"}>
                    {this.props.t("Account Statement")}
                  </Link>
                </li>


                <li>
                  <Link to={"/comissionreport"}>
                    {this.props.t("Comission Report")}
                  </Link>
                </li>

                <li>
                  <Link to={"/dmrreport"}>
                    {this.props.t("DMR Report")}
                  </Link>
                </li>

                <li>
                  <Link to={"/indonepalreport"}>
                    {this.props.t("Indo Nepal Report")}
                  </Link>
                </li>
                

                <li>
                  <Link to={"/rechargetran"}>
                    {this.props.t("Recharges")}
                  </Link>
                </li>

                <li>
                  <Link to={"/aepsreport"}>
                    {this.props.t("AEPS Report")}
                  </Link>
                </li>
               
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-receipt" />
                <span>{this.props.t("Help")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">

              <li>
                  <Link to="fundrequest">{this.props.t("Fund Request")}</Link>
                </li>
                <li>
                  <Link to={"/fundrequestreport"}>
                    {this.props.t("Fund Report")}
                  </Link>
                </li>
                <li>
                  <Link to="#">{this.props.t("User Help")}</Link>
                </li>
              </ul>
            </li>


            
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );

}










  }
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
  type: PropTypes.string,
};

export default withRouter(withTranslation()(SidebarContent));
