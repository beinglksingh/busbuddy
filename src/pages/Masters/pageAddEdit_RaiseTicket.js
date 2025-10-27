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
} from "reactstrap";
import Select from "react-select";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
// Redux
import { withRouter, Link } from "react-router-dom";
// availity-reactstrap-validation
import {
  AvForm,
  AvField,
  AvCheckboxGroup,
  AvCheckbox,
  AvGroup,
  AvInput,
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_ChangeStateValue } from "../../store/functions";

class pageAddEdit_RaiseTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      
    };
    this.obj = this;
    this.formTitle = "Raise Ticket";
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = " " + this.formTitle;
    //this.API_URL = API_WEB_URLS.MASTER + "/0/token/LedgerMaster";
    this.API_URL_SAVE =  "InsertTicket/0/token";
    this.pushFormName = "/tickets";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
   
  }








  componentDidMount() {
    
  
  }
  btnSave_onClick(event, formData) {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    //Information
    vformData.append("F_UserMaster", obj.uid);
    vformData.append("F_ServiceMaster", formData.F_ServiceMaster);
    vformData.append("TransactionCode", formData.TransactionCode );
    vformData.append("Description", formData.Description);


    if (!this.state.id)
      Fn_AddEditData(
        this.obj,
        { arguList: { id: 0, formData: vformData } },
        this.API_URL_SAVE,
        this.pushFormName,
        true
      );
     }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };
  render() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

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
              <Col xs="12">
                <Card>
                  <CardBody>
                    <CardTitle></CardTitle>
                    
                    <AvForm
                      className="needs-validation"
                      onValidSubmit={this.btnSave_onClick}
                    >

<Row>
                                  <Col lg="12">
                                 
                                    <Row>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Select Service Type</label>
                                        </Col>
                                    <Col sm="3">
                                        <AvField  name="F_ServiceMaster" label="" value={this.state.formData.F_ServiceMaster === null ? '-1'   : this.state.formData.F_ServiceMaster}  type="select" className="form-select" >
                                            <option value={0} defaultValue label={"Select"} />
                                            {obj.IsDMR ? <option value={1}  label={"MONEY TRANSFER"} /> : null }
                                            
                                            {obj.IsIndoNepal ? 
                                            <option value={2}  label={"INDO NEPAL"} /> : null}

                                            {obj.IsAEPS ? 
                                            <option value={3}  label={"AEPS"} /> : null}
                                            {obj.IsRecharge ? 
                                            <option value={4}  label={"RECHARGE"} /> : null}
                                            <option value={5}  label={"Fund Transfer"} />
                                          </AvField> 
                                        </Col>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Transaction Code</label>
                                        </Col>
                                 
                                        <Col sm="3" className="mb-3">
                                        <AvField name="TransactionCode" label="" value={this.state.TransactionCode } placeholder="TransactionCode"   type="text"  className="form-control" />
                                        </Col>
                                       

</Row>
<Row>

                                       
                                       


                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Description</label>
                                        </Col>
                                 
                                        <Col sm="3" className="mb-3">
                                        <AvField name="Description" label="" value={this.state.formData.Description} placeholder="Enter Description" required={true} rows="4" cols="50"  type="textarea"  className="form-control" />
                                        </Col>



                                    </Row>

                              
                                  
                                        </Col>
                                        </Row>
                      
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          type="submit"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          Raise 
                        </Button>
                        <Button
                          type="button"
                          color="secondary"
                          className="waves-effect"
                          onClick={this.btnCancel_onClick}
                        >
                          Cancel
                        </Button>
                      </div>
                    </AvForm>
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
export default compose(container)(pageAddEdit_RaiseTicket);
