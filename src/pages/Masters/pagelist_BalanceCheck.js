import React, { Component } from "react";
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
  UncontrolledTooltip
} from "reactstrap";
import Switch from "react-switch"
import classnames from "classnames";
import SweetAlert from "react-bootstrap-sweetalert"
import Select from "react-select";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
// Redux
import { withRouter, Link } from "react-router-dom";


// Editable
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory from "react-bootstrap-table2-editor"
// availity-reactstrap-validation
import {
  AvForm,
  AvField,AvRadioGroup,AvRadio
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_ChangeStateValue, Fn_DeleteData, Fn_GetReport } from "../../store/functions";
import AddDeleteTableRowsPly from "pages/Transaction/AddDeleteTableRowPly";


function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
export const DateString = (dd) =>{

let d1 =  dd.replace('-', '');
let d2 = d1.replace('-', '');

return d2;

}

class pagelist_BalanceCheck  extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
       activeTab: 1,
       passedSteps: [1],
       gridData : [{}], 
      //dropdowns
    };
    this.obj = this;
    this.formTitle = "Check Balance";
    this.breadCrumbTitle = "Balance";
    this.breadCrumbItem = " " + this.formTitle;
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/City";
    this.API_URL_SAVE = API_WEB_URLS.AddEdit + "/0/token";
    this.pushFormName = "/#";
    this.rtPage_Print = "/#";

    //Event Binding
   
   
    this.LedgerChange  =  this.LedgerChange.bind(this);
   
  }

 

  componentDidMount() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    this.setState({ name: obj.username, email: obj.email, aid: obj.uid , role:obj.role });
       

  }




  LedgerChange (event) {

    this.setState({F_LedgerMaster : event.target.value});
    Fn_FillListData(this.obj, "gridData", API_WEB_URLS.MASTER + "/0/token/GetBalance/Id/"+event.target.value);


  }









// btnGoBack_onClick = event => {
//   event.preventDefault();
//   //this.props.history.goBack();
//   this.props.history.push(this.pushFormName);
// };









    
  render() {   
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
                       <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick} >
                          <TabContent activeTab={this.state.activeTab} className="body">
                            <TabPane tabId={1}>

                            <Row>
                                  
                                  
                                  <Card>
                  <CardBody>
<Row>

                                        <Col sm="5">
                                        <AvField  name="F_LedgerMaster" onChange={this.LedgerChange} label="" value={this.state.formData.F_LedgerMaster === null ? '-1'   : this.state.formData.F_LedgerMaster}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select Ledger"} />
                                            <option key={1} value={11510} label={'ICICI Bank'} />
                                            <option key={2} value={11511} label={'KOTAK BANK'} />
                                            <option key={3} value={11512} label={'BANK OF MAHARAHSTRA'} />
                                            <option key={4} value={11531} label={'SARASWAT BANK'} />
                                            <option key={5} value={11625} label={'TJSB BANK'} />
                                            <option key={6} value={11642} label={'UJJIVAN SMALL FINANCE BANK'} />
                                            <option key={7} value={11516} label={'Offline Bank'} />
                                            <option key={8} value={66} label={'Cash'} />

                                          </AvField> 
                                        </Col>
</Row>

               
                  </CardBody>
                </Card>
                                     
                                 </Row>  
                                <Row>
                                  
                                  
                                  <Card>
                  <CardBody>
                  

                  <Col sm="2" className="mb-3">
                                          <label htmlFor="lastName" className="col-form-label">Balance</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField name="Balance" label="" value={this.state.gridData[0].Balance} placeholder="Balance"  disabled type="number"  className="form-control" />
                                        </Col>
                  </CardBody>
                </Card>
                                     
                                 </Row>    
                                                                                                                                                                                                         
                            </TabPane>                                                  
                          </TabContent>
                         
                        
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
export default compose(container)(pagelist_BalanceCheck);