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
  UncontrolledTooltip
} from "reactstrap";
import Switch from "react-switch"
import classnames from "classnames";
import SweetAlert from "react-bootstrap-sweetalert"
import Select from "react-select";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
// Redux
import { withRouter, Link } from "react-router-dom";


// Editable
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory from "react-bootstrap-table2-editor"
// availity-reactstrap-validation
import {
  AvForm,
  AvField,AvRadioGroup,AvRadio
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_ChangeStateValue, Fn_DeleteData, Fn_GetReport } from "../../store/functions";
import AddDeleteTableRowsPly from "pages/Transaction/AddDeleteTableRowPly";


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

class pageAddEdit_Voucher  extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
       activeTab: 1,
       passedSteps: [1],
       VoucherNo : [{}],
       Time : getCurrentTime(),
     
      save : false , cancel:false , add:true,
     
      //dropdowns
      
     
      VoucherL: [{
        F_LedgerMasterCr:'',
        F_LedgerMasterDr : '',
        Amount : ''
      }],
      F_VoucherH : 0,
      confirm_alert : false
    };
    this.obj = this;
    this.formTitle = "Manage Voucher";
    this.breadCrumbTitle = "Vouchers";
    this.breadCrumbItem = " " + this.formTitle;
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/City";
    this.API_URL_SAVE = API_WEB_URLS.AddEdit + "/0/token";
    this.pushFormName = "/voucherslist";
    this.rtPage_Print = "/#";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.btnGoBack_onClick = this.btnGoBack_onClick.bind(this);
    this.addrow = this.addrow.bind(this);
    this.editrow   = this.editrow.bind(this);
    this.deleterow  =  this.deleterow.bind(this);
    this.onVoucherNoChange  =  this.onVoucherNoChange.bind(this);
    this.OnVoucherChange  =  this.OnVoucherChange.bind(this);
    this.btnDelete  =  this.btnDelete.bind(this);
    this.OnVoucherTypeChange =  this.OnVoucherTypeChange.bind(this);
  }

  btnDelete () {
    Fn_DeleteData(this.obj , this.state.id, API_WEB_URLS.MASTER + "/0/token/Vouchers", "");
    // Fn_GetReport(this.obj, { arguList: { id: 0 } }, "SearchVoucher/0/token", "vouchers", true);
    this.props.history.push(this.pushFormName);
  }

  componentDidMount() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    this.setState({ name: obj.username, email: obj.email, aid: obj.uid , role:obj.role });
       

       Fn_FillListData(this.obj, "Ledger", API_WEB_URLS.MASTER + "/0/token/LedgerMaster/Id/0");
       Fn_FillListData(this.obj, "vouchertype", API_WEB_URLS.MASTER + "/0/token/VoucherType/Id/0");

       Fn_GetReport(this.obj, { arguList: { id: 0 } }, "SearchVoucher/0/token", "vouchers", true);



    const { id } = this.props.match.params;
    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
    Fn_DisplayData(this.obj, id, API_WEB_URLS.MASTER + "/0/token/GetVoucherHDetails" + "/Id");

     // Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }   
  }


  onVoucherNoChange (event) {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    vformData.append("Search", event.target.value);
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, "SearchVoucher/0/token", "vouchers", true);

  }

  OnVoucherChange (event) {

    this.setState({F_VoucherH : event.target.value});
    Fn_DisplayData(this.obj, event.target.value, API_WEB_URLS.MASTER + "/0/token/GetVoucherHDetails" + "/Id");
   


  }

  OnVoucherTypeChange (event) {

    
    
    Fn_FillListData(this.obj, "VoucherNo", API_WEB_URLS.MASTER + "/0/token/VoucherNo/Id/"+event.target.value);


  }

btnSave_onClick(event, formData) {


  
  let vformData1 = new FormData();
  vformData1.append("F_VoucherTypeMaster", formData.F_VoucherTypeMaster);
  vformData1.append("VoucherDate", formData.VoucherDate+'T'+formData.VoucherTime);
  vformData1.append("VoucherNo", this.state.VoucherNo[0].Id  == undefined || this.state.VoucherNo[0].Id == 0 ? formData.VoucherNo  : this.state.VoucherNo[0].Id);
  vformData1.append("Remarks", formData.Remarks);
  vformData1.append("UserId", this.state.aid);
  vformData1.append("TotalAmount", this.state.TotalAmount);
  
 Fn_AddEditData(this.obj, { arguList: { id: this.state.id, formData: vformData1 } }, "AddEditVoucherH/0/token", this.pushFormName, true, "VoucherL", this.state.VoucherL);

 


}


deleterow(Id , index) {

  const rows = [...this.state.VoucherL];
    rows.splice(index, 1);
    this.setState({VoucherL: rows});
 
}






btnGoBack_onClick = event => {
  event.preventDefault();
  //this.props.history.goBack();
  this.props.history.push(this.pushFormName);
};



  btnCancel_onClick = event => {
    this.setState ({ VoucherL: [{
      F_LedgerMasterCr:'',
      F_LedgerMasterDr : '',
      Amount : ''
    }],
    F_VoucherH : 0,
    TotalAmount : 0,
    formData : {F_VoucherH : -1 , SearchVoucherNo : '' , F_VoucherTypeMaster : -1 ,VoucherDate : getCurrentDate(),VoucherNo : '', Remarks : '' }
  
  })

  this.props.history.push('/voucherslist');
  };


  addrow() {

    
    let VoucherL  =  {
      F_LedgerMasterCr:'',
      F_LedgerMasterDr : '',
      Amount : ''
     
    }
        this.setState({VoucherL: [...this.state.VoucherL, VoucherL]});
    
   
    }
    

      add () {
        this.setState({save : false , cancel:false , add:true});
        this.setState({ VoucherL: [{
          F_LedgerMasterCr:'',
      F_LedgerMasterDr : '',
      Amount : ''
        }]});
    }






    editrow = (index, evnt) =>{
      const { name, value } = evnt.target;
  
      const rowsInput = [...this.state.VoucherL];
      rowsInput[index][name] = value;
  
      this.setState({VoucherL: rowsInput});

      const totalAmount = this.state.VoucherL.reduce((total, voucher) => total + parseInt(voucher.Amount, 10), 0);
      this.setState({TotalAmount : totalAmount});

  }
  

    
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
                       <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick} >
                          <TabContent activeTab={this.state.activeTab} className="body">
                            <TabPane tabId={1}>

                            <Row>
                                  
                                  
                                  <Card>
                  <CardBody>
{/* <Row>
<Col sm="2" className="mb-3">
                                          <label htmlFor="lastName" className="col-form-label">Vouch.No/Tran Code</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField name="SearchVoucherNo" label="" value={this.state.formData.SearchVoucherNo} onChange={this.onVoucherNoChange} placeholder="SearchVoucherNo" errorMessage="Enter SearchVoucherNo "  type="text"  className="form-control" />
                                        </Col>


                                        <Col sm="5">
                                        <AvField  name="F_VoucherH" onChange={this.OnVoucherChange} label="" value={this.state.formData.F_VoucherH === null ? '-1'   : this.state.formData.F_VoucherH}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select Voucher"} />
                                            {this.state.vouchers
                                              ? this.state.vouchers.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>
</Row> */}

                  <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Voucher Type</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField  name="F_VoucherTypeMaster" label="" value={this.state.formData.F_VoucherTypeMaster === null ? '-1'   : this.state.formData.F_VoucherTypeMaster} onChange={this.OnVoucherTypeChange} type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.vouchertype
                                              ? this.state.vouchertype.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>

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


                                      </Row>
                                      <Row>
 
                                      <Col sm="2" className="mb-3">
                                          <label htmlFor="lastName" className="col-form-label">Voucher No</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField name="VoucherNo" label="" value={this.state.VoucherNo[0].Id  == undefined || this.state.VoucherNo[0].Id == 0 ? this.state.formData.VoucherNo  : this.state.VoucherNo[0].Id} placeholder="VoucherNo" errorMessage="Enter VoucherNo "  type="text"  className="form-control" />
                                        </Col>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="lastName" className="col-form-label">Remarks</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField name="Remarks" label="" value={this.state.formData.Remarks} placeholder="Remarks" errorMessage="Enter Remarks " validate={{ required: { value: true } }} rows="4" cols="50"  type="textarea"  className="form-control" />
                                        </Col>
                                      </Row>
                  </CardBody>
                </Card>
                                     
                                 </Row>  
                                <Row>
                                  
                                  
                                  <Card>
                  <CardBody>
                  <AddDeleteTableRowsPly data={this.state.VoucherL} Ledger={this.state.Ledger}  add={this.addrow}  edit={this.editrow} del={this.deleterow}/>

                  <Col sm="2" className="mb-3">
                                          <label htmlFor="lastName" className="col-form-label">Total Amount</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField name="TotalAmount" label="" value={this.state.TotalAmount} placeholder="TotalAmount"  disabled type="number"  className="form-control" />
                                        </Col>
                  </CardBody>
                </Card>
                                     
                                 </Row>    
                                                                                                                                                                                                         
                            </TabPane>                                                  
                          </TabContent>
                          <div>

                       

                          <Button
                          type="submit"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          Save
                        </Button>
                        
                        &nbsp; 

                        <Button
                          type="button"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                          onClick={this.btnGoBack_onClick}
                        >
                          Go Back
                        </Button>
                        &nbsp; 
                        <Button
                          type="button"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                          onClick={this.btnCancel_onClick}
                        >
                          Cancel
                        </Button>

                        &nbsp; 
                        <Button
                          type="button"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                          onClick={() =>this.setState({confirm_alert : true})}
                        >
                          Delete
                        </Button>
                        {this.state.confirm_alert ? (
                                                                <SweetAlert
                                                                    title="Are you sure to Delete?"
                                                                    warning
                                                                    showCancel
                                                                    confirmBtnText="Yes, Delete it!"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="danger"
                                                                     onConfirm={() =>this.btnDelete()}
                                                                     onCancel={() =>this.setState({confirm_alert : false})}
                                                                >
                                                                 
                                                        It wil Never Come back!
                                                                    
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
export default compose(container)(pageAddEdit_Voucher);