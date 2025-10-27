import React, { Component } from 'react';
import ReceiptForm from './ReceiptForm'; //
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

class PrintReceipt extends Component {


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

    Fn_FillListData(this.obj, "Details", API_WEB_URLS.MASTER + "/0/token/DMRPrintDetails/Id/"+id);
   


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
        
        <ReceiptForm 
        agentName={this.state.Details[0].agentName} 
        agentaddress={this.state.Details[0].agentaddress} 
        agentcity={this.state.Details[0].agentcity} 
        apentpin={this.state.Details[0].apentpin} 
        agentno={this.state.Details[0].agentno} 
        date={this.state.Details[0].date} 
        transactioncode={this.state.Details[0].transactioncode} 
        amount={this.state.Details[0].Amount} 
        sendermobile={this.state.Details[0].sendermobile} 
        benname={this.state.Details[0].benname} 
        accountno={this.state.Details[0].accountno} 
        bankname={this.state.Details[0].bankname} 
        utr={this.state.Details[0].utr} 
        status={this.state.Details[0].status} 
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

export default compose(container)(PrintReceipt);
