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
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import * as XLSX from 'xlsx';

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
class pageList_TDSReportForAdmin extends Component {
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
      productData: [{}],
      RReason : '',
      F_RetailerComission : 0,
      F_DistributorComission : 0,
      F_SDistributorComission : 0,
      F_MDistributorComission : 0,
      commissionmodal : false,
      success_dlg : false,
      rows : [["Data"], ["Data"], ["Data"], ["Data"], ["Data"], ["Data"],["Data"], ["Data"], ["Data"],["Data"]],
      cols:[],
      F_Type : 0
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "TDS Report";
    this.modalTitle = "Audit Attendance";
    this.rtPage_Add = "add-customermaster";
    this.rtPage_Edit = "edit-customermaster";
    this.API_URL = "TDSReportForAdmin/0/token";
    

    //Event Binding
    
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
  
    this.syno  =  this.syno.bind(this);
   
   
    this.exportToExcel  =  this.exportToExcel.bind(this);
    
  
  }

  exportToExcel = () => {

    // let vformData = new FormData();
    
    // vformData.append("FromDate", this.state.FromDate);
    // vformData.append("ToDate",  this.state.ToDate);
    
    // Fn_ExportExcel(this.obj, { arguList: { id: 0, formData: vformData } }, "TDSReportForAdmin/0/token", this.state.FromDate + '-' + this.state.ToDate+ " TDS REPORT", true);
    



    
    const worksheet = XLSX.utils.json_to_sheet(this.state.productData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TDSReport');
    XLSX.writeFile(workbook, `TDSReport.xlsx`);
  };






  

  
  componentDidMount() {
   // Fn_FillListData(this.obj, "service", API_WEB_URLS.MASTER + "/0/token/ServiceMaster/Id/0");

    
   
  }
  syno(){
    this.setState({success_msg : false, success_dlg : false})
  }
 

  btnSave_onClick (event, formData)  {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.setState({FromDate : formData.FromDate ,ToDate : formData.ToDate })

    let vformData = new FormData();
    vformData.append("Id", this.state.F_ServiceMaster == undefined ? 0 : this.state.F_ServiceMaster);
    vformData.append("FromDate", formData.FromDate);
    vformData.append("ToDate", formData.ToDate);
    
    Fn_GetReport(this.obj, { arguList: { id: this.state.F_ServiceMaster, formData: vformData } }, this.API_URL, "productData", true);
  


  }



  



  
  render() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    const Comission = this.state.productData.reduce((total, row) => total + row.Comission, 0);

    const TDS = this.state.productData.reduce((total, row) => total + row.TDS, 0);

    const columns = [{


      dataField: 'AgentName',
      text: 'AgentName',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
    }, {
      dataField: 'AgentId',
      text: 'AgentId',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
    },
    {
      dataField: 'ShopName',
      text: 'ShopName',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
     
    },
     {
      dataField: 'PAN',
      text: 'PAN',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
     
    },
     {
      dataField: 'ServicName',
      text: 'ServicName',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
     
    },
     {
      dataField: 'TDS',
      text: 'TDS',
      sort: true,
      footer: columnData => (
        <div>
         {Number(TDS).toFixed(2)}
        </div>
      )
     
    },

    {
      dataField: 'Comission',
      text: 'Comission',
      sort: true,
      footer: columnData => (
        <div>
         {Number(Comission).toFixed(2)}
        </div>
      )
    },
    
    {
      dataField: 'Charges',
      text: 'Charges',
      sort: true,
      footer: columnData => (
        <div>
      </div>
      )
     
    },
    
    {
      dataField: 'Mode',
      text: 'Tran. Type',
      sort: true,
     
    },
     {
      dataField: 'UTR',
      text: 'UTR',
      sort: true,
     
    }
   
   

    
  
  ];

  const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
  }];

  const pageOptions = {
    sizePerPage: 25,
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
                            <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Select service</label>
                                        </Col>
                                        <Col sm="3" className="mb-3">
                                        <select  name="F_ServiceMaster" label="" value={this.state.formData.F_ServiceMaster === null ? '-1'   : this.state.formData.F_ServiceMaster} onChange={(e) => Fn_ChangeStateValue(this.obj, 'F_ServiceMaster', e.target.value)}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                           
                                                    <option key={1} value={1} label={'DMR'} />
                                                    <option key={2} value={2} label={'Indo Nepal'} />
                                                    <option key={4} value={4} label={'AEPS'} />
                                                    <option key={3} value={3} label={'Recharge'} />
                                                
                                          </select>     
                                        </Col>
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
                      pagination={paginationFactory(pageOptions)}
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

                         

        

                         {this.state.success_msg == true ? (
                      <SweetAlert
                        title={'Data Uploded Successful!'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                      
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
export default compose(container)(pageList_TDSReportForAdmin);
