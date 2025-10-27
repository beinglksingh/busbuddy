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
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_CheckIsActive, Fn_GetReport, Fn_ChangeStateValue } from "../../store/functions";
import  Switch  from "react-switch";
import Select from 'react-select';
import Loader from "pages/loader";
import { callGet_Data } from "store/common-actions";
import { API_HELPER } from "helpers/ApiHelper";




function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getEMIDate(Periodicity, tenure) {


  if (Periodicity  ==  1){
    

    const date  = new Date(getCurrentDate());
    
  return  date.setDate(date.getDate() + 1);
  }
  else {
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1; // Month is 0-indexed, so add 1
  let day = currentDate.getDate();

  if (day > 5) {
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  // Set the day to the 5th
  day = '05';

  // Convert month to 2-digit format
  month = String(month).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
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





class pageAddEdit_LoanEMI extends Component {
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
      accounttypeschemeinterest : [{}],
      Time : getCurrentTime(),
      balance : [{
        AvailableBalance : 0
      }],
      ReBalance : 0,
      failed : false,
      loading : false,
      DefaultScheme : [{}],
      GetDues : [{}]
    };
    this.obj = this;
    this.formTitle = "Loan EMI";
    this.breadCrumbTitle = "Loan EMI";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE =  "PayLoanEMI/0/token";
    this.pushFormName = "/loanreport";
    this.rtPage_Redirect = "/loanreport";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/BalanceEdit";
    this.syno  =  this.syno.bind(this);
    this.searchmember  = this.searchmember.bind(this);
    this.getdues  = this.getdues.bind(this);
   this.PenaltyDiscount  =  this.PenaltyDiscount.bind(this);
   
  }
  componentDidMount() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    Fn_CheckIsActive(this.obj, obj.uid);
    //Filing Dropdown
 
      Fn_FillListData(this.obj, "bankledgerlist", API_WEB_URLS.MASTER + "/0/token/LedgerBank/F_LedgerGroupMaster/12");

    const { id } = this.props.match.params;

    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Pay " + this.formTitle;
      let vformData = new FormData();
      vformData.append("F_MemberAccountMaster", id);
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, "GetDues/0/token", "GetDues", true);

      //Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
  }






  searchmember (event) {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    vformData.append("Search", event.target.value);
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, "SearchLoanAccount/0/token", "memberlist", true);
  }






  
  syno () {
    this.setState({success_msg : false ,update_msg : false, failed : false})
  
    this.props.history.push(`${this.rtPage_Redirect}`, {});
  }


  btnSave_onClick(event, formData) {
    this.setState({loading : true});

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
   
    let vformData = new FormData();
  vformData.append("Amount", this.state.GetDues[0].DueAmount);
  vformData.append("F_MemberAccountMaster", this.state.id> 0 ? this.state.id : formData.F_MemberAccountMaster );
  vformData.append("Mode", formData.Mode);
  vformData.append("PenaltyAmount", this.state.GetDues[0].PenaltyAmount);
  vformData.append("PenaltyDiscount", this.state.PenaltyDiscount);
  vformData.append("BankLedger", this.state.Mode == 2 && obj.isAdmin ? this.state.BankLedger : 0);
  
 

 

    Fn_AddEditData(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, "#", true , "");
  




  // this.setState({loading : false});
  }


  getdues(e){
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    vformData.append("F_MemberAccountMaster", e);
  Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, "GetDues/0/token", "GetDues", true);

  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };



PenaltyDiscount(e){
  let amount  =  e.target.value;
  if (amount>this.state.GetDues[0].PenaltyAmount){
    alert('Penalty Discount cant be greater than penalty');
  }
  else {
    this.setState({PenaltyDiscount : amount})
  }

}



  render() {



    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    console.log(obj.isAdmin)

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
                                  <Col lg="12">
                                  <Card>
                                    <CardBody> 
           
                                     
                                     



                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Search</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="Search" label="" value={this.state.Search === null ? ''   : this.state.Search} onChange={this.searchmember} placeholder="Enter Search" errorMessage="Enter " disabled={this.state.id ? true : false}  type="text" className="form-control" />
                                        </Col>


                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label"> Loan Account</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField  name="F_MemberAccountMaster" label="" value={this.state.formData.F_MemberAccountMaster === null ? '-1'   : this.state.formData.F_MemberAccountMaster} disabled={this.state.id ? true : false} onChange={(e)=>this.getdues(e.target.value)} type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.memberlist
                                              ? this.state.memberlist.map(
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
                                          <label htmlFor="middleName" className="col-form-label">DUE Amount</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="DueAmount" label="" value={this.state.GetDues[0].DueAmount === null ? ''   : this.state.GetDues[0].DueAmount}   placeholder="Enter DueAmount" errorMessage="Enter " validate={{ required: { value: true } }} disabled type="numeric" className="form-control" />
                                        </Col>


                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Penalty Amount</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="PenaltyAmount" label="" value={this.state.GetDues[0].PenaltyAmount === null ? ''   : this.state.GetDues[0].PenaltyAmount}   placeholder="Enter DueAmount" errorMessage="Enter " validate={{ required: { value: true } }} disabled type="numeric" className="form-control" />
                                        </Col>


                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Total Due</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="TotalDue" label="" value={this.state.GetDues[0].TotalDue === null ? ''   : this.state.GetDues[0].TotalDue}   placeholder="Enter TotalDue" errorMessage="Enter " validate={{ required: { value: true } }} disabled type="numeric" className="form-control" />
                                        </Col>
                                                                           
                                      </Row>



                                      <Row>

                                        
                                      <Col sm="2" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">EMI</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="EMIAmount" label="" value={this.state.GetDues[0].EMIAmount === null ? ''   : this.state.GetDues[0].EMIAmount}   placeholder="Enter EMIAmount" errorMessage="Enter " validate={{ required: { value: true } }} disabled type="numeric" className="form-control" />
                                        </Col>



                                         <Col sm="2" className="mb-3">
                                         <label htmlFor="middleName" className="col-form-label">Penalty Discount</label>
                                       </Col>
                                       <Col sm="2">
                                       <AvField name="PenaltyDiscount" label="" value={this.state.PenaltyDiscount} onChange={this.PenaltyDiscount}   placeholder="Enter Amount"  type="numeric" className="form-control" />
                                       </Col>

                                        <Col sm="1" className="mb-3">
                                        <label htmlFor="firstName" className="col-form-label">Mode</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField  name="Mode" label="" value={this.state.Mode} onChange={(e)=> this.setState({Mode : e.target.value})} type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={1}  label={"Cash"} />
                                            <option value={2}  label={"Bank"} />
                                          </AvField> 




                                        </Col>

                                                                               </Row>

                                                                               <Row>
                                                                               {this.state.Mode == 2 && obj.isAdmin ? 
                                        <>
                                         <Col sm="1" className="mb-3">
                                         <label htmlFor="firstName" className="col-form-label">Bank </label>
                                         </Col>
                                         <Col sm="2">
                                         <AvField  name="BankLedger" label="" value={this.state.BankLedger} onChange={(e)=> this.setState({BankLedger : e.target.value})} type="select" className="form-select" >
                                         <option value={-1} defaultValue label={"Select"} />
                                            {this.state.bankledgerlist
                                              ? this.state.bankledgerlist.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                           </AvField> 
                                         </Col>
                                         </> : null
                                      
                                      }


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
                          Pay
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
                        EMI PAID
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
export default compose(container)(pageAddEdit_LoanEMI);
