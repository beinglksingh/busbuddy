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
import { Fn_DisplayData, Fn_AddEditData } from "../../store/functions";

class pageAddEdit_TransactionStatusCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
    };
    this.obj = this;
    this.formTitle = "Transaction Status";
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/StatusCode";
    this.API_URL_SAVE =  "TransactionStatusCode/0/token";
    this.pushFormName = "/transactioncodemaster";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
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
     
    let vformData = new FormData();
    //Information
    vformData.append("F_ServiceTypeMaster", this.state.formData.F_ServiceTypeMaster);
    vformData.append("TransactionAPICode", formData.TransacionAPICode);
    vformData.append("StatusAPICode", formData.StatusAPICode );
    vformData.append("F_TransactionStatusMaster", this.state.formData.F_TransactionStatusMaster);
   
    if (!this.state.id)
      Fn_AddEditData(
        this.obj,
        { arguList: { id: 0, name: formData.Name } },
        this.API_URL_SAVE,
        this.pushFormName
      );
    else
    Fn_AddEditData(this.obj, { arguList: { id: this.state.id, formData: vformData } }, this.API_URL_SAVE, this.pushFormName, true , "" , "");
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
              <Col xs="12">
                <Card>
                  <CardBody>
                    <CardTitle></CardTitle>
                    <CardSubtitle className="mb-3">
                      Fill all information below
                    </CardSubtitle>
                    <AvForm
                      className="needs-validation"
                      onValidSubmit={this.btnSave_onClick}
                    >
                      <Row>
                        <Col sm="6" className="mb-3">
                          <AvField
                            name="BankName"
                            label="Bank Name"
                            value={this.state.formData.BankName}
                            placeholder="Enter Name"
                            errorMessage="Enter Name"
                            validate={{ required: { value: true } }}
                            type="text"
                            disabled
                            className="form-control"
                          />
                        </Col>
                        <Col sm="6" className="mb-3">
                          <AvField
                            name="Status"
                            label="Status"
                            disabled
                            value={this.state.formData.Status}
                            placeholder="Enter Status"
                            errorMessage="Enter Status"
                            validate={{ required: { value: true } }}
                            type="text"
                            className="form-control"
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="6" className="mb-3">
                          <AvField
                            name="TransacionAPICode"
                            label="Transaction API Code"
                            value={this.state.formData.TransacionAPICode}
                            placeholder="Enter TransactionAPICode"
                            errorMessage="Enter TransactionAPICode"
                            validate={{ required: { value: true } }}
                            type="text"
                            className="form-control"
                          />
                        </Col>
                      </Row>

                       <Row>
                        <Col sm="6" className="mb-3">
                          <AvField
                            name="StatusAPICode"
                            label="Status API Code"
                            value={this.state.formData.StatusAPICode}
                            placeholder="Enter StatusAPICode"
                            errorMessage="Enter StatusAPICode"
                            validate={{ required: { value: true } }}
                            type="text"
                            className="form-control"
                          />
                        </Col>
                      </Row>
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          type="submit"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          Save Changes
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
export default compose(container)(pageAddEdit_TransactionStatusCode);
