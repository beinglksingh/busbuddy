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




class DeletionRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
     
      productData : []
    };
    this.obj = this;
    

    //Event Binding
  
    
  }
  componentDidMount() {
         
 
 
  }


  render() {



   

    
    return (
      <div className="page-content">
          <h1>Request Account Deletion</h1>
    <p>
      If you wish to permanently delete your account and all associated data, please click the button below to send us an email request.
    </p>
    <a className="button" href="mailto:info@busbuddy.co.in?subject=Account Deletion Request&body=Please delete my account and all associated data.">Request Deletion</a>
       </div>
    );
  }
}
export default compose(container)(DeletionRequest);
