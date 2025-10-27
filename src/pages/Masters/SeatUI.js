import React, { useState ,useEffect} from 'react';
import './SeatUI.css';
import Seatpic from '../seat.png';
import SeatpicB from '../seatb.png';


const SeatSelector = ({ seats, maxSeats = 6, handleSelect, selectedSeats,handleBooking }) => {


  const getSeatColor = (status) => {
    switch (status) {
      case 'AFA': return 'white';      // Available for Any
      case 'AFM': return 'blue';       // Available for Male
      case 'AFF': return 'pink';       // Available for Female
      case 'BFA':
      case 'BFM':
      case 'BFF': return 'gray';       // Booked
      default: return 'white';         // Default/Unknown
    }
  };

  const seatData = [/* your parsed seat data from API */];
  

  const selectedSeatObjects = seats.filter(seat => selectedSeats.includes(seat.id));
  const totalAmount = selectedSeatObjects.reduce((sum, seat) => sum + seat.fare.total, 0);


  return (
    <>
    <div style={{ display: 'flex', flexWrap: 'wrap', width: '1500px' }}>
      {seats.map((seat) => {
        const isSelected = selectedSeats.includes(seat.id);
        const seatColor = isSelected ? '#0fa11f' : getSeatColor(seat.status);
        const seattextColor = isSelected ? 'white' : 'black';
        const isBooked = seat.status.startsWith('BF');
        

        return (

            <>
            <div
            key={seat.id}
            className={`seat ${isBooked ? 'disabled' : ''}`}
            style={{ backgroundColor: seatColor }}
            onClick={() => !isBooked && handleSelect(seat.id)}
          >
            <img
              src={isSelected ? SeatpicB :Seatpic}
              alt="seat"
              className="seat-icon"
            />
            <div className="seat-name" style={{ color: seattextColor }}>{seat.name}</div>
            <div className="price" style={{ color: seattextColor }}>₹{seat.fare.total}</div>
          </div>

         
          </>
        );
      })}
    </div>

    {selectedSeats.length > 0 && (
        <div className="amount-section">
          <hr />
          <div className="amount-row">
            <span className="label">Amount</span>
            <span className="sub-label">(Taxes will be calculated during payment)</span>
            <span className="amount">INR {totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}
      <div style={{ marginTop: '10px', textAlign: 'right' }}>
      <button type='button' className="book-btn" onClick={()=>handleBooking()}>Book</button>
    </div>
    </>

    
  );
};

export default SeatSelector;
