import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button
} from "reactstrap";

import SweetAlert from "react-bootstrap-sweetalert";
import { AvForm, AvField } from "availity-reactstrap-validation";

// Constants
import { API_WEB_URLS } from "../../constants/constAPI";

// Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_AddEditAwait, Fn_AddEditData } from "store/functions";
import Breadcrumbs from "components/Common/Breadcrumb";
import { callGet_Data } from "store/common-actions";

class AddEdit_Remitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      success_msg: false, // For showing success message
    };

    this.obj = this;
    this.formTitle = "Mobile Number Entry";
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.RemitterNoCheck + "/0/token";
    this.pushFormName = "/masters-mobileentry";

    // Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.handleMobileNoChange = this.handleMobileNoChange.bind(this);
    this.CaptureAvdm = this.CaptureAvdm.bind(this);
    this.discoverAvdm = this.discoverAvdm.bind(this);
    this.continueRemitterRegistration = this.continueRemitterRegistration.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
    } else {
      this.setState({ id: 0 });
    }
  }
 parseXmlString(xmlString) {
    try {
        // Parse the XML string
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");

        // Extract the data
        const resp = xmlDoc.getElementsByTagName("Resp")[0];
        const deviceInfo = xmlDoc.getElementsByTagName("DeviceInfo")[0];
        const skey = xmlDoc.getElementsByTagName("Skey")[0];
        const hmac = xmlDoc.getElementsByTagName("Hmac")[0];
        const data = xmlDoc.getElementsByTagName("Data")[0];

        // Extract attributes and values
        const respData = {
            errCode: resp.getAttribute("errCode"),
            errInfo: resp.getAttribute("errInfo"),
            fCount: resp.getAttribute("fCount"),
            fType: resp.getAttribute("fType"),
            nmPoints: resp.getAttribute("nmPoints"),
            qScore: resp.getAttribute("qScore"),
        };

        const deviceInfoData = {
            dpId: deviceInfo.getAttribute("dpId"),
            rdsId: deviceInfo.getAttribute("rdsId"),
            rdsVer: deviceInfo.getAttribute("rdsVer"),
            mi: deviceInfo.getAttribute("mi"),
            mc: deviceInfo.getAttribute("mc"),
        };

        const additionalInfo = Array.from(deviceInfo.getElementsByTagName("Param")).map((param) => ({
            name: param.getAttribute("name"),
            value: param.getAttribute("value"),
        }));

        const skeyData = {
            ci: skey.getAttribute("ci"),
            value: skey.textContent,
        };

        const hmacData = hmac.textContent;

        const dataContent = {
            type: data.getAttribute("type"),
            value: data.textContent,
        };

        // Consolidate the extracted data
        const result = {
            respData,
            deviceInfoData,
            additionalInfo,
            skeyData,
            hmacData,
            dataContent,
        };

        console.log(result);
        return result;
    } catch (error) {
        console.error("Error parsing XML:", error);
    }
}
  CaptureAvdm() {


    var DString = '';
    var device = "mantra";

    var xmlString = "";


    var strWadh = "";
    var strOtp = "";




    var XML = '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="10000" posh="UNKNOWN" env="P" /> ' + DString + '<CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';


    var finUrl = this.state.finalUrl;


    var verb = "CAPTURE";


    var err = "";

    var res;
    $.support.cors = true;
    var httpStaus = false;
    var jsonstr = "";
    alert('Please Put Finger on Device!')
    $.ajax({

      type: "CAPTURE",
      async: false,
      crossDomain: true,
      url: finUrl,
      data: XML,
      contentType: "text/xml; charset=utf-8",
      processData: false,
      success: function (data) {


        if (device == "morpho") {
          xmlString = (new XMLSerializer()).serializeToString(data);  //morpho
        } else if (device == "mantra") {
          xmlString = data;  //mantra
        } else if (device == "secugen") {
          xmlString = (new XMLSerializer()).serializeToString(data);  //secugen
        } else if (device == "precision") {
          xmlString = (new XMLSerializer()).serializeToString(data);  //precision
        } else if (device == "startek") {
          xmlString = (new XMLSerializer()).serializeToString(data);  //startek
        } else if (device == "nextrd") {
          xmlString = (new XMLSerializer()).serializeToString(data);  //next rd
        }
        httpStaus = true;
        res = { httpStaus: httpStaus, data: xmlString };



        var $doc = data;
        var Message = $($doc).find('Resp').attr('errInfo');
        var errorcode = $($doc).find('Resp').attr('errCode');
        if (errorcode == 0) {

          console.log(xmlString);

          var $doc = $.parseXML(data);
          var Message = $($doc).find('Resp').attr('errInfo');


          alert(Message);

        } else {
          // $('#loaderbala').css("display","none");
          xmlString = '';
          alert('Capture Failed');
          //window.location.reload();
        }

      },
      error: function (jqXHR, ajaxOptions, thrownError) {
        xmlString = '';
        //$('#txtPidOptions').val(XML);
        alert(thrownError);
        res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
      },
    });
    // console.log('xmlString',xmlString)
    this.setState({ fingerprint: xmlString });


    console.log(this.parseXmlString(xmlString))

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
      console.log(finalUrl)
      this.setState({finalUrl : finalUrl});
      
  }
  continueRemitterRegistration (){
    this.discoverAvdm()

  } 
 async handleMobileNoChange  (event) {
    const mobileNo = event.target.value;

    // If MobileNo has 10 digits, trigger the API call
    if (mobileNo.length === 10) {
      let vformData = new FormData();
      vformData.append("Number", mobileNo);

      const response = await Fn_AddEditAwait(
        this.obj,
        { arguList: { id: 0, formData: vformData } },
        this.API_URL_SAVE,
        "#",
        true,
        ""
      );
      if(response.data){
        this.setState({
          Messgae : response.data.message,
          IsNumberCheck : true
        })
      }
    }

    // Update state with the new MobileNo value
    this.setState({
      formData: {
        ...this.state.formData,
        MobileNo: mobileNo,
      },
    });
  }

  btnSave_onClick(event, formData) {
    // Save functionality if needed
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    vformData.append("MobileNo", formData.MobileNo);

    Fn_AddEditData(
      this.obj,
      { arguList: { id: 0, formData: vformData } },
      this.API_URL_SAVE,
      "#",
      true,
      ""
    );
  }

  btnCancel_onClick = (event) => {
    event.preventDefault();
    this.props.history.push(this.pushFormName);
  };

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
                    <div className="wizard clearfix">
                      <div className="content clearfix">
                        <AvForm
                          className="needs-validation"
                          onValidSubmit={this.btnSave_onClick}
                        >
                          <Row>
                            <Col lg="6">
                              <Card>
                                <CardBody>
                                  {/* MobileNo Field */}
                                  <Row>
                                    <Col sm="4" className="mb-3">
                                      <label
                                        htmlFor="mobileNo"
                                        className="col-form-label"
                                      >
                                        Mobile No
                                      </label>
                                    </Col>
                                    <Col sm="6">
                                      <AvField
                                        name="MobileNo"
                                        value={
                                          this.state.formData.MobileNo ===
                                            null
                                            ? ""
                                            : this.state.formData.MobileNo
                                        }
                                        placeholder="Enter Mobile Number"
                                        errorMessage="Enter Mobile Number"
                                        validate={{
                                          required: { value: true },
                                          pattern: {
                                            value:
                                              /^[0-9]{10}$/, // For 10-digit number
                                            errorMessage: "Invalid Mobile Number",
                                          },
                                        }}
                                        type="text"
                                        className="form-control"
                                        onChange={this.handleMobileNoChange} // Handle onChange event
                                      />
                                    </Col>
                                  </Row>
                                  <Row>
                                    {/* <Col sm="4" className="mb-3">
                                      <label
                                        htmlFor="mobileNo"
                                        className="col-form-label"
                                      >
                                        Mobile No
                                      </label>
                                    </Col> */}
                                    <Col sm="6">
                                    {this.state.IsNumberCheck ? <button type="button" onClick={this.continueRemitterRegistration} className="btn btn-info">Scan for AVDM</button> : "" }
                                    {this.state.finalUrl ? <button type="button" onClick={this.CaptureAvdm} className="btn btn-info">Scan for Finger</button> : "" }
                                      
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>

                          <div className="d-flex flex-wrap gap-2">
                            <Button
                              type="submit"
                              color="primary"
                              className="mr-1 waves-effect waves-light"
                            >
                              Save
                            </Button>

                            <Button
                              type="button"
                              color="secondary"
                              className="waves-effect"
                              onClick={this.btnCancel_onClick}
                            >
                              Cancel
                            </Button>

                            {this.state.success_msg ? (
                              <SweetAlert
                                title="Mobile Number Saved Successfully!"
                                success
                                confirmBtnBsStyle="success"
                                onConfirm={() =>
                                  this.setState({ success_msg: false })
                                }
                              >
                                You clicked the button!
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

export default compose(container)(AddEdit_Remitter);
