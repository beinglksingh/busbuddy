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
  TabPane,
  Modal
} from "reactstrap";

import classnames from "classnames";
import SweetAlert from "react-bootstrap-sweetalert"


// availity-reactstrap-validation
import {
  AvForm,
  AvField, AvRadioGroup, AvRadio
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
import Switch from "react-switch";
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


  if (Periodicity == 1) {


    const date = new Date(getCurrentDate());

    return date.setDate(date.getDate() + 1);
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




export const DateString = (dd) => {

  let d1 = dd.replace('-', '');
  let d2 = d1.replace('-', '');

  return d2;

}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}





class pageAddEdit_LoanMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      isMDistributor: false,
      isSDistributor: false,
      isDistributor: false,
      isRetailer: false,
      switch9: false,
      success_msg: false,
      confirm_alert: false,
      accounttypeschemeinterest: [{}],
      Time: getCurrentTime(),
      balance: [{
        AvailableBalance: 0
      }],
      ReBalance: 0,
      failed: false,
      loading: false,
      DefaultScheme: [{}],
      Amortization: [{}]
    };
    this.obj = this;
    this.formTitle = "Loan Master";
    this.breadCrumbTitle = "Loan Master";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE = "AddLoanMaster/0/token";
    this.pushFormName = "/loanreport";
    this.rtPage_Redirect = "/loanreport";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/BalanceEdit";
    this.syno = this.syno.bind(this);
    this.searchmember = this.searchmember.bind(this);
    this.getinterest = this.getinterest.bind(this);
    this.handleCalculate = this.handleCalculate.bind(this);
    this.getMaturityDate = this.getMaturityDate.bind(this);
    this.onChageEMI = this.onChageEMI.bind(this);
  }
  componentDidMount() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    Fn_CheckIsActive(this.obj, obj.uid);
    //Filing Dropdown


    Fn_FillListData(this.obj, "accounttypescheme", API_WEB_URLS.MASTER + "/0/token/AccountTypeSchemes/Id/6");
    Fn_FillListData(this.obj, "bankledgerlist", API_WEB_URLS.MASTER + "/0/token/LedgerBank/F_LedgerGroupMaster/12");
    if (!obj.isAdmin) {
      Fn_FillListData(this.obj, "DefaultScheme", API_WEB_URLS.MASTER + "/0/token/DefaultLoan/Id/0");
    }


    const { id } = this.props.match.params;

    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
  }



  getinterest(value) {
    this.setState({ F_AccountTypeScheme: value });

    Fn_FillListData(this.obj, "accounttypeschemeinterest", API_WEB_URLS.MASTER + "/0/token/GetAccountTypeSchemesInterest/Id/" + value);


  }
  getMaturityDate(tenure) {


    let Periodicity = this.state.accounttypeschemeinterest[0].InterestPeriodType;

    const date = new Date(getEMIDate(Periodicity, tenure));


    let year = date.getFullYear();
    let month = date.getMonth() + 1; // Month is 0-indexed, so add 1
    let day = date.getDate();
    month = String(month).padStart(2, '0');
    this.setState({ FirstEMIDate: `${year}-${month}-${day}` })

    if (Periodicity == 1) {
      date.setDate(date.getDate() + Number(tenure));
    }
    else if (Periodicity == 2) {
      date.setDate(date.getDate() + (Number(tenure) * 7));
    }
    else if (Periodicity == 3) {
      date.setMonth(date.getMonth() + Number(tenure));
    }

    const newDate = date;

    this.setState({ MaturityDate: newDate.toISOString().split('T')[0] });
  }



  onChageEMI(DateValue) {


    let Periodicity = this.state.accounttypeschemeinterest[0].InterestPeriodType;
    let tenure = this.state.Tenure;

    const date = new Date(DateValue)

    if (Periodicity == 1) {
      date.setDate(date.getDate() + Number(tenure));
    }
    else if (Periodicity == 2) {
      date.setDate(date.getDate() + (Number(tenure) * 7));
    }
    else if (Periodicity == 3) {
      date.setMonth(date.getMonth() + Number(tenure));
    }

    const newDate = date;

    this.setState({ MaturityDate: newDate.toISOString().split('T')[0] });
  }






  searchmember(event) {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    vformData.append("Search", event.target.value);
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, "SearchMember/0/token", "memberlist", true);
  }







  syno() {
    this.setState({ success_msg: false, update_msg: false, failed: false })

    this.props.history.push(`${this.rtPage_Redirect}`, {});
  }



  getAmortization() {

  }


  btnSave_onClick(event, formData) {
    this.setState({ loading: true });

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    var Days = 0;
    var Months = 0;
    var Weeks = 0;

    if (formData.Periodicity == 1) {
      Days = this.state.Tenure;
    }
    else if (formData.Periodicity == 2) {
      Weeks = this.state.Tenure;
    }
    else if (formData.Periodicity == 3) {
      Months = this.state.Tenure;
    }


    let vformData = new FormData();
    vformData.append("F_AccountTypeSchemes", !obj.isAdmin ? this.state.DefaultScheme[0].LoanScheme : formData.F_AccountTypeSchemes);
    vformData.append("F_MemberMaster", !obj.isAdmin ? obj.F_MemberMaster : formData.F_MemberMaster);
    vformData.append("Amount", formData.LoanAmount);
    vformData.append("MaturityDate", formData.MaturityDate);
    vformData.append("OpeningDate", formData.OpeningDate);
    vformData.append("UserId", obj.uid);
    vformData.append("LoanEMIAmount", this.state.LoanEMIAmount);
    vformData.append("FirstEMIDate", getEMIDate());
    vformData.append("MainInterest", this.state.accounttypeschemeinterest[0].MainInterest);
    vformData.append("PaneltyInterest", this.state.accounttypeschemeinterest[0].PaneltyInterest);
    vformData.append("Months", Months);
    vformData.append("Days", Days);
    vformData.append("Weeks", Weeks);
    vformData.append("Periodicity", formData.Periodicity);
    vformData.append("DueDate", getEMIDate());
    vformData.append("ProcessingCharges", formData.ProcessingCharges);
    vformData.append("Maturityamount", formData.Maturityamount);
    vformData.append("Mode", this.state.Mode);
    vformData.append("BankLedger", this.state.Mode == 2 && obj.isAdmin ? this.state.BankLedger : 0);



    if (!this.state.id) {
      Fn_AddEditData(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, "#", true, "");
    }




    // this.setState({loading : false});
  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };



  calculateEMIAndRepaymentAmount = (loanAmount, tenure, periodicity, rateOfInterest) => {
    let periodicRate;
    let numberOfPayments;

    // Determine the periodic rate and number of payments based on periodicity
    switch (periodicity.toLowerCase()) {
      case 'month':
        periodicRate = rateOfInterest / 100; // The rate is already for one month
        numberOfPayments = tenure; // Tenure is directly in months
        break;
      case 'week':
        periodicRate = rateOfInterest / 100; // The rate is already for one week
        numberOfPayments = tenure; // Tenure is directly in weeks
        break;
      case 'day':
        periodicRate = rateOfInterest / 100; // The rate is already for one day
        numberOfPayments = tenure; // Tenure is directly in days
        break;
      default:
        throw new Error("Invalid periodicity. Choose 'month', 'week', or 'day'.");
    }

    // Calculate EMI using the formula
    const numerator = loanAmount * periodicRate * Math.pow(1 + periodicRate, numberOfPayments);
    const denominator = Math.pow(1 + periodicRate, numberOfPayments) - 1;
    const EMI = numerator / denominator;

    // Calculate the total repayment amount
    const totalRepaymentAmount = EMI * numberOfPayments;

    // Round the EMI and total repayment amount to the next possible whole number
    const roundedEMI = Math.ceil(EMI);
    const roundedTotalRepaymentAmount = Math.ceil(totalRepaymentAmount);

    return {
      EMI: roundedEMI,
      totalRepaymentAmount: roundedTotalRepaymentAmount
    };
  }

  handleCalculate = async (LoanAmount) => {
    const principal = parseFloat(LoanAmount);
    const rate = parseFloat(this.state.accounttypeschemeinterest[0].MainInterest);
    const tenureValue = parseFloat(this.state.Tenure);
    let Periodicity = this.state.accounttypeschemeinterest[0].InterestPeriodType;
    const obj = JSON.parse(sessionStorage.getItem("authUser"));



    if (isNaN(principal) || isNaN(rate) || isNaN(tenureValue)) {
      alert('Please enter valid details');
      return;
    }

    try {
      let vformData = new FormData();
      vformData.append("LoanAmount", LoanAmount);
      vformData.append("InterestRate", rate);
      vformData.append("LoanPeriod", tenureValue);
      vformData.append("StartPaymentDate", getEMIDate());
      vformData.append("Periodicity", Periodicity);
      vformData.append("F_AccountTypeScheme", !obj.isAdmin ? this.state.DefaultScheme[0].LoanScheme : this.state.F_AccountTypeScheme);

      // Define an async function to make the API call
      const makeAPICall = async () => {
        return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE + "GetEMICalculation/0/token", vformData);
      };

      let userToken2 = await makeAPICall();
      console.log(userToken2.data);

      this.setState({
        LoanEMIAmount: userToken2.data.response[0].PAYMENT,
        Maturityamount: userToken2.data.response[0].MaturityAmount,
        LoanAmount: LoanAmount
      });

      const makeAPICall2 = async () => {
        vformData.append("InterestType", 1);
        return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE + "GetLoanAmortization/0/token", vformData);
      };

      let userToken = await makeAPICall2();
      this.setState({ Amortization: userToken.data.response });
      console.log(userToken.data);

    } catch (error) {
      alert(error.message);
    }
  };





  render() {



    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    const { selectedGroup } = this.state;

    const { Amortization, amortizationmodal } = this.state;



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
                                      <label htmlFor="age" className="col-form-label">Account Type Scheme</label>
                                    </Col>
                                    <Col sm="4">
                                      <AvField name="F_AccountTypeSchemes" label="" value={!obj.isAdmin ? this.state.DefaultScheme[0].LoanScheme : this.state.formData.F_AccountTypeSchemes === null ? '-1' : this.state.formData.F_AccountTypeSchemes} onChange={(e) => this.getinterest(e.target.value)} disabled={!obj.isAdmin} type="select" className="form-select"  >
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

                                    <Col sm="2" className="mb-3">
                                      <label htmlFor="middleName" className="col-form-label">Opening Date</label>
                                    </Col>
                                    <Col sm="4">
                                      <AvField name="OpeningDate" label="" value={this.state.OpeningDate === null ? getCurrentDate() : getCurrentDate()} placeholder="Enter OpeningDate" errorMessage="Enter " validate={{ required: { value: true } }} disabled={!obj.isAdmin} type="date" className="form-control" />
                                    </Col>
                                  </Row>


                                  {!obj.isAdmin ? null :

                                    <Row>
                                      <Col sm="2" className="mb-3">
                                        <label htmlFor="firstName" className="col-form-label">Search</label>
                                      </Col>
                                      <Col sm="4">
                                        <AvField name="Search" label="" value={this.state.Search === null ? '' : this.state.Search} onChange={this.searchmember} placeholder="Enter Search" errorMessage="Enter " validate={{ required: { value: true } }} type="text" className="form-control" />
                                      </Col>


                                      <Col sm="2" className="mb-3">
                                        <label htmlFor="middleName" className="col-form-label"> Member</label>
                                      </Col>
                                      <Col sm="4">
                                        <AvField name="F_MemberMaster" label="" value={this.state.formData.F_MemberMaster === null ? '-1' : this.state.formData.F_MemberMaster} type="select" className="form-select" >
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
                                    </Row>}

                                  <Row>
                                    <Col sm="2" className="mb-3">
                                      <label htmlFor="middleName" className="col-form-label">Periodicity</label>
                                    </Col>
                                    <Col sm="3">
                                      <AvField name="Periodicity" label="" value={this.state.accounttypeschemeinterest[0].InterestPeriodType} disabled type="select" className="form-select" >
                                        <option value={-1} defaultValue label={"Select"} />
                                        <option value={1} label={"Daily"} />
                                        <option value={2} label={"Weekly"} />
                                        <option value={3} label={"Monthly"} />
                                      </AvField>
                                    </Col>

                                    <Col sm="1" className="mb-3">
                                      <label htmlFor="firstName" className="col-form-label">Tenure</label>
                                    </Col>
                                    <Col sm="2">
                                      <AvField name="Tenure" label="" value={this.state.Tenure === null ? '' : this.state.Tenure} onChange={(e) => {
                                        Fn_ChangeStateValue(this.obj, "Tenure", e.target.value);
                                        this.getMaturityDate(e.target.value); // Call your second function here
                                      }} placeholder="Enter Tenure" errorMessage="Enter " validate={{ required: { value: true } }} type="text" className="form-control" />
                                    </Col>

                                  </Row>


                                  <Row>
                                    <Col sm="2" className="mb-3">
                                      <label htmlFor="middleName" className="col-form-label">Loan Amount</label>
                                    </Col>
                                    <Col sm="3">
                                      <AvField name="LoanAmount" label="" value={this.state.LoanAmount === null ? '' : this.state.LoanAmount} onChange={(e) => this.handleCalculate(e.target.value)} placeholder="Enter LoanAmount" errorMessage="Enter " validate={{ required: { value: true } }} type="numeric" className="form-control" />
                                    </Col>

                                    <Col sm="1" className="mb-3">
                                      <label htmlFor="firstName" className="col-form-label">M. Interest</label>
                                    </Col>
                                    <Col sm="2">
                                      <AvField name="MainInterest" label="" value={this.state.accounttypeschemeinterest[0].MainInterest === null ? '' : this.state.accounttypeschemeinterest[0].MainInterest + '%'} disabled placeholder="MainInterest" type="text" className="form-control" />
                                    </Col>

                                    <Col sm="1" className="mb-3">
                                      <label htmlFor="firstName" className="col-form-label">P. Interest</label>
                                    </Col>
                                    <Col sm="2">
                                      <AvField name="PenaltyInterest" label="" value={this.state.accounttypeschemeinterest[0].PaneltyInterest === null ? '' : this.state.accounttypeschemeinterest[0].PaneltyInterest + '%'} placeholder="PenaltyInterest" disabled type="text" className="form-control" />
                                    </Col>

                                  </Row>



                                  <Row>
                                    <Col sm="2" className="mb-3">
                                      <label htmlFor="middleName" className="col-form-label">Repayment Amount</label>
                                    </Col>
                                    <Col sm="3">
                                      <AvField name="Maturityamount" label="" value={this.state.Maturityamount === null ? '' : this.state.Maturityamount} placeholder="Enter Maturityamount" disabled type="numeric" className="form-control" />
                                    </Col>

                                    <Col sm="1" className="mb-3">
                                      <label htmlFor="firstName" className="col-form-label">EMI Amount</label>
                                    </Col>
                                    <Col sm="2">
                                      <AvField name="LoanEMIAmount" label="" value={this.state.LoanEMIAmount === null ? '' : this.state.LoanEMIAmount} disabled placeholder="LoanEMIAmount" type="text" className="form-control" />
                                    </Col>

                                    <Col sm="1" className="mb-3">
                                      <label htmlFor="firstName" className="col-form-label">EMI Date</label>
                                    </Col>
                                    <Col sm="2">
                                      <AvField name="FirstEMIDate" label="" value={this.state.FirstEMIDate} onChange={(e) => this.onChageEMI(e.target.value)} placeholder="FirstEMIDate" type="date" className="form-control" />
                                    </Col>

                                  </Row>




                                  <Row>

                                    <Col sm="2" className="mb-3">
                                      <label htmlFor="firstName" className="col-form-label">Maturity Date</label>
                                    </Col>
                                    <Col sm="3">
                                      <AvField name="MaturityDate" label="" value={this.state.MaturityDate === null ? '' : this.state.MaturityDate} disabled placeholder="MaturityDate" type="date" className="form-control" />
                                    </Col>
                                    <Col sm="1" className="mb-3">
                                      <label htmlFor="middleName" className="col-form-label">Proc. Charge</label>
                                    </Col>
                                    <Col sm="2">
                                      <AvField name="ProcessingCharges" label="" value={this.state.accounttypeschemeinterest[0].ProcessingCharges} disabled placeholder="ProcessingCharges" type="text" className="form-control" />
                                    </Col>





                                    <Col sm="1" className="mb-3">
                                      <label htmlFor="firstName" className="col-form-label">Mode</label>
                                    </Col>
                                    <Col sm="2">
                                      <AvField name="Mode" label="" value={this.state.Mode} onChange={(e) => this.setState({ Mode: e.target.value })} type="select" className="form-select" >
                                        <option value={-1} defaultValue label={"Select"} />
                                        <option value={1} label={"Cash"} />
                                        <option value={2} label={"Bank"} />
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
                                          <AvField name="BankLedger" label="" value={this.state.BankLedger} onChange={(e) => this.setState({ BankLedger: e.target.value })} type="select" className="form-select" >
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




                          <Modal
                            isOpen={amortizationmodal}
                            toggle={() => this.setState({ amortizationmodal: false })}
                            scrollable={true}
                            backdrop={'static'}
                            id="staticBackdrop2"
                            className="modal-fullscreen"
                          >
                            <div className="modal-header">
                              <h5 className="modal-title">Salary Class</h5>
                              <button type="button" className="btn-close" onClick={() =>
                                this.setState({ amortizationmodal: false })
                              } aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                              <Row>
                                <Col lg={12}>
                                  <Card>
                                    <CardBody>
                                      <CardTitle className="h4">Loan Amortization Schedule</CardTitle>

                                      <div className="table-responsive">
                                        <table className="table mb-0">
                                          <thead>
                                            <tr>
                                              <th>Period</th>
                                              <th>EMI Date</th>
                                              <th>EMI</th>
                                              <th>Interest</th>
                                              <th>Amount</th>


                                            </tr>
                                          </thead>
                                          <tbody>
                                            {Amortization.map((item, index) => (
                                              <tr key={index} className={index % 2 === 0 ? 'table-light' : 'table-success'}>
                                                <td>{item.PERIOD}</td>
                                                <td>{item.PAYDATE}</td>
                                                <td>{item.PAYMENT}</td>
                                                <td>{item.INTEREST}</td>
                                                <td>{item.CURRENT_BALANCE}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </CardBody>
                                  </Card>
                                </Col>
                              </Row>




                            </div>
                            <div className="modal-footer"></div>
                          </Modal>

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

                            {this.state.LoanAmount > 0 ?
                              <Button
                                type="button"
                                color="info"
                                onClick={() => this.setState({ amortizationmodal: true })}
                                className="mr-1 waves-effect waves-light"
                              >
                                Amortization
                              </Button> : null}

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
export default compose(container)(pageAddEdit_LoanMaster);
