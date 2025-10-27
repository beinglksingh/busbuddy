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
  UncontrolledTooltip
} from "reactstrap";
import Switch from "react-switch"
import classnames from "classnames";
import SweetAlert from "react-bootstrap-sweetalert"
import Select from "react-select";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
// Redux
import { withRouter, Link } from "react-router-dom";




// Editable
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory from "react-bootstrap-table2-editor"
// availity-reactstrap-validation
import {
  AvForm,
  AvField,AvRadioGroup,AvRadio
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";

import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_ChangeStateValue } from "../../store/functions";

import speakeasy from 'speakeasy';
import Loader from "pages/loader";


export const DateString = (dd) =>{

let d1 =  dd.replace('-', '');
let d2 = d1.replace('-', '');


return d2;


}

export const todaydate =  ()=>{
  let today =  new Date();
  let yyyy   =  today.getFullYear();
  let mm =  today.getMonth() + 1;
  let dd  =  today.getDate();
   
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    let formattedToday = yyyy + '-'+mm+ '-'+dd;
  return formattedToday;
}


class pageAddEdit_MemberMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      activeTab: 1,
      passedSteps: [1],
      BrowseImage1 : '',
      BrowseImage2 : '',
      UserImage : '',
      //dropdowns
      
      gender: [],
      typeofRegCert: [],
      memberid : 0,

      aid : 0,
      Gender : 0,

      success_msg : false,
      kycprocess_msg : false,
      update_msg : false,

      isDistributor : false,
      isSDistributor : false,
      isMDistributor : false,
      iskycdone  : false,
      isAdmin : false,
      file : null,
      loading : false

    };
    this.toggleTab.bind(this);
    this.obj = this;
    this.formTitle = "Member";
    this.breadCrumbTitle = "Member";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/MemberEdit";
    this.API_URL_SAVE = API_WEB_URLS.MEMBERMASTER + "/0/token";
    this.pushFormName = "/masters-membermaster";
    this.rtPage_Redirect = "/masters-membermaster";
    this.rtPage_Logout = "/logout";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.syno  =  this.syno.bind(this);
    this.kycsyno  =  this.kycsyno.bind(this);
    this.handleFileUpload  =  this.handleFileUpload.bind(this);

  }

  handleFileUpload = (event) => {
    this.setState({ file: event.target.files[0] });
  };


 





  componentDidMount() {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    this.setState({ name: obj.username, email: obj.email, aid: obj.uid , role:obj.role, isAdmin : obj.isAdmin  });

    if(obj.isAdmin  == false && obj.IsVerified  ==  2)
   {
      this.setState({iskycdone : true})
    }


    // Filling DropDowns
    
    Fn_FillListData(this.obj, "gender", API_WEB_URLS.MASTER + "/0/token/Gender/Id/0");
    // Fn_FillListData(this.obj, "state", API_WEB_URLS.MASTER + "/0/token/StateMaster/Id/0");
    // Fn_FillListData(this.obj, "usertype", API_WEB_URLS.MASTER + "/0/token/UserType/Id/0");
    Fn_FillListData(this.obj, "planmaster", API_WEB_URLS.MASTER + "/0/token/PlanMaster/Id/0");
    // Fn_FillListData(this.obj, "relation", API_WEB_URLS.MASTER + "/0/token/Relationship/Id/0");
    
    
    const { id } = this.props.match.params;

    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
    
  }







DOBChange = (event)=> {

   var birth  =  new Date(event.target.value);
   birth = birth.getFullYear();

    var tod =  new Date();

    tod =  tod.getFullYear();

    var age = tod - birth;

    this.setState({ fo: age });

}


NomineeDOBChange = (event)=> {

  var birth  =  new Date(event.target.value);
  birth = birth.getFullYear();

   var tod =  new Date();

   tod =  tod.getFullYear();

   var age = tod - birth;

   this.setState({ foN: age });

}


onUserTypeChange  = (event)=> {
  this.setState({loading : true});
  //Retailer
  if (event.target.value == 4){
    Fn_FillListData(this.obj, "distributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/3");
    this.setState({ isDistributor: true });
  } 
  else {
    this.setState({ isDistributor: false });
  }
  //Distributor
  if (event.target.value == 3){
    Fn_FillListData(this.obj, "superdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/2");
    this.setState({ isSDistributor: true });
  } 
  else {
    this.setState({ isSDistributor: false });
  }
    //SuperDistributor
    if (event.target.value == 2){
      Fn_FillListData(this.obj, "masterdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/1");
      this.setState({ isMDistributor: true });
    } 
    else {
      this.setState({ isMDistributor: false , loading : false});
    }
  
}









btnSave_onClick(event, formData) {



  const obj = JSON.parse(sessionStorage.getItem("authUser"));
 

  this.setState({loaing : true});


  let vformData = new FormData();
  //Information
  vformData.append("Name", formData.Name);
  
  vformData.append("F_PlanMaster", formData.F_PlanMaster == undefined ? this.state.formData.F_PlanMaster : formData.F_PlanMaster);
  vformData.append("MobileNo", formData.MobileNo);
 

  vformData.append("PAN", formData.PAN);
  vformData.append("UID", formData.AadharNo == '' ? 0 : formData.AadharNo);
 
  vformData.append("Email", formData.Email);
  
  vformData.append("MembershipDate", DateString(formData.MembershipDate));


  //Address
 
  vformData.append("F_GenderMaster", formData.GenderId);
  vformData.append("ID_ImageURL_1.ImageFile", this.state.BrowseImage1);
  vformData.append("ID_ImageURL_1.ImageFileName", "dd1");
  vformData.append("ID_ImageURL_2.ImageFile", this.state.BrowseImage2);
  vformData.append("ID_ImageURL_2.ImageFileName", "dd2");
  vformData.append("ID_UserImage_1.ImageFile", this.state.UserImage);
  vformData.append("ID_UserImage_1.ImageFileName", "dd3");

  
  



  Fn_AddEditData(this.obj, { arguList: { id: this.state.id, formData: vformData } }, this.API_URL_SAVE, "#", true , "kuku" , "update_msg");




    
}

syno () {
  this.setState({success_msg : false ,update_msg : false})

  this.props.history.push(`${this.rtPage_Redirect}`, {});
}
kycsyno () {
  this.setState({kycprocess_msg : false});
  this.props.history.push(`${this.rtPage_Logout}`, {});
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
          passedSteps: modifiedSteps
        });
      }
    }
  }






  setvalue =(name , event) => {

   if(name == 'Phone')
   this.setState({MobileNo_SMS : event.target.value});
   else if (name ==  'StateId_Pres')
   this.setState({StateId_Pres : event.target.value});
   else if (name ==  'CityId_Pres')
   this.setState({CityId_Pres : event.target.value});
   else if (name ==  'Address_Residential')
   this.setState({Address_Residential : event.target.value});
   else if (name ==  'pin_Pres')
   this.setState({pin_Pres : event.target.value});
   else if (name ==  'Department') {
    const selectElement = event.target; // Get the select element
    const selectedOption = selectElement.options[selectElement.selectedIndex]; // Get the selected option
    const selectedOptionLabel = selectedOption.label; // Get the label of the selected option
   this.setState({DepartmentId : event.target.value});
   this.setState({DepartmentName : selectedOptionLabel});
   }
   else if (name ==  'Designation') {
    const selectElement = event.target; // Get the select element
    const selectedOption = selectElement.options[selectElement.selectedIndex]; // Get the selected option
    const selectedOptionLabel = selectedOption.label; // Get the label of the selected option
    
    this.setState({DesignationName : selectedOptionLabel});
    this.setState({DesignationId : event.target.value});

   }

  } 

 




  render() {

   





 



   

    
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
                              <span className="number">1.</span> Personal
                              Information
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
  Identity Documentation
</NavLink>
                            
                          </NavItem>
                         
                        </ul>
                      </div>
                      <div className="content clearfix">
                        <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                          <TabContent activeTab={this.state.activeTab} className="body">
                            <TabPane tabId={1}>
                                <Row>
                                  <Col lg="6">
                                  <Card>
                                    <CardBody>
                                      <h4 className="card-title mb-4">Information</h4>
                                     
                                      <Row>
                                        <Col sm="4">
                                          <label htmlFor="dateOfJoining" className="col-form-label">Membership Date</label>
                                        </Col>
                                        <Col sm="4" className="mb-0">
                                          <AvField name="MembershipDate" label="" value={this.state.formData.MembershipDate === null ? todaydate()   : todaydate()} placeholder="Enter MembershipDate"  type="date" disabled className="form-control" />
                                        </Col>  
                                      </Row>
                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="Name" className="col-form-label">Name</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="Name" label="" value={this.state.formData.Name === null ? ''   : this.state.formData.Name} placeholder="Enter  Name" disabled={this.state.iskycdone}  type="text" className="form-control" />
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="gender" className="col-form-label">Gender</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField onChange={this.checkfemale} name="GenderId" label="" value={this.state.formData.GenderId === null ? '-1'   : this.state.formData.GenderId} disabled={this.state.iskycdone} type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.gender
                                              ? this.state.gender.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> 
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="FatherName" className="col-form-label">Mobile No.</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="MobileNo" label="" value={this.state.formData.MobileNo === null ? 0   : this.state.formData.MobileNo} disabled={this.state.iskycdone} placeholder="Enter MobileNo"  type="number" className="form-control" />
                                        </Col>
                                      </Row>
                                    


                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="Religion" className="col-form-label">Email</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="Email" label="" value={this.state.formData.Email === null ? ''   : this.state.formData.Email} disabled={this.state.iskycdone} placeholder="Enter Email"  type="email" className="form-control" />
                                        </Col>
                                      </Row>

                                    
                                    </CardBody>
                                  </Card>
                                  </Col>


                                                <Col lg="6">
                                    <Card>
                                      <CardBody>
                                        <h4 className="card-title mb-4">Id Proof</h4>
                                        <Row>
                                          <Col sm="4" className="mb-3">
                                            <label htmlFor="Member_Introducer" className="col-form-label">Aadhar No.</label>
                                          </Col>
                                          <Col sm="6">
                                            <AvField name="AadharNo" label="" value={this.state.formData.AadharNo === null ? ''   : this.state.formData.AadharNo} disabled={this.state.iskycdone} placeholder="Enter AadharNo"  type="text" className="form-control" />
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col sm="4" className="mb-3">
                                            <label htmlFor="introducerNo" className="col-form-label">PAN</label>
                                          </Col>
                                          <Col sm="6">
                                            <AvField name="PAN" label="" value={this.state.formData.PAN === null ? ''   : this.state.formData.PAN} disabled={this.state.iskycdone} placeholder="Enter PAN"   type="text" className="form-control" />
                                          </Col>
                                        </Row>
                                      
                                        <Row>
                                          
                                        </Row>

                                        { this.state.isAdmin == true ?
                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="maritalStatus" className="col-form-label">Select Plan</label>
                                        </Col>
                                        <Col sm="6">
                                          <AvField name="F_PlanMaster"  label="" value={this.state.formData.F_PlanMaster === null ? '-1'   : this.state.formData.F_PlanMaster} disabled={this.state.isAdmin == true ? false : true}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.planmaster
                                              ? this.state.planmaster.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField>
                                        </Col> 
                                      </Row>: null
  }
                                      </CardBody>
                                    </Card>
                                  </Col>


                                  
                                
                                </Row>
                                





                            </TabPane>
                      
                            <TabPane tabId={2}>
                              <div>
                                  <Row>
                                    <Col lg="6">
                                        <Label for="basicpill-lastname-input2">
                                          Identity Confirmation
                                        </Label>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg="6">
                                    {/* <AvField name="IDDocumentTypeId_1" label="Type of Document" value={this.state.formData.IDDocumentTypeId_1 === null ? '-1'   : this.state.formData.IDDocumentTypeId_1}  type="select" className="form-select" >
                                      <option value={-1} defaultValue label={"Select"} />
                                      {this.state.typeofRegCert
                                        ? this.state.typeofRegCert.map(
                                            (option, key) => (
                                              <option key={option.Id} value={option.Id} label={option.Name} />
                                            )
                                          )
                                        : null}
                                    </AvField>
                                    </Col>
                                    <Col lg="6">
                                    <AvField name="ID_DocNo_1" label="Document No." value={this.state.formData.ID_DocNo_1 === undefined ? ''   : this.state.formData.ID_DocNo_1} placeholder="Enter Document No." type="text" className="form-control" />
                                    </Col>
                                    <Col lg="6">
                                    <img height="150" className="rounded me-2" alt={"image"} width="200" src={this.state.formData.ID_ImageURL_1_Thumbnail} />
                                    
                                     */}
                                    <AvField name="BrowseImage1" value='' label="Aadhar Front" placeholder="Upload File" errorMessage="Upload File" required ={this.state.isAdmin ?false : true} onChange={(e) => Fn_ChangeStateValue(this.obj, 'BrowseImage1', e.target.files[0])}  accept=".gif,.jpg,.jpeg,.png" type="file" className="form-control" />
                                    </Col>
                                  </Row>
                                  <Row>
                                    {/* <Col lg="6">
                                    <AvField name="IDDocumentTypeId_2" label="Type of Document" value={this.state.formData.IDDocumentTypeId_2 === null ? '-1'   : this.state.formData.IDDocumentTypeId_2}    type="select" className="form-select" >
                                      <option value={-1} defaultValue label={"Select"} />
                                      {this.state.typeofRegCert
                                        ? this.state.typeofRegCert.map(
                                            (option, key) => (
                                              <option key={option.Id} value={option.Id} label={option.Name} />
                                            )
                                          )
                                        : null}
                                    </AvField>
                                    </Col> */}
                                    <Col lg="6">
                                    {/* <AvField name="ID_DocNo_2" label="Document No." value={this.state.formData.ID_DocNo_2 === undefined ? ''   : this.state.formData.ID_DocNo_2} placeholder="Enter Document No."  type="text" className="form-control" />
                                    </Col>
                                    <Col lg="6">
                                    <img height="150" className="rounded me-2" alt={"image"} width="200" src={this.state.formData.ID_ImageURL_2_Thumbnail} /> */}

                                    <AvField name="BrowseImage2" value='' label="Aadhar Back" placeholder="Upload File" errorMessage="Upload File" required ={this.state.isAdmin ?false : true} onChange={(e) => Fn_ChangeStateValue(this.obj, 'BrowseImage2', e.target.files[0])} accept=".gif,.jpg,.jpeg,.png" type="file" className="form-control" />

                                    
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg="6">
                                    {/* <img height="150" className="rounded me-2" alt={"image"} width="200" src={this.state.formData.ImageURL_Member_Thumbnail} /> */}
                                    <AvField name="UserImage" value='' label="PAN" placeholder="Upload File" errorMessage="Upload File" required ={this.state.isAdmin ?false : true} onChange={(e) => Fn_ChangeStateValue(this.obj, 'UserImage', e.target.files[0])} accept=".gif,.jpg,.jpeg,.png" type="file" className="form-control" />
                                    </Col>
                                  </Row>
                              </div>
                            </TabPane>
                          </TabContent>
                          <div>
                            {this.state.iskycdone == false ? (
                          <Button
                          type="submit"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          Save
                        </Button>) : null
  }

                        {this.state.success_msg ? (
                      <SweetAlert
                        title="Member Saved Successfully!"
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        You clicked the button!
                      </SweetAlert>
                    ) : null}

{this.state.update_msg ? (
                      <SweetAlert
                        title="Member Updated Successfully!"
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        You clicked the button!
                      </SweetAlert>
                    ) : null}

{this.state.kycprocess_msg ? (
                      <SweetAlert
                        title="KYC Update Successfully!"
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.kycsyno}
                        
                      >
                        We will let you know after review.!
                      </SweetAlert>
                    ) : null}
                          </div>
                        </AvForm>
                      </div>
                      <div className="actions clearfix">
                        <ul>

                      
                          <li
                            className={
                              this.state.activeTab === 1
                                ? "previous disabled"
                                : "previous"
                            }
                          >
                            <Link
                              to="#"
                              onClick={() => {
                                this.toggleTab(this.state.activeTab - 1);
                              }}
                            >
                              Previous
                            </Link>
                          </li>
                         
                          <li
                            className={
                              this.state.activeTab === 2
                                ? "next disabled"
                                : "next"
                            }
                          >
                            <Link
                              to="#"
                              onClick={() => {
                                this.toggleTab(this.state.activeTab + 1);
                              }}
                            >
                              Next
                            </Link>
                          </li>

                          <li
                            className={
                              this.state.activeTab === 1
                                ? "save disabled"
                                : "save"
                            }
                          >
                        
                          </li>
                        </ul>
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
export default compose(container)(pageAddEdit_MemberMaster);
