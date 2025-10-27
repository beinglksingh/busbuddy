import React, { Component } from "react"
import CarouselPage from "./CarouselPage"
import MetaTags from 'react-meta-tags';

//Verification code package
import AuthCode from "react-auth-code-input"

// import images
//import logodark from "../../assets/images/logo-dark.png"
import logodark from "../../components/Print/printlogo.png"
import logolight from "../../assets/images/logo-light.png"
import { Button, Col, Form, FormGroup, Label, Row } from "reactstrap"

import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';
import { API_HELPER } from "helpers/ApiHelper";
import { API_WEB_URLS } from "../../constants/constAPI";
import SweetAlert from "react-bootstrap-sweetalert";
import Loader from "pages/loader";
import axios from "axios";

 class OTP extends Component {


  

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      prov : false,
      type : "password",
      inputValue : '',
      image: '',
      secret: '',
      validCode: '',
      isCodeValid: null,
      IsGoogleQrScanned : false,
      confirm_alert : true,
      loading : false,
      ipaddress : ''
    };
    this.obj = this;
    
    this.proceed  =  this.proceed.bind(this);
    this.redirect  = this.redirect.bind(this);
    this.sms  =  this.sms.bind(this);
    this.authenticator  =  this.authenticator.bind(this);
    this.getip  = this.getip.bind(this);
  }

  componentDidMount = async()=> {

      if(sessionStorage.getItem("authUser"))
      {
      this.props.history.push("/dashboard");
      }

      else {
        const obj = JSON.parse(sessionStorage.getItem("authUser1"));
   
      this.setState({IsGoogleQrScanned : obj.IsGoogleQrScanned})

      const secret  =  JSON.parse(localStorage.getItem("secret"));
      this.getip();
    
    // const secret = {
    //   ascii: '?:SD%oDD<E!^q^1N):??&QkeqRkhkpt&',
    //   base32: secretkey,
    //   hex: '3f3a5344256f44443c45215e715e314e293a3f3f26516b6571526b686b707426',
    //   otpauth_url:
    //     'otpauth://totp/RSEVA'+ '( ' + obj.email + ' )'+'?secret='+secretkey,
    // };


    const backupCodes = [];
    const hashedBackupCodes = [];
    // const randomCode = (Math.random() * 10000000000).toFixed();
    // console.log('randomCode -->', randomCode);

    for (let i = 0; i < 10; i++) {
      const randomCode = (Math.random() * 10000000000).toFixed();
      const encrypted = CryptoJS.AES.encrypt(
        randomCode,
        secret.base32
      ).toString();
      backupCodes.push(randomCode);
      hashedBackupCodes.push(encrypted);
    }

    console.log('backupCodes ----->', backupCodes);
    console.log('hashedBackupCodes ----->', hashedBackupCodes);

    // const encrypted = CryptoJS.AES.encrypt(randomCode, secret.base32).toString();
    // console.log('encrypted -->', encrypted)
    // var bytes  = CryptoJS.AES.decrypt(encrypted, secret.base32);
    // var originalText = bytes.toString(CryptoJS.enc.Utf8);
    // console.log('originalText --->', originalText);

    QRCode.toDataURL(secret.otpauth_url, (err, image_data) => {
      this.setState({ image: image_data, secret });
    });
  }
  }

  getCode = () => {
    const { base32, hex } = this.state.secret;
    const code = speakeasy.totp({
      secret: hex,
      encoding: 'hex',
      algorithm: 'sha1',
    });

    this.setState({ validCode: code });
  };


  redirect (){
    this.props.history.push("/dashboard");
  }

  getip = async()=> {
    
    const res = await axios.get("https://api.ipify.org/?format=json");
    this.setState({ipaddress : res.data.ip});
} 

 

  proceed () {
    this.setState({loading : true});
    const { inputValue, secret } = this.state;
    const { base32, hex } = secret;
    const isVerified = speakeasy.totp.verify({
      secret: hex,
      encoding: 'hex',
      token: inputValue,
      window: 1,
    });
    const obj = JSON.parse(sessionStorage.getItem("authUser1"));

    var Id =  0;

    let vformData = new FormData();

    vformData.append("Otp", inputValue);
    vformData.append("ipaddress", this.state.ipaddress);
    let CheckOtp = function() {
      return API_HELPER.apiPUT_Multipart(API_WEB_URLS.BASE+"CheckOtp/0/token/"+obj.uid , vformData).then(token => { return token } )
    }

    let checkotptoken =  CheckOtp();
   

   
   
    checkotptoken.then(result => {
        
      
      // "Some User token"
      this.setState({loading : false});
  
 
 
    if (result.data.response[0].Id > 0) {
      sessionStorage.setItem("authUser", JSON.stringify(obj))
      this.redirect()
     
  
    }
    
    else if(isVerified == true){
      let AuthUser = function() {
        return API_HELPER.apiPUT(API_WEB_URLS.BASE+"UpdateUserMaster/0/token/"+obj.uid , null).then(token => { return token } )
      }
      
      let userToken = AuthUser();
      console.log(userToken);

      sessionStorage.setItem("authUser", JSON.stringify(obj))
      this.redirect()
    
    }
    
    
    else {
    
       alert ( "OTP Incorrect")
    
    }
  })


   
    

  

    
    // this.setState({ isCodeValid: isVerified });

  
  }

  sms() {


    this.setState({confirm_alert : false, loading : true})

    const obj = JSON.parse(sessionStorage.getItem("authUser1"));
    let vformData = new FormData();

    vformData.append("F_AccountUsage", 1);
    let GetUrl = function() {
      return API_HELPER.apiPUT_Multipart(API_WEB_URLS.BASE+"GetSMSUrl/0/token/"+obj.uid , vformData).then(token => { return token } )
    }
    
    let userToken = GetUrl();
    userToken.then(function(result) {
      this.setState({ loading: false });
    
      let SendOtp = function() {
        return API_HELPER.apiGET_OTP(result.data.response[0].Url).then((token) => {
          return token;
        });
      }.bind(this);
    
      let res = SendOtp();
    }.bind(this)); 

  }


  authenticator () {
    this.setState({confirm_alert : false})
  }

 



  render() {
    const { image, validCode, isCodeValid ,IsGoogleQrScanned } = this.state;
    return (
      <React.Fragment>
        <div>
        {this.state.loading ? <Loader /> : null}
          <MetaTags>
            <title>Two Step Verification 2 | RSEVA - React Admin & Dashboard Template</title>
          </MetaTags>
          <div className="container-fluid p-0">
            <div className="row g-0">
              <CarouselPage />

              <Col xl={3}>
                <div  className="auth-full-page-content p-md-5 p-4">
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="mb-4 mb-md-5">
                        <Link to="dashboard" className="d-block auth-logo">
                          <img
                            src={logodark}
                            alt=""
                            height="120"
                            className="auth-logo-dark"
                          />
                          <img
                            src={logolight}
                            alt=""
                            height="18"
                            className="auth-logo-light"
                          />
                        </Link>
                      </div>
                      <div className="my-auto">
                        <div className="text-center">
                          <div className="avatar-md mx-auto">
                            <div className="avatar-title rounded-circle bg-light">
                              <i className="bx bxs-envelope h1 mb-0 text-primary"></i>
                            </div>
                          </div>
                          <div className="p-2 mt-4">
                            <h4>Verify by  OTP / Authenticator</h4>
                            <p>
                              Please enter the 6 digit code 
                            </p>

                            {IsGoogleQrScanned == false ?   <img src={`${image}`} /> : null }

                          

                            <Form>
                              <Row>
                                <Col xs={12}>
                                  <FormGroup className="verification-2 mb-3">
                                    <Label
                                      htmlFor="digit1-input"
                                      className="visually-hidden"
                                    >
                                      Dight 1
                                    </Label>
                                    <AuthCode
                                      characters={6}
                                      onChange={(e) => this.setState({inputValue : e})}
                                      className="form-control form-control-lg text-center"
                                      allowedCharacters="^[0-9]"
                                      inputStyle={{
                                        width: "69px",
                                        height: "calc(1.5em + 1rem + 2px)",
                                        padding: ".5rem 1rem",
                                        borderRadius: "8px",
                                        fontSize: "1.01562rem",
                                        textAlign: "center",
                                        marginTop : "20px",
                                        marginRight: "15px",
                                        border: "1px solid #ced4da",
                                        textTransform: "uppercase",
                                        borderRadius: ".4rem"
                                      }}
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Form>
                            {this.state.confirm_alert ? (
                                                                <SweetAlert
                                                                    title="Select OTP Verify Type?"
                                                                    warning
                                                                    showCancel
                                                                    confirmBtnText="SMS"
                                                                    cancelBtnText="Google Authenticator"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="info"
                                                                    onConfirm={() =>this.sms()}
                                                                   onCancel={() =>this.authenticator()}
                                                                >
                                                                    
                                                                </SweetAlert>
                                                                ) : null}
                            <div >
                              <Button
                              onClick={this.proceed}
                              type="button"
                                //to="dashboard"
                                className="btn btn-success w-md"
                              >
                                Confirm
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 mt-md-5 text-center">
                        <p className="mb-0">
                          © {new Date().getFullYear()} © rsevakendra.in.
                          <i className="mdi mdi-heart text-danger"></i> All rights Reserved
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  const { error } = state.Login;
  return { error };
};

export default withRouter(
  connect(mapStateToProps, { })(OTP)
);
