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


import SweetAlert from "react-bootstrap-sweetalert"


// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

// availity-reactstrap-validation
import {
  AvForm,
  AvField
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withRouter, Link } from "react-router-dom";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_CheckIsActive, Fn_DeleteData, Fn_ChangeStateValue } from "../../store/functions";
import  Switch  from "react-switch";
import './datatables.scss'
import * as XLSX from 'xlsx';





class pageAddEdit_PlanAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      isMDistributor : false,
      isSDistributor : false,
      isDistributor : false,
      isRetailer : false,
      switch9 : false,
      success_msg:false,
      confirm_alert: false,
      balance : [{
        AvailableBalance : 0
      }],
      CalType : true,
      page: 1,
      sizePerPage: 10,
      productData: [],
      isTDS : false,
      modal_backdrop : false,
      F_PlanMaster : -1,
      F_UserType :  -1,
      F_ServiceMaster  : -1

    };
    this.obj = this;
    this.formTitle = "Plan";
    this.breadCrumbTitle = "Plan";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.PLANMASTERL + "/0/token";
    this.pushFormName = "/add-Balancedetails";
    this.rtPage_Redirect = "/add-Balancedetails";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/PlanMasterL";
    this.syno  = this.syno.bind(this);
    this.tog_backdrop =  this.tog_backdrop.bind(this);
    this.saveplanname  =  this.saveplanname.bind(this);
    this.filterarray  =  this.filterarray.bind(this);
    this.exportToExcel  =  this.exportToExcel.bind(this);
    
    
  }
  componentDidMount() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    Fn_CheckIsActive(this.obj, obj.uid);
    //Filing Dropdown

    
    Fn_FillListData(this.obj, "planmaster", API_WEB_URLS.MASTER + "/0/token/PlanMaster/Id/0");
    Fn_FillListData(this.obj, "servicemaster", API_WEB_URLS.MASTER + "/0/token/ServiceMaster/Id/0");
    Fn_FillListData(this.obj, "usertypemaster", API_WEB_URLS.MASTER + "/0/token/UserType/Id/0");

    Fn_FillListData(this.obj, "MainData", API_WEB_URLS.MASTER + "/0/token/PlanMasterL/Id/0");
   
    

    const { id } = this.props.match.params;

    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
  }
  
  exportToExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(this.state.MainData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Plans');
                XLSX.writeFile(workbook, 'Plans.xlsx');
    
  };


 

  filterarray () {


const filterValues = {
  F_PlanMaster: this.state.F_PlanMaster,
  F_ServiceMaster: this.state.F_ServiceMaster,
  F_UserType: this.state.F_UserType
};


  // Use the filter() method to create a new filtered array
  const filteredArray = this.state.MainData.filter(item => {
    const matches = (
      (filterValues.F_PlanMaster == -1 || item.F_PlanMaster == filterValues.F_PlanMaster) &&
      (filterValues.F_ServiceMaster == -1 || item.F_ServiceMaster == filterValues.F_ServiceMaster) &&
      (filterValues.F_UserType == -1 || item.F_UserType == filterValues.F_UserType)
    );

   

    return matches;
  });

  this.setState({productData : filteredArray});

}







  
  syno () {
    this.setState({success_msg : false ,update_msg : false})
    Fn_FillListData(this.obj, "productData", API_WEB_URLS.MASTER + "/0/token/PlanMasterL/Id/0");
    this.setState({formData:{
      F_PlanMaster : -1,
      F_ServiceMaster : -1,
      F_UserType : -1,
      From : '',
      To : '',
      CalType : false,
      switch9 : false,
      Amount : ''

    }})


  //  this.props.history.push(`${this.rtPage_Redirect}`, {});
  }

  removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  tog_backdrop() {
    this.setState(prevState => ({
      modal_backdrop: !prevState.modal_backdrop,
    }))
    this.removeBodyCss()
  }

   handleDelete  (rowId)  {
    Fn_DeleteData(this.obj, rowId, this.API_URL, this.API_URL + "/Id/0");
  };


  btnSave_onClick(event, formData) {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    if (formData.F_PlanMaster > 0 && formData.F_ServiceMaster > 0 && formData.F_UserType > 0 && formData.From>0 && formData.To>0
      )

      {
   
    let vformData = new FormData();
   
      //Information
      vformData.append("F_PlanMaster", formData.F_PlanMaster);
      vformData.append("F_ServiceMaster", formData.F_ServiceMaster);
      vformData.append("F_UserType", formData.F_UserType);
      vformData.append("RangeFrom", formData.From );
      vformData.append("RangeTo", formData.To);
      vformData.append("IsTDS", this.state.isTDS ? true : false);
      vformData.append("IsFlat",this.state.CalType ? true : false );
      vformData.append("IsCharge", this.state.switch9 ? true : false);
      vformData.append("Amount", formData.Amount);
      vformData.append("UserId", obj.uid);
    

      if (!this.state.id)    {
        Fn_AddEditData(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, "#", true , "VoucherId");
      }

      else if (obj.isAdmin == true) {
        Fn_AddEditData(this.obj, { arguList: { id: this.state.id, formData: vformData } }, this.API_URL_SAVE, "#", true , "kuku" , "update_msg");
      }
}

else{
  alert('Fill all details!');
}

  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };

  saveplanname () {

  }
  
  render() {

    const columns = [{
      dataField: 'Plan',
      text: 'Plan',
      sort: true,
    }, {
      dataField: 'Service',
      text: 'Service',
      sort: true
    }, {
      dataField: 'Range',
      text: 'Range',
      sort: true
    }, {
      dataField: 'Type',
      text: 'Type',
      sort: true
    }, {
      dataField: 'CalType',
      text: 'Cal Type',
      sort: true
    },
    
    {
      dataField: 'TDS',
      text: 'TDS',
      sort: true
    },
    {
      dataField: 'Amount',
      text: 'Value',
      sort: true
    },
    {
      dataField: 'UserType',
      text: 'User',
      sort: true
    },
    {
      dataField: "remove",
      text: "Delete",
      formatter: (cellContent, row) => {
        return (
          <button
          type="button"
            className="btn btn-danger btn-xs"
            onClick={() => this.handleDelete(row.id)}
          >
            Delete
          </button>
        );
      },
    },

    
  
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

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    
const Offsymbolb = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      {" "}
      No
    </div>
  )
}


const OnSymbolb = props => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      {" "}
      Yes
    </div>
  )
}


   
const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      {" "}
      Per
    </div>
  )
}


const OnSymbol = props => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      {" "}
      Flat
    </div>
  )
}





    return (
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
                    {/* <h4 className="card-title mb-4">Basic Wizard</h4> */}
                    <div className="wizard clearfix">
                     
                      <div className="content clearfix">
                        <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                         
                                <Row>
                                  <Col lg="12">
                                  <Card>
                                    <CardBody> 
                                 
                                     

                                    <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Plan</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField  name="F_PlanMaster" label="" value={this.state.formData.F_PlanMaster === null ? '-1'   : this.state.formData.F_PlanMaster} onChange={(e) => Fn_ChangeStateValue(this.obj, 'F_PlanMaster', e.target.value , "Plan")}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.planmaster
                                              ? this.state.planmaster.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                          <Link to="#"  className="text-success"  onClick={this.tog_backdrop}>
                                                                        <i className="mdi mdi-plus font-size-18 mr-3" id="deletetooltip"></i>
                                                                        <UncontrolledTooltip placement="top" target="deletetooltip">
                                                                            Add
                                                                        </UncontrolledTooltip >
                                                                    </Link>
                                        </Col>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="age" className="col-form-label"> Service</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField  name="F_ServiceMaster" label="" value={this.state.formData.F_ServiceMaster === null ? '-1'   : this.state.formData.F_ServiceMaster} onChange={(e) => Fn_ChangeStateValue(this.obj, 'F_ServiceMaster', e.target.value, "Plan")}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.servicemaster
                                              ? this.state.servicemaster.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">User Type</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField  name="F_UserType" label="" value={this.state.formData.F_UserType === null ? '-1'   : this.state.formData.F_UserType} onChange={(e) => Fn_ChangeStateValue(this.obj, 'F_UserType', e.target.value,"Plan")}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.usertypemaster
                                              ? this.state.usertypemaster.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>
                                      </Row> 

                                      <Col sm="2" className="mb-3">
                                          <h4>Range </h4>
                                        </Col>
                                      <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">From</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="From" label="" value={this.state.formData.From === null ? ''   : this.state.formData.From}   placeholder="from"   type="number"  className="form-control" />
                                        </Col>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">To</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="To" label="" value={this.state.formData.To === null ? ''   : this.state.formData.To}   placeholder="to"   type="number"  className="form-control" />
                                        </Col>
                                      </Row> 


                                      <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Is Charges</label>
                                        </Col>
                                        <Col sm="2">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-12 mb-3"
                            onColor="#ec4561"
                            offColor="#00ff00"
                            onChange={() =>
                              this.setState({ switch9: !this.state.switch9 })
                            }
                            checked={this.state.switch9}
                          />
                                        </Col>
                                      
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Cal type</label>
                                        </Col>
                                        <Col sm="2">
                                        <Switch
                            uncheckedIcon={<Offsymbol />}
                            checkedIcon={<OnSymbol />}
                            className="me-3 mb-lg-8 mb-2"
                            onColor="#ec4561"
                            offColor="#00ff00"
                            onChange={() =>
                              this.setState({ CalType: !this.state.CalType })
                            }
                            checked={this.state.CalType}
                          />
                                        </Col>


                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Is TDS</label>
                                        </Col>
                                        <Col sm="2">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-12 mb-3"
                            onColor="#ec4561"
                            offColor="#00ff00"
                            onChange={() =>
                              this.setState({ isTDS: !this.state.isTDS })
                            }
                            checked={this.state.isTDS}
                          />
                                        </Col>


                                        
                                      </Row> 

                                      <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Amount</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="Amount" label="" value={this.state.formData.Amount === null ? ''   : this.state.formData.Amount}   placeholder="Amount"   type="number"  className="form-control" />
                                        </Col>
                                      </Row> 
                                 
                                      <div className="d-flex flex-wrap gap-2">
                                      <Button
                          type="submit"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          Add
                        </Button>

                        <Button
                          type="button"
                          color="secondary"
                          className="waves-effect"
                          onClick={this.btnCancel_onClick}
                        >
                          Cancel
                        </Button>

                        <Button
                          type="button"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                          onClick={this.exportToExcel}
                        >
                          Excel
                        </Button>
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

              <Modal
                        isOpen={this.state.modal_backdrop}
                        toggle={this.tog_backdrop}
                        scrollable={true}
                        backdrop={'static'}
                        id="staticBackdrop"
                      >
                        <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">Add Plan</h5>
                          <button type="button" className="btn-close" onClick={() =>
                            this.setState({ modal_backdrop: false })
                          } aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <AvField name="Name" label="" value={this.state.Name === null ? ''   : this.state.Name}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'Name', e.target.value)}  placeholder="Enter Plan Name ."   type="text"  className="form-control" />
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-light" onClick={() =>
                            this.setState({ modal_backdrop: false })
                          }>Cancel</button>
                          <button type="button" onClick={this.saveplanname}  className="btn btn-primary">Save</button>
                        </div>
                      </Modal>



                               
                            
                          <div className="d-flex flex-wrap gap-2">
                         

                        {this.state.success_msg ? (
                      <SweetAlert
                        title={'Success'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        You clicked the button!
                      </SweetAlert>
                    ) : null}
                     {this.state.confirm_alert ? (
                                                                <SweetAlert
                                                                    title="Are you sure?"
                                                                    warning
                                                                    showCancel
                                                                    confirmButtonText="Yes, delete it!"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="danger"
                                                                    // onConfirm={() =>this.props.btnDelete_onClick(this.props.selectedFormData)}
                                                                    // onCancel={() =>this.props.toggleDeleteConfirm(this.props.obj,formData,false)}
                                                                >
                                                                    
                                                                </SweetAlert>
                                                                ) : null}
                          </div>
                        </AvForm>
                      </div>
                      
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}
export default compose(container)(pageAddEdit_PlanAdd);
