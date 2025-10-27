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
import Select from 'react-select';



class pageList_ComissionReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selectedFormData: {},
      gridData: [],
      confirm_alert: false,
      formData : {},
      success_dlg: false,
      dynamic_title: "",
      dynamic_description: "",
      company : [],
      page: 1,
      sizePerPage: 10,
      productData: [],
      isMDistributor : false,
      isSDistributor : false,
      isDistributor : false,
      isRetailer : false,
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Comission Report";
    this.modalTitle = "Audit Attendance";
    this.rtPage_Add = "add-customermaster";
    this.rtPage_Edit = "edit-customermaster";
    this.API_URL = "ComissionReport/0/token";
    this.API_URL_COMPANY = API_WEB_URLS.MASTER + "/0/token/CompanyMaster";

    //Event Binding
    
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
    this.exportToExcel  = this.exportToExcel.bind(this);
    this.handleSelectGroup  = this.handleSelectGroup.bind(this);
    this.onUserTypeChange  =  this.onUserTypeChange.bind(this);

  }



  exportToExcel = () => {




    const orderAndFilter = (arr) => {
    return arr.map((item) => {


       return {
        Date: item.Date,
        TransactionCode: item.TransactionCode,
        Amount: item.Amount,
        CrComm: item.CrComm,
        DrComm: item.DrComm,
        TDS: item.TDS,
        Remarks: item.Remarks
        
      };

    
    });
  };
  
  // Apply the order and filter function to your original array
  const orderedAndFilteredArray = orderAndFilter(this.state.productData);


    const worksheet = XLSX.utils.json_to_sheet(orderedAndFilteredArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ComissionReport');
    XLSX.writeFile(workbook, `ComissionReport.xlsx`);


  };

  componentDidMount() {
    Fn_FillListData(this.obj, "usertype", API_WEB_URLS.MASTER + "/0/token/UserType/Id/0");

   
  }

 


  btnSave_onClick (event, formData)  {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    let vformData = new FormData();
    vformData.append("Id",  obj.isAdmin ? this.state.F_MemberMaster :  obj.uid);
    vformData.append("FromDate", formData.FromDate);
    vformData.append("ToDate", formData.ToDate);
    vformData.append("F_ServiceMaster", this.state.F_ServiceMaster == undefined ? 0 : this.state.F_ServiceMaster);
    
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, this.API_URL, "productData", true);


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



  handleSelectGroup = selectedGroup => {

  
    this.setState({ F_MemberMaster : selectedGroup.F_UserMaster });

 
  
  }




  
  render() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    const {selectedGroup}  = this.state;
    const sumAmount = this.state.productData.reduce((total, row) => total + row.Amount, 0);
    const sumCrComm = this.state.productData.reduce((total, row) => total + row.CrComm, 0);
    const sumDrComm = this.state.productData.reduce((total, row) => total + row.DrComm, 0);
    const sumTDS = this.state.productData.reduce((total, row) => total + row.TDS, 0);

    const columns = [{
      dataField: 'Date',
      text: 'Date',
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
    }, {
      dataField: 'Amount',
      text: 'Amount',
      sort: true,
      footer: columnData => (
        <div>
         {sumAmount}
        </div>
      )
    }, {
      dataField: 'CrComm',
      text: 'Cr Comm.',
      sort: true,
      formatter: (cell, row) => (
        <span style={{ color: row.IsPaid ? 'green' : 'red' }}>{cell}</span>
      ),
      footer: columnData => (
        <div>
         {Number(sumCrComm).toFixed(2)}
        </div>
      )
    }, 
    {
      dataField: 'DrComm',
      text: 'Dr Comm.',
      sort: true,
      formatter: (cell, row) => (
        <span style={{ color: row.IsPaid ? 'green' : 'red' }}>{cell}</span>
      ),
      footer: columnData => (
        <div>
         {Number(sumDrComm).toFixed(2)}
        </div>
      )
    }, 
    {
      dataField: 'TDS',
      text: 'TDS',
      sort: true,
      footer: columnData => (
        <div>
         {Number(sumTDS).toFixed(2)}
        </div>
      )
    },
    
    {
      dataField: 'Remarks',
      text: 'Remarks',
      sort: true
    },
    {
      dataField: 'AgentId',
      text: 'AgentId',
      sort: true
    }
   ,
   {
    dataField: 'Service',
    text: 'Service',
    sort: true
  }
 

    
  
  ];

  const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
  }];

  const pageOptions = {
    sizePerPage: 50,
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

                                    {obj.isAdmin ? 
                                    
                                    <Row>
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
                                      

                                      {
                                      this.state.isDistributor == true ?

                                      <>
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
                                         
                                        </Col> 
                                        </>
                                      : null
                                    }


{
                                      this.state.isSDistributor == true ? <>
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
                                         
                                        </Col> 
                                      </> : null
                                    }
{
                                      this.state.isMDistributor == true ? <>
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
                                          
                                        </Col> 
                                      </> : null
                                    }

{
                                      this.state.isRetailer == true ? <>
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
                                        </Col> 
                                      </> : null
                                    }
                          </Row> : null}
                              
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
                                        <AvField name="FromDate" label="" value={this.state.formData.FromDate} placeholder="From Date" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
                                        </Col>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">To Date</label>
                                        </Col>
                                        <Col sm="2" className="mb-3">
                                        <AvField name="ToDate" label="" value={this.state.formData.ToDate} placeholder="To Date" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
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
                                      selectRow={selectRow}
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
export default compose(container)(pageList_ComissionReport);
