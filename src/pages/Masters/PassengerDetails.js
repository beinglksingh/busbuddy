import React, { Component } from 'react';
import cities from './cities';
import { API_WEB_URLS } from 'constants/constAPI';
import { Modal, ModalBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class PassengerDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {
        email: '',
        countryCode: '+91 (IND)',
        phone: '',
        state: '',
        whatsapp: false,
        passengerName: '',
        passengerAge: '',
        passengerGender: 'Male',
      },
      buses: [{buses : []}],
      fromCityName : '',
      toCityName : '',
      date : '',
      showSeats: false, // for seat selection UI
      seatData: [],     // for seat layout
      selectedSeats: ['S1 - Upper deck'],// for selected seat ids
      selectedBusId: null, // Track which bus's seats are shown
      showBoardDropModal: false,
      selectedBoardingId: '',
      selectedDroppingId: '',
      busdata : {
        Dptime : '00:00:00T00:00:00',
        Bptime : '00:00:00T00:00:00',
        totalfare : 0
     
      },
      isLoading: false,
    };
    this.obj = this;
    // Bindings
    this.handleProceedToPay = this.handleProceedToPay.bind(this);
  }


  handleProceedToPay = () => {

    var busdata  =  JSON.parse(localStorage.getItem("busdata"));
    
    var traceId  =  busdata.traceid;
    
    var SRC  =  busdata.src;
    var DST  =  busdata.dst;
    var PassengerName  =  this.state.formData.passengerName;
    var Gender  =  this.state.formData.passengerGender;
    var Age  =  this.state.formData.passengerAge;
    var MobileNo  =  this.state.formData.phone;
    var EmailId  =  this.state.formData.email;
    var BusName  =  busdata.busname;
    var DropPointName  =  busdata.DpName;
    var PickPointName  =  busdata.BpName;
    var DropPointTime  =  busdata.Dptime;
    var PickPointTime  =  busdata.Bptime;
    var BusType  =  busdata.bustype;
    var Amount  =  Number(busdata.totalfare)+Number(this.state.busdata.gst);
    var GST  =  "0";
    var GrossAmount  =  busdata.totalfare;
    var seatId  =  busdata.Seats;
    var tripKey  =  busdata.tripkey;
    var bpid  =  busdata.BpId;
    var dpid  =  busdata.DpId;


    try 
    {
    this.setState({ isLoading: true });
    const formData = new FormData();
    formData.append('tripKey', tripKey);
    formData.append('traceId', traceId);
    formData.append('email', EmailId || 'noemail@example.com');
    formData.append('bpid', bpid);
    formData.append('dpid', dpid);
    formData.append('phone', MobileNo);
    formData.append('name', PassengerName);
    formData.append('gender', Gender === 'Male' ? 'M' : 'F');
    formData.append('age', Age);
    formData.append('seatId', seatId);

    fetch(API_WEB_URLS.BASE + 'SearchBusSelect/0/token', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      const parsed = JSON.parse(data.data);
      console.log(parsed);
    
      this.setState({BookedData : parsed});
      
      if(JSON.parse(data.data).trips[0].status  != "BLOCKED"){
        alert(JSON.parse(data.data).trips[0].error.desc);
        this.setState({ isLoading: false });
      }
      else if(JSON.parse(data.data).trips[0].status  == "BLOCKED") {
        const formDatan = new FormData();
        formDatan.append('Amount', Amount);
        formDatan.append('Phone', MobileNo);
        formDatan.append('Email', EmailId);
        formDatan.append('P1Name', PassengerName);
        formDatan.append('P1Age', Age);
        formDatan.append('P1Gender', Gender);
        formDatan.append('BusName', BusName);
        formDatan.append('Seats', seatId);
        formDatan.append('DroppingName', DropPointName);
        formDatan.append('PickupName', PickPointName);
        formDatan.append('DroppingTime', DropPointTime);
        formDatan.append('PickupTime', PickPointTime);
        formDatan.append('BusType', BusType);
        formDatan.append('traceId', traceId);
        formDatan.append('SRC', SRC);
        formDatan.append('DST', DST);
        formDatan.append('BookingId', JSON.parse(data.data).trips[0].blockingId);
        formDatan.append('RefNo', JSON.parse(data.data).trips[0].refNo);

       fetch(API_WEB_URLS.BASE + 'PhonePeURL/0/token', {
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
        this.setState({ isLoading: false });
        if (parsed.redirectUrl && window.PhonePeCheckout) {
          window.PhonePeCheckout.transact({
            tokenUrl: parsed.redirectUrl, // ✅ use tokenUrl key
            callback: (response) => {
              if (response === 'USER_CANCEL') {
                console.log('User cancelled the transaction');
                // handle UI logic here
              } else if (response === 'CONCLUDED') {
                const formDatans = new FormData();
                formDatans.append('RefId', data.message);
               fetch(API_WEB_URLS.BASE + 'PhonePeStatus/0/token', {
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
                      alert("Failed to Book Bus Ticket");
                    }
                    else if (data.status == 200){
                      alert("Bus Ticket Booked Successfully");
                      this.props.history.push(`/bookingdetails/${data.data[0].Id}`);
                    }
                    else {
                      alert('Something went wrong. Please try again later.')
                    }

                });


                console.log('Transaction completed');
                // handle success logic here
              }
            },
            type: "IFRAME" // ✅ use type "IFRAME"
          });
        } else {
          alert("Something went wrong or PhonePeCheckout not available.");
          this.setState({ isLoading: false });
        }
  })
        .catch(error => {
          console.error('Error:', error);
          this.setState({ isLoading: false });
        });

      }
      
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({ isLoading: false });
    });
    }
    catch (error) {
      console.error('Error booking seats:', error);
      
      alert('Booking Error', 'There was an error booking your seats. Please try again.');
      this.setState({ isLoading: false });
    }
    
  }


  

  componentDidMount() {
    const busdata = JSON.parse(localStorage.getItem("busdata"));
    console.log(busdata);
    this.setState({
      busdata : busdata
    });

    // this.loadPhonePeScript(() => {
    //   console.log('PhonePe script loaded successfully');
    // });
  }


  // loadPhonePeScript = (callback) => {
  //   const existingScript = document.querySelector('script[src="https://mercury.phonepe.com/web/bundle/checkout.js"]');
  //   if (!existingScript) {
  //     const script = document.createElement('script');
  //     script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
  //     script.onload = callback;
  //     document.body.appendChild(script);
  //   } else {
  //     callback(); // Already loaded
  //   }
  // };

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  }

  render() {
    const { formData, selectedSeats } = this.state;
    return (
      <div className="container-fluid" style={{ background: '#f5f5fa', minHeight: '100vh', fontFamily: 'Inter, sans-serif', padding: '40px 0' }}>
        <div className="row justify-content-center">
          {/* Left side: Contact & Passenger Details */}
          <div className="col-lg-7">
            {/* Contact Details Card */}
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-1">Contact details</h5>
                <p className="text-muted mb-3" style={{ fontSize: '14px' }}>Ticket details will be sent to</p>
                <form>
                  <div className="mb-3">
                    <input type="email" className="form-control" placeholder="Email ID" name="email" value={formData.email} onChange={this.handleInputChange} />
                  </div>
                  <div className="mb-3 row g-2">
                    <div className="col-4">
                      <select className="form-select" name="countryCode" value={formData.countryCode} onChange={this.handleInputChange}>
                        <option value="+91 (IND)">+91 (IND)</option>
                        {/* <option value="+1 (USA)">+1 (USA)</option>
                        <option value="+44 (UK)">+44 (UK)</option> */}
                        {/* Add more country codes as needed */}
                      </select>
                    </div>
                    <div className="col-8">
                      <input type="tel" className="form-control" placeholder="Phone" name="phone" value={formData.phone} onChange={this.handleInputChange} />
                    </div>
                  </div>
                  {/* <div className="mb-3">
                    <select className="form-select" name="state" value={formData.state} onChange={this.handleInputChange}>
                     
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                    <div className="form-text">Required for GST Tax Invoicing</div>
                  </div> */}
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2" style={{ color: '#25D366', fontSize: '1.5rem' }}>
                      <i className="bi bi-whatsapp"></i>
                    </span>
                    <span className="flex-grow-1">Send booking details and trip updates on WhatsApp</span>
                    <div className="form-check form-switch ms-2">
                      <input className="form-check-input" type="checkbox" name="whatsapp" checked={formData.whatsapp} onChange={this.handleInputChange} />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/* Passenger Details Card */}
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-1">Passenger details</h5>
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2" style={{ fontSize: '2rem', color: '#4a4a4a' }}>
                    <i className="bi bi-person-circle"></i>
                  </span>
                  <div>
                    <div className="fw-bold">Passenger 1</div>
                    {/* <div className="text-muted" style={{ fontSize: '14px' }}>Seat S1, Upper Deck</div> */}
                  </div>
                </div>
                <form>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Name" name="passengerName" value={formData.passengerName} onChange={this.handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <input type="number" className="form-control" placeholder="Age" name="passengerAge" value={formData.passengerAge} onChange={this.handleInputChange} />
                  </div>
                  <div className="mb-2">Gender</div>
                  <div className="d-flex gap-3 mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="passengerGender" id="male" value="Male" checked={formData.passengerGender === 'Male'} onChange={this.handleInputChange} />
                      <label className="form-check-label" htmlFor="male">Male</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="passengerGender" id="female" value="Female" checked={formData.passengerGender === 'Female'} onChange={this.handleInputChange} />
                      <label className="form-check-label" htmlFor="female">Female</label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* Right side: Trip Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="fw-bold mb-1">{this.state.busdata.busname}</div>
                <div className="text-muted mb-2" style={{ fontSize: '14px' }}>{this.state.busdata.bustype}</div>
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 text-center">
                    <div className="fw-bold" style={{ fontSize: '18px' }}>{this.state.busdata.Dptime.split('T')[1].substring(0, 5)}</div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>{this.state.busdata.date}</div>
                  </div>
                  <div className="flex-grow-1 border-start border-2 ps-3">
                    <div className="fw-bold">{this.state.busdata.DpName}</div>
                    {/* <div className="text-muted" style={{ fontSize: '12px' }}>M R Travels, Basni Mandi Mode,Pali Road (Pickup Van)</div> */}
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 text-center">
                    <div className="fw-bold" style={{ fontSize: '18px' }}>{this.state.busdata.Bptime.split('T')[1].substring(0, 5)}</div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>{this.state.busdata.date}</div>
                  </div>
                  <div className="flex-grow-1 border-start border-2 ps-3">
                    <div className="fw-bold">{this.state.busdata.BpName}</div>
                    {/* <div className="text-muted" style={{ fontSize: '12px' }}>Shiv Shankar Travels Polovictory</div> */}
                  </div>
                </div>
                <hr />
                <div className="fw-bold mb-2">Seat details</div>
                <div>
                  {Array.isArray(this.state.busdata.Seats)
                    ? this.state.busdata.Seats.join(', ')
                    : this.state.busdata.Seats}
                  {/* {selectedSeats.map((seat, idx) => (
                    <span key={idx} className="badge bg-light text-success border border-success me-2">{seat}</span>
                  ))} */}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <button
                  className="btn btn-success fw-bold"
                  style={{ fontSize: '20px', padding: '16px 32px', width: '100%', backgroundColor: 'red' }}
                  type="button"
                   onClick={this.handleProceedToPay} // Uncomment and implement this handler as needed
                   disabled={this.state.isLoading}
                >
                  {this.state.isLoading ? (
                    <span className="d-inline-flex align-items-center justify-content-center" style={{ gap: '8px' }}>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Processing...
                    </span>
                  ) : (
                    <>Proceed to Pay ₹ {this.state.busdata.totalfare}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={this.state.isLoading} centered>
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
    );
  }
}


export default PassengerDetails;
