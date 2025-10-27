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
  Fn_AddEditData
} from "../../store/functions";
import  Switch  from "react-switch";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import './datatables.scss';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';
import {
 
  Row,
  Col,
 
  Card,
  CardBody,
  Button
  
} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";




class pageList_BankMaster extends Component {
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
      productData : []
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Bank Master";
    this.modalTitle = "Bank Master";
    this.rtPage_Add = "add-bankmaster";
    this.rtPage_Edit = "edit-bankmaster";
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/BankMaster";
    this.API_URL_SAVE  =  'UpdateBankType/0/token';

    //Event Binding
    this.btnAdd_onClick = this.btnAdd_onClick.bind(this);
    this.btnEdit_onClick = this.btnEdit_onClick.bind(this);
    this.btnDelete_onClick = this.btnDelete_onClick.bind(this);
    this.updateNEFT  =  this.updateNEFT.bind(this);
    this.updateIMPS  =  this.updateIMPS.bind(this);
    this.update  = this.update.bind(this);
    
  }
  componentDidMount() {
         
 
  const obj = JSON.parse(sessionStorage.getItem("authUser"));
  Fn_FillListData(this.obj, "productData", this.API_URL+'/Id/0');
    
  }

  update () {
    this.setState({success_dlg : false})
    Fn_FillListData(this.obj, "productData", this.API_URL+'/Id/0');

  }
  btnAdd_onClick(event, values) {
    this.props.history.push(`${this.rtPage_Add}`);
  }
  btnEdit_onClick(Id) {
    this.props.history.push(`${this.rtPage_Edit}/${Id}`, {});
  }


  updateNEFT = (id , valueN, valueI)=>{

    const gridData = this.state.gridData;

    for (let i = 0; i < gridData.length; i++) {
      if (gridData[i].Id === id) {
        gridData[i].NEFT_IsActive = !valueN;
        break;
      }
    }

    this.setState({ gridData });

    let vformData = new FormData();
    vformData.append("NEFT_IsActive", !valueN);
    vformData.append("IMPS_IsActive", valueI);

    Fn_AddEditData(this.obj, { arguList: { id: id, formData: vformData } }, this.API_URL_SAVE, "#", true , "kuku" , "update_msg");
    
  } 

  updateIMPS = (id , valueN, valueI)=>{

    const gridData = this.state.gridData;

    for (let i = 0; i < gridData.length; i++) {
      if (gridData[i].Id === id) {
        gridData[i].IMPS_IsActive = !valueI;
        break;
      }
    }

    this.setState({ gridData });

    let vformData = new FormData();
    vformData.append("NEFT_IsActive", valueN);
    vformData.append("IMPS_IsActive", !valueI);

    Fn_AddEditData(this.obj, { arguList: { id: id, formData: vformData } }, this.API_URL_SAVE, "#", true , "kuku" , "update_msg");
  } 
  


  btnDelete_onClick(formData) {
    Fn_DeleteData(this.obj, formData.Id, this.API_URL, this.API_URL + "/Id/0");
  }


  render() {



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
          OFF
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
          ON
        </div>
      )
    }

    const columns = [{


      dataField: 'Name',
      text: 'Name',
      sort: true
   
    },
     {
      dataField: 'IFSC',
      text: 'IFSC',
      sort: true
    },
  {
      dataField: "NEFT",
      text: "NEFT",
      formatter: (cellContent, row) => {
        return (
          <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-8 mb-2"
                            onColor="#00ff00"
                            offColor="#ec4561"
                            onChange={() =>
                              this.updateNEFT(row.Id , row.NEFT_IsActive , row.IMPS_IsActive)
                            }
                            checked={row.NEFT_IsActive}
                          />
        );
      }
    } ,

     {
      dataField: "IMPS",
      text: "IMPS",
      formatter: (cellContent, row) => {
        return (
<Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-8 mb-2"
                            onColor="#00ff00"
                            offColor="#ec4561"
                            onChange={() =>
                              this.updateIMPS(row.Id , row.NEFT_IsActive , row.IMPS_IsActive)
                            }
                            checked={row.IMPS_IsActive}
                          />
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

              {this.state.success_dlg ? (
                                                                  <SweetAlert
                                                                    success
                                                                   Updated
                                                                    onConfirm={this.update}
                                                                  >
                                                                    Changed Succesfully!
                                                                  </SweetAlert>
                                                                ) : null}
                                                            {/* ):null} */}

      </div>
    );
  }
}
export default compose(container)(pageList_BankMaster);
