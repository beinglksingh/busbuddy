import React, { Component } from "react";

//Import Breadcrumb
import RCDisplayPage from "../../components/Common/RCDisplayPage";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store


import {
 
  Fn_GetReport,

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
  TabPane
} from "reactstrap";

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
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import * as XLSX from 'xlsx';




function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
class pageList_LedgerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selectedFormData: {},
      gridData: [],
      confirm_alert: false,
      formData : {},
      success_dlg: false,
      page: 1,
      sizePerPage: 10,
      productData: [],
      
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Ledger Report";
    this.modalTitle = "Audit Attendance";
    this.rtPage_Add = "add-customermaster";
    this.rtPage_Edit = "edit-customermaster";
    this.API_URL = "LedgerDetails/0/token/";
   

    //Event Binding
    
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
    this.onSearchLedger  =  this.onSearchLedger.bind(this);
    this.exportToExcel  =  this.exportToExcel.bind(this);

  }



  exportToExcel = () => {

    // let vformData = new FormData();
    
    // vformData.append("FromDate", this.state.FromDate);
    // vformData.append("ToDate",  this.state.ToDate);
    
    // Fn_ExportExcel(this.obj, { arguList: { id: 0, formData: vformData } }, "DMRExcel/0/token", "DMRTransaction", true);
    
const obj = JSON.parse(sessionStorage.getItem("authUser"));




    const worksheet = XLSX.utils.json_to_sheet(this.state.productData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'LedgerReport');
    XLSX.writeFile(workbook, `LedgerReport.xlsx`);


  };

  onSearchLedger(event) {
    let vformData = new FormData();
    vformData.append("Search", event.target.value);
    
    Fn_GetReport(this.obj, { arguList: { id: 0, formData: vformData } }, "SearchLedger/0/token", "ledger", true);


  }



  componentDidMount() {
   
  }

 


  btnSave_onClick (event, formData)  {

    
    let vformData = new FormData();
    vformData.append("Id", this.state.F_Ledger);
    vformData.append("FromDate", formData.FromDate);
    vformData.append("ToDate", formData.ToDate);
    
    Fn_GetReport(this.obj, { arguList: { id: this.state.F_Ledger, formData: vformData } }, this.API_URL, "productData", true);


  }







  render() {


    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    const columns = [{
      dataField: 'VoucherDate',
      text: 'Date/Time',
      sort: true,
    }, {
      dataField: 'VoucherNo',
      text: 'VoucherNo',
      sort: true
    },
    {
      dataField: 'Narration',
      text: 'Narration',
      sort: true,
     
    },
    
    {
      dataField: 'CrAmount',
      text: 'CrAmount',
      sort: true,
      formatter: (cell, row) => (
        <span style={{ color: 'green'}}>{cell}</span>
      ),
    },

    {
      dataField: 'DrAmount',
      text: 'DrAmount',
      sort: true,
      formatter: (cell, row) => (
        <span style={{ color: 'red'}}>{cell}</span>
      ),
    },

    , {
      dataField: 'Balance',
      text: 'Balance',
      sort: true,
     
    },
  

    , {
      dataField: 'Remarks',
      text: 'Remarks',
      sort: true,
     
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
                                  <Col sm="2" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">Search</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField name="SearchLedger" label="" value={this.state.SearchLedger} onChange={this.onSearchLedger} placeholder="SearchLedger" errorMessage="Enter SearchLedger"  type="text"  className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">Ledger</label>
                                        </Col>
                                        <Col sm="5">
                                        <select  name="F_Ledger" label="" value={this.state.F_Ledger === null ? '-1'   : this.state.F_Ledger} onChange={(e) => Fn_ChangeStateValue(this.obj, 'F_Ledger', e.target.value)}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.ledger
                                              ? this.state.ledger.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </select> 
                                        </Col>
                                    
                                      </Row>
                              
                                    <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> From Date</label>
                                        </Col>
                                        <Col sm="3" className="mb-3">
                                        <AvField name="FromDate" label="" value={this.state.formData.FromDate  ==  undefined ? getCurrentDate() : this.state.formData.FromDate } placeholder="From Date" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">To Date</label>
                                        </Col>
                                        <Col sm="3" className="mb-3">
                                        <AvField name="ToDate" label="" value={this.state.formData.ToDate   ==  undefined ? getCurrentDate() : this.state.formData.ToDate} placeholder="To Date" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
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
                         </div>
                         </React.Fragment>



  </>
    );
  }
}
export default compose(container)(pageList_LedgerDetails);
