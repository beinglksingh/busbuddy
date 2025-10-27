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
  Fn_GetReport
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
  TabPane
} from "reactstrap";

import {
  AvForm,
  AvField,AvRadioGroup,AvRadio
} from "availity-reactstrap-validation";

import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";

import Breadcrumbs from "../../components/Common/Breadcrumb";

class pageList_DayWiseAtt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selectedFormData: {},
      gridData: [],
      confirm_alert: false,
      formData : {},
      success_dlg: false,
      dynamic_title: "",
      dynamic_description: "",
      company : [],
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Day Wise Report";
    this.modalTitle = "Day Wise Report";
    this.rtPage_Add = "add-customermaster";
    this.rtPage_Edit = "edit-customermaster";
    this.API_URL = "AttendanceReportDayWise/0/token";
    this.API_URL_COMPANY = API_WEB_URLS.MASTER + "/0/token/CompanyMaster";

    //Event Binding
    this.btnAdd_onClick = this.btnAdd_onClick.bind(this);
    this.btnEdit_onClick = this.btnEdit_onClick.bind(this);
    this.btnDelete_onClick = this.btnDelete_onClick.bind(this);
    this.btnSave_onClick =  this.btnSave_onClick.bind(this);
   
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    const obj = JSON.parse(localStorage.getItem("authUser"));
    Fn_FillListData(this.obj, "company", this.API_URL_COMPANY + "/F_CustomerMaster/"+obj.uid);
  }

 


  btnSave_onClick (event, formData)  {

    let vformData = new FormData();
    vformData.append("AttDate", formData.FromDate);
    vformData.append("F_CompanyMaster", formData.CompanyId);
    vformData.append("EmployeeCode", formData.EmployeeCode);



    Fn_GetReport(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL, "gridData", true);


  }



  btnAdd_onClick(event, values) {
    this.props.history.push(`${this.rtPage_Add}`);
  }
  btnEdit_onClick(formData) {
    this.props.history.push(`${this.rtPage_Edit}/${formData.Id}`, {});
  }
  btnDelete_onClick(formData) {
    Fn_DeleteData(this.obj, formData.Id, this.API_URL, this.API_URL + "/Id/0");
  }
  renderGridHeader() {
    return (
      <>
        <th>Name</th>
        <th>Check In Time</th>
        <th>Check Out Time</th>
        <th>W. Hours</th>
        <th>Overtime</th>
        <th>Shift Start</th>
        <th>Shift End</th>
        
      </>
    );
  }
  renderGridBody(formData) {
    return (
      <>
        <td>{formData.Name}</td>
        <td>{formData.InTime}</td>
        <td>{formData.OutTime}</td>
        <td>{formData.WorkingHours}</td>
        <td>{formData.Overtime}</td>
        <td>{formData.ShiftStart}</td>
        <td>{formData.ShiftEnd}</td>
        <td>{formData.AttType}</td>
      </>
    );
  }
  renderModalBody(selectedFormData) {
    return (
      <>
        <p className="mb-4">
         In Diff: <span className="text-primary">{selectedFormData.InDiff}</span>
        </p>
        <p className="mb-4">
         Out Diff: <span className="text-primary">{selectedFormData.OutDiff}</span>
        </p>
      </>
    );
  }
  render() {
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
                                  <Col lg="9">
                                  {/* <Card>
                                    <CardBody> */}


                                    <Row>

                                    <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Company</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField name="CompanyId"  label=""  value={this.state.formData.CompanyId === null ? '-1'   : this.state.formData.CompanyId} errorMessage="Select Company " validate={{ required: { value: true } }} type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.company
                                              ? this.state.company.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField>
                                        </Col>

                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">From Date</label>
                                        </Col>
                                        <Col sm="2" className="mb-3">
                                        <AvField name="FromDate" label="" value={this.state.formData.FromDate} placeholder="From Date"  type="date"  className="form-control" />
                                        </Col>


                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Emp. Code</label>
                                        </Col>
                                        <Col sm="2" className="mb-3">
                                        <AvField name="EmployeeCode" label="" value={this.state.formData.EmployeeCode === null ? ''   : this.state.formData.EmployeeCode} placeholder=" Employee Code"   type="text" className="form-control" />
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

                                     
                                   

                       
                                      
                         {/* </CardBody>
                         </Card> */}
                         </Col>
                         </Row>
                        

                         
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



      <RCDisplayPage
        //page header paramaters
        Isbreadcrumb = {false}
        breadCrumbTitle={this.breadCrumbTitle}
        breadcrumbItem={this.breadCrumbItem}
        obj={this.obj}
        //column paramaters
        isSearchBox={false}
        isSNo={true}
        isCheckBox={true}
        isViewDetails={true}
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
        isAdd={false}
        isEdit={false}
        isDelete={false}
      ></RCDisplayPage>
  </>
    );
  }
}
export default compose(container)(pageList_DayWiseAtt);
