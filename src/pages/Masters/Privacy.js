import React, { Component } from "react";

//Import Breadcrumb
import RCDisplayPage from "../../components/Common/RCDisplayPage";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import {
  Fn_FillListData,
  togglemodal,
  toggleDeleteConfirm,
  toggleDeleteSuccess,
  Fn_DeleteData,
  toggleApproveConfirm,
  Fn_AddEditData
} from "../../store/functions";
import  Switch  from "react-switch";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import './datatables.scss';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';
import {
 
  Row,
  Col,
 
  Card,
  CardBody,
  Button
  
} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";




class Privacy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
     
      productData : []
    };
    this.obj = this;
    

    //Event Binding
  
    
  }
  componentDidMount() {
         
 
 
  }


  render() {



   

    
    return (
      <div className="page-content">
        <h1>Privacy Policy</h1>
        <p><strong>Effective Date:</strong> 18-Apr-2025</p>
        <p>
          Welcome to BusBuddy! Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our bus ticket booking services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We collect the following types of information when you use our services:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, phone number, email address, payment details.</li>
          <li><strong>Booking Information:</strong> Travel dates, bus details, seat preferences.</li>
          <li><strong>Device Information:</strong> IP address, browser type, operating system.</li>
          <li><strong>Location Data:</strong> To show relevant bus services.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul>
          <li>To process and manage your bus ticket bookings.</li>
          <li>To send booking confirmations and updates.</li>
          <li>To provide customer support and respond to inquiries.</li>
          <li>To improve our services and website experience.</li>
          <li>To comply with legal requirements.</li>
        </ul>

        <h2>3. Sharing of Information</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Bus operators and service providers to complete your booking.</li>
          <li>Payment processors to handle transactions securely.</li>
          <li>Law enforcement if required by law.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We implement security measures to protect your personal data from unauthorized access, alteration, or disclosure. However, no online transaction is 100% secure.</p>

        <h2>5. Cookies and Tracking Technologies</h2>
        <p>We use cookies to enhance user experience, track usage patterns, and improve services. You can manage cookie preferences in your browser settings.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access, update, or delete your personal information.</li>
          <li>Opt out of marketing communications.</li>
          <li>Request data portability.</li>
        </ul>

        <h2>7. Third-Party Links</h2>
        <p>Our website may contain links to third-party sites. We are not responsible for their privacy practices.</p>

        <h2>8. Changes to This Policy</h2>
        <p>We may update this policy from time to time. Please review it periodically.</p>

        <h2>9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, contact us at:</p>
        <p>Email: info@busbuddy.co.in</p>
        <p>Phone: 7425025073</p>
        <p>Address: Plot no 309, Hanwant A, BJS Colony, Jodhpur</p>
      </div>
    );
  }
}
export default compose(container)(Privacy);
