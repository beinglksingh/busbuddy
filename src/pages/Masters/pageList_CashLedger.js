import React, { Component } from "react";


//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store


import {

  Fn_DeleteData,
  Fn_GetReport,
  Fn_AddEditData,
  Fn_FillListData,
  Fn_ChangeStateValue
} from "../../store/functions";

import {
  Container,
  Row,
  Col,

  Card,
  CardBody,

  Button,
 
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
class pageList_CashLedger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selectedFormData: {},
      gridData: [],
      confirm_alert: false,
      formData : {},
      success_dlg: false,
      productData : [],
      OpeningClosing : [{
        OpeningBalance : 0,
        TotalCredit : 0,
        TotalDebit : 0,
        ClosingBalance : 0
      }]
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Cash Ledger";
    this.modalTitle = "Audit Attendance";
    this.rtPage_Add = "add-customermaster";
    this.rtPage_Edit = "edit-customermaster";
    this.API_URL = "CashLedger/0/token/";
    this.API_URL_COMPANY = API_WEB_URLS.MASTER + "/0/token/CompanyMaster";

    //Event Binding
    this.btnAdd_onClick = this.btnAdd_onClick.bind(this);
    this.btnEdit_onClick = this.btnEdit_onClick.bind(this);
    this.btnDelete_onClick = this.btnDelete_onClick.bind(this);
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
    this.exportToExcel  = this.exportToExcel.bind(this);
  }




  componentDidMount() {
   
  }

 


  btnSave_onClick (event, formData)  {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    let vformData = new FormData();
    vformData.append("Id", 66);
    vformData.append("FromDate", formData.FromDate);
    vformData.append("ToDate", formData.ToDate);
    
    Fn_GetReport(this.obj, { arguList: { id: 66, formData: vformData } }, this.API_URL, "productData", true);
    

  }
  exportToExcel = () => {
    const filename  =  'CashLedger';
    const worksheet = XLSX.utils.json_to_sheet(this.state.productData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CashLedger');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };




  btnAdd_onClick(event, values) {
    this.props.history.push(`${this.rtPage_Add}`);
  }
  btnEdit_onClick(formData) {
    this.props.history.push(`${this.rtPage_Edit}/${formData.Id}`, {});
  }
  btnDelete_onClick(formData) {
    Fn_DeleteData(this.obj, formData.Id, this.API_URL, this.API_URL + "/Id/0");
  }
  
  render() {


    const sumDr = this.state.productData.reduce((total, row) => total + row.Dr, 0);
    const sumcr = this.state.productData.reduce((total, row) => total + row.Cr, 0);
    const balance = this.state.productData.reduce((total, row) => total + row.ClosingBalance, 0);



    const columns = [{
      dataField: 'DateOfCreation',
      text: 'Date/Time',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
      
    }, {
      dataField: 'TransactionCode',
      text: 'TransactionCode',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
    },
    {
      dataField: 'Description',
      text: 'Description',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
     
    },
    
    
    {
      dataField: 'LedgerName',
      text: 'LedgerName',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
     
    },

    {
      dataField: 'Dr',
      text: 'Dr',
      sort: true,
      formatter: (cell, row) => (
        <span style={{ color:'red' }}>{cell}</span>
      ),
      footer: columnData => (
        <div>
         {Number(sumDr).toFixed(2)}
        </div>
      )
    },
    {
      dataField: 'Cr',
      text: 'Cr',
      sort: true,
      formatter: (cell, row) => (
        <span style={{ color:'green' }}>{cell}</span>
      ),
      footer: columnData => (
        <div>
         {Number(sumcr).toFixed(2)}
        </div>
      )
    },
    {
      dataField: 'ClosingBalance',
      text: 'ClosingBalance',
      sort: true,
      // footer: columnData => (
      //   <div>
      //    {Number(balance).toFixed(2)}
      //   </div>
      // )
     
    },
    {
      dataField: 'Narration',
      text: 'Narration',
      sort: true
     
    },
   
     
    

    
  
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
                                  <Col lg="12">

                              
                                    <Row>
                                        <Col sm="1" className="mb-3">
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
export default compose(container)(pageList_CashLedger);
