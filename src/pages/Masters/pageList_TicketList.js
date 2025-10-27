import React, { Component } from "react";


//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store


import {

  Fn_DeleteData,
  Fn_GetReport,
  Fn_AddEditData,
  Fn_FillListData
} from "../../store/functions";

import {
  Container,
  Row,
  Col,

  Card,
  CardBody,

  Button,
 Badge
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




function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
class pageList_TicketList extends Component {
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
    this.breadCrumbItem = "Tickets";
    this.rtPage_Add = "raiseticket";
    this.API_URL = "GetTicket/0/token";
    
    //Event Binding
    this.btnAdd_onClick = this.btnAdd_onClick.bind(this);
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
    this.onChangeUSerType  =  this.onChangeUSerType.bind(this);
  }




  componentDidMount() {
    Fn_FillListData(this.obj, "usertype", API_WEB_URLS.MASTER + "/0/token/UserType/Id/0");
  }

  onChangeUSerType  (event) {
    Fn_FillListData(this.obj, "users", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/"+event.target.value);
  }


 


  btnSave_onClick (event, formData)  {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    let vformData = new FormData();
    vformData.append("FromDate", formData.FromDate);
    vformData.append("ToDate", formData.ToDate);
    vformData.append("F_Status", formData.F_Status == undefined || formData.F_Status == '' ? 0 : formData.F_Status);
    vformData.append("F_UserMaster", obj.uid);
    vformData.append("F_UserType", formData.F_UserType  ==  undefined || formData.F_UserType == '' ? 0 : formData.F_UserType);
    
    Fn_GetReport(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL, "productData", true);


  }





  btnAdd_onClick(event, values) {
    this.props.history.push(`${this.rtPage_Add}`);
  }

  render() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    const columns = [{
      dataField: 'Date',
      text: 'Date/Time',
      sort: true,
    }, {
      dataField: 'TransactionCode',
      text: 'TransactionCode',
      sort: true
    },
    {
      dataField: 'Status',
      text: 'Status',
      sort: true,
      formatter: (cellContent, row) => (
        <Badge
          className={"font-size-12 badge-soft-" + row.badgeclass}
          color={row.F_Status == 1 ? 'warning' : row.F_Status ==  '2' ? 'success' : row.F_Status == 3 ? 'danger' : 'success' }
          pill
        >
          {row.Status}
        </Badge>
      ),
     
    },

    {
      dataField: 'Id',
      text: 'Ticket No',
      sort: true,
    },

    obj.isAdmin
    ? {
        dataField: 'AgentId',
        text: 'AgentId',
        sort: true,
      } : '',
       {
        dataField: "action",
        text: "Chat",
        formatter: (cellContent, row) => {
          return (
            <button
            type="button"
            //disabled={row.IsRefund? true : false}
              className="btn btn-success btn-xs"
              onClick={() => this.props.history.push('ticketchat/'+row.Id)}
            >
              
              <i className="mdi mdi-chat font-size-18 mr-3" id="edittooltip"></i>
                                                                      
            </button>
          );
        },
      } ,



    
  
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
                                  <Col lg="12">

                                    <Row>
                                    <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Select Status</label>
                                        </Col>
                                    <Col sm="3">
                                      
                                        <AvField  name="F_Status" label="" value={this.state.formData.F_Status === null ? '-1'   : this.state.formData.F_Status}   type="select" className="form-select" >
                                            <option value={0} defaultValue label={"Select"} />
                                            
                                                    <option key={1} value={1} label={'PENDING'} />
                                                    <option key={2} value={2} label={'REPLIED'} />
                                                    <option key={3} value={3} label={'SOLVED'} />
                                                    <option key={4} value={4} label={'CLOSED'} />
                                                 
                                          </AvField> 
                                        </Col>
                                    </Row>
                                    {obj.isAdmin ?
                                  <>
                                  <Row>

<Col sm="2" className="mb-3">
  <label htmlFor="firstName" className="col-form-label"> Select User Type</label>
</Col>
<Col sm="3">
<AvField  name="F_UserType" label="" value={this.state.formData.F_UserType === null ? '-1'   : this.state.formData.F_UserType} onChange={this.onChangeUSerType}   type="select" className="form-select" >
    <option value={0} defaultValue label={"Select"} />
    {this.state.usertype
      ? this.state.usertype.map(
          (option, key) => (
            <option key={option.Id} value={option.Id} label={option.Name} />
          )
        )
      : null}
  </AvField> 
</Col>



<Col sm="2" className="mb-3">
  <label htmlFor="firstName" className="col-form-label"> Select User</label>
</Col>
<Col sm="3">
<AvField  name="F_RetailerId" label="" value={this.state.formData.F_RetailerId === null ? '-1'   : this.state.formData.F_RetailerId}   type="select" className="form-select" >
    <option value={0} defaultValue label={"Select"} />
    {this.state.users
      ? this.state.users.map(
          (option, key) => (
            <option key={option.Id} value={option.Id} label={option.Name} />
          )
        )
      : null}
  </AvField> 
</Col>
</Row></> : null 
                                  }
                              
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
                                <Col sm="8">
                                            <div className="text-sm-right">
                                                <Button type="button" onClick={this.btnAdd_onClick} color="success" className="btn-rounded waves-effect waves-light mb-2 mr-2"><i className="mdi mdi-plus mr-1"></i> Add New</Button>
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
export default compose(container)(pageList_TicketList);
