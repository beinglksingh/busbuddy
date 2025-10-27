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
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_CheckIsActive } from "../../store/functions";
import  Switch  from "react-switch";
import Select from 'react-select';
import Loader from "pages/loader";




function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
export const DateString = (dd) =>{

let d1 =  dd.replace('-', '');
let d2 = d1.replace('-', '');

return d2;

}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}





class pageAddEdit_AccountTypeSchemeInterest extends Component {
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
      Time : getCurrentTime(),
      balance : [{
        AvailableBalance : 0
      }],
      ReBalance : 0,
      failed : false,
      loading : false
    };
    this.obj = this;
    this.formTitle = "Account Type Scheme";
    this.breadCrumbTitle = "Account Type Scheme";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE =  "AddAccountTypeSchemeInterest/0/token";
    this.pushFormName = "/accounttypeschemelist";
    this.rtPage_Redirect = "/accounttypeschemeinterestlist";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/BalanceEdit";
   
    this.syno  =  this.syno.bind(this);
    
    
  }
  componentDidMount() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    Fn_CheckIsActive(this.obj, obj.uid);
    //Filing Dropdown

 
      Fn_FillListData(this.obj, "accounttype", API_WEB_URLS.MASTER + "/0/token/AccountType/Id/6");

      Fn_FillListData(this.obj, "accounttypescheme", API_WEB_URLS.MASTER + "/0/token/AccountTypeSchemes/Id/6");
 
    

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
    this.setState({success_msg : false ,update_msg : false, failed : false})
  
    this.props.history.push(`${this.rtPage_Redirect}`, {});
  }


  btnSave_onClick(event, formData) {
    this.setState({loading : true});

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

   
    let vformData = new FormData();



  vformData.append("AccountType", 6);
  vformData.append("IntrerestPeriodType", formData.IntrerestPeriodType);
  vformData.append("MainInterest", formData.MainInterest);
  vformData.append("PaneltyInterest", formData.PenaltyInterest);
  vformData.append("ApplyDate", '12/10/2023');
  vformData.append("F_AccountTypeSchemes", formData.AccountTypeScheme);
    vformData.append("UserId", obj.uid);
 
  if (!this.state.id)    {
    Fn_AddEditData(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, "#", true , "");
  }




  // this.setState({loading : false});
  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };






  render() {



    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    const {selectedGroup}  = this.state;
    

    return (
      <React.Fragment>
        <div className="page-content">
        {this.state.loading ? <Loader /> : null}
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
                                        <label htmlFor="age" className="col-form-label">Account Type</label>
                                      </Col>
                                      <Col sm="4">
                                      <AvField  name="AccountType" label="" value={this.state.formData.AccountType === null ? '-1'   : this.state.formData.AccountType}  type="select" className="form-select" disabled >
                                          
                                          {this.state.accounttype
                                            ? this.state.accounttype.map(
                                                (option, key) => (
                                                  <option defaultValue key={option.Id} value={option.Id} label={option.Name} />
                                                )
                                              )
                                            : null}
                                        </AvField> 
                                      </Col>
                                      </Row>



                                      <Row>
                                        <Col sm="2" className="mb-3">
                                        <label htmlFor="age" className="col-form-label">Account Type Scheme</label>
                                      </Col>
                                      <Col sm="4">
                                      <AvField  name="AccountTypeScheme" label="" value={this.state.formData.AccountTypeScheme === null ? '-1'   : this.state.formData.AccountTypeScheme} validate={{ required: { value: true } }} type="select" className="form-select" >
                                      <option value={-1} defaultValue label={"Select"} />
                                          {this.state.accounttypescheme
                                            ? this.state.accounttypescheme.map(
                                                (option, key) => (
                                                  <option defaultValue key={option.Id} value={option.Id} label={option.Name} />
                                                )
                                              )
                                            : null}
                                        </AvField> 
                                      </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="2" className="mb-3">
                                        <label htmlFor="age" className="col-form-label">Interest Period Type</label>
                                      </Col>
                                      <Col sm="4">
                                      <AvField  name="IntrerestPeriodType" label="" value={this.state.formData.IntrerestPeriodType === null ? '-1'   : this.state.formData.IntrerestPeriodType} validate={{ required: { value: true } }} type="select" className="form-select" >
                                      <option value={-1} defaultValue label={"Select"} />
                                            <option value={1}  label={"Daily"} />
                                            <option value={2}  label={"Weekly"} />
                                            <option value={3}  label={"Monthly"} />
                                          
                                        </AvField> 
                                      </Col>
                                      </Row>

                                     

                                      <Row>
                                        <Col sm="2">
                                          <label htmlFor="dateOfJoining" className="col-form-label">Main Interest</label>
                                        </Col>
                                        <Col sm="6" className="mb-0">
                                          <AvField name="MainInterest" label="" value={this.state.formData.MainInterest === null ? ''   : this.state.formData.MainInterest} validate={{ required: { value: true } }} placeholder="Enter MainInterest"   type="numeric"  className="form-control" />
                                        </Col>  
                                      </Row>


                                      <Row>
                                        <Col sm="2">
                                          <label htmlFor="dateOfJoining" className="col-form-label">Penalty Interest</label>
                                        </Col>
                                        <Col sm="6" className="mb-0">
                                          <AvField name="PenaltyInterest" label="" value={this.state.formData.PenaltyInterest === null ? ''   : this.state.formData.PenaltyInterest} validate={{ required: { value: true } }} placeholder="Enter PenaltyInterest"   type="numeric"  className="form-control" />
                                        </Col>  
                                      </Row>

                                      <Row>
                                        <Col sm="2">
                                          <label htmlFor="dateOfJoining" className="col-form-label">Processing Charges</label>
                                        </Col>
                                        <Col sm="6" className="mb-0">
                                          <AvField name="ProcessingCharges" label="" value={this.state.formData.ProcessingCharges === null ? ''   : this.state.formData.ProcessingCharges} validate={{ required: { value: true } }} placeholder="Enter ProcessingCharges"   type="numeric"  className="form-control" />
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
                          Save
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


{this.state.failed ? (
                      <SweetAlert
                        title={'Insufficient Balance to Debit'}
                        danger
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                         Balance - {this.state.ReBalance}
                      </SweetAlert>
                    ) : null}
                     {this.state.confirm_alert ? (
                                                                <SweetAlert
                                                                    title="Are you sure?"
                                                                    warning
                                                                    showCancel
                                                                    confirmButtonText="Yes, delete it!"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="danger"
                                                                    // onConfirm={() =>this.props.btnDelete_onClick(this.props.selectedFormData)}
                                                                    // onCancel={() =>this.props.toggleDeleteConfirm(this.props.obj,formData,false)}
                                                                >
                                                                    
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
export default compose(container)(pageAddEdit_AccountTypeSchemeInterest);
