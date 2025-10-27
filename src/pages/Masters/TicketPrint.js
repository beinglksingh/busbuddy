import React, { useEffect, useState } from 'react';
import logo from './logo.jpg';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from 'pages/loader';
import './print.css'


const TicketPrint = () => {

    const [ticketData, setTicketData] = useState(null);
 
   const cancellationPolicy = [
      { time: 'Between 0 to 6 hrs', charge: '100 %' },
      { time: 'Between 6 to 12 hrs', charge: '75 %' },
      { time: 'Between 12 to 24 hrs', charge: '60 %' },
      { time: 'Between 24 to 48 hrs', charge: '35 %' },
      { time: 'Between 48 to 53 hrs', charge: '20 %' },
      { time: 'Before 53 hrs', charge: '10 %' },
    ]


 const { id } = useParams();
useEffect(() => {
    // Replace this with your actual API URL
    axios.get('http://lk.shinewellinnovation.com/api/V1/Masters/0/token/TicketDetails/'+id+'/0')
      .then(response => {
        setTicketData(response.data.data.dataList[0]);
      })
      .catch(error => {
        console.error('Error fetching ticket data:', error);
      });
  }, []);



 const handlePrint = () => {
    window.print();
  };


  return (


     <React.Fragment>
              <div className="page-content">

{ticketData!=null ? 

<>
<div className="no-print" style={{ textAlign: 'center', marginBottom: '15px' }}>
  <button onClick={handlePrint} style={{ marginRight: 10 }}>🖨️ Print</button>
  {/* <button onClick={handleDownloadPDF}>📄 Download PDF</button> */}
</div>

    <div style={{ fontFamily: 'Arial', maxWidth: 800, margin: 'auto', padding: 20, border: '1px solid #000' }}>
      <img src={logo} width={93}/>
      <div style={{ textAlign: 'right' }}>Booking Confirmation<br />Booked on: {ticketData.BookedDate}</div>
      <hr />

      <h3>Dear {ticketData.PassengerName} Ji,</h3>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
        <thead><tr><th colSpan="2">Trip details</th></tr></thead>
        <tbody>
          <tr><td><b>Trip Name</b></td><td>{ticketData.TripName}</td></tr>
          <tr><td><b>PNR</b></td><td>{ticketData.PNR}</td></tr>
          <tr><td><b>Operator name</b></td><td>{ticketData.BusName}</td></tr>
          <tr><td><b>Coach type</b></td><td>{ticketData.BusType}</td></tr>
          {/* <tr><td><b>Boarding time</b></td><td>{ticketData.trip.boardingTime}</td></tr> */}
          <tr><td><b>Boarding point</b></td><td>{ticketData.PickPointName}<br /></td></tr>
          <tr><td><b>Pickup man details</b></td><td></td></tr>
        </tbody>
      </table>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead><tr><th colSpan="2">Passenger details</th></tr></thead>
        <tbody>
          <tr>
            <td><b>Name, Age, Sex</b><br />{ticketData.PassengerName}, {ticketData.Age}, {ticketData.Gender}</td>
            <td><b>Seat number</b><br />{ticketData.seatId}</td>
          </tr>
        </tbody>
      </table>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead><tr><th colSpan="2">Fare breakup</th></tr></thead>
        <tbody>
          <tr><td>Base fare</td><td>₹ {ticketData.Amount}</td></tr>
          <tr><td>Insurance</td><td>₹ 0</td></tr>
          <tr><td>GST</td><td>₹ {ticketData.GST}</td></tr>
          <tr><td><b>Total price paid</b></td><td><b>₹ {ticketData.GrossAmount}</b></td></tr>
        </tbody>
      </table>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead><tr><th colSpan="2">Cancellation policy</th></tr></thead>
        <tbody>
          {cancellationPolicy.map((row, index) => (
            <tr key={index}>
              <td>{row.time}</td>
              <td>{row.charge}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div> 
    </>
    : <Loader/>}
    </div>
    </React.Fragment>
  );
};


export default TicketPrint;
