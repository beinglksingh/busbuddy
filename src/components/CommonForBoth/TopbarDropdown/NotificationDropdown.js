import PropTypes from 'prop-types';
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import { compose } from "recompose";

import { container } from 'store/Containers/cntCommon';
import { API_WEB_URLS } from 'constants/constAPI';
//i18n
import { withTranslation } from "react-i18next";
import { Fn_FillListData } from 'store/functions';

class NotificationDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: false,
      noti : [{
        // id:1,
        // message : 'You have something',
        // time : '27/11/2023 10:42',
        // page : 'register',
        // head : 'Balance Add'
      },
     
    ],
    TotalNot : [{
      TotalNot : 0
    }]
    }

    this.obj = this;
    this.toggle = this.toggle.bind(this);
    this.clearall  = this.clearall.bind(this);
  }


  componentDidMount(){
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    // Fn_FillListData(this.obj, "TotalNot", API_WEB_URLS.MASTER + "/0/token/TotalNotifications/Id/"+obj.uid);
    // Fn_FillListData(this.obj, "noti", API_WEB_URLS.MASTER + "/0/token/GetNotifications/Id/"+obj.uid);

  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu,
    }))

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    Fn_FillListData(this.obj, "ss", API_WEB_URLS.MASTER + "/0/token/UpdateIsReadNotification/Id/"+obj.uid);
    Fn_FillListData(this.obj, "TotalNot", API_WEB_URLS.MASTER + "/0/token/TotalNotifications/Id/"+obj.uid);

    
  }

  clearall () {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    Fn_FillListData(this.obj, "ss", API_WEB_URLS.MASTER + "/0/token/ClearAllNotification/Id/"+obj.uid);
    Fn_FillListData(this.obj, "noti", API_WEB_URLS.MASTER + "/0/token/GetNotifications/Id/"+obj.uid);

  }
  render() {
    return (
      <React.Fragment>
        <Dropdown
          isOpen={this.state.menu}
          toggle={this.toggle}
          className="dropdown d-inline-block"
          tag="li"
        >
          <DropdownToggle
            className="btn header-item noti-icon"
            tag="button"
            id="page-header-notifications-dropdown"
          >
            <i className="bx bx-bell bx-tada" />
            <span className="badge bg-danger rounded-pill">{this.state.TotalNot[0].TotalNot}</span>
          </DropdownToggle>

          <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0">Notifications </h6>
                </Col>
                <div className="col-auto" >
                  <a href="#" className="small" onClick={this.clearall}>
                    {" "}
                    clear All
                  </a>
                </div>
              </Row>
            </div>

            <SimpleBar style={{ height: "230px" }}>

         

{this.state.noti.map((value , index)=>(

<Link key={index} to={'/'+value.page}  className="text-reset notification-item">
<div style={{marginLeft : '10px'}} className="media">

  <div className="media-body">
    <h6 className="mt-0 mb-1">
      {value.head}
    </h6>
    <div className="font-size-12 text-muted">
      <p className="mb-1">
        {
          value.message
        }
      </p>
      <p className="mb-0">
        <i className="mdi mdi-clock-outline" />{" "}
        {value.time}{" "}
      </p>
    </div>
  </div>
</div>
</Link>

))}

             
            
            </SimpleBar>
          
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    )
  }
}

NotificationDropdown.propTypes = {
  t: PropTypes.any
}

//export default withTranslation()(NotificationDropdown)

export default compose(container)(NotificationDropdown)
