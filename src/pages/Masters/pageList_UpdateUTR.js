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


function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
class pageList_UpdateUTR extends Component {
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
      Charges : 0,
      commissionmodal : false,
      success_dlg : false,
      confirm_undorefund : false,
      title : '',
      UTR : ''

    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "UPDATE UTR";
    this.modalTitle = "Audit Attendance";
    this.rtPage_Add = "add-customermaster";
    this.rtPage_Edit = "edit-customermaster";
    this.API_URL = "UTRUpdateList/0/token";
    

    //Event Binding
    
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
   
    this.syno  =  this.syno.bind(this);
    this.edit  =  this.edit.bind(this);
   
    this.exportToExcel  = this.exportToExcel.bind(this);
    this.proceededit  =  this.proceededit.bind(this);
    this.updateutr  = this.updateutr.bind(this);
    this.UpdateAllUTR  = this.UpdateAllUTR.bind(this);
   
  }

   exportToExcel = () => {

    let vformData = new FormData();
    
    vformData.append("FromDate", this.state.FromDate);
    vformData.append("ToDate",  this.state.ToDate);
    
    Fn_ExportExcel(this.obj, { arguList: { id: 0, formData: vformData } }, "DMRExcel/0/token", "DMRTransaction", true);
    
  };


  updateutr = async(Id)=>{


    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"KotakTransfer/0/token/"+Id ).then(token => { return token } )
    }
    let userToken2 = await AuthUser2();

    if (userToken2.status == 200){
      if(userToken2.message == -2){
        this.setState({updateutrdlg : true, message : 'Transaction status is still success. UTR not found'});
      }
      else if (userToken2.message == -4){
        this.setState({updateutrdlg : true, message : 'Transaction Failed. REFUNDED'});
      }
      else if (userToken2.message == -5){
        this.setState({updateutrdlg : true, message : 'Transaction PAID. UTR Updated'});
      }

      else {
        this.setState({updateutrdlg : true, message : 'Some error ocurred!'});

      }
      let vformData = new FormData();
      vformData.append("Id", 0);
      vformData.append("FromDate", this.state.FromDate);
      vformData.append("ToDate", this.state.ToDate);
     
      vformData.append("Mode", this.state.ModeId == '' ? 0 : this.state.ModeId);
      vformData.append("F_MemberMaster", this.state.F_MemberMaster == '' ? 0 : this.state.F_MemberMaster);
     
      Fn_GetReport(this.obj, { arguList: { id: 0, formData: vformData } }, "UTRUpdateList/0/token", "productData", true);
    }

    else {
      alert('some error ocurred!')
    }


    

  }


  edit (Id){

   // const foundItem = this.state.productData.find(item => item.Id === Id);

    this.setState ({
      //F_RetailerComission : foundItem.F_RetailerComission,
      F_DMRId   : Id,
      commissionmodal : true
    });

  }

 



  componentDidMount() {
   
    Fn_FillListData(this.obj, "users", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/4");
  }



  syno(){
    this.setState({success_msg : false, success_dlg : false , commissionmodal : false, updateutrdlg: false})
  }
 


  btnSave_onClick (event, formData)  {



    
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.setState({FromDate : formData.FromDate ,ToDate : formData.ToDate , ModeId :formData.ModeId, F_MemberMaster : formData.F_RetailerId })

    let vformData = new FormData();
    vformData.append("Id", 0);
    vformData.append("FromDate", formData.FromDate);
    vformData.append("ToDate", formData.ToDate);
   
    vformData.append("Mode", formData.ModeId == '' ? 0 : formData.ModeId);
    vformData.append("F_MemberMaster", formData.F_RetailerId == '' ? 0 : formData.F_RetailerId);
   
    Fn_GetReport(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL, "productData", true);


  }

  UpdateAllUTR (event, formData)  {

   
    let vformData = new FormData();
    vformData.append("Id", 0);
    vformData.append("FromDate", this.state.FromDate);
    vformData.append("ToDate", this.state.ToDate);
   
    vformData.append("Mode", this.state.ModeId == '' ? 0 : this.state.ModeId);
    vformData.append("F_MemberMaster", this.state.F_MemberMaster == '' ? 0 : this.state.F_MemberMaster);
   
    Fn_GetReport(this.obj, { arguList: { id: 0, formData: vformData } }, "UTRUpdateListMa/0/token", "dater", true);


  }



  proceededit() {

    Fn_AddEditData(
      this.obj,
      {
        arguList: {
          id: this.state.F_DMRId,
          name: this.state.UTR
        },
      },
      API_WEB_URLS.MASTER + "/0/token/UpdateUTR",
     "#",
     false,
     "updateutr"
    );


  

  }






  
  render() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    const sumAmount = this.state.productData.reduce((total, row) => total + row.Amount, 0);

    const columns = [
      
     {
        dataField: "action",
        text: "Update UTR",
        formatter: (cellContent, row) => {
          return (
            <button
            type="button"
            
              className="btn btn-success btn-xs"
              onClick={() => this.updateutr(row.Id)}
            >
              
             Update UTR
            </button>
          );
        },
      } 
  
      , {
        dataField: "action",
        text: "Update UTR(M)",
        formatter: (cellContent, row) => {
          return (
            <button
            type="button"
           
              className="btn btn-danger btn-xs"
              onClick={() => this.edit(row.Id)}
            >
              
             Update UTR(M)
            </button>
          );
        },
      } ,
      {
      dataField: 'DateTime',
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
      dataField: 'Mode',
      text: 'Mode',
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
         {sumAmount}
        </div>
      )
     
    },
     {
      dataField: 'UTR',
      text: 'UTR',
      sort: true,
     
    },
    
    {
      dataField: 'TransactionStatus',
      text: 'TransactionStatus',
      sort: true,
      formatter: (cell, row) => (
        <span style={{ color: row.F_TransactionStatusCode  ==  2  ? 'purple' : row.F_TransactionStatusCode == 3  ? 'green' : 'red' }}>{cell}</span>
      ),
    },
     {
      dataField: 'SenderMobile',
      text: 'SenderMobile',
      sort: true,
     
    },

    {
      dataField: 'AccountHolderName',
      text: 'AccountHolderName',
      sort: true,
     
    },
    
    {
      dataField: 'AccountNo',
      text: 'AccountNo',
      sort: true,
     
    },
    
     {
     dataField: 'IFSC',
      text: 'IFSC',
      sort: true,
     
    },
     {
      dataField: 'TransactionFrom',
      text: 'TransactionFrom',
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
                                          <label htmlFor="firstName" className="col-form-label"> Select Mode</label>
                                        </Col>
                                    <Col sm="3">
                                      
                                        <AvField  name="ModeId" label="" value={this.state.formData.Mode === null ? '-1'   : this.state.formData.ModeId}   type="select" className="form-select" >
                                            <option value={0} defaultValue label={"Select"} />
                                            
                                                    <option key={1} value={2} label={'NEFT'} />
                                                    <option key={2} value={3} label={'IMPS'} />
                                                 
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

                                       


</Row>

                                    <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> From Date</label>
                                        </Col>
                                        <Col sm="3" className="mb-3">
                                        <AvField name="FromDate" label="" value={this.state.formData.FromDate  ==  undefined ? getCurrentDate() : this.state.formData.FromDate} placeholder="From Date" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
                                        </Col>

                                        <Col sm="1" className="mb-3">
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

                        <Button
                          type="button"
                          color="primary"
                          style={{marginLeft:10}}
                          onClick={this.UpdateAllUTR}
                          className="mr-1 waves-effect waves-light"
                        >
                          Update UTR
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

                         

                      <Modal
                        isOpen={this.state.commissionmodal}
                        toggle={this.commissionmodal}
                        scrollable={true}
                        backdrop={'static'}
                        id="staticBackdrop2"
                      >
                        <div className="modal-header">
                          <h5 className="modal-title" >UPDATE UTR</h5>
                          <button type="button" className="btn-close" onClick={() =>
                            this.setState({ commissionmodal: false })
                          } aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                       
                     
                        <Row>
                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">UTR</label>
                                        </Col>
                                        <Col sm="6" className="mb-3">
                          <input name="UTR" label="" value={this.state.UTR}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'UTR', e.target.value)}  placeholder="Enter UTR"   type="text"  className="form-control" />
                        </Col>
                        </Row>

                      


                        </div>
                        <div className="modal-footer">
                          <button type="button" onClick={this.proceededit} className="btn btn-info"  >Update</button>
                         
                        </div>
                      </Modal>


                         {this.state.success_msg == true ? (
                      <SweetAlert
                        title={this.state.title}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                      
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



                    
{this.state.updateutrdlg == true ? (
                      <SweetAlert
                        title={'UTR Updated!'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                      {this.state.message}
                      </SweetAlert>
                    ) : null}
                         </div>
                         </React.Fragment>



  </>
    );
  }
}
export default compose(container)(pageList_UpdateUTR);
