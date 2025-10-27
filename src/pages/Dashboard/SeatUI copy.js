import React from 'react';
import './test.css';

const SeatLayout = ({ seats, selectedSeats, handleSelect }) => {
  const maxX = Math.max(...seats.map(s => s.x));
  const maxY = Math.max(...seats.map(s => s.y));

  const getSeatAt = (x, y) => seats.find(s => s.x === x && s.y === y);

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


  const renderSeatBox = (seat) => {
    const isBooked = seat.status.startsWith('BF');
    const isSleeper = seat.desc.toLowerCase().includes('sleeper');
    
    const isSelected = selectedSeats.includes(seat.id);
    const seatColor = isSelected ? '#0fa11f' : getSeatColor(seat.status);

    const seatClass = `seat-box ${isBooked ? 'booked' : 'available'} ${isSleeper ? 'sleeper' : 'seater'}`;

    return (
      <div
        className={seatClass}
        style={{backgroundColor : seatColor}}
        title={seat.desc}
        onClick={() => !isBooked && handleSelect(seat.id)}
      >
        <div className="seat-name">{seat.name}</div>
        <div className="seat-fare">{seat.fare.total > 0 ? `₹${seat.fare.total}` : ''}</div>
      </div>
    );
  };

  return (
    <div className="layout-wrappers">
      <div className="seat-layout">
        {Array.from({ length: maxY }, (_, rowIndex) => (
          <div className="seat-row" key={rowIndex}>
            {Array.from({ length: maxX }, (_, colIndex) => {
              const seat = getSeatAt(colIndex + 1, rowIndex + 1);
              return (
                <div className="seat-cell" key={colIndex}>
                  {seat ? renderSeatBox(seat) : <div className="empty-slot" />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatLayout;
