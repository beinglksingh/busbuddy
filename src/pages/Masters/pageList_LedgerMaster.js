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
} from "../../store/functions";
import * as XLSX from 'xlsx';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import './datatables.scss';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';
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

class pageList_LedgerMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      selectedFormData: {},
      gridData: [],
      confirm_alert: false,
      success_dlg: false,
      dynamic_title: "",
      dynamic_description: "",
      productData : []
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Ledger Master";
    this.modalTitle = "Ledger Master";
    this.rtPage_Add = "add-ledgermaster";
    this.rtPage_Edit = "edit-ledgermaster";
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/LedgerMaster/Id/0";

    //Event Binding
    this.exportToExcel  = this.exportToExcel.bind(this);
    this.btnAdd_onClick = this.btnAdd_onClick.bind(this);
    this.btnEdit_onClick = this.btnEdit_onClick.bind(this);
    this.btnDelete_onClick = this.btnDelete_onClick.bind(this);
  }
  componentDidMount() {
         
 
  const obj = JSON.parse(sessionStorage.getItem("authUser"));
  Fn_FillListData(this.obj, "productData", this.API_URL);
 
  }
  btnAdd_onClick(event, values) {
    this.props.history.push(`${this.rtPage_Add}`);
  }
  btnEdit_onClick(formData) {
    this.props.history.push(`${this.rtPage_Edit}/${formData.ID}`, {});
  }
  btnDelete_onClick(formData) {
    Fn_DeleteData(this.obj, formData.Id, this.API_URL, this.API_URL + "/Id/0");
  }



  exportToExcel = () => {

    // let vformData = new FormData();
    
    // vformData.append("FromDate", this.state.FromDate);
    // vformData.append("ToDate",  this.state.ToDate);
    
    // Fn_ExportExcel(this.obj, { arguList: { id: 0, formData: vformData } }, "DMRExcel/0/token", "DMRTransaction", true);
    

    const worksheet = XLSX.utils.json_to_sheet(this.state.productData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ledger');
    XLSX.writeFile(workbook, `Ledger.xlsx`);


  };
  
  renderGridHeader() {
    return (
      <>
        <th>Name</th>
        <th>Ledger Group</th>
        <th>Remarks</th>

      </>
    );
  }
  renderGridBody(formData) {
    return (
      <>
        <td>{formData.Name}</td>
        <td>{formData.LedgerGroup}</td>
        <td>{formData.Remarks}</td>
       
      </>
    );
  }
  renderModalBody(selectedFormData) {
    return (
      <>
        <p className="mb-4">
        
        </p>
      </>
    );
  }
  render() {


    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    const sumcr = this.state.productData.reduce((total, row) => total + row.CrAmount, 0);

    const columns = [
      
      {


        dataField: 'ID',
        text: 'Id',
        sort: true,
        footer: columnData => (
          <div>
           
          </div>
        )
     
      },{


      dataField: 'Name',
      text: 'Name',
      sort: true,
      footer: columnData => (
        <div>
         
        </div>
      )
   
    },
     {
      dataField: 'LedgerGroup',
      text: 'LedgerGroup',
      sort: true,
      footer: columnData => (
        <div>
         
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
   
    },     {
      dataField: "Edit",
      text: "Edit",
      formatter: (cellContent, row) => {
        return (
          <button
          type="button"
            className="btn btn-success btn-xs"
            onClick={() => this.btnEdit_onClick(row)}
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


  const { SearchBar } = Search;
    return (
      <div className="page-content">


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

                                <Col>
                                <Button
                          type="button"
                          color="primary"
                          onClick={this.btnAdd_onClick}
                          style={{marginLeft:10}}
                          className="mr-1 waves-effect waves-light"
                        >
                          Add
                        </Button>
                        
                        
                        <></>
                        
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
        //delete link parameters
        confirm_alert={this.state.confirm_alert}
        success_dlg={this.state.success_dlg}
        dynamic_title={this.state.dynamic_title}
        dynamic_description={this.state.dynamic_description}
        toggleDeleteConfirm={toggleDeleteConfirm}
        toggleDeleteSuccess={toggleDeleteSuccess}
        btnDelete_onClick={this.btnDelete_onClick}
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
      ></RCDisplayPage> */}
      </div>
    );
  }
}
export default compose(container)(pageList_LedgerMaster);
