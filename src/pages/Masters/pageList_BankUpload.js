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
import Loader from "pages/loader";


function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
class pageList_BankUpload extends Component {
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
      F_Type : 0,
      loading : false
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Bank Upload";
    this.modalTitle = "Audit Attendance";
    this.rtPage_Add = "add-customermaster";
    this.rtPage_Edit = "edit-customermaster";
    this.API_URL = "Recharges/0/token";
    

    //Event Binding
    
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
  
    this.syno  =  this.syno.bind(this);
   
    this.fileHandler =  this.fileHandler.bind(this);
    this.exporttoexcel  =  this.exporttoexcel.bind(this);
    this.view =  this.view.bind(this);
    this.clear  =  this.clear.bind(this);
    this.upload  =  this.upload.bind(this);
  }

  fileHandler = () => {
    let fileObj = this.state.File;

    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if(err){
        console.log(err);            
      }
      else{

    if (this.state.F_DMRBankMaster == 2){

     
      const columns = resp.rows[5]; // Using the 5th sub-array as the column names
      const data = resp.rows.slice(7); // Starting from the 9th sub-array to extract data rows
     
  
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
        productData: transformedData
      });
    }

    else {
      const columns = resp.rows[0];
    const data = resp.rows.slice(1);

    const transformedData = data.map((row) => {
      const rowData = {};
      columns.forEach((column, index) => {
        rowData[column] = row[index];
      });
      return rowData;
    });


  
        this.setState({
          cols: resp.cols,
          rows: resp.rows,
          productData : transformedData
        });
      }

    }
    });   

    
    
    

  }


  exporttoexcel = async() => {

    let vformData = new FormData();
    vformData.append("targetAmount", this.state.targetAmount);
    vformData.append("SheetName", this.state.SheetName);
    vformData.append("F_DMRBankMaster", this.state.F_DMRBankMaster);

    var FileName  =  "";
     if (this.state.F_DMRBankMaster  == 4){
      
   
       let AuthUser2 = function() {
         return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"GetOfflineDMRList/0/token" , vformData).then(token => { return token } )
       }
       let userToken2 = await AuthUser2();


       console.log(userToken2.data.response);

      const data  = userToken2.data.response;

            const headings = Object.keys(data[0]);
            const formattedData = data.map(entry => {
              return headings.map(heading => entry[heading]).join('|');
            });

            const content = [headings.join('|'), ...formattedData].join('\n');
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', this.state.SheetName +  " - " + "Bank Of Maharasthra");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

     }

     else {

    if (this.state.F_DMRBankMaster == 2)
    FileName =  this.state.SheetName +  " - ICICI Export";
    else if(this.state.F_DMRBankMaster == 1)
    FileName = this.state.SheetName +  " - " + "Kotak Export";
    
    Fn_ExportExcel(this.obj, { arguList: { id: 0, formData: vformData } }, "GetOfflineDMRList/0/token", FileName, true);
     }
    
  };

  clear =  async ()=> {
    let vformData = new FormData();
    var Id =  this.state.Id;
   //Information
   vformData.append("SheetName", this.state.SheetName);
   vformData.append("F_DMRBankMaster", this.state.F_DMRBankMaster);
 
     let AuthUser2 = function() {
       return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"ClearSheet/0/token" , vformData).then(token => { return token } )
     }
     let userToken2 = await AuthUser2();
     if (userToken2.status == 200){
      alert('Cleared Succesfully!');
     }
  }



  view () {

    let vformData = new FormData();
    vformData.append("targetAmount", this.state.targetAmount);
    vformData.append("SheetName", this.state.SheetName);
    vformData.append("F_DMRBankMaster", this.state.F_DMRBankMaster);
    
    Fn_GetReport(this.obj, { arguList: { id: 0, formData: vformData } }, "GetOfflineDMRList/0/token", "productData", true);

  }


  

  
  componentDidMount() {

    Fn_FillListData(this.obj, "bank", API_WEB_URLS.MASTER + "/0/token/DMRBankMaster/Id/0");
   
  }
  syno(){
    this.setState({success_msg : false, success_dlg : false})
  }
 


  btnSave_onClick (event, formData)  {

   

  }

  upload = async()=> {
    this.setState({loading : true});
let newArray = [];

    if (this.state.F_DMRBankMaster == 2){
       newArray = this.state.productData
      .filter(obj => obj["Remarks"] !== undefined && obj["Remarks"] !== null)
      .map(obj => {
        const transactionCode = obj["Remarks"];
        const utrNo = obj["UTR NO"];

        let numericPart = "";
        let stringPart = "";

        if (utrNo) {
          const hyphenIndex = utrNo.indexOf(" - ");
          if (hyphenIndex !== -1) {
            numericPart = utrNo.substring(0, hyphenIndex);
            stringPart = utrNo.substring(hyphenIndex + 3); // Skip " - "
          } else {
            stringPart = utrNo;
          }
        } else {
          // Handle cases where utrNo is missing or undefined
        }

        return {
          TransactionCode: transactionCode,
          UTR: numericPart,
          Remarks: stringPart,
          Status: obj["Status"]
        };
      });

    }

    else if (this.state.F_DMRBankMaster == 1) {

        newArray = this.state.productData
       .filter(obj => obj["Instrument Payment Ref No"] !== undefined && obj["Instrument Payment Ref No"] !== null)
       .map(obj => {
         const transactionCode = obj["Instrument Payment Ref No"];
         const utrNo = obj["UTR SrNo"];
 
 
         return {
           TransactionCode: transactionCode,
           UTR: utrNo,
           Remarks: "Success",
           Status: obj["Instrument Status"]
         };
       });
    



    }

    
    else if (this.state.F_DMRBankMaster == 4) {

      newArray = this.state.productData
     .filter(obj => obj["ADVICE STATUS"] !== undefined && obj["ADVICE STATUS"] !== null)
     .map(obj => {
       const transactionCode = obj["ADVICE STATUS"];
       const utrNo = obj["PAYMENT ID"];


       return {
         TransactionCode: transactionCode,
         UTR: utrNo,
         Remarks: "Success",
         Status: obj["STATUS"]
       };
     });
  



  }


 

      let vformData = new FormData();
   
   //Information
   vformData.append("Data", JSON.stringify(newArray));
   vformData.append("F_DMRBankMaster", this.state.F_DMRBankMaster);
 
     let AuthUser2 = function() {
       return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"UpdateByExcel/0/token" , vformData).then(token => { return token } )
     }
     let userToken2 = await AuthUser2();

     if(userToken2.status == 200){
      this.setState({success_msg : true})
     }

    this.setState({loading:false});

  }


  



  
  render() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let columnNames =this.state.rows[0];

      if(this.state.F_DMRBankMaster == 2 && this.state.F_Type  == 1){
         columnNames = this.state.rows[5];
      }
      
      else {
        console.log(this.state.rows);
         columnNames = this.state.rows[0];
      }
   // Assuming the first row has column names
    const columns = columnNames.map((columnName) => ({
      dataField: columnName,
      text: columnName,
      sort: true,
    }));
    

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
        {this.state.loading ? <Loader /> : null}
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
      <Row>
                                
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Select Type</label>
                                        </Col>
                                        <Col sm="6" className="mb-3">
                                        <AvField  name="F_Type" label=""  onChange={(event)=> Fn_ChangeStateValue(this.obj, "F_Type", event.target.value)} value={this.state.formData.F_Type === null ? '-1'   : this.state.formData.F_Type}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={1} defaultValue label={"Import"} />
                                            <option value={2} defaultValue label={"Export"} />
                                          </AvField> 
                                        </Col>

                                        </Row>
                                {this.state.F_Type == 2 ? 

                                <>
                              
                                    <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Select Bank</label>
                                        </Col>
                                        <Col sm="3" className="mb-3">
                                        <AvField  name="F_DMRBankMaster" label="" value={this.state.formData.F_DMRBankMaster === null ? '-1'   : this.state.formData.F_DMRBankMaster}  onChange={(event)=> Fn_ChangeStateValue(this.obj, "F_DMRBankMaster", event.target.value)} type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.bank
                                              ? this.state.bank.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>
                                       
                                        <Col sm="3" className="mb-3">
                                          <label htmlFor="Name" className="col-form-label">Sheet Name</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="SheetName" label="" value={this.state.formData.SheetName === null ? ''   : this.state.formData.SheetName} onChange={(event)=> Fn_ChangeStateValue(this.obj, "SheetName", event.target.value)} placeholder="Enter  SheetName"   type="text" className="form-control" />
                                        </Col>


                                        <Col sm="3" className="mb-3">
                                          <label htmlFor="Name" className="col-form-label">Target Amount</label>
                                        </Col>
                                        <Col sm="4">
                                          <AvField name="targetAmount" label="" value={this.state.formData.targetAmount === null ? ''   : this.state.formData.targetAmount} onChange={(event)=> Fn_ChangeStateValue(this.obj, "targetAmount", event.target.value)} placeholder="Enter  targetAmount"   type="number" className="form-control" />
                                        </Col>

                                                        </Row>

                                                        <Row>
                                                        <Col sm="3" className="mb-3">
                                        <Button
                                              type="button"
                                              color="primary"
                                              onClick={this.view}
                                              className="mr-1 waves-effect waves-light"
                                            >
                                              View
                                            </Button>
                                          </Col>

                                          <Col sm="3" className="mb-3">
                                        <Button
                                              type="button"
                                              color="primary"
                                              onClick={this.exporttoexcel}
                                              className="mr-1 waves-effect waves-light"
                                            >
                                              Export Excel
                                            </Button>
                                          </Col>

                                          <Col sm="3" className="mb-3">
                                        <Button
                                              type="button"
                                              color="primary"
                                              onClick={this.clear}
                                              className="mr-1 waves-effect waves-light"
                                            >
                                              Clear
                                            </Button>
                                          </Col>

                                                        </Row>
                                        </>

                                        : this.state.F_Type  == 1 ?

                                        <>
                                        <Row>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Select Bank</label>
                                        </Col>
                                        <Col sm="3" className="mb-3">
                                        <AvField  name="F_DMRBankMaster" label="" value={this.state.formData.F_DMRBankMaster === null ? '-1'   : this.state.formData.F_DMRBankMaster}  onChange={(event)=> Fn_ChangeStateValue(this.obj, "F_DMRBankMaster", event.target.value)} type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.bank
                                              ? this.state.bank.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Choose File</label>
                                        </Col>
                                        <Col sm="4" className="mb-3">
                                        <AvField name="file" label="" value={this.state.formData.file} onChange={(event)=> Fn_ChangeStateValue(this.obj, "File", event.target.files[0])} placeholder="From Date" errorMessage="Select file " validate={{ required: { value: true } }} type="file"  className="form-control" />
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

                                    
                                        
                                        </> : null

                                }
                                      
                                       

                    

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

                         

        

                         {this.state.success_msg == true ? (
                      <SweetAlert
                        title={'Data Uploded Successful!'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                      
                      </SweetAlert>
                    ) : null}

                         {this.state.confirm_alert ? (
                                                                <SweetAlert
                                                                    title="Are you sure to Refund?"
                                                                    warning
                                                                    showCancel
                                                                    confirmBtnText="Yes, Refund it!"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="danger"
                                                                     onConfirm={() =>this.refund()}
                                                                     onCancel={() =>this.setState({confirm_alert : false, RReason : false , Id : 0})}
                                                                >
                                                                 
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Refund Reason</label>
                                        </Col>
                                        <br></br>
                                        <Col sm="9" className="mb-3">
                                        <input name="RReason" label="" value={this.state.RReason} placeholder="Refund Reason" onChange={(event)=>Fn_ChangeStateValue(this.obj, "RReason", event.target.value)}  validate={{ required: { value: true } }} type="text"  className="form-control" />
                                        </Col>
                                    
                                                                    
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
                         </div>
                         </React.Fragment>



  </>
    );
  }
}
export default compose(container)(pageList_BankUpload);
