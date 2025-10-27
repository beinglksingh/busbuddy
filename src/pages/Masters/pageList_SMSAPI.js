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

class pageList_SMSAPI extends Component {
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
      IsApproved : true
    };
    this.obj = this;
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "SMS API";
    this.modalTitle = "SMS API";
    this.rtPage_Add = "add-smsapi";
    this.rtPage_Edit = "edit-smsapi";
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/SMSAPI";

    //Event Binding
    this.btnAdd_onClick = this.btnAdd_onClick.bind(this);
    this.btnEdit_onClick = this.btnEdit_onClick.bind(this);
    this.btnDelete_onClick = this.btnDelete_onClick.bind(this);
    
  }
  componentDidMount() {
         
 
  const obj = JSON.parse(sessionStorage.getItem("authUser"));
  Fn_FillListData(this.obj, "gridData", this.API_URL+'/Id/0');
    
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
        <th >Account USAGE</th>
        <th >Url</th>
        <th>IsDefault</th>
        <th>IsActive</th>
      </>
    );
  }
  renderGridBody(formData) {
    
    return (
      <>
      <td >{formData.AccountUsage}</td> 
       
        <td style={{whiteSpace: 'pre-wrap'}}>{formData.Url}</td>
        <td>{formData.IsDefault?'True' : 'False'}</td>
        <td>{formData.IsActive ?'True' : 'False'}</td>
       
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
    return (
      <div className="page-content">
      <RCDisplayPage
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
        isEdit2={true}
        isDelete={true}
        islockshow= {false}
      ></RCDisplayPage>
      </div>
    );
  }
}
export default compose(container)(pageList_SMSAPI);
