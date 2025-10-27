import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Input, Alert, Label , Modal, ModalBody} from "reactstrap";

import logodark from "../../assets/images/logonew.png";
import fundraisingImg from "../../assets/images/punjab.png";
import { API_WEB_URLS } from "constants/constAPI";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Fn_FillListData } from "store/functions";
import tourismImg from "../../assets/images/tour.png";
import treesImg from "../../assets/images/tree.jpg";
import floodImg from "../../assets/images/punjab.png";
import childImg from "../../assets/images/edu.png";


const presetAmounts = [100, 500, 200, 1000];

// Campaign-specific donation options
const getCampaignAmounts = (id) => {
  switch(id) {
    case "2": // Trees campaign
      return [
        { amount: 750, label: "PLANT 15 TREES (₹750)" },
        { amount: 1500, label: "PLANT 30 TREES (₹1500)" },
        { amount: 2100, label: "PLANT 42 TREES (₹2100)" },
        { amount: 3000, label: "PLANT 60 TREES (₹3000)" },
        { amount: 6000, label: "PLANT 120 TREES (₹6000)" },
        { amount: 0, label: "CUSTOM DONATION" }
      ];
    case "4": // Children education campaign
      return [
        { amount: 750, label: "FEED 15 CHILDREN (₹750)" },
        { amount: 1500, label: "FEED 30 CHILDREN (₹1500)" },
        { amount: 2100, label: "FEED 42 CHILDREN (₹2100)" },
        { amount: 3000, label: "FEED 60 CHILDREN (₹3000)" },
        { amount: 6000, label: "FEED 120 CHILDREN (₹6000)" },
        { amount: 0, label: "CUSTOM DONATION" }
      ];
    default:
      return presetAmounts.map(amt => ({ amount: amt, label: `₹${amt}` }));
  }
};

class Funding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAmount: null,
      customAmount: "",
      message: null,
      submitting: false,
      Donations  : [{
        TotalAmount : 0,
        TotalSupporters : 0
      }],
      id : 0,
      donorName: '',
      donorEmail: '',
      donorMobile: ''
    };
    this.onDonate =  this.onDonate.bind(this);
    this.obj = this;
    this.API_URL  =  "Masters/0/token/TotalDonations/Id/0";
  }

  getEffectiveAmount = () => {
    const { customAmount, selectedAmount } = this.state;
    if (customAmount !== "") {
      const parsed = parseFloat(customAmount);
      return isNaN(parsed) ? 0 : Math.floor(parsed);
    }
    return selectedAmount || 0;
  };

  onSelectPreset = (amt) => {
    if (amt === 0) {
      // Custom donation selected
      this.setState({ selectedAmount: null, customAmount: "", message: null });
    } else {
      this.setState({ selectedAmount: amt, customAmount: "", message: null });
    }
  };

  componentDidMount() {

    const { id } = this.props.match.params;

    this.setState({id: id})
    fetch(API_WEB_URLS.BASE+"Masters/0/token/TotalDonations/Id/"+id)
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
  }

//   onDonate = async () => {
//     this.setState({ message: null });
//     const effectiveAmount = this.getEffectiveAmount();
//     if (effectiveAmount < 50) {
//       this.setState({ message: { type: "danger", text: "Minimum donation is 50." } });
//       return;
//     }
//     try {
//       this.setState({ submitting: true });
//       await new Promise(r => setTimeout(r, 800));
//       this.setState({
//         message: { type: "success", text: `Thank you for donating ₹${effectiveAmount}!` },
//         selectedAmount: null,
//         customAmount: ""
//       });
//     } catch (e) {
//       this.setState({ message: { type: "danger", text: "Something went wrong. Please try again." } });
//     } finally {
//       this.setState({ submitting: false });
//     }
//   };




  
  onDonate = async() => {

    const effectiveAmount = this.getEffectiveAmount();

    // Validate donor information
    if (!this.state.donorName || !this.state.donorEmail || !this.state.donorMobile) {
      this.setState({ message: { type: "danger", text: "Please fill in all your information (Name, Email, Mobile) before donating." } });
      return;
    }

    if (effectiveAmount < 50) {
        this.setState({ message: { type: "danger", text: "Minimum donation is 50." } });
        return;
      }


      else {


    var Amount  =  effectiveAmount;
    
    this.setState({ submitting: true });
   
      
        const formDatan = new FormData();
        formDatan.append('Amount', Amount);
        formDatan.append('DonationType', this.state.id);
        formDatan.append('DonorName', this.state.donorName);
        formDatan.append('DonorEmail', this.state.donorEmail);
        formDatan.append('DonorMobile', this.state.donorMobile);
    
    

       fetch(API_WEB_URLS.BASE + 'PhonePeURLOnly/0/token', {
      //    fetch('http://26.8.28.180:7037/api/V1/PhonePeURL/0/token', {
          method: 'POST',
          body: formDatan,
        })
        .then(response => response.json())
        .then(data => {
        //   const parsed = JSON.parse(data.data);
        //   if (parsed.redirectUrl) {
        //     window.open(parsed.redirectUrl, '_blank');
        //   } else {
        //     alert('Some error ocurred.');
        //   }
       
        // })


        const parsed = JSON.parse(data.data);
        this.setState({ submitting: false });
        if (parsed.redirectUrl && window.PhonePeCheckout) {
          window.PhonePeCheckout.transact({
            tokenUrl: parsed.redirectUrl, // ✅ use tokenUrl key
            callback: (response) => {
              if (response === 'USER_CANCEL') {
                console.log('User cancelled the transaction');
                alert("Payment Failed Retry!")
                // handle UI logic here
              } else if (response === 'CONCLUDED') {
                const formDatans = new FormData();
                formDatans.append('RefId', data.message);
               fetch(API_WEB_URLS.BASE + 'PhonePeStatusOnly/0/token', {
                //  fetch('http://26.8.28.180:7037/api/V1/PhonePeURL/0/token', {
                  method: 'POST',
                  body: formDatans,
                })
                .then(response => response.json())
                .then(data => {
                    if(data.status == 101){
                      alert("Payment Failed Retry!")
                    }
                    else if(data.status == 102){
                      alert("Failed to Donate");
                    }
                    else if (data.status == 200){
                      alert("Donation Successfully");
                      //this.props.history.push(`/donations/${data.data[0].Id}`);
                    }
                    else {
                      alert('Something went wrong. Please try again later.')
                    }

                });


                console.log('Transaction completed');
                fetch(API_WEB_URLS.BASE+"Masters/0/token/TotalDonations/Id/0")
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
                // handle success logic here
              }
            },
            type: "IFRAME" // ✅ use type "IFRAME"
          });
        } else {
          alert("Something went wrong or PhonePeCheckout not available.");
          this.setState({ submitting: false });
        }
  })
        .catch(error => {
          console.error('Error:', error);
          this.setState({ submitting: false });
        });

    }

  }


  render() {
    const { customAmount, selectedAmount, message, submitting } = this.state;
    const effectiveAmount = this.getEffectiveAmount();
    return (
      <div>
        <div className="min-vh-100" style={{
          background: '#f8f9fb',
          position: 'relative'
        }}>
                     <Container fluid className="px-0">
             <Row className="g-0 align-items-start">
                               {/* Mobile Donation Card - Only visible on mobile */}
                {window.innerWidth <= 768 && (
                  <Col xs={12} className="d-block d-lg-none">
                    {/* Mobile Campaign Header */}
                    <div style={{ background: '#fff', padding: '20px', borderBottom: '1px solid #eee' }}>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <img src={logodark} alt="BUSBUDDY" height="40" style={{ borderRadius: 8 }} />
                        <div>
                          <h4 className="mb-1" style={{ fontWeight: 800, color: '#222', fontSize: '18px' }}>BUSBUDDY Campaigns</h4>
                          <div className="text-muted" style={{ fontSize: 12 }}>Join us to support the cause and make an impact</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center" style={{ gap: 12 }}>
                        <div style={{ width: '100%', height: 8, background: '#f1f1f1', borderRadius: 999 }}>
                          <div style={{ width: this.state.Donations[0].TotalAmount/10000000*100, height: '100%', background: '#dc3545', borderRadius: 999 }}></div>
                        </div>
                        <div style={{ minWidth: 60, color: '#dc3545', fontWeight: 700, fontSize: '12px' }}>{(this.state.Donations[0].TotalAmount/10000000*100).toFixed(3)}%</div>
                      </div>
                      <div style={{fontWeight:800, fontSize: '14px', marginTop: '8px'}}>
                        Target ₹1 Crore
                      </div>
                    </div>

                                         {/* Mobile Donation Form */}
                     <div style={{ background: '#fff', padding: '20px', borderBottom: '1px solid #eee' }}>
                       <div className="mb-3" style={{
                         background: '#fff',
                         border: '1px solid #f0f0f0',
                         borderRadius: 16,
                         boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
                       }}>
                         <div style={{ padding: 20 }}>
                         
                         {message && (
                           <Alert color={message.type} className="border-0 rounded-3 mb-3" style={{
                             backgroundColor: message.type === 'success' ? '#e6ffed' : '#fee',
                             border: message.type === 'success' ? '1px solid #b7f5c9' : '1px solid #fcc',
                             color: message.type === 'success' ? '#1b7f3b' : '#c33'
                           }}>
                             {message.text}
                           </Alert>
                         )}

                         <div className="mb-3">
                           <Label className="form-label fw-semibold text-dark">Your Information</Label>
                           <div className="mb-2">
                             <Input
                               type="text"
                               placeholder="Your Full Name"
                               value={this.state.donorName}
                               onChange={(e) => this.setState({ donorName: e.target.value })}
                               style={{
                                 borderRadius: '12px',
                                 border: '2px solid #f0f0f0',
                                 padding: '12px 16px',
                                 fontSize: '14px'
                               }}
                             />
                           </div>
                           <div className="mb-2">
                             <Input
                               type="email"
                               placeholder="Your Email Address"
                               value={this.state.donorEmail}
                               onChange={(e) => this.setState({ donorEmail: e.target.value })}
                               style={{
                                 borderRadius: '12px',
                                 border: '2px solid #f0f0f0',
                                 padding: '12px 16px',
                                 fontSize: '14px'
                               }}
                             />
                           </div>
                           <div className="mb-3">
                             <Input
                               type="tel"
                               placeholder="Mobile Number"
                               value={this.state.donorMobile}
                               onChange={(e) => this.setState({ donorMobile: e.target.value })}
                               style={{
                                 borderRadius: '12px',
                                 border: '2px solid #f0f0f0',
                                 padding: '12px 16px',
                                 fontSize: '14px'
                               }}
                             />
                           </div>
                         </div>

                         <div className="mb-3">
                           <Label className="form-label fw-semibold text-dark">Choose an amount</Label>
                           <div className="d-flex flex-wrap gap-2">
                             {getCampaignAmounts(this.state.id).map((option, index) => (
                               <Button
                                 key={index}
                                 color="danger"
                                 outline={selectedAmount !== option.amount}
                                 onClick={() => this.onSelectPreset(option.amount)}
                                 style={{
                                   borderRadius: '12px',
                                   borderWidth: 2,
                                   minWidth: option.amount === 0 ? 120 : 140,
                                   fontWeight: 600,
                                   fontSize: '12px',
                                   padding: '8px 12px',
                                   height: 'auto',
                                   whiteSpace: 'normal',
                                   lineHeight: '1.2'
                                 }}
                               >
                                 {option.label}
                               </Button>
                             ))}
                           </div>
                         </div>

                         {(this.state.id === "2" || this.state.id === "4") && selectedAmount === null && (
                           <div className="mb-3">
                             <Label className="form-label fw-semibold text-dark">Or enter a custom amount</Label>
                             <div className="input-group">
                               <span className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>₹</span>
                               <Input
                                 type="number"
                                 min="0"
                                 step="1"
                                 value={customAmount}
                                 onChange={(e) => {
                                   this.setState({ customAmount: e.target.value, selectedAmount: null, message: null });
                                 }}
                                 placeholder="Enter amount"
                                 className="form-control form-control-lg"
                                 style={{ borderTopRightRadius: 12, borderBottomRightRadius: 12 }}
                               />
                             </div>
                             <div className="form-text">Minimum donation is ₹50</div>
                           </div>
                         )}
                         
                         {this.state.id !== "2" && this.state.id !== "4" && (
                           <div className="mb-3">
                             <Label className="form-label fw-semibold text-dark">Or enter a custom amount</Label>
                             <div className="input-group">
                               <span className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>₹</span>
                               <Input
                                 type="number"
                                 min="0"
                                 step="1"
                                 value={customAmount}
                                 onChange={(e) => {
                                   this.setState({ customAmount: e.target.value, selectedAmount: null, message: null });
                                 }}
                                 placeholder="Enter amount"
                                 className="form-control form-control-lg"
                                 style={{ borderTopRightRadius: 12, borderBottomRightRadius: 12 }}
                               />
                             </div>
                             <div className="form-text">Minimum donation is ₹50</div>
                           </div>
                         )}

                         <div className="d-grid mt-3">
                           <Button
                             color="danger"
                             className="fw-semibold"
                             style={{ backgroundColor: '#dc3545', border: 'none', padding: '12px 16px', borderRadius: 12 }}
                             onClick={this.onDonate}
                             disabled={submitting || effectiveAmount < 50}
                           >
                             {submitting ? 'Processing...' : `Donate ₹${effectiveAmount > 0 ? effectiveAmount : 0}`}
                           </Button>
                         </div>
                         <Button
                           outline
                           color="danger"
                           className="w-100 mt-2"
                           style={{ borderWidth: 2, borderRadius: 12, fontWeight: 600 }}
                           onClick={() => {
                             const shareData = {
                               title: "Support Punjab Flood Relief",
                               text: "Help flood-affected families in Punjab. Donate now and make a difference!",
                               url: window.location.href,
                             };
                             if (navigator.share) {
                               navigator.share(shareData).catch((error) => console.error("Error sharing", error));
                             } else {
                               navigator.clipboard.writeText(shareData.url).then(() => {
                                 alert("Link copied to clipboard!");
                               });
                             }
                           }}
                         >
                           Share
                         </Button>
                       </div>
                     </div>
                   </div>
                 </Col>
               )}
               
                               <Col lg={8} md={12} style={{ marginRight: window.innerWidth > 768 ? '33.333333%' : '0' }}>

                                                             <div style={{ background: '#fff', padding: '24px 24px 40px 24px', borderBottom: '1px solid #eee' }} className="d-none d-lg-block">
                 <div className="d-flex align-items-center gap-3 mb-3">
                   <img src={logodark} alt="BUSBUDDY" height="56" style={{ borderRadius: 8 }} />
                   <div>
                     <h3 className="mb-1" style={{ fontWeight: 800, color: '#222' }}>BUSBUDDY Campaigns</h3>
                     <div className="text-muted" style={{ fontSize: 14 }}>Join us to support the cause and make an impact</div>
                   </div>
                 </div>
                 <div className="d-flex align-items-center" style={{ gap: 16 }}>
                   <div style={{ width: '100%', height: 10, background: '#f1f1f1', borderRadius: 999 }}>
                     <div style={{ width: this.state.Donations[0].TotalAmount/10000000*100, height: '100%', background: '#dc3545', borderRadius: 999 }}></div>
                   </div>
                   <div style={{ minWidth: 80, color: '#dc3545', fontWeight: 700 }}>{(this.state.Donations[0].TotalAmount/10000000*100).toFixed(3)}%</div>
                 </div>
                 <div style={{fontWeight:800}}>
                   Target ₹1 Crore
                 </div>
               </div>
                {/* <div style={{ width: '100%', position: 'relative', backgroundColor: '#111' }}> */}
                  {/* <img
                    src={this.state.id== 1  ? tourismImg :this.state.id== 2 ? treesImg : this.state.id== 3 ? floodImg : childImg  }
                    alt="Fundraising"
                    style={{ width: '100%', height: '420px', objectFit: 'cover', opacity: 0.95 }}
                  /> */}
                {/* </div> */}

                <div style={{ width: '55%', position: 'relative', backgroundColor: 'white', height: 411 }}>
            <img
             src={this.state.id== 1  ? tourismImg :this.state.id== 2 ? treesImg : this.state.id== 3 ? floodImg : childImg  }
             
              style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.95 }}
              onError={(e) => { e.currentTarget.src = logodark; }}
            />
          </div>
               

                <div style={{ background: '#fff', padding: '24px', minHeight: '40vh' }}>
                  <h5 className="mb-3" style={{ fontWeight: 700, color: '#222' }}>Story</h5>
                                     <p className="text-muted" style={{ lineHeight: 1.8 }}>
                  {this.state.id== 1  ? 'Support Sustainable Tourism Help us preserve natural wonders, promote local culture, and empower communities through tourism. Your contribution will create jobs, protect heritage sites, and build unforgettable experiences for travelers worldwide. Lets make tourism a force for good—together!' :this.state.id== 2 ? 'Plant a Tree, Grow a Future! Join us in restoring green spaces and fighting climate change. Your support will help plant trees, clean our air, and create a healthier planet for generations to come. Every donation brings us closer to a greener tomorrow!' : this.state.id== 3 ? 'Heavy floods have devastated parts of Punjab, leaving families without homes, food, or basic necessities. Your contribution, no matter how small, can provide essential relief—clean water, medical aid, and shelter—to those in urgent need. Donate today and help rebuild lives.' : 'Give a Child the Gift of Education Millions of children dream of going to school but lack resources. Your support can provide books, uniforms, and a safe learning environment. Together, we can break the cycle of poverty and light the path to a brighter future.' } 
                   </p>

                   {/* Impact Chart Section */}
                   <div style={{ marginTop: 40, padding: '24px', background: '#f8f9fb', borderRadius: 16 }}>
                     <h4 style={{ fontWeight: 700, color: '#222', marginBottom: 16 }}>The Power of Your Donation</h4>
                     <p style={{ color: '#6c757d', lineHeight: 1.6, marginBottom: 24 }}>
                       Every contribution, no matter the size, translates directly into meaningful impact. This chart illustrates the tangible difference your generosity can make.
                     </p>
                     
                     <div style={{ maxWidth: 600 }}>
                       {/* Chart Bars */}
                       <div style={{ marginBottom: 20 }}>
                         <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                           <div style={{ 
                             width: '100px', 
                             height: '20px', 
                             background: '#dc3545', 
                             borderRadius: '4px',
                             marginRight: '12px'
                           }}></div>
                           <span style={{ fontWeight: 600, color: '#222' }}>
                             {this.state.id == 1 ? '₹500 - Can support local tourism infrastructure' :
                              this.state.id == 2 ? '₹500 - Can plant 10 trees' :
                              this.state.id == 3 ? '₹500 - Can feed an entire family for a day' :
                              '₹500 - Can provide education supplies for 10 children'}
                           </span>
                         </div>
                       </div>
                       
                       <div style={{ marginBottom: 20 }}>
                         <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                           <div style={{ 
                             width: '200px', 
                             height: '20px', 
                             background: '#ffc107', 
                             borderRadius: '4px',
                             marginRight: '12px'
                           }}></div>
                           <span style={{ fontWeight: 600, color: '#222' }}>
                             {this.state.id == 1 ? '₹2000 - Can create sustainable tourism jobs' :
                              this.state.id == 2 ? '₹2000 - Can plant 40 trees' :
                              this.state.id == 3 ? '₹2000 - Can provide emergency shelter materials' :
                              '₹2000 - Can provide complete education for 40 children'}
                           </span>
                         </div>
                       </div>
                       
                       <div style={{ marginBottom: 20 }}>
                         <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                           <div style={{ 
                             width: '300px', 
                             height: '20px', 
                             background: '#28a745', 
                             borderRadius: '4px',
                             marginRight: '12px'
                           }}></div>
                           <span style={{ fontWeight: 600, color: '#222' }}>
                             {this.state.id == 1 ? '₹3000 - Can preserve cultural heritage sites' :
                              this.state.id == 2 ? '₹3000 - Can plant 60 trees' :
                              this.state.id == 3 ? '₹3000 - Can supply a community with essential medicines' :
                              '₹3000 - Can provide education and meals for 60 children'}
                           </span>
                         </div>
                       </div>
                       
                       {/* Scale */}
                       <div style={{ 
                         display: 'flex', 
                         justifyContent: 'space-between', 
                         marginTop: 16,
                         paddingTop: 16,
                         borderTop: '1px solid #dee2e6'
                       }}>
                         <span style={{ fontSize: '12px', color: '#6c757d' }}>₹0</span>
                         <span style={{ fontSize: '12px', color: '#6c757d' }}>₹500</span>
                         <span style={{ fontSize: '12px', color: '#6c757d' }}>₹1000</span>
                         <span style={{ fontSize: '12px', color: '#6c757d' }}>₹1500</span>
                         <span style={{ fontSize: '12px', color: '#6c757d' }}>₹2000</span>
                         <span style={{ fontSize: '12px', color: '#6c757d' }}>₹2500</span>
                         <span style={{ fontSize: '12px', color: '#6c757d' }}>₹3000</span>
                       </div>
                     </div>
                   </div>
                  {/* <ul className="text-muted" style={{ lineHeight: 2 }}>
                    <li>₹75 provides essential supplies for a day</li>
                    <li>₹300 supports a family with basic needs for a day</li>
                    <li>₹1000 helps fund critical projects</li>
                  </ul> */}
                </div>
              </Col>

                             <Col lg={4} className="bg-white d-none d-lg-block" style={{ 
                 borderLeft: '1px solid #eee', 
                 position: 'fixed',
                 right: 0,
                 top: 0,
                 height: '100vh',
                 overflowY: 'auto',
                 width: '33.333333%'
               }}>
                <div style={{ padding: '24px' }}>
                  <div className="mb-3" style={{
                    background: '#fff',
                    border: '1px solid #f0f0f0',
                    borderRadius: 16,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
                  }}>
                    <div style={{ padding: 20 }}>
                      <div className="text-center mb-2" style={{ fontSize: 28, fontWeight: 800, color: '#222' }}>₹{this.state.Donations[0].TotalAmount}</div>
                      <div className="text-center text-muted" style={{ fontSize: 13 }}>raised by {this.state.Donations[0].TotalSupporters} supporters</div>
                      <div className="d-grid mt-3">
                        <Button
                          color="danger"
                          className="fw-semibold"
                          style={{ backgroundColor: '#dc3545', border: 'none', padding: '12px 16px', borderRadius: 12 }}
                          onClick={this.onDonate}
                          disabled={submitting || effectiveAmount < 50}
                        >
                          {submitting ? 'Processing...' : 'Donate Now'}
                        </Button>
                      </div>
                      {/* <Button
                        outline
                        color="danger"
                        className="w-100 mt-2"
                        style={{ borderWidth: 2, borderRadius: 12, fontWeight: 600 }}
                      >
                        Share
                      </Button> */}

                    <Button
                    outline
                    color="danger"
                    className="w-100 mt-2"
                    style={{ borderWidth: 2, borderRadius: 12, fontWeight: 600 }}
                    onClick={() => {
                        const shareData = {
                        title: "Support Punjab Flood Relief",
                        text: "Help flood-affected families in Punjab. Donate now and make a difference!",
                        url: window.location.href,
                        };

                        if (navigator.share) {
                        navigator.share(shareData).catch((error) => console.error("Error sharing", error));
                        } else {
                        navigator.clipboard.writeText(shareData.url).then(() => {
                            alert("Link copied to clipboard!");
                        });
                        }
                    }}
                    >
                    Share
                    </Button>

                    </div>
                  </div>

                  {message && (
                    <Alert color={message.type} className="border-0 rounded-3 mb-3" style={{
                      backgroundColor: message.type === 'success' ? '#e6ffed' : '#fee',
                      border: message.type === 'success' ? '1px solid #b7f5c9' : '1px solid #fcc',
                      color: message.type === 'success' ? '#1b7f3b' : '#c33'
                    }}>
                      {message.text}
                    </Alert>
                  )}

                  <div className="mb-3">
                    <Label className="form-label fw-semibold text-dark">Your Information</Label>
                    <div className="mb-2">
                      <Input
                        type="text"
                        placeholder="Your Full Name"
                        value={this.state.donorName}
                        onChange={(e) => this.setState({ donorName: e.target.value })}
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #f0f0f0',
                          padding: '12px 16px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div className="mb-2">
                      <Input
                        type="email"
                        placeholder="Your Email Address"
                        value={this.state.donorEmail}
                        onChange={(e) => this.setState({ donorEmail: e.target.value })}
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #f0f0f0',
                          padding: '12px 16px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <Input
                        type="tel"
                        placeholder="Mobile Number"
                        value={this.state.donorMobile}
                        onChange={(e) => this.setState({ donorMobile: e.target.value })}
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #f0f0f0',
                          padding: '12px 16px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                                     <div className="mb-3">
                     <Label className="form-label fw-semibold text-dark">Choose an amount</Label>
                     <div className="d-flex flex-wrap gap-2">
                       {getCampaignAmounts(this.state.id).map((option, index) => (
                         <Button
                           key={index}
                           color="danger"
                           outline={selectedAmount !== option.amount}
                           onClick={() => this.onSelectPreset(option.amount)}
                           style={{
                             borderRadius: '12px',
                             borderWidth: 2,
                             minWidth: option.amount === 0 ? 120 : 140,
                             fontWeight: 600,
                             fontSize: '12px',
                             padding: '8px 12px',
                             height: 'auto',
                             whiteSpace: 'normal',
                             lineHeight: '1.2'
                           }}
                         >
                           {option.label}
                         </Button>
                       ))}
                     </div>
                   </div>

                                     {(this.state.id === "2" || this.state.id === "4") && selectedAmount === null && (
                     <div className="mb-3">
                       <Label className="form-label fw-semibold text-dark">Or enter a custom amount</Label>
                       <div className="input-group">
                         <span className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>₹</span>
                         <Input
                           type="number"
                           min="0"
                           step="1"
                           value={customAmount}
                           onChange={(e) => {
                             this.setState({ customAmount: e.target.value, selectedAmount: null, message: null });
                           }}
                           placeholder="Enter amount"
                           className="form-control form-control-lg"
                           style={{ borderTopRightRadius: 12, borderBottomRightRadius: 12 }}
                         />
                       </div>
                       <div className="form-text">Minimum donation is ₹50</div>
                     </div>
                   )}
                   
                   {this.state.id !== "2" && this.state.id !== "4" && (
                     <div className="mb-3">
                       <Label className="form-label fw-semibold text-dark">Or enter a custom amount</Label>
                       <div className="input-group">
                         <span className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>₹</span>
                         <Input
                           type="number"
                           min="0"
                           step="1"
                           value={customAmount}
                           onChange={(e) => {
                             this.setState({ customAmount: e.target.value, selectedAmount: null, message: null });
                           }}
                           placeholder="Enter amount"
                           className="form-control form-control-lg"
                           style={{ borderTopRightRadius: 12, borderBottomRightRadius: 12 }}
                         />
                       </div>
                       <div className="form-text">Minimum donation is ₹50</div>
                     </div>
                   )}

                  <div className="d-grid">
                    <Button
                      color="danger"
                      className="btn btn-lg fw-semibold text-white"
                      style={{
                        backgroundColor: '#dc3545',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '14px',
                        fontSize: '16px',
                        boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
                      }}
                      onClick={this.onDonate}
                      disabled={submitting}
                    >
                      {submitting ? 'Processing...' : `Donate ₹${effectiveAmount > 0 ? effectiveAmount : 0}`}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
            <Modal isOpen={submitting} centered>
          <ModalBody className="text-center">
            <div className="d-flex flex-column align-items-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>Please wait while we process your request...</div>
            </div>
          </ModalBody>
        </Modal>
        </div>
      </div>
    );
  }
}

export default Funding;


