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
import { withRouter } from 'react-router-dom';





class pageAddEdit_IndoKYC extends Component {
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
      CustMobileNO : 0,
      CustAadharNo : 0,
      selectedOption: '1',
      selectedGroup : {},
      confirm : false,
      IsNoDone : false,
      reset : false,
      success_tranp : false,
      pro : false
      

    };
    this.obj = this;
    this.formTitle = "EKYC";
    this.breadCrumbTitle = "EKYC";
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
   
    this.onTranChange  = this.onTranChange.bind(this);
    this.CaptureAvdm =  this.CaptureAvdm.bind(this);
    this.discoverAvdm  =  this.discoverAvdm.bind(this);
    this.continueregistration  = this.continueregistration.bind(this);
    this.handleSelectGroup  = this.handleSelectGroup.bind(this);
    this.confirm  = this.confirm.bind(this);
    this.scan  = this.scan.bind(this);
   
    this.transus  = this.transus.bind(this);
    this.proceed = this.proceed.bind(this);
    this.enrollment =  this.enrollment.bind(this);
  }
  componentDidMount() {

  
   
    const { location } = this.props;
    const customerId = new URLSearchParams(location.search).get('customerId');
    const cpuniquerefno = new URLSearchParams(location.search).get('cpuniquerefno');
    const token = new URLSearchParams(location.search).get('token');

this.setState({customerId : customerId , cpuniquerefno : cpuniquerefno , token : token})
  
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
     var DeviceInfo =  ""
    
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
                DeviceInfo =  data;
                console.log(data);
                 
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
       alert("Connection failed Please try again.Please refresh page and try again");
      }

      $("select#ddlAVDM").prop('selectedIndex', 0);

      //$('#txtDeviceInfo').val(DataXML);
      this.setState({finalUrl : finalUrl, deviceinfo : DeviceInfo});
      
  }










  confirm () {
    this.discoverAvdm();

    this.setState({confirm : true})

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
  var wadth  =  'TF/lfPuh1n4ZY1xizYpqikIBm+gv65r51MFNek4uwNw=';
  var  device="mantra";
 
  var xmlString = "";
 
 
  var strWadh="";
    var strOtp="";
 
    var XML = '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000"  wadh="' + wadth + '" posh="UNKNOWN" env="P" /> ' + DString + '<CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';

   
 
//  var XML='<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="10000" posh="UNKNOWN" env="P" /> '+DString+'<CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
 
 
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
           
            console.log(data);
          
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

        xmlString = xmlString.replace(/\</g, "LTlt");
        xmlString = xmlString.replace(/\>/g, "GTgt");
        xmlString = xmlString.replace(/"/g, "'");
 
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



  proceed = async() =>{
    this.setState({loading : true});

      var customerId  =  this.state.customerId;
      var cpuniquerefno  = this.state.cpuniquerefno;
      var token  = this.state.token;
      var CustomerTypeId  = this.state.CustomerTypeId;
      var SourceIncomeId  = this.state.SourceIncomeId;
      var TransactionTypeId  = this.state.TransactionTypeId;
      var FingerPrint  = this.state.TransactionTypeId;



      let vformData = new FormData();
      vformData.append("CustomerType", CustomerTypeId);
      vformData.append("SourceIncomeType", TransactionTypeId);
      vformData.append("AnnualIncome", SourceIncomeId);
      vformData.append("CustomerID", customerId);
      vformData.append("PartnerUniqueRefNo", cpuniquerefno);
      let AuthUser2 = function() {
       return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMRCustomerOnBoarding/0/token" , vformData).then(token => { return token } )
      }
       let userToken2 = await AuthUser2();

       this.setState({loading : false});

       alert(userToken2.data.data.message);




       if (userToken2.data.data.code == "000") {
       const obj = JSON.parse(sessionStorage.getItem("authUser"));

       const obj2 = JSON.parse(localStorage.getItem("authUser"));
   
       if(obj2){
         sessionStorage.setItem("authUser", localStorage.getItem("authUser"));

         this.props.history.push("/indonepal");
       }

       




      }

     }

  



  enrollment = async()=> {
    this.setState({loading : true});

    // var FingerPrint  = '<?xml version="1.0"?>'+
    // '<PidData>'+
    // ' <Resp errCode="0" errInfo="Success." fCount="1" fType="2" nmPoints="21" qScore="67" />'+
    // '<DeviceInfo dpId="MANTRA.MSIPL" rdsId="MANTRA.WIN.001" rdsVer="1.0.8" mi="MFS100" mc="MIIEGDCCAwCgAwIBAgIEAxl1ADANBgkqhkiG9w0BAQsFADCB6jEqMCgGA1UEAxMhRFMgTUFOVFJBIFNPRlRFQ0ggSU5ESUEgUFZUIExURCAzMVUwUwYDVQQzE0xCLTIwMyBTaGFwYXRoIEhleGEgT3Bwb3NpdGUgR3VqYXJhdCBIaWdoIENvdXJ0IFMuRyBIaWdod2F5IEFobWVkYWJhZCAtMzgwMDYwMRIwEAYDVQQJEwlBSE1FREFCQUQxEDAOBgNVBAgTB0dVSkFSQVQxCzAJBgNVBAsTAklUMSUwIwYDVQQKExxNQU5UUkEgU09GVEVDSCBJTkRJQSBQVlQgTFREMQswCQYDVQQGEwJJTjAeFw0yMzEyMjEwMzI0MzZaFw0yNDAxMjAwMzM5NTJaMIGwMSUwIwYDVQQDExxNYW50cmEgU29mdGVjaCBJbmRpYSBQdnQgTHRkMR4wHAYDVQQLExVCaW9tZXRyaWMgTWFudWZhY3R1cmUxDjAMBgNVBAoTBU1TSVBMMRIwEAYDVQQHEwlBSE1FREFCQUQxEDAOBgNVBAgTB0dVSkFSQVQxCzAJBgNVBAYTAklOMSQwIgYJKoZIhvcNAQkBFhVzdXBwb3J0QG1hbnRyYXRlYy5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDao9IvlMWbVXq6mt5074RasxUBC+E8b/LgS1MaII2hRGWRS4zrobjPPoT7HpEqC66PpAp6MdBw8w4WfEJngVGn2OXKQzS7Mz11tfiSdFaJ4P1zyYRcHwv8Fwy/hVAz/TtcdLuiZCLnkCbDMicREgaUq4gOTAM7GL6KS+nOLUNlsDy7Ptk5b3XrFetuiSCKLnEwIh1cBS0yjqEzAtNIXfcTS2DEe1RgGIQPRlh7JN/ZYzwWk66I5UtShs0U8PYae8H31JOUmKZINySyrejqxZf0Rm387AQcYDo6vB6bJKLIo2AZj8CoFkUazNh1ZjZaVmCkOPG13MQt0KcvsXS9+rp/AgMBAAEwDQYJKoZIhvcNAQELBQADggEBAFn9gbbtYeg/ABy3WT+m3TJuDav9ndqFGYOwzDAjGlE6edqVLrsU/qNwW4HJUCPc74hnHpMhPEBtLr9YL/GNq7336sKI74zz4kuMO3gDfKY7ThKWeUSTJTbk0NGyq6b2tNhLAhpkHKd7Z6bFysT0T0u7Oh782bzCOIY8szrBCNwg7nmyDe0NpyU/YWcvPb3H1qYQrdzP0Sp4DtUg2hPCLFMk7qY1Qf9oLAlmt0nxbJ7v/NT6ZriZ76oA1mWV6Foi11TJ56injSxeYmPzdeSPoNF0i39rsLFmdAyKsOwtnZRyfhEQ/Awj+OHBZxOVO/MBZPkAhiSwiASOCVHq7iYgFnI=" dc="46b6bcfc-632c-4548-a453-94ee32869267">'+
    // '<additional_info>'+
    // ' <Param name="srno" value="4552405" />'+
    // ' <Param name="sysid" value="6E3FEBFAE0BEE01FBFF0" />'+
    // ' <Param name="ts" value="2023-12-21T12:30:03+05:30" />'+
    // ' </additional_info>'+
    // ' </DeviceInfo>'+
    // ' <Skey ci="20250923">DG9ujTVznOF0rHZvR/xH79Wq2GPKQZUyzHNGxLo8v98K1NIJreC93SsLeNPEUaveqFM+lvLlZlaQY+1VjZ9JZlm6twajUsNbQcqg6YE8XtEOkjLNxkjCKqNNyI8F08C23UOF4zZQ9WDv3NQ6DO8C5lAYF//V6HEyAxnM+XhD7Rl4kMR/hL2BjyM64ihSaFr8xzIFOOFe6yiAlMSCqCqCBswBnczoT4Gil4SSUdf01fnQxysnUODOfUO6KXpuWYR8SL86EamaYo6ksgnUBLmZtPjehg02PDkze9X6W1b71Zc28KIxq6AIAoxiKItVVUwtV6k3NO4gY7QTlyCKVmj5zQ==</Skey>'+
    // '<Hmac>nmqRxiv+xZUoNAOKHEGXG/2LAmh+iSRX2rn2Afz1FCBurve6oy9mrEmLVyBrYN69</Hmac>'+
    //  '<Data type="X">MjAyMy0xMi0yMVQxMjozMDoxM1diPG4Ui2CDb+MvqRVK5zcR57UkOH/51A5TFBFPm4BVKoKmp3Ct72W6nVr942SOg6XDb1V0aWq4GHt2nWf6f1Ly9lHporZsXKFbAx2utrMS8xAOnyLfMRZOVy/JDuA+oloWc5h38TRmkdUKh5IusnEgpoVgYvHODtT+zy3CSZJMjifNs4AmUHD0WEV9QfDnzt6BWjklZafivKPPnvPNiVGYgcf5EcmZ0HHQqMS8Z3jVnp8efYwJSehNJF2YA26oME6NJuPs60/obem9iM6k/C/B3jNrQcosgpOP7Kouv0+ibu6qAAjV+Npb3jeTjUi4surSyBYBM2ECrVPbrQkikkr+zFOLLk7dmGsvOfe6yWVUX2tr0Ewcr/5H0uTs/c0ucpMhujkvjV6/F5ArzNPpLrgpombDCsMIRAGzeL1Nn09jqH+aiGSOi9WED0pNb/cV3TZKGpW25yCUrQdBI/ES3/36vfbMwWvkckxt4aVE8mjoeNKpiQxlXMQfbCkT04j5mh/yXEz0mTTPgecA5m7xsHkCAI6of5rAM22NagfhgKVINTjrgn/1DWW/n7dBJwzydIdhtN4n/jBeOiuZjIRSIidQkeZyaS7MKxxR4S3bzCE5sjh2K46eLbPl9AdhAa+2bOp50FmSRZ9AbWzGcYJ4BjWoIcP0CRDjv29gS93JOv4VGTW0owQMSinCPZbJVZjC0xIDfQXLIYN5nmN3Aw43WnfF0TfY6i/Na7koZ2aOAQuhfhjAp/qpbHW1PG6J0DYom6+BA27tmmc+M5Tdj7s7sAvgugROI5rANXVdoFbq6WAIp2XupJUi2Eizv9uXbzgrBw+s3fntKx9ZcXrFsYII0/lGd6+/3lNzekdtLmowEXZw4wrPyf7KDWQsTpa3SD8A89v6xQSuGvijwO/CIERTmTaHqEaxi8vLw8qE63M2MLCqhIS5GidOWpl3nomtSKl5WvcoPrX/LFLmoBHkhpDak1u7/6CPmomuvehvvdtqb9KFpb6cyRLkIQmUo7xVTpYe2iUztvvOSCBTbxY4L72/oLbTkbsSEkVUMa+swTw4u6gApjO6AVlUs4u56hJzzqBxgf/SBSBvKBs8eLfANs3mGGzLGDOwPKRolDOKZY9KJZ3xyXjNfFnyt7xUgl2uEYl46hpvFbzKD1S3MOzBAsOS6eI4NYzd46YvOzyXD0GLt/vYdD/J5BpUGZX00Mqn1wZ8pB/MK1BuBmGKIITmtKQcYa1lBGTbTVF/bn41/GiCySEELiRx2f8ZsiUimye5J2OGBZSSJoQjb8wSPYVinc1K+jjtB+0eE7tTeNmA1/Uyxm53ana/viYGaEVifLbQ+Vu//T0kRfK7q6P1ry8TBoBuafHL8O8QdhBXyVxJjrHvL9ufyKmazOy3+Z+EFn+bJO3EYMYLH+3ri8iOBGO4AHrh52aid+pK/KT3oR98ZnWnIjk8PAHpHO6ebKWTePb5wzg3CrcVgcH8kct/FrcTDbYd66LT1vEA'+
    //  'hfH13ujvDn+6o5M2MDlnJFQIGnz9Z4AU8P+KUmR5XvjmC5k5Fz1BoAoTJb1ByJKsToHrzvKMmOmHIZL3eTfixsqxB8A1qzRndO1lesD19C9dgMwwr3gjA9UDghgbytpFa+5PCrjFvT6dD4tBHVu4MRmGF02k/nQJoSXaC5olQPI6Vmd9Ybdtvl/CbvocsrYizqoxSzjkHmeOFY3ICBLhxBDznAYwVa4zl0AEmO2sHNHKWNwcR6pesWY30EFVNw6k0ci+UfY/D19/p/D/DWTw1B1/XXK4HxfQRk5hI3vHBmoT2/M2TvngBcZFq+lJ13jKFejPQ1XDk2188OQcKEo6ZizwaTnAvH6wOhnbzW9puu7vX5ZacEhZrQirDoDLlZ76qAyT9PyCoETYOGlGV6IhM1qTaYNqYAiD4Y9K5lI+ov90B2C50LxDvfmJP6WI5LUzIlfOWbs1ToTYWmtnlJsYKXmAQx5q8dZYd/Ao/elHEwwqh43c+JS74ZU3sWpyYpmUavk+nTjxKpQ8qW5QdlAkEAVyr696h5DArTsOp0qJ77+bKxD3kRNfih4FnHXIWwangxXl3TzREpwZ3bfdFK14H+wbS9jGfhWsqw4xRoJGy5AdxCmS2ET5QfCesBxZz3FrxFzbEw6tINrRnYr96cKPiGm2TE6332VfGAGVus5E5EBy2gUK+VThoxa7ebUbA33aLW0/JH5rYDyOIA6Alu6pCEySjo3vm8SQ6Nzgd/qXLTdfBFez2/wduwLuRQULsuc3Nw/MuS5292UcfN5Lny5ee0qOE6UaCfiS+wzpzOOpnStUTCBH3aAy8madr22fn9CLx2rqWUnAJIEufm9TpBUaXZZThFeFZqmLengZLpDo5vSAErlXzv0TAauj6PluSp36bhFMxD/B3IXmG3KO45n/wXyQwkudb5CDmQ4Fpjt6UoZgXbKlI0cUi5xbmj/2zklCdR94jQGms790dPamkDICsjJzek1yVH2+sfZgu5gVRCvUqR/fhYcPIO9lJYyLoh0+xQSM7TWQbAe1ZCkRWr0XGtmd025vujJrY71Xo0bAXYUK13NldMm3Qh4kCywzm5BTCHtzQdBCkIa9RCMa3p0Mx0kYrtHq14obJFBlp20tm3TKI89WVS8u9Tll1nZVQiRwwZiU59cWiE9Fvp6qZLMdJ3qgm65E3DDK38kSrQAxQeF06l0ATgAQHZ7y0b1cN13bxvUaJywPMTZdOAgKcsJiUDZWNBU21uFW26dwDfG1wEnfitY+5tEEHzIpftAWw0semnj7JVqVJTXGv2Fn5N7uN6AzSYCHUkZDoLOJKseCAyZu0/Os8oucRUGjU0lGzcSiLLZbJQcMPn2j4MjAi5+02LCZUK2tE8A+R8/6eVorF9An9ICAZultPUHQXAeXl5mZCs7dihFsbcDxTw8EihVRdHohFfrTdQToALZ20AN+gLXus++ImWn83DLBTTiWOdbshAx9d08ALvg4CF9A3pagqg+fthkuHVZzLtky4q38OfsIT3PMFeRAWgvTEx8KQ2AmSezVKhl082T69Yx8i5/OX'+
    //  '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'+
    //  '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'+
    //  'k+zOJmEHXGJm3q+tsFUo6WT07WEke57nMgzdDsUy9ZY5dT8n133Elqhu8djI/kiq1XmBLfhSMNRyp1LRdZQfVCQHRTqLj0vUDgF+5Q2oibgEXqm4wTe5Q+ZgmQROH68Vrso6a+UXlKAWQBZ5tRovo33m7nG4LPtWcfky5rfEtNRTXGTeXxNNY1VdLcd4hJLS9oOEx39cHhuDxekx9c+cB0YtkqOwmOWLEOsY33Qs3iJDVdsqrY6Rxq6XKWM3HKc1aurucVd/E4HheQbgOkIjYCd8v9XM0eP+pJW51KNi3LSydxPrrwHB6cS8Vz4a+1C0sXWxZuQMU5WFCIFW4rJl+ZXYwej8cDzTD3X+L6xoupt6RIbd8a/m+n2iW/rqFu8HOI+lslXGWQcpEfkQJPCs29hocQdBfIzaLMJDefEx02PFmtkVGl0jpv9wd/Do7z74bbKsO6b4tcdV70A08ysj4ksCMXdfOdmu4zrtpO904YEBPajNcDZfqOfQWw0LM8Z8hjxzZxXFyGxjhBPSWRcXuJTT/rYCxWKiMZHJewwJz5afZEPDEBAyo8nG1bzA695zUUYebDGzZhOs3WpBJaTQvGNcEMJLaJrHxhmsDv0DT4L8jLOVueJ6Gu7Cw2GExtzuReTJAwgyQ95ee5lUjslo3xIfM571RKSgqxJ/dZ/Hj9WjRcZfO3okQY4YV9MXFTDz0wSV9GSpTknK2buNveKPcDozsNZmE54KVL4pHafIEtFEADZNSXgYqRPkI68hbEiqSnYccyq3G7Mixpjb5VgDYiVHU12tA2hDQWFzGZMp3nvXMJt/amg4LqdeZAOY6EDLJcQzXgjvqPC1PaaJtlD0YhkdaqK1Tj6FdSCDZIIhsvcM0VWaJXxMwVU7/IrRSeHzwRg+AFmqaJcEwz7AXbPcbpvpY8W5Xsd+I87bBWuH7fss1vfHBcWalqyoUanmHxUOt3PENZlNhqDKg9UfZcJ2JRjWfIGbsyFDStmp1gAxPmLcX5gjaTApOcCuX9S3oFaeFD5UeHJugP3OwaC4dMPFYP1qmyDdmLjfg0g4IUTYH23bVgFflVBbEj7dJiYaUXav9gJhok8GUt/ltPXEV/9S8cTNncHiVqBa+MDtM26RenZjSTxLBanD+Oc68NYmdGuE2ELqN7Y0EKVu794kaIYAH4hnDGO4N6EcbINxUdRQFzuaPodxE9frj45+yoeVGeNBSfeOJ9f9dTBXlsAc4/xbHiXECKAEsvjatG0AsfhPM4E4SVnDbw483dy/k0TulN9Di1ITVPDD41bFzMlwXD9Yq9aoQYz1Vv8XIB5wCJQ+X5L0jAb4ADzNpg8OiYWCmDcEo/W0YMlnvqnMTUgtSLynFlx3pwJ0eiK/9qgn2kEosBLh1sqAyzwTu71UGJdNZfX80uVUUNabSeMGTObt9QIFFcBlxiS2gf96+njtCNpSTMleN0Cg6VLS+qrFBxkyj0whiPZufwwMNUx6PGEhP6DTE+V+DpfTy0Ky9Ilc8x011cqJstDnNG8W12UoAtzEzV4rEFgOB6yOBc7BD3PiKnvT3wfkGPVPAT1aVGHPb7JTXGmEsJxaQMwyRHtypb4wty/MDB0udMFqevBjKq3FL1wJeSdVn3O4m9/cl2BCzkx2ltYmQwwCFPeglnJfiOhgVp+s7qJwSFaZmkv5bjq7KGlae7tkDvG8qovLXLCHO0nECe2yyqC56WNQrwr2xOQF0aFp4NsrAopSsq/2p5pjBI8NRcpckiuzqOsjKuk+XZfzVQ2Jinbyn7rrmfuQLmWKQQol8SJoyP4D5F5U8Fj97k2GQwAGCMeZPy4XPDM7fQP6UU4zOrPaveYelH2StX8cOIboJXxMIWgo5rb/0wNJU28GHHO7KgxGecVkrNgUNKsyXRB8hFKT6W/Oh4QoEvr+P2OUnmWe0k31Net0p7jVzTC/m5Tz7GKu38R8wCM4b0fdqpQUZF/xY/dtv6KiU1rLpu7ZRqWBstM7LV5h1m1q7Bv6XToddI8n9EVX7s0rOMhlGDu7PxC7sccZ/KYsIwAy/VeVQVMEYeatEk+gc2RcbgYVJmr5vb5l0QZIi3D4XWK72BPpud3gboJBlR2Uo8g8xDETneuA8eQGQ2qPqc'+
    //  'AMCOuMfN+olO3LGOvtE4/PYL+TdV9bE5A0mWkzvy8aOHoHcOcKpsDyJJGw8sgQ0MtbQaOZnHYQ5Mm/Tlc0ljCePANu+16IFpnMgKFdYZXbHMVus2qJ656YMux/SYl4E6YqnqZVzYlpb8fPXi/m5IemjEwmUxBJKyscDyb2iSl+4A5neGwWgzyRqlBhmeCOJOoglV9BpCHnRbjruyGJwEx3w8Wuw56ouDhVymWixzTt0UJQOnPtU/aX4V5kyszvXZSg1lOnlt/9TJEAT1XMi3C3U2ltTCUxVDQvtfu0Q2YQdMmaPYRXuinqZ5hGwDjcujLc5sJB2jWbSlll83mUbVLmk4sRZK9srCMzF/ZIdEwj5C7WqoepDGI3pxrqAKnsSNIeBuYCpJwNZqzbGbpExv/YLEonRxSCSGgOT3Qmo5S7+PD5fILxI1OS1vsxwCfn8cAC8yPN74OJRJXVA8V+NnDu4yHb2ofu0PBgwl0fqbFwiBFxtBg9adiiIa6bZjOGT8/metKJmeFfFLv0GBA/B790aHlJQMo10ZBI987YeA0KULtFpVazX/xfNiOIs82wFDhrVon4WecU8N/ptlew3CYsYFUsRsTS5oo/zhUzlLo+oIYoNnHcF9iIVOligyzpaAPOKihFSe0HQHlYQXWcWSDaZXq3oOvajCd9DKExqljzw9ZO5I+rJpvq/HzcJEvTnZC2SrA8t1Xf9Um2agYabQ05mqs9o5xOEEPia+6e3Z/mbiRsnPMadlYXKeoRW6lLnOWHiCWQ6nOzMiJNRq+qK6uW7j3nfrCa60tcPal01CLAMHmEM1SkqhXe7uEGERawmNK+knUxS3BiwMKM+2cUNh6bwuCEB5rAkNkBrgnV37yfIJBu1yRi0/FS11MFjyjU4Zr8BaqNNOY7Lo4X6Y2iL3BtBTUeP75MTzb7qF/OBsQlSxXD0oY7zx93Jf9jAhvtpSG5g'+
    //  'UR7XGw6Lm/vXXqlgbOzaWSBxxVU4cj2DhY1z1NdkTo0/8RqWMgOuZZzCV3JdIC0BjBpdlSqC491i/nuWrNYu963nTlQSdNH6uxI6y3vZW8XV1IdS2GhNKvBpRx6vL/Y5jzKzg7jcbIu80lrjz4m8YOf0sqW+sxdgE1mUs/wxhyRqj2ygMktMDTtbEMs5J+UapaqQ97sWFucZnsjdnzCDYPWiyQQf9G1QGwX9VZSRy2feIpGr6mxU3jNLKr0K3mNPcUOiwemrOe8u+0F4WRzL3rBCkzbM8konMQukS4Nhox6plVS9Hwl9iofApCi+2D9DQUtF53VAK/xzr7O9dONMKRhQnWn6zxiSW1UIWC1rb7c46psoj1wLEyE1COn8J8qPu6gkXrRPDgkhSbWIY0EsGd6cku8WaO0jQORirKFeHwwV77pvwhladjPdkhYVpLBHjHGTZCdy5alzEliW01/UDVXPBl4nFTdeNG1c+g/r2W1XwYE2FysJnNzF0V8VwSwz0r7pjQP0OLOQPqUAId3H9gRGD5eorK82HrAlaFQyL3zbmagIp5PLD/APbYzFfwWAkjO9Va4Qg+oO/ByDIn4ja6eH8bCJLWuwJkVpnckatcYtMunNBrw4i6LXFJtkSH308AKARQzsq6ZouVL57MEXJoHZfTJ39dL3pGEoqoMylaKd12ou9S6uJkEwTJIdxDLgHuaPWfSMTrZA1bqoPOo819/svXgflUz/etZJESa09/ngeXzQvEWHs8q7s6og7EmBnKkVdfsl7nAs5f7xy6GU1kvTLWlFitMHPgNrUYkL2BztvzvhUsuWvh5mbC3LE/zyrPzGcmxu2o8tlKAwbU8J64T+xC1FGN0N4+wuy7QUBkFR3dxdeL5zaELcdWDWhW6EwEyoEhEoys5AfIT6HuUb8cRjUrF6TKHcy7Jm8xjqMDajpNA8dQKEcPYJdZR0YO4aANvru8DUoUNOJssMZdSlyTj+LinyNqp6jnRrV9jrWAt8ejRYkwUQ+M96U2VIBuek3MkEl9zEWXJyKDonZ3+CPGh1bVjWKS7VONvRxIUgJtB1o4FR5ZUwYfzNM5TMKxPHRPkCBJ6SxFH8d4PozxdbE/rcIriFTlI8DXgkfjeChecsRmSrxoZ+Sogqihdk98CbdiVciWpy+jzGVz/w5QGxluuif9fFY6gBku1rO6fH9uw1OhY7T6o0zT+smVOvK0VmUpgt2Y/PaJl78DZBNUo0Yawv4s1RDu7xjOQq5jnzwOKbAK5wUchel0Il1ztIG6sWOvE10VzUBcAkne/wPrweF4zcXu/R5vwRdRMeYX3TSREGIjJVKNA52uRNZnQfIBe5pXRVZvo847UknRH3pUDXzVxzLWnB3MfhyWKaS0h3ad88UKMb58c53JpgRrdlxLApNTOGX3KeBjUrmOiPWVxujd8o8LyvhLNcSkd79T/GtySk1ZfK9PNb1136IuB9jtwU/ZxdUK19q8PxkRIBu/yZ9JoSxgPW1/m0RxONcKfB6eLjc/ObERq2U4ThBmO9vT9WI1xO4iVhLudDux5MKCi75X4l3cPSeclLUNglfWIZh2ic0riZ'+
    //  'F+G67zY568QPzuDbtBb6RRxLYkirqYIiq1kFjfpftCz84WA36F+WCsvxBzSmxvMj/8KpT4fRJAV7yz/03agnjM5JZyfQyyTPUiQoAmXKUea96fHYXAFGQHwQMUV40uq+xb1YLhRccKnmWiSm3EEh7qeHY/X6wyGxB5AQVfFyGszrqygf7Vvn631G+/e0Fatyt4ttr08580bB7OEu6GRdbYraYFkzvZKrN6qTq66QB2g5XN4ZE4YFW7jSkh9MJ+DnTn+F3z85A308doH9/jC+nhvMg7mtkBxau03iREzJk91UoWgZuL5gm79vv217cZlzLSF3CaIlgdqK5DxzqO91x/sfVebb4eRfGRj0tD6/wio5vOLHfJUlMWYv2hEXuJ0WRrIRXjrpMyTYaADR2cNwWkPKO/xjcvjFbhIzm5W4ny/R/CMUy3/1bjAfkLqQyat4gE6pFyw0C/8JDx8Ni3NiHwZ3ncnX04eYN+7eNqSTDL6DASnv7bKkl55v448z1bikEE1mzCWNW+ThTQb8y3QCbcuYwAasGqZ5ujOU1RAdlG+yBXQDXYB97B/aknrXhiMU94wILHBCkbTBgP58OTZbHuCnfbQB3EfMFCtJkw8RpDtZrm7FA2SFzKH85cJ59lEH0tVIOMwbACGzDJKdtxG2OciV8UBGz9lGpxUoSteuvSfrJBjl1LwRkYofl2RTdD9OJyeLnS78JWo0EMZPnvvl4eU0fnUsgioXchzJ8sfyZ2wqY6HA93nfdYw9q7kIeuPMGmZ0iXoMa7/ar6TSxBCY+Os4eQYm8Zx90T3XtkidxHhfje1rIkM/hI4aikPd8ILvHOXO4mKYndXtysSBZRoImwYQEYH48EIFRa19ihAFeYMxKLCMnoMBgWzs+Rd9Cd5WzFs/3oY8a4qbygCesSmsk5k0iXuGRatvuYt9Ka9QmYEllzE9KF4y7k8HyyLiAnMk6N8xpO8JSQKgucJc20cL8/uzlr7bL2X1G8ijZcX8M481Pp6N9JBdLGfZLhK5NNMeyXJhxElLbWsIvHol1xuZ4UORbAh+l6/b9pUapvQMVlpxPwJGg7eojMZEnDmXrTeZI9OMj1Ou4Lh044THZlBEKmNFZJrQfZuYVCOYj+X4rydVB6DuwwE3fq82P0MZ1ZkNcpcjV9pVM439x7d94XPOLdqQc+GKLH8es4ZqRWyY5Ff5fcuLuUYnlkcTzwmIG9TGW/1wphN/u+IOlNiE61BVOq9xvyRzKDY0hwoNIXUHxohs/kA1i6lAawjhImgDtKOOc9fI3xyLvYnzN7SvAMPDPLqj4womO9Ipcgu8toogwBypiCOLXhVkWDXX4B1la32gm5RhITds4srAWEKRbALdugyGIf7lcIa2/dpwhy+mpvfS/RIf6F0D/Ya+gtB5IrXT6tJOvIcS5830EbWauAcJE2XDVdzgyfIndwdCjhy7skbYhCPhYFrS9MIc1dAbDS/6rRxveBCDirVqMfdKw61O2HuyhWxVnGIOYiPkWgr7a4QbYzQQ9Gh1xxMEUa6MZxg4oM+yBw5C3EetnVbx5zTgpVFP8tECUMYSSueD+ytGe1KCGT8G7l1u3GqyHavNxl3q'+
    //  '+OjgCCZ50wm8mqXM80O1uIeJCciIOb+38eJBynT7FBavXBVlLx/pXo0nD/yOUJgMHVRXnSFjjl4VtyurRnPYy1BGeHMGl9Fr5JnnX809ln2dtOPAnTN00tLTQ5yjMttU/xvVJ2ertRnl8Wuxvs6Cwj2UGZ7ykq/4q/Zs4pYzGcqdCIVhR/pE8RnhJ48TkB/rT29ciD7Ku9jEpX7rmymbeUT/BFuAcZdToW3e0mBbSHmKqt1na1hd+108IVSQucSmJGwfW+1e4xRJqpVGU5ZVGgIOMhymgMj5/h2MLTTCYTRqEoMjcGbbuHCgttMtImkZp2d+UJF+/mOjH7Hj6ODyimNrHlU3KTet3YIU3NhksrR/TE1nTUfsR6v5ThXspFeoL/AgjxQ48V13Ag26LmOrvcOPNBiZXk7CKjlpWogz39+IzCBILeEGfhn6MgvxGrtZeZG1naGI5aDe7aQqegLFNOHxzf9iZtOhBWbvbWIdmrYjy7eFibQ3iw64fPzpL4NoVRxSbe07UukX1fDZrAcNeZeXT9IKGHw==</Data>'+
    //  ' </PidData>';

    var FingerPrint  = this.state.fingerprint;

     var customerId  =  this.state.customerId;
     var cpuniquerefno  = this.state.cpuniquerefno;



     
     let vformData = new FormData();
     vformData.append("CustomerId", customerId);
     vformData.append("PartnerUniqueRefNo", cpuniquerefno);
     vformData.append("FingerData", FingerPrint);
     let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"NMREnrollment/0/token" , vformData).then(token => { return token } )
    }

    let userToken2 = await AuthUser2();

    this.setState({pro : true, loading : false});

    alert(userToken2.data.data.message);


  }


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
                                      <h4>Capture Fingureprint</h4>
                                      <Col>
                                      {this.state.IsNoDone   ? 

this.state.fingerprint == '' ? 

<button type="button" onClick={this.CaptureAvdm} className="btn btn-info">Scan</button>
:  <> <h6 color="green">Scanned</h6> 
<button type="button" onClick={this.enrollment} className="btn btn-info"  >Proceed</button>  

</>
:
<button type="button" onClick={this.continueregistration} className="btn btn-info"  >Check Device</button>
}
                                        </Col>
                                      

                                   
                                      
                                      </CardBody>
                                      </Card>
                                      
                                      </Col>


                                      <Col>
                                      <Card>
                                    <CardBody>


                                    {this.state.pro?

<>
                                      <h4>Fill Details</h4>

                                <Row>

                                      
                                        <Col >
                                      
                                        <AvField name="CustomerTypeId"   label="Customer Type" value={this.state.formData.CustomerTypeId === null ? '-1'   : this.state.formData.CustomerTypeId} onChange={(e) => {
                                              Fn_ChangeStateValue(this.obj, 'CustomerTypeId', e.target.value);
                                            
                                            }}  type="select" className="form-select" >
                                               <option value={-1} defaultValue label={"Select"} />
                                            <option value={1}  label={"Salaried"} />
                                            <option value={2}  label={"Self Employed including Professional"} />
                                            <option value={3}  label={"Farmer"} />
                                            <option value={4}  label={"Housewife"} />
                                           
                                          </AvField>
                                        </Col>

                                        </Row>

                                        <Row>


                                        <Col >
                                      
                                        <AvField name="SourceIncomeId"   label="Income Source" value={this.state.formData.SourceIncomeId === null ? '-1'   : this.state.formData.SourceIncomeId} onChange={(e) => {
                                              Fn_ChangeStateValue(this.obj, 'SourceIncomeId', e.target.value);
                                            
                                            }}  type="select" className="form-select" >
                                               <option value={-1} defaultValue label={"Select"} />
                                            <option value={1}  label={"Government"} />
                                            <option value={2}  label={"Public sector"} />
                                            <option value={3}  label={"Private Sector"} />
                                            <option value={4}  label={"Business"} />
                                            <option value={5}  label={"Agriculture"} />
                                            <option value={6}  label={"Dependent"} />
                                           
                                          </AvField>
                                        </Col>




                                        </Row>





                                        <Row>


                                       
                                        <Col >

                                        <AvField name="TransactionTypeId"   label="Transaction Type" value={this.state.formData.TransactionTypeId === null ? '-1'   : this.state.formData.TransactionTypeId} onChange={(e) => {
                                              Fn_ChangeStateValue(this.obj, 'TransactionTypeId', e.target.value);
                                            
                                            }}  type="select" className="form-select" >
                                               <option value={-1} defaultValue label={"Select"} />
                                            <option value={1}  label={"Rs. 0.00 lacs to Rs. 2.00 Lacs"} />
                                            <option value={2}  label={"Rs. 2.00 Lacs to Rs. 5 Lacs"} />
                                            <option value={3}  label={"Rs. 5 Lacs to Rs. 10 Lacs"} />
                                            <option value={4}  label={"More than Rs. 10 Lacs"} />
                                          
                                          </AvField>
                                        </Col>

                                        </Row>


                                        <Row>

                                          <Col>
                                          
                                          <button type="button" onClick={this.proceed} className="btn btn-info">Proceed</button> 
                                          </Col>


                                          </Row>



                                        

                                        </> : null} 

                                        


                                      </CardBody>
                                      </Card>
                                      
                                      </Col>


                                   
                                       

                                    </Row> 


      
                                     
                                    
                                
                                  </Col>
                                 
                                </Row>

                             
                            
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
export default compose(container)(pageAddEdit_IndoKYC);
