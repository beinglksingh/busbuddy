import React, { Component } from 'react';
import ReceiptNMR from './ReceiptNMR';
 import { compose } from "recompose";
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
import { container } from "../../store/Containers/cntCommon";
import Breadcrumbs from 'components/Common/Breadcrumb';

import { API_WEB_URLS } from 'constants/constAPI';
import { Fn_FillListData } from 'store/functions';

class PrintReceiptNMR extends Component {


    constructor(props) {
        super(props);
        this.state = {
         Details : [{
            agentName : '',
            agentaddress : '',
            agentcity : '',
            apentpin : '',
            agentno : '',
            date : '',
            transactioncode : '',
            Amount : '',
            sendermobile : '',
            benname : '',
            accountno : '',
            bankname : '',
            utr : '',
            status : '',
         }]
        };
        this.obj = this;
        this.formTitle = "Print Receipt";
        this.breadCrumbTitle = "Print Receipt";
        this.breadCrumbItem = " " + this.formTitle;
        this.back  = this.back.bind(this);
        
      }


      back(){
        this.props.history.push('/remitter');
      }

      componentDidMount () {
        
    const { id } = this.props.match.params;

    Fn_FillListData(this.obj, "Details", API_WEB_URLS.MASTER + "/0/token/NMRPrintDetails/Id/"+id);
   


    // if (id) {
    //   this.setState({ id: id });
    //   this.breadCrumbItem = "Edit " + this.formTitle;
    //   Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    // } else {
    //   this.setState({ id: 0 });
    // }
      }

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
        
        <ReceiptNMR 
        LocalDate={this.state.Details[0].LocalDate} 
        CollectedAmount={this.state.Details[0].CollectedAmount} 
        SenderName={this.state.Details[0].SenderName} 
        ServiceCharge={this.state.Details[0].ServiceCharge} 
        SenderNationality={this.state.Details[0].SenderNationality} 
        SenderIDNumber={this.state.Details[0].SenderIDNumber} 
        SendAmount={this.state.Details[0].SendAmount} 
        SenderMobile={this.state.Details[0].SenderMobile} 
        ExchangeRate={this.state.Details[0].ExchangeRate} 
        SenderAddress={this.state.Details[0].SenderAddress} 
        PayoutCharges={this.state.Details[0].PayoutCharges} 
        PayAmount={this.state.Details[0].PayAmount} 
        PaymentMode={this.state.Details[0].PaymentMode} 
        ReceiverName={this.state.Details[0].ReceiverName} 

        ReceiverAddress={this.state.Details[0].ReceiverAddress} 
        ReceiverMobile={this.state.Details[0].ReceiverMobile} 
        TransactionId = {this.state.Details[0].TransactionId} 
        UTR = {this.state.Details[0].UTR} 
        
        />

<Col sm="3" className="mb-3">
                                        <Button
                          type="button"
                          color="primary"
                          onClick={this.back}
                        
                          className="mr-1 waves-effect waves-light"
                        >
                          Back
                        </Button>
                                          </Col>
      </Row>
      </Container>
      </div>
      </React.Fragment>
    );
  }
}

export default compose(container)(PrintReceiptNMR);
