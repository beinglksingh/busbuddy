import React, { Component } from "react"
import { Container, Row, Col, Input, Button, Card, CardBody, Table, Label, Badge, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types"
import {Progress} from 'reactstrap'

//SweetAlert
import SweetAlert from "react-bootstrap-sweetalert"

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import {
    AvForm,
    AvField,AvRadioGroup,AvRadio
  } from "availity-reactstrap-validation";

class RCDisplayPage extends Component {

    
    render() {
    // const [modal, confirm_alert] = useState('foo')
      return (
        <React.Fragment>
            {/* <div className="page-content"> */}
                <Container fluid>
                {this.props.Isbreadcrumb ? ( <Breadcrumbs title={this.props.breadCrumbTitle} breadcrumbItem={this.props.breadcrumbItem} />): null}
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardBody>
                                    {/* Search Container */}
                                    {this.props.isSearchBox || this.props.isAdd ? (
                                    <Row className="mb-2">
                                        {this.props.isSearchBox ? (
                                        <Col sm="4">
                                            <div className="search-box mr-2 mb-2 d-inline-block">
                                                <div className="position-relative">
                                                    <Input type="text" className="form-control" placeholder="Search..." />
                                                    <i className="bx bx-search-alt search-icon"></i>
                                                </div>
                                            </div>
                                        </Col>
                                        ):null}
                                        {this.props.isAdd ? (
                                        <Col sm="8">
                                            <div className="text-sm-right">
                                                <Button type="button" onClick={this.props.btnAdd_onClick} color="success" className="btn-rounded waves-effect waves-light mb-2 mr-2"><i className="mdi mdi-plus mr-1"></i> Add New</Button>
                                            </div>
                                        </Col>
                                        ):null}
                                    </Row>
                                    ):null}
                                    {/* Table Data */}
                                    <div className="table-responsive">
{this.props.isProgress ? (<Progress
                        value={100}
                        color="primary"
                        style={{ width: '100%' }}
                        animated
                      ></Progress>) : null}
                                    
                                        <Table className="table table-centered table-nowrap">
                                            <thead className="thead-light">
                                                <tr>
                                                    {this.props.isCheckBox ? (
                                                    <th style={{ width: "20px" }}>
                                                        <div className="custom-control custom-checkbox">
                                                            <Input type="checkbox" className="custom-control-input" id="chkAll" />
                                                            <Label className="custom-control-label" htmlFor="chkAll">&nbsp;</Label>
                                                        </div>
                                                    </th>
                                                    ):null}
                                                    {this.props.isSNo ? (
                                                    <th>S. No.</th>
                                                    ):null}
                                                    {this.props.gridHeader()}
                                                    {this.props.isViewDetails ? (
                                                    <th>View Details</th>
                                                    ):null}
                                                    {(this.props.isEdit ||  this.props.isDelete) ? (
                                                    <th>Action</th>
                                                    ):null}
                                                </tr>
                                            </thead>
                                            <tbody>
                                           
                                                {this.props.gridData ? (
                                                    this.props.gridData.map((formData, key) =>
                                                        <tr key={"rawData_" + key}>
                                                            {this.props.isCheckBox ? (
                                                            <td>
                                                                <div className="custom-control custom-checkbox">
                                                                    <Input type="checkbox" className="custom-control-input" id={formData.id} />
                                                                    <Label className="custom-control-label" htmlFor={formData.id}>&nbsp;</Label>
                                                                </div>
                                                            </td>
                                                            ):null}
                                                            {this.props.isSNo ? (
                                                            <td>{key+1}</td>
                                                            ):null}
                                                            {this.props.gridBody(formData)}
                                                            {this.props.isViewDetails ? (
                                                            <td>
                                                                <Button type="button" color="primary" className="btn-sm btn-rounded" onClick={() => this.props.togglemodal(this.props.obj,formData)}>
                                                                    View Details
                                                                </Button>
                                                            </td>
                                                            ):null}
                                                            {/* {(this.props.isEdit || this.props.isDelete) ? ( */}
                                                            <td>
                                                                <div className="d-flex gap-3">
                                                                {this.props.isEdit ? (
                                                                    <Link to="#" value={formData} className="mr-3 text-primary" onClick={() => this.props.togglemodal(this.props.obj,formData)}>
                                                                        <i className="mdi mdi-pencil font-size-18 mr-3" id="edittooltip"></i>
                                                                        <UncontrolledTooltip placement="top" target="edittooltip">
                                                                            Edit
                                                                        </UncontrolledTooltip >
                                                                    </Link>
                                                            
                                                                ):null}
                                                                {this.props.isEdit2 ? (
                                                                    <Link to="#" value={formData} className="mr-3 text-primary" onClick={() => this.props.btnEdit_onClick(formData)}>
                                                                        <i className="mdi mdi-pencil font-size-18 mr-3" id="edittooltip"></i>
                                                                        <UncontrolledTooltip placement="top" target="edittooltip">
                                                                            Edit
                                                                        </UncontrolledTooltip >
                                                                    </Link>
                                                            
                                                                ):null}
                                                                {this.props.isDelete ? (
                                                                    <Link to="#" value={formData} className="text-danger" onClick={() => this.props.toggleDeleteConfirm(this.props.obj,formData,true)} >
                                                                        <i className="mdi mdi-close font-size-18 mr-3" id="deletetooltip"></i>
                                                                        <UncontrolledTooltip placement="top" target="deletetooltip">
                                                                            Delete
                                                                        </UncontrolledTooltip >
                                                                    </Link>
                                                                ):null}
                                                                 {formData.IsApproved == false && formData.IsKYCReject == false ? (
                                                                    <Link to="#" value={formData} className="text-primary" onClick={() => this.props.toggleApproveConfirm(this.props.obj,formData,true)} >
                                                                        <i className="mdi mdi-check font-size-18 mr-3" id="checktooltip"></i>
                                                                        <UncontrolledTooltip placement="top" target="checktooltip">
                                                                            Check
                                                                        </UncontrolledTooltip >
                                                                    </Link>
                                                                ):null}

{
    this.props.islockshow ?(
        formData.IsActive == false ? (
            <Link to="#" value={formData} className="text-primary" onClick={() => this.props.btnUnLock_onClick(formData)} >
                <i className="mdi mdi-lock-outline font-size-18 mr-3" style={{color:'red'}} id="unlock"></i>
                <UncontrolledTooltip placement="top" target="unlock">
                    Unlock
                </UncontrolledTooltip >
            </Link>
        ): <Link to="#" value={formData} className="text-primary" onClick={() => this.props.btnLock_onClick(formData)} >
        <i className="mdi mdi-lock-open-outline font-size-18 mr-3" style={{color:'green'}} id="lock"></i>
        <UncontrolledTooltip placement="top" target="lock">
            lock
        </UncontrolledTooltip >
    </Link>
    ) : null
   
}
                                                                 {/* {formData.IsActive == false ? (
                                                                    <Link to="#" value={formData} className="text-primary" onClick={() => this.props.btnUnLock_onClick(formData)} >
                                                                        <i className="mdi mdi-lock-outline font-size-18 mr-3" style={{color:'red'}} id="checktooltip"></i>
                                                                        <UncontrolledTooltip placement="top" target="checktooltip">
                                                                            Unlock
                                                                        </UncontrolledTooltip >
                                                                    </Link>
                                                                ): <Link to="#" value={formData} className="text-primary" onClick={() => this.props.btnLock_onClick(formData)} >
                                                                <i className="mdi mdi-lock-open-outline font-size-18 mr-3" style={{color:'green'}} id="checktooltip"></i>
                                                                <UncontrolledTooltip placement="top" target="checktooltip">
                                                                    lock
                                                                </UncontrolledTooltip >
                                                            </Link>} */}
    


                                                                </div>
                                                            {/* </td>  */}
                                                                {this.props.confirm_alert ? (
                                                                <SweetAlert
                                                                    title="Are you sure?"
                                                                    warning
                                                                    showCancel
                                                                    confirmButtonText="Yes, delete it!"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="danger"
                                                                    onConfirm={() =>this.props.btnDelete_onClick(this.props.selectedFormData)}
                                                                    onCancel={() =>this.props.toggleDeleteConfirm(this.props.obj,formData,false)}
                                                                >
                                                                    You won`&apos`t be able to revert this!
                                                                </SweetAlert>
                                                                ) : null}


{this.props.confirm_alert_Approve ? (
                                                                <SweetAlert
                                                                    title="Are you sure?"
                                                                    warning
                                                                    showCancel
                                                                    confirmBtnText="Yes, Approve!"
                                                                    cancelBtnText ="Reject"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="danger"
                                                                    onConfirm={() =>this.props.btnApprove_onClick(this.props.selectedFormData)}
                                                                    onCancel={() =>this.props.btnReject_onClick(this.props.selectedFormData)}
                                                                >
                                                                    Do you really wanna approve ?
                                                                </SweetAlert>
                                                                ) : null}
                                                                {this.props.success_dlg ? (
                                                                  <SweetAlert
                                                                    success
                                                                    title={this.props.dynamic_title}
                                                                    onConfirm={() => this.props.toggleDeleteSuccess(this.props.obj,false)}
                                                                  >
                                                                    {this.props.dynamic_description}
                                                                  </SweetAlert>
                                                                ) : null}
                                                            {/* ):null} */}
                                                            </td>
                                                        </tr>
                                                    )
                                                ) : null
                                                }

                                            </tbody>
                                        </Table>
                                    </div>
                                    {/* Pagination */}
                                    {this.props.isPagination ? (
                                    <Pagination className="pagination pagination-rounded justify-content-end mb-2">
                                        <PaginationItem disabled>
                                            <PaginationLink previous href="#" />
                                        </PaginationItem>
                                        <PaginationItem active>
                                            <PaginationLink href="#">
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                    </Pagination>
                                    ):null}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            {/* </div> */}

        

        </React.Fragment>
      );
    }
}

RCDisplayPage.propTypes = {
    obj: PropTypes.object,
    selectedFormData: PropTypes.object,
    //
    breadCrumbTitle: PropTypes.string,
    breadcrumbItem: PropTypes.string,
    dynamic_title: PropTypes.string,
    dynamic_description: PropTypes.string,
    InTimeN : PropTypes.string,
    OutTimeN : PropTypes.string,
    gridData: PropTypes.array,
    gridHeader: PropTypes.func,
    gridBody: PropTypes.func,
    //
    Isbreadcrumb : PropTypes.bool,
    isOpenModal: PropTypes.bool,
  
    isSearchBox: PropTypes.bool,
    isAdd: PropTypes.bool,
    isEdit: PropTypes.bool,
    isEdit2 : PropTypes.bool,
    isDelete: PropTypes.bool,
    isCheckBox: PropTypes.bool,
    isSNo: PropTypes.bool,
    isViewDetails: PropTypes.bool,
    isProgress : PropTypes.bool,
    isPagination: PropTypes.bool,
    confirm_alert: PropTypes.bool,
    confirm_alert_Approve: PropTypes.bool,
    success_dlg: PropTypes.bool,
    IsApproved : PropTypes.bool,
    islockshow : PropTypes.bool,
    //
    modalTitle: PropTypes.string,
    modalBody: PropTypes.func,
    togglemodal: PropTypes.func,
    updateatt : PropTypes.func,
    toggleDeleteConfirm: PropTypes.func,
    toggleDeleteSuccess: PropTypes.func,
    toggleApproveConfirm : PropTypes.func,
    updateNEFT  : PropTypes.func,
    updateIMPS : PropTypes.func,
    //
    edit : PropTypes.func,
    btnAdd_onClick: PropTypes.func,
    btnEdit_onClick: PropTypes.func,
    btnDelete_onClick: PropTypes.func,
    btnApprove_onClick: PropTypes.func,
    btnReject_onClick: PropTypes.func,
    btnLock_onClick : PropTypes.func,
    btnUnLock_onClick : PropTypes.func,
    verify : PropTypes.func,
    pay_modal : PropTypes.func,
    showpass : PropTypes.func,
    tog_backdrop : PropTypes.func
}
  
export default RCDisplayPage