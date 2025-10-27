import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import logodark from "../../assets/images/logonew.png";

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="min-vh-100" style={{ background: '#f8f9fb', position: 'relative' }}>
          <Container fluid className="px-0">
            <Row className="g-0 align-items-start">
              {/* Header Section */}
              <Col lg={12} md={12}>
                <div style={{ background: '#fff', padding: '24px 24px 24px 24px', borderBottom: '1px solid #eee' }}>
                  <div className="d-flex align-items-center gap-3 mb-0">
                    <img src={logodark} alt="BUSBUDDY" height="56" style={{ borderRadius: 8 }} />
                    <div>
                      <h3 className="mb-1" style={{ fontWeight: 800, color: '#222' }}>About BUSBUDDY</h3>
                      <div className="text-muted" style={{ fontSize: 14 }}>Connecting people, places, and possibilities</div>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Hero Section */}
              <Col lg={12} md={12}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', 
                  padding: '80px 24px', 
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h1 style={{ 
                      fontWeight: 800, 
                      marginBottom: 24, 
                      fontSize: 48,
                      lineHeight: 1.2,
                      color : 'white'
                    }}>
                      About Us
                    </h1>
                    <p style={{ 
                      fontSize: 20, 
                      marginBottom: 32, 
                      opacity: 0.95, 
                      lineHeight: 1.6,
                      fontWeight: 400
                    }}>
                      BusBuddy is more than just ticket booking — we connect people, places, and possibilities. 
                      With reliable buses and transparent fares, we make travel easy and hassle-free.
                    </p>
                                         <p style={{ 
                       fontSize: 20, 
                       marginBottom: 32, 
                       opacity: 0.95, 
                       lineHeight: 1.6,
                       fontWeight: 400
                     }}>
                       At the same time, we believe every journey should create impact. That&apos;s why BusBuddy 
                       also supports fundraisers for causes like disaster relief, healthcare, and the environment.
                     </p>
                    <p style={{ 
                      fontSize: 20, 
                      marginBottom: 0, 
                      opacity: 0.95, 
                      lineHeight: 1.6,
                      fontWeight: 600
                    }}>
                      Travel with us, and be part of the change.
                    </p>
                  </div>
                </div>
              </Col>

              {/* Mission & Values Section */}
              <Col lg={12} md={12}>
                <div style={{ background: '#fff', padding: '60px 24px' }}>
                  <Row>
                    <Col lg={4} md={6} className="mb-4">
                      <Card style={{ 
                        border: '1px solid #f0f0f0', 
                        borderRadius: 16, 
                        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                        height: '100%'
                      }}>
                        <CardBody style={{ padding: 32, textAlign: 'center' }}>
                          <div style={{ 
                            width: 80, 
                            height: 80, 
                            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: 'white',
                            fontSize: 32,
                            fontWeight: 'bold'
                          }}>
                            🚌
                          </div>
                          <h4 style={{ fontWeight: 700, color: '#222', marginBottom: 16 }}>Reliable Travel</h4>
                          <p style={{ color: '#6c757d', lineHeight: 1.6 }}>
                            We provide dependable bus services with transparent pricing, ensuring your journey 
                            is smooth and stress-free from start to finish.
                          </p>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col lg={4} md={6} className="mb-4">
                      <Card style={{ 
                        border: '1px solid #f0f0f0', 
                        borderRadius: 16, 
                        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                        height: '100%'
                      }}>
                        <CardBody style={{ padding: 32, textAlign: 'center' }}>
                          <div style={{ 
                            width: 80, 
                            height: 80, 
                            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: 'white',
                            fontSize: 32,
                            fontWeight: 'bold'
                          }}>
                            🤝
                          </div>
                          <h4 style={{ fontWeight: 700, color: '#222', marginBottom: 16 }}>Community Impact</h4>
                          <p style={{ color: '#6c757d', lineHeight: 1.6 }}>
                            Every journey with us contributes to meaningful causes, from disaster relief 
                            to environmental conservation and healthcare initiatives.
                          </p>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col lg={4} md={6} className="mb-4">
                      <Card style={{ 
                        border: '1px solid #f0f0f0', 
                        borderRadius: 16, 
                        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                        height: '100%'
                      }}>
                        <CardBody style={{ padding: 32, textAlign: 'center' }}>
                          <div style={{ 
                            width: 80, 
                            height: 80, 
                            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: 'white',
                            fontSize: 32,
                            fontWeight: 'bold'
                          }}>
                            🌟
                          </div>
                          <h4 style={{ fontWeight: 700, color: '#222', marginBottom: 16 }}>Transparency</h4>
                          <p style={{ color: '#6c757d', lineHeight: 1.6 }}>
                            We believe in complete transparency in our pricing and operations, 
                            building trust with our customers and partners.
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Impact Section */}
              <Col lg={12} md={12}>
                <div style={{ background: '#f8f9fb', padding: '60px 24px' }}>
                  <div className="text-center mb-5">
                    <h2 style={{ fontWeight: 800, color: '#222', marginBottom: 16 }}>Our Impact</h2>
                    <p className="text-muted" style={{ fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
                      Through our platform, we&apos;ve facilitated countless journeys while supporting 
                      important social and environmental causes.
                    </p>
                  </div>
                  
                  <Row className="text-center">
                    <Col md={3} sm={6} className="mb-4">
                      <div style={{ fontSize: 48, fontWeight: 800, color: '#dc3545', marginBottom: 8 }}>10K+</div>
                      <div style={{ fontSize: 16, color: '#6c757d' }}>Happy Travelers</div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                      <div style={{ fontSize: 48, fontWeight: 800, color: '#dc3545', marginBottom: 8 }}>500+</div>
                      <div style={{ fontSize: 16, color: '#6c757d' }}>Routes Covered</div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                      <div style={{ fontSize: 48, fontWeight: 800, color: '#dc3545', marginBottom: 8 }}>₹50L+</div>
                      <div style={{ fontSize: 16, color: '#6c757d' }}>Funds Raised</div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                      <div style={{ fontSize: 48, fontWeight: 800, color: '#dc3545', marginBottom: 8 }}>25+</div>
                      <div style={{ fontSize: 16, color: '#6c757d' }}>Cities Connected</div>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Call to Action Section */}
              <Col lg={12} md={12}>
                <div style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', padding: '60px 24px', color: 'white' }}>
                  <div className="text-center">
                    <h2 style={{ fontWeight: 800, marginBottom: 16, fontSize: 36 }}>Join Our Journey</h2>
                    <p style={{ fontSize: 18, marginBottom: 32, opacity: 0.9, maxWidth: 600, margin: '0 auto 32px' }}>
                      Be part of a community that believes in making travel meaningful and impactful. 
                      Book your next journey with BusBuddy and contribute to positive change.
                    </p>
                    
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                      <Button 
                        color="light" 
                        size="lg"
                        style={{ 
                          fontWeight: 600, 
                          padding: '12px 32px',
                          borderRadius: 12,
                          border: 'none'
                        }}
                        onClick={() => this.props.history.push('/campaign')}
                      >
                        Explore Campaigns
                      </Button>
                      <Button 
                        outline 
                        color="light" 
                        size="lg"
                        style={{ 
                          fontWeight: 600, 
                          padding: '12px 32px',
                          borderRadius: 12,
                          borderWidth: 2
                        }}
                         onClick={() => this.props.history.push('/login')}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Footer Section */}
              <Col lg={12} md={12}>
                <div style={{ background: '#222', padding: '40px 24px', color: 'white' }}>
                  <Row>
                    <Col lg={4} md={6} className="mb-4">
                      <h5 style={{ fontWeight: 700, marginBottom: 16 }}>About BUSBUDDY</h5>
                      <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
                        We connect people, places, and possibilities through reliable travel services 
                        while creating positive impact in communities across India.
                      </p>
                    </Col>
                    <Col lg={4} md={6} className="mb-4">
                      <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Quick Links</h5>
                      <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8 }}>
                        <li style={{ marginBottom: 8 }}>Our Campaigns</li>
                        <li style={{ marginBottom: 8 }}>Book Tickets</li>
                        <li style={{ marginBottom: 8 }}>Contact Us</li>
                        <li style={{ marginBottom: 8 }}>Support</li>
                      </ul>
                    </Col>
                    <Col lg={4} md={6} className="mb-4">
                      <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Get In Touch</h5>
                      <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
                        Have questions or want to learn more about our impact? 
                        We&apos;d love to hear from you.
                      </p>
                      <Button 
                        color="danger" 
                        size="sm"
                        style={{ fontWeight: 600, borderRadius: 8 }}
                      >
                        Contact Us
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default AboutUs;
