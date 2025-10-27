import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';

import logodark from "../../assets/images/logonew.png";
import tourismImg from "../../assets/images/tour.png";
import treesImg from "../../assets/images/tree.jpg";
import floodImg from "../../assets/images/punjab.png";
import childImg from "../../assets/images/edu.png";
import { API_WEB_URLS } from 'constants/constAPI';

class Campaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: [
        {
          id: 1,
          title: "Project Busbuddy encouraging tourism",
          image: tourismImg,
        },
        {
          id: 2,
          title: "1 Million Trees by 5 June 2026",
          image: treesImg,
        },
        {
          id: 3,
          title: "Punjab Flood",
          image: floodImg,
        },
        {
          id: 4,
          title: "Every Child Deserve Chance: Sponsor education and food today",
          image: childImg,
        }
      ],
      Donations : [{
        TotalAmount : 0,
        TotalSupporters : 0
      }],
      Donations1 : [{
        TotalAmount : 0,
        TotalSupporters : 0
      }],
      Donations2 : [{
        TotalAmount : 0,
        TotalSupporters : 0
      }],
      Donations3 : [{
        TotalAmount : 0,
        TotalSupporters : 0
      }],
      Donations4 : [{
        TotalAmount : 0,
        TotalSupporters : 0
      }]
    };
    this.obj = this;
  }


  componentDidMount() {
    fetch(API_WEB_URLS.BASE+"Masters/0/token/AllTotalDonations/Id/0")
    .then(response => response.json())
    .then(data => {
      // Assuming data.data contains the booking details
      if (data && data.data) {
        // If your API returns a single object
        this.setState({ Donations: data.data.dataList });

      }
    })
    .catch(error => {
      console.error('Error fetching booking details:', error);
    });  




    fetch(API_WEB_URLS.BASE+"Masters/0/token/TotalDonations/Id/1")
    .then(response => response.json())
    .then(data => {
      // Assuming data.data contains the booking details
      if (data && data.data) {
        // If your API returns a single object
        this.setState({ Donations1: data.data.dataList });

      }
    })
    .catch(error => {
      console.error('Error fetching booking details:', error);
    });  


    fetch(API_WEB_URLS.BASE+"Masters/0/token/TotalDonations/Id/2")
    .then(response => response.json())
    .then(data => {
      // Assuming data.data contains the booking details
      if (data && data.data) {
        // If your API returns a single object
        this.setState({ Donations2: data.data.dataList });

      }
    })
    .catch(error => {
      console.error('Error fetching booking details:', error);
    });
    
    fetch(API_WEB_URLS.BASE+"Masters/0/token/TotalDonations/Id/3")
    .then(response => response.json())
    .then(data => {
      // Assuming data.data contains the booking details
      if (data && data.data) {
        // If your API returns a single object
        this.setState({ Donations3: data.data.dataList });

      }
    })
    .catch(error => {
      console.error('Error fetching booking details:', error);
    });
    
    

    fetch(API_WEB_URLS.BASE+"Masters/0/token/TotalDonations/Id/4")
    .then(response => response.json())
    .then(data => {
      // Assuming data.data contains the booking details
      if (data && data.data) {
        // If your API returns a single object
        this.setState({ Donations4: data.data.dataList });

      }
    })
    .catch(error => {
      console.error('Error fetching booking details:', error);
    });  
  }

  renderCard = (campaign) => {
    return (
      <Col key={campaign.id} lg={3} md={6} className="mb-4" onClick={()=>  this.props.history.push(`/funding/${campaign.id}`)}>
        <Card className="h-100" style={{ border: '1px solid #f0f0f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '100%', position: 'relative', backgroundColor: '#111', height: 411 }}>
            <img
              src={campaign.image}
              alt={campaign.title}
              style={{ width: '100%', height: '100%',  opacity: 0.95 }}
              onError={(e) => { e.currentTarget.src = logodark; }}
            />
          </div>
          <CardBody style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, color: '#222', lineHeight: 1.4, fontSize: 16 }}>{campaign.title}</div>
          </CardBody>
        </Card>
      </Col>
    );
  }

  render() {
    const { campaigns } = this.state;
    return (
      <div>
        <div className="min-vh-100" style={{ background: '#f8f9fb', position: 'relative' }}>
          <Container fluid className="px-0">
            <Row className="g-0 align-items-start">
              <Col lg={12} md={12}>
                <div style={{ background: '#fff', padding: '24px 24px 24px 24px', borderBottom: '1px solid #eee' }}>
                  <div className="d-flex align-items-center gap-3 mb-0">
                    <img src={logodark} alt="BUSBUDDY" height="56" style={{ borderRadius: 8 }} />
                    <div>
                      <h3 className="mb-1" style={{ fontWeight: 800, color: '#222' }}>BUSBUDDY Campaigns</h3>
                      <div className="text-muted" style={{ fontSize: 14 }}>Explore and support our featured initiatives</div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col lg={12} md={12}>
                <div style={{ background: '#fff', padding: 24 }}>
                  <Row>
                    {campaigns.map(this.renderCard)}
                  </Row>
                </div>
              </Col>

              {/* Impact Statistics Section */}
              <Col lg={12} md={12}>
                <div style={{ background: '#fff', padding: '40px 24px', borderTop: '1px solid #eee' }}>
                  <div className="text-center mb-5">
                    <h2 style={{ fontWeight: 800, color: '#222', marginBottom: 16 }}>Our Impact So Far</h2>
                    <p className="text-muted" style={{ fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
                      Together, we have made incredible progress. Your donations have created real change in communities across India.
                    </p>
                  </div>
                  
                  <Row className="text-center">
                    <Col md={3} sm={6} className="mb-4">
                      <div style={{ fontSize: 48, fontWeight: 800, color: '#dc3545', marginBottom: 8 }}>₹{this.state.Donations[0].TotalAmount}</div>
                      <div style={{ fontSize: 16, color: '#6c757d' }}>Total Donations Raised</div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                      <div style={{ fontSize: 48, fontWeight: 800, color: '#dc3545', marginBottom: 8 }}>{this.state.Donations3[0].TotalAmount/50}</div>
                      <div style={{ fontSize: 16, color: '#6c757d' }}>Lives Impacted</div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                      <div style={{ fontSize: 48, fontWeight: 800, color: '#dc3545', marginBottom: 8 }}>{this.state.Donations2[0].TotalAmount/50}</div>
                      <div style={{ fontSize: 16, color: '#6c757d' }}>Trees Planted</div>
                    </Col>
                    <Col md={3} sm={6} className="mb-4">
                      <div style={{ fontSize: 48, fontWeight: 800, color: '#dc3545', marginBottom: 8 }}>{this.state.Donations[0].TotalSupporters}</div>
                      <div style={{ fontSize: 16, color: '#6c757d' }}>Supporters</div>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Supporters Section */}
              {/* <Col lg={12} md={12}>
                <div style={{ background: '#fff', padding: '40px 24px', borderTop: '1px solid #eee' }}>
                  <div className="text-center mb-5">
                    <h2 style={{ fontWeight: 800, color: '#222', marginBottom: 16 }}>Our Supporters</h2>
                    <p className="text-muted" style={{ fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
                      Proud to be supported by organizations and individuals who share our vision for positive change.
                    </p>
                  </div>
                  
                  <div className="supporters-slider" style={{ 
                    display: 'flex', 
                    overflow: 'hidden', 
                    position: 'relative',
                    height: '120px',
                    alignItems: 'center'
                  }}>
                    <div className="slider-track" style={{
                      display: 'flex',
                      animation: 'slide 20s linear infinite',
                      width: 'fit-content'
                    }}>
                      
                      {[...Array(8)].map((_, index) => (
                        <div key={`first-${index}`} style={{
                          minWidth: '200px',
                          height: '100px',
                          margin: '0 20px',
                          backgroundColor: '#f8f9fa',
                          border: '2px dashed #dee2e6',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6c757d',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          Supporter Logo
                        </div>
                      ))}
                      
                      {[...Array(8)].map((_, index) => (
                        <div key={`second-${index}`} style={{
                          minWidth: '200px',
                          height: '100px',
                          margin: '0 20px',
                          backgroundColor: '#f8f9fa',
                          border: '2px dashed #dee2e6',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6c757d',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          Supporter Logo
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <style>{`
                    @keyframes slide {
                      0% {
                        transform: translateX(0);
                      }
                      100% {
                        transform: translateX(-50%);
                      }
                    }
                  `}</style>
                </div>
              </Col> */}

              {/* Stories Section */}
              {/* <Col lg={12} md={12}>
                <div style={{ background: '#f8f9fb', padding: '40px 24px' }}>
                  <div className="text-center mb-5">
                    <h2 style={{ fontWeight: 800, color: '#222', marginBottom: 16 }}>Stories of Change</h2>
                    <p className="text-muted" style={{ fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
                      Real stories from real people whose lives have been transformed by your generosity.
                    </p>
                  </div>

                  <Row>
                    <Col lg={4} md={6} className="mb-4">
                      <Card style={{ border: '1px solid #f0f0f0', borderRadius: 16, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
                        <CardBody style={{ padding: 24 }}>
                          <div style={{ fontSize: 14, color: '#dc3545', fontWeight: 600, marginBottom: 12 }}>PUNJAB FLOOD RELIEF</div>
                          <h5 style={{ fontWeight: 700, color: '#222', marginBottom: 12 }}>We had lost everything...</h5>
                          <p style={{ color: '#6c757d', lineHeight: 1.6 }}>
                            When the floods hit our village, we had lost everything. Thanks to BUSBUDDYs campaign, 
                            we received immediate relief - food, clean water, and temporary shelter. Now we are rebuilding 
                            our lives with hope. - Rajinder Singh, Punjab
                          </p>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col lg={4} md={6} className="mb-4">
                      <Card style={{ border: '1px solid #f0f0f0', borderRadius: 16, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
                        <CardBody style={{ padding: 24 }}>
                          <div style={{ fontSize: 14, color: '#dc3545', fontWeight: 600, marginBottom: 12 }}>EDUCATION INITIATIVE</div>
                          <h5 style={{ fontWeight: 700, color: '#222', marginBottom: 12 }}>Now I can dream big...</h5>
                          <p style={{ color: '#6c757d', lineHeight: 1.6 }}>
                            I never thought I could go to school. My family could not afford it. But thanks to the 
                            education sponsorship program, I am now in 8th grade and dreaming of becoming a doctor. 
                            Your donations made this possible. - Priya, Mumbai
                          </p>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col lg={4} md={6} className="mb-4">
                      <Card style={{ border: '1px solid #f0f0f0', borderRadius: 16, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
                        <CardBody style={{ padding: 24 }}>
                          <div style={{ fontSize: 14, color: '#dc3545', fontWeight: 600, marginBottom: 12 }}>ENVIRONMENTAL IMPACT</div>
                          <h5 style={{ fontWeight: 700, color: '#222', marginBottom: 12 }}>Our village is greener...</h5>
                          <p style={{ color: '#6c757d', lineHeight: 1.6 }}>
                            The tree plantation drive has transformed our village. We now have clean air, 
                            better soil, and a beautiful environment. Our children will inherit a greener, 
                            healthier world. - Meera Devi, Rajasthan
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col> */}

              {/* Call to Action Section */}
              <Col lg={12} md={12}>
                <div style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', padding: '60px 24px', color: 'white' }}>
                  <div className="text-center">
                    <h2 style={{ fontWeight: 800, marginBottom: 16, fontSize: 36 }}>Make a Difference Today</h2>
                    <p style={{ fontSize: 18, marginBottom: 32, opacity: 0.9, maxWidth: 600, margin: '0 auto 32px' }}>
                      Every donation, no matter how small, creates a ripple effect of positive change. 
                      Join thousands of others who are making a real impact in communities across India.
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
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      >
                        Donate Now
                      </Button>
                      {/* <Button 
                        outline 
                        color="light" 
                        size="lg"
                        style={{ 
                          fontWeight: 600, 
                          padding: '12px 32px',
                          borderRadius: 12,
                          borderWidth: 2
                        }}
                      >
                        Learn More
                      </Button> */}
                    </div>

                    <div style={{ marginTop: 40, opacity: 0.8 }}>
                      <p style={{ fontSize: 14, marginBottom: 8 }}>💝 100% of your donation goes directly to the cause</p>
                      <p style={{ fontSize: 14, marginBottom: 8 }}>🔒 Secure and transparent donation process</p>
                      <p style={{ fontSize: 14 }}>📊 Regular updates on how your money is being used</p>
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
                        We are committed to creating positive change through sustainable initiatives, 
                        community development, and emergency relief programs across India.
                      </p>
                    </Col>
                    <Col lg={4} md={6} className="mb-4">
                      <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Quick Links</h5>
                      <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8 }}>
                        <li style={{ marginBottom: 8 }}>Our Campaigns</li>
                        <li style={{ marginBottom: 8 }} onClick={() => this.props.history.push('/aboutus')}>About Us</li>
                        <li style={{ marginBottom: 8 }}>Volunteer</li>
                        <li style={{ marginBottom: 8 }}>Contact Us</li>
                      </ul>
                    </Col>
                    <Col lg={4} md={6} className="mb-4">
                      <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Get Involved</h5>
                      <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
                        Ready to make a difference? Join our community of changemakers and 
                        help us build a better future for all.
                      </p>
                      <Button 
                        color="danger" 
                        size="sm"
                        style={{ fontWeight: 600, borderRadius: 8 }}
                      >
                        Join Us
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

export default Campaign;
