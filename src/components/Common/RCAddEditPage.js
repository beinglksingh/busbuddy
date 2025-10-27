import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardSubtitle, Button } from "reactstrap";
import PropTypes from "prop-types"
// Redux
import { withRouter, Link } from "react-router-dom";
// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class RCAddEditPage extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        {/* Render Breadcrumb */}
                        <Breadcrumbs title={this.props.breadCrumbTitle} breadcrumbItem={this.props.breadCrumbItem} />
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>
                                        <CardTitle>Basic Information</CardTitle>
                                        <CardSubtitle className="mb-3">Fill all information below</CardSubtitle>
                                            <AvForm onValidSubmit={this.props.btnSave_onClick(this.props.formData)}>
                                                {this.props.formBody(this.props.formData)}
                                                <Button type="submit" color="primary" className="mr-1 waves-effect waves-light">Save Changes</Button>
                                                <Button type="button" color="secondary" className="waves-effect" onClick={this.props.btnCancel_onClick()} >Cancel</Button>
                                            </AvForm>
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

RCAddEditPage.propTypes = {
    breadcrumbItem: PropTypes.string,
    formData: PropTypes.object,
    btnSave_onClick: PropTypes.func,
    btnCancel_onClick: PropTypes.func,
}
  
export default RCAddEditPage