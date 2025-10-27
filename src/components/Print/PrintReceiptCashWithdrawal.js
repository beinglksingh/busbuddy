import React, { Component } from 'react';
import ReceiptCashWithdrawal from './ReceiptCashWithdrwal';
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

class PrintReceiptCashWithdrawal extends Component {


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
         }],
         printdata : [{}]
        };
        this.obj = this;
        this.formTitle = "Print Receipt";
        this.breadCrumbTitle = "Print Receipt";
        this.breadCrumbItem = " " + this.formTitle;
        this.back  = this.back.bind(this);
        
      }


      back(){
        this.props.history.push('/aeps');
      }

      componentDidMount () {

        const { id } = this.props.match.params;
        
    Fn_FillListData(this.obj, "printdata", API_WEB_URLS.MASTER + "/0/token/AEPSCashWithdrwalPrint/Id/"+id);

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
        
        <ReceiptCashWithdrawal 
         ShopName={this.state.printdata[0].ShopName} 
         AltMobileNo={this.state.printdata[0].AltMobileNo} 
         Address={this.state.printdata[0].Address} 
         TransactionCode={this.state.printdata[0].TransactionCode} 
         AadharNo={this.state.printdata[0].AadharNo} 
         MobileNo={this.state.printdata[0].MobileNo} 

         BankRRN={this.state.printdata[0].BankRRN} 
         TransactionStatus={this.state.printdata[0].TransactionStatus} 
         TransactionDate={this.state.printdata[0].TransactionDate} 
         Amount={this.state.printdata[0].Amount} 
         BalanceAmount={this.state.printdata[0].BalanceAmount} 
        
        
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

export default compose(container)(PrintReceiptCashWithdrawal);
