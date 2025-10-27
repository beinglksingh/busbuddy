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





class pageAddEdit_AddBalance extends Component {
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
    this.formTitle = "Balance";
    this.breadCrumbTitle = "Balance";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.BALANCEADD + "/0/token";
    this.pushFormName = "/add-Balancedetails";
    this.rtPage_Redirect = "/add-Balancedetails";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/BalanceEdit";
    this.onUserTypeChange  =  this.onUserTypeChange.bind(this);
    this.getledger  = this.getledger.bind(this);
    this.syno  =  this.syno.bind(this);
    this.NonAdminUser  =  this.NonAdminUser.bind(this);
    this.handleSelectGroup  = this.handleSelectGroup.bind(this);
    
  }
  componentDidMount() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    Fn_CheckIsActive(this.obj, obj.uid);
    //Filing Dropdown

    if(obj.isAdmin == true){
    Fn_FillListData(this.obj, "usertype", API_WEB_URLS.MASTER + "/0/token/UserType/Id/0");
    Fn_FillListData(this.obj, "ledgergroupmaster", API_WEB_URLS.MASTER + "/0/token/LedgerGroupMaster/Id/0");
    }
    else {
      Fn_FillListData(this.obj, "balance", API_WEB_URLS.MASTER + "/0/token/CheckBalance/Id/"+obj.F_MemberMaster);
        this.NonAdminUser()
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





  getledger(event) {
    Fn_FillListData(this.obj, "ledgermaster", API_WEB_URLS.MASTER + "/0/token/LedgerMaster/F_LedgerGroupMaster/"+event.target.value);
  }


  onUserTypeChange  = (event)=> {
    //Retailer
    if (event.target.value == 4){
      Fn_FillListData(this.obj, "retailer", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/4");
      this.setState({ isRetailer: true });
    } 
    else {
      this.setState({ isRetailer: false });
    }
    //Distributor
    if (event.target.value == 3){
      Fn_FillListData(this.obj, "distributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/3");
      this.setState({ isDistributor: true });
    } 
    else {
      this.setState({ isDistributor: false });
    }
      //SuperDistributor
      if (event.target.value == 2){
        Fn_FillListData(this.obj, "superdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/2");
        this.setState({ isSDistributor: true });
      } 
      else {
        this.setState({ isSDistributor: false });
      }

      if (event.target.value == 1){
        Fn_FillListData(this.obj, "masterdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/1");
        this.setState({ isMDistributor: true });
      } 
      else {
        this.setState({ isMDistributor: false });
      }
    
  }








  NonAdminUser  () {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    console.log(obj.roleid);
    //Retailer
    if (obj.roleid == 3){
      Fn_FillListData(this.obj, "retailer", API_WEB_URLS.MASTER + "/0/token/MemberForBalanceAdd/F_Distributor/"+obj.F_MemberMaster);
      this.setState({ isRetailer: true });
    } 
    else {
      this.setState({ isRetailer: false });
    }
    //Distributor
    if (obj.roleid == 2){
      Fn_FillListData(this.obj, "distributor", API_WEB_URLS.MASTER + "/0/token/MemberForBalanceAdd/F_SDistributor/"+obj.F_MemberMaster);
      this.setState({ isDistributor: true });
    } 
    else {
      this.setState({ isDistributor: false });
    }
      //SuperDistributor
      if (obj.roleid == 1){
        Fn_FillListData(this.obj, "superdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForBalanceAdd/F_MDistributor/"+obj.F_MemberMaster);
        this.setState({ isSDistributor: true });
      } 
      else {
        this.setState({ isSDistributor: false });
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

if (obj.isAdmin == true){

   
  //Information
  vformData.append("F_LedgerMaster", formData.F_LedgerMaster);
  vformData.append("F_MemberMaster", this.state.F_MemberMaster);
  vformData.append("IsType", this.state.switch9 ? true : false );
  vformData.append("Amount", formData.Amount);
  vformData.append("VoucherDate", formData.VoucherDate+'T'+formData.VoucherTime);
  vformData.append("Remarks", formData.Remarks);
  vformData.append("UserId", obj.uid);
}
else {
  vformData.append("F_LedgerMaster", obj.F_LedgerMaster);
  vformData.append("F_MemberMaster", this.state.F_MemberMaster);
  vformData.append("IsType", this.state.switch9 ? true : false );
  vformData.append("Amount", formData.Amount);
  vformData.append("Remarks", formData.Remarks);
  vformData.append("UserId", obj.uid);

}
 

  if (!this.state.id)    {
    Fn_AddEditData(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, "#", true , "VoucherId");
  }

  else if (obj.isAdmin == true) {
    Fn_AddEditData(this.obj, { arguList: { id: this.state.id, formData: vformData } }, this.API_URL_SAVE, "#", true , "VoucherId" , "update_msg");
  }


  // this.setState({loading : false});
  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };


  handleSelectGroup = selectedGroup => {

    console.log(selectedGroup);
    this.setState({ selectedGroup , F_MemberMaster : selectedGroup.Id });

    Fn_FillListData(this.obj, "balance", API_WEB_URLS.MASTER + "/0/token/CheckBalance/Id/"+selectedGroup.Id);

  
  }




  render() {



    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    const {selectedGroup}  = this.state;
    
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
      CR
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
      DR
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
                                  <Col lg="8">
                                  <Card>
                                    <CardBody> 
                                      <Col sm="4" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label"> Available Balance : {this.state.balance[0].AvailableBalance}</label>
                                        </Col>
                                     
{obj.isAdmin == true ?
                                    <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Ledger Group</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField onChange={this.getledger} name="F_LedgerGroupMaster" label="" value={this.state.formData.F_LedgerGroupMaster === null ? '-1'   : this.state.formData.F_LedgerGroupMaster}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.ledgergroupmaster
                                              ? this.state.ledgergroupmaster.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">Select Ledger</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField  name="F_LedgerMaster" label="" value={this.state.formData.F_LedgerMaster === null ? '-1'   : this.state.formData.F_LedgerMaster}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.ledgermaster
                                              ? this.state.ledgermaster.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>
                                      </Row> : null}

                                   {obj.isAdmin == true ?   <Row>
                                      <Col sm="2" className="mb-3">
                                          <label htmlFor="maritalStatus" className="col-form-label">User Type</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="F_UserType" onChange={this.onUserTypeChange} label="" value={this.state.formData.F_UserType === null  ? '-1'   : this.state.formData.F_UserType}   type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.usertype
                                              ? this.state.usertype.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField>
                                        </Col> 
                                        </Row> : null}


                                        {
                                        this.state.isDistributor == true ? <Row>
                                          <Col sm="2" className="mb-3">
                                            <label htmlFor="maritalStatus" className="col-form-label">Select Distributor</label>
                                          </Col>
                                          <Col sm="4">

                                          <Select
                              value={selectedGroup}
                              onChange={this.handleSelectGroup}
                              options={this.state.distributor}
                              classNamePrefix="select2-selection"
                            />
                                            {/* <AvField name="F_MemberMaster"  label="" value={this.state.formData.F_MemberMaster === null ? '-1'   : this.state.formData.F_MemberMaster}  type="select" className="form-select" >
                                              <option value={-1} defaultValue label={"Select"} />
                                              {this.state.distributor
                                                ? this.state.distributor.map(
                                                    (option, key) => (
                                                      <option key={option.Id} value={option.Id} label={option.ShopName} />
                                                    )
                                                  )
                                                : null}
                                            </AvField> */}
                                          </Col> 
                                        </Row> : null
                                      }


{
                                        this.state.isSDistributor == true ? <Row>
                                          <Col sm="2" className="mb-3">
                                            <label htmlFor="maritalStatus" className="col-form-label">Select Super Distributor</label>
                                          </Col>
                                          <Col sm="4">
                                          <Select
                              value={selectedGroup}
                              onChange={this.handleSelectGroup}
                              options={this.state.superdistributor}
                              classNamePrefix="select2-selection"
                            />
                                            {/* <AvField name="F_MemberMaster"  label="" value={this.state.formData.F_MemberMaster === null ? '-1'   : this.state.formData.F_MemberMaster}  type="select" className="form-select" >
                                              <option value={-1} defaultValue label={"Select"} />
                                              {this.state.superdistributor
                                                ? this.state.superdistributor.map(
                                                    (option, key) => (
                                                      <option key={option.Id} value={option.Id} label={option.ShopName} />
                                                    )
                                                  )
                                                : null}
                                            </AvField> */}
                                          </Col> 
                                        </Row> : null
                                      }
  {
                                        this.state.isMDistributor == true ? <Row>
                                          <Col sm="2" className="mb-3">
                                            <label htmlFor="maritalStatus" className="col-form-label">Select Master Distributor</label>
                                          </Col>
                                          <Col sm="4">

                                          <Select
                              value={selectedGroup}
                              onChange={this.handleSelectGroup}
                              options={this.state.masterdistributor}
                              classNamePrefix="select2-selection"
                            />
                                            {/* <AvField name="F_MemberMaster"  label="" value={this.state.formData.F_MemberMaster === null ? '-1'   : this.state.formData.F_MemberMaster}  type="select" className="form-select" >
                                              <option value={-1} defaultValue label={"Select"} />
                                              {this.state.masterdistributor
                                                ? this.state.masterdistributor.map(
                                                    (option, key) => (
                                                      <option key={option.Id} value={option.Id} label={option.ShopName} />
                                                    )
                                                  )
                                                : null}
                                            </AvField> */}
                                          </Col> 
                                        </Row> : null
                                      }

{
                                        this.state.isRetailer == true ? <Row>
                                          <Col sm="2" className="mb-3">
                                            <label htmlFor="maritalStatus" className="col-form-label">Select Retailer</label>
                                          </Col>
                                          <Col sm="4">

                                          <Select
                              value={selectedGroup}
                              onChange={this.handleSelectGroup}
                              options={this.state.retailer}
                              classNamePrefix="select2-selection"
                            />
                                            {/* <AvField name="F_MemberMaster"  label="" value={this.state.formData.F_MemberMaster === null ? '-1'   : this.state.formData.F_MemberMaster}  type="select" className="form-select" >
                                              <option value={-1} defaultValue label={"Select"} />
                                              {this.state.retailer
                                                ? this.state.retailer.map(
                                                    (option, key) => (
                                                      <option key={option.Id} value={option.Id} label={option.ShopName} />
                                                    )
                                                  )
                                                : null}
                                            </AvField> */}
                                          </Col> 
                                        </Row> : null
                                      }





                                     
             <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Tran Type</label>
                                        </Col>
                                        <Col sm="2">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-8 mb-2"
                            onColor="#ec4561"
                            offColor="#00ff00"
                            onChange={() =>
                              this.setState({ switch9: !this.state.switch9 })
                            }
                            checked={this.state.switch9}
                          />
                                        </Col>

                                        {obj.isAdmin ?
                                        <>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="lastName" className="col-form-label">VoucherDate</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="VoucherDate" label="" value={this.state.formData.VoucherDate  == undefined ? getCurrentDate() : this.state.formData.VoucherDate} placeholder="VoucherDate" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
                                        </Col>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="lastName" className="col-form-label">Time</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="VoucherTime" label="" value={this.state.formData.VoucherTime  == undefined ? this.state.Time : this.state.formData.VoucherTime} placeholder="VoucherTime" errorMessage="Select VoucherTime " validate={{ required: { value: true } }} type="time"  className="form-control" />
                                        </Col>

                                        </>
                                         : null}
                                      </Row> 
                                      

                                      <Row>
                                        <Col sm="2">
                                          <label htmlFor="dateOfJoining" className="col-form-label">Amount</label>
                                        </Col>
                                        <Col sm="4" className="mb-0">
                                          <AvField name="Amount" label="" value={this.state.formData.Amount === null ? 0   : this.state.formData.Amount} placeholder="Enter Amount" required='true'  type="number"  className="form-control" />
                                        </Col>  
                                      </Row>


                                      <Row>
                                        <Col sm="2">
                                          <label htmlFor="dateOfJoining" className="col-form-label">Remarks</label>
                                        </Col>
                                        <Col sm="6" className="mb-0">
                                          <AvField name="Remarks" label="" value={this.state.formData.Remarks === null ? ''   : this.state.formData.Remarks} placeholder="Enter Remarks"   type="text"  className="form-control" />
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
                          {this.state.switch9 ? 'Debit' : 'Credit'}
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
export default compose(container)(pageAddEdit_AddBalance);
