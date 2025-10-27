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
import Select from 'react-select';


function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
class pageList_TopRetailer extends Component {
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
      commissionmodal : false,
      success_dlg : false,
      rows : [["Data"], ["Data"], ["Data"], ["Data"], ["Data"], ["Data"],["Data"], ["Data"], ["Data"],["Data"]],
      cols:[],
      F_Type : 0
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Top and Low Retailer";
    
    this.API_URL = "TopRetailer/0/token";
    

    //Event Binding
    
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
  
    this.syno  =  this.syno.bind(this);
   
   
    this.exportToExcel  =  this.exportToExcel.bind(this);
    this.handleSelectGroup  = this.handleSelectGroup.bind(this);
    this.onUserTypeChange  =  this.onUserTypeChange.bind(this);
  }

  exportToExcel = () => {

    let vformData = new FormData();
    vformData.append("Id", this.state.F_MemberMaster == "undefined" || this.state.F_MemberMaster == '' || this.state.F_MemberMaster == null ? 0 : this.state.F_MemberMaster );
    vformData.append("FromDate", this.state.FromDate);
    vformData.append("ToDate",  this.state.ToDate);
    
    Fn_ExportExcel(this.obj, { arguList: { id: 0, formData: vformData } }, "TopRetailer/0/token", this.state.FromDate + '-' + this.state.ToDate+ " TDS REPORT", true);
    
  };






 

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



  componentDidMount() {
    Fn_FillListData(this.obj, "usertype", API_WEB_URLS.MASTER + "/0/token/UserType/Id/0");

   
  }
  syno(){
    this.setState({success_msg : false, success_dlg : false})
  }
 

  btnSave_onClick (event, formData)  {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.setState({FromDate : formData.FromDate ,ToDate : formData.ToDate })

    let vformData = new FormData();
    vformData.append("Id", this.state.F_MemberMaster == "undefined" || this.state.F_MemberMaster == '' || this.state.F_MemberMaster == null ? 0 : this.state.F_MemberMaster );
    vformData.append("FromDate", formData.FromDate);
    vformData.append("ToDate", formData.ToDate);
    
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, this.API_URL, "productData", true);


  }


  



  
  render() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
  //   let columnNames =this.state.rows[0];
  const sumDMR = this.state.productData.reduce((total, row) => total + row.TotalDMR, 0);
  const sumAEPS = this.state.productData.reduce((total, row) => total + row.TotalAEPS, 0);
  const sumIndo = this.state.productData.reduce((total, row) => total + row.TotalIndo, 0);
  const sumRecharge = this.state.productData.reduce((total, row) => total + row.TotalRecharge, 0);





    

  //  // Assuming the first row has column names
  //   const columns = columnNames.map((columnName) => ({
  //     dataField: columnName,
  //     text: columnName,
  //     sort: true,
  //   }));


  const columns = [{


    dataField: 'AgentId',
    text: 'AgentId',
    sort: true,
    footer: columnData => (
      <div>
       
      </div>
    )
 
  },
   {
    dataField: 'Name',
    text: 'Name',
    sort: true,
    footer: columnData => (
      <div>
       
      </div>
    )
 
  },
  {
    dataField: 'TotalDMR',
    text: 'TotalDMR',
    sort: true,
    footer: columnData => (
      <div>
       {sumDMR}
      </div>
    )
 
  },
  {
    dataField: 'TotalAEPS',
    text: 'TotalAEPS',
    sort: true,
    footer: columnData => (
      <div>
       {sumAEPS}
      </div>
    )
 
   
  },
  {
    dataField: "TotalIndo",
    text: "TotalIndo",
    footer: columnData => (
      <div>
       {sumIndo}
      </div>
    )
  } ,
  {
    dataField: "TotalRecharge",
    text: "TotalRecharge",
    footer: columnData => (
      <div>
       {sumRecharge}
      </div>
    )
  } 
  

];



  const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
  }];

  const pageOptions = {
    sizePerPage: 100,
    totalSize: this.state.productData.length, // replace later with size(customers),
    custom: true,
  }

  // Custom Pagination Toggle
  const sizePerPageList = [
    { text: '100', value: 100},
    { text: '200', value: 200 },
    { text: '300', value: 300 },
    { text: '400', value: 400 },
    { text: '500', value: 500 },
    { text: 'All', value: (this.state.productData).length }];


  // Select All Button operation
  const selectRow = {
    mode: 'checkbox'
  }

  const { SearchBar } = Search;

  const {selectedGroup}  = this.state;

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
                            </Row>

                            <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> From Date</label>
                                        </Col>
                                        <Col sm="3" className="mb-3">
                                        <AvField name="FromDate" label="" value={this.state.formData.FromDate  ==  undefined ? getCurrentDate() : this.state.formData.FromDate} placeholder="From Date" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
                                        </Col>

                                        <Col sm="2" className="mb-3">
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
                        sizePerPageList
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
export default compose(container)(pageList_TopRetailer);
