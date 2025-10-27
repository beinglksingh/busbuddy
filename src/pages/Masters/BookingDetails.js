import React, { Component } from 'react';
import cities from './cities';
import { API_WEB_URLS } from 'constants/constAPI';
import { Modal, ModalBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Ticket.css';
import { Fn_DisplayData } from 'store/functions';

class BookingDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {
        
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
    };
    this.obj = this;
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/BookingDetails";
    // Bindings
   
  }




  

  componentDidMount() {
    const busdata = JSON.parse(localStorage.getItem("busdata"));
    const { id } = this.props.match.params;
    // Fetch booking details using the id from params
    if (id) {
      // If you want to use your API_URL, you can do:
      fetch(API_WEB_URLS.BASE +  `${this.API_URL}/Id/${id}`)
        .then(response => response.json())
        .then(data => {
          // Assuming data.data contains the booking details
          if (data && data.data) {
            // If your API returns a single object
            this.setState({ formData: data.data.dataList[0] });

          }
        })
        .catch(error => {
          console.error('Error fetching booking details:', error);
        });
  
    }

   
  }




  render() {
    const { formData} = this.state;
   

    return (
      <div className="rb-ticket-wrapper">
        <div className="rb-ticket-header">
          <div className="rb-brand">
            <div className="rb-logo">BUSBUDDY</div>
            <div className="rb-title">eTICKET</div>
          </div>
          <div className="rb-help">
            <div className="rb-help-head">Need help with your trip?</div>
            <div className="rb-help-body">7425025073<br/>care@busbuddy.co.in</div>
            <div className="rb-meta">Ticket no: {formData.tktNo}<br/>PNR no: {formData.BookingId}</div>
          </div>
        </div>
       

        <div className="rb-route-date">
          {formData.SRC} <span className="rb-arrow">→</span> {formData.DST} <span className="rb-date">{formData.DateOfCreation}</span>
        </div>

        <div className="rb-grid rb-grid-4">
          <div className="rb-cell">
            <div className="rb-operator">{formData.BusName}</div>
            <div className="rb-subtext">{formData.BusType}</div>
          </div>
          <div className="rb-cell">
            <div className="rb-label">Reporting time</div>
            <div className="rb-value">{formData.PickPointTime}</div>
          </div>
          <div className="rb-cell">
            <div className="rb-label">Departure time</div>
            <div className="rb-value">{formData.DropPointTime}</div>
          </div>
          <div className="rb-cell">
            <div className="rb-label">Seat numbers</div>
            <div className="rb-value">{formData.seatId}</div>
          </div>
        </div>

        <div className="rb-grid rb-grid-3 rb-boards">
          <div className="rb-cell">
            <div className="rb-label">Boardings point details</div>
            <div className="rb-value">{formData.PickPointName}</div>
          </div>
          {/* <div className="rb-cell">
            <div className="rb-label">Location</div>
            <div className="rb-value">{landmark}</div>
          </div> */}
          <div className="rb-cell">
            <div className="rb-label">Dropping point details</div>
            <div className="rb-value">{formData.DropPointName}</div>
          </div>
        </div>

        <div className="rb-passenger">
          <div className="rb-row"><span className="rb-bold">{formData.PassengerName}</span></div>
          <div className="rb-row">{formData.seatId}</div>
        </div>

        {/* <div className="rb-note">
          <span className="rb-bold">Note:</span>
        </div> */}

        <div className="rb-fare">
          <div className="rb-fare-amount">Total Fare : <span className="rb-rupee">Rs. {formData.GrossAmount}</span></div>
          <div className="rb-fare-sub">(Inclusive of Rs. {formData.GST} GST)</div>
        </div>
        <div className="rb-actions">
          <a href="/userdashboard" className="rb-btn rb-btn-red">Back to Home</a>
        </div>
      </div>
      
    );
  }
}

export default BookingDetails;
