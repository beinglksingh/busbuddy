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
} from "reactstrap";

import classnames from "classnames";
import Select from "react-select";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
// Redux
import { withRouter, Link } from "react-router-dom";
// availity-reactstrap-validation
import {
  AvForm,
  AvField,
  AvCheckboxGroup,
  AvCheckbox,
  AvGroup,
  AvInput,
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData , Fn_ChangePassword } from "../../store/functions";
import { bind } from "lodash";

const aAndOrB = (value, ctx) => {
  if (ctx.newpassword != ctx.renewpassword) {
   
    return "Password doesn't match.";
  }
  return true;
}


class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      activeTab: 1,
      passedSteps: [1],
      //dropdowns
      Accountdetail: [
        {
          Name : ""
        }
      ],
      RecipentDetail: [
        {
          Name : ""
        }
      ],
      prov : false,
      maritalStatus: [],
      accounttypevalue: 0,
      bloodGroup: [],
      gender: [],
      education: [],
      profession: [],
      relationShip: [],
      nationality: [],
      typeofRegCert: [],
      accounttype : [],
      SAccountType :0,
      fo : "",
      fo2 : ""
    
      
     



    };

  
  
    this.toggleTab.bind(this);
    this.obj = this;
    this.formTitle = "Change Password";
    this.breadCrumbTitle = "Change Password";
    this.breadCrumbItem = this.formTitle;
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/Membership";
    this.API_URL_SAVE = API_WEB_URLS.ChangePassword + "/0/token";
    this.pushFormName = "/logout";
  

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
  }




  componentDidMount() {
    //Filling DropDowns
    


    const { id } = this.props.match.params;
    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
  }
  btnSave_onClick(event, formData) {


    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    

        let vformData = new FormData();
        
        vformData.append("F_UserMaster", obj.uid);
        vformData.append("OldPassword", formData.oldpassword);
        vformData.append("NewPassword", formData.renewpassword);
      
        Fn_ChangePassword(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, this.pushFormName, true);
        
    
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
        this.setState({
          activeTab: tab,
          passedSteps: modifiedSteps,
        });
      }
    }
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
                    <h4 className="card-title mb-4">Change Password</h4>
                    <div className="wizard clearfix">
                      <div className="content clearfix">
                            
                            <AvForm ref={c => (this.form = c)} className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                         
                                <Row>
                                  <Col lg="6">
                                  <Card>
                                    <CardBody>
                                   

                                    <Row>

                                    <Col sm="4">
                                          <label htmlFor="membershipType" className="col-form-label">Old Password</label>
                                        </Col>
                                <Col lg="6">


                                <AvField name="oldpassword"   value={this.state.formData.oldpassword} placeholder="Old Password" errorMessage="Enter Old Password"  type="password"  className="form-control" />
                                  </Col>
                                     </Row>


                                  <Row>

                                    <Col sm="4">
                                          <label htmlFor="membershipType" className="col-form-label">New Password</label>
                                        </Col>
                                <Col lg="6">


                                <AvField name="newpassword" onChange={this.pass}   value={this.state.formData.newpassword} placeholder="New Password" errorMessage="Enter New Password"  type="password"  className="form-control" />
                                  </Col>
                                     </Row>
                                 

                                        <Row>

                                    <Col sm="4">
                                          <label htmlFor="membershipType" className="col-form-label">Re-enter New Password</label>
                                        </Col>
                                <Col lg="6">


                                <AvField name="renewpassword" onChange={this.passmatch} validate={{myValidation: aAndOrB}}    value={this.state.formData.renewpassword} placeholder="re- enter New Password" errorMessage="Password doesn't match."  type="password"  className="form-control" />
                                  </Col>
                                     </Row>


                                   





                          <div className="d-flex flex-wrap gap-2">
                            <Button type="submit" color="primary">
                              Save
                            </Button>{" "}
                            <Button type="reset" color="secondary">
                              Cancel
                            </Button>
                          </div>

</CardBody>
                      </Card>
                    </Col>
                    
                      </Row>
                    
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
export default compose(container)(ChangePassword);
