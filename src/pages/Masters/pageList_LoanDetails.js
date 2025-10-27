import React, { Component } from "react";

//Import Breadcrumb
import RCDisplayPage from "../../components/Common/RCDisplayPage";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import {
  Fn_FillListData,
  togglemodal,
  toggleDeleteConfirm,
  toggleDeleteSuccess,
  Fn_DeleteData,
  toggleApproveConfirm,
  Fn_AddEditData,
  Fn_GetReport
} from "../../store/functions";
import './datatables.scss';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';
import { API_HELPER } from "helpers/ApiHelper";
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

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import {
  AvForm,
  AvField,AvRadioGroup,AvRadio
} from "availity-reactstrap-validation";

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
class pageList_VouchersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      selectedFormData: {},
      gridData: [],
      confirm_alert: false,
      confirm_alert_Approve : false,
      success_dlg: false,
      dynamic_title: "Success",
      dynamic_description: "",
      IsApproved : true,
      productData: [],
      formData:{}
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Loan Details";
    this.modalTitle = "Loan Details";
    this.rtPage_Add = "managevoucher";
    this.rtPage_Edit = "loanemi";
    this.API_URL = "LoanDetails/0/token";

    //Event Binding
    this.btnAdd_onClick = this.btnAdd_onClick.bind(this);
    this.btnEdit_onClick = this.btnEdit_onClick.bind(this);
    this.btnDelete_onClick = this.btnDelete_onClick.bind(this);
    this.btnSave_onClick  =  this.btnSave_onClick.bind(this);
    
  }
  componentDidMount() {
         
 
  const obj = JSON.parse(sessionStorage.getItem("authUser"));
  if (obj.isAdmin == true){
    let vformData = new FormData();



    vformData.append("AccountType", 6);
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, this.API_URL, "productData", true);


  }
 
    
  }
  btnAdd_onClick(event, values) {
    this.props.history.push(`${this.rtPage_Add}`);
  }
  btnEdit_onClick(Id) {
    this.props.history.push(`${this.rtPage_Edit}/${Id}`, {});
  }
  

  btnSave_onClick (event, formData)  {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();



    vformData.append("AccountType", 6);
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, this.API_URL, "productData", true);



  }


  btnDelete_onClick(Id) {
   
  }
  
  render() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    const sumloanamount = this.state.productData.reduce((total, row) => total + row.LoanAmount, 0);
    const sumloanemi = this.state.productData.reduce((total, row) => total + row.LoanEMI, 0);
    const dueamount = this.state.productData.reduce((total, row) => total + row.DueAmount, 0);
    const TotalDueAmount = this.state.productData.reduce((total, row) => total + row.TotalDueAmount, 0);
    const PenaltyAmount = this.state.productData.reduce((total, row) => total + row.PenaltyAmount, 0);
   



    const columns = [{


      dataField: 'MemberName',
      text: 'MemberName',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
   
    },
     {
      dataField: 'MemberAccountNo',
      text: 'MemberAccountNo',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
   
    },
    {
      dataField: 'SchemeName',
      text: 'SchemeName',
      sort: true,
      footer: columnData => (
        <div>
        
        </div>
      )
   
    },
    {
      dataField: 'LoanAmount',
      text: 'LoanAmount',
      sort: true,
      footer: columnData => (
        <div>
         {sumloanamount}
        </div>
      )
   
     
    },
    {
      dataField: "LoanEMI",
      text: "LoanEMI",
      footer: columnData => (
        <div>
         {sumloanemi}
        </div>
      )
    } ,
    {
      dataField: "DueAmount",
      text: "DueAmount",
      footer: columnData => (
        <div>
         {dueamount}
        </div>
      )
    } ,
    {
      dataField: "PenaltyAmount",
      text: "PenaltyAmount",
      footer: columnData => (
        <div>
         {PenaltyAmount}
        </div>
      )
    } ,
    {
      dataField: "PenaltyInterest",
      text: "PenaltyInterest",
      footer: columnData => (
        <div>
         
        </div>
      )
    } ,
    {
      dataField: "MainInterest",
      text: "MainInterest",
      footer: columnData => (
        <div>
         
        </div>
      )
    } ,
    {
      dataField: "TotalDueAmount",
      text: "TotalDueAmount",
      footer: columnData => (
        <div>
         {TotalDueAmount}
        </div>
      )
    } ,
    {
      dataField: "OpeningDate",
      text: "OpeningDate",
      footer: columnData => (
        <div>
         
        </div>
      )
    } ,
    {
      dataField: "EMIDate",
      text: "EMIDate",
      footer: columnData => (
        <div>
         
        </div>
      )
    } ,
     {
      dataField: "Edit",
      text: "Edit",
      formatter: (cellContent, row) => {
        return (
          <button
          type="button"
            className="btn btn-success btn-xs"
            onClick={() => this.btnEdit_onClick(row.Id)}
          >
            Pay
          </button>
        );
      },
      hidden: !obj.isAdmin
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
      <div className="page-content">

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
                                        {/* <Col sm="1" className="mb-3">
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
                                        </Col> */}


                                        {/* <Col sm="3" className="mb-3">
                                        <AvField name="Search" label="" value={this.state.formData.Search} placeholder="Search"  type="text"  className="form-control" />
                                        </Col> */}

                                        <Col sm="3" className="mb-3">
                                        <Button
                          type="submit"
                          color="primary"
                        
                          className="mr-1 waves-effect waves-light"
                        >
                          Refresh
                        </Button>

<></>
                        
                        

                    
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







     
      </div>
    );
  }
}
export default compose(container)(pageList_VouchersList);
