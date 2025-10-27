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
  TabPane
} from "reactstrap";

import classnames from "classnames";
import SweetAlert from "react-bootstrap-sweetalert"


// availity-reactstrap-validation
import {
  AvForm,
  AvField,AvRadioGroup,AvRadio
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withRouter, Link } from "react-router-dom";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_DisplayData, Fn_AddEditData } from "../../store/functions";

class pageAddEdit_ShiftMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
    };
    this.obj = this;
    this.formTitle = "Shift";
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.SHIFT + "/0/token";
    this.pushFormName = "/masters-shiftmaster";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/ShiftMaster";
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
  }
  btnSave_onClick(event, formData) {

    const obj = JSON.parse(localStorage.getItem("authUser"));

    if (!this.state.id)
      Fn_AddEditData(
        this.obj,
        { arguList: { id: 0, name: formData.Name , intime : formData.InTime , outtime : formData.OutTime , F_CustomerMaster : obj.uid } },
        this.API_URL_SAVE,
        this.pushFormName
      );
    else
      Fn_AddEditData(
        this.obj,
        { arguList: { id: this.state.id, name: formData.Name , intime : formData.InTime , outtime : formData.OutTime , F_CustomerMaster : obj.uid} },
        this.API_URL_SAVE,
        this.pushFormName
      );
  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };
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
                        <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                         
                                <Row>
                                  <Col lg="6">
                                  <Card>
                                    <CardBody>

                                    <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="lastName" className="col-form-label">Name</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="Name" label="" value={this.state.formData.Name === null ? ''   : this.state.formData.Name} placeholder="Enter Name" errorMessage="Enter Name" validate={{ required: { value: true } }} type="text" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">In Time</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="InTime" label="" value={this.state.formData.InTime === null ? ''   : this.state.formData.InTime} placeholder="Enter InTime" errorMessage="Enter InTime" validate={{ required: { value: true } }} type="time" className="form-control" />
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Out Time</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="OutTime" label="" value={this.state.formData.OutTime === null ? ''   : this.state.formData.OutTime} placeholder="Enter OutTime" errorMessage="Enter OutTime" validate={{ required: { value: true } }}  type="time" className="form-control" />
                                        </Col>
                                      </Row>
                                      
                                     
                                    
                                    </CardBody>
                                  </Card>
                                  </Col>
                                 
                                </Row>
                                <Row>
                                </Row>
                            
                          <div className="d-flex flex-wrap gap-2">
                          <Button
                          type="submit"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          Save
                        </Button>

                        <Button
                          type="button"
                          color="secondary"
                          className="waves-effect"
                          onClick={this.btnCancel_onClick}
                        >
                          Cancel
                        </Button>

                        {this.state.success_msg ? (
                      <SweetAlert
                        title="Customer Saved Successfully!"
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        You clicked the button!
                      </SweetAlert>
                    ) : null}
                          </div>
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
export default compose(container)(pageAddEdit_ShiftMaster);
