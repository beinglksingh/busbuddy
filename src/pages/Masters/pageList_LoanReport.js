import React, { Component } from "react";

//Import Breadcrumb
import RCDisplayPage from "../../components/Common/RCDisplayPage";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store


import {
  Fn_FillListData,
  togglemodal,
  toggleDeleteConfirm,
  toggleDeleteSuccess,
  Fn_DeleteData,
  Fn_GetReport,
  Fn_AddEditData,
  Fn_ChangeStateValue
} from "../../store/functions";

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
import SweetAlert from "react-bootstrap-sweetalert"

import {
  AvForm,
  AvField,AvRadioGroup,AvRadio
} from "availity-reactstrap-validation";

import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import './datatables.scss';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';
import { API_HELPER } from "helpers/ApiHelper";

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import * as XLSX from 'xlsx';


function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
class pageList_LoanReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selectedFormData: {},
      gridData: [],
      confirm_alert: false,
      formData : {},
      success_msg: false,
      dynamic_title: "",
      dynamic_description: "",
      company : [],
      page: 1,
      sizePerPage: 10,
      productData: [],
      RReason : '',
      F_RetailerComission : 0,
      F_DistributorComission : 0,
      F_SDistributorComission : 0,
      F_MDistributorComission : 0,
      RPId : 0,
      commissionmodal : false,
      success_dlg : false,
      confirm_undorefund : false,
      title : '',
      dispute_msg : false
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Loan Report";
    this.modalTitle = "Audit Attendance";
    this.rtPage_Add = "add-customermaster";
    this.rtPage_Edit = "edit-customermaster";
    this.API_URL = "LoanReport/0/token";
    

    //Event Binding
    
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
   this.refund  =  this.refund.bind(this);
    this.syno  =  this.syno.bind(this);
    this.edit  =  this.edit.bind(this);
    this.edit  =  this.edit.bind(this);
    this.undorefund  =  this.undorefund.bind(this);
     
      this.exportToExcel  = this.exportToExcel.bind(this);
  }


  edit (Id){

    const foundItem = this.state.productData.find(item => item.Id === Id);

    this.setState ({
      F_RetailerComission : foundItem.F_RetailerComission,
      F_DistributorComission : foundItem.F_DistributorComission,
      F_SDistributorComission : foundItem.F_SDistributorComission,
      F_MDistributorComission : foundItem.F_MDistributorComission,
      RefundReason : foundItem.RefundReason,
      Amount : foundItem.Amount,
      F_RechargeId   : Id,
      commissionmodal : true
    });

  }

  exportToExcel = () => {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    const worksheet = XLSX.utils.json_to_sheet(this.state.productData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'LoanReport');
    XLSX.writeFile(workbook, `LoanReport.xlsx`);
  };


 
  edit (Id){

    // const foundItem = this.state.productData.find(item => item.Id === Id);
 
     this.setState ({
       F_FundRequestId   : Id,
       commissionmodal : true
     });
 
   }



  componentDidMount() {
    Fn_FillListData(this.obj, "accounttypescheme", API_WEB_URLS.MASTER + "/0/token/AccountTypeSchemes/Id/6");
  }
  syno(){
    this.setState({success_msg : false, success_dlg : false, dispute_msg : false })
  }
 


  btnSave_onClick (event, formData)  {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.setState({FromDate : formData.FromDate ,ToDate : formData.ToDate })

    let vformData = new FormData();
    vformData.append("Id", obj.uid);
    vformData.append("F_AccountTypeScheme", formData.F_AccountTypeScheme == "" ? -1 : formData.F_AccountTypeScheme);
    vformData.append("IsLoan_Approve", formData.LoanStatus == "" ? -1 : formData.LoanStatus);
    vformData.append("IsClose", formData.IsClosed == "" ? -1 : formData.IsClosed) ;
    vformData.append("ToDate", formData.ToDate);
    vformData.append("FromDate", formData.FromDate);
    
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, this.API_URL, "productData", true);


  }



undorefund=  async()=>{
  let vformData = new FormData();
   var Id =  this.state.Id;
  //Information
  vformData.append("Id", this.state.Id);

    let AuthUser2 = function() {
      return API_HELPER.apiPUT_Multipart(API_WEB_URLS.BASE+"RechargeUndoRefund/0/token/"+Id , vformData).then(token => { return token } )
    }
    let userToken2 = await AuthUser2();
    if (userToken2.status == 200 || userToken2.status == '200'){
      this.setState({success_msg : true, title : 'Refund Undo Succesfull!'});
      const obj = JSON.parse(sessionStorage.getItem("authUser"));

      let vformData = new FormData();
      vformData.append("Id", obj.uid);
      vformData.append("FromDate", this.state.FromDate);
      vformData.append("ToDate",  this.state.ToDate);
      
      Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, this.API_URL, "productData", true);
  
    }
    else {
      alert('Some Error Ocurred!');
    }

    this.setState({confirm_undorefund : false , Id : 0})
   
}



  refund = async()=>{
  
   if (this.state.RReason == ''){
    alert('Please fill Refund Reason!');
   }

   else {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
   
  //Information
  vformData.append("Id", this.state.Id);
  vformData.append("Reason", this.state.RReason);
  vformData.append("F_user", obj.uid);

    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"RechargeRefund/0/token" , vformData).then(token => { return token } )
    }
    let userToken2 = await AuthUser2();
    if (userToken2.status == 200 || userToken2.status == '200'){
      this.setState({success_msg : true, title : 'Refunded Succesfull!'});
      

      let vformData = new FormData();
      vformData.append("Id", obj.uid);
      vformData.append("FromDate", this.state.FromDate);
      vformData.append("ToDate",  this.state.ToDate);
      
      
      Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, this.API_URL, "productData", true);
  
    }
    else {
      alert('Some Error Ocurred!');
    }

    this.setState({confirm_alert : false, RReason : '' , Id : 0})
   }
  }







  
  render() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));


   

    const sumAmount = this.state.productData.reduce((total, row) => total + row.LoanAmount, 0);


    const columns = [{
      dataField: 'MemberAccountNo',
      text: 'MemberAccountNo',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
    }, {
      dataField: 'AccountScheme',
      text: 'SchemeName',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
    },
    {
      dataField: 'MemberName',
      text: 'ShopName',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
     
    }, {
      dataField: 'DoneBy',
      text: 'DoneBy',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
    }, {
      dataField: 'LoanAmount',
      text: 'LoanAmount',
      sort: true,
      footer: columnData => (
        <div>
         {sumAmount}
        </div>
      )
     
    }, 
    , {
      dataField: 'OpeningDate',
      text: 'OpeningDate',
      sort: true,
     
    }, 
    obj.isAdmin
    ?  {
      dataField: "Edit",
      text: "Edit",
  
      formatter: (cellContent, row) => {
        if (row.IsLoan_Approve == 0 || row.IsClosed == 0) {
          return (
            <button
              type="button"
              className="btn btn-success btn-xs"
              onClick={() => this.edit(row.Id)}
            >
              Edit
            </button>
          );
        } else {
          return null; // or you can return an empty string if you prefer
        }
      },
    } : '',
 
     {
        dataField: 'LoanEMIAmount',
        text: 'EMIAmount',
        sort: true
      } 
  
,
 {
    dataField: 'MainInterest',
    text: 'MainInterest',
    sort: true
  } 
,
{
  dataField: 'PaneltyInterest',
  text: 'PaneltyInterest',
  sort: true
} ,

{
  dataField: 'Tenure',
  text: 'Tenure',
  sort: true
} 
,

{
  dataField: 'Periodicity',
  text: 'Periodicity',
  sort: true
} 
,

{
  dataField: 'RepaymentAmount',
  text: 'RepaymentAmount',
  sort: true
} ,
{
  dataField: 'OutStandingAmount',
  text: 'OutStandingAmount',
  sort: true
} ,
{
  dataField: 'ProcessingCharge',
  text: 'ProcessingCharge',
  sort: true
} ,
{
  dataField: 'CloseDate',
  text: 'CloseDate',
  sort: true
} ,
{
  dataField: 'ClosingRemarks',
  text: 'ClosingRemarks',
  sort: true
} ,


{
  dataField: 'LoanStatus',
  text: 'Status',
  sort: true,
  formatter: (cell, row) => (
    <span style={{ color: row.IsClose  ==  0  ? 'green'  : 'red' }}>{cell}</span>
  ),
} ,

 {
    dataField: 'LoanApproval',
    text: 'ApproveStatus',
    sort: true,
    formatter: (cell, row) => (
      <span style={{ color: row.IsLoan_Approve  ==  0  ? 'purple' : row.IsLoan_Approve == 1  ? 'green' : 'red' }}>{cell}</span>
    ),
  } 

    
  
  ];

  const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
  }];

  const pageOptions = {
    sizePerPage: 10,
    totalSize: this.state.productData.length, // replace later with size(customers),
    custom: true,
  }

  // Custom Pagination Toggle
  const sizePerPageList = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '15', value: 15 },
    { text: '20', value: 20 },
    { text: '25', value: 25 },
    { text: 'All', value: (this.state.productData).length }];


  // Select All Button operation
  const selectRow = {
    mode: 'checkbox'
  }

  const { SearchBar } = Search;

    return (




     <>

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
                   
                    <div className="wizard clearfix">
                      <div className="content clearfix">
                            
                            <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                         
                                <Row>
                                  <Col lg="9">
                              
                                    <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> From Date</label>
                                        </Col>
                                        <Col sm="2" className="mb-3">
                                        <AvField name="FromDate" label="" value={this.state.formData.FromDate  ==  undefined ? getCurrentDate() : this.state.formData.FromDate} placeholder="From Date" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
                                        </Col>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">To Date</label>
                                        </Col>
                                        <Col sm="2" className="mb-3">
                                        <AvField name="ToDate" label="" value={this.state.formData.ToDate == undefined ? getCurrentDate() : this.state.formData.ToDate} placeholder="To Date" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                        <label htmlFor="age" className="col-form-label"> Scheme</label>
                                      </Col>
                                      <Col sm="4">
                                      <AvField  name="F_AccountTypeScheme" label="" value={this.state.formData.F_AccountTypeScheme}  type="select" className="form-select"  >
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
                                          <label htmlFor="DateofBirth" className="col-form-label">Loan Status</label>
                                        </Col>
                                        <Col sm="3" className="mb-3">
                                        <AvField  name="LoanStatus" label="" value={this.state.formData.LoanStatus === null ? '-1'   : this.state.formData.LoanStatus}  type="select" className="form-select" >
                                          <option value={-1} defaultValue label={"All"} />
                                          <option value={0}  label={"Pending"} />
                                            <option value={1}  label={"Approved"} />
                                            <option value={2}  label={"Reject"} />
                                        </AvField> 
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Is Closed</label>
                                        </Col>
                                        <Col sm="3" className="mb-3">
                                        <AvField  name="IsClosed" label="" value={this.state.formData.IsClosed === null ? '-1'   : this.state.formData.IsClosed}  type="select" className="form-select" >
                                          <option value={-1} defaultValue label={"All"} />
                                          <option value={0}  label={"Closed"} />
                                        </AvField> 
                                        </Col>
                                        </Row>
                                        


                                        <Row>


                                        <Col sm="3" className="mb-3">
                                        <Button
                          type="submit"
                          color="primary"
                        
                          className="mr-1 waves-effect waves-light"
                        >
                          View
                        </Button>

                        
                        <Button
                          type="button"
                          color="primary"
                          style={{marginLeft:10}}
                          onClick={this.exportToExcel}
                          className="mr-1 waves-effect waves-light"
                        >
                          Excel
                        </Button>
                                          </Col>
                                      
                                    
                                      </Row>

                                     
                                   

                       
                    
                         </Col>
                         </Row>
                        

                         
                         </AvForm>

                         </div> 



                       



                         </div>

                        
                       
                          </CardBody>
                         </Card>


                         
                         </Col>
                         </Row>

                         <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory({
                        ...pageOptions,
                        sizePerPageList: [
                          { text: '25', value: 25 },
                          { text: '50', value: 50 },
                          { text: '100', value: 100 },
                        ],
                      })}
                      keyField='id'
                      columns={columns}
                      data={this.state.productData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField='id'
                          columns={columns}
                          data={this.state.productData}
                          search
                        >
                          {toolkitProps => (
                            <React.Fragment>

                              <Row className="mb-2">
                                <Col md="4">
                                  <div className="search-box me-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitProps.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      keyField={"id"}
                                      responsive
                                      bordered={false}
                                      striped={false}
                                      defaultSorted={defaultSorted}
                                     // selectRow={selectRow}
                                      classes={
                                        "table align-middle table-nowrap"
                                      }
                                      headerWrapperClasses={"thead-light"}
                                      {...toolkitProps.baseProps}
                                      {...paginationTableProps}
                                    />

                                  </div>
                                </Col>
                              </Row>

                              {this.state.productData.length > 0 ?  

                          <Row className="align-items-md-center mt-30">
                            <Col className="inner-custom-pagination d-flex">
                              <div className="d-inline">
                                <SizePerPageDropdownStandalone
                                  {...paginationProps}
                                />
                              </div>
                              <div className="text-md-right ms-auto">
                                <PaginationListStandalone
                                  {...paginationProps}
                                />
                              </div>
                            </Col>
                          </Row> : null}
                            </React.Fragment>
                          )
                          }
                        </ToolkitProvider>
                      )
                      }</PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
              </Row>





                         
                         </Container>

                         
                         <Modal
                        isOpen={this.state.commissionmodal}
                        toggle={this.commissionmodal}
                        scrollable={true}
                        backdrop={'static'}
                        id="staticBackdrop2"
                      >
                        <div className="modal-header">
                          <h5 className="modal-title" >Accept/Reject Request</h5>
                          <button type="button" className="btn-close" onClick={() =>
                            this.setState({ commissionmodal: false })
                          } aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        

                        <Row>
                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Remarks</label>
                                        </Col>
                                        <Col sm="8" className="mb-3">
                          <input name="Remarks" label="" value={this.state.Remarks}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'Remarks', e.target.value)}  placeholder="Enter Remarks"   type="text"  className="form-control" />
                        </Col>
                        </Row>


                        </div>
                        <div className="modal-footer">
                          <button type="button"  onClick={this.proceededitA} className="btn btn-info"  >Approve</button>
                        </div>
                        <div className="modal-footer">
                          <button type="button" onClick={this.proceededitR}  className="btn btn-danger"  >Reject</button>
                        </div>
                      </Modal>


                         {this.state.success_msg == true ? (
                      <SweetAlert
                        title={this.state.title}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                      
                      </SweetAlert>
                    ) : null}

{this.state.dispute_msg == true ? (
                      <SweetAlert
                        title={this.state.DisputeTitle}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                      {this.state.DisputeMessage}
                      </SweetAlert>
                    ) : null}

                         {this.state.confirm_alert ? (
                                                                <SweetAlert
                                                                    title="Are you sure to Refund?"
                                                                    warning
                                                                    showCancel
                                                                    confirmBtnText="Yes, Refund it!"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="danger"
                                                                     onConfirm={() =>this.refund()}
                                                                     onCancel={() =>this.setState({confirm_alert : false, RReason : false , Id : 0})}
                                                                >
                                                                 
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Refund Reason</label>
                                        </Col>
                                        <br></br>
                                        <Col sm="9" className="mb-3">
                                        <input name="RReason" label="" value={this.state.RReason} placeholder="Refund Reason" onChange={(event)=>Fn_ChangeStateValue(this.obj, "RReason", event.target.value)}  validate={{ required: { value: true } }} type="text"  className="form-control" />
                                        </Col>
                                    
                                                                    
                                                                </SweetAlert>
                                                                ) : null}



{this.state.confirm_undorefund ? (
                                                                <SweetAlert
                                                                    title="Are you sure to Undo Refund?"
                                                                    warning
                                                                    showCancel
                                                                    confirmBtnText="Yes, Undo it!"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="danger"
                                                                     onConfirm={() =>this.undorefund()}
                                                                     onCancel={() =>this.setState({confirm_undorefund : false, Id : 0})}
                                                                >
                                                                  The Credited Amount will be deduct!                                                                    
                                                                </SweetAlert>
                                                                ) : null}


{this.state.success_dlg == true ? (
                      <SweetAlert
                        title={'Updated Successful!'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                      
                      </SweetAlert>
                    ) : null}
                         </div>
                         </React.Fragment>



  </>
    );
  }
}
export default compose(container)(pageList_LoanReport);
