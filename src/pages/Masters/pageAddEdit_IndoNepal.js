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
  TabPane,
  Modal,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody

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
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_CheckIsActive , Fn_ChangeStateValue, Fn_GetReport, Fn_CheckIsAEPSAuth2 } from "../../store/functions";
import './Shake.css';

import RCDisplayPage from "../../components/Common/RCDisplayPage";
import { API_HELPER } from "helpers/ApiHelper";
import Loader from "pages/loader";


class pageAddEdit_IndoNepal extends Component {
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
      Otp : '',
      Name : '',
      balance : [{
        AvailableBalance : 0
      }],
      SenderId : [{
        Name : '',
        DailyLimit : 0
      }],
      modal_backdrop : false,
      pay_modal : false,
      isRegistered : false,
      isRight : false,
      IFSC : '',
      success_msg_Ben : false,
      error_ben : false,
      timer: 10,
      BenDetails:[{
        AccountHolderName : ''
      }],
      limitexceeded : false,
      insufficienfund : false,
      faildata :'',
      confirm_alert : false,
      servicecharges_modal : false ,
      loading : false
      
    };
    this.obj = this;
    this.formTitle = "";
    this.breadCrumbTitle = "";
    this.breadCrumbItem = " " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.BALANCEADD + "/0/token";
    this.pushFormName = "/add-Balancedetails";
    this.rtPage_Redirect = "/add-Balancedetails";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/BalanceEdit";
   
    
    this.syno  =  this.syno.bind(this);
this.tog_backdrop =  this.tog_backdrop.bind(this);
this.checkOtp  =  this.checkOtp.bind(this);
this.resetsender  = this.resetsender.bind(this);
this.toggleRightCanvas = this.toggleRightCanvas.bind(this);
this.onChangeState  =  this.onChangeState.bind(this);
this.AddBen  =  this.AddBen.bind(this);
this.syno_ben  = this.syno_ben.bind(this);
this.verify  = this.verify.bind(this);
this.syno_ben_verify  =  this.syno_ben_verify.bind(this);
this.verify2  =  this.verify2.bind(this);
this.pay_modal = this.pay_modal.bind(this);

this.tran  = this.tran.bind(this);
this.confirm = this.confirm.bind(this);

this.checkCSP  =  this.checkCSP.bind(this);
this.senderverify  =  this.senderverify.bind(this);
this.onChangeBank  =  this.onChangeBank.bind(this);
this.onChangeBranch  =  this.onChangeBranch.bind(this);
this.GetServiceCharge  =  this.GetServiceCharge.bind(this);
this.verifypay  =  this.verifypay.bind(this);
this.transus  =  this.transus.bind(this);
    
  }



  confirm  = ()=>{

      //this.setState({Mode : Mode, confirm_alert : true})
  }

  transus () {
    this.setState({ pay_modal : false , transuccess : false, Amount : 0, confirm_alert:false});
    this.props.history.push('printreceiptnmr/'+this.state.NMRId);
  }



  verifypay = async ()=> {
    this.setState({loading : true, pay_modal : false, servicecharges_modal : false});
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    var BankBranchId =  this.state.BenDetails[0].bankBranchId;
    var AccountNo = 0;
    if (BankBranchId ==  '' || BankBranchId ==  null){
      BankBranchId  =  0;
      AccountNo  =  0;
    }


      var CustomerId  =  this.state.CustomerData.customerId;
      var SenderName  =  this.state.CustomerData.name;
      var SenderGender  =  this.state.CustomerData.gender;
      var SenderDoB  =  this.state.CustomerData.dob;
      var SenderAddress  =  this.state.CustomerData.address;
      var SenderPhone  =  this.state.CustomerData.mobile;
      var SenderMobile  =  this.state.CustomerData.mobile;
      var SenderCity  =  this.state.CustomerData.city;
      var SenderDistrict  =  this.state.CustomerData.district;
      var SenderState  =  this.state.CustomerData.state;
      var SenderNationality  =  this.state.CustomerData.nationality;
      var Employer  =  this.state.CustomerData.employer;
      var SenderIDType  =  this.state.CustomerData.idType;
      var SenderIDNumber  =  this.state.CustomerData.idNumber;
      var SenderIDExpiryDate  =  0;
      var SenderIDIssuedPlace  =  0;
      var ReceiverId  =  this.state.BenDetails[0].receiverId;
      var ReceiverName  =  this.state.BenDetails[0].name;
      var ReceiverGender  =  this.state.BenDetails[0].gender;
      var ReceiverAddress  =  this.state.BenDetails[0].address;
      var ReceiverMobile  =  this.state.BenDetails[0].mobile;
      var ReceiverCity  =  this.state.BenDetails[0].address;
      var SendCountry  =  "India";
      var PayoutCountry  =  "Nepal";
      var PaymentMode  =  this.state.BenDetails[0].paymentMode;
      var CollectedAmount  =  this.state.collectionAmount;
      var ServiceCharge  =  this.state.serviceCharge;
      var SendAmount  =  this.state.Amount;
      var SendCurrency  =  "INR";
      var PayAmount  =  this.state.payoutAmount;
      var PayCurrency  =  this.state.payoutCurrency;
      var ExchangeRate  =  this.state.exchangeRate;
      var BankBranchId  =  BankBranchId;
      var BankName  =  this.state.BenDetails[0].bankName;
      var AccountNumber  =  this.state.BenDetails[0].acNumber;
      var AccountType  =  0;
      var NewAccountRequest  =  0;
      var PartnerPinNo  =  0;
      var IncomeSource  =  this.state.CustomerData.incomeSource;
      var RemittanceReason  =  this.state.ReasonId;
      var Relationship  =  this.state.BenDetails[0].relationship;
      var CSPCode  =  obj.username;
      var OTPProcessId  =  this.state.payprocessId;
      var OTP  =  this.state.VerifyOTP;
      


      let vformData = new FormData();
    vformData.append("CustomerId", CustomerId);
    vformData.append("SenderName", SenderName);
    vformData.append("SenderGender", SenderGender);
    vformData.append("SenderDoB", SenderDoB);
    vformData.append("SenderAddress", SenderAddress);
    vformData.append("SenderPhone", SenderPhone);
    vformData.append("SenderMobile", SenderMobile);
    vformData.append("SenderCity", SenderCity);
    vformData.append("SenderDistrict", SenderDistrict);
    vformData.append("SenderState", SenderState);
    vformData.append("SenderNationality", SenderNationality);
    vformData.append("Employer", Employer);
    vformData.append("SenderIDType", SenderIDType);
    vformData.append("SenderIDNumber", SenderIDNumber);
    vformData.append("SenderIDExpiryDate", SenderIDExpiryDate);
    vformData.append("SenderIDIssuedPlace", SenderIDIssuedPlace);
    vformData.append("ReceiverId", ReceiverId);
    vformData.append("ReceiverName", ReceiverName);
    vformData.append("ReceiverGender", ReceiverGender);
    vformData.append("ReceiverAddress", ReceiverAddress);
    vformData.append("ReceiverMobile", ReceiverMobile);
    vformData.append("ReceiverCity", ReceiverCity);
    vformData.append("SendCountry", SendCountry);
    vformData.append("PayoutCountry", PayoutCountry);
    vformData.append("PaymentMode", PaymentMode);
    vformData.append("CollectedAmount", CollectedAmount);
    vformData.append("ServiceCharge", ServiceCharge);
    vformData.append("SendAmount", SendAmount);
    vformData.append("SendCurrency", SendCurrency);
    vformData.append("PayAmount", PayAmount);
    vformData.append("PayCurrency", PayCurrency);
    vformData.append("ExchangeRate", ExchangeRate);
    vformData.append("BankBranchId", BankBranchId);
    vformData.append("BankName", BankName);
    vformData.append("AccountNumber", AccountNumber);
    vformData.append("AccountType", AccountType);
    vformData.append("NewAccountRequest", NewAccountRequest);
    vformData.append("PartnerPinNo", PartnerPinNo);
    vformData.append("IncomeSource", IncomeSource);
    vformData.append("RemittanceReason", RemittanceReason);
    vformData.append("Relationship", Relationship);
    vformData.append("CSPCode", CSPCode);
    vformData.append("OTPProcessId", OTPProcessId);
    vformData.append("OTP", OTP);

    let AuthUser2 = function() {
      return API_HELPER.apiPUT_Multipart(API_WEB_URLS.BASE+"NMRVerifyPayTransaction/0/token/"+obj.uid , vformData).then(token => { return token } )
    }

    let userToken2 = await AuthUser2();

      

    if (userToken2.data.data.id  == 1){
      this.setState({transuccess : true, transactionCode : userToken2.data.data.transactionCode, utr :userToken2.data.data.utr, NMRId :  userToken2.data.data.nmrId })
     }
     else if(userToken2.data.data.id  == -6){
        this.setState({tranfailed : true , transactionCode : "Something went wrong!"})
     }
     else if(userToken2.data.data.id  == 2){
      this.setState({tranfailed : true , faildata : userToken2.data.data.message, transactionCode : userToken2.data.data.transactionCode})
   }

     else if(userToken2.data.data.id  == -1) {
      this.setState({insufficienfund : true});
     }
     else {
      this.setState({tranfailed : true , faildata : userToken2.data.data.message, transactionCode : userToken2.data.data.transactionCode})
     }

     this.setState({loading : false});




  }

  GetServiceCharge =  async()  => {
    this.setState({loading : true});
      var PaymentMode  =  this.state.BenDetails[0].paymentMode;
      var TransferAmount =  this.state.Amount;
      var BankBranchId =  this.state.BenDetails[0].bankBranchId;
      var AccountNo =  this.state.BenDetails[0].acNumber;

      if (BankBranchId ==  '' || BankBranchId ==  null){
        BankBranchId  =  0;
        AccountNo  =  0;
      }

      let vformData = new FormData();
    vformData.append("PaymentMode", PaymentMode);
    vformData.append("TransferAmount", TransferAmount);
    vformData.append("BankBranchId", BankBranchId);



    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRGetServiceCharges/0/token/" , vformData).then(token => { return token } )
    }

    let userToken2 = await AuthUser2();

  this.setState({
    collectionAmount : userToken2.data.data.collectionAmount,
    collectionCurrency : userToken2.data.data.collectionCurrency,
    exchangeRate : userToken2.data.data.exchangeRate,
    payoutAmount : userToken2.data.data.payoutAmount,
    payoutCurrency : userToken2.data.data.payoutCurrency,
    serviceCharge : userToken2.data.data.serviceCharge,
    transferAmount : userToken2.data.data.transferAmount
    
  })

 
  

  let vformDaataPayOtp = new FormData();
  vformDaataPayOtp.append("MobileNo", this.state.SenMobileNo);
  vformDaataPayOtp.append("Operation", "SendTransaction");
  vformDaataPayOtp.append("CustomerId", this.state.CustomerData.customerId);
  vformDaataPayOtp.append("ReceiverId", this.state.BenDetails[0].receiverId);
  vformDaataPayOtp.append("ReceiverName", this.state.BenDetails[0].name);
  vformDaataPayOtp.append("PaymentMode",  this.state.BenDetails[0].paymentMode);
  vformDaataPayOtp.append("BankBranchId", BankBranchId);
  vformDaataPayOtp.append("AccountNumber", AccountNo);
   vformDaataPayOtp.append("Amount", this.state.Amount);
  


  let AuthPayOtp = function() {
    return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRSendOTP/0/token/" , vformDaataPayOtp).then(token => { return token } )
  }

  let userPayOtp = await AuthPayOtp();
  if (userPayOtp.data.data.code  == '000'){
    
    this.setState({ servicecharges_modal : true, payprocessId : userPayOtp.data.data.processId})
  }

  else {
    alert(userPayOtp.data.data.message);
  }

  this.setState({loading : false});

  }



  syno_ben() {
    this.setState({ isRight: !this.state.isRight , success_msg_Ben : false});

  }

  syno_ben_verify() {
    this.setState({ success_verify: false , error_ben : false, limitexceeded : false, insufficienfund : false});

  }


  tran () {
    this.setState({tranfailed : false , pay_modal : false , transuccess : false, Amount : 0, confirm_alert:false,
      modal_backdrop : false,
      pay_modal : false,
      servicecharges_modal : false
    })
  }


  componentDidMount  = async()=> {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    Fn_CheckIsActive(this.obj, obj.uid);
  

    this.checkCSP();

    const custId = localStorage.getItem("CustID");
    if(Number(custId)>0){
      // const obj2 = localStorage.getItem("authUser");

      // sessionStorage.setItem("authUser", obj2);
      // localStorage.setItem("authUser", "");

        this.setState({loading : true});
      let vformData2 = new FormData();
      vformData2.append("MobileNo", custId);


  let AuthUser3 = function() {
    return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRGetCustomerByMobileNo/0/token/" , vformData2).then(token => { return token } )
  }

  let userToken3 = await AuthUser3();
  if (userToken3.status == -3){
      this.setState({CustomerData : userToken3.data.customersdetail, isRegistered : true, loading : false});
      localStorage.setItem("CustID", 0);
      localStorage.setItem("authUser", "")
  }

    }

  

  
      
    
  }


  checkCSP = async()=> {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
  await  Fn_CheckIsAEPSAuth2(this.obj, obj.uid);
   var UserName  = obj.username;


   console.log(this.state.RetailerMobileNo);

   let vformDaataPayOtp = new FormData();
   vformDaataPayOtp.append("MobileNo", this.state.RetailerMobileNo);

   
  let AuthPayOtp = function() {
    return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRESearchCSP/0/token" , vformDaataPayOtp).then(token => { return token } )
  }


  let userPayOtp = await AuthPayOtp();
  console.log(userPayOtp);

  if (userPayOtp.data.responseMessage  !=  "CSP Not found."){

      //Filing Dropdown
      let vformDataGender = new FormData();
      vformDataGender.append("Type", "Gender");
  
      Fn_GetReport(this.obj  , { arguList : {formData : vformDataGender} } , "NMRGetStaticdata/0/token" , "genderData" , true );
  
  
  
      let vformDatarelationship = new FormData();
      vformDatarelationship.append("Type", "Relationship");
  
      Fn_GetReport(this.obj  , { arguList : {formData : vformDatarelationship} } , "NMRGetStaticdata/0/token" , "relationshipData" , true );
  
  
      let vformDatamode = new FormData();
      vformDatamode.append("Type", "PaymentMode");
  
      Fn_GetReport(this.obj  , { arguList : {formData : vformDatamode} } , "NMRGetStaticdata/0/token" , "modeData" , true );
  
      let vformState = new FormData();
      vformState.append("Type", "India");
  
      Fn_GetReport(this.obj  , { arguList : {formData : vformState} } , "NMRGetStateDistrict/0/token" , "StateData" , true );
  
  
      let vformIncomeSourceData = new FormData();
      vformIncomeSourceData.append("Type", "IncomeSource");
  
      Fn_GetReport(this.obj  , { arguList : {formData : vformIncomeSourceData} } , "NMRGetStaticdata/0/token" , "incomeSourceData" , true );
  
  
  
      
      
  
      Fn_GetReport(this.obj  , { arguList : {formData : vformDatamode} } , "NMRBankBranchList/0/token" , "bankbranchdata" , true );
  
      

  }
  // else if (userPayOtp.data.searchCSPResponse.status == 'Locked'){
  //   alert('Your account is locked!');
  //   this.props.history.push('/dashboard');
  // }

  else {
    alert('You are not registered. Please fill form.')
    const imageUrl =  API_WEB_URLS.IMAGEBASE+'PDF/CSPForm.pdf';  // Replace 'your-image.jpg' with the actual image file name
    window.open(imageUrl, '_blank');
   
    this.props.history.push('/dashboard');
  }

  }





  formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };


  toggleRightCanvas() {
    this.setState({ isRight: !this.state.isRight });
  }


 






  
  syno () {
    this.setState(prevState => ({
      modal_backdrop: !prevState.modal_backdrop,
    }))
    this.removeBodyCss()
    this.setState({success_msg : false ,update_msg : false, isRegistered : true})
  }


  btnSave_onClick  =  async(event, formData)=> {

      this.setState({SenMobileNo : formData.MobileNo, loading : true })

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    vformData.append("MobileNo", formData.MobileNo);


    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRGetCustomerByMobileNo/0/token/" , vformData).then(token => { return token } )
    }

  
    let userToken2 = await AuthUser2();
    if (userToken2.status == -3){
      console.log(userToken2.data);

        this.setState({CustomerData : userToken2.data.customersdetail, isRegistered : true})
    }

    else {

      let vformData2 = new FormData();
      vformData2.append("MobileNo", formData.MobileNo);
      vformData2.append("CustomerName", "CustomerName");
      vformData2.append("Operation", "CreateCustomer");


      let AuthUser2 = function() {
        return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRESendOTP/0/token/" , vformData2).then(token => { return token } )
      }
  
      let userToken2 = await AuthUser2();
      if (userToken2.status  == 200){
        this.setState({ modal_backdrop: true, processId : userToken2.data.data.processId})
      }

      else {
        alert('Some Error Ocurred . Please try Again later.!')
      }



    }
    this.setState({loading : false});
   
  }





  sendotp = async() =>{
     let vformData2 = new FormData();
      vformData2.append("MobileNo", this.state.SenMobileNo);
      vformData2.append("CustomerName", "CustomerName");
      vformData2.append("Operation", "CreateCSP");


      let AuthUser2 = function() {
        return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRESendOTP/0/token/" , vformData2).then(token => { return token } )
      }
  
      let userToken2 = await AuthUser2();
      if (userToken2.status  == 200){
       
        if (userToken2.data.data.code == "000") {
          alert(userToken2.data.data.message);
        this.setState({  processId : userToken2.data.data.processId})
        }
        else {
          alert(userToken2.data.data.message);
        }
      }

      else {
        alert('Some Error Ocurred . Please try Again later.!')
      }
  }


  senderverify  = async()=> {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    localStorage.setItem("authUser", JSON.stringify(obj))
    localStorage.setItem("CustID", this.state.SenMobileNo)

    this.setState({loading : true});
    let vformData = new FormData();
    vformData.append("CustomerId", this.state.CustomerData.customerId);


    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRInitiateEKYC/0/token" , vformData).then(token => { return token } )
    }

    let userToken2 = await AuthUser2();
    if (userToken2.data.data.statusCode == 1){
      console.log("hh");
      window.open(userToken2.data.data.url, '_blank');
    }

    else {
      alert('Please try agin later . Some error ocurred.')

    }

    this.setState({loading : false});

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




  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };

  checkOtp = async ()=>{
    this.setState({loading : true});
    
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    var Name =  this.state.SenFirstName  + ' ' + this.state.SenLastName;
    var Gender  =  this.state.SenGenderId;
    var Dob  =  this.state.SenDOB;
    var Address  =  this.state.SenAddress;
    var Mobile  =  this.state.SenMobileNo;
    var State  =  this.state.SenStateId;
    var District  =  this.state.SenDistrictId;
    var City  =  this.state.SenCity;
    var Nationality  =  "Nepalese";
    var Email  =  "";
    var Employer  =  this.state.SenEmployer;
    var IDType  =  this.state.SenDocId;
    var IDNumber  =  this.state.SenIdNumber;
    var IDExpiryDate  =  '';
    var IDIssuedPlace  =  '';
    var IncomeSource  =  this.state.SenIncomeSourceId;
    var OTP  =  this.state.Otp;
    var OTPProcessId  =  this.state.processId;

     if(this.state.SenFirstName != undefined && this.state.SenLastName!= undefined && Gender !=undefined && Dob != undefined &&
     Address != undefined && Mobile != undefined && State != undefined && District != undefined && City != undefined &&
     Nationality != undefined && Email!= undefined && Employer!= undefined && IDType!= undefined && IDNumber!=undefined &&
     IncomeSource!=undefined && OTP!=undefined  ){


          let vformData = new FormData();
      vformData.append("Name", Name);
      vformData.append("Gender", Gender);
      vformData.append("Dob", Dob );
      vformData.append("Address", Address );
      vformData.append("Mobile", Mobile );
      vformData.append("State", State );
      vformData.append("District", District );
      vformData.append("City", City );
      vformData.append("Nationality", Nationality );
      vformData.append("Email", Email );
      vformData.append("Employer", Employer );
      vformData.append("IDType", IDType );
      vformData.append("IDNumber", IDNumber );
      vformData.append("IDExpiryDate", IDExpiryDate );
      vformData.append("IDIssuedPlace", IDIssuedPlace );
      vformData.append("IncomeSource", IncomeSource );
      vformData.append("OTP", OTP );
      vformData.append("OTPProcessId", OTPProcessId );

      let AuthUser = function() {
        return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRCreateCustomer/0/token" , vformData).then(token => { return token } )
      }
  
      let userToken = await AuthUser();

      if (userToken.data.data.code ==  "000"){
        let vformData2 = new FormData();
        vformData2.append("MobileNo", Mobile);
    
    
        let AuthUser2 = function() {
          return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRGetCustomerByMobileNo/0/token/" , vformData2).then(token => { return token } )
        }
    
        let userToken2 = await AuthUser2();
        if (userToken2.status == -3){
            this.setState({CustomerData : userToken2.data.customersdetail, isRegistered : true, modal_backdrop : false})
        }
      }

      else {
        alert(userToken.data.data.message);
        this.setState({modal_backdrop : false})
       // this.setState({modal_backdrop : false})
      }




     }

     else {
      alert('Fill up all fields!');
     }
     this.setState({loading : false});
    
  }


  resetsender() {

    this.setState({ SenderId : [{
      Name : '',
      DailyLimit : 0,
      MonthlyLimit :0,
      TotalBeneficiary : 0
    }],
    MobileNo : '',
  formData :{
    MobileNo : ''
  },
  isRegistered : false

})

  }

  onChangeBranch(event) {
 
    const filteredArray = this.state.bankbranchdata.filter(item => item.bankBranchId == event.target.value);

    

    this.setState({benCity : filteredArray[0].city})

  }

  onChangeBank (event) {
    const filteredArray = this.state.bankbranchdata.filter(item => item.bankName == event.target.value);
      
    this.setState({branchData : filteredArray});

  }

  onChangeState (event) {
    
    const filteredArray = this.state.StateData.filter(item => item.state == event.target.value);
      
    this.setState({District : filteredArray});
   
  }

  

  AddBen = async()=> {
    this.setState({loading : true});
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    var Name  =  this.state.Name;
    var Address  =  this.state.Address;
    var Mobile  =  this.state.BenMobileNo;
    var Gender  =  this.state.GenderId;
    var Relationship  =  this.state.RelationshipId;
    var Mode  =  this.state.ModeId;
    var BankId  =  this.state.BranchId;
    var AccountNo  =  this.state.benAccountNo;
    var CustomerId  =  this.state.CustomerData.customerId;


    var stat  =  0;

      if (Mode  != "Account Deposit"){
        BankId  =  "";
        AccountNo = "";
        stat = 1;
      }

      if (Mode  == "Account Deposit"){
        // let vformData = new FormData();
        // vformData.append("BankCode", BankId);
        // vformData.append("AccountNumber", AccountNo);

        // let AuthValidateBank = function() {
        //   return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRValidateBankAccount/0/token" , vformData).then(token => { return token } )
        // }
    
        // let ResultValidateBank = await AuthValidateBank();

        // if (ResultValidateBank.data.data.code ==  '000'){
        //   stat  =  1;
        // }

        // else {
        //   alert(ResultValidateBank.data.data.message);
        // }

        stat = 1;

      }

      if (stat  == 1){

      
   
        let vformData = new FormData();
        vformData.append("Name", Name);
        vformData.append("Address", Address);
        vformData.append("Mobile", Mobile);
        vformData.append("Gender", Gender);
        vformData.append("Relationship", Relationship);
        vformData.append("Mode", Mode);
        vformData.append("BankId", BankId);
        vformData.append("AccountNo", AccountNo);
        vformData.append("CustomerId", CustomerId);

          let AuthUser2 = function() {
            return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRCreateReceiver/0/token" , vformData).then(token => { return token } )
          }
      
          let userToken2 = await AuthUser2();
          if (userToken2.data.data.code  ==  "000"){
            let vformData2 = new FormData();
            vformData2.append("MobileNo", this.state.SenMobileNo);


        let AuthUser3 = function() {
          return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRGetCustomerByMobileNo/0/token/" , vformData2).then(token => { return token } )
        }

        let userToken3 = await AuthUser3();
        if (userToken3.status == -3){
            this.toggleRightCanvas();
            this.setState({CustomerData : userToken3.data.customersdetail})
        }
     }

          else {
            console.log(userToken2);
            alert(userToken2.data.data.message);

          }

        }
      
        this.setState({loading : false});

  }


  renderGridHeader() {
    return (
      <>
        <th>Name</th>
        <th>Gender</th>
        <th>Mobile No</th>
        <th>Payment Mode</th>
        <th>Bank Name</th>
        <th>Bank Branch</th>
        <th>Account No</th>
        {/* <th>Verify</th> */}
        <th>Pay</th>
       
      </>
    );
  }

verify (Id){
  this.setState({loading : true});
  const obj = JSON.parse(sessionStorage.getItem("authUser"));
  let vformData = new FormData();
  vformData.append("F_SenderMaster", this.state.SenderId[0].Id);
  vformData.append("F_BeneficiaryMaster", Id);
  
  Fn_AddEditData(this.obj, { arguList: { id: obj.uid, formData: vformData } }, API_WEB_URLS.VERIFY + "/0/token", "#", true , "verify",this.state.SenderId[0].Id );

}

servicecharges_modal(){
  this.setState(prevState => ({
    servicecharges_modal: !prevState.pay_modal
  }))
  this.removeBodyCss();
}

pay_modal (Id) {


  const filteredArray = this.state.CustomerData.receivers.filter(item => item.receiverId == Id);

  this.setState({BenDetails : filteredArray});

  this.setState(prevState => ({
    pay_modal: !prevState.pay_modal,
    F_BeneficiaryMaster : Id
  }))
  this.removeBodyCss();

}



verify2 (){
  this.setState({loading : true});
  const obj = JSON.parse(sessionStorage.getItem("authUser"));
  let vformData = new FormData();
  vformData.append("F_SenderMaster", this.state.SenderId[0].Id);
  vformData.append("AccountNo", this.state.AccountNo);
  vformData.append("IFSC", this.state.IFSC);
  Fn_AddEditData(this.obj, { arguList: { id: obj.uid, formData: vformData } }, API_WEB_URLS.VERIFY + "/0/token", "#", true , "verify",this.state.SenderId[0].Id );

}



  renderGridBody(formData) {
    
    return (
      <>
      <td >{formData.name}</td> 
      <td>{formData.gender}</td>
      <td>{formData.mobile}</td>
      <td>{formData.paymentMode}</td>
      <td>{formData.bankName}</td>
       
        <td>{formData.bankBranchName}</td>
        <td>{formData.acNumber}</td>
     
        {/* <td> <Button
                        color="success"
                        className="btn-rounded"
                        onClick={() =>this.verify(formData.Id)}
                       disabled ={formData.IsVerified  == true ? true : false}
                      >
                       {formData.IsVerified  == true ? 'Verified' : 'verify'} 
                      </Button></td> */}

                      <td> <Button
                      type="button"
                        color="info"
                        className="btn-rounded"
                        onClick={() =>this.pay_modal(formData.receiverId)}
                      >
                        Pay
                      </Button></td>
      </>
    );
  }




  render() {


    const { timer } = this.state;
    const { onResend } = this.props;
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    

    return (
      <>
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
                                 
                                     {this.state.isRegistered ? <>
                                     
                                      <Row>
                                        <Col sm="4">
                                        <h3>Hi there! <span className="wave">👋</span> ,    <h3>{this.state.CustomerData.name}</h3></h3>
                                        </Col>
                                        <Col sm="4">
                                        <h5>Total Transactions - {this.state.CustomerData.year}</h5>
                                        </Col>
                                      </Row>


                                    


                                      {/* <Row>
                                        <Col sm="4">
                                        <h5>Your Daily Limit - {this.state.SenderId[0].DailyLimit}</h5>
                                        </Col>
                                        
                                      </Row>

                                   
                                      <Row>
                                        <Col sm="4">
                                        <h5>Total Benficiary - {this.state.SenderId[0].TotalBeneficiary}</h5>
                                        </Col>
                                        
                                      </Row> */}
                                      <Col xl={6}>
              
                  
                    <div className="button-items">
                    {this.state.CustomerData.ekycStatus  ==  'Unverified' ?
                    <Button
                        color="success"
                        className="btn-rounded"
                        onClick={this.senderverify}
                      >
                        Get Verify
                      </Button>
                      : null }
                      <Button
                        color="success"
                        className="btn-rounded"
                        onClick={this.toggleRightCanvas}
                      >
                        Add Beneficiary
                      </Button>
                      
                      <Button
                        color="info"
                        className="btn-rounded"
                        onClick={this.resetsender}
                      >
                        Reset
                      </Button>
                      
                    
                    </div>
                 
              </Col>
                   </> :      <Row>
                    <Col sm="4">
                      <label htmlFor="dateOfJoining" className="col-form-label">Enter Customer Mobile No. </label>
                    </Col>
                    <Col sm="6" className="mb-0">
                      <AvField name="MobileNo" label="" value={this.state.formData.MobileNo === null ? ''   : this.state.formData.MobileNo} onChange={(e) => Fn_ChangeStateValue(this.obj, 'MobileNo', e.target.value)}  placeholder="Enter 10 digits Mobile No."   type="number" disabled={this.state.isRegistered}  className="form-control" />
                    </Col>  
                  </Row> }
              </Col>
                                 
                                </Row>
                                <Row>
                                <Col lg={6}>
                <Card>
                  <CardBody>
                  <Offcanvas
                      isOpen={this.state.isRight}
                      direction="end"
                      toggle={this.toggleRightCanvas}
                    >
                      <OffcanvasHeader toggle={this.toggleRightCanvas}>
                        Add Beneficiary
                      </OffcanvasHeader>
                      <OffcanvasBody>




                                  <Row>
                                      <Col sm="10" className="mb-0">
                                        <AvField name="Name" label="Name" value={this.state.Name === null ? ''   : this.state.Name} onChange={(e) => Fn_ChangeStateValue(this.obj, 'Name', e.target.value)}  placeholder="Name"   type="text"   className="form-control" />
                                      </Col>  
                                    </Row> 


                                    <Row>
                                      <Col sm="10" className="mb-0">
                                        <AvField name="Address" label="Address" value={this.state.Address === null ? ''   : this.state.Address} onChange={(e) => Fn_ChangeStateValue(this.obj, 'Address', e.target.value)}  placeholder="Address"   type="text"   className="form-control" />
                                      </Col>  
                                    </Row> 

                                    <Row>
                                      <Col sm="10" className="mb-0">
                                        <AvField name="BenMobileNo" label="BenMobileNo" value={this.state.BenMobileNo === null ? ''   : this.state.BenMobileNo} onChange={(e) => Fn_ChangeStateValue(this.obj, 'BenMobileNo', e.target.value)}  placeholder="BenMobileNo"   type="text"   className="form-control" />
                                      </Col>  
                                    </Row> 
                                   



                      <Row>
                                        <Col sm="10">
                                          <AvField name="GenderId"   label="Select Gender" value={this.state.formData.GenderId === null ? '-1'   : this.state.formData.GenderId} onChange={(e) => {
    Fn_ChangeStateValue(this.obj, 'GenderId', e.target.value);
   
  }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.genderData
                                              ? this.state.genderData.map(
                                                  (option, key) => (
                                                    <option key={option.value} value={option.value} label={option.label} />
                                                  )
                                                )
                                              : null}
                                          </AvField>
                                        </Col> 
                                      </Row>  


                                        <Row>
                                        <Col sm="10">
                                          <AvField name="RelationshipId"   label="Select Relationship" value={this.state.formData.RelationshipId === null ? '-1'   : this.state.formData.RelationshipId} onChange={(e) => {
    Fn_ChangeStateValue(this.obj, 'RelationshipId', e.target.value);
    
  }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.relationshipData
                                              ? this.state.relationshipData.map(
                                                  (option, key) => (
                                                    <option key={option.value} value={option.value} label={option.label} />
                                                  )
                                                )
                                              : null}
                                          </AvField>
                                        </Col> 
                                      </Row>


                                           <Row>
                                        <Col sm="10">
                                          <AvField name="ModeId"   label="Select Mode" value={this.state.formData.ModeId === null ? '-1'   : this.state.formData.ModeId} onChange={(e) => {
    Fn_ChangeStateValue(this.obj, 'ModeId', e.target.value);
    
  }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.modeData
                                              ? this.state.modeData.map(
                                                  (option, key) => (
                                                    <option key={option.value} value={option.value} label={option.label} />
                                                  )
                                                )
                                              : null}
                                          </AvField>
                                        </Col> 
                                      </Row>  

                                      {this.state.ModeId == "Account Deposit"  ? 
                                      <>
                                      <Row>
                                      <Col sm="10">
                                        <AvField name="BankId"   label="Select Bank" value={this.state.formData.BankId === null ? '-1'   : this.state.formData.BankId} onChange={(e) => {
                                          Fn_ChangeStateValue(this.obj, 'BankId', e.target.value);
                                          this.onChangeBank(e)
                                         
                                        }}  type="select" className="form-select" >
                                          <option value={-1} defaultValue label={"Select"} />
                                          {this.state.bankData
                                            ? this.state.bankData.map(
                                                (option, key) => (
                                                  <option key={option.value} value={option.value} label={option.name} />
                                                )
                                              )
                                            : null}
                                        </AvField>
                                      </Col> 
                                    </Row> 
                                    
                                    <Row>
                                    <Col sm="10">
                                      <AvField name="BranchId"   label="Select Branch" value={this.state.formData.BranchId === null ? '-1'   : this.state.formData.BranchId} onChange={(e) => {
                                        Fn_ChangeStateValue(this.obj, 'BranchId', e.target.value);
                                       this.onChangeBranch(e);
                                       
                                      }}  type="select" className="form-select" >
                                        <option value={-1} defaultValue label={"Select"} />
                                        {this.state.branchData
                                          ? this.state.branchData.map(
                                              (option, key) => (
                                                <option key={option.bankBranchId} value={option.bankBranchId} label={option.branchName} />
                                              )
                                            )
                                          : null}
                                      </AvField>
                                    </Col> 
                                  </Row>


                                  <Row>
                                      <Col sm="10" className="mb-0">
                                        <AvField name="benCity" label="City" value={this.state.benCity === null ? ''   : this.state.benCity} onChange={(e) => Fn_ChangeStateValue(this.obj, 'benCity', e.target.value)}  placeholder="benCity"   type="text"   className="form-control" />
                                      </Col>  
                                    </Row> 

                                    <Row>
                                      <Col sm="10" className="mb-0">
                                        <AvField name="benAccountNo" label="Account No." value={this.state.benAccountNo === null ? ''   : this.state.benAccountNo} onChange={(e) => Fn_ChangeStateValue(this.obj, 'benAccountNo', e.target.value)}  placeholder="benAccountNo"   type="text"   className="form-control" />
                                      </Col>  
                                    </Row> 
                                  </> 

                                    : null
                                    
                                    }   


                                    

                                    
                                    
                                    <div className="button-items">
                      <Button
                        color="success"
                        className="btn-rounded"
                        onClick={this.AddBen}
                      >
                        Proceed
                      </Button>
                      <></>

                      {/* <Button
                        color="info"
                        className="btn-rounded"
                        onClick={this.verify2}
                      >
                        Verify
                      </Button> */}
                      
                      
                      
                    
                    </div>
                                    


                      </OffcanvasBody>
                    </Offcanvas>



                    
                      <Modal
                        isOpen={this.state.modal_backdrop}
                        toggle={this.tog_backdrop}
                        scrollable={true}
                        backdrop={'static'}
                        id="staticBackdrop"
                      >
                         {this.state.loading ? <Loader /> : null}
                        <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">Verify Sender</h5>
                          <button type="button" className="btn-close" onClick={() =>
                            this.setState({ modal_backdrop: false })
                          } aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                          
                          <p style={{color:'red'}}>Sender is not Registered.</p>
                          <AvField name="SenFirstName" label="" value={this.state.SenFirstName === null ? ''   : this.state.SenFirstName}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'SenFirstName', e.target.value)}  placeholder="Enter SenFirstName ."   type="text"  className="form-control" />
                          <AvField name="SenLastName" label="" value={this.state.SenLastName === null ? ''   : this.state.SenLastName}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'SenLastName', e.target.value)}  placeholder="Enter SenLastName ."   type="text"  className="form-control" />
                          <AvField name="SenDOB" label="" value={this.state.SenDOB === null ? ''   : this.state.SenDOB}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'SenDOB', e.target.value)}  placeholder="Enter SenDOB ."   type="date"  className="form-control" />
                          <AvField name="SenGenderId"   label="" value={this.state.formData.SenGenderId === null ? '-1'   : this.state.formData.SenGenderId} onChange={(e) => {
    Fn_ChangeStateValue(this.obj, 'SenGenderId', e.target.value);
  
  }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select Gender"} />
                                            {this.state.genderData
                                              ? this.state.genderData.map(
                                                  (option, key) => (
                                                    <option key={option.value} value={option.value} label={option.label} />
                                                  )
                                                )
                                              : null}
                                          </AvField>


                                          <AvField name="SenStateId"   label="" value={this.state.formData.SenStateId === null ? '-1'   : this.state.formData.SenStateId} onChange={(e) => {
    Fn_ChangeStateValue(this.obj, 'SenStateId', e.target.value);
    this.onChangeState(e);
  }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select State"} />
                                            {this.state.state
                                              ? this.state.state.map(
                                                  (option, key) => (
                                                    <option key={option.name} value={option.name} label={option.name} />
                                                  )
                                                )
                                              : null}
                                          </AvField>


                                          <AvField name="SenDistrictId"   label="" value={this.state.formData.SenDistrictId === null ? '-1'   : this.state.formData.SenDistrictId} onChange={(e) => {
    Fn_ChangeStateValue(this.obj, 'SenDistrictId', e.target.value);
    
  }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select District"} />
                                            {this.state.District
                                              ? this.state.District.map(
                                                  (option, key) => (
                                                    <option key={option.district} value={option.district} label={option.district} />
                                                  )
                                                )
                                              : null}
                                          </AvField>
                           <AvField name="SenCity" label="" value={this.state.SenCity === null ? ''   : this.state.SenCity}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'SenCity', e.target.value)}  placeholder="Enter SenCity ."   type="text"  className="form-control" />

                           <AvField name="SenAddress" label="" value={this.state.SenAddress === null ? ''   : this.state.SenAddress}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'SenAddress', e.target.value)}  placeholder="Enter SenAddress ."   type="text"  className="form-control" />

                           <AvField name="SenEmployer" label="" value={this.state.SenEmployer === null ? ''   : this.state.SenEmployer}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'SenEmployer', e.target.value)}  placeholder="Enter SenEmployer ."   type="text"  className="form-control" />

                        
                          
                           <AvField name="SenNationaltityId" label="" value={'Nepalese'}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'SenNationaltityId', e.target.value)}  placeholder="Enter SenNationaltityId ."   type="text"  className="form-control" disabled />

                           <AvField name="SenIncomeSourceId"   label="" value={this.state.formData.SenIncomeSourceId === null ? '-1'   : this.state.formData.SenIncomeSourceId} onChange={(e) => {
    Fn_ChangeStateValue(this.obj, 'SenIncomeSourceId', e.target.value);
    
  }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select Income Source"} />
                                            {this.state.incomeSourceData
                                              ? this.state.incomeSourceData.map(
                                                  (option, key) => (
                                                    <option key={option.value} value={option.value} label={option.label} />
                                                  )
                                                )
                                              : null}
                                          </AvField>


                                          <AvField name="SenDocId"   label="" value={this.state.formData.SenDocId === null ? '-1'   : this.state.formData.SenDocId} onChange={(e) => {
    Fn_ChangeStateValue(this.obj, 'SenDocId', e.target.value);
    
  }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select Id Type"} />

                                            <option value={'Aadhaar Card'}  label={"Aadhaar Card"} />
                                           
                                          </AvField>
            <AvField name="SenIdNumber" label="" value={this.state.SenIdNumber === null ? ''   : this.state.SenIdNumber}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'SenIdNumber', e.target.value)}  placeholder="Enter Id Number ."   type="text"  className="form-control" />
            {/* <AvField name="SenIdIssuedPlace" label="" value={this.state.SenIdIssuedPlace === null ? ''   : this.state.SenIdIssuedPlace}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'SenIdIssuedPlace', e.target.value)}  placeholder="Enter SenIdIssuedPlace ."   type="text"  className="form-control" />
            <AvField name="SenIdExpiryDate" label="" value={this.state.SenIdExpiryDate === null ? ''   : this.state.SenIdExpiryDate}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'SenIdExpiryDate', e.target.value)}  placeholder="Enter SenIdExpiryDate ."   type="text"  className="form-control" /> */}


                          <AvField name="Otp" label="" value={this.state.Otp === null ? ''   : this.state.Otp}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'Otp', e.target.value)}  placeholder="Enter Otp ."   type="number"  className="form-control" />
                      
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn" onClick={() =>
                            this.setState({ modal_backdrop: false })
                          }>Cancel</button>
                          <button type="button" className="btn" onClick={this.sendotp}>Resend OTP</button>
                          <button type="button" onClick={this.checkOtp}  className="btn btn-primary">Proceed</button>
                        </div>
                      </Modal>





                      <Modal
                        isOpen={this.state.pay_modal}
                        toggle={this.pay_modal}
                        scrollable={true}
                        backdrop={'static'}
                        id="staticBackdrop2"
                      >
                        <div className="modal-header">
                          <h5 className="modal-title" >Verify Details</h5>
                          <button type="button" className="btn-close" onClick={() =>
                            this.setState({ pay_modal: false })
                          } aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                         
                            <h5>Account Holder Name : {this.state.BenDetails[0].name}</h5>
                            <br></br>
                            <h5>Mobile No : {this.state.BenDetails[0].mobile}</h5>
                            <br></br>
                            <h5>Payment Mode : {this.state.BenDetails[0].paymentMode}</h5>
                            <br></br>
                            <h5>Account No : {this.state.BenDetails[0].acNumber}</h5>
                            <br></br>
                            <h5>Bank Name : {this.state.BenDetails[0].bankName} </h5>
                            <br></br>
                           
                          <AvField name="Amount" label="" value={this.state.Amount === null ? ''   : this.state.Amount}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'Amount', e.target.value)}  placeholder="Enter Amount"   type="number"  className="form-control" />
                          <AvField name="ReasonId"   label="" value={this.state.ReasonId === null ? '-1'   : this.state.ReasonId} onChange={(e) => {
    Fn_ChangeStateValue(this.obj, 'ReasonId', e.target.value);
  
  }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select Reason"} />
                                            <option value={'Educational Expense'}  label={"Educational Expense"} />
                                            <option value={'EMI Payment'}  label={"EMI Payment"} />
                                            <option value={'Family Maintanance'}  label={"Family Maintanance"} />
                                            <option value={'Medical Expense'}  label={"Medical Expense"} />
                                            <option value={'Repayment of Loans'}  label={"Repayment of Loans"} />
                                            <option value={'Saving Purpose'}  label={"Saving Purpose"} />
                                            <option value={'Utility Payment'}  label={"Utility Payment"} />
                                          </AvField>
                        
                        </div>
                        <div className="modal-footer">
                          <button type="button"  className="btn btn-info"  onClick={()=>this.GetServiceCharge()}>Proceed</button>
                         
                        </div>
                      </Modal>




                      <Modal
                        isOpen={this.state.servicecharges_modal}
                        toggle={this.servicecharges_modal}
                        scrollable={true}
                        backdrop={'static'}
                        id="staticBackdrop2"
                      >
                        <div className="modal-header">
                          <h5 className="modal-title" >Verify Details</h5>
                          <button type="button" className="btn-close" onClick={() =>
                            this.setState({ servicecharges_modal: false })
                          } aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                        <h5>CollectionAmount : {this.state.collectionAmount}</h5>
                            <br></br>
                            <h5>CollectionCurrency : {this.state.collectionCurrency}</h5>
                            <br></br>
                            <h5>ServiceCharge : {this.state.serviceCharge}</h5>
                            <br></br>
                            <h5>TransferAmount : {this.state.transferAmount}</h5>
                            <br></br>
                            <h5>ExchangeRate : {this.state.exchangeRate}</h5>
                            <br></br>
                            <h5>PayoutAmount : {this.state.payoutAmount}</h5>
                            <br></br>
                            <h5>PayoutCurrency : {this.state.payoutCurrency}</h5>
                            <br></br>
                          
                            <AvField name="VerifyOTP" label="" value={this.state.VerifyOTP === null ? ''   : this.state.VerifyOTP}  onChange={(e) => Fn_ChangeStateValue(this.obj, 'VerifyOTP', e.target.value)}  placeholder="Enter OTP"   type="number"  className="form-control" />




                        </div>


                      
                        <div className="modal-footer">
                          <button type="button"  className="btn btn-info"  onClick={()=>this.verifypay()}>Verify & Pay</button>
                         
                        </div>
                      </Modal>
              
                  </CardBody>
                </Card>
              </Col>
                                </Row>
                            
                          <div className="d-flex flex-wrap gap-2">
                         

                        {this.state.success_msg ? (
                      <SweetAlert
                        title={'Success'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        You clicked the button!
                      </SweetAlert>
                    ) : null}

{this.state.success_msg_Ben ? (
                      <SweetAlert
                        title={'Beneficiary Added Successfully!'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno_ben}
                        
                      >
                     
                      </SweetAlert>
                    ) : null}



{this.state.success_verify ? (
                      <SweetAlert
                        title={'Beneficiary Verified Successfully!'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno_ben_verify}
                        
                      >
                     
                      </SweetAlert>
                    ) : null}


{this.state.error_ben ? (
                      <SweetAlert
                        title={'Beneficiary Details Incorrect!'}
                        danger
                       
                        confirmBtnBsStyle="danger"
                      
                        onConfirm={this.syno_ben_verify}
                        
                      >
                     
                      </SweetAlert>
                    ) : null}





        {this.state.limitexceeded ? (
                      <SweetAlert
                        title={'Sender Limit Exceeded!'}
                        danger
                       
                        confirmBtnBsStyle="danger"
                      
                        onConfirm={this.syno_ben_verify}
                        
                      >
                     
                      </SweetAlert>
                    ) : null}

{this.state.insufficienfund ? (
                      <SweetAlert
                        title={'Insufficient Funds!'}
                        danger
                       
                        confirmBtnBsStyle="danger"
                      
                        onConfirm={this.syno_ben_verify}
                        
                      >
                     
                      </SweetAlert>
                    ) : null}


{this.state.tranfailed ? (
                      <SweetAlert
                        title={'Transaction Failed!'}
                        danger
                        content={this.state.faildata}
                        confirmBtnBsStyle="danger"
                        onConfirm={this.tran}
                        
                      >
                        TRANSACTION CODE - {this.state.transactioncode}
                        {this.state.faildata}
                     
                      </SweetAlert>
                    ) : null}


{this.state.transuccess ? (
                      <SweetAlert
                        title={'Transaction Successfull!'}
                        success
                        showCancel
                        confirmBtnBsStyle="success"
                        cancelBtnText="Print!"
                      
                        onConfirm={this.tran}
                        onCancel={this.transus}
                        
                      >
                       TRANSACTION CODE - {this.state.transactioncode}
                       PinNo  =  {this.state.utr}
                     
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
                                                                    onConfirm={this.IMPSTransfer}
                                                                    onCancel={this.tran}
                                                                >
                                                                    You won`t be able to revert this!
                                                                    Amount  -  {this.state.Amount}
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


{this.state.isRegistered?
     
      <RCDisplayPage
        //page header paramaters
        Isbreadcrumb = {false}
        breadCrumbTitle={null}
        breadcrumbItem={null}
        obj={this.obj}
        //column paramaters
        isSearchBox={false}
        isSNo={true}
        isCheckBox={false}
        isViewDetails={false}
        //grid paramaters
        gridData={this.state.CustomerData.receivers}
        gridHeader={this.renderGridHeader}
        gridBody={this.renderGridBody}
        btnAdd_onClick={this.btnAdd_onClick}
        btnEdit_onClick={this.btnEdit_onClick}
        btnApprove_onClick={this.btnApprove_onClick}
        btnReject_onClick ={null}
        //delete link parameters
        confirm_alert={null}
        confirm_alert_Approve={null}
        success_dlg={null}
        dynamic_title={null}
        dynamic_description={null}
        toggleDeleteConfirm={null}
        toggleDeleteSuccess={null}
        toggleApproveConfirm ={null}
        btnDelete_onClick={null}
        btnLock_onClick  =  {null}
        btnUnLock_onClick  =  {null}
        //modal paramaters
        isOpenModal={this.state.modal}
        modalTitle={this.modalTitle}
        selectedFormData={this.state.selectedFormData}
        modalBody={this.renderModalBody}
        togglemodal={null}
        //user rights
        isAdd={false}
        isEdit2={false}
        isDelete={false}
        islockshow= {false}
        verify ={this.verify}
        pay_modal={this.pay_modal}
      ></RCDisplayPage>
    : null}

      </>

      
    );
  }
}
export default compose(container)(pageAddEdit_IndoNepal);
