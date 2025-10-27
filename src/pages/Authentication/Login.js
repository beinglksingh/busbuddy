import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import { Col, Container, Row, Alert, Label, Card, CardBody } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  AvForm,
  AvField,
} from "availity-reactstrap-validation";
// import images
import logodark from "../../assets/images/logo.jpg";
import logolight from "../../assets/images/logo.jpg";
import CarouselPage from "./CarouselPage";
// actions
import { apiError, loginUser, socialLogin } from "../../store/actions";
import Loader from "pages/loader";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      prov: false,
      type: "password",
      loading: false,
      ipaddress: ''
    };
    this.obj = this;
   
    this.API_URL_SAVE = "UserLogin/0/token";
    this.pushFormName = "/persontoperson";
    this.show = this.show.bind(this);
  }

  componentDidMount() {
    this.props.apiError("");
    this.getip();
  }

  getip = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    this.setState({ ipaddress: res.data.ip });
  }

  signIn = (res, type) => {
    const { socialLogin } = this.props;
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        email: res.profileObj.email,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      };
      socialLogin(postData, this.props.history, type);
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        email: res.email,
        token: res.accessToken,
        idToken: res.tokenId,
      };
      socialLogin(postData, this.props.history, type);
    }
  };

  googleResponse = response => {
    this.signIn(response, "google");
  };

  twitterResponse = () => {};

  facebookResponse = response => {
    this.signIn(response, "facebook");
  };

  show() {
    if (this.state.type == "password") {
      this.setState({
        type: "text"
      });
    } else {
      this.setState({
        type: "password"
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          {this.state.loading ? <Loader /> : null}
          <MetaTags>
            <title>Login | BUSBUDDY</title>
          </MetaTags>
          
          <div className="min-vh-100 d-flex align-items-center" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative'
          }}>
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }}></div>
            
            <Container fluid>
              <Row className="justify-content-center">
                <Col xl={4} lg={5} md={6} sm={8}>
                  <Card className="border-0 shadow-lg" style={{
                    borderRadius: '20px',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}>
                    <CardBody className="p-5">
                      {/* Logo Section */}
                      <div className="text-center mb-4">
                        <Link to="dashboard" className="d-inline-block">
                          <img
                            src={logodark}
                            alt="BUSBUDDY"
                            height="80"
                            className="mb-3"
                            style={{ borderRadius: '15px' }}
                          />
                        </Link>
                        <h2 className="fw-bold text-dark mb-2">Welcome Back!</h2>
                        <p className="text-muted mb-0">Sign in to your account to continue</p>
                      </div>

                      {/* Error Alert */}
                      {this.props.error && this.props.error ? (
                        <Alert color="danger" className="border-0 rounded-3 mb-4" style={{
                          backgroundColor: '#fee',
                          border: '1px solid #fcc',
                          color: '#c33'
                        }}>
                          <i className="mdi mdi-alert-circle me-2"></i>
                          {this.props.error}
                        </Alert>
                      ) : null}

                      {/* Login Form */}
                      <Formik
                        enableReinitialize={true}
                        initialValues={{
                          email: (this.state && this.state.email) || "",
                          password: (this.state && this.state.password) || "",
                          ipaddress: this.state.ipaddress
                        }}
                        validationSchema={Yup.object().shape({
                          email: Yup.string().required("Please Enter Your Email"),
                          password: Yup.string().required("Please Enter Valid Password"),
                        })}
                        onSubmit={values => {
                          this.props.loginUser(values, this.props.history, this.state.ipaddress);
                        }}
                      >
                        {({ errors, status, touched }) => (
                          <Form>
                            {/* Email Field */}
                            <div className="mb-4">
                              <Label for="email" className="form-label fw-semibold text-dark">
                                Username
                              </Label>
                              <div className="position-relative">
                                <Field
                                  name="email"
                                  type="text"
                                  className={`form-control form-control-lg ${
                                    errors.email && touched.email ? "is-invalid" : ""
                                  }`}
                                  style={{
                                    borderRadius: '12px',
                                    border: '2px solid #e9ecef',
                                    padding: '12px 20px',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease'
                                  }}
                                  placeholder="Enter your Email"
                                />
                                <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                                  <i className="mdi mdi-account text-muted"></i>
                                </div>
                              </div>
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="invalid-feedback mt-2"
                              />
                            </div>

                            {/* Password Field */}
                            <div className="mb-4">
                              <Label for="password" className="form-label fw-semibold text-dark">
                                Password
                              </Label>
                              <div className="position-relative">
                                <Field
                                  name="password"
                                  type={this.state.type}
                                  autoComplete="true"
                                  className={`form-control form-control-lg ${
                                    errors.password && touched.password ? "is-invalid" : ""
                                  }`}
                                  style={{
                                    borderRadius: '12px',
                                    border: '2px solid #e9ecef',
                                    padding: '12px 20px',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease'
                                  }}
                                  placeholder="Enter your password"
                                />
                                <button
                                  className="btn position-absolute top-50 end-0 translate-middle-y pe-3"
                                  type="button"
                                  onClick={this.show}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#6c757d'
                                  }}
                                >
                                  <i className={`mdi ${this.state.type === 'password' ? 'mdi-eye-outline' : 'mdi-eye-off-outline'}`}></i>
                                </button>
                              </div>
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="invalid-feedback mt-2"
                              />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            {/* <div className="d-flex justify-content-between align-items-center mb-4">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="customControlInline"
                                  style={{ accentColor: '#dc3545' }}
                                />
                                <label
                                  className="form-check-label text-muted"
                                  htmlFor="customControlInline"
                                >
                                  Remember me
                                </label>
                              </div>
                              <Link
                                to="/forgot-password"
                                className="text-decoration-none"
                                style={{ color: '#dc3545' }}
                              >
                                Forgot password?
                              </Link>
                            </div> */}

                            {/* Login Button */}
                            <div className="d-grid mb-4">
                              <button
                                className="btn btn-lg fw-semibold text-white"
                                type="submit"
                                style={{
                                  backgroundColor: '#dc3545',
                                  border: 'none',
                                  borderRadius: '12px',
                                  padding: '15px',
                                  fontSize: '16px',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = '#c82333';
                                  e.target.style.transform = 'translateY(-2px)';
                                  e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = '#dc3545';
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)';
                                }}
                              >
                                <i className="mdi mdi-login me-2"></i>
                                Sign In
                              </button>
                            </div>

                          
                        

                           
                          </Form>
                        )}
                      </Formik>
                    </CardBody>
                  </Card>

                  {/* Footer */}
                  <div className="text-center mt-4">
                    <p className="text-white mb-0" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                      © {new Date().getFullYear()} BUSBUDDY. All rights reserved.
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  apiError: PropTypes.any,
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
  socialLogin: PropTypes.func,
};

const mapStateToProps = state => {
  const { error } = state.Login;
  return { error };
};

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError, socialLogin })(Login)
);

