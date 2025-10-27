import React, { Component } from "react";

import {
  Container,
  Row,
  Col,

  Card,
  CardBody,

  Button,
  UncontrolledTooltip,
  Modal,
  ModalBody
} from "reactstrap";
//Import Breadcrumb
import RCDisplayPage from "../../components/Common/RCDisplayPage";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import {
  AvForm,
  AvField
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
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
  Fn_ChangeStateValue,
  Fn_GetReport
} from "../../store/functions";
import { withRouter, Link } from "react-router-dom";
import './datatables.scss';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';
import SweetAlert from "react-bootstrap-sweetalert";


import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import * as XLSX from 'xlsx';

class pageList_MemberMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      selectedFormData: {},
      MainData: [],
      confirm_alert: false,
      confirm_alert_Approve : false,
      success_dlg: false,
      dynamic_title: "Success",
      dynamic_description: "",
      IsApproved : true,
      F_UserType : -1,
      F_Distributor : -1,
      F_MDistributor : -1,
      F_SDistributor : -1,
      formData : {},
      modal_backdrop : false,
      rows : [["Data"], ["Data"], ["Data"], ["Data"], ["Data"], ["Data"],["Data"], ["Data"], ["Data"],["Data"]],
      cols:[],
      success_msg : false
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Member Details";
    this.modalTitle = "Member Details";
    this.rtPage_Add = "add-membermaster";
    this.rtPage_Edit = "edit-membermaster";
    this.API_URL = "MemberList/0/token";

    //Event Binding
    this.btnAdd_onClick = this.btnAdd_onClick.bind(this);
    this.btnEdit_onClick = this.btnEdit_onClick.bind(this);
    this.btnDelete_onClick = this.btnDelete_onClick.bind(this);
    this.btnApprove_onClick = this.btnApprove_onClick.bind(this);
    this.onsuccess = this.onsuccess.bind(this);
    this.btnReject_onClick  =  this.btnReject_onClick.bind(this);
    this.btnLock_onClick  =  this.btnLock_onClick.bind(this);
    this.btnUnLock_onClick  =  this.btnUnLock_onClick.bind(this);
    this.filterarray  =  this.filterarray.bind(this);
    this.exportToExcel  =  this.exportToExcel.bind(this);
    this.showpass =  this.showpass.bind(this);
    this.tog_backdrop =  this.tog_backdrop.bind(this);
    this.view  =  this.view.bind(this);
  }



  removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  tog_backdrop(password) {
    this.setState(prevState => ({
      modal_backdrop: !prevState.modal_backdrop,
      password : password
    }))
    this.removeBodyCss()
  }



  componentDidMount() {
         
 
  const obj = JSON.parse(sessionStorage.getItem("authUser"));
  // Fn_FillListData(this.obj, "MainData", this.API_URL);

  // Fn_FillListData(this.obj, "productData", this.API_URL);


  // Fn_FillListData(this.obj, "usertypemaster", API_WEB_URLS.MASTER + "/0/token/UserType/Id/0");
  // Fn_FillListData(this.obj, "distributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/Id/3");
  // Fn_FillListData(this.obj, "sdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/Id/2");
  // Fn_FillListData(this.obj, "mdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/Id/1");
    
  }



  view () {



    
    this.setState({MainData : [], productData : []})
     let vformData = new FormData();
    // vformData.append("F_UserType", this.state.F_UserType  == '' || this.state.F_UserType  == undefined  ? 0 : this.state.F_UserType);
    // vformData.append("F_Distributor", this.state.F_Distributor  == '' || this.state.F_Distributor  == undefined  ? 0 : this.state.F_Distributor);
    // vformData.append("F_SDistributor", this.state.F_SDistributor  == '' || this.state.F_SDistributor  == undefined  ? 0 : this.state.F_SDistributor);
    // vformData.append("F_MDistributor", this.state.F_MDistributor == '' || this.state.F_MDistributor == undefined ? 0 : this.state.F_MDistributor);
    
    Fn_GetReport(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL, "MainData", true);


    // this.setState({MainData : [], productData : []})
    // Fn_FillListData(this.obj, "productData", this.API_URL);
    //   Fn_FillListData(this.obj, "MainData", this.API_URL);
     
    //   this.filterarray;
   
  }


  exportToExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(this.state.MainData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Memberlists');
                XLSX.writeFile(workbook, 'Memberlist.xlsx');
    
  };

  btnAdd_onClick(event, values) {
    this.props.history.push(`${this.rtPage_Add}`);
  }
  btnEdit_onClick(formData) {
    this.props.history.push(`${this.rtPage_Edit}/${formData.Id}`, {});
  }
  btnApprove_onClick(formData) {
    Fn_AddEditData(
      this.obj,
      { arguList: 
        { id: formData.Id,
            } },
      "ApproveMember/0/token",
      "#"
    );
 
 
  }


  btnLock_onClick(formData) {
    Fn_AddEditData(
      this.obj,
      { arguList: 
        { id: formData.Id,
            } },
      "LockMember/0/token",
      "#"
    );
 
 
  }

  btnUnLock_onClick(formData) {
    Fn_AddEditData(
      this.obj,
      { arguList: 
        { id: formData.Id,
            } },
      "UnLockMember/0/token",
      "#"
    );
 
 
  }

  btnReject_onClick(formData) {
    Fn_AddEditData(
      this.obj,
      { arguList: 
        { id: formData.Id,
            } },
      "RejectMember/0/token",
      "#"
    );
 
 
  }

  onsuccess() {

  
    Fn_FillListData(this.obj, "MainData", this.API_URL);


    this.setState({success_dlg : false ,success_msg : false, confirm_alert_Approve : false})
  }
  filterarray () {


    const filterValues = {
      F_UserType: this.state.F_UserType,
      F_Distributor: this.state.F_Distributor,
      F_SDistributor: this.state.F_SDistributor,
      F_MDistributor: this.state.F_MDistributor
    };
    
    
      // Use the filter() method to create a new filtered array
      const filteredArray = this.state.productData.filter(item => {
        const matches = (
          (filterValues.F_UserType == -1 || item.F_UserType == filterValues.F_UserType)&&
          (filterValues.F_Distributor == -1 || item.F_Distributor == filterValues.F_Distributor) &&
          (filterValues.F_SDistributor == -1 || item.F_SDistributor == filterValues.F_SDistributor)&&
          (filterValues.F_MDistributor == -1 || item.F_MDistributor == filterValues.F_MDistributor)
        );
    
       
    
        return matches;
      });
    
      this.setState({MainData : filteredArray});
    
    }

  btnDelete_onClick(formData) {
    Fn_DeleteData(this.obj, formData.Id, this.API_URL, this.API_URL + "/Id/0");
  }


  showpass () {
     
    if (this.state.PassKey  ==  'abc'){
      alert(this.state.password);
    }
    else{
      alert('Passkey is wrong!')
    }
    this.setState({modal_backdrop : false,PassKey:''})
  }



  renderGridHeader() {
    return (
      <>
        <th >Name</th>
        <th>User Type</th>
        <th>User Name</th>
        <th>Password</th>
        <th>OTP</th>
        <th>Plan</th>
        <th>Mobile No</th>
        <th>D_Code</th> 
        <th>SD_Code</th> 
        <th>MD_Code</th> 
      </>
    );
  }
  renderGridBody(formData) {
    var color = ''
    if (formData.IsApproved  == true){
      color = 'green';
    }
    else if (formData.IsApproved  == false && formData.IsKYCReject  == true){
      color =  'red';
    }
    else {
      color = 'blue';
    }
    return (
      <>
      <td style={{color: color}}>{formData.Name}</td> 
       
        <td>{formData.UserType}</td>
        <td>{formData.UserName}</td>
        <td>
        <Button
                          type="button"
                          color="primary"
                          style={{marginLeft:10}}
                          onClick={()=>this.tog_backdrop(formData.Password)}
                          className="mr-1 waves-effect waves-light"
                        >
                          View
                        </Button>
        </td>
        <td>
        <Button
                          type="button"
                          color="primary"
                          style={{marginLeft:10}}
                          onClick={()=>this.tog_backdrop(formData.OTP)}
                          className="mr-1 waves-effect waves-light"
                        >
                          View
                        </Button>
        </td>
        <td>{formData.PlanName}</td>
        <td>{formData.MobileNo}</td>
        <td>{formData.D_Code}</td>
        <td>{formData.SD_Code}</td>
        <td>{formData.MD_Code}</td>
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
    const columns = [

       
      
      {
      dataField: 'Name',
      text: 'Name',
      sort: true,
      sort: true,
      formatter: (cell, row) => (
        <span style={{ color: row.IsApproved  ==  true  ? 'green' : row.IsApproved == false && row.IsKYCReject   ? 'red' : 'blue' }}>{cell}</span>
      ),
    }, {
      dataField: 'UID',
      text: 'UID',
      sort: true
    },
    {
      dataField: 'PAN',
      text: 'PAN',
      sort: true,
     
    },
     {
      dataField: 'Gender',
      text: 'Gender',
      sort: true,
     
    },
    {
      dataField: "action",
      text: "Password",
      hidden: !obj.isAdmin,
      formatter: (cellContent, row) => {
        return (
          <button
          type="button"
                          color="primary"
                          style={{marginLeft:10}}
                          className="mr-1 waves-effect waves-light"
            onClick={()=>this.tog_backdrop(row.Password)}
          >
            
          View
          </button>
        );
      }
    },

    // {
    //   dataField: "action",
    //   text: "OTP",
    //   hidden: !obj.isAdmin,
    //   formatter: (cellContent, row) => {
    //     return (
    //       <button
    //       type="button"
    //                       color="primary"
    //                       style={{marginLeft:10}}
    //                       className="mr-1 waves-effect waves-light"
    //         onClick={()=>this.tog_backdrop(row.OTP)}
    //       >
            
    //       View
    //       </button>
    //     );
    //   }
    // },
     {
      dataField: 'Plan',
      text: 'Plan',
      sort: true,
     
    },
     {
      dataField: 'MobileNo',
      text: 'Mobile No',
      sort: true,
     
    },

    {
      dataField: 'Email',
      text: 'Email',
      sort: true,
     
    },
    {
      dataField: 'Edit',
      text: 'Edit',
      sort: false,
      formatter: (cellContent, row) => {
          return (
            <Link to="#" value={row} className="mr-3 text-primary" onClick={() => this.btnEdit_onClick(row)}>
            <i className="mdi mdi-pencil font-size-18 mr-3" id="edittooltip"></i>
            <UncontrolledTooltip placement="top" target="edittooltip">
                Edit
            </UncontrolledTooltip >
        </Link>
          );
      },
    }
  
     
  
  ]
    

  const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
  }];

  const pageOptions = {
    sizePerPage: 25,
    totalSize: this.state.MainData.length, // replace later with size(customers),
    custom: true,
  }

  // Custom Pagination Toggle
  const sizePerPageList = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '15', value: 15 },
    { text: '20', value: 20 },
    { text: '25', value: 25 },
    { text: 'All', value: (this.state.MainData).length }];


  // Select All Button operation
  const selectRow = {
    mode: 'checkbox'
  }

  const { SearchBar } = Search;


    return (
      <>
          
      <div className="page-content">
      <Row>
                                  <Col lg="12">
                                  <Card>
                                    <CardBody> 

                                    <Row>

                                        <Col sm="4">
                                        
                        <Button
                          type="button"
                          color="primary"
                          style={{marginLeft:10}}
                          onClick={this.exportToExcel}
                          className="mr-1 waves-effect waves-light"
                        >
                          Excel
                        </Button>


                        <Button
                          type="button"
                          color="primary"
                          style={{marginLeft:10}}
                          onClick={this.view}
                          className="mr-1 waves-effect waves-light"
                        >
                          View
                        </Button>

                        </Col>

                        
                        <Col sm="4">
                                        
                                        <Button
                                          type="button"
                                          color="primary"
                                          style={{marginLeft:10}}
                                          onClick={this.btnAdd_onClick}
                                          className="mr-1 waves-effect waves-light"
                                        >
                                          Add
                                        </Button>
                
                
                                        </Col>


                        <Modal
                        isOpen={this.state.modal_backdrop}
                        toggle={this.tog_backdrop}
                        scrollable={true}
                        backdrop={'static'}
                        id="staticBackdrop"
                      >
                        <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">Show Password</h5>
                          <button type="button" className="btn-close" onClick={() =>
                            this.setState({ modal_backdrop: false })
                          } aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          
                          <input name="PassKey" label="" value={this.state.PassKey === null ? ''   : this.state.PassKey}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'PassKey', e.target.value)}  placeholder="Enter PassKey ."   type="text"  className="form-control" />
                          
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn" onClick={() =>
                            this.setState({ modal_backdrop: false })
                          }>Cancel</button>
                          <button type="button" onClick={this.showpass}  className="btn btn-primary">Proceed</button>
                        </div>
                      </Modal>

                                      </Row> 
                                    
                                    </CardBody>
                                  </Card>
                                  </Col>
                                 
                                </Row>
                                {this.state.success_dlg ? (
                                                                  <SweetAlert
                                                                    success
                                                                    title={'Updated'}
                                                                    onConfirm={this.onsuccess}
                                                                  >
                                                                    Done
                                                                  </SweetAlert>
                                                                ) : null}

{this.state.confirm_alert_Approve ? (
                                                                <SweetAlert
                                                                    title="Are you sure?"
                                                                    warning
                                                                    showCancel
                                                                    confirmBtnText="Yes, Approve!"
                                                                    cancelBtnText ="Reject"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="danger"
                                                                    onConfirm={() =>this.btnApprove_onClick(this.state.selectedFormData)}
                                                                    onCancel={() =>this.btnReject_onClick(this.state.selectedFormData)}
                                                                >
                                                                    Do you really wanna approve ?
                                                                </SweetAlert>
                                                                ) : null}
                                
                         <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField='id'
                      columns={columns}
                      data={this.state.MainData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField='id'
                          columns={columns}
                          data={this.state.MainData}
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
        MainData={this.state.MainData}
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
        toggleDeleteSuccess={this.onsuccess}
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
        isEdit2={true}
        isDelete={true}
        islockshow= {true}
        showpass={this.showpass}
        tog_backdrop ={this.tog_backdrop}
      ></RCDisplayPage> */}
      </div>
      </>
    );
  }
}
export default compose(container)(pageList_MemberMaster);
