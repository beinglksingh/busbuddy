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
  TabPane
} from "reactstrap";


import SweetAlert from "react-bootstrap-sweetalert"
import  Switch  from "react-switch";

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
import { Fn_DisplayData, Fn_AddEditData , Fn_FillListData, Fn_GetReport} from "../../store/functions";

class pageAddEdit_MemberService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      IsAEPS : false,
      IsDMR : false,
      IsIndoNepal: false,
      IsRecharge : false
    };
    this.obj = this;
    this.formTitle = "Member Service";
    this.breadCrumbTitle = "Masters";
    this.breadCrumbItem = "Add " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.UPDATEMEMBERSERVICE + "/0/token";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.syno =  this.syno.bind(this);
    this.searchmember  = this.searchmember.bind(this);
    this.getvalues =  this.getvalues.bind(this);
  }
  componentDidMount() {
    
    
    
  }


  searchmember (event) {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    vformData.append("Search", event.target.value);
    Fn_GetReport(this.obj, { arguList: { id: obj.uid, formData: vformData } }, "SearchMember/0/token", "memberlist", true);
  }


  getvalues(event) {


    const foundItem = this.state.memberlist.find(item => item.Id == event.target.value);

    if (foundItem){
    this.setState({
      IsAEPS : foundItem.IsAEPS,
      IsDMR : foundItem.IsDMR,
      IsRecharge : foundItem.IsRecharge,
      IsIndoNepal : foundItem.IsIndoNepal
    })
  }

  else {

    this.setState({
      IsAEPS : false,
      IsDMR : false,
      IsRecharge : false,
      IsIndoNepal : false
    })

  }

  }



  btnSave_onClick(event, formData) {
   


      Fn_AddEditData(
        this.obj,
        { arguList: 
          { id: 0,
            f_MemberMaster: formData.F_MemberMaster ,
            isAEPS : this.state.IsAEPS ? true : false,
            isDMR : this.state.IsDMR ? true : false,
            isRecharge : this.state.IsRecharge? true : false,
            isIndoNepal : this.state.IsIndoNepal ? true : false,
           
              } },
        this.API_URL_SAVE,
        "#",
        false,
        "serid"
      );
  



  }

  
syno () {
  this.setState({success_msg : false})
}

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };
  render() {

    const Offsymbolb = () => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: 12,
            color: "#fff",
            paddingRight: 2
          }}
        >
          {" "}
          OFF
        </div>
      )
    }
    
    
    const OnSymbolb = props => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: 12,
            color: "#fff",
            paddingRight: 2
          }}
        >
          {" "}
          ON
        </div>
      )
    }
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
                    {/* <h4 className="card-title mb-4">Basic Wizard</h4> */}
                    <div className="wizard clearfix">
                     
                      <div className="content clearfix">
                        <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                         
                                <Row>
                                  <Col lg="6">
                                  <Card>
                                    <CardBody>
                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="firstName" className="col-form-label">Search</label>
                                        </Col>
                                        <Col sm="6">
                                        <AvField name="Search" label="" value={this.state.Search === null ? ''   : this.state.Search} onChange={this.searchmember} placeholder="Enter Search" errorMessage="Enter " validate={{ required: { value: true } }}  type="text" className="form-control" />
                                        </Col>
                                      </Row>
                                      
                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Select Member</label>
                                        </Col>
                                        <Col sm="6">
                                        <AvField  name="F_MemberMaster" label="" value={this.state.formData.F_MemberMaster === null ? '-1'   : this.state.formData.F_MemberMaster} onChange={this.getvalues} type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.memberlist
                                              ? this.state.memberlist.map(
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
                                          <label htmlFor="middleName" className="col-form-label">DMR</label>
                                        </Col>
                                        <Col sm="6">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-12 mb-3"
                            offColor ="#ec4561"
                            onColor="#00ff00"
                            onChange={() =>
                              this.setState({ IsDMR: !this.state.IsDMR })
                            }
                            checked={this.state.IsDMR}
                          />
                                        </Col>
                                      </Row>



                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">IndoNepal</label>
                                        </Col>
                                        <Col sm="6">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-12 mb-3"
                            offColor ="#ec4561"
                            onColor="#00ff00"
                            onChange={() =>
                              this.setState({ IsIndoNepal: !this.state.IsIndoNepal })
                            }
                            checked={this.state.IsIndoNepal}
                          />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">AEPS</label>
                                        </Col>
                                        <Col sm="6">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-12 mb-3"
                            offColor ="#ec4561"
                            onColor="#00ff00"
                            onChange={() =>
                              this.setState({ IsAEPS: !this.state.IsAEPS })
                            }
                            checked={this.state.IsAEPS}
                          />
                                        </Col>
                                      </Row>


                                      <Row>
                                        <Col sm="4" className="mb-3">
                                          <label htmlFor="middleName" className="col-form-label">Recharge</label>
                                        </Col>
                                        <Col sm="6">
                                        <Switch
                            uncheckedIcon={<Offsymbolb />}
                            checkedIcon={<OnSymbolb />}
                            className="me-3 mb-lg-12 mb-3"
                            offColor ="#ec4561"
                            onColor="#00ff00"
                            onChange={() =>
                              this.setState({ IsRecharge: !this.state.IsRecharge })
                            }
                            checked={this.state.IsRecharge}
                          />
                                        </Col>
                                      </Row>

                                     
                                    
                                    
                                    </CardBody>
                                  </Card>
                                  </Col>
                                 
                                </Row>
                                <Row>
                                </Row>
                           
                                <div className="d-flex flex-wrap gap-2">
                          <Button
                          type="submit"
                          color="primary"
                          className="mr-1 waves-effect waves-light"
                        >
                          Update
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
                        title="Service updated Successfully!"
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
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
export default compose(container)(pageAddEdit_MemberService);
