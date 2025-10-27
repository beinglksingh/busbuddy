import React, { Component } from "react";
import {
  Container,
  Row,
  Col,

  Card,
  CardBody,

  Button,
  UncontrolledTooltip,
  Modal,
  ModalBody
} from "reactstrap";


import SweetAlert from "react-bootstrap-sweetalert"


// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

// availity-reactstrap-validation
import {
  AvForm,
  AvField
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withRouter, Link } from "react-router-dom";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_CheckIsActive, Fn_DeleteData, Fn_ChangeStateValue } from "../../store/functions";
import  Switch  from "react-switch";
import './datatables.scss'
import * as XLSX from 'xlsx';





class pageAddEdit_UserMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      isMDistributor : false,
      isSDistributor : false,
      isDistributor : false,
      isRetailer : false,
      switch9 : false,
      success_msg:false,
      confirm_alert: false,
      balance : [{
        AvailableBalance : 0
      }],
      CalType : true,
      page: 1,
      sizePerPage: 10,
      productData: [],
      isTDS : false,
      modal_backdrop : false,
      F_PlanMaster : -1,
      F_UserType :  -1,
      F_ServiceMaster  : -1

    };
    this.obj = this;
    this.formTitle = "Plan";
    this.breadCrumbTitle = "Plan";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.USERMASTER + "/0/token";
    this.pushFormName = "/users";
    this.rtPage_Redirect = "/users";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/Userslist";
   
   
    
    
    
  }
  componentDidMount() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    Fn_CheckIsActive(this.obj, obj.uid);
    //Filing Dropdown

    
    

    const { id } = this.props.match.params;

    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
  }
  

 









  
 

  



  btnSave_onClick(event, formData) {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));


  

    
   
    let vformData = new FormData();
   
      //Information
      vformData.append("UserName", formData.UserName);
      vformData.append("UserPassword", formData.Password);
      vformData.append("MobileNo", formData.MobileNo);
      vformData.append("IsStaff", this.state.switch9 ? true : false );
     
    

      if (!this.state.id)    {
        Fn_AddEditData(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, "/users", true , "");
      }

      else if (obj.isAdmin == true) {
        Fn_AddEditData(this.obj, { arguList: { id: this.state.id, formData: vformData } }, this.API_URL_SAVE, "/users", true , "kuku" , "update_msg");
      }


  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };

  saveplanname () {

  }
  
  render() {

   
const Offsymbolb = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      {" "}
      No
    </div>
  )
}


const OnSymbolb = props => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      {" "}
      Yes
    </div>
  )
}


   





    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={this.breadCrumbTitle}
              breadcrumbItem={this.breadCrumbItem}
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    {/* <h4 className="card-title mb-4">Basic Wizard</h4> */}
                    <div className="wizard clearfix">
                     
                      <div className="content clearfix">
                        <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                         
                                <Row>
                                  <Col lg="12">
                                  <Card>
                                    <CardBody> 
                                 
                                     

                                  
                                       

                                    
                                      <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">UserName</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="UserName" label="" value={this.state.formData.UserName === null ? ''   : this.state.formData.UserName}   placeholder="UserName"   type="text"  className="form-control" />
                                        </Col>

</Row>
<Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Password</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="Password" label="" value={this.state.formData.Password === null ? ''   : this.state.formData.Password}   placeholder="Password"   type="text"  className="form-control" />
                                        </Col>
                                      </Row> 


                                      <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">MobileNo</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="MobileNo" label="" value={this.state.formData.MobileNo === null ? ''   : this.state.formData.MobileNo}   placeholder="MobileNo"   type="number"  className="form-control" />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Is Staff</label>
                                        </Col>
                                        <Col sm="2">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-12 mb-3"
                            onColor="#ec4561"
                            offColor="#00ff00"
                            onChange={() =>
                              this.setState({ switch9: !this.state.switch9 })
                            }
                            checked={this.state.switch9}
                          />
                                        </Col>
                                      
                                      </Row> 

                                     
                                 
                                      <div className="d-flex flex-wrap gap-2">
                                      <Button
                          type="submit"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          Add
                        </Button>

                        <Button
                          type="button"
                          color="secondary"
                          className="waves-effect"
                          onClick={this.btnCancel_onClick}
                        >
                          Cancel
                        </Button>

                   
                        </div>
                                     
                                    
                                    </CardBody>
                                  </Card>
                                  </Col>
                                 
                                </Row>





       



                               
                            
                          <div className="d-flex flex-wrap gap-2">
                         

                        {this.state.success_msg ? (
                      <SweetAlert
                        title={'Success'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        You clicked the button!
                      </SweetAlert>
                    ) : null}
                     
                          </div>
                        </AvForm>
                      </div>
                      
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}
export default compose(container)(pageAddEdit_UserMaster);
