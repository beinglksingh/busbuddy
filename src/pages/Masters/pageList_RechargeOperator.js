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

class pageList_RechargeOperator extends Component {
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
    this.breadCrumbItem = "RechargeOperator";
    this.modalTitle = "Bank Master";
    this.rtPage_Add = "add-rechargeoperator";
    this.rtPage_Edit = "edit-rechargeoperator";
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/RechargeOperatorAll";
    this.API_URL_SAVE  =  'UpdateBankType/0/token';

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


  // updateNEFT = (id , valueN, valueI)=>{

  //   const gridData = this.state.gridData;

  //   for (let i = 0; i < gridData.length; i++) {
  //     if (gridData[i].Id === id) {
  //       gridData[i].NEFT_IsActive = !valueN;
  //       break;
  //     }
  //   }

  //   this.setState({ gridData });

  //   let vformData = new FormData();
  //   vformData.append("NEFT_IsActive", !valueN);
  //   vformData.append("IMPS_IsActive", valueI);

  //   Fn_AddEditData(this.obj, { arguList: { id: id, formData: vformData } }, this.API_URL_SAVE, "#", true , "kuku" , "update_msg");
  // } 

 


  btnDelete_onClick(formData) {
    Fn_DeleteData(this.obj, formData.Id, this.API_URL, this.API_URL + "/Id/0");
  }
  renderGridHeader() {
    return (
      <>
        <th>Name</th>
        <th>API</th>
        <th>Recharge Type</th>
        <th>Active</th>
        <th>Op. Id</th>
      </>
    );
  }
  renderGridBody(formData) {

        
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





    return (
      
      <>
      <td >{formData.Name}</td> 
       
        <td >{formData.APIName}</td>
        <td >{formData.RechargeType}</td>
        <td><Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-8 mb-2"
                            onColor="#00ff00"
                            offColor="#ec4561"
                            // onChange={() =>
                            //   this.updateNEFT(formData.Id , formData.NEFT_IsActive , formData.IMPS_IsActive)
                            // }
                            checked={formData.IsActive}
                          /></td>
        <td>
        {formData.OPID}
       </td>
       
      </>
    );
  }
  renderModalBody(selectedFormData) {
    return (
      <>
       
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
        updateNEFT=  {this.updateNEFT}
        updateIMPS  =  {this.updateIMPS}
      ></RCDisplayPage>
      </div>
    );
  }
}
export default compose(container)(pageList_RechargeOperator);
