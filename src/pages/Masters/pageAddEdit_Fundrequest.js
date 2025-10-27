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
import Loader from "pages/loader";
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_ChangeStateValue } from "../../store/functions";

class pageAddEdit_FundRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      F_LedgerGroupMaster : 0,
      QRImage : '',
      isloading : false
    };
    this.obj = this;
    this.formTitle = "Fund Request";
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Add " + this.formTitle;
    //this.API_URL = API_WEB_URLS.MASTER + "/0/token/LedgerMaster";
    this.API_URL_SAVE =  "InsertFundRequest/0/token";
    this.pushFormName = "/fundrequestreport";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.getdetails  = this.getdetails.bind(this);
  }


  getdetails(event) {
    
    if(event.target.value >0){
    const foundItem = this.state.bank.find(item => item.Id == event.target.value);
      if (foundItem.AccountNo == null ||foundItem.AccountNo == ''){
        this.setState ({
          AccountNo : 0,
          AccountHolderName : '',
          IFSC : 0,
          UPIId  : '',
          QRImage : ''
        });
      }

      else{
    this.setState ({
      AccountNo : foundItem.AccountNo,
      AccountHolderName : foundItem.AccountHolderName,
      IFSC : foundItem.IFSC,
      UPIId  : foundItem.UPIId,
      QRImage : foundItem.QRImage
    });
  }
  }

    else{
      this.setState ({
        AccountNo : 0,
        AccountHolderName : '',
        IFSC : 0,
        UPIId  : '',
        QRImage : ''
      });
    }



  }





  componentDidMount() {
    Fn_FillListData(this.obj, "bank", API_WEB_URLS.MASTER + "/0/token/LedgerBank/F_LedgerGroupMaster/12");
    Fn_FillListData(this.obj, "paymentmode", API_WEB_URLS.MASTER + "/0/token/PaymentMode/Id/0");
    const { id } = this.props.match.params;
    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id", "ledger");
    } else {
      this.setState({ id: 0 });
    }
  }
  btnSave_onClick(event, formData) {
    this.setState({isloading : true});

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    //Information
    vformData.append("F_BankMaster", formData.BankId);
    vformData.append("PaymentMode", formData.ModeId);
    vformData.append("SenderAccountNo", 0);
    vformData.append("TransactionCode", formData.TransactionCode );
    vformData.append("Amount", formData.Amount);
    vformData.append("Narration", formData.Remarks);
    vformData.append("UserId", obj.uid);
    
   


    if (!this.state.id)
      Fn_AddEditData(
        this.obj,
        { arguList: { id: 0, formData: vformData } },
        this.API_URL_SAVE,
        this.pushFormName,
        true
      );

      this.setState({isloading : false});
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
        {this.state.isloading ? <Loader /> : null}
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
                                  <Col lg="8">
                                 
                                    <Row>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Select Bank</label>
                                        </Col>
                                    <Col sm="3">
                                        <AvField  name="BankId" label="" value={this.state.formData.BankId === null ? '-1'   : this.state.formData.BankId} onChange={this.getdetails}   type="select" className="form-select" >
                                            <option value={0} defaultValue label={"Select"} />
                                            {this.state.bank
                                              ? this.state.bank.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>


                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label"> Select Mode</label>
                                        </Col>
                                    <Col sm="3">
                                      
                                        <AvField  name="ModeId" label="" value={this.state.formData.ModeId === null ? '-1'   : this.state.formData.ModeId}   type="select" className="form-select" >
                                        <option value={0} defaultValue label={"Select"} />
                                            {this.state.paymentmode
                                              ? this.state.paymentmode.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>

</Row>
<Row>

                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Account Holder</label>
                                        </Col>
                                 
                                        <Col sm="3" className="mb-3">
                                        <AvField name="AccountHolderName" label="" value={this.state.AccountHolderName } placeholder="AccountHolderName" disabled  type="text"  className="form-control" />
                                        </Col>
                                       


                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Account No</label>
                                        </Col>
                                 
                                        <Col sm="3" className="mb-3">
                                        <AvField name="AccountNo" label="" value={this.state.AccountNo } placeholder="AccountNo" disabled type="number"  className="form-control" />
                                        </Col>


                                       
                                       


                                    </Row>

                                    <Row>
                                    <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">IFSC</label>
                                        </Col>
                                 
                                        <Col sm="3" className="mb-3">
                                        <AvField name="IFSC" label="" value={this.state.IFSC } placeholder="IFSC" disabled type="text"  className="form-control" />
                                        </Col>

                                    {/* <Col sm="2" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">SenderAccountNo</label>
                                        </Col>
                                 
                                        <Col sm="3" className="mb-3">
                                        <AvField name="SenderAccountNo" label="" value={this.state.formData.SenderAccountNo } placeholder="SenderAccountNo"  type="number"  className="form-control" />
                                        </Col> */}


                          <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">TXN/Cheque No. </label>
                                        </Col>
                                 
                                        <Col sm="3" className="mb-3">
                                        <AvField name="TransactionCode" label="" value={this.state.formData.TransactionCode  } placeholder="TransactionCode "  type="text"  className="form-control" />
                                        </Col>

                                      

                                        


                                    </Row>

                                    <Row>



                                        
                                    <Col sm="1" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Remarks </label>
                                        </Col>
                                 
                                        <Col sm="4" className="mb-3">
                                        <AvField name="Remarks" label="" value={this.state.formData.Remarks  } placeholder="Remarks "  type="text"  className="form-control" />
                                        </Col>
                                    </Row>
                                    
                                    <Row>


<Col sm="1" className="mb-3">
  <label htmlFor="firstName" className="col-form-label">Amount </label>
</Col>

<Col sm="3" className="mb-3">
<AvField name="Amount" label="" value={this.state.formData.Amount  } placeholder="Amount "  type="number"  className="form-control" />
</Col>

</Row>
                                  
                                        </Col>


                                        <Col lg="4">


                                        {this.state.QRImage!='' ? <>
                      <Row>
                      <Col sm="6" className="mb-3">
                        <img width={300} height={400} src={API_WEB_URLS.IMAGEBASE+'QRImages/'+this.state.QRImage}></img>
                        </Col>
                        {/* <Col sm="4" className="mb-3">
                        <img width={300} height={300} src={API_WEB_URLS.IMAGEBASE+'QRImages/'+this.state.QRImage}></img>
                        </Col>
                        <Col sm="4" className="mb-3">
                        <img width={300} height={300} src={API_WEB_URLS.IMAGEBASE+'QRImages/'+this.state.QRImage}></img>
                        </Col> */}
                      </Row>
                      </> : null} 

                                          </Col>
                                        </Row>

                                        

                      
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          type="submit"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          Proceed
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
export default compose(container)(pageAddEdit_FundRequest);
