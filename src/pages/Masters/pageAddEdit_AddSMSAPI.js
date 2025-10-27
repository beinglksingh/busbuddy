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

class pageAddEdit_SMSAPI extends Component {
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
      IsActive : true
    };
    this.obj = this;
    this.formTitle = "SMS API";
    this.breadCrumbTitle = "SMS API";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.SMSAPIADD + "/0/token";
    this.pushFormName = "/smsapi";
    this.rtPage_Redirect = "/smsapi";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/SMSAPIEdit";
    this.syno  =  this.syno.bind(this);
    
  }
  componentDidMount() {


    //Filing Dropdown
    Fn_FillListData(this.obj, "accountusage", API_WEB_URLS.MASTER + "/0/token/AccountUsage/Id/0");
    



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
  vformData.append("F_AccountUsage", formData.F_AccountUsage);
  vformData.append("IsDefault", this.state.switch9 ? true : false);
  vformData.append("IsActive", this.state.IsActive ? true : false );
  vformData.append("Url", formData.Url);
 
 



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
                                  <Col lg="8">
                                  <Card>
                                    <CardBody>

                                    <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Account Usage</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField  name="F_AccountUsage" label="" value={this.state.formData.F_AccountUsage === null ? '-1'   : this.state.formData.F_AccountUsage}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.accountusage
                                              ? this.state.accountusage.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>
                                      </Row>
                                     

                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Is Default</label>
                                        </Col>
                                        <Col sm="2">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-8 mb-2"
                            onColor="#00ff00"
                            offColor="#ec4561"
                            onChange={() =>
                              this.setState({ switch9: !this.state.switch9 })
                            }
                            checked={this.state.switch9}
                          />
                                        </Col>
                                        </Row>
                                        <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Is Active</label>
                                        </Col>
                                        <Col sm="2">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-8 mb-2"
                            onColor="#00ff00"
                            offColor="#ec4561"
                            onChange={() =>
                              this.setState({ IsActive: !this.state.IsActive })
                            }
                            checked={this.state.IsActive}
                          />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="2">
                                          <label htmlFor="dateOfJoining" className="col-form-label">Url</label>
                                        </Col>
                                        <Col sm="8" className="mb-0">
                                          <AvField name="Url" label="" value={this.state.formData.Url === null ? ''   : this.state.formData.Url} placeholder="Enter Url" required={true} rows="4" cols="50"  type="textarea"  className="form-control" />
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
export default compose(container)(pageAddEdit_SMSAPI);
