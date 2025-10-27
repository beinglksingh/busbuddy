import PropTypes from "prop-types";
import React, { Component } from "react";
import { Alert, Card, CardBody, Col, Container, Label, Row,Button , FormGroup} from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// action
import { userForgetPassword } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";
import Loader from "pages/loader";
import { API_WEB_URLS } from "constants/constAPI";
import { API_HELPER } from "helpers/ApiHelper";
import { AvForm, AvField } from "availity-reactstrap-validation";
import AuthCode from "react-auth-code-input"

import speakeasy from 'speakeasy';


const aAndOrB = (value, ctx) => {
  if (ctx.newpassword != ctx.renewpassword) {
   
    return "Password doesn't match.";
  }
  return true;
}

class ForgetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      isValidUserName : false,
      errorMessage: "",
      type : "password",
      inputValue : '',
      isOTPChecked : false,
      fo : "",
      fo2 : "",
      formData: {},
      
     
    };
    this.obj   =  this;
    this.checkusername  = this.checkusername.bind(this);
    this.proceed  = this.proceed.bind(this);
    this.btnSave_onClick  = this.btnSave_onClick.bind(this);
  }

  checkusername  = async (values)=> {


    this.setState({loading: true, UserName : values.email});
    let vformData = new FormData();
    vformData.append("UserName", values.email);
    
    let AuthUser2 = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"CheckUserName/0/token" , vformData).then(token => { return token } )
    }
    let userToken2 = await AuthUser2();

    if (userToken2.data.responseId > 0){
          this.setState({isValidUserName : true, MainId : userToken2.data.responseId})
    }
    else {
      alert("Username doesn't exist");
    }
    this.setState({loading: false});
    
    

  }



  btnSave_onClick(event, formData) {

    const secret = speakeasy.generateSecret({name: 'RSEVA - '+ this.state.UserName});


      this.setState({loading : true});
    
        let vformData = new FormData();
        vformData.append("F_UserMaster", this.state.MainId);
        vformData.append("NewPassword", formData.renewpassword);
        vformData.append("Ascii", secret.ascii);
        vformData.append("base32", secret.base32);
        vformData.append("hex", secret.hex);
        vformData.append("otpauth_url", secret.otpauth_url);

       
    let ChangePass = function() {
      return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"ChangePasswordByForgot/0/token" , vformData).then(token => { return token } )
    }

    let checkotptoken =  ChangePass();
   

    checkotptoken.then(result => {
      this.setState({loading : false});
 
    if (result.data.response[0].Id > 0) {
      alert('Password Changed Succesfully!');
      this.props.history.push("/login");
    }
    else {
       alert ( "OTP Incorrect")
    }
  })
  this.setState({loading : false});

      
      
  }

  pass = (event)=> {

    let pass  =  event.target.value;
     
      this.setState({ fo: pass });
    
  }





  passmatch = (event)=> {

    let pass  =  event.target.value;


    if (this.state.fo != pass){
      this.form.validateInput('renewpassword');
    }

    else{

    }
     
      
    
  }


  
  proceed () {
    this.setState({loading : true});
    const { inputValue } = this.state;
    const obj = JSON.parse(sessionStorage.getItem("authUser1"));

   const MainId  =  this.state.MainId;

    let vformData = new FormData();

    vformData.append("Otp", inputValue);
    let CheckOtp = function() {
      return API_HELPER.apiPUT_Multipart(API_WEB_URLS.BASE+"CheckOtp/0/token/"+MainId , vformData).then(token => { return token } )
    }

    let checkotptoken =  CheckOtp();
   

   
   
    checkotptoken.then(result => {
      this.setState({loading : false});
 
    if (result.data.response[0].Id > 0) {
      this.setState({isOTPChecked : true});
    }
    else {
       alert ( "OTP Incorrect")
    }
  })


   
    

  

    
    // this.setState({ isCodeValid: isVerified });

  
  }


  render() {
    return (
      <React.Fragment>
        <div className="home-btn d-none d-sm-block">
        {this.state.loading ? <Loader /> : null}
          <Link to="/" className="text-dark">
            <i className="bx bx-home h2" />
          </Link>
        </div>
        <div className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="overflow-hidden">
                  <div className="bg-primary bg-soft">
                    <Row>
                      <Col className="col-7">
                        <div className="text-primary p-4">
                          <h5 className="text-primary">Welcome Back !</h5>
                          <p>Sign in to continue to Skote.</p>
                        </div>
                      </Col>
                      <Col className="col-5 align-self-end">
                        <img src={profile} alt="" className="img-fluid" />
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div>
                      <Link to="/">
                        <div className="avatar-md profile-user-wid mb-4">
                          <span className="avatar-title rounded-circle bg-light">
                            <img
                              src={logo}
                              alt=""
                              className="rounded-circle"
                              height="34"
                            />
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-2">
                      {this.props.forgetError && this.props.forgetError ? (
                        <Alert color="danger" style={{ marginTop: "13px" }}>
                          {this.props.forgetError}
                        </Alert>
                      ) : null}
                      {this.props.forgetSuccessMsg ? (
                        <Alert color="success" style={{ marginTop: "13px" }}>
                          {this.props.forgetSuccessMsg}
                        </Alert>
                      ) : null}
                     {this.state.isValidUserName == false ?
                      <Formik
                        enableReinitialize={true}
                        initialValues={{
                          email:
                            (this.state && this.state.email) || "",
                        }}
                        validationSchema={Yup.object().shape({
                          email: Yup.string().required(
                            "Please Enter Your UserName"
                          ),
                        })}

                        onSubmit={values => {
                          this.checkusername(values);
                          //this.props.userForgetPassword(values, this.props.history);
                        }}
                      >
                        {({ errors, status, touched }) => (
                          <Form className="form-horizontal">
                            <div className="mb-3">
                              <Label for="email" className="form-label">
                                UserName
                              </Label>
                              <Field
                                name="email"
                                type="text"
                                className={
                                  "form-control" +
                                  (errors.email && touched.email
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="invalid-feedback"
                              />
                                
                                
                            </div>
                            <div className="text-end">
                              <button
                                className="btn btn-primary w-md"
                                type="submit"
                              >
                                proceed
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                      : 
                      
                      this.state.isOTPChecked == false ?
                      
                     
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
                      </Row>
                    
                    
                  : 
                  <>
                     <AvForm ref={c => (this.form = c)} className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                         
                  <Row>

                                    <Col sm="4">
                                          <label htmlFor="membershipType" className="col-form-label">New Password</label>
                                        </Col>
                                <Col lg="8">


                                <AvField name="newpassword" onChange={this.pass}   value={this.state.formData.newpassword} placeholder="New Password" errorMessage="Enter New Password"  type="password"  className="form-control" />
                                  </Col>
                                     </Row>
                                 

                                        <Row>

                                    <Col sm="4">
                                          <label htmlFor="membershipType" className="col-form-label">Re-enter New Password</label>
                                        </Col>
                                <Col lg="8">


                                <AvField name="renewpassword" onChange={this.passmatch} validate={{myValidation: aAndOrB}}    value={this.state.formData.renewpassword} placeholder="re- enter New Password" errorMessage="Password doesn't match."  type="password"  className="form-control" />
                                  </Col>
                                     </Row>
                                     <Row>
                                     <div className="d-flex flex-wrap gap-2">
                            <Button type="submit" color="primary">
                              Submit
                            </Button>{" "}
                            </div>
                            </Row>
                  </AvForm>
                                     </>
                  
                  
                  }
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
                  <p>
                    Go back to{" "}
                    <Link to="login" className="fw-medium text-primary">
                      Login
                    </Link>{" "}
                  </p>
                  {/* <p>
                    © {new Date().getFullYear()} Skote. Crafted with{" "}
                    <i className="mdi mdi-heart text-danger" /> by Themesbrand
                  </p> */}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ForgetPasswordPage.propTypes = {
  forgetError: PropTypes.func,
  forgetSuccessMsg: PropTypes.string,
  history: PropTypes.object,
  userForgetPassword: PropTypes.any,
};

const mapStateToProps = state => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword;
  return { forgetError, forgetSuccessMsg };
};

export default withRouter(
  connect(mapStateToProps, { userForgetPassword })(ForgetPasswordPage)
);