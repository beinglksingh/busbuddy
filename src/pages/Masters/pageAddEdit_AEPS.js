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



import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import './datatables.scss';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

// availity-reactstrap-validation
import {
  AvForm,
  AvField
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_CheckIsActive, Fn_DeleteData, Fn_GetReport, Fn_ChangeStateValue, Fn_CheckIsAEPSAuth } from "../../store/functions";

import './datatables.scss'

import { API_HELPER } from "helpers/ApiHelper";
import Loader from "pages/loader";
import lockimg from './lock.png';
import Select from 'react-select';
import { event } from "jquery";






class pageAddEdit_AEPS extends Component {
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
      balance : 0,
      CalType : true,
      page: 1,
      sizePerPage: 10,
      productData: [],
      isTDS : false,
      modal_backdrop : false,
      Amount : 0,
      isPay : false,
      fingerprint : '',
      success_tran : false,
      productData: [],
      loading : false,
      IsAEPSAut : false,
      IsAEPSAutCW : false,
      CustMobileNO : 0,
      CustAadharNo : 0,
      selectedOption: '1',
      selectedGroup : {},
      confirm : false,
      IsNoDone : false,
      reset : false,
      success_tranp : false
      

    };
    this.obj = this;
    this.formTitle = "AEPS";
    this.breadCrumbTitle = "AEPS";
    this.breadCrumbItem = " " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.PLANMASTERL + "/0/token";
    this.pushFormName = "/dashboard";
    this.rtPage_Redirect = "/adashboard";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/PlanMasterL";
    this.syno  = this.syno.bind(this);
    this.tog_backdrop =  this.tog_backdrop.bind(this);
    this.getbanklist  =  this.getbanklist.bind(this);
    this.onTranChange  = this.onTranChange.bind(this);
    this.CaptureAvdm =  this.CaptureAvdm.bind(this);
    this.discoverAvdm  =  this.discoverAvdm.bind(this);
    this.continueregistration  = this.continueregistration.bind(this);
    this.handleSelectGroup  = this.handleSelectGroup.bind(this);
    this.confirm  = this.confirm.bind(this);
    this.scan  = this.scan.bind(this);
    this.authenticate  = this.authenticate.bind(this);
    this.transus  = this.transus.bind(this);
    this.authenticateCW  = this.authenticateCW.bind(this);
    
  }
  componentDidMount() {

    //  const responselog = "\n\n{\"status\":true,\"ackno\":19753825,\"datetime\":\"2023-10-27 10:57:07\",\"balanceamount\":\"28976.23\",\"bankrrn\":\"330010158269\",\"bankiin\":508505,\"message\":\"Mini statement has been generated successfully.\",\"errorcode\":\"0\",\"ministatement\":[{\"date\":\"27\\/10\",\"amount\":3.84,\"txnType\":\"D\",\"narration\":\"FIG\\/F\\/14287491\"},{\"date\":\"27\\/10\",\"amount\":3.84,\"txnType\":\"D\",\"narration\":\"FIG\\/F\\/14216679\"},{\"date\":\"25\\/10\",\"amount\":3.84,\"txnType\":\"D\",\"narration\":\"FIG\\/F\\/73898655\"},{\"date\":\"25\\/10\",\"amount\":3.84,\"txnType\":\"D\",\"narration\":\"FIG\\/F\\/73870034\"},{\"date\":\"25\\/10\",\"amount\":3.84,\"txnType\":\"D\",\"narration\":\"FIG\\/F\\/73735868\"},{\"date\":\"25\\/10\",\"amount\":3.84,\"txnType\":\"D\",\"narration\":\"FIG\\/F\\/73552334\"}],\"pipe\":\"bank2\",\"ministatementlist\":[],\"response_code\":1,\"last_aadhar\":\"4359\",\"name\":\"PIYUSH UTSAVLAL JAIN\",\"clientrefno\":\"212231027105707\"}";

    //   const jsonObject = JSON.parse(responselog);
     

    //   this.setState({ minidata : jsonObject})

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    Fn_CheckIsActive(this.obj, obj.uid);

    Fn_CheckIsAEPSAuth(this.obj, obj.uid);
    //Filing Dropdown

    this.getbanklist();

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
                console.log("Success");
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




  authenticate  = async()=> {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.setState({loading : true, IsAEPSAut : false})
    
 
    
     let vformData = new FormData();
    
   //Information
   vformData.append("BankId", 0);
   vformData.append("MobileNo", this.state.RetailerMobileNo);
   vformData.append("AadhaarNo", this.state.RetailerFullAadhaarNo);
   vformData.append("fingerprint", this.state.fingerprint);
   vformData.append("AgentId", obj.username);
   vformData.append("Amount", this.state.Amount);
 
 
  
     let AuthUser2 = function() {
       return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"AEPSAuthenticate/0/token" , vformData).then(token => { return token } )
     }
     let userToken2 = await AuthUser2();
     if (userToken2.status == 1 || userToken2.status == "1"){
       this.setState({success_auth: true, fingerprint : '' })
     }
 
     else {
       this.setState({ fingerprint:'',IsAEPSAut : true});
       alert(userToken2.message);
     }
  
 
 
   this.setState({loading : false})
   
 
  }







  

  authenticateCW  = async()=> {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.setState({loading : true, IsAEPSAutCW : false})
    
 
    
     let vformData = new FormData();
    
   //Information
   vformData.append("BankId", 0);
   vformData.append("MobileNo", this.state.RetailerMobileNo);
   vformData.append("AadhaarNo", this.state.RetailerFullAadhaarNo);
   vformData.append("fingerprint", this.state.fingerprint);
   vformData.append("AgentId", obj.username);
   vformData.append("Amount", this.state.Amount);
 
 
  
     let AuthUser2 = function() {
       return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"AEPSCWAuthenticate/0/token" , vformData).then(token => { return token } )
     }
     let userToken2 = await AuthUser2();
     if (userToken2.status == 1 || userToken2.status == "1"){
       this.setState({success_auth: true, fingerprint : '', AuthId :  userToken2.data.response, confirm : true })
     }
 
     else {
       this.setState({ fingerprint:'',IsAEPSAutCW : true});
       alert(userToken2.message);
     }
  
 
 
   this.setState({loading : false})
   
 
  }





  getbanklist  = async() =>{


    let bank = function() {
      return API_HELPER.apiPOST(API_WEB_URLS.BASE+"PSBankList/0/token").then(token => { return token } )
    }
  
    let banklist = await bank();

    this.setState({banklist : banklist.data.data})

  }


  confirm () {
    this.discoverAvdm();

    

    if (this.state.selectedOption  ==  "1"){
      this.setState({ IsAEPSAutCW : true})
    }
    else {
      this.setState({ confirm : true})
    }

    

  }



onTranChange (event) {

  if(event.target.value  == 3 || event.target.value  == 4){
    this.setState({isPay : true});
  }

  else {
    this.setState({isPay : false});
  }
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
               xmlString = '';
                alert('Capture Failed');
                //window.location.reload();
              }	
 
          },
          error: function (jqXHR, ajaxOptions, thrownError) {
            xmlString  =  '';
          //$('#txtPidOptions').val(XML);
          alert(thrownError);
            res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
          },
        });
 
       this.setState({fingerprint : xmlString});

       
       
       
       }
 
 


       transus () {

        this.setState({ pay_modal : false , transuccess : false, Amount : 0, confirm_alert:false});
        this.props.history.push('printcashwithdrawal/'+this.state.AEPSId);
      }



  
  syno () {
    this.setState({success_balance : false ,update_msg : false, success_tran : false, success_auth : false, success_tranp : false})
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


  btnSave_onClick  =  async()=> {

    

    if (this.state.TransactionTypeId  ==  undefined || this.state.TransactionTypeId  ==  -1){
      alert('Please select transaction type');
    }

    else {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

  this.setState({loading : true, confirm : false});
   


   let vformData = new FormData();
   
  //Information
  vformData.append("BankId", this.state.selectedGroup.value);
  vformData.append("MobileNo", this.state.CustMobileNO);
  vformData.append("AadhaarNo", this.state.CustAadharNo);
  vformData.append("fingerprint", this.state.fingerprint);
  vformData.append("AgentId", obj.username);
  vformData.append("AuthId", this.state.AuthId);
  vformData.append("Id", obj.uid);
  vformData.append("Amount", this.state.Amount== undefined ||this.state.Amount  == null || this.state.Amount == '' ? 0 : this.state.Amount );

   
  //   let vformData = new FormData();
   
  // //Information
  // vformData.append("BankId", formData.F_BankId);
  // vformData.append("MobileNo", this.state.CustMobileNO);
  // vformData.append("AadhaarNo", this.state.AadharNo);
  // vformData.append("fingerprint", this.state.fingerprint);
  // vformData.append("AgentId", obj.username);
  // vformData.append("Id", obj.uid);
  // vformData.append("Amount", this.state.Amount== undefined ||this.state.Amount  == null || this.state.Amount == '' ? 0 : this.state.Amount );

  if (this.state.TransactionTypeId  == 5){
    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"AEPSGetBalanceEnquiry/0/token" , vformData).then(token => { return token } )
    }
    let userToken2 = await AuthUser2();
   if(userToken2.status  ==  1 || userToken2.status  == "1"){
      this.setState({
        success_balance : true , fingerprint:'', balance : userToken2.data.response,  Amount : 0,
        selectedGroup : {},
        selectedOption : "1",
        confirm : false
      })
   }

  else {
    this.setState({
       fingerprint:''
    })
    alert(userToken2.message);
  }
  }

  else if (this.state.TransactionTypeId  == 2){
    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"AEPSCashwithdrawal/0/token" , vformData).then(token => { return token } )
    }
    let userToken2 = await AuthUser2();
   if(userToken2.status  ==  1 || userToken2.status  == "1"){
      this.setState({
        success_tranp : true , fingerprint:'',
        Amount : 0,
        selectedGroup : {},
        selectedOption : "1",
        confirm : false,
        AEPSId : userToken2.data.data.id,
        bankrrn : userToken2.data.data.name
      })
   }

  else {
    this.setState({
       fingerprint:''
    })
    alert(userToken2.message);
  }
  }


  else if (this.state.TransactionTypeId  == 4){
    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"AEPSMiniStaement/0/token" , vformData).then(token => { return token } )
    }
    let userToken2 = await AuthUser2();
   if(userToken2.status  ==  1 || userToken2.status  == "1"){

    const jsonObject = JSON.parse(userToken2.data.responseLog);

      this.setState({
        success_balance : true , fingerprint:'', balance : userToken2.message,
        Amount : 0,
        selectedGroup : {},
        selectedOption : "1",
        confirm : false,
        minidata : jsonObject,
        productData : jsonObject.ministatement,
        accbalance : jsonObject.balanceamount,
        accholder : jsonObject.name,
        reset : true
      })
   }
   

  else {
    this.setState({
       fingerprint:'',
       Amount : 0,
       selectedGroup : {},
       selectedOption : "1",
       confirm : false
    })
    alert(userToken2.message);
  }
  }

  else if (this.state.TransactionTypeId  == 3){
    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"AEPSAadharPay/0/token" , vformData).then(token => { return token } )
    }
    let userToken2 = await AuthUser2();
   if(userToken2.status  ==  1 || userToken2.status  == "1"){
      this.setState({
        success_tran : true , fingerprint:'',
        Amount : 0,
        selectedGroup : {},
        selectedOption : "1",
        confirm : false
      })
   }
   

  else {
    this.setState({
       fingerprint:'',
      //  Amount : 0,
      //  selectedGroup : {},
      //  selectedOption : "1",
      //  confirm : false

    })
    alert(userToken2.message);
  }
  }
  


  this.setState({loading : false, CustMobileNO : 0,CustAadharNo : 0, Amount : 0 });

}

  // if (!this.state.id)    {
  //   Fn_AddEditData(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, "#", true , "VoucherId");
  // }

  // else if (obj.isAdmin == true) {
  //   Fn_AddEditData(this.obj, { arguList: { id: this.state.id, formData: vformData } }, this.API_URL_SAVE, "#", true , "kuku" , "update_msg");
  // }
  }

  scan(){
    this.CaptureAvdm();
  }

  continueregistration (){
   
    this.discoverAvdm();

    this.setState({IsNoDone : true})

  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };
  handleSelectGroup = selectedGroup => {

    console.log(selectedGroup);
    this.setState({ selectedGroup , F_MemberMaster : selectedGroup.Id });
  
  }

  handleOptionChange = (e) => {
    this.setState({
      selectedOption: e.target.value, // Update the selected option in the state
      
    });

    if (e.target.value  ==  1 || e.target.value  ==  "1") {
      this.setState({TransactionTypeId :  2})
    }
    else {
      this.setState({TransactionTypeId :  5})
    }
  };
 
  
  render() {

    const columns = [{
      dataField: 'date',
      text: 'Date',
      sort: true,
    }, {
      dataField: 'txnType',
      text: 'txnType',
      sort: true
    },
    {
      dataField: 'amount',
      text: 'amount',
      sort: true,
     
    },
    
    {
      dataField: 'narration',
      text: 'narration',
      sort: true,
     
    },

    
  
  ];

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
    const {selectedGroup}  = this.state;



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
                                  {/* <Card>
                                    <CardBody>  */}
                                 
                                     

                                    <Row>
                                      <Col>
                                      <Card>
                                    <CardBody>
                                      <h4>Customer Details</h4>
                                      <Col>
                                          <label htmlFor="age" className="col-form-label">Mobile No.</label>
                                        </Col>
                                      <Col >
                                        <AvField name="CustMobileNO"  value={this.state.CustMobileNO === null ? ''   : this.state.CustMobileNO} onChange={(e) => Fn_ChangeStateValue(this.obj, 'CustMobileNO', e.target.value)}  placeholder="MobileNo"   type="number"   className="form-control" />
                                      </Col>

                                      {this.state.CustMobileNO.length == 10 ? 
                                      <>
                                      <Col >
                                          <label htmlFor="age" className="col-form-label">Aadhar No.</label>
                                        </Col>
                                        <Col >
                                        <AvField name="CustAadharNo"  value={this.state.CustAadharNo === null ? ''   : this.state.CustAadharNo} onChange={(e) => Fn_ChangeStateValue(this.obj, 'CustAadharNo', e.target.value)}  placeholder="AadharNo"   type="number"   className="form-control" />
                                        </Col>
                                        <Col>
                                        <p style={{color : 'black', fontWeight : 500}}>
                                        <input type="checkbox" checked={true} disabled></input>  I give my consent for being authenticated for this transaction initiated by myself using my above mentioned Aadhaar number.
                                        </p>
                                        </Col>
                                        </>
                                        : null}
                                      
                                      </CardBody>
                                      </Card>
                                      
                                      </Col>


                                      <Col>
                                      <Card>
                                    <CardBody>
                                      <h4>Bank Details</h4>

{this.state.CustAadharNo.length  ==  12 ?   <>

                                      <Col >
                                          <label htmlFor="age" className="col-form-label">Select Bank</label>
                                        </Col>
                                        <Col >
                                      
                                        <Select
                              value={selectedGroup}
                              onChange={this.handleSelectGroup}
                              options={this.state.banklist}
                              classNamePrefix="select2-selection"
                            />
                                        </Col>

                                        </> : null} 

                                        


                                      </CardBody>
                                      </Card>
                                      
                                      </Col>


                                      <Col>
                                      <Card>
                                    <CardBody>
                                      <h4>Transaction Details</h4>




<Row>
  

                                      <Col>
                                      <Card>
                                        <CardBody>
                                          <div>
                                            <input type="radio"  color="blue"  value="1"
            checked={this.state.selectedOption == '1'}
            onChange={this.handleOptionChange}/>
                                          </div>
                                                                  <div className="mb-4">
                                            <img
                                              className="rounded-circle avatar-sm"
                                              src={"https://cdn-icons-png.flaticon.com/128/1682/1682308.png"}
                                              alt=""
                                            />
                                          </div>
                                      

                                        <h5 className="font-size-15 mb-1">
                                       
                                           Cash Withdraw
                                         
                                        </h5>
                                        {/* <p className="text-muted">{user.designation}</p> */}
                                        </CardBody>
                                      </Card>
                                      </Col>

                                      <Col>
                                      <Card>
                                        <CardBody>
                                          <div>
                                          <input type="radio"  color="blue"  value="2"
            checked={this.state.selectedOption == '2'}
            onChange={this.handleOptionChange}/>
                                          </div>
                                                                  <div className="mb-4">
                                            <img
                                              className="rounded-circle avatar-sm"
                                              src={"https://w7.pngwing.com/pngs/626/160/png-transparent-balance-sheet-financial-statement-computer-icons-finance-others-text-logo-sign.png"}
                                              alt=""
                                            />
                                          </div>
                                      

                                        <h5 className="font-size-15 mb-1">
                                       
                                           Balance and Statement
                                         
                                        </h5>
                                        {/* <p className="text-muted">{user.designation}</p> */}
                                        </CardBody>
                                      </Card>
                                      </Col>


                                      </Row>

                                      <Row>
                                        {this.state.selectedOption  ==  "1" ?
                                        <>
                                         
                                      <Col sm="12" className="mb-0">
                                        <AvField name="Amount"  value={this.state.Amount === null ? ''   : this.state.Amount} onChange={(e) => Fn_ChangeStateValue(this.obj, 'Amount', e.target.value)}  placeholder="Amount"   type="number"   className="form-control" />
                                      </Col></> : null
                                        }
                                      </Row>





                                      </CardBody>
                                      </Card>
                                      
                                      </Col>
                                        {/* <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Device</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField  name="DeviceId" label="" value={this.state.formData.DeviceId === null ? '-1'   : this.state.formData.DeviceId}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={1} defaultValue label={"Mantra"} />
                                            <option value={2} defaultValue label={"Morpho"} />
                                          </AvField> 
                                        
                                        </Col>
                                        <Col sm="2" className="mb-3">
                                          <label htmlFor="age" className="col-form-label"> Bank Name</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField  name="F_BankId" label="" value={this.state.formData.F_BankId === null ? '-1'   : this.state.formData.F_BankId}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.banklist
                                              ? this.state.banklist.map(
                                                  (option, key) => (
                                                    <option key={option.iinno} value={option.iinno} label={option.bankName} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col> */}

                                    </Row> 


                                    {/* <Row>
                                      
                                    <Col sm="2" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">Aadhar No.</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField name="AadharNo"  value={this.state.AadharNo === null ? ''   : this.state.AadharNo} onChange={(e) => Fn_ChangeStateValue(this.obj, 'AadharNo', e.target.value)}  placeholder="AadharNo"   type="number"   className="form-control" />
                                        </Col>
                                        </Row> */}
                                        {/* <Row>
                                     
                                      <Col sm="2" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">Customer Mobile No.</label>
                                        </Col>
                                      <Col sm="4" className="mb-0">
                                        <AvField name="CustMobileNO"  value={this.state.CustMobileNO === null ? ''   : this.state.CustMobileNO} onChange={(e) => Fn_ChangeStateValue(this.obj, 'CustMobileNO', e.target.value)}  placeholder="CustMobileNo"   type="number"   className="form-control" />
                                      </Col>  
                                    </Row> */}
{/* 
                                    <Row>

                                    <Col sm="2" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">Transaction Type</label>
                                        </Col>
                                        <Col sm="3">
                                        <AvField  name="TransactionTypeId" label="" onChange={this.onTranChange} value={this.state.formData.TransactionTypeId === null ? '-1'   : this.state.formData.TransactionTypeId}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            <option value={5} defaultValue label={"Balance Enquiry"} />
                                            <option value={4} defaultValue label={"Mini Statement"} />
                                            <option value={2} defaultValue label={"Cash Withdrawal"} />
                                            <option value={3} defaultValue label={"Aadhaar Pay"} />
                                          </AvField> 
                                        </Col>
                                    </Row> */}


                                    {/* {this.state.isPay == true ? 

                                    <Row>
                                    <Col sm="2" className="mb-3">
                                          <label htmlFor="age" className="col-form-label">Amount</label>
                                        </Col>
                                      <Col sm="4" className="mb-0">
                                        <AvField name="Amount"  value={this.state.Amount === null ? ''   : this.state.Amount} onChange={(e) => Fn_ChangeStateValue(this.obj, 'Amount', e.target.value)}  placeholder="Amount"   type="number"   className="form-control" />
                                      </Col>
                                    </Row>

                                    : null } */}

                                    
                                     


                                     

                                   
                                      {/* <div className="d-flex flex-wrap gap-2">
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
                          type="submit"
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
                        </div> */}
                                     
                                    
                                    {/* </CardBody>
                                  </Card> */}
                                  </Col>
                                 
                                </Row>

                                {(this.state.selectedOption == "1" && this.state.Amount > 0) || (this.state.selectedOption=="2") ?<>
                                <Row>
                                <Col style={{justifyContent:'center', textAlign:'center'}} className="mb-3">
                                <Button
                          type="button"
                          color="primary"
                          disabled={this.state.fingerprint=='' ?false : true}
                          className="mr-1 waves-effect waves-light"
                          onClick={this.confirm}
                        >
                          Proceed
                        </Button>
                        </Col>
                                </Row></>  : null}


                                {this.state.reset ?<>
                                <Row>
                                <Col style={{justifyContent:'center', textAlign:'center'}} className="mb-3">
                                <Button
                          type="button"
                          color="primary"
                          disabled={this.state.fingerprint=='' ?false : true}
                          className="mr-1 waves-effect waves-light"
                          onClick={() => this.setState({productData : [], accbalance : 0, accholder : '', reset : false})}
                        >
                          Reset
                        </Button>
                        </Col>
                                </Row></>  : null}

                                <Row>

                                  
              <Col className="col-12">
                <Card>
                  <CardBody>

{this.state.TransactionTypeId  == 4 ?<Button
                          type="button"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                          onClick={() =>
                            this.props.history.push('/printministatement', { data: this.state.minidata })}
                        >
                          Print
                        </Button> : null }
                  
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField='id'
                      columns={columns}
                      data={this.state.productData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField='id'
                          columns={columns}
                          data={this.state.productData}
                          search
                        >
                          {toolkitProps => (
                            <React.Fragment>

                              <Row className="mb-2">
                                <Col md="4">
                                  <div className="search-box me-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitProps.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                             

                              <Row>
                                <Col xl="12">
                               <h5> Account Holder : {this.state.accholder}<br></br></h5>
                               
                               <h5> Acc. Balance : {this.state.accbalance}<br></br></h5>
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      keyField={"id"}
                                      responsive
                                      bordered={false}
                                      striped={false}
                                      defaultSorted={defaultSorted}
                                     // selectRow={selectRow}
                                      classes={
                                        "table align-middle table-nowrap"
                                      }
                                      headerWrapperClasses={"thead-light"}
                                      {...toolkitProps.baseProps}
                                      {...paginationTableProps}
                                    />

                                  </div>
                                </Col>
                              </Row>

                              <Row className="align-items-md-center mt-30">
                                <Col className="inner-custom-pagination d-flex">
                                  <div className="d-inline">
                                    <SizePerPageDropdownStandalone
                                      {...paginationProps}
                                    />
                                  </div>
                                  <div className="text-md-right ms-auto">
                                    <PaginationListStandalone
                                      {...paginationProps}
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </React.Fragment>
                          )
                          }
                        </ToolkitProvider>
                      )
                      }</PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
              </Row>





              <Modal
                        isOpen={this.state.IsAEPSAut}
                        toggle={this.IsAEPSAut}
                        scrollable={true}
                        backdrop={'static'}
                        id="staticBackdrop2"
                      >
                        <div className="modal-header">
                          <h5 className="modal-title" >Daily AEPS Authenticate</h5>
                          <button type="button" className="btn-close" onClick={() =>
                            this.setState({ IsAEPSAut: false })
                          } aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        <Row>
                       
                        <div className="text-center">
                  <img
                    width={100}
                    height={100}
                    src={lockimg}
                    alt=""
                  />
                  
                </div>

                <div className="text-center" style={{marginTop : 10}}>
                <h4>  Verification</h4>
                  
                </div>
                                       
                                       
                         </Row>
                        <Row>
                       
                            <p>
                              Hi , {this.state.RetailerName}, Complete verification with your registered Mobile No. with  Aadhaar *** *** {this.state.RetailerAadhaarNo}
                            </p>
                                       
                         </Row>
                         
                         <Row>
                       
                             <label htmlFor="firstName" className="col-form-label">Mobile No.</label>
                                      
                                      
                        </Row>

                        <Row>
                       
                          <input disabled={this.state.IsNoDone} name="RetailerMobileNo" label="" value={this.state.RetailerMobileNo}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'RetailerMobileNo', e.target.value)}  placeholder="Enter Mobile No."   type="number"  className="form-control" />
                        
                        </Row>


                      
                        </div>
                        <div className="modal-footer">

                          {this.state.IsNoDone   ? 

                                this.state.fingerprint == '' ? 

                          <button type="button" onClick={this.CaptureAvdm} className="btn btn-info">Scan</button>
                          :  <> <h6 color="green">Scanned</h6> 
                          <button type="button" onClick={this.authenticate} className="btn btn-info"  >Proceed</button>  

                          </>
                        :
                          <button type="button" onClick={this.continueregistration} className="btn btn-info"  >Continue</button>
  }
                         
                        </div>
                      </Modal>





                      <Modal
                        isOpen={this.state.IsAEPSAutCW}
                        toggle={this.IsAEPSAutCW}
                        scrollable={true}
                        backdrop={'static'}
                        id="staticBackdrop2"
                      >
                        <div className="modal-header">
                          <h5 className="modal-title" >AEPS Authenticate</h5>
                          <button type="button" className="btn-close" onClick={() =>
                            this.setState({ IsAEPSAut: false })
                          } aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        <Row>
                       
                        <div className="text-center">
                  <img
                    width={100}
                    height={100}
                    src={lockimg}
                    alt=""
                  />
                  
                </div>

                <div className="text-center" style={{marginTop : 10}}>
                <h4>  Verification</h4>
                  
                </div>
                                       
                                       
                         </Row>
                        <Row>
                       
                            <p>
                              Hi , {this.state.RetailerName}, Complete verification with your registered Mobile No. with  Aadhaar *** *** {this.state.RetailerAadhaarNo}
                            </p>
                                       
                         </Row>
                         
                         <Row>
                       
                             <label htmlFor="firstName" className="col-form-label">Mobile No.</label>
                                      
                                      
                        </Row>

                        <Row>
                       
                          <input disabled={this.state.IsNoDone} name="RetailerMobileNo" label="" value={this.state.RetailerMobileNo}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'RetailerMobileNo', e.target.value)}  placeholder="Enter Mobile No."   type="number"  className="form-control" />
                        
                        </Row>


                      
                        </div>
                        <div className="modal-footer">

                          {this.state.IsNoDone   ? 

                                this.state.fingerprint == '' ? 

                          <button type="button" onClick={this.CaptureAvdm} className="btn btn-info">Scan</button>
                          :  <> <h6 color="green">Scanned</h6> 
                          <button type="button" onClick={this.authenticateCW} className="btn btn-info"  >Proceed</button>  

                          </>
                        :
                          <button type="button" onClick={this.continueregistration} className="btn btn-info"  >Continue</button>
  }
                         
                        </div>
                      </Modal>


                      


              <Modal
                        isOpen={this.state.confirm}
                        toggle={this.confirm}
                        scrollable={true}
                        backdrop={'static'}
                        id="staticBackdrop2"
                      >
                        <div className="modal-header">
                          <h5 className="modal-title" >Confirm and Scan</h5>
                          <button type="button" className="btn-close" onClick={() =>
                            this.setState({ confirm: false })
                          } aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        
                        <Row>
                            <h6> Aadhaar : {this.state.CustAadharNo} <br></br>
                            Mobile  : {this.state.CustMobileNO} <br></br>
                            Bank : {this.state.selectedGroup.label} <br></br>
                            {this.state.selectedOption == "1" ? 'Amount :' + this.state.Amount : null}
                            
                            </h6>
                            
                                       
                         </Row>

                         <Row>
                          <Card>
                            <CardBody>
                              <Row>
                              <label htmlFor="firstName" className="col-form-label">Device</label>
                              <Col sm="2">

                             
                              
                              <img
                                              className="rounded-circle avatar-sm"
                                              src={"https://w7.pngwing.com/pngs/626/160/png-transparent-balance-sheet-financial-statement-computer-icons-finance-others-text-logo-sign.png"}
                                              alt=""
                                            />



                              </Col>

                              <Col sm="4">

                             
                                                                    
                                      Mantra Device



                                      </Col>

                                      <Col sm="4">
                                     
                                      <input type="radio"  color="blue"  value="2"
                                                checked={true}
                                             
                                               
                                               />
                                                                
                                                                                                        




                                    </Col>

                                
                              </Row>
                            </CardBody>
                          </Card>

                         </Row>

                         
                         <Row>
                       
                      
                             <label htmlFor="firstName" className="col-form-label">Transaction Type</label>


                             {this.state.selectedOption  ==  "1" ? <>
                             <select  name="TransactionTypeId" label="" onChange={(e) => Fn_ChangeStateValue(this.obj, 'TransactionTypeId', e.target.value)} value={this.state.formData.TransactionTypeId === null ? '-1'   : this.state.formData.TransactionTypeId}  type="select" className="form-select" >
                             <option value={-1} defaultValue label={"Select Type"} />
                                            <option value={2}  label={"Cash Withdrawal"} />
                                            <option value={3}  label={"Aadhaar Pay"} />
                                          </select>     

                                          </> :    <select  name="TransactionTypeId" label="" onChange={(e) => Fn_ChangeStateValue(this.obj, 'TransactionTypeId', e.target.value)} value={this.state.formData.TransactionTypeId === null ? '-1'   : this.state.formData.TransactionTypeId}  type="select" className="form-select" >
                                          <option value={-1} defaultValue label={"Select Type"} />
                                            <option value={5} defaultValue label={"Balance Enquiry"} />
                                            <option value={4}  label={"Mini Statement"} />
                                          
                                          </select>  }
                                      
                        </Row>

                       


                      
                        </div>
                        <div className="modal-footer">


                          {this.state.fingerprint  ==  '' ?
                          <button type="button" onClick={this.scan} className="btn btn-info"  >Scan</button> : 

                          <> <h6 color="green">Scanned</h6> 
                          <button type="button" onClick={this.btnSave_onClick} className="btn btn-info"  >Proceed</button>  

                          </>
                        }
                        
                         
                        </div>
                      </Modal>



                               

             



                               
                            
                          <div className="d-flex flex-wrap gap-2">
                         

                        {this.state.success_balance ? (
                      <SweetAlert
                        title={'Success'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                       Balance  -  {this.state.balance}
                      </SweetAlert>
                    ) : null}


{this.state.success_tran ? (
                      <SweetAlert
                        title={'Transaction Successful'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                      
                      </SweetAlert>
                    ) : null}




{this.state.success_tranp ? (
                      <SweetAlert
                        title={'Transaction Successfull!'}
                        success
                         showCancel
                        confirmBtnBsStyle="success"
                        cancelBtnText="Print!"
                        onConfirm={this.syno}
                        onCancel={this.transus}
                      >
                       
                      BANK RRN : {this.state.bankrrn}
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
export default compose(container)(pageAddEdit_AEPS);
