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
import Loader from "pages/loader";

class pageAddEdit_LedgerMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      F_LedgerGroupMaster : 0,
      QRImage : '',
      loading : false,
      isshowdesktop : 2
    };
    this.obj = this;
    this.formTitle = "Transaction Status";
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/LedgerMaster";
    this.API_URL_SAVE =  "AddEditLedgerMaster/0/token";
    this.pushFormName = "/masters-ledgermaster";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.checkchange  =  this.checkchange.bind(this);
  }
  componentDidMount() {
    Fn_FillListData(this.obj, "ledgergroup", API_WEB_URLS.MASTER + "/0/token/LedgerGroupMaster/Id/0");
    const { id } = this.props.match.params;
    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id", "ledger");
    } else {
      this.setState({ id: 0 , isshowdesktop : false});
    }
  }


  checkchange (event){
   

    this.setState({isshowdesktop : event.target.checked})

  }





  btnSave_onClick(event, formData) {
this.setState({loading : true})


     
    let vformData = new FormData();
    //Information
    vformData.append("F_LedgerGroupMaster", this.state.F_LedgerGroupMaster);
    vformData.append("Name", formData.Name);
    vformData.append("AccountHolderName", formData.AccountHolderName == undefined ? '' : formData.AccountHolderName);
    vformData.append("AccountNo", formData.AccountNo == undefined ? 0 : formData.AccountNo );
    vformData.append("IFSC", formData.IFSC == undefined ? '' : formData.IFSC);
    vformData.append("UPIId", formData.UPIId == undefined ? '' : formData.UPIId);
    vformData.append("ID_ImageURL_1.ImageFile", this.state.QRImage);
    vformData.append("ID_ImageURL_1.ImageFileName", "QR");
    vformData.append("IsDesktop", this.state.isshowdesktop ==  2 ? this.state.formData.IsShowDesktop : this.state.isshowdesktop);
   
    if (!this.state.id)
      Fn_AddEditData(
        this.obj,
        { arguList: { id: 0, formData: vformData } },
        this.API_URL_SAVE,
        this.pushFormName,
        true
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
        {this.state.loading ? <Loader /> : null}
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
                        <AvField  name="F_LedgerGroupMaster" label="" value={this.state.formData.F_LedgerGroupMaster === null ? '-1'   : this.state.formData.F_LedgerGroupMaster} onChange={(e)=> Fn_ChangeStateValue(this.obj,"F_LedgerGroupMaster", e.target.value)}  type="select" className="form-select" >
                                            <option value={0} defaultValue label={"Select"} />
                                            {this.state.ledgergroup
                                              ? this.state.ledgergroup.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                        </Col>
                        </Row>

                      
                        <Row>
                        <Col sm="4" className="mb-3">
                          <AvField
                            name="Name"
                            label="Name"
                            value={this.state.formData.Name}
                            placeholder="Enter Name"
                            errorMessage="Enter Name"
                            validate={{ required: { value: true } }}
                            type="text"
                            className="form-control"
                          />
                        </Col>


                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Show Desktop</label>
                                        </Col>
                        <Col sm="6" className="mb-3">
                          <AvField
                            name="isDesktop"
                            label="isDesktop"
                            onChange={this.checkchange}
                            checked={this.state.formData.IsShowDesktop == null ? false : this.state.formData.IsShowDesktop}
                            placeholder="Show Desktop"
                            type="checkbox"
                            className="form-control"
                          />
                        </Col>
                      </Row>
                      {this.state.F_LedgerGroupMaster == 12 ? <>

                      <Row>
                        <Col sm="6" className="mb-3">
                          <AvField
                            name="AccountHolderName"
                            label="Account Holder Name"
                            value={this.state.formData.AccountHolderName}
                            placeholder="Enter AccountHolderName"
                            type="text"
                            className="form-control"
                          />
                        </Col>
                      </Row>

                       <Row>
                        <Col sm="6" className="mb-3">
                          <AvField
                            name="AccountNo"
                            label="AccountNo"
                            value={this.state.formData.AccountNo}
                            placeholder="Enter AccountNo"
                            type="number"
                            className="form-control"
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="6" className="mb-3">
                          <AvField
                            name="IFSC"
                            label="IFSC"
                            value={this.state.formData.IFSC}
                            placeholder="Enter IFSC"
                            type="text"
                            className="form-control"
                          />
                        </Col>
                      </Row>

                    

                      <Row>
                        <Col sm="6" className="mb-3">
                          <AvField
                            name="UPIId"
                            label="UPIId"
                            value={this.state.formData.UPIId}
                            placeholder="Enter UPIId"
                            type="text"
                            className="form-control"
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="6" className="mb-3">
                        <AvField name="QRImage" value='' label="QRImage" placeholder="Upload File" errorMessage="Upload File"  onChange={(e) => Fn_ChangeStateValue(this.obj, 'QRImage', e.target.files[0])} accept=".gif,.jpg,.jpeg,.png" type="file" className="form-control" />
                        </Col>
                      </Row>
                      </> : null}
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
export default compose(container)(pageAddEdit_LedgerMaster);
