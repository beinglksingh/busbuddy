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
  Modal
} from "reactstrap";



//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";

import Loader from "pages/loader";
import BusBuddyLogo from "../../assets/images/logonew.png";
import BackgroundImage from "../../assets/images/background.png";
// Add these imports for date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
// Import cities array
import cities from "./cities";
import Offer from "../../assets/images/offer.png";
import logo from '../../assets/images/flag.jpg'
import Footer from "./Footer";







class UserDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      // Dropdown states
      fromInput: { value: '', label: '' },
      toInput: { value: '', label: '' },
      fromSuggestions: [],
      toSuggestions: [],
      showFromDropdown: false,
      showToDropdown: false,
      // Date state
      selectedDate: new Date(),
      // Responsive state
      isMobile: window.innerWidth <= 768
    };
    this.obj = this;
    // Bindings
    this.handleFromInput = this.handleFromInput.bind(this);
    this.handleToInput = this.handleToInput.bind(this);
    this.selectFromSuggestion = this.selectFromSuggestion.bind(this);
    this.selectToSuggestion = this.selectToSuggestion.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.searchBuses = this.searchBuses.bind(this)
    ;
    this.handleResize = this.handleResize.bind(this);
    this.handleSwap = this.handleSwap.bind(this);
    this.Viewpopularbuses  = this.Viewpopularbuses.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    window.addEventListener('resize', this.handleResize);
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    
    if (!cities || !Array.isArray(cities)) {
      console.error('Cities data is not available or not an array');
      return;
    }
    
    // Initialize with popular cities
    const popularCities = cities.filter(city => 
      city && city.label && ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'].includes(city.label)
    ).slice(0, 10);
    
    this.setState({
      fromSuggestions: popularCities,
      toSuggestions: popularCities
    });
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);
  }

  handleClickOutside(event) {
    if (this.fromDropdownRef && !this.fromDropdownRef.contains(event.target)) {
      this.setState({ showFromDropdown: false });
    }
    if (this.toDropdownRef && !this.toDropdownRef.contains(event.target)) {
      this.setState({ showToDropdown: false });
    }
  }

  handleFromInput(e) {
    const value = e.target.value;
    let suggestions = [];
    
    if (!cities || !Array.isArray(cities)) {
      console.error('Cities data is not available or not an array');
      return;
    }
    
    if (value.length === 0) {
      // Show popular cities when input is empty
      suggestions = cities.filter(city => 
        city && city.label && ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'].includes(city.label)
      ).slice(0, 10);
    } else {
      // Filter cities based on input
      suggestions = cities.filter(
        city => city && city.label && city.label.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
    }
    
    this.setState({
      fromInput: { value: '', label: value },
      fromSuggestions: suggestions,
      showFromDropdown: suggestions.length > 0
    });
  }

  handleToInput(e) {
    const value = e.target.value;
    let suggestions = [];
    
    if (!cities || !Array.isArray(cities)) {
      console.error('Cities data is not available or not an array');
      return;
    }
    
    if (value.length === 0) {
      // Show popular cities when input is empty
      suggestions = cities.filter(city => 
        city && city.label && ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'].includes(city.label)
      ).slice(0, 10);
    } else {
      // Filter cities based on input
      suggestions = cities.filter(
        city => city && city.label && city.label.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
    }
    
    this.setState({
      toInput: { value: '', label: value },
      toSuggestions: suggestions,
      showToDropdown: suggestions.length > 0
    });
  }

  searchBuses() {
    const from = this.state.fromInput.value;
    const to = this.state.toInput.value;
    
    // Check if both from and to are selected
    if (!from || !to) {
      alert("Please select source and destination");
      return;
    }
    
    const date = format(this.state.selectedDate, "yyyy-MM-dd");
    this.props.history.push(`/buseslist/${from}/${to}/${date}`);
    
  }

  Viewpopularbuses(from , to ) {
    const date = format(this.state.selectedDate, "yyyy-MM-dd");
    this.props.history.push(`/buseslist/${from}/${to}/${date}`);
  }

  selectFromSuggestion(city) {
    this.setState({ fromInput: { value: city.value, label: city.label }, showFromDropdown: false });
  }

  selectToSuggestion(city) {
    this.setState({ toInput: { value: city.value, label: city.label }, showToDropdown: false });
  }

  handleDateChange(date) {
    this.setState({ selectedDate: date });
  }

  handleResize() {
    this.setState({ isMobile: window.innerWidth <= 768 });
  }

  handleSwap() {
    const { fromInput, toInput } = this.state;
    const newFromInput = { ...toInput };
    const newToInput = { ...fromInput };
    this.setState({
      fromInput: newFromInput,
      toInput: newToInput,
      showFromDropdown: false,
      showToDropdown: false,
    });
  }

  render() {
    // Placeholder user info
    const obj = JSON.parse(sessionStorage.getItem("authUser")) || {};
    const { isMobile } = this.state;

    return (
      <React.Fragment>
        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '0 0 0 0', minHeight: 70, display: 'flex', alignItems: 'center' }}>
          <Container fluid>
            <Row className="align-items-center" style={{ minHeight: 70 }}>
              <Col md="2" xs="6" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={BusBuddyLogo} alt="BusBuddy Logo" style={{ height: 62, width: 200, maxWidth: '100%' }} />
              </Col>
              <Col>
              
              </Col>
              <Col
                md="6"
                xs="12"
                className="d-flex justify-content-end align-items-center"
                style={{
                  fontSize: 18,
                  color: '#444',
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  {/* User icon (Font Awesome style) */}
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ display: 'inline-block', verticalAlign: 'middle', color: 'black' }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.314 0-10 1.657-10 5v3h20v-3c0-3.343-6.686-5-10-5z"/>
                  </svg>
                  <span className="d-none d-sm-inline" style={{ fontWeight: 500 }}>Account</span>
                </span>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Main Content with image background */}
        <div style={{
          height: isMobile ? 220 : 280,
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          position: 'relative'
        }}>
          <Container fluid style={{ position: 'relative', zIndex: 1 }}>
            {/* Main Heading */}
            <Row className="justify-content-start">
              <Col md="10" lg="10" className="text-left" style={{ marginTop: isMobile ? 20 : 45 }}>
                <div style={{
                  fontWeight: 800,
                  fontSize: isMobile ? '28px' : '44px',
                  color: '#fff',
                  textShadow: '0 2px 8px rgba(44,62,80,0.10)',
                  padding: '0 15px',
                  lineHeight: 1.1,
                  whiteSpace: 'pre-line'
                }}>
                  Indias No. 1 Online<br />
                  Bus Ticket Booking Site
                </div>
              </Col>
            </Row>

            {/* Search Card */}
              <Row className="justify-content-center" style={{ marginTop: isMobile ? 140 : 80, marginBottom: isMobile ? 18 : 28 }}>
                <Col m="10" lg="10" xs="12">
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: isMobile ? 20 : 27,
                      boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
                      padding: isMobile ? '12px 10px 10px 10px' : '20px 24px 14px 24px',
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: isMobile ? 10 : 0,
                      position: 'relative',
                    }}
                  >
                    {/* From/To with Swap merged */}
                    <div
                      style={{
                        flex: isMobile ? 'none' : 2,
                        width: isMobile ? '100%' : 'auto',
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'stretch',
                        gap: 0,
                        position: 'relative',
                        background: '#fff',
                        borderRadius: 12,
                        boxShadow: isMobile ? undefined : '0 2px 8px rgba(44,62,80,0.06)',
                        border: '1px solid #d1d5db',
                        overflow: 'visible',
                      }}
                    >
                      {/* From */}
                      <div
                        style={{
                          flex: 1,
                          width: isMobile ? '100%' : 'auto',
                          textAlign: 'left',
                          position: 'relative',
                          borderRadius: isMobile ? '12px 12px 0 0' : '12px 0 0 12px',
                          border: 'none',
                          background: '#fff',
                          padding: '8px 12px',
                          minHeight: '44px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                        ref={ref => this.fromDropdownRef = ref}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontWeight: 500,
                            fontSize: 12,
                            marginBottom: 2,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          <i
                            className="fa fa-bus"
                            style={{
                              fontSize: 15,
                              color: 'black',
                              marginRight: 2,
                              marginTop: 1,
                            }}
                            aria-hidden="true"
                          ></i>
                          From
                       
                        </div>
                        <div style={{ position: 'relative', width: '100%' }}>
                          <Input
                            type="text"
                            value={this.state.fromInput.label}
                            onChange={this.handleFromInput}
                            placeholder="Enter departure city"
                            style={{
                              fontWeight: 400,
                              fontSize: isMobile ? 13 : 15,
                              color: '#111827',
                              marginBottom: 0,
                              padding: '0',
                              border: 'none',
                              boxShadow: 'none',
                              outline: 'none',
                              background: 'transparent',
                              height: 'auto',
                              lineHeight: '1.2',
                              width: '100%',
                            }}
                            onFocus={() => {
                              this.setState({ showFromDropdown: true });
                            }}
                            onClick={() => {
                              this.setState({ showFromDropdown: true });
                            }}
                            autoComplete="off"
                          />
                        </div>
                        
                        {this.state.showFromDropdown && this.state.fromSuggestions.length > 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              background: '#fff',
                              border: '2px solid #dc2626',
                              borderRadius: 8,
                              zIndex: 9999,
                              maxHeight: isMobile ? 150 : 200,
                              overflowY: 'auto',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                              marginTop: 2,
                              minHeight: '40px',
                              width: '100%',
                            }}
                          >
                            {this.state.fromSuggestions.map((city, idx) => (
                              <div
                                key={city.value + idx}
                                style={{
                                  padding: isMobile ? '6px 12px' : '8px 16px',
                                  cursor: 'pointer',
                                  fontSize: isMobile ? 13 : 14,
                                  color: '#374151',
                                  borderBottom:
                                    idx !== this.state.fromSuggestions.length - 1
                                      ? '1px solid #f3f4f6'
                                      : 'none',
                                  transition: 'background-color 0.15s',
                                }}
                                onMouseEnter={e => (e.target.style.backgroundColor = '#f9fafb')}
                                onMouseLeave={e => (e.target.style.backgroundColor = 'transparent')}
                                onClick={() => this.selectFromSuggestion(city)}
                              >
                                {city.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Middle Line and Swap Icon */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: isMobile ? 'row' : 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: isMobile ? 1 : -1,
                          minHeight: isMobile ? -1 : 1,
                          position: 'relative',
                          zIndex: 2,
                          background: 'black',
                        }}
                      >
                        {/* Middle Line */}
                        <div
                          style={{
                            width: isMobile ? 36 : 2,
                            height: isMobile ? 2 : 36,
                            background: '#374151',
                            opacity: 0.25,
                            alignSelf: 'center',
                            margin: isMobile ? '0 6px' : '6px 0',
                            borderRadius: 2,
                            transition: 'background 0.2s',
                          }}
                        />
                        {/* Swap Icon */}
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: '#f3f4f6',
                            border: '2px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
                            fontSize: 18,
                            color: '#111827',
                            cursor: 'pointer',
                            margin: isMobile ? '0 0 0 0' : '-1px 0 0 0',
                            position: 'absolute',
                            top: isMobile ? '50%' : '50%',
                            left: isMobile ? '50%' : '50%',
                            transform: isMobile
                              ? 'translate(-50%, -50%)'
                              : 'translate(-50%, -50%)',
                            zIndex: 3,
                          }}
                          onClick={this.handleSwap}
                          title="Swap From and To"
                          aria-label="Swap From and To"
                        >
                          ⇄
                        </div>
                      </div>
                      {/* To */}
                      <div
                        style={{
                          flex: 1,
                          width: isMobile ? '100%' : 'auto',
                          textAlign: 'left',
                          position: 'relative',
                          borderRadius: isMobile ? '0 0 12px 12px' : '0 12px 12px 0',
                          border: 'none',
                          background: '#fff',
                          padding: '8px 12px',
                          minHeight: '44px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                        ref={ref => this.toDropdownRef = ref}
                      >
                        <div
                          style={{
                            fontWeight: 500,
                            fontSize: 12,
                            marginBottom: 2,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          {/* Bus icon at the start of "To" */}
                          <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 15, color: 'black', marginRight: 3 }}>
                            <i className="fa fa-bus" aria-hidden="true"></i>
                          </span>
                          To
                        </div>
                        <div style={{ position: 'relative', width: '100%' }}>
                          <Input
                            type="text"
                            value={this.state.toInput.label}
                            onChange={this.handleToInput}
                            placeholder="Enter destination city"
                            style={{
                              fontWeight: 400,
                              fontSize: isMobile ? 13 : 15,
                              color: '#111827',
                              marginBottom: 0,
                              padding: '0',
                              border: 'none',
                              boxShadow: 'none',
                              outline: 'none',
                              background: 'transparent',
                              height: 'auto',
                              lineHeight: '1.2',
                              width: '100%',
                            }}
                            onFocus={() => {
                              this.setState({ showToDropdown: true });
                            }}
                            onClick={() => {
                              this.setState({ showToDropdown: true });
                            }}
                            autoComplete="off"
                          />
                        </div>
                        
                        {this.state.showToDropdown && this.state.toSuggestions.length > 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              background: '#fff',
                              border: '2px solid #dc2626',
                              borderRadius: 8,
                              zIndex: 9999,
                              maxHeight: isMobile ? 150 : 200,
                              overflowY: 'auto',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                              marginTop: 2,
                              minHeight: '40px',
                              width: '100%',
                            }}
                          >
                            {this.state.toSuggestions.map((city, idx) => (
                              <div
                                key={city.value + idx}
                                style={{
                                  padding: isMobile ? '6px 12px' : '8px 16px',
                                  cursor: 'pointer',
                                  fontSize: isMobile ? 13 : 14,
                                  color: '#374151',
                                  borderBottom:
                                    idx !== this.state.toSuggestions.length - 1
                                      ? '1px solid #f3f4f6'
                                      : 'none',
                                  transition: 'background-color 0.15s',
                                }}
                                onMouseEnter={e => (e.target.style.backgroundColor = '#f9fafb')}
                                onMouseLeave={e => (e.target.style.backgroundColor = 'transparent')}
                                onClick={() => this.selectToSuggestion(city)}
                              >
                                {city.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Date */}
                    <div
                      style={{
                        flex: isMobile ? 'none' : 1,
                        height: isMobile ? 'auto' : '57px',
                        width: isMobile ? '100%' : '400px',
                        textAlign: 'left',
                        maxWidth: isMobile ? '100%' : 400,
                        marginLeft: isMobile ? 0 : 4,
                        borderRadius: 10,
                        border: '1px solid #d1d5db',
                        background: '#fff',
                        padding: isMobile ? '10px 8px' : '14px 18px',
                        minHeight: '44px',
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'stretch' : 'center',
                        justifyContent: 'space-between',
                        gap: isMobile ? 10 : 16,
                        position: 'relative',
                        boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
                      }}
                    >
                      {/* Line on starting row of date box */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: 2,
                          width: '100%',
                         
                          borderRadius: 2,
                          zIndex: 3,
                        }}
                      />
                      {/* Date + Today/Tomorrow Buttons */}
                      <div
                        style={{
                          flex: isMobile ? 'none' : 1,
                          width: isMobile ? '100%' : 150,
                          textAlign: 'left',
                          maxWidth: isMobile ? '100%' : 180,
                          borderRadius: 8,
                          background: '#fff',
                          padding: isMobile ? '8px 8px' : '3px 8px',
                          minHeight: '34px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 500,
                            fontSize: 12,
                            marginBottom: 2,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Date
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'stretch' : 'center',
                            gap: isMobile ? 6 : 8,
                            width: '100%',
                          }}
                        >
                          <DatePicker
                            selected={this.state.selectedDate}
                            onChange={this.handleDateChange}
                            dateFormat="dd MMM, yyyy"
                            minDate={new Date()}
                            customInput={
                              <Input
                                style={{
                                  fontSize: isMobile ? 13 : 15,
                                  color: '#111827',
                                  marginBottom: 0,
                                  padding: '0',
                                  border: 'none',
                                  boxShadow: 'none',
                                  outline: 'none',
                                  fontWeight: 400,
                                  height: 'auto',
                                  lineHeight: '1.2',
                                  width: isMobile ? '100%' : 120,
                                  cursor: 'pointer',
                                }}
                                value={format(this.state.selectedDate, 'dd MMM, yyyy')}
                                readOnly
                              />
                            }
                            popperPlacement="bottom"
                          />
                        </div>
                      </div>
                      {/* Today/Tomorrow Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 17,
                          alignItems: 'center',
                          justifyContent: isMobile ? 'flex-start' : 'flex-start',
                          marginTop: isMobile ? 8 : 0,
                          marginLeft: isMobile ? 16 : 8,
                          width: isMobile ? '100%' : 146,
                        }}
                      >
                        <Button
                          size="sm"
                          style={{
                            fontSize: 12,
                            padding: isMobile ? '2px 0' : '2px 6px',
                            borderRadius: 12,
                            fontWeight: 600,
                            background: '#ffcccc', // light red
                            border: '1px solid #ffb3b3', // light red border
                            minWidth: isMobile ? '48%' : 80,
                            height: 36,
                            color: '#111', // black font
                            WebkitTextFillColor: '#111',
                            marginRight: -7,
                            marginLeft: -14,
                            transition: 'background 0.2s, color 0.2s, border 0.2s',
                            cursor: 'pointer',
                          }}
                          onClick={() => this.handleDateChange(new Date())}
                          onMouseEnter={e => {
                            e.target.style.background = '#ffb3b3'; // darker light red on hover
                            e.target.style.color = '#111';
                            e.target.style.border = '1.5px solid #ff6666';
                          }}
                          onMouseLeave={e => {
                            e.target.style.background = '#ffcccc';
                            e.target.style.color = '#111';
                            e.target.style.border = '1px solid #ffb3b3';
                          }}
                        >
                          <span style={{ color: 'inherit' }}>Today</span>
                        </Button>
                        <Button
                          size="sm"
                          style={{
                            fontSize: 12,
                            padding: isMobile ? '2px 0' : '2px 6px',
                            borderRadius: 12,
                            fontWeight: 600,
                            background: '#ffcccc', // light red
                            border: '1px solid #ffb3b3', // light red border
                            minWidth: isMobile ? '48%' : 80,
                            height: 36,
                            color: '#111', // black font
                            WebkitTextFillColor: '#111',
                            transition: 'background 0.2s, color 0.2s, border 0.2s',
                            cursor: 'pointer',
                          }}
                          onClick={() => this.handleDateChange(new Date(Date.now() + 24 * 60 * 60 * 1000))}
                          onMouseEnter={e => {
                            e.target.style.background = '#ffb3b3'; // darker light red on hover
                            e.target.style.color = '#111';
                            e.target.style.border = '1.5px solid #ff6666';
                          }}
                          onMouseLeave={e => {
                            e.target.style.background = '#ffcccc';
                            e.target.style.color = '#111';
                            e.target.style.border = '1px solid #ffb3b3';
                          }}
                        >
                          <span style={{ color: 'inherit' }}>Tomorrow</span>
                        </Button>
                      </div>
                    </div>
                    {/* Search Button - moved below the middle of the box */}
                    <div
                      style={{
                        position: 'absolute',
                        left: isMobile ? 10 : '50%',
                        transform: isMobile ? 'none' : 'translateX(-50%)',
                        bottom: isMobile ? -44 : -44,
                        width: isMobile ? 'calc(100% - 10px)' : 240,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 5,
                      }}
                    >
                      <Button
                        style={{
                          width: '100%',
                          height: isMobile ? 48 : 56,
                          borderRadius: 32,
                          fontWeight: 700,
                          fontSize: isMobile ? 18 : 22,
                          background: '#dc2626',
                          border: 'none',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                         
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 7,
                          padding: 0,
                        }}
                        onClick={() => this.searchBuses()}
                        onMouseEnter={e => {
                          e.target.style.background = '#b91c1c';
                          e.target.style.transform = 'translateY(-2px) scale(1.03)';
                          e.target.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.28)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = '#dc2626';
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.22)';
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', marginRight: 6 }}>
                          <i className="fa fa-search" style={{ fontSize: isMobile ? 22 : 20, color: '#fff' }}></i>
                        </span>
                        <span style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, letterSpacing: '0.2px' }}>SEARCH 
                          BUSES
                        </span>
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>

            {/* Trending Offers */}
            {/* <Row className="justify-content-center">
              <Col md="10" lg="10">
                <div style={{
                  background: '#fff',
                  borderRadius: 40,
                  boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
                  padding: '32px 32px 24px 32px',
                  marginBottom: 24,
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{ fontWeight: 700, fontSize: 32, color: '#222', margin: 0 }}>TRENDING OFFERS</h2>
                  
                  </div>
                  <Row>
                    <Col  className="mb-1">
                    <img src={Offer} alt="Offer" style={{ height: 260, width: 800 }} />
                      <div style={{ background: '#2563eb', color: '#fff', borderRadius: 18, padding: '32px 18px', fontWeight: 700, fontSize: 22, minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(44,62,80,0.10)' }}>
                        Save up to Rs 250 on Bus<br />Use code BUS250
                      </div>
                    </Col>
                    <Col md="4" xs="12" className="mb-3">
                      <div style={{ background: '#059669', color: '#fff', borderRadius: 18, padding: '32px 18px', fontWeight: 700, fontSize: 22, minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(44,62,80,0.10)' }}>
                        Save up to Rs 500 on Bus<br />Use code BUS500
                      </div>
                    </Col>
                    <Col md="4" xs="12" className="mb-3">
                      <div style={{ background: '#dc2626', color: '#fff', borderRadius: 18, padding: '32px 18px', fontWeight: 700, fontSize: 22, minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(44,62,80,0.10)' }}>
                        Save up to Rs 300 on Bus<br />Use code BUS300
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row> */}

            {/* Bus Booking Discount Offers */}
            <Row className="justify-content-center">
              <Col md="10" lg="10" xs="12" style={{marginTop: isMobile ? 50 : 100}}>
                <div style={{
                  background: '#fff',
                  borderRadius: isMobile ? 20 : 40,
                  boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
                  padding: isMobile ? '20px 15px 15px 15px' : '24px 24px 20px 24px',
                  marginBottom: 24,
                }}>
                  <div className={`d-flex ${isMobile ? 'flex-column' : 'justify-content-between'} align-items-center mb-3`}>
                    <h2 style={{ 
                      fontWeight: 700, 
                      fontSize: isMobile ? 24 : 28, 
                      color: '#222', 
                      margin: 0,
                      marginBottom: isMobile ? 15 : 0,
                      textAlign: isMobile ? 'center' : 'left'
                    }}>Bus Booking Discount Offers</h2>
                    <a href="#" style={{ 
                      fontWeight: 600, 
                      fontSize: 16, 
                      color: '#dc3545', 
                      textDecoration: 'none', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 6 
                    }}>
                      View All <i className="fa fa-angle-right"></i>
                    </a>
                  </div>
                  <Row>
                    <Col lg="3" md="6" xs="12" className="mb-3">
                      <div style={{
                        borderRadius: 18,
                        background: 'linear-gradient(180deg,#fff7e6,#ffe8bf)',
                        border: '1px solid #fde7b0',
                        minHeight: 160,
                        width: '100%',
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 8px rgba(44,62,80,0.08)'
                      }}>
                        {/* <div>
                          <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, color: '#1f2937' }}>70% OFF</div>
                          <div style={{ fontSize: 14, color: '#374151' }}>on bus bookings</div>
                        </div>
                        <div style={{ alignSelf: 'flex-start', background: '#ef4444', color: '#fff', borderRadius: 8, padding: '8px 12px', fontWeight: 700, fontSize: 14 }}>Code: SALE</div> */}
                      </div>
                    </Col>

                    <Col lg="3" md="6" xs="12" className="mb-3">
                      <div style={{
                        borderRadius: 18,
                        background: 'linear-gradient(180deg,#ffe9ef,#ffd2dd)',
                        border: '1px solid #ffd1dc',
                        minHeight: 160,
                        width: '100%',
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 8px rgba(44,62,80,0.08)'
                      }}>
                        {/* <div>
                          <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, color: '#1f2937' }}>Get ₹500 off</div>
                          <div style={{ fontSize: 14, color: '#374151' }}>on 1st Bus Booking</div>
                        </div>
                        <div style={{ alignSelf: 'flex-start', background: '#ef4444', color: '#fff', borderRadius: 8, padding: '8px 12px', fontWeight: 700, fontSize: 14 }}>CODE: ABHIFIRST</div> */}
                      </div>
                    </Col>

                    <Col lg="3" md="6" xs="12" className="mb-3">
                      <div style={{
                        borderRadius: 18,
                        background: 'linear-gradient(180deg,#e7f3ff,#cfe7ff)',
                        border: '1px solid #cfe2ff',
                        minHeight: 160,
                        width: '100%',
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 8px rgba(44,62,80,0.08)'
                      }}>
                        {/* <div>
                          <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: '#1f2937' }}>Flat 10% off</div>
                          <div style={{ fontSize: 14, color: '#374151' }}>on Orange Travels</div>
                        </div>
                        <div style={{ alignSelf: 'flex-start', background: '#f97316', color: '#fff', borderRadius: 8, padding: '8px 12px', fontWeight: 700, fontSize: 14 }}>CODE: ORANGE10</div> */}
                      </div>
                    </Col>

                    <Col lg="3" md="6" xs="12" className="mb-3">
                      <div style={{
                        borderRadius: 18,
                        background: 'linear-gradient(180deg,#e9fff0,#cbfce0)',
                        border: '1px solid #c9f7d6',
                        minHeight: 160,
                        width: '100%',
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 8px rgba(44,62,80,0.08)'
                      }}>
                        {/* <div>
                          <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: '#1f2937' }}>Get 15% off</div>
                          <div style={{ fontSize: 16, color: '#374151' }}>on first bus booking</div>
                        </div>
                        <div style={{ alignSelf: 'flex-start', background: '#22c55e', color: '#fff', borderRadius: 8, padding: '8px 12px', fontWeight: 700, fontSize: 14 }}>Code: FREEDOM</div> */}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Why Choose BusBuddy for Bus Ticket Booking */}
            <Row className="justify-content-center">
              <Col md="10" lg="10">
                <div style={{
                  background: '#fff',
                  borderRadius: 40,
                  boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
                  padding: '32px 32px 24px 32px',
                  marginBottom: 24,
                }}>
                  <div className="mb-4">
                    <h2 style={{ fontWeight: 700, fontSize: 32, color: '#222', margin: 0, marginBottom: 16 }}>Why Choose BusBuddy for Bus Ticket Booking ?</h2>
                    <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                      BusBuddy is India&apos;s fastest growing online ticket booking platform. BusBuddy is the official ticketing partner of several State Road Transport Corporation (SRTC) operators and over 4000+ private bus partners covering more than 3,50,000 bus routes.
                    </p>
                  </div>
                  <Row>
                    <Col lg="3" md="6" className="mb-3">
                      <div style={{
                        borderRadius: 18,
                        background: '#f0fdf4',
                        border: '1px solid #dcfce7',
                        minHeight: 180,
                        width: '100%',
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(44,62,80,0.08)'
                      }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>3,50,000+ Bus Routes</h3>
                        <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>offering unparalleled choices for your travel needs</p>
                      </div>
                    </Col>

                    <Col lg="3" md="6" className="mb-3">
                      <div style={{
                        borderRadius: 18,
                        background: '#eff6ff',
                        border: '1px solid #dbeafe',
                        minHeight: 180,
                        width: '100%',
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(44,62,80,0.08)'
                      }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🚌</div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>4000+ Bus Partners</h3>
                        <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>ranging from State RTCs to private partners</p>
                      </div>
                    </Col>

                    <Col lg="3" md="6" className="mb-3">
                      <div style={{
                        borderRadius: 18,
                        background: '#fefce8',
                        border: '1px solid #fef3c7',
                        minHeight: 180,
                        width: '100%',
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(44,62,80,0.08)'
                      }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>Fastest Bus Booking</h3>
                        <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>swift and seamless bus ticket booking experience</p>
                      </div>
                    </Col>

                    <Col lg="3" md="6" className="mb-3">
                      <div style={{
                        borderRadius: 18,
                        background: '#faf5ff',
                        border: '1px solid #f3e8ff',
                        minHeight: 180,
                        width: '100%',
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(44,62,80,0.08)'
                      }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📞</div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>24/7 Customer Support</h3>
                        <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>available for all your travel needs</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Incredible India Section */}
            <Row className="justify-content-center">
              <Col md="10" lg="10">
                <div style={{
                  background: '#fff',
                  borderRadius: 40,
                  boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
                  padding: '40px 40px 32px 40px',
                  marginBottom: 24,
                }}>
                  <Row className="align-items-center">
                    {/* Left Column - Text Content */}
                    <Col lg="6" md="12" className="mb-4 mb-lg-0">
                      <h2 style={{ 
                        fontWeight: 700, 
                        fontSize: 36, 
                        color: '#1f2937', 
                        margin: 0, 
                        marginBottom: 24,
                        lineHeight: 1.2
                      }}>
                        Incredible India: A Land Like No Other
                      </h2>
                      
                      <div style={{ fontSize: 16, color: '#374151', lineHeight: 1.7 }}>
                        <p style={{ marginBottom: 20 }}>
                          India is a land that houses a world within itself, brimming with ancient heritage, mind-boggling diversity, and a spirit that amazes every traveler. With over 1.4 billion people spread across 28 states and 7 union territories, the country celebrates unity in diversity—through language, religion, food, attire, and traditions. From the snowy peaks of the Himalayas in the north to the warm oceans in the south, India&apos;s geography alone is incredible, offering breathtaking hill stations, dense rainforests, arid deserts, and tranquil river deltas.
                        </p>
                        
                        <h3 style={{ 
                          fontWeight: 600, 
                          fontSize: 20, 
                          color: '#1f2937', 
                          marginBottom: 12,
                          marginTop: 24
                        }}>
                          A Cultural Mosaic
                        </h3>
                        <p style={{ marginBottom: 20 }}>
                          Few countries can match India&apos;s vibrant festivals, color-soaked streets, and sheer variety of traditions. Every religion, region, and community adds its own flavor, making every corner distinct but still tied by a common thread of warmth and hospitality. Whether you find yourself at the bustling Kumbh Mela, India&apos;s famed spiritual gathering, or witnessing the colors of Holi and Diwali sweep through cities and villages, you&apos;ll realize why India is known as a feast for the senses.
                        </p>
                        
                        <h3 style={{ 
                          fontWeight: 600, 
                          fontSize: 20, 
                          color: '#1f2937', 
                          marginBottom: 12,
                          marginTop: 24
                        }}>
                          Heritage and Wonders
                        </h3>
                        <p style={{ marginBottom: 20 }}>
                          India is home to 40 UNESCO World Heritage Sites, including the Taj Mahal—one of the Seven Wonders of the World. But India&apos;s wonders go beyond monuments; you&apos;ll find ancient step wells, magnificent temples, intricate forts, preserved ruins, and vibrant markets at every turn.
                        </p>
                        
                        <h3 style={{ 
                          fontWeight: 600, 
                          fontSize: 20, 
                          color: '#1f2937', 
                          marginBottom: 12,
                          marginTop: 24
                        }}>
                          Wildlife and Natural Beauty
                        </h3>
                        <p style={{ marginBottom: 20 }}>
                          With over 100 national parks and 53 tiger reserves, India&apos;s biodiversity is equally impressive, housing more than 80% of the world&apos;s wild tigers. Birdsong, the roar of big cats, and the sight of elephants roaming free are regular features in Indian wilderness, making it a paradise for nature lovers.
                        </p>
                        
                        <h3 style={{ 
                          fontWeight: 600, 
                          fontSize: 20, 
                          color: '#1f2937', 
                          marginBottom: 12,
                          marginTop: 24
                        }}>
                          Everyday Magic
                        </h3>
                        <p style={{ marginBottom: 20 }}>
                          What truly makes India incredible are the moments of contrast—modern skyscrapers beside ancient neighborhoods, different languages swirling in the air, cows and rickshaws sharing busy highways, and people from every walk of life going about with resilience and a smile. Despite the chaos and color, there is a unique peace, acceptance, and joy in everyday life that touches every visitor.
                        </p>
                        
                        <p style={{ 
                          marginBottom: 0, 
                          fontStyle: 'italic',
                          fontSize: 18,
                          color: '#059669',
                          fontWeight: 500
                        }}>
                          Incredible India isn&apos;t just a destination; it&apos;s an experience. It&apos;s a place you see, feel, taste, and carry in your heart long after you leave.
                        </p>
                      </div>
                    </Col>
                    
                    {/* Right Column - Illustration */}
                    <Col lg="6" md="12" className="text-center">
                      <div style={{
                        position: 'relative',
                        height: '500px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {/* Main Illustration Container */}
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {/* Large Digital Ticket */}
                          <div style={{
                            position: 'absolute',
                            width: '280px',
                            height: '180px',
                            background: '#f3f4f6',
                            borderRadius: '16px',
                            border: '2px solid #e5e7eb',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2
                          }}>
                            <div style={{ fontSize: 48, color: '#6b7280', marginBottom: 8 }}>🚌</div>
                            <div style={{ 
                              width: '80%', 
                              height: '2px', 
                              background: 'repeating-linear-gradient(to right, #9ca3af 0, #9ca3af 4px, transparent 4px, transparent 8px)',
                              marginBottom: 8
                            }}></div>
                            <div style={{ 
                              width: '60%', 
                              height: '20px', 
                              background: 'repeating-linear-gradient(to right, #9ca3af 0, #9ca3af 2px, transparent 2px, transparent 4px)',
                              borderRadius: '4px'
                            }}></div>
                          </div>
                          
                          {/* Woman on Suitcase */}
                          <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 3
                          }}>
                            <div style={{
                              width: '120px',
                              height: '160px',
                              position: 'relative'
                            }}>
                              {/* Suitcase */}
                              <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80px',
                                height: '50px',
                                background: '#dc2626',
                                borderRadius: '8px',
                                border: '2px solid #b91c1c'
                              }}></div>
                              
                              {/* Woman */}
                              <div style={{
                                position: 'absolute',
                                bottom: '50px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60px',
                                height: '100px'
                              }}>
                                {/* Head */}
                                <div style={{
                                  width: '30px',
                                  height: '30px',
                                  background: '#fbbf24',
                                  borderRadius: '50%',
                                  position: 'absolute',
                                  top: 0,
                                  left: '50%',
                                  transform: 'translateX(-50%)'
                                }}></div>
                                
                                {/* Body */}
                                <div style={{
                                  width: '40px',
                                  height: '50px',
                                  background: '#dc2626',
                                  borderRadius: '8px',
                                  position: 'absolute',
                                  top: '25px',
                                  left: '50%',
                                  transform: 'translateX(-50%)'
                                }}></div>
                                
                                {/* Arms */}
                                <div style={{
                                  width: '8px',
                                  height: '30px',
                                  background: '#fbbf24',
                                  borderRadius: '4px',
                                  position: 'absolute',
                                  top: '30px',
                                  left: '5px'
                                }}></div>
                                <div style={{
                                  width: '8px',
                                  height: '30px',
                                  background: '#fbbf24',
                                  borderRadius: '4px',
                                  position: 'absolute',
                                  top: '30px',
                                  right: '5px'
                                }}></div>
                                
                                {/* Phone */}
                                <div style={{
                                  width: '20px',
                                  height: '30px',
                                  background: '#1f2937',
                                  borderRadius: '4px',
                                  position: 'absolute',
                                  top: '35px',
                                  right: '8px',
                                  transform: 'rotate(-15deg)'
                                }}></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Small Tickets */}
                          <div style={{
                            position: 'absolute',
                            top: '40px',
                            right: '60px',
                            zIndex: 1
                          }}>
                            <div style={{
                              width: '80px',
                              height: '50px',
                              background: '#f3f4f6',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb',
                              transform: 'rotate(15deg)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              color: '#6b7280',
                              fontWeight: 'bold'
                            }}>
                              TICKET
                            </div>
                          </div>
                          
                          <div style={{
                            position: 'absolute',
                            top: '80px',
                            right: '40px',
                            zIndex: 1
                          }}>
                            <div style={{
                              width: '60px',
                              height: '40px',
                              background: '#f3f4f6',
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                              transform: 'rotate(-10deg)'
                            }}></div>
                          </div>
                          
                          {/* Decorative Elements */}
                          <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            fontSize: '24px',
                            color: '#dc2626',
                            animation: 'twinkle 2s infinite'
                          }}>✨</div>
                          
                          <div style={{
                            position: 'absolute',
                            top: '60px',
                            right: '20px',
                            fontSize: '20px',
                            color: '#dc2626'
                          }}>✨</div>
                          
                          <div style={{
                            position: 'absolute',
                            bottom: '100px',
                            left: '40px',
                            fontSize: '18px',
                            color: '#dc2626'
                          }}>✨</div>
                          
                          {/* Clouds */}
                          <div style={{
                            position: 'absolute',
                            top: '30px',
                            left: '50px',
                            fontSize: '32px',
                            color: '#e5e7eb'
                          }}>☁️</div>
                          
                          <div style={{
                            position: 'absolute',
                            top: '80px',
                            left: '20px',
                            fontSize: '24px',
                            color: '#e5e7eb'
                          }}>☁️</div>
                          
                          <div style={{
                            position: 'absolute',
                            top: '50px',
                            right: '20px',
                            fontSize: '28px',
                            color: '#e5e7eb'
                          }}>☁️</div>
                          
                          {/* Plant */}
                          <div style={{
                            position: 'absolute',
                            bottom: '40px',
                            left: '20px',
                            fontSize: '32px',
                            color: '#10b981'
                          }}>🌿</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

          

            {/* Top Travelling Destinations in India Section */}
            <Row className="justify-content-center">
              <Col md="10" lg="10">
                <div style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderRadius: 40,
                  boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
                  padding: '40px 40px 32px 40px',
                  marginBottom: 24,
                  border: '2px solid #0ea5e9'
                }}>
                  {/* Header */}
                  <div className="text-center mb-5">
                    <div style={{ 
                      fontSize: 48, 
                      marginBottom: 16,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}>🗺️</div>
                    <h2 style={{ 
                      fontWeight: 800, 
                      fontSize: 38, 
                      color: '#0c4a6e', 
                      margin: 0, 
                      marginBottom: 16,
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      Top Travelling Destinations in India
                    </h2>
                    <p style={{ 
                      fontSize: 18, 
                      color: '#0369a1', 
                      lineHeight: 1.6, 
                      margin: 0,
                      maxWidth: '800px',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}>
                      Discover India&apos;s diverse landscapes, rich heritage, and vibrant culture through these carefully curated destination categories that showcase the best of what this incredible country has to offer.
                    </p>
                  </div>

                  {/* Destination Cards Grid */}
                  <Row>
                    {/* First Row - 4 columns */}
                    {/* Golden Triangle */}
                    <Col lg="3" md="6" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(14, 165, 233, 0.15)',
                        border: '1px solid #e0f2fe',
                        height: '100%'
                      }}>
                        <div style={{
                          height: '200px',
                          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '64px'
                        }}>🏛️</div>
                        <div style={{ padding: '24px' }}>
                          <h3 style={{ 
                            fontWeight: 700, 
                            fontSize: 20, 
                            color: '#0c4a6e', 
                            marginBottom: 12
                          }}>
                            Golden Triangle – Delhi, Agra, Jaipur
                          </h3>
                          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                            Experience the perfect blend of history and culture in India&apos;s most iconic circuit. From the majestic Red Fort and Qutub Minar in Delhi to the breathtaking Taj Mahal in Agra, and the royal heritage of Pink City Jaipur.
                          </p>
                        </div>
                      </div>
                    </Col>

                    {/* Glorious Heritage */}
                    <Col lg="3" md="6" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(14, 165, 233, 0.15)',
                        border: '1px solid #e0f2fe',
                        height: '100%'
                      }}>
                        <div style={{
                          height: '200px',
                          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '64px'
                        }}>🏰</div>
                        <div style={{ padding: '24px' }}>
                          <h3 style={{ 
                            fontWeight: 700, 
                            fontSize: 20, 
                            color: '#0c4a6e', 
                            marginBottom: 12
                          }}>
                            Glorious Heritage – Jodhpur, Udaipur, Bikaner
                          </h3>
                          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                            Immerse yourself in the royal splendor of Rajasthan. Explore the Blue City of Jodhpur, the romantic Lake City of Udaipur, and the cultural richness of Bikaner with their magnificent palaces and forts.
                          </p>
                        </div>
                      </div>
                    </Col>

                    {/* Modern India */}
                    <Col lg="3" md="6" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(14, 165, 233, 0.15)',
                        border: '1px solid #e0f2fe',
                        height: '100%'
                      }}>
                        <div style={{
                          height: '200px',
                          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '64px'
                        }}>🌃</div>
                        <div style={{ padding: '24px' }}>
                          <h3 style={{ 
                            fontWeight: 700, 
                            fontSize: 20, 
                            color: '#0c4a6e', 
                            marginBottom: 12
                          }}>
                            Modern India – Mumbai, Bangalore, Kolkata, Hyderabad
                          </h3>
                          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                            Discover the dynamic pulse of contemporary India through its major metropolitan cities. From Mumbai&apos;s Bollywood glamour to Bangalore&apos;s tech hub, Kolkata&apos;s cultural heritage, and Hyderabad&apos;s historic charm.
                          </p>
                        </div>
                      </div>
                    </Col>

                    {/* Spiritual Relaxation */}
                    <Col lg="3" md="6" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(14, 165, 233, 0.15)',
                        border: '1px solid #e0f2fe',
                        height: '100%'
                      }}>
                        <div style={{
                          height: '200px',
                          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '64px'
                        }}>🕉️</div>
                        <div style={{ padding: '24px' }}>
                          <h3 style={{ 
                            fontWeight: 700, 
                            fontSize: 20, 
                            color: '#0c4a6e', 
                            marginBottom: 12
                          }}>
                            Spiritual Relaxation – Amritsar, Katra, Nashik, Ayodhya, Odisha
                          </h3>
                          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                            Embark on a spiritual journey to India&apos;s most sacred destinations. Visit the Golden Temple in Amritsar, Vaishno Devi in Katra, the holy city of Nashik, the birthplace of Lord Rama in Ayodhya, and the spiritual centers of Odisha.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Second Row - 4 columns */}
                  <Row>
                    {/* Himalayan Foothills */}
                    <Col lg="3" md="6" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(14, 165, 233, 0.15)',
                        border: '1px solid #e0f2fe',
                        height: '100%'
                      }}>
                        <div style={{
                          height: '200px',
                          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '64px'
                        }}>🏔️</div>
                        <div style={{ padding: '24px' }}>
                          <h3 style={{ 
                            fontWeight: 700, 
                            fontSize: 20, 
                            color: '#0c4a6e', 
                            marginBottom: 12
                          }}>
                            Himalayan Foothills – Uttarakhand, Himachal Pradesh, Sikkim
                          </h3>
                          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                            Experience the majestic beauty of the Himalayas through these northern states. From the spiritual towns of Uttarakhand to the adventure capital of Himachal Pradesh and the serene landscapes of Sikkim.
                          </p>
                        </div>
                      </div>
                    </Col>

                    {/* Hill Stations */}
                    <Col lg="3" md="6" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(14, 165, 233, 0.15)',
                        border: '1px solid #e0f2fe',
                        height: '100%'
                      }}>
                        <div style={{
                          height: '200px',
                          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '64px'
                        }}>🌄</div>
                        <div style={{ padding: '24px' }}>
                          <h3 style={{ 
                            fontWeight: 700, 
                            fontSize: 20, 
                            color: '#0c4a6e', 
                            marginBottom: 12
                          }}>
                            Hill Stations – Mount Abu, Pune, Coorg, Nainital
                          </h3>
                          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                            Escape to the cool climes of India&apos;s most beautiful hill stations. From the serene Mount Abu in Rajasthan to the cultural hub of Pune, the coffee paradise of Coorg, and the lake city of Nainital.
                          </p>
                        </div>
                      </div>
                    </Col>

                    {/* Wildlife */}
                    <Col lg="3" md="6" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(14, 165, 233, 0.15)',
                        border: '1px solid #e0f2fe',
                        height: '100%'
                      }}>
                        <div style={{
                          height: '200px',
                          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '64px'
                        }}>🦁</div>
                        <div style={{ padding: '24px' }}>
                          <h3 style={{ 
                            fontWeight: 700, 
                            fontSize: 20, 
                            color: '#0c4a6e', 
                            marginBottom: 12
                          }}>
                            Wildlife – Gujarat, Ranthambore, Madhya Pradesh, West Bengal, Kerala
                          </h3>
                          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                            Explore India&apos;s rich biodiversity through its diverse wildlife sanctuaries. From the Asiatic lions of Gujarat to the tigers of Ranthambore, the jungles of Madhya Pradesh, and the unique ecosystems of West Bengal and Kerala.
                          </p>
                        </div>
                      </div>
                    </Col>

                    {/* Sun, Sand & Serenity */}
                    <Col lg="3" md="6" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(14, 165, 233, 0.15)',
                        border: '1px solid #e0f2fe',
                        height: '100%'
                      }}>
                        <div style={{
                          height: '200px',
                          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '64px'
                        }}>🏖️</div>
                        <div style={{ padding: '24px' }}>
                          <h3 style={{ 
                            fontWeight: 700, 
                            fontSize: 20, 
                            color: '#0c4a6e', 
                            marginBottom: 12
                          }}>
                            Sun, Sand & Serenity – Kochi, Goa, Daman & Diu
                          </h3>
                          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                            Unwind at India&apos;s most beautiful coastal destinations. From the historic port city of Kochi to the party capital of Goa and the tranquil beaches of Daman & Diu, experience the perfect blend of relaxation and adventure.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Bottom Message */}
                  <div className="text-center mt-5">
                    <div style={{
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                      borderRadius: 20,
                      padding: '24px 32px',
                      border: '2px solid #0ea5e9',
                      display: 'inline-block',
                      maxWidth: '700px'
                    }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: 16,
                        color: '#0c4a6e',
                        fontWeight: 500,
                        lineHeight: 1.5
                      }}>
                        These destination categories showcase the incredible diversity of India&apos;s tourism landscape. From ancient heritage sites to modern metropolises, spiritual centers to adventure hotspots, India offers something extraordinary for every type of traveler. Plan your journey with BusBuddy and discover the magic of Incredible India.
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Popular Bus Routes Section */}
            <Row className="justify-content-center">
              <Col md="10" lg="10">
                <div style={{
                  background: '#fff',
                  borderRadius: 40,
                  boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
                  padding: '40px 40px 32px 40px',
                  marginBottom: 40,
                }}>
                  {/* Header */}
                  <div className="mb-5">
                    <h2 style={{ 
                      fontWeight: 700, 
                      fontSize: 36, 
                      color: '#1f2937', 
                      margin: 0, 
                      marginBottom: 16
                    }}>
                      Premium Express Bus Routes
                    </h2>
                    <p style={{ 
                      fontSize: 16, 
                      color: '#6b7280', 
                      lineHeight: 1.6, 
                      margin: 0,
                      maxWidth: '800px'
                    }}>
                      Discover India&apos;s most popular premium express bus routes connecting major cities across different regions. From the majestic Himalayas in the North to the serene backwaters of the South, explore our extensive network of premium bus services. Book your tickets online with BusBuddy for a comfortable and reliable journey.
                    </p>
                  </div>

                  {/* Bus Routes Grid - Two Columns */}
                  <Row>
                    {/* Left Column - North India Routes */}
                    <Col lg="6" md="12" className="mb-4">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Route Card 1 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏛️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Delhi → Manali
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(1780,4798)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 2 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏰</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Jaipur → Amritsar
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                             onClick={()=>this.Viewpopularbuses(2984,237)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 3 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏔️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Delhi → Leh
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                             onClick={()=>this.Viewpopularbuses(1780,4518)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 4 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🕉️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Varanasi → Lucknow
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                             onClick={()=>this.Viewpopularbuses(8343,4587)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 5 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏔️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Srinagar → Udhampur
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(7424,8120)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 6 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏛️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Delhi → Lucknow
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(1780,4587)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 7 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏛️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Bikaner → Rajkot
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(1157,6716)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 8 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🌃</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Ahmedabad → Mumbai
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(81,5336)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>
                      </div>
                    </Col>

                    {/* Right Column - South India & International Routes */}
                    <Col lg="6" md="12" className="mb-4">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Route Card 9 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏛️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Bangalore → Chennai
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(909,1445)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 10 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏖️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Hyderabad → Goa
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(2863,2410)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 11 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏛️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Chennai → Pondicherry
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(1445,6520)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 12 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🌊</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Bangalore → Mangalore
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(702,4881)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 13 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏛️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Hyderabad → Bangalore
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(2863,702)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 14 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏛️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Chennai → Coimbatore
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(1445,1614)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 15 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🏛️</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Mysore → Bangalore
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(542,702)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>

                        {/* Route Card 16 */}
                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                          }}>🌊</div>
                          <div style={{ flex: 1, fontWeight: 600, fontSize: '16px', color: '#374151' }}>
                            Trivandrum → Kochi
                          </div>
                          <Button 
                            size="sm" 
                            style={{ 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db',
                              color: '#374151',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onClick={()=>this.Viewpopularbuses(9350,3972)}
                          >
                            <span style={{ color: '#000' }}>View Buses</span>
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>


              {/* Food Culture in India Section */}
              <Row className="justify-content-center">
              <Col md="10" lg="10">
                <div style={{
                  background: 'linear-gradient(135deg, #fef7f0 0%, #fff5f5 100%)',
                  borderRadius: 40,
                  boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
                  padding: '40px 40px 32px 40px',
                  marginBottom: 24,
                  border: '2px solid #fed7aa'
                }}>
                  {/* Header */}
                  <div className="text-center mb-5">
                    <div style={{ 
                      fontSize: 48, 
                      marginBottom: 16,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}>🍽️</div>
                    <h2 style={{ 
                      fontWeight: 800, 
                      fontSize: 38, 
                      color: '#7c2d12', 
                      margin: 0, 
                      marginBottom: 16,
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      Food Culture in India: A Tapestry of Tradition and Diversity
                    </h2>
                    <p style={{ 
                      fontSize: 18, 
                      color: '#92400e', 
                      lineHeight: 1.6, 
                      margin: 0,
                      maxWidth: '800px',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}>
                      Indian food culture is a living mosaic, woven with ancient traditions, diverse regional flavors, spiritual beliefs, and centuries of cultural exchange.
                    </p>
                  </div>

                  {/* Main Content Cards */}
                  <Row>
                    {/* Historical Evolution Card */}
                    {/* <Col lg="6" md="12" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 24,
                        padding: '28px',
                        height: '100%',
                        border: '2px solid #fbbf24',
                        boxShadow: '0 4px 16px rgba(251, 191, 36, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '-10px',
                          width: '60px',
                          height: '60px',
                          background: '#fbbf24',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          color: '#92400e'
                        }}>📜</div>
                        
                        <h3 style={{ 
                          fontWeight: 700, 
                          fontSize: 24, 
                          color: '#92400e', 
                          marginBottom: 16,
                          marginTop: 8
                        }}>
                          Historical Evolution
                        </h3>
                        <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                          The story of Indian food goes back over 5,000 years, beginning with the ancient Indus Valley Civilization. Over time, various dynasties and empires introduced new ingredients and techniques, from Persian and Mughal influences to Portuguese and British contributions.
                        </p>
                      </div>
                    </Col> */}

                    {/* Regional Diversity Card */}
                    {/* <Col lg="6" md="12" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 24,
                        padding: '28px',
                        height: '100%',
                        border: '2px solid #f97316',
                        boxShadow: '0 4px 16px rgba(249, 115, 22, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '-10px',
                          width: '60px',
                          height: '60px',
                          background: '#f97316',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          color: '#fff'
                        }}>🗺️</div>
                        
                        <h3 style={{ 
                          fontWeight: 700, 
                          fontSize: 24, 
                          color: '#ea580c', 
                          marginBottom: 16,
                          marginTop: 8
                        }}>
                          Regional Diversity
                        </h3>
                        <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                          From North India&apos;s hearty breads and Mughlai dishes to South India&apos;s rice-based delicacies, each region tells its own culinary story shaped by climate, geography, and centuries of migrations and trade.
                        </p>
                      </div>
                    </Col> */}

                    {/* Religion & Philosophy Card */}
                    {/* <Col lg="6" md="12" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 24,
                        padding: '28px',
                        height: '100%',
                        border: '2px solid #10b981',
                        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '-10px',
                          width: '60px',
                          height: '60px',
                          background: '#10b981',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          color: '#fff'
                        }}>🕉️</div>
                        
                        <h3 style={{ 
                          fontWeight: 700, 
                          fontSize: 24, 
                          color: '#059669', 
                          marginBottom: 16,
                          marginTop: 8
                        }}>
                          Religion & Philosophy
                        </h3>
                        <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                          Food in India is inextricably linked to religion and ritual. Hinduism, Buddhism, Jainism, Islam, and Sikhism have all left distinct marks, while Ayurveda continues to influence dietary choices.
                        </p>
                      </div>
                    </Col> */}

                    {/* Social Side Card */}
                    <Col lg="6" md="12" className="mb-4">
                      <div style={{
                        background: '#fff',
                        borderRadius: 24,
                        padding: '28px',
                        height: '100%',
                        border: '2px solid #8b5cf6',
                        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '-10px',
                          width: '60px',
                          height: '60px',
                          background: '#8b5cf6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          color: '#fff'
                        }}>🤝</div>
                        
                        <h3 style={{ 
                          fontWeight: 700, 
                          fontSize: 24, 
                          color: '#7c3aed', 
                          marginBottom: 16,
                          marginTop: 8
                        }}>
                          Social Side: Rituals & Festivals
                        </h3>
                        <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                          Indian food is central to festivals, ceremonies, and hospitality. Almost every major festival has its own traditional dishes, and meals are often shared as a symbol of community and balance.
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {/* Bottom Quote */}
                  <div className="text-center mt-5">
                    <div style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: 20,
                      padding: '24px 32px',
                      border: '2px solid #f59e0b',
                      display: 'inline-block',
                      maxWidth: '600px'
                    }}>
                      <p style={{ 
                        margin: 0, 
                        fontStyle: 'italic',
                        fontSize: 18,
                        color: '#92400e',
                        fontWeight: 600,
                        lineHeight: 1.5
                      }}>
                        &quot;If you travel through India—or even share a meal with an Indian family—you are sure to discover that food here is more than flavor; it&apos;s a story of history, faith, environment, and the art of living.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <Footer/>
        </div>
      </React.Fragment>
    );
  }
}
export default compose(container)(UserDashboard);
