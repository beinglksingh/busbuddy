import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Label,
  Alert,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";

import classnames from "classnames";
import SweetAlert from "react-bootstrap-sweetalert"


// availity-reactstrap-validation
import {
  AvForm,
  AvField,AvRadioGroup,AvRadio
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withRouter, Link } from "react-router-dom";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData } from "../../store/functions";
import  Switch  from "react-switch";

class pageAddEdit_BankMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      isMDistributor : false,
      isSDistributor : false,
      isDistributor : false,
      isRetailer : false,
      switch9 : true,
      success_msg:false,
      confirm_alert: false,
      IsActive : true,
      IsNEFTActive : true,
      IsIMPSActive : true
    };
    this.obj = this;
    this.formTitle = "SMS API";
    this.breadCrumbTitle = "SMS API";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.BANKADD + "/0/token";
    this.pushFormName = "/masters-bankmaster";
    this.rtPage_Redirect = "/masters-bankmaster";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/BankMaster";
    this.syno  =  this.syno.bind(this);
    
  }
  componentDidMount() {




    const { id } = this.props.match.params;

    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
  }









  
  syno () {
    this.setState({success_msg : false ,update_msg : false})
  
    this.props.history.push(`${this.rtPage_Redirect}`, {});
  }


  btnSave_onClick(event, formData) {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    let vformData = new FormData();
  //Information
  vformData.append("Name", formData.Name);
  vformData.append("IFSC", formData.IFSC);
  vformData.append("IsNEFTActive", this.state.IsNEFTActive ? true : false );
  vformData.append("IsIMPSActive", this.state.IsIMPSActive ? true : false);
 
 



  if (!this.state.id)    {
    Fn_AddEditData(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, "#", true , "SMSId");
  }

  else  {
    Fn_AddEditData(this.obj, { arguList: { id: this.state.id, formData: vformData } }, this.API_URL_SAVE, "#", true , "kuku" , "update_msg");
  }
  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };



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
          OFF
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
          ON
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
                                  <Col lg="8">
                                  <Card>
                                    <CardBody>

                                    <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Name</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="Name" label="" value={this.state.formData.Name === null ? ''   : this.state.formData.Name} placeholder="Enter Bank Name" errorMessage="Enter Bank Name" validate={{ required: { value: true } }} type="text" className="form-control" />

                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">IFSC</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="IFSC" label="" value={this.state.formData.IFSC === null ? ''   : this.state.formData.IFSC} placeholder="Enter IFSC "  type="text" className="form-control" />

                                        </Col>
                                      </Row>
                                     

                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Is NEFT Active</label>
                                        </Col>
                                        <Col sm="2">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-8 mb-2"
                            onColor="#00ff00"
                            offColor="#ec4561"
                            onChange={() =>
                             this.setState({IsNEFTActive : !this.state.IsNEFTActive})
                            }
                            checked={this.state.IsNEFTActive}
                          />
                                        </Col>
                                        </Row>

                                        <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Is IMPS Active</label>
                                        </Col>
                                        <Col sm="2">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-8 mb-2"
                            onColor="#00ff00"
                            offColor="#ec4561"
                            onChange={() =>
                              this.setState({IsIMPSActive : !this.state.IsIMPSActive})
                            }
                            checked={this.state.IsIMPSActive}
                          />
                                        </Col>
                                        </Row>
                                      

                                     

                                     
                                    
                                    </CardBody>
                                  </Card>
                                  </Col>
                                 
                                </Row>
                                <Row>
                                </Row>
                            
                          <div className="d-flex flex-wrap gap-2">
                          <Button
                          type="submit"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          SAVE
                        </Button>

                        <Button
                          type="button"
                          color="secondary"
                          className="waves-effect"
                          onClick={this.btnCancel_onClick}
                        >
                          Cancel
                        </Button>

                        {this.state.success_msg ? (
                      <SweetAlert
                        title={'Success'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                       Bank Saved!
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
export default compose(container)(pageAddEdit_BankMaster);
