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
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_CheckIsActive, Fn_ChangeStateValue } from "../../store/functions";
import { API_HELPER } from "helpers/ApiHelper";


class pageAddEdit_Recharge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      isMDistributor : false,
      isSDistributor : false,
      isDistributor : false,
      isRetailer : false,
      switch9 : true,
      success_msg:false,
      confirm_alert: false,
      IsDefault : true,
      activeTab : 1,
      passedSteps: [1],
      success_recharge : false,
      insufficienfund : false,
      error_recharge : false,
      error : '',
      isLoading : false
    };
    this.obj = this;
    this.formTitle = "RECHARGE ";
    this.breadCrumbTitle = "RECHARGE ";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.pushFormName = "/dashboard";
    this.rtPage_Redirect = "/dashboard";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/RechargeApi";
    this.API_URL_SAVE = API_WEB_URLS.RECHARGEAPI + "/0/token";
    this.syno  =  this.syno.bind(this);
    this.toggleTab.bind(this);
    
  }
  componentDidMount() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    Fn_CheckIsActive(this.obj, obj.uid);


    const { id } = this.props.match.params;

    Fn_FillListData(this.obj, "operator", API_WEB_URLS.MASTER + "/0/token/RechargeOperator/Id/"+this.state.activeTab);

    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
  }









  
  syno () {
    this.setState({success_recharge : false ,insufficienfund : false, error_recharge : false, isLoading: false})
  
    
  }


  btnSave_onClick = async (event, formData)=> {
this.setState({isLoading : true});
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

var Amount  =  0;
var MobileNo =  0;
var OperatorId  =  0;
if (this.state.activeTab  ==1){
    Amount  =  this.state.PrepaidAmount;
    MobileNo = this.state.PrepaidMobileNo;
    OperatorId  = this.state.PrepaidOperatorId;
}
else if (this.state.activeTab  ==2){
  Amount  =  this.state.PostpaidAmount;
  MobileNo = this.state.PostpaidMobileNo;
  OperatorId  = this.state.PostpaidOperatorId;
}

else if (this.state.activeTab  ==2){
  Amount  =  this.state.DTHAmount;
  MobileNo = this.state.DTHNo;
  OperatorId  = this.state.DTHOperatorId;
}



    let vformData = new FormData();
  //Information
  vformData.append("MobileNo", MobileNo);
  vformData.append("Amount", Amount);
  vformData.append("OperatorId", OperatorId);
  vformData.append("RechargeType", this.state.activeTab);
  
  let AuthUser2 = function() {
    return API_HELPER.apiPUT_Multipart(API_WEB_URLS.BASE+"ProceedRecharge/0/token/"+obj.uid , vformData).then(token => { return token } )
  }
  let userToken2 = await AuthUser2();
  
 if (userToken2.data.response[0].Id  == 1){
  this.setState({isLoading :false});
    if (userToken2.status  ==  -2 || userToken2.status  ==  "-2"){
      this.setState({error_recharge : true, error : userToken2.message});
    }
    else if (userToken2.status > 0){
  this.setState({success_recharge : true})
    }

    else {
      this.setState({error_recharge : true, error : 'Internal Server Error'});
    }
 }

 else if (userToken2.data.response[0].Id  == -6){
  this.setState({error_recharge : true, error : 'Internal Server Error'});
 }
 else {
  this.setState({insufficienfund : true, isLoading :false});
 }

  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };
  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      if (tab >= 1 && tab <= 4) {
        var modifiedSteps = [...this.state.passedSteps, tab];
        
    Fn_FillListData(this.obj, "operator", API_WEB_URLS.MASTER + "/0/token/RechargeOperator/Id/"+tab);

        this.setState({
          activeTab: tab,
          passedSteps: modifiedSteps
        });
      }
    }
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
              <Col lg="12">
                <Card>
                  <CardBody>
                    {/* <h4 className="card-title mb-4">Basic Wizard</h4> */}
                    <div className="wizard clearfix">
                     
                    <div className="steps clearfix">
                      <ul>
                          <NavItem
                            className={classnames({
                              current: this.state.activeTab === 1,
                            })}
                          >
                            <NavLink
                              className={classnames({
                                active: this.state.activeTab === 1,
                              })}
                              onClick={() => {
                                this.toggleTab(1);
                              }}
                            >
                              <span className="number">1.</span> Recharge
                              
                            </NavLink>
                          </NavItem>
                          <NavItem

className={classnames({
  current: this.state.activeTab === 2,
})}
>
<NavLink
  className={classnames({
    active: this.state.activeTab === 2,
  })}
  onClick={() => {
    this.toggleTab(2);  
  }}
>
  <span className="number">2.</span> 
  Postpaid
</NavLink>


                        
                          </NavItem>



                          <NavItem
className={classnames({
  current: this.state.activeTab === 3,
})}
>


<NavLink
  className={classnames({
    active: this.state.activeTab === 3,
  })}
  onClick={() => {
    this.toggleTab(3);
  }}
>
  <span className="number">3.</span> 
  DTH
</NavLink>
                            
                          </NavItem>
                          <NavItem

                          
className={classnames({
  current: this.state.activeTab === 4,
})}
>

                          
                          </NavItem>
                        </ul>
                        </div>
                        <div className="content clearfix">
                        <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                        <TabContent activeTab={this.state.activeTab} className="body">
                            <TabPane tabId={1}>

                            <Row>
                                  <Col lg="8">
                                  <Card>
                                    <CardBody>

                                    <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Postpaid Mobile No.</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="PrepaidMobileNo" label="" value={this.state.formData.PrepaidMobileNo === null ? ''   : this.state.formData.PrepaidMobileNo} onChange={(e) => Fn_ChangeStateValue(this.obj, 'PrepaidMobileNo', e.target.value)} placeholder="Enter MobileNo"   type="number" className="form-control" />
                                        </Col>



                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Amount</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="PrepaidAmount" label="" value={this.state.formData.PrepaidAmount === null ? ''   : this.state.formData.PrepaidAmount} onChange={(e) => Fn_ChangeStateValue(this.obj, 'PrepaidAmount', e.target.value)} placeholder="Enter Amount"   type="number" className="form-control" />
                                        </Col>

                                      </Row>


                                     

                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Operator</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField  name="PrepaidOperatorId" label="" value={this.state.formData.PrepaidOperatorId === null ? '-1'   : this.state.formData.PrepaidOperatorId} onChange={(e) => Fn_ChangeStateValue(this.obj, 'PrepaidOperatorId', e.target.value)}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.operator
                                              ? this.state.operator.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>
                                      </Row>

                                    
                                    </CardBody>
                                  </Card>
                                  </Col>
                                 
                                </Row>
                   
                          </TabPane>


                          <TabPane tabId={2}>
                                       



                                <Row>
                                  <Col lg="8">
                                  <Card>
                                    <CardBody>

                                    <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Mobile No.</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="PostpaidMobileNo" label="" value={this.state.formData.PostpaidMobileNo === null ? ''   : this.state.formData.PostpaidMobileNo} onChange={(e) => Fn_ChangeStateValue(this.obj, 'PostpaidMobileNo', e.target.value)} placeholder="Enter MobileNo"   type="number" className="form-control" />
                                        </Col>



                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Amount</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField name="PostpaidAmount" label="" value={this.state.formData.PostpaidAmount === null ? ''   : this.state.formData.PostpaidAmount} onChange={(e) => Fn_ChangeStateValue(this.obj, 'PostpaidAmount', e.target.value)} placeholder="Enter Amount"   type="number" className="form-control" />
                                        </Col>

                                      </Row>


                                     

                                      <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Operator</label>
                                        </Col>
                                        <Col sm="4">
                                        <AvField  name="PostpaidOperatorId" label="" value={this.state.formData.PostpaidOperatorId === null ? '-1'   : this.state.formData.PostpaidOperatorId} onChange={(e) => Fn_ChangeStateValue(this.obj, 'PostpaidOperatorId', e.target.value)}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.operator
                                              ? this.state.operator.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>
                                      </Row>

                                    
                                    </CardBody>
                                  </Card>
                                  </Col>
                                 
                                </Row>
                               
                        
                            
                        
                          </TabPane>

                          <TabPane tabId={3}>
                                       



                                       <Row>
                                         <Col lg="8">
                                         <Card>
                                           <CardBody>
       
                                           <Row>
                                               <Col sm="2" className="mb-3">
                                                 <label htmlFor="DateofBirth" className="col-form-label">DTH No.</label>
                                               </Col>
                                               <Col sm="4">
                                               <AvField name="DTHNo" label="" value={this.state.formData.DTHNo === null ? ''   : this.state.formData.DTHNo} onChange={(e) => Fn_ChangeStateValue(this.obj, 'DTHNo', e.target.value)} placeholder="Enter DTHNo"   type="number" className="form-control" />
                                               </Col>
       
       
       
                                               <Col sm="2" className="mb-3">
                                                 <label htmlFor="DateofBirth" className="col-form-label">Amount</label>
                                               </Col>
                                               <Col sm="4">
                                               <AvField name="DTHAmount" label="" value={this.state.formData.DTHAmount === null ? ''   : this.state.formData.DTHAmount} onChange={(e) => Fn_ChangeStateValue(this.obj, 'DTHAmount', e.target.value)} placeholder="Enter DTHAmount"   type="number" className="form-control" />
                                               </Col>
       
                                             </Row>
       
       
                                            
       
                                             <Row>
                                               <Col sm="2" className="mb-3">
                                                 <label htmlFor="DateofBirth" className="col-form-label">Operator</label>
                                               </Col>
                                               <Col sm="4">
                                               <AvField  name="DTHOperatorId" label="" value={this.state.formData.DTHOperatorId === null ? '-1'   : this.state.formData.DTHOperatorId} onChange={(e) => Fn_ChangeStateValue(this.obj, 'DTHOperatorId', e.target.value)}  type="select" className="form-select" >
                                                   <option value={-1} defaultValue label={"Select"} />
                                                   {this.state.operator
                                                     ? this.state.operator.map(
                                                         (option, key) => (
                                                           <option key={option.Id} value={option.Id} label={option.Name} />
                                                         )
                                                       )
                                                     : null}
                                                 </AvField> 
                                               </Col>
                                             </Row>
       
                                           
                                           </CardBody>
                                         </Card>
                                         </Col>
                                        
                                       </Row>
                                      
                               
                                   
                               
                                 </TabPane>
                          </TabContent>
                          <div className="d-flex flex-wrap gap-2">



{this.state.isLoading ? <Button
                          type="button"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                        Loading
                        </Button> :   <Button
                          type="submit"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          Recharge
                        </Button> }
                          
                         
                        

                        <Button
                          type="button"
                          color="secondary"
                          className="waves-effect"
                          onClick={this.btnCancel_onClick}
                        >
                          Cancel
                        </Button>

                        {this.state.success_recharge ? (
                      <SweetAlert
                        title={'Recharge Done Successfully!'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                      >
                     
                      </SweetAlert>
                    ) : null}

{this.state.error_recharge ? (
                      <SweetAlert
                        title={'Recharge Failed!'}
                        danger
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                      >
                     {this.state.error};
                      </SweetAlert>
                    ) : null}

{this.state.insufficienfund ? (
                      <SweetAlert
                        title={'Insufficient Funds!'}
                        danger
                       
                        confirmBtnBsStyle="danger"
                      
                        onConfirm={this.syno}
                        
                      >
                     
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
export default compose(container)(pageAddEdit_Recharge);
