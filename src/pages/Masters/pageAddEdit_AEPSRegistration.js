import React, { Component } from "react";
import {
  Container,
  Row,
  Col,

  Card,
  CardBody,

  Button,
  UncontrolledTooltip,
  Modal,
  ModalBody
} from "reactstrap";


import SweetAlert from "react-bootstrap-sweetalert"


// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

// availity-reactstrap-validation
import {
  AvForm,
  AvField
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withRouter, Link } from "react-router-dom";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_CheckIsActive, Fn_DeleteData, Fn_GetReport, Fn_ChangeStateValue } from "../../store/functions";
import  Switch  from "react-switch";
import './datatables.scss'
import {DeleteButton} from 'react-bootstrap-table-next'
import { API_HELPER } from "helpers/ApiHelper";
import Loader from "pages/loader";




class pageAddEdit_AEPSRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      isMDistributor : false,
      isSDistributor : false,
      isDistributor : false,
      isRetailer : false,
      switch9 : false,
      success_msg:false,
      confirm_alert: false,
      balance : [{
        AvailableBalance : 0
      }],
      CalType : true,
      page: 1,
      sizePerPage: 10,
      productData: [],
      isTDS : false,
      modal_backdrop : false,
      Amount : 0,
      isPay : false,
      isDiscover : false,
      fingerprint : '',
      loading : false

    };
    this.obj = this;
    this.formTitle = "AEPS Reg. & Auth.";
    this.breadCrumbTitle = "AEPS";
    this.breadCrumbItem = " " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.PLANMASTERL + "/0/token";
    this.pushFormName = "/aeps";
    this.rtPage_Redirect = "/aeps";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/PlanMasterL";
    this.syno  = this.syno.bind(this);
    this.tog_backdrop =  this.tog_backdrop.bind(this);
      this.CaptureAvdm =  this.CaptureAvdm.bind(this);
    this.discoverAvdm  =  this.discoverAvdm.bind(this);
    
  }
  componentDidMount() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    Fn_CheckIsActive(this.obj, obj.uid);
    //Filing Dropdown

    
//this.discoverAvdm();
    const { id } = this.props.match.params;

    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
  }

   discoverAvdm()
  {

         

    var OldPort = 0;

    var SuccessFlag=0;
          var primaryUrl = "http://127.0.0.1:";

           try {
             var protocol = window.location.href;
             if (protocol.indexOf("https") >= 0) {
              primaryUrl = "https://127.0.0.1:";
            }
           } catch (e)
          { }


      var url = "";
     var finalUrl  =  "";
     var MethodCapture =  "";
     var MethodInfo  =  "";
    
        for (var i = 11100; i <= 11120; i++)
              {
        if(primaryUrl=="https://127.0.0.1:" && OldPort==true)
        {
           i="8005";
        }

        
         
          var verb = "RDSERVICE";
                      var err = "";
          SuccessFlag=0;
          var res;
          $.support.cors = true;
          var httpStaus = false;
          var jsonstr="";
           var data = new Object();
           var obj = new Object();



            $.ajax({

            type: "RDSERVICE",
            async: false,
            crossDomain: true,
            url: primaryUrl + i.toString(),
            contentType: "text/xml; charset=utf-8",
            processData: false,
            cache: false,
            crossDomain:true,

            success: function (data) {
              

              httpStaus = true;
              res = { httpStaus: httpStaus, data: data };
                //alert(data);
              finalUrl = primaryUrl + i.toString();
              var $doc = $.parseXML(data);
              var CmbData1 =  $($doc).find('RDService').attr('status');
              var CmbData2 =  $($doc).find('RDService').attr('info');
              if(RegExp('\\b'+ 'Mantra' +'\\b').test(CmbData2)==true)
              {
                 
                $("#txtDeviceInfo").val(data);

                if($($doc).find('Interface').eq(0).attr('path')=="/rd/capture")
                {
                  MethodCapture=$($doc).find('Interface').eq(0).attr('path');
                }
                if($($doc).find('Interface').eq(1).attr('path')=="/rd/capture")
                {
                  MethodCapture=$($doc).find('Interface').eq(1).attr('path');
                }
                if($($doc).find('Interface').eq(0).attr('path')=="/rd/info")
                {
                  MethodInfo=$($doc).find('Interface').eq(0).attr('path');
                }
                if($($doc).find('Interface').eq(1).attr('path')=="/rd/info")
                {
                  MethodInfo=$($doc).find('Interface').eq(1).attr('path');
                }

               // $("#ddlAVDM").append('<option value='+i.toString()+'>(' + CmbData1 +')'+CmbData2+'</option>')
                SuccessFlag=1;
                alert("RDSERVICE Discover Successfully");
                return;

              }

              //alert(CmbData1);
              //alert(CmbData2);

            },
            error: function (jqXHR, ajaxOptions, thrownError) {
            if(i=="8005" && OldPort==true)
            {
              OldPort=false;
              i="11099";
            }
           
            },

          });



          if(SuccessFlag==1)
          {
            break;
          }


              }

      if(SuccessFlag==0)
      {
       alert("Connection failed Please try again.");
      }

      $("select#ddlAVDM").prop('selectedIndex', 0);

      //$('#txtDeviceInfo').val(DataXML);
      this.setState({finalUrl : finalUrl});
      
  }













 CaptureAvdm() {

  
 var  DString = '';
 var  device="mantra";

 var xmlString = "";


 var strWadh="";
   var strOtp="";


  

var XML='<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="10000" posh="UNKNOWN" env="P" /> '+DString+'<CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';


       var finUrl= this.state.finalUrl;
 

      var verb = "CAPTURE";


                   var err = "";

       var res;
       $.support.cors = true;
       var httpStaus = false;
       var jsonstr="";
       alert('Please Put Finger on Device!')
         $.ajax({

         type: "CAPTURE",
         async: false,
         crossDomain: true,
         url: finUrl,
         data:XML,
         contentType: "text/xml; charset=utf-8",
         processData: false,
         success: function (data) {
          
         
          if(device == "morpho"){
            xmlString = (new XMLSerializer()).serializeToString(data);  //morpho
         }else if(device == "mantra"){
          xmlString = data;  //mantra
         }else if(device == "secugen"){
          xmlString = (new XMLSerializer()).serializeToString(data);  //secugen
         }else if(device == "precision"){
          xmlString = (new XMLSerializer()).serializeToString(data);  //precision
         }else if(device == "startek"){
          xmlString = (new XMLSerializer()).serializeToString(data);  //startek
         }else if(device == "nextrd"){
          xmlString = (new XMLSerializer()).serializeToString(data);  //next rd
         }
         httpStaus = true;
         res = { httpStaus: httpStaus, data: xmlString};
         
       

           var $doc = data;
           var Message =  $($doc).find('Resp').attr('errInfo');
           var errorcode =	 $($doc).find('Resp').attr('errCode');
             if(errorcode==0)
             {
              
              console.log(xmlString);
                
               var $doc = $.parseXML(data);
               var Message =  $($doc).find('Resp').attr('errInfo');
               

               alert(Message);
               
             }else{
              // $('#loaderbala').css("display","none");
               alert('Capture Failed');
               //window.location.reload();
             }	

         },
         error: function (jqXHR, ajaxOptions, thrownError) {
         //$('#txtPidOptions').val(XML);
         alert(thrownError);
           res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
         },
       });

     
      this.setState({fingerprint : xmlString});
      
      
      
      }








  
  syno () {
    this.setState({success_msg : false ,success_auth : false})
  //  this.props.history.push(`${this.rtPage_Redirect}`, {});
  }

  removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  tog_backdrop() {
    this.setState(prevState => ({
      modal_backdrop: !prevState.modal_backdrop,
    }))
    this.removeBodyCss()
  }

   handleDelete  (rowId)  {
    Fn_DeleteData(this.obj, rowId, this.API_URL, this.API_URL + "/Id/0");
  };


  btnSave_onClick  =  async(event, formData)=> {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

   this.setState({loading : true})
   

   
    let vformData = new FormData();
   
  //Information
  vformData.append("BankId", 0);
  vformData.append("MobileNo", this.state.MobileNo);
  vformData.append("AadhaarNo", this.state.AadharNo);
  vformData.append("fingerprint", this.state.fingerprint);
  vformData.append("AgentId", obj.username);
  vformData.append("Amount", this.state.Amount);

  if (formData.TransactionTypeId  == 2){
    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"AEPSRegistration/0/token" , vformData).then(token => { return token } )
    }
    let userToken2 = await AuthUser2();
    if (userToken2.status == 1 || userToken2.status == "1"){
        this.setState({success_msg: true , fingerprint:''});
    }

    else {
      this.setState({ fingerprint:''});
      alert(userToken2.data.response);
    }
  }

  else if (formData.TransactionTypeId == 1){
    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"AEPSAuthenticate/0/token" , vformData).then(token => { return token } )
    }
    let userToken2 = await AuthUser2();
    if (userToken2.status == 1 || userToken2.status == "1"){
      this.setState({success_auth: true, fingerprint : ''})
    }

    else {
      this.setState({ fingerprint:''});
      alert(userToken2.data.response);
    }
  }


  this.setState({loading : false})
  


 

  // if (!this.state.id)    {
  //   Fn_AddEditData(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, "#", true , "VoucherId");
  // }

  // else if (obj.isAdmin == true) {
  //   Fn_AddEditData(this.obj, { arguList: { id: this.state.id, formData: vformData } }, this.API_URL_SAVE, "#", true , "kuku" , "update_msg");
  // }
  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };


  render() {

  

    const defaultSorted = [{
      dataField: 'id',
      order: 'asc'
    }];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: this.state.productData.length, // replace later with size(customers),
      custom: true,
    }

    // Custom Pagination Toggle
    const sizePerPageList = [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
      { text: '15', value: 15 },
      { text: '20', value: 20 },
      { text: '25', value: 25 },
      { text: 'All', value: (this.state.productData).length }];

  
    // Select All Button operation
    const selectRow = {
      mode: 'checkbox'
    }

    const { SearchBar } = Search;

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    



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
              <Col lg="12">
                <Card>
                  <CardBody>
                    {/* <h4 className="card-title mb-4">Basic Wizard</h4> */}
                    <div className="wizard clearfix">
                     
                      <div className="content clearfix">
                        <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                         
                                <Row>
                                  <Col lg="12">
                                  <Card>
                                    <CardBody> 
                                 
                                     

                                    <Row>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Device</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField  name="DeviceId" label="" value={this.state.formData.DeviceId === null ? '-1'   : this.state.formData.DeviceId}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={1} defaultValue label={"Mantra"} />
                                            <option value={2} defaultValue label={"Morpho"} />
                                          </AvField> 
                                        
                                        </Col>
                                        

                                    </Row> 


                                    <Row>
                                      
                                    <Col sm="2" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">Aadhar No.</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField name="AadharNo"  value={this.state.AadharNo === null ? ''   : this.state.AadharNo} onChange={(e) => Fn_ChangeStateValue(this.obj, 'AadharNo', e.target.value)}  placeholder="AadharNo"   type="number"   className="form-control" />
                                        </Col>
                                        </Row>
                                        <Row>
                                     
                                      <Col sm="2" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">Mobile No.</label>
                                        </Col>
                                      <Col sm="4" className="mb-0">
                                        <AvField name="MobileNo"  value={this.state.MobileNo === null ? ''   : this.state.MobileNo} onChange={(e) => Fn_ChangeStateValue(this.obj, 'MobileNo', e.target.value)}  placeholder="MobileNo"   type="number"   className="form-control" />
                                      </Col>  
                                    </Row>

                                    <Row>

                                    <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Transaction Type</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField  name="TransactionTypeId" label="" onChange={this.onTranChange} value={this.state.formData.TransactionTypeId === null ? '-1'   : this.state.formData.TransactionTypeId}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={1} defaultValue label={"Authenticate"} />
                                            <option value={2} defaultValue label={"Registration"} />
                                          </AvField> 
                                        </Col>
                                    </Row>


                                     


                                     

                                   
                                      <div className="d-flex flex-wrap gap-2">
                                      <Button
                          type="submit"
                          color="primary"
                          disabled={this.state.fingerprint == '' ? true : false}
                          className="mr-1 waves-effect waves-light"
                        >
                          Proceed
                        </Button>

                        <Button
                          type="button"
                          color="primary"
                          disabled={this.state.fingerprint=='' ?false : true}
                          className="mr-1 waves-effect waves-light"
                          onClick={this.discoverAvdm}
                        >
                          Check Device
                        </Button>

                        <Button
                          type="button"
                          color="primary"
                          disabled={this.state.fingerprint=='' ?false : true}
                          className="mr-1 waves-effect waves-light"
                          onClick={this.CaptureAvdm}
                        >
                          Capture
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
                                     
                                    
                                    </CardBody>
                                  </Card>
                                  </Col>
                                 
                                </Row>




                               

             



                               
                            
                          <div className="d-flex flex-wrap gap-2">
                         

                        {this.state.success_msg ? (
                      <SweetAlert
                        title={'Registration Success!'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        Now please Authenticate to use AEPS!
                      </SweetAlert>
                    ) : null}

{this.state.success_auth ? (
                      <SweetAlert
                        title={'Authentication Success!'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        Now you can use AEPS services today!
                      </SweetAlert>
                    ) : null}
                     {this.state.confirm_alert ? (
                                                                <SweetAlert
                                                                    title="Are you sure?"
                                                                    warning
                                                                    showCancel
                                                                    confirmButtonText="Yes, delete it!"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="danger"
                                                                    // onConfirm={() =>this.props.btnDelete_onClick(this.props.selectedFormData)}
                                                                    // onCancel={() =>this.props.toggleDeleteConfirm(this.props.obj,formData,false)}
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
export default compose(container)(pageAddEdit_AEPSRegistration);
