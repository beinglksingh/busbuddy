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
import { Fn_DisplayData, Fn_AddEditData , Fn_FillListData, Fn_ChangeStateValue} from "../../store/functions";
import  Switch  from "react-switch";
import Loader from "pages/loader";
import { API_HELPER } from "helpers/ApiHelper";


class pageAddEdit_GlobalOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {
        IsAEPS : false,
      IsDMR : false,
      IsIndoNepal: false,
      IsRecharge : false
     
      },
      LoginIMG1 : '',
      LoginIMG2 : '',
      LoginIMG3 : '',
      LoginIMG4 : '' ,
      loading : false,
      success_msg2 : false,
      failed : false,
      Name : ''
    };
    this.obj = this;
    this.formTitle = "Global Options";
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.GLOBALOPTIONS + "/0/token";
    this.pushFormName = "/GlobalOptions";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.syno =  this.syno.bind(this);
    this.backupdatabase  = this.backupdatabase.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/GlobalOptions/Id";
  }
  componentDidMount() {
    
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
      Fn_DisplayData(this.obj, 1, this.API_URL, "global");

      Fn_FillListData(this.obj, "DMRBankList", API_WEB_URLS.MASTER + "/0/token/DMRBankList/Id/0");
      Fn_FillListData(this.obj, "loanaccounttypescheme", API_WEB_URLS.MASTER + "/0/token/AccountTypeSchemes/Id/6");
  }
  btnSave_onClick(event, formData) {
   


this.setState({loading : true});

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    




  
    let vformData = new FormData();
    //Information
    vformData.append("LoginPageLine1", formData.LoginPageLine1);
    vformData.append("LoginPageLine2", formData.LoginPageLine2);
    vformData.append("DashboardLine", formData.DashboardLine);
    vformData.append("TimeGapForOTP", formData.TimeGapForOTP);
    vformData.append("BalanceAddVoucherPattern", formData.BalanceAddVoucherPattern );
    vformData.append("SenderDailyLimit", formData.SenderDailyLimit);
    vformData.append("SenderMonthlyLimit", formData.SenderMonthlyLimit);
    vformData.append("AccountNoDailyLimit", formData.AccountNoLimit);
    vformData.append("MonthlyAccountNoLimit", formData.MonthlyAccountNoLimit);
    vformData.append("VerifyTransferAmount", formData.VerifyTransferAmount);
    vformData.append("VerifyCharges", formData.VerifyCharges);
    vformData.append("MinimumWalletBalance",formData.MinimumWalletBalance );
    vformData.append("DefaultDMRBank", formData.DefaultDMRBank);
    vformData.append("LoanScheme", formData.LoanScheme);
    vformData.append("TDS", formData.TDS);
    vformData.append("MobileNo", formData.MobileNo);
    vformData.append("UniversalOTP", formData.UniversalOTP);
    vformData.append("AEPSBankPipi", formData.AEPSBankPipi);
    vformData.append("DMRIMPS", formData.DMRIMPS);
    vformData.append("IsAEPS", this.state.IsAEPS ? true : false);
    vformData.append("IsDMR", this.state.IsDMR ? true : false);
    vformData.append("IsIndoNepal", this.state.IsIndoNepal? true : false);
    vformData.append("IsRecharge", this.state.IsRecharge ? true : false);
    vformData.append("IsLoginIMG1",this.state.LoginIMG1 == '' || this.state.LoginIMG1 == undefined ? false : true );
    vformData.append("IsLoginIMG2", this.state.LoginIMG2 == '' || this.state.LoginIMG2 == undefined ? false : true);
    vformData.append("IsLoginIMG3", this.state.LoginIMG3 == '' || this.state.LoginIMG3 == undefined ? false : true);
    vformData.append("IsLoginIMG4", this.state.LoginIMG4 == '' || this.state.LoginIMG4 == undefined ? false : true);
    vformData.append("loginIMG1.ImageFile", this.state.LoginIMG1);
    vformData.append("loginIMG1.ImageFileName", "LoginIMG1");

    vformData.append("loginIMG2.ImageFile", this.state.LoginIMG2);
    vformData.append("loginIMG2.ImageFileName", "LoginIMG2");

    vformData.append("loginIMG3.ImageFile", this.state.LoginIMG3);
    vformData.append("loginIMG3.ImageFileName", "LoginIMG3");

    vformData.append("loginIMG4.ImageFile", this.state.LoginIMG4);
    vformData.append("loginIMG4.ImageFileName", "LoginIMG4");
   
    
      Fn_AddEditData(
        this.obj,
        { arguList: { id: 0, formData: vformData } },
        this.API_URL_SAVE,
        this.pushFormName,
        true
      );




        this.setState({loading : false})








      // Fn_AddEditData(
      //   this.obj,
      //   { arguList: 
      //     { id: 0,
      //       LoginPageLine1: formData.LoginPageLine1 ,
      //       LoginPageLine2 : formData.LoginPageLine2 ,
      //       TimeGapForOTP : formData.TimeGapForOTP ,
      //       BalanceAddVoucherPattern : formData.BalanceAddVoucherPattern ,
      //       SenderDailyLimit : formData.SenderDailyLimit ,
      //       SenderMonthlyLimit : formData.SenderMonthlyLimit ,
      //       VerifyTransferAmount : formData.VerifyTransferAmount ,
      //       VerifyCharges : formData.VerifyCharges ,
      //       MinimumWalletBalance : formData.MinimumWalletBalance ,
      //       DefaultDMRBank : formData.DefaultDMRBank ,
      //       TDS : formData.TDS ,
      //       MobileNo : formData.MobileNo ,
      //       DMRIMPS : formData.DMRIMPS ,
      //       isAEPS : this.state.IsAEPS ? true : false,
      //       isDMR : this.state.IsDMR ? true : false,
      //       isRecharge : this.state.IsRecharge? true : false,
      //       isIndoNepal : this.state.IsIndoNepal ? true : false,
      //       isLoginIMG1 : this.state.LoginIMG1 == '' || this.state.LoginIMG1 == undefined ? false : true,
      //       isLoginIMG2 : this.state.LoginIMG2 == '' || this.state.LoginIMG2 == undefined ? false : true,
      //       isLoginIMG3 : this.state.LoginIMG3 == '' || this.state.LoginIMG3 == undefined ? false : true,
      //       isLoginIMG4 : this.state.LoginIMG4 == '' || this.state.LoginIMG4 == undefined ? false : true,
      //       loginIMG1 : {
      //         imageFileName : 'LoginIMG1',
      //         imageFile : this.state.LoginIMG1 == undefined ? '' : this.state.LoginIMG1 
      //       },
      //       loginIMG2 : {
      //         imageFileName : 'LoginIMG2',
      //         imageFile : this.state.LoginIMG2
      //       },
      //       loginIMG3 : {
      //         imageFileName : 'LoginIMG3',
      //         imageFile : this.state.LoginIMG3
      //       },
      //       loginIMG4 : {
      //         imageFileName : 'LoginIMG4',
      //         imageFile : this.state.LoginIMG4
      //       }

      //         } },
      //   this.API_URL_SAVE,
      //   this.pushFormName
      // );
  



  }


  backupdatabase  =  async ()=> {

    this.setState({loading : true})
    const makeAPICall = async () => {
      return API_HELPER.apiPOST(API_WEB_URLS.BASE + "BackupDatabase/0/token", null);
    };

    let userToken2 = await makeAPICall();

  

    if(userToken2.data.response[0].Id ==  1){
      this.setState({loading : false , success_msg2 : true, Name : userToken2.data.response[0].Name})
    }

    else {
      this.setState({loading : false , failed : true, Name : userToken2.data.response[0].Name})
    }
  

  }

  
syno () {
  this.setState({success_msg : false, success_msg2 : false, failed : false})
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
                                  <Col lg="6">
                                  <Card>
                                    <CardBody>
                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Login Page Line 1</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="LoginPageLine1" label="" value={this.state.formData.LoginPageLine1 === null ? ''   : this.state.formData.LoginPageLine1} placeholder="Enter LoginPageLine1"  validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Login Page Line2</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="LoginPageLine2" label="" value={this.state.formData.LoginPageLine2 === null ? ''   : this.state.formData.LoginPageLine2} placeholder="Enter LoginPageLine1" errorMessage="Enter " validate={{ required: { value: true } }}  type="text" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Dashboard Line</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="DashboardLine" label="" value={this.state.formData.DashboardLine === null ? ''   : this.state.formData.DashboardLine} placeholder="Enter DashboardLine" errorMessage="Enter " validate={{ required: { value: true } }}  type="text" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">MobileNo</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="MobileNo" label="" value={this.state.formData.MobileNo === null ? ''   : this.state.formData.MobileNo} placeholder="Enter MobileNo" errorMessage="Enter " validate={{ required: { value: true } }}  type="number" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Time Gap For OTP</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="TimeGapForOTP" label="" value={this.state.formData.TimeGapForOTP === null ? ''   : this.state.formData.TimeGapForOTP} placeholder="Enter TimeGapForOTP" errorMessage="Enter " validate={{ required: { value: true } }}  type="number" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Balance Add Voucher Pattern</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="BalanceAddVoucherPattern" label="" value={this.state.formData.BalanceAddVoucherPattern === null ? ''   : this.state.formData.BalanceAddVoucherPattern} placeholder="Enter BalanceAddVoucherPattern" errorMessage="Enter " validate={{ required: { value: true } }}  type="text" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Sender Daily Limit</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="SenderDailyLimit" label="" value={this.state.formData.SenderDailyLimit === null ? ''   : this.state.formData.SenderDailyLimit} placeholder="Enter SenderDailyLimit" errorMessage="Enter " validate={{ required: { value: true } }}  type="number" className="form-control" />
                                        </Col>
                                      </Row>

                                         <Row>
                                         <Col sm="4" className="mb-3">
                                           <label htmlFor="middleName" className="col-form-label">Account No Daily Limit</label>
                                         </Col>
                                         <Col sm="6">
                                           <AvField name="AccountNoLimit" label="" value={this.state.formData.AccountNoLimit === null ? ''   : this.state.formData.AccountNoLimit} placeholder="Enter AccountNoDailyLimit" errorMessage="Enter " validate={{ required: { value: true } }}  type="number" className="form-control" />
                                         </Col>
                                       </Row>
                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Sender Monthly Limit</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="SenderMonthlyLimit" label="" value={this.state.formData.SenderMonthlyLimit === null ? ''   : this.state.formData.SenderMonthlyLimit} placeholder="Enter SenderMonthlyLimit" errorMessage="Enter " validate={{ required: { value: true } }}  type="number" className="form-control" />
                                        </Col>
                                      </Row>

                                       <Row>
                                       <Col sm="4" className="mb-3">
                                         <label htmlFor="middleName" className="col-form-label">Account No Monthly Limit</label>
                                       </Col>
                                       <Col sm="6">
                                         <AvField name="MonthlyAccountNoLimit" label="" value={this.state.formData.MonthlyAccountNoLimit === null ? ''   : this.state.formData.MonthlyAccountNoLimit} placeholder="Enter MonthlyAccountNoLimit" errorMessage="Enter " validate={{ required: { value: true } }}  type="number" className="form-control" />
                                       </Col>
                                     </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">VerifyTransferAmount</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="VerifyTransferAmount" label="" value={this.state.formData.VerifyTransferAmount === null ? ''   : this.state.formData.VerifyTransferAmount} placeholder="Enter VerifyTransferAmount" errorMessage="Enter " validate={{ required: { value: true } }}  type="number" className="form-control" />
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">VerifyCharges</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="VerifyCharges" label="" value={this.state.formData.VerifyCharges === null ? ''   : this.state.formData.VerifyCharges} placeholder="Enter VerifyCharges" errorMessage="Enter " validate={{ required: { value: true } }}  type="number" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">MinimumWalletBalance</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="MinimumWalletBalance" label="" value={this.state.formData.MinimumWalletBalance === null ? ''   : this.state.formData.MinimumWalletBalance} placeholder="Enter MinimumWalletBalance" errorMessage="Enter " validate={{ required: { value: true } }}  type="number" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Universal OTP</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="UniversalOTP" label="" value={this.state.formData.UniversalOTP === null ? ''   : this.state.formData.UniversalOTP} placeholder="Enter UniversalOTP" errorMessage="Enter " validate={{ required: { value: true } }}  type="number" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Default NEFT DMRBank</label>
                                        </Col>
                                        <Col sm="6">
                                        <AvField  name="DefaultDMRBank" label="" value={this.state.formData.DefaultDMRBank === null ? '-1'   : this.state.formData.DefaultDMRBank}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.DMRBankList
                                              ? this.state.DMRBankList.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Default IMPS DMRBank</label>
                                        </Col>
                                        <Col sm="6">
                                        <AvField  name="DMRIMPS" label="" value={this.state.formData.DMRIMPS === null ? '-1'   : this.state.formData.DMRIMPS}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.DMRBankList
                                              ? this.state.DMRBankList.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">AEPS Bank Pipe</label>
                                        </Col>
                                        <Col sm="6">
                                        <AvField  name="AEPSBankPipi" label="" value={this.state.formData.AEPSBankPipi === null ? '-1'   : this.state.formData.AEPSBankPipi}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={1}  label={"Bank 2"} />
                                            <option value={2}  label={"Bank 3"} />
                                           
                                          </AvField> 
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">DMR</label>
                                        </Col>
                                        <Col sm="6">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-12 mb-3"
                            offColor ="#ec4561"
                            onColor="#00ff00"
                            onChange={() =>
                              this.setState({ IsDMR: !this.state.IsDMR })
                            }
                            checked={this.state.IsDMR}
                          />
                                        </Col>
                                      </Row>



                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">IndoNepal</label>
                                        </Col>
                                        <Col sm="6">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-12 mb-3"
                            offColor ="#ec4561"
                            onColor="#00ff00"
                            onChange={() =>
                              this.setState({ IsIndoNepal: !this.state.IsIndoNepal })
                            }
                            checked={this.state.IsIndoNepal}
                          />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">AEPS</label>
                                        </Col>
                                        <Col sm="6">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-12 mb-3"
                            offColor ="#ec4561"
                            onColor="#00ff00"
                            onChange={() =>
                              this.setState({ IsAEPS: !this.state.IsAEPS })
                            }
                            checked={this.state.IsAEPS}
                          />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Recharge</label>
                                        </Col>
                                        <Col sm="6">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-12 mb-3"
                            offColor ="#ec4561"
                            onColor="#00ff00"
                            onChange={() =>
                              this.setState({ IsRecharge: !this.state.IsRecharge })
                            }
                            checked={this.state.IsRecharge}
                          />
                                        </Col>
                                      </Row>

                                     

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">TDS</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="TDS" label="" value={this.state.formData.TDS === null ? ''   : this.state.formData.TDS} placeholder="Enter TDS" errorMessage="Enter " validate={{ required: { value: true } }}  type="number" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Loan Scheme</label>
                                        </Col>
                                        <Col sm="6">
                                        <AvField  name="LoanScheme" label="" value={this.state.formData.LoanScheme === null ? '-1'   : this.state.formData.LoanScheme}  type="select" className="form-select"  >
                                      <option value={-1} defaultValue label={"Select"} />
                                          {this.state.loanaccounttypescheme
                                            ? this.state.loanaccounttypescheme.map(
                                                (option, key) => (
                                                  <option defaultValue key={option.Id} value={option.Id} label={option.Name} />
                                                )
                                              )
                                            : null}
                                        </AvField> 
                                        </Col>
                                      </Row>

                                      <Row>
                        <Col sm="6" className="mb-3">
                        <AvField name="LoginIMG1" value='' label="LoginIMG1" placeholder="Upload File" errorMessage="Upload File"  onChange={(e) => Fn_ChangeStateValue(this.obj, 'LoginIMG1', e.target.files[0])} accept=".gif,.jpg,.jpeg,.png" type="file" className="form-control" />
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="6" className="mb-3">
                        <AvField name="LoginIMG2" value='' label="LoginIMG2" placeholder="Upload File" errorMessage="Upload File"  onChange={(e) => Fn_ChangeStateValue(this.obj, 'LoginIMG2', e.target.files[0])} accept=".gif,.jpg,.jpeg,.png" type="file" className="form-control" />
                        </Col>
                      </Row>


                      <Row>
                        <Col sm="6" className="mb-3">
                        <AvField name="LoginIMG3" value='' label="LoginIMG3" placeholder="Upload File" errorMessage="Upload File"  onChange={(e) => Fn_ChangeStateValue(this.obj, 'LoginIMG3', e.target.files[0])} accept=".gif,.jpg,.jpeg,.png" type="file" className="form-control" />
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="6" className="mb-3">
                        <AvField name="LoginIMG4" value='' label="LoginIMG4" placeholder="Upload File" errorMessage="Upload File"  onChange={(e) => Fn_ChangeStateValue(this.obj, 'LoginIMG4', e.target.files[0])} accept=".gif,.jpg,.jpeg,.png" type="file" className="form-control" />
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
                          Update
                        </Button>

                        <Button
                          type="button"
                          color="secondary"
                          className="waves-effect"
                          onClick={this.btnCancel_onClick}
                        >
                          Cancel
                        </Button>

                        <Button
                          type="button"
                          color="success"
                          className="mr-1 waves-effect waves-light"
                          onClick={this.backupdatabase}
                        >
                          Backup
                        </Button>


                        {this.state.success_msg ? (
                      <SweetAlert
                        title="Data updated Successfully!"
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        You clicked the button!
                      </SweetAlert>
                    ) : null}


{this.state.success_msg2 ? (
                      <SweetAlert
                        title="Backup Done!"
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                       {this.state.Name}
                      </SweetAlert>
                    ) : null}

{this.state.failed ? (
                      <SweetAlert
                        title="BackupFailed!"
                        danger
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        {this.state.Name}
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
export default compose(container)(pageAddEdit_GlobalOptions);
