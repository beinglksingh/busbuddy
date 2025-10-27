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
      gridData: [],
      formData : {},
      productData: [],
      loadings : false
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Member Balance Report";
    this.API_URL = "MemberBalance/0/token";
   
    

    //Event Binding
    
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
    this.exportToExcel  = this.exportToExcel.bind(this);
  

  }

  exportToExcel () {
    const worksheet = XLSX.utils.json_to_sheet(this.state.productData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'MemberBalanceSheet');
                XLSX.writeFile(workbook, `${'MemberBalanceSheet'}.xlsx`);
  }

   


 


  componentDidMount() {
    
  Fn_FillListData(this.obj, "usertypemaster", API_WEB_URLS.MASTER + "/0/token/UserType/Id/0");
  Fn_FillListData(this.obj, "distributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/Id/3");
  Fn_FillListData(this.obj, "sdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/Id/2");
  Fn_FillListData(this.obj, "mdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/Id/1");
   
   
  }






 


  btnSave_onClick (event, formData)  {

    this.setState({loadings : true})
    let vformData = new FormData();
    vformData.append("F_UserType", this.state.F_UserType  == '' || this.state.F_UserType  == undefined  ? 0 : this.state.F_UserType);
    vformData.append("F_Distributor", this.state.F_Distributor  == '' || this.state.F_Distributor  == undefined  ? 0 : this.state.F_Distributor);
    vformData.append("F_SDistributor", this.state.F_SDistributor  == '' || this.state.F_SDistributor  == undefined  ? 0 : this.state.F_SDistributor);
    vformData.append("F_MDistributor", this.state.F_MDistributor == '' || this.state.F_MDistributor == undefined ? 0 : this.state.F_MDistributor);
    vformData.append("FromDate", "2000-01-01");
    vformData.append("ToDate", this.state.ToDate);
    
    Fn_GetReport(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL, "productData", true);

    
   
   
   

  }








  
  render() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    const sumAmount = this.state.productData.reduce((total, row) => total + row.Balance, 0);


    const columns = [
    {
      dataField: 'AgentId',
      text: 'AgentId',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
    } ,
    
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
      dataField: 'ShopName',
      text: 'ShopName',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
    },
    {
      dataField: 'Balance',
      text: 'Balance',
      sort: true,
      footer: columnData => (
        <div>
          {sumAmount}
        </div>
      )
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
    { text: '25', value: 25 },
    { text: '50', value: 50 },
    { text: '100', value: 100 },
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
        {this.state.loadings ?<Loader/> : null }  
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
                                          <label htmlFor="age" className="col-form-label">User Type</label>
                                        </Col>
                                        <Col sm="3">
                                        <select  name="F_UserType" label="" value={this.state.formData.F_UserType === null ? '-1'   : this.state.formData.F_UserType} onChange={(e) => Fn_ChangeStateValue(this.obj, 'F_UserType', e.target.value,"")}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.usertypemaster
                                              ? this.state.usertypemaster.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </select> 
                                        </Col>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">Dist</label>
                                        </Col>
                                        <Col sm="3">
                                        <select  name="F_Distributor" label="" value={this.state.formData.F_Distributor === null ? '-1'   : this.state.formData.F_Distributor} onChange={(e) => Fn_ChangeStateValue(this.obj, 'F_Distributor', e.target.value,"")}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.distributor
                                              ? this.state.distributor.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </select> 
                                        </Col>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">S Dist</label>
                                        </Col>
                                        <Col sm="3">
                                        <select  name="F_SDistributor" label="" value={this.state.formData.F_SDistributor === null ? '-1'   : this.state.formData.F_SDistributor} onChange={(e) => Fn_ChangeStateValue(this.obj, 'F_SDistributor', e.target.value,"")}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.sdistributor
                                              ? this.state.sdistributor.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </select> 
                                        </Col>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">M Dist</label>
                                        </Col>
                                        <Col sm="3">
                                        <select  name="F_MDistributor" label="" value={this.state.formData.F_MDistributor === null ? '-1'   : this.state.formData.F_MDistributor} onChange={(e) => Fn_ChangeStateValue(this.obj, 'F_MDistributor', e.target.value,"")}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.mdistributor
                                              ? this.state.mdistributor.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </select> 
                                        </Col>


                                        {/* <Col sm="1" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">From Date</label>
                                        </Col>
                                        <Col sm="3">
                                        <input  name="FromDate" label="" value={this.state.formData.FromDate === null ? '-1'   : this.state.formData.FromDate} onChange={(e) => Fn_ChangeStateValue(this.obj, 'FromDate', e.target.value,"")}  type="date" className="form-select" >
                                           
                                          </input> 
                                        </Col> */}


                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">To Date</label>
                                        </Col>
                                        <Col sm="3">
                                        <input  name="ToDate" label="" value={this.state.formData.ToDate === null ? '-1'   : this.state.formData.ToDate} onChange={(e) => Fn_ChangeStateValue(this.obj, 'ToDate', e.target.value,"")}  type="date" className="form-select" >
                                           
                                          </input> 
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
                      sizePerPageList: sizePerPageList,
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

                         

                    




                         </div>
                         </React.Fragment>



  </>
    );
  }
}
export default compose(container)(pageList_FundRequest);
