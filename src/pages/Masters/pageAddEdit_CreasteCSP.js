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
import { Fn_DisplayData, Fn_AddEditData } from "../../store/functions";
import { API_HELPER } from "helpers/ApiHelper";

class pageAddEdit_CreateCSP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      isRegistered : false
    };
    this.obj = this;
    this.formTitle = "Customer Master";
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE =   "NMRECreateCSP/0/token";
    this.pushFormName = "/masters-customermaster";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/CustomerMaster";
    this.sendOTP  = this.sendOTP.bind(this);
    this.SearchCSP  =  this.SearchCSP.bind(this);
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



sendOTP  =  async() =>{

  let vformData = new FormData();
  //Information
  vformData.append("MobileNo", this.state.MobileNo);
 // vformData.append("CustomerName", this.state.CustomerName);
 vformData.append("CustomerName", "Lokendra Singh");
  
  
  let AuthUser2 = function() {
    return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRESendOTP/0/token" , vformData).then(token => { return token } )
  }
  let userToken2 = await AuthUser2();
  this.setState({processId : userToken2.data.data.processId})
  alert(userToken2.data.data.message);

}


SearchCSP  =  async(event) => {
  var Mobile  = event;
  if (Mobile.length == 10){

    this.setState({MobileNo : Mobile});
  let vformData = new FormData();
  //Information
  vformData.append("MobileNo", Mobile);
  
  
  let AuthUser2 = function() {
    return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRESearchCSP/0/token" , vformData).then(token => { return token } )
  }
  let userToken2 = await AuthUser2();

  console.log(userToken2);
  if (userToken2.data.statusCode ==  1){
    this.setState({isRegistered : true})
  }
}
  
 
  
}




  btnSave_onClick  =  async(event, formData)=> {





  //   let vformData = new FormData();
  // //Information
  // vformData.append("IsOwnBranch", formData.IsOwnBranch);
  // vformData.append("GSTIN", formData.GSTIN);
  // vformData.append("IsMainBranch", formData.IsMainBranch);
  // vformData.append("OTPProcessId", this.state.processId);
  // vformData.append("OTP", formData.OTP);
  //  vformData.append("PartnerIDCode", formData.PartnerIDCode);
  // vformData.append("Firstname", formData.FirstName);
  // vformData.append("Middlename", formData.MiddleName);
  // vformData.append("Lastname", formData.LastName);
  // vformData.append("Companyname", formData.CompanyName);
  // vformData.append("Mobilenumber", formData.MobileNo);
  // vformData.append("Localaddress", formData.LocalAddress);
  // vformData.append("Localarea", formData.LocalArea);
  // vformData.append("Localcity", formData.LocalCity);
  // vformData.append("Localdistrict", formData.LocalDistrict);
  // vformData.append("Localstate", formData.LocalState);
  // vformData.append("Localpincode", formData.LocalPinCode);
  // vformData.append("Telephone", '');
  // vformData.append("Alternatenumber", formData.AlternateNumber);
  // vformData.append("Emailid", formData.EmailId);
  // vformData.append("Dob", formData.DOB);
  // vformData.append("Pancard", formData.PanCard);
  // vformData.append("Shopaddress", formData.ShopAddress);
  // vformData.append("Shoparea", formData.SoapArea);
  // vformData.append("Shopcity", formData.ShopCity);
  // vformData.append("Shopdistrict", formData.ShopDistrict);
  // vformData.append("Shopstate", formData.ShopState);
  // vformData.append("Shoppincode", formData.ShopPinCode);
  // vformData.append("Ifsccode", formData.IFSCCode);
  // vformData.append("Accountnumber", formData.AccountNumber);
  // vformData.append("Agentaccountname", formData.AgentAccountName);
  // vformData.append("Gender", formData.Gender);
  // vformData.append("Category", formData.Category);
  // vformData.append("Fathernameorspousename", formData.FatherNameOrSpouseName);
  // vformData.append("Physicallyhandicapped", formData.PhysicallyHandicapped);
  // vformData.append("Alternateoccupationtype", formData.AlternateOccupationType);
  // vformData.append("Alternateoccupationdescription", '');
  // vformData.append("Highesteducationqualification", formData.HighestEducationQualification);
  // vformData.append("CorporateindividualBC", formData.CorporateIndividualBC);
  // vformData.append("Operatinghoursfrom", formData.OperatingHoursFrom);
  // vformData.append("Operatinghoursto", formData.OperatingHoursTo);
  // vformData.append("Course", formData.Course);
  // vformData.append("Dateofpassing", '');
  // vformData.append("Institutename", '');
  // vformData.append("Devicename", formData.DeviceName);
  // vformData.append("Connectivitytype", formData.ConnectivityType);
  // vformData.append("Provider", formData.Provider);
  // vformData.append("Entitytype", formData.EntityType);
  // vformData.append("Weeklyoff", formData.WeeklyOff);
  // vformData.append("Bankname", formData.BankName);
  // vformData.append("Branchname", formData.BranchName);
  // vformData.append("ListofotherbankstheCSPworkswith", formData.ListOfOtherBanksTheCSPWorksWith);
  // vformData.append("Natureofbusiness", formData.NatureOfBusiness);
  // vformData.append("Expectedannualturnover", formData.ExpectedAnnualTurnover);
  // vformData.append("Expectedannualincome", formData.ExpectedAnnualIncome);



  
  let vformData = new FormData();
  //Information
  vformData.append("IsOwnBranch", 'Yes');
  vformData.append("GSTIN", "ABCD1234GBFVC");
  vformData.append("IsMainBranch", "No");
  vformData.append("OTPProcessId", this.state.processId);
  vformData.append("OTP", this.state.OTP);
   vformData.append("PartnerIDCode", "RSRRLK01");
  vformData.append("Firstname", 'Lokendra');
  vformData.append("Middlename", '');
  vformData.append("Lastname", "Singh");
  vformData.append("Companyname", "LK");
  vformData.append("Mobilenumber", "8890007151");
  vformData.append("Localaddress", "Jodhpur");
  vformData.append("Localarea", "Jodhpur");
  vformData.append("Localcity", "Jodhpur");
  vformData.append("Localdistrict", "Jodhpur");
  vformData.append("Localstate", "Rajasthan");
  vformData.append("Localpincode", "342001");
  vformData.append("Telephone", '');
  vformData.append("Alternatenumber", "8239091432");
  vformData.append("Emailid", "beinglksingh@gmail.com");
  vformData.append("Dob", "17/09/2000");
  vformData.append("Pancard", "MMWPS2873R");
  vformData.append("Shopaddress", "Jodhpur");
  vformData.append("Shoparea", "Jodhpur");
  vformData.append("Shopcity", "Jodhpur");
  vformData.append("Shopdistrict", "Jodhpur");
  vformData.append("Shopstate", "Rajasthan");
  vformData.append("Shoppincode", "342001");
  vformData.append("Ifsccode", "SBIN0000659");
  vformData.append("Accountnumber", "38975808698");
  vformData.append("Agentaccountname", "Lokendra Singh");
  vformData.append("Gender", "Male");
  vformData.append("Category", "General");
  vformData.append("Fathernameorspousename", "Narendra Singh");
  vformData.append("Physicallyhandicapped", "Not Handicapped");
  vformData.append("Alternateoccupationtype", "Private");
  vformData.append("Alternateoccupationdescription", '');
  vformData.append("Highesteducationqualification", "12th");
  vformData.append("CorporateindividualBC", "Individual");
  vformData.append("Operatinghoursfrom", "09:00 AM");
  vformData.append("Operatinghoursto", "06:00 PM");
  vformData.append("Course", "None");
  vformData.append("Dateofpassing", '');
  vformData.append("Institutename", '');
  vformData.append("Devicename", "Laptop");
  vformData.append("Connectivitytype", "Mobile");
  vformData.append("Provider", "Airtel");
  vformData.append("Entitytype", "Individual");
  vformData.append("Weeklyoff", "Sunday");
  vformData.append("Bankname", "State Bank Of India");
  vformData.append("Branchname", "Main Branch");
  vformData.append("ListofotherbankstheCSPworkswith", "NA");
  vformData.append("Natureofbusiness", "Individual");
  vformData.append("Expectedannualturnover", "100000");
  vformData.append("Expectedannualincome", "10000");



  
  let AuthUser2 = function() {
    return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRECreateCSP/0/token" , vformData).then(token => { return token } )
  }
  let userToken2 = await AuthUser2();
alert(userToken2.data.responseMessage);
console.log(userToken2);

  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };
  render() {
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
{!this.state.isRegistered ?
 <Row>
 <Col lg="12">
 <Card>
   <CardBody>
     <Row>
       <Col sm="2" className="mb-3">
         <label htmlFor="firstName" className="col-form-label">Search Mobile No</label>
       </Col>
       <Col sm="4">
         <input name="SMobileNo" max={10} maxLength={10} label="" value={this.state.formData.SMobileNo === null ? ''   : this.state.formData.SMobileNo} onChange={(e)=> this.SearchCSP(e.target.value)} placeholder="Enter SMobileNo" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
       </Col>
      
     </Row>
     </CardBody>
     </Card>
     </Col>
     </Row>

     :


<>

                        <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                         
                                <Row>
                                  <Col lg="12">
                                  <Card>
                                    <CardBody>
                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">First Name</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="FirstName" onChange={(e)=>this.setState({CustomerName : e.target.value})} label="" value={this.state.formData.FirstName === null ? ''   : this.state.formData.FirstName} placeholder="Enter FirstName" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">AlternateNumber*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="AlternateNumber" label="" value={this.state.formData.AlternateNumber === null ? ''   : this.state.formData.AlternateNumber} placeholder="Enter AlternateNumber" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Middle Name</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="MiddleName" onChange={(e)=>this.setState({CustomerName : this.state.CustomerName+' ' +e.target.value})} label="" value={this.state.formData.MiddleName === null ? ''   : this.state.formData.MiddleName} placeholder="Enter MiddleName"  type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">EmailId*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="EmailId" label="" value={this.state.formData.EmailId === null ? ''   : this.state.formData.EmailId} placeholder="Enter EmailId" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Last Name</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="LastName" label="" onChange={(e)=>this.setState({CustomerName : this.state.CustomerName+' ' +e.target.value})} value={this.state.formData.LastName === null ? ''   : this.state.formData.LastName} placeholder="Enter LastName" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>


                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">DOB*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="DOB" label="" value={this.state.formData.DOB === null ? ''   : this.state.formData.DOB} placeholder="Enter DOB" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Company Name</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="CompanyName" label="" value={this.state.formData.CompanyName === null ? ''   : this.state.formData.CompanyName} placeholder="Enter CompanyName" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>


                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">PanCard*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="PanCard" label="" value={this.state.formData.PanCard === null ? ''   : this.state.formData.PanCard} placeholder="Enter PanCard" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">MobileNo</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="MobileNo" label="" onChange={(e)=>this.sendOTP(e)} value={this.state.formData.MobileNo === null ? ''   : this.state.formData.MobileNo} placeholder="Enter MobileNo" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">OTP</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="OTP" label="" onChange={(e)=>this.setState({OTP : e.target.value})} value={this.state.formData.OTP === null ? ''   : this.state.formData.OTP} placeholder="Enter OTP" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">ShopAddress*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="ShopAddress" label="" value={this.state.formData.ShopAddress === null ? ''   : this.state.formData.ShopAddress} placeholder="Enter ShopAddress" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>


                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"></label>
                                        </Col>
                                        <Col sm="4">
                                        <Button
                          type="button"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                          onClick={this.sendOTP}
                        >
                          Send OTP
                        </Button>
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">LocalAddress*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="LocalAddress" label="" value={this.state.formData.LocalAddress === null ? ''   : this.state.formData.LocalAddress} placeholder="Enter LocalAddress" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>


                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">SoapArea*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="SoapArea" label="" value={this.state.formData.SoapArea === null ? ''   : this.state.formData.SoapArea} placeholder="Enter SoapArea" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">LocalArea*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="LocalArea" label="" value={this.state.formData.LocalArea === null ? ''   : this.state.formData.LocalArea} placeholder="Enter LocalArea" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">ShopCity*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="ShopCity" label="" value={this.state.formData.ShopCity === null ? ''   : this.state.formData.ShopCity} placeholder="Enter ShopCity" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">LocalCity*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="LocalCity" label="" value={this.state.formData.LocalCity === null ? ''   : this.state.formData.LocalCity} placeholder="Enter LocalCity" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>


                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">ShopDistrict*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="ShopDistrict" label="" value={this.state.formData.ShopDistrict === null ? ''   : this.state.formData.ShopDistrict} placeholder="Enter ShopDistrict" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">LocalDistrict*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="LocalDistrict" label="" value={this.state.formData.LocalDistrict === null ? ''   : this.state.formData.LocalDistrict} placeholder="Enter LocalDistrict" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>


                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">ShopState*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="ShopState" label="" value={this.state.formData.ShopState === null ? ''   : this.state.formData.ShopState} placeholder="Enter ShopState" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">LocalState*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="LocalState" label="" value={this.state.formData.LocalState === null ? ''   : this.state.formData.LocalState} placeholder="Enter LocalState" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>


                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">ShopPinCode*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="ShopPinCode" label="" value={this.state.formData.ShopPinCode === null ? ''   : this.state.formData.ShopPinCode} placeholder="Enter ShopPinCode" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">LocalPinCode*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="LocalPinCode" label="" value={this.state.formData.LocalPinCode === null ? ''   : this.state.formData.LocalPinCode} placeholder="Enter LocalPinCode" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Gender*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="Gender"  label="" value={this.state.formData.Gender === null ? '-1'   : this.state.formData.Gender} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={'Male'}  label={"Male"} />
                                            <option value={'Female'}  label={"Female"} />
                                            <option value={'Other'}  label={"Other"} />
                                           
                                          </AvField>
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">IFSCCode*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="IFSCCode" label="" value={this.state.formData.IFSCCode === null ? ''   : this.state.formData.IFSCCode} placeholder="Enter IFSCCode" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Category*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="Category"  label="" value={this.state.formData.Category === null ? '-1'   : this.state.formData.Category} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={'General'}  label={"General"} />
                                            <option value={'OBC'}  label={"OBC"} />
                                            <option value={'SC'}  label={"SC"} />
                                            <option value={'ST'}  label={"ST"} />
                                          </AvField>
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">AccountNumber*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="AccountNumber" label="" value={this.state.formData.AccountNumber === null ? ''   : this.state.formData.AccountNumber} placeholder="Enter AccountNumber" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">FatherNameOrSpouseName*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="FatherNameOrSpouseName" label="" value={this.state.formData.FatherNameOrSpouseName === null ? ''   : this.state.formData.FatherNameOrSpouseName} placeholder="Enter FatherNameOrSpouseName" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">AgentAccountName*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="AgentAccountName" label="" value={this.state.formData.AgentAccountName === null ? ''   : this.state.formData.AgentAccountName} placeholder="Enter AgentAccountName" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">PhysicallyHandicapped*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="PhysicallyHandicapped"  label="" value={this.state.formData.PhysicallyHandicapped === null ? '-1'   : this.state.formData.PhysicallyHandicapped} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={'Handicapped'}  label={"Handicapped"} />
                                            <option value={'Not Handicapped'}  label={"Not Handicapped"} />
                                          </AvField>
                                        </Col>
                                      </Row>



                                      <Row>
                                        {/* <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">LocalPinCode*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="LocalPinCode" label="" value={this.state.formData.LocalPinCode === null ? ''   : this.state.formData.LocalPinCode} placeholder="Enter LocalPinCode" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col> */}

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">AlternateOccupationType*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="AlternateOccupationType"  label="" value={this.state.formData.AlternateOccupationType === null ? '-1'   : this.state.formData.AlternateOccupationType} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={'Government'}  label={"Government"} />
                                            <option value={'Self Employed'}  label={"Self Employed"} />
                                            <option value={'Public Sector'}  label={"Public Sector"} />
                                            <option value={'Private'}  label={"Private"} />
                                            <option value={'None'}  label={"None"} />
                                          </AvField>
                                        </Col>
                                      </Row>


                                      <Row>
                                        {/* <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">LocalPinCode*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="LocalPinCode" label="" value={this.state.formData.LocalPinCode === null ? ''   : this.state.formData.LocalPinCode} placeholder="Enter LocalPinCode" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col> */}

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">HighestEducationQualification*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="HighestEducationQualification"  label="" value={this.state.formData.HighestEducationQualification === null ? '-1'   : this.state.formData.HighestEducationQualification} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={'Under 10th'}  label={"Under 10th"} />
                                            <option value={'10th'}  label={"10th"} />
                                            <option value={'12th'}  label={"12th"} />
                                            <option value={'Graduate'}  label={"Graduate"} />
                                            <option value={'Post Graduate'}  label={"Post Graduate"} />
                                          </AvField>
                                        </Col>
                                      </Row>

                                      <Row>
                                        {/* <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">LocalPinCode*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="LocalPinCode" label="" value={this.state.formData.LocalPinCode === null ? ''   : this.state.formData.LocalPinCode} placeholder="Enter LocalPinCode" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col> */}

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">CorporateIndividualBC(Individual)*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="CorporateIndividualBC" label="" value={this.state.formData.CorporateIndividualBC === null ? ''   : this.state.formData.CorporateIndividualBC} placeholder="Enter CorporateIndividualBC" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">OperatingHoursFrom* (09:00 AM)</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="OperatingHoursFrom" label="" value={this.state.formData.OperatingHoursFrom === null ? ''   : this.state.formData.OperatingHoursFrom} placeholder="Enter OperatingHoursFrom" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">BankName*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="BankName" label="" value={this.state.formData.BankName === null ? ''   : this.state.formData.BankName} placeholder="Enter BankName" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">OperatingHoursTo* (06:00 PM)</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="OperatingHoursTo" label="" value={this.state.formData.OperatingHoursTo === null ? ''   : this.state.formData.OperatingHoursTo} placeholder="Enter OperatingHoursTo" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">BranchName*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="BranchName" label="" value={this.state.formData.BranchName === null ? ''   : this.state.formData.BranchName} placeholder="Enter BranchName" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>
                                      

                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Course*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="Course"  label="" value={this.state.formData.Course === null ? '-1'   : this.state.formData.Course} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {/* <option value={'IIBF Advance'}  label={"IIBF Advance"} />
                                            <option value={'IIBF Basic'}  label={"IIBF Basic"} />
                                            <option value={'Certified by Bank'}  label={"Certified by Bank"} /> */}
                                            <option value={'None'}  label={"None"} />
                                          </AvField>
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">ListOfOtherBanksTheCSPWorksWith* (NA if not)</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="ListOfOtherBanksTheCSPWorksWith" label="" value={this.state.formData.ListOfOtherBanksTheCSPWorksWith === null ? ''   : this.state.formData.ListOfOtherBanksTheCSPWorksWith} placeholder="Enter ListOfOtherBanksTheCSPWorksWith" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>
                                      



                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">DeviceName*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="DeviceName"  label="" value={this.state.formData.DeviceName === null ? '-1'   : this.state.formData.DeviceName} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                           
                                            <option value={'Laptop'}  label={"Laptop"} />
                                            <option value={'HandHeld'}  label={"HandHeld"} />
                                          </AvField>
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">NatureOfBusiness* (Individual)</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="NatureOfBusiness" label="" value={this.state.formData.NatureOfBusiness === null ? 'Individual'   : this.state.formData.NatureOfBusiness} placeholder="Enter NatureOfBusiness" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>
                                      




                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">ConnectivityType*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="ConnectivityType"  label="" value={this.state.formData.ConnectivityType === null ? '-1'   : this.state.formData.ConnectivityType} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                           
                                            <option value={'Landline'}  label={"Landline"} />
                                            <option value={'Mobile'}  label={"Mobile"} />
                                            <option value={'VSAT'}  label={"VSAT"} />
                                          </AvField>
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">ExpectedAnnualTurnover*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="ExpectedAnnualTurnover" label="" value={this.state.formData.ExpectedAnnualTurnover === null ? ''   : this.state.formData.ExpectedAnnualTurnover} placeholder="Enter ExpectedAnnualTurnover" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>
                                      



                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Provider*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="Provider"  label="" value={this.state.formData.Provider === null ? '-1'   : this.state.formData.Provider} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                           
                                            <option value={'Airtel'}  label={"Airtel"} />
                                            <option value={'Jio'}  label={"Jio"} />
                                            <option value={'Vodafone'}  label={"Vodafone"} />
                                            <option value={'BSNL'}  label={"BSNL"} />
                                          </AvField>
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">ExpectedAnnualIncome*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="ExpectedAnnualIncome" label="" value={this.state.formData.ExpectedAnnualIncome === null ? ''   : this.state.formData.ExpectedAnnualIncome} placeholder="Enter ExpectedAnnualIncome" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>
                                      


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">EntityType*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="EntityType"  label="" value={this.state.formData.EntityType === null ? '-1'   : this.state.formData.EntityType} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={'Sole Proprietor'}  label={"Sole Proprietor"} />
                                            <option value={'Individual'}  label={"Individual"} />
                                          </AvField>
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">IsOwnBranch*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="IsOwnBranch"  label="" value={this.state.formData.IsOwnBranch === null ? '-1'   : this.state.formData.IsOwnBranch} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={'Y'}  label={"Yes"} />
                                            <option value={'N'}  label={"No"} />
                                          </AvField>
                                        </Col>
                                      </Row>
                                      


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">WeeklyOff(Week Name)*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="WeeklyOff" label="" value={this.state.formData.WeeklyOff === null ? ''   : this.state.formData.WeeklyOff} placeholder="Enter WeeklyOff" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">GSTIN*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="GSTIN" label="" value={this.state.formData.GSTIN === null ? ''   : this.state.formData.GSTIN} placeholder="Enter GSTIN" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>
                                      


                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">PartnerIDCode*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="PartnerIDCode" label="" value={this.state.formData.PartnerIDCode === null ? ''   : this.state.formData.PartnerIDCode} placeholder="Enter PartnerIDCode" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">IsMainBranch*</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="IsMainBranch"  label="" value={this.state.formData.IsMainBranch === null ? '-1'   : this.state.formData.IsMainBranch} errorMessage="fill field" validate={{ required: { value: true } }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={'Y'}  label={"Yes"} />
                                            <option value={'N'}  label={"No"} />
                                          </AvField>
                                        </Col>
                                      </Row>
                                      


                                      {/* <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">LocalPinCode*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="LocalPinCode" label="" value={this.state.formData.LocalPinCode === null ? ''   : this.state.formData.LocalPinCode} placeholder="Enter LocalPinCode" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>

                                        {/* <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">CorporateIndividualBC*</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="CorporateIndividualBC" label="" value={this.state.formData.CorporateIndividualBC === null ? ''   : this.state.formData.CorporateIndividualBC} placeholder="Enter CorporateIndividualBC" errorMessage="fill field" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row> */}
                                      

                                      
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
                          onClick={this.btnSave_onClick}
                        >
                          Cancel
                        </Button>


                        {this.state.success_msg ? (
                      <SweetAlert
                        title="Customer Saved Successfully!"
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        You clicked the button!
                      </SweetAlert>
                    ) : null}
                          </div>
                        </AvForm>
                        </>
}
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
export default compose(container)(pageAddEdit_CreateCSP);
