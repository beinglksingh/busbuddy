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
    this.breadCrumbItem = "Balance Add Details";
    this.modalTitle = "Balance Add Details";
    this.rtPage_Add = "managevoucher";
    this.rtPage_Edit = "edit-managevoucher";
    this.API_URL = "GetVouchers/0/token";

    //Event Binding
    this.btnAdd_onClick = this.btnAdd_onClick.bind(this);
    this.btnEdit_onClick = this.btnEdit_onClick.bind(this);
    this.btnDelete_onClick = this.btnDelete_onClick.bind(this);
    this.btnSave_onClick  =  this.btnSave_onClick.bind(this);
    
  }
  componentDidMount() {
         
 
  // const obj = JSON.parse(sessionStorage.getItem("authUser"));
  // if (obj.isAdmin == true){
  // Fn_FillListData(this.obj, "productData", this.API_URL+'/Id/0');
  // }
  // else {
  //   Fn_FillListData(this.obj, "productData", API_WEB_URLS.MASTER + "/0/token/BalanceAddReportOtherUser/Id/"+obj.uid);
  // }
    
  }
  btnAdd_onClick(event, values) {
    this.props.history.push(`${this.rtPage_Add}`);
  }
  btnEdit_onClick(Id) {
    this.props.history.push(`${this.rtPage_Edit}/${Id}`, {});
  }
  

  btnSave_onClick (event, formData)  {



    
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.setState({FromDate : formData.FromDate ,ToDate : formData.ToDate, productData : [] })

    let vformData = new FormData();
    vformData.append("Id", obj.uid);
    vformData.append("FromDate", formData.FromDate);
    vformData.append("ToDate", formData.ToDate);
    vformData.append("F_UserMaster", obj.isAdmin == true  ? 0 : obj.uid) ;
   
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, this.API_URL, "productData", true);


  }


  btnDelete_onClick(Id) {
    Fn_DeleteData(this.obj, Id, API_WEB_URLS.MASTER+"/0/token/BalanceAddreport", API_WEB_URLS.MASTER+"/0/token/BalanceAddreport" + "/Id/0");
  }
  renderGridHeader() {
    return (
      <>
        <th >VoucherDate</th>
        <th>VoucherNo</th>
        <th>Narration</th>
        <th>Amount</th>
        <th>Remarks</th> 
        <th>User</th> 
      
      </>
    );
  }
  renderGridBody(formData) {
    
    return (
      <>
      <td >{formData.VoucherDate}</td> 
       
        <td>{formData.VoucherNo}</td>
        <td>{formData.Narration}</td>
        <td>{formData.Amount}</td>
        <td>{formData.Remarks}</td>
        <td>{formData.AdminName}</td>
        
      </>
    );
  }
  renderModalBody(selectedFormData) {
    return (
      <>
        <p className="mb-4">
         Audit Att.: <span className="text-primary">{selectedFormData.Name}</span>
        </p>
      </>
    );
  }
  render() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    const sum = this.state.productData.reduce((total, row) => total + row.Amount, 0);

    const columns = [{


      dataField: 'VoucherDate',
      text: 'Date/Time',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
   
    },
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
      dataField: 'Amount',
      text: 'Amount',
      sort: true,
      footer: columnData => (
        <div>
         {sum}
        </div>
      )
   
    },
    {
      dataField: 'Remarks',
      text: 'Remarks',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
   
     
    },
    {
      dataField: "AdminName",
      text: "User",
      hidden: !obj.isAdmin
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
            Edit
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


                                        {/* <Col sm="3" className="mb-3">
                                        <AvField name="Search" label="" value={this.state.formData.Search} placeholder="Search"  type="text"  className="form-control" />
                                        </Col> */}

                                        <Col sm="3" className="mb-3">
                                        <Button
                          type="submit"
                          color="primary"
                        
                          className="mr-1 waves-effect waves-light"
                        >
                          View
                        </Button>

<></>
                        <Button
                          type="button"
                          color="primary"
                          onClick={this.btnAdd_onClick}
                          style={{marginLeft:10}}
                          className="mr-1 waves-effect waves-light"
                        >
                          Add
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







      {/* <RCDisplayPage
        //page header paramaters
        Isbreadcrumb = {true}
        breadCrumbTitle={this.breadCrumbTitle}
        breadcrumbItem={this.breadCrumbItem}
        obj={this.obj}
        //column paramaters
        isSearchBox={true}
        isSNo={true}
        isCheckBox={true}
        isViewDetails={false}
        //grid paramaters
        gridData={this.state.gridData}
        gridHeader={this.renderGridHeader}
        gridBody={this.renderGridBody}
        btnAdd_onClick={this.btnAdd_onClick}
        btnEdit_onClick={this.btnEdit_onClick}
        btnApprove_onClick={this.btnApprove_onClick}
        btnReject_onClick ={this.btnReject_onClick}
        //delete link parameters
        confirm_alert={this.state.confirm_alert}
        confirm_alert_Approve={this.state.confirm_alert_Approve}
        success_dlg={this.state.success_dlg}
        dynamic_title={this.state.dynamic_title}
        dynamic_description={this.state.dynamic_description}
        toggleDeleteConfirm={toggleDeleteConfirm}
        toggleDeleteSuccess={toggleDeleteSuccess}
        toggleApproveConfirm ={toggleApproveConfirm}
        btnDelete_onClick={this.btnDelete_onClick}
        btnLock_onClick  =  {this.btnLock_onClick}
        btnUnLock_onClick  =  {this.btnUnLock_onClick}
        //modal paramaters
        isOpenModal={this.state.modal}
        modalTitle={this.modalTitle}
        selectedFormData={this.state.selectedFormData}
        modalBody={this.renderModalBody}
        togglemodal={togglemodal}
        //user rights
        isAdd={true}
        isEdit2={obj.isAdmin ? true : false}
        isDelete={obj.isAdmin ? true : false}
        islockshow= {false}
      ></RCDisplayPage> */}
      </div>
    );
  }
}
export default compose(container)(pageList_VouchersList);
