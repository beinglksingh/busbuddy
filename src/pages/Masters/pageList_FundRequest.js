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
  Fn_ChangeStateValue,
  Fn_ExportExcel
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
import Loader from "pages/loader";


function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
class pageList_FundRequest extends Component {
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
      Charges : 0,
      commissionmodal : false,
      success_dlg : false,
      confirm_undorefund : false,
      title : '',
      UTR : '',
      loading : false

    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Fund Request Report";
    this.modalTitle = "Audit Attendance";
    this.rtPage_Add = "add-customermaster";
    this.rtPage_Edit = "edit-customermaster";
    this.API_URL = "FundRequestTran/0/token";
    

    //Event Binding
    
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
   
    this.syno  =  this.syno.bind(this);
    this.edit  =  this.edit.bind(this);
    this.proceededitR  =  this.proceededitR.bind(this);
    this.proceededitA  =  this.proceededitA.bind(this);
    this.exportToExcel  = this.exportToExcel.bind(this);

  }

   
  exportToExcel = () => {

    // let vformData = new FormData();
    
    // vformData.append("FromDate", this.state.FromDate);
    // vformData.append("ToDate",  this.state.ToDate);
    
    // Fn_ExportExcel(this.obj, { arguList: { id: 0, formData: vformData } }, "DMRExcel/0/token", "DMRTransaction", true);
    
const obj = JSON.parse(sessionStorage.getItem("authUser"));



    const orderAndFilter = (arr) => {
    return arr.map((item) => {

      if(obj.isAdmin){
      return {
        DateTime: item.DateTime,
        VoucherNo: item.VoucherNo,
        AgentId: item.AgentId,
        PaymentMode: item.PaymentMode,
        Status: item.Status,
        Amount: item.Amount,
        BankName: item.BankName,
        TransactionCode: item.TransactionCode,
        Remarks: item.Remarks
      };
    }

    else {

       return {
        DateTime: item.DateTime,
        VoucherNo: item.VoucherNo,
        PaymentMode: item.PaymentMode,
        Status: item.Status,
        Amount: item.Amount,
        BankName: item.BankName,
        TransactionCode: item.TransactionCode,
        Remarks: item.Remarks
       
        
      };

    }
    });
  };
  
  // Apply the order and filter function to your original array
  const orderedAndFilteredArray = orderAndFilter(this.state.productData);


    const worksheet = XLSX.utils.json_to_sheet(orderedAndFilteredArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FundRequest');
    XLSX.writeFile(workbook, `FundRequest.xlsx`);


  };

  edit (Id, IsApproved){

   // const foundItem = this.state.productData.find(item => item.Id === Id);

    this.setState ({
      IsApproved : IsApproved,
      F_FundRequestId   : Id,
      commissionmodal : true
    });

  }



  proceededitR() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.setState({loading : true })

    let vformData = new FormData();
   
  //Information
  vformData.append("Id", this.state.F_FundRequestId);
  vformData.append("Type", 3);
  vformData.append("Remarks", this.state.Remarks);
  vformData.append("UserId", obj.uid);
  vformData.append("F_User", obj.uid);

 Fn_AddEditData(this.obj, { arguList: { id: 0  , formData: vformData } }, "AcceptRejectFundRequest/0/token", "#", true, "rusufund" );
  
 this.setState({loading : false })
  }

  proceededitA() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.setState({loading : true })

    let vformData = new FormData();
   
  //Information
  vformData.append("Id", this.state.F_FundRequestId);
  vformData.append("Type", 2);
  vformData.append("Remarks", this.state.Remarks);
  vformData.append("UserId", obj.uid);
  vformData.append("F_User", obj.uid);

 Fn_AddEditData(this.obj, { arguList: { id: 0  , formData: vformData } }, "AcceptRejectFundRequest/0/token", "#", true, "rusufund" );
  
 this.setState({loading : false })
  }




  componentDidMount() {
   
   
  }

  syno(){
    this.setState({success_msg : false, success_dlg : false })
  }
 


  btnSave_onClick (event, formData)  {

    this.setState({loading : true })

    
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.setState({FromDate : formData.FromDate ,ToDate : formData.ToDate, Status : formData.StatusId, uid : obj.uid })

    let vformData = new FormData();
    vformData.append("Id", obj.uid);
    vformData.append("FromDate", formData.FromDate);
    vformData.append("ToDate", formData.ToDate);
    vformData.append("Status", formData.StatusId == '' ? 1 : formData.StatusId);
    
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, this.API_URL, "productData", true);
    this.setState({loading : false })

  }








  
  render() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    const sumAmount = this.state.productData.reduce((total, row) => total + row.Amount, 0);

    const columns = [{
      dataField: 'DateTime',
      text: 'Date/Time',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
    },

    obj.isAdmin
    ?  
    {
      dataField: 'AgentId',
      text: 'AgentId',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
    } : '',
    
     {
      dataField: 'VoucherNo',
      text: 'VoucherNo',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
    },
    {
      dataField: 'PaymentMode',
      text: 'PaymentMode',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
     
    },
    //  {
    //   dataField: 'SenderAccountNo',
    //   text: 'SenderAccountNo',
    //   sort: true,
     
    // },
    {
      dataField: 'Status',
      text: 'Status',
      sort: true,
      formatter: (cell, row) => (
        <span style={{ color: row.Status  ==  'PENDING'  ? 'blue' : row.Status == 'APPROVED'  ? 'green' : 'red' }}>{cell}</span>
      ),
      footer: columnData => (
        <div>
         
        </div>
      )
    }
    , {
      dataField: 'Amount',
      text: 'Amount',
      sort: true,
      footer: columnData => (
        <div>
         {sumAmount}
        </div>
      )
     
    },

    {
      dataField: 'BankName',
      text: 'BankName',
      sort: true,
     
    },
    
    {
      dataField: 'TransactionCode',
      text: 'TransactionCode',
      sort: true,
     
    },
    
   

    //  {
    //   dataField: 'Narration',
    //   text: 'Narration',
    //   sort: true,
     
    // },
     {
      dataField: 'Remarks',
      text: 'Remarks',
      sort: true,
     
    },


    obj.isAdmin
    ?  {
      dataField: "Edit",
      text: "Edit",
      formatter: (cellContent, row) => {
        return (
          <button
          type="button"
            className="btn btn-success btn-xs"
            onClick={() => this.edit(row.Id, row.IsApproved )}
          >
            Edit
          </button>
        );
      },
    } : '',

    obj.isAdmin
    ?  {
      dataField: "AdminName",
      text: "User",
     
    } : '',
   

    
  
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
        {this.state.loading ? <Loader /> : null}
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={this.breadCrumbTitle}
              breadcrumbItem={this.breadCrumbItem}
            />
            <Row>
              <Col lg="14">
                <Card>
                  <CardBody>
                   
                    <div className="wizard clearfix">
                      <div className="content clearfix">
                            
                            <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                         
                                <Row>
                                  <Col lg="12">
                                  
                                    <Row>
                                   

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Select Status</label>
                                        </Col>
                                    <Col sm="3">
                                        <AvField  name="StatusId" label="" value={this.state.formData.StatusId === null ? '-1'   : this.state.formData.StatusId}   type="select" className="form-select" >
                                        <option value={-1} defaultValue label={"Select"} />
                                            
                                            <option key={1} value={1} label={'Pending'} />
                                            <option key={2} value={2} label={'Approved'} />
                                            <option key={3} value={3} label={'Rejected'} />
                                            <option key={0} value={0} label={'All'} />
                                          </AvField> 
                                        </Col>

                                     

</Row>

                              
                                    <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> From Date</label>
                                        </Col>
                                        <Col sm="3" className="mb-3">
                                        <AvField name="FromDate" label="" value={this.state.formData.FromDate  ==  undefined ? getCurrentDate() : this.state.formData.FromDate} placeholder="From Date" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
                                        </Col>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">To Date</label>
                                        </Col>
                                        <Col sm="3" className="mb-3">
                                        <AvField name="ToDate" label="" value={this.state.formData.ToDate == undefined ? getCurrentDate() : this.state.formData.ToDate} placeholder="To Date" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
                                        </Col>

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
                    


                        {/* <Button
                          type="button"
                          color="primary"
                          style={{marginLeft:10}}
                          onClick={this.exportToExcel}
                          className="mr-1 waves-effect waves-light"
                        >
                          Excel
                        </Button> */}
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
                              </Row>
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
                          <button type="button" disabled={this.state.IsApproved ==  2 ? true : false} onClick={this.proceededitA} className="btn btn-info"  >{this.state.IsApproved ==  2 ? 'Approved' : 'Approve'}</button>
                        </div>
                        <div className="modal-footer">
                          <button type="button" onClick={this.proceededitR} disabled={this.state.IsApproved ==  3 ? true : false} className="btn btn-danger"  >{this.state.IsApproved ==  3 ? 'Rejected' : 'Reject'}</button>
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
export default compose(container)(pageList_FundRequest);
