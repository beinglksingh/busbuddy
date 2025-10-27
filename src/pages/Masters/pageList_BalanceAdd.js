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
  Fn_GetReport,
  Fn_ChangeStateValue
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
import * as XLSX from 'xlsx';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import Loader from "pages/loader";
import SweetAlert from "react-bootstrap-sweetalert";



function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
class pageList_BalanceAdd extends Component {
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
      productData2: [],
      formData:{},
      rows : [["Data"], ["Data"], ["Data"], ["Data"], ["Data"], ["Data"],["Data"], ["Data"], ["Data"],["Data"]],
      cols:[],
      loading : false
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Balance Add Details";
    this.modalTitle = "Balance Add Details";
    this.rtPage_Add = "add-balance";
    this.rtPage_Edit = "edit-balance";
    this.API_URL = "BalanceAddReport/0/token";

    //Event Binding
    this.btnAdd_onClick = this.btnAdd_onClick.bind(this);
    this.btnEdit_onClick = this.btnEdit_onClick.bind(this);
    this.btnDelete_onClick = this.btnDelete_onClick.bind(this);
    this.exportToExcel  = this.exportToExcel.bind(this);
    this.btnSave_onClick  =  this.btnSave_onClick.bind(this);

    this.syno  =  this.syno.bind(this);

    this.fileHandler =  this.fileHandler.bind(this);
    this.upload  =  this.upload.bind(this);
  }


  fileHandler = () => {

    this.setState({productData : []})
    let fileObj = this.state.File;



    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if(err){
        console.log(err);            
      }
      else{

    if (2 == 3){

      const columns = resp.rows[1]; // Using the 5th sub-array as the column names
      const data = resp.rows.slice(3); // Starting from the 9th sub-array to extract data rows
     
      console.log(resp.rows);
      const transformedData = data.map((row) => {
        const rowData = {};
        columns.forEach((column, index) => {
          rowData[column] = row[index];
        });
        return rowData;
      });

     

      this.setState({
        cols: columns, // Use the column names as they are
        rows: resp.rows,
        productData2: transformedData
      });
    }

    else {
      const columns = resp.rows[0];
    const data = resp.rows.slice(1);

    // const transformedData = data.map((row) => {
    //   const rowData = {};
    //   columns.forEach((column, index) => {
    //     if(row[index]!=undefined){
    //     rowData[column] = row[index];
    //     }
    //   });
    //   return rowData;
    // });


    const transformedData = data.map((row) => {
      const rowData = {};
      let hasValues = false; // Flag to check if any values are defined
    
      columns.forEach((column, index) => {
        if (row[index] !== undefined) {
          rowData[column] = row[index];
          hasValues = true; // Set flag to true if any value is defined
        }
      });
    
      // Return rowData only if it has any defined values
      return hasValues ? rowData : null;
    });


    const filteredData = transformedData.filter(row => row !== null);

    console.log(filteredData);
    

  
        this.setState({
          cols: resp.cols,
          rows: resp.rows,
          productData2 : filteredData
        });
      }

    }
    });   

    
    
    

  }

  syno(){
    this.setState({success_msg : false, success_dlg : false})
  }

  upload = async()=> {
    this.setState({loading : true});

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let vformData = new FormData();
   
   //Information
   vformData.append("Data", JSON.stringify(this.state.productData2));
   vformData.append("F_User", obj.uid);
 
     let AuthUser2 = function() {
       return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"InsertBalanceByExcel/0/token" , vformData).then(token => { return token } )
     }
     let userToken2 = await AuthUser2();

     if(userToken2.status == 200){
      this.setState({success_msg : true})
     }

    this.setState({loading:false, productData2 : []});

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

  exportToExcel = () => {

    // let vformData = new FormData();
    
    // vformData.append("FromDate", this.state.FromDate);
    // vformData.append("ToDate",  this.state.ToDate);
    
    // Fn_ExportExcel(this.obj, { arguList: { id: 0, formData: vformData } }, "DMRExcel/0/token", "DMRTransaction", true);
    

    const worksheet = XLSX.utils.json_to_sheet(this.state.productData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BalanceAdd');
    XLSX.writeFile(workbook, `BalanceAdd.xlsx`);


  };
  

  btnSave_onClick (event, formData)  {

      this.setState({productData2 : []})

    
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.setState({FromDate : formData.FromDate ,ToDate : formData.ToDate, productData : [] })

console.log(formData.Search)

    let vformData = new FormData();
    vformData.append("Id", obj.uid);
    vformData.append("FromDate", formData.FromDate);
    vformData.append("ToDate", formData.ToDate);
    vformData.append("Search", formData.Search=='' ? null : formData.Search);
    vformData.append("F_UserMaster", obj.isAdmin == true  ? 0 : obj.uid) ;
   
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, this.API_URL, "productData", true);
  }


  btnDelete_onClick(Id) {
    Fn_DeleteData(this.obj, Id, API_WEB_URLS.MASTER+"/0/token/BalanceAddreport", API_WEB_URLS.MASTER+"/0/token/BalanceAddreport" + "/Id/0");
  }
  renderGridHeader() {
    return (
      <>
        <th >Transaction Date</th>
        <th>VoucherNo</th>
        <th>Narration</th>
        <th>From</th>
        <th>To</th> 
        <th>Cr</th>
        <th>Dr</th>  
      </>
    );
  }
  renderGridBody(formData) {
    
    return (
      <>
      <td >{formData.DateOfCreation}</td> 
       
        <td>{formData.VoucherNo}</td>
        <td>{formData.Narration}</td>
        <td>{formData.From}</td>
        <td>{formData.To}</td>
        <td style={{color: 'green'}}>{formData.CrAmount}</td>
        <td style={{color: 'red'}}>{formData.DrAmount}</td>
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


    const sumcr = this.state.productData.reduce((total, row) => total + row.CrAmount, 0);

    const columns = [{


      dataField: 'DateOfCreation',
      text: 'Date/Time',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
   
    },
     {
      dataField: 'VoucherNo',
      text: 'TransactionCode',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
   
    },
    {
      dataField: 'Narration',
      text: 'Narration',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
   
    },
    {
      dataField: 'From',
      text: 'From',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
   
     
    },
     {
      dataField: 'To',
      text: 'To',
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
      dataField: 'PAN',
      text: 'PAN',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
   
     
    },

    
    {
      dataField: 'AadhaarNo',
      text: 'AadharNo',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
   
     
    },
    
    {
      dataField: 'CrAmount',
      text: 'Cr',
      sort: true,
      formatter: (cell, row) => (
        <span style={{ color:  'green'}}>{cell}</span>
      ),
      footer: columnData => (
        <div>
         {sumcr}
        </div>
      )
   
    },
     {
      dataField: 'DrAmount',
      text: 'Dr',
      sort: true,
      formatter: (cell, row) => (
        <span style={{ color:  'red'}}>{cell}</span>
      ),
      footer: columnData => (
        <div>
          
        </div>
      )
   
    }
   ,

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
      hidden: !obj.isAdmin ,
      
    } ,
  {
      dataField: "action",
      text: "delete",
      hidden: !obj.isAdmin || obj.IsStaff,
      formatter: (cellContent, row) => {
        return (
          <button
          type="button"
          //disabled={row.IsRefund? true : false}
            className="btn btn-danger btn-xs"
            onClick={() => this.btnDelete_onClick(row.Id)}
          >
            
          Delete
          </button>
        );
      }
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
      hidden: !obj.isAdmin || obj.IsStaff
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


  let columnNames =this.state.rows[0];
  if(this.state.F_DMRBankMaster == 2){
     columnNames = this.state.rows[1];
  }
  else {
     columnNames = this.state.rows[0];
  }
// Assuming the first row has column names
const columns2 = columnNames.map((columnName) => ({
  dataField: columnName,
  text: columnName,
  sort: true,
}));


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
 {this.state.loading ? <Loader /> : null}
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


                                        <Col sm="3" className="mb-3">
                                        <AvField name="Search" label="" value={this.state.formData.Search} placeholder="Search"  type="text"  className="form-control" />
                                        </Col>

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

                        <Button
                          type="button"
                          color="primary"
                          onClick={this.exportToExcel}
                          style={{marginLeft:10}}
                          className="mr-1 waves-effect waves-light"
                        >
                          Excel
                        </Button>
                        

                    
                                          </Col>
                                      
                                    
                                      </Row>


<Row>
                                      
                                      <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Choose File</label>
                                        </Col>
                                        <Col sm="4" className="mb-3">
                                        <AvField name="file" label="" value={this.state.formData.file} onChange={(event)=> Fn_ChangeStateValue(this.obj, "File", event.target.files[0])}  errorMessage="Select file "  type="file"  className="form-control" />
                                        </Col>

                                        <Col sm="3" className="mb-3">
                                        <Button
                                              type="button"
                                              color="primary"
                                              onClick={this.fileHandler}
                                              className="mr-1 waves-effect waves-light"
                                            >
                                              View
                                            </Button>
                                            </Col>
                                     
                                          <Col sm="3" className="mb-3">
                                        <Button
                                              type="button"
                                              color="primary"
                                              onClick={this.upload}
                                              className="mr-1 waves-effect waves-light"
                                            >
                                              Upload
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

                         {this.state.success_msg == true ? (
                      <SweetAlert
                        title={'Data Uploded Successful!'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                      
                      </SweetAlert>
                    ) : null}

{this.state.productData.length > 0 ? 

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

               : this.state.productData2.length > 0 ?

               
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
                      columns={columns2}
                      data={this.state.productData2}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField='id'
                          columns={columns2}
                          data={this.state.productData2}
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


: null}







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
export default compose(container)(pageList_BalanceAdd);
