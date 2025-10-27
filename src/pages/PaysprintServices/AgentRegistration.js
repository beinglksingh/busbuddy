import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

// Constants
import { API_WEB_URLS } from "../../constants/constAPI";

// Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_AddEditAwait, Fn_AddEditData, Fn_DisplayData, Fn_DisplayDataNew } from "store/functions";
import Breadcrumbs from "components/Common/Breadcrumb";
import { callGet_Data } from "store/common-actions";

class AgentRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      isAgentRegistration: true,
    };
    this.obj = this;
    this.API_URL_SAVE = API_WEB_URLS.AgentRegistration + "/0/token";
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/GetPPIAgentData";
    // Event Binding
    this.handleToggleChange = this.handleToggleChange.bind(this);
  }

  async componentDidMount() {
    // Reset form data when component mounts
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    const response = await Fn_DisplayDataNew(this.obj, this.state.id, this.API_URL + "/"+obj.username);
    const formData = response.data.dataList[0];
    
    // Convert all values to strings
    const stringifiedFormData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = formData[key]?.toString() || ""; // Convert to string, handle null/undefined
      return acc;
    }, {});

    const jsonString = JSON.stringify(stringifiedFormData);
    
    try {
      const response = await fetch(API_WEB_URLS.BASE+"AgentRegistration/AgentRegistration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      });

      if (response.ok) {
        const data = await response.json();
        let obj = JSON.parse(data.data);
        if (obj.response_code == 2 || obj.response_code == 1) {

          // this.setState({ success_msg: true, message: JSON.parse(data.data) });
          if (obj.response_code == 1) {
            window.location.href = '/dashboard';
          } else if (obj.response_code == 2) {
            this.generateUrl();
            
          }
        }
      } else {
        console.error("Failed to save data:", response.statusText);
      }
    } catch (error) {
      console.error("Error in saving data:", error);
    }
  }

  handleToggleChange(event) {
    this.setState({ isAgentRegistration: event.target.checked });
  }



  async generateUrl() {
    const { formData } = this.state;
    const jsonObj = { merchant_code: formData.merchant_code };

    try {
      // Step 1: Fetch the URL and encrypted data
      const response = await fetch(API_WEB_URLS.BASE+"GenerateUrl/AgentRegistration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonObj),
      });

      if (response.ok) {
        const data = await response.json();
        let parsedObj = JSON.parse(data.data);

        if (parsedObj.response_code === 1) {
          const { url, encdata } = parsedObj.data;
          
          if (url && encdata) {
            // Create and submit form programmatically
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = url;

            const encdataInput = document.createElement('input');
            encdataInput.type = 'hidden';
            encdataInput.name = 'encdata';
            encdataInput.value = encdata;

            form.appendChild(encdataInput);
            document.body.appendChild(form);
            form.submit();
          } else {
            console.error("URL or encdata is missing");
          }
        } else {
          console.error("Failed to generate valid URL:", parsedObj.message);
        }
      } else {
        console.error("Failed to generate URL:", response.statusText);
      }
    } catch (error) {
      console.error("Error generating URL or submitting data to .NET API:", error);
    }

  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
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

export default compose(container)(AgentRegistration);
