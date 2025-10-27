import React from "react";
import { Col } from "reactstrap";

// Example: import or pass this as a prop
// import seatData from "./seatData.json";

const STATUS_COLORS = {
  AFA: "#4caf50", // Available For Any - Green
  AFM: "#2196f3", // Available For Male - Blue
  AFF: "#e91e63", // Available For Female - Pink
  BFA: "#f44336", // Booked For Any - Red
  BFM: "#1976d2", // Booked For Male - Dark Blue
  BFF: "#ad1457", // Booked For Female - Dark Pink
};

const STATUS_LABELS = {
  AFA: "Available (Any)",
  AFM: "Available (Male)",
  AFF: "Available (Female)",
  BFA: "Booked (Any)",
  BFM: "Booked (Male)",
  BFF: "Booked (Female)",
};

function getMaxXY(seats) {
  let maxX = 0, maxY = 0;
  seats.forEach(seat => {
    if (seat.x > maxX) maxX = seat.x;
    if (seat.y > maxY) maxY = seat.y;
  });
  return { maxX, maxY };
}

function SeatGrid({ seats, title, selectedSeats, handleSelect }) {
  const { maxX, maxY } = getMaxXY(seats);

  // Build a 2D array for the grid (support 0-based)
  const grid = Array.from({ length: maxY + 1 }, () =>
    Array.from({ length: maxX + 1 }, () => null)
  );
  seats.forEach(seat => {
    const x = Number(seat.x);
    const y = Number(seat.y);
    if (
      Number.isInteger(x) && Number.isInteger(y) &&
      y >= 0 && y <= maxY &&
      x >= 0 && x <= maxX &&
      grid[y]
    ) {
      grid[y][x] = seat;
    }
  });

  // Find indices of columns that are NOT completely empty
  let nonEmptyColIndices = [];
  if (grid.length > 0) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid.some(row => row[x] !== null)) {
        nonEmptyColIndices.push(x);
      }
    }
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <h3>{title}</h3>
      <div style={{ display: "inline-block", border: "1px solid #ccc", padding: 8 }}>
        {grid.map((row, y) =>
          // Only render rows that have at least one seat
          row.some(cell => cell !== null) ? (
            <div key={y} style={{ display: "flex" }}>
              {nonEmptyColIndices.map(x => {
                const seat = row[x];
                return seat ? (
                  <div
                    key={x}
                    title={`${seat.name} (${seat.desc}) - ${STATUS_LABELS[seat.status]}`}
                    onClick={() => seat.status.startsWith("A") && handleSelect(seat.id)}
                    style={{
                      width: 40,
                      height: 40,
                      margin: 2,
                      background: selectedSeats.includes(seat.id)
                        ? "#ff9800"
                        : STATUS_COLORS[seat.status] || "#eee",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column", // <== Add this line
                      borderRadius: 6,
                      fontWeight: "bold",
                      fontSize: 10, // Optional: reduce font size to fit both lines
                      cursor: seat.status.startsWith("A") ? "pointer" : "not-allowed",
                      border: selectedSeats.includes(seat.id)
                        ? "2px solid #ff9800"
                        : "1px solid #ccc",
                      opacity: seat.status.startsWith("B") ? 0.5 : 1,
                    }}
                  >


                    <div>{seat.name}</div>
  <div>{seat.fare.total}</div>
                  </div>
                ) : (
                  <div
                    key={x}
                    style={{
                      width: 40,
                      height: 40,
                      margin: 2,
                      background: "#f5f5f5",
                    }}
                  />
                );
              })}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default function SeatLayout({ selectedSeats, handleSelect, seats }) {
  const lowerSeats = seats.filter(seat => seat.z === 0);
  const upperSeats = seats.filter(seat => seat.z === 1);

  return (
    <div style={{ padding: 24 }}>
     
      <div style={{ marginBottom: 16 }}>
        <strong>Legend:</strong>
        <div style={{ display: "flex",  marginTop: 8 }}>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} style={{ display: "flex", alignItems: "center",fontSize:10}}>
              <span style={{
                display: "inline-block",
                width: 18,
                height: 18,
                
                background: color,
                borderRadius: 4,
                marginRight: 4,
              }} />
              <span>{STATUS_LABELS[status]}</span>
               
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{
              display: "inline-block",
              width: 18,
              height: 18,
              background: "#ff9800",
              borderRadius: 4,
              marginRight: 4,
            }} />
            <span>Selected</span>
          </div>
        </div>
      </div>

     <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <SeatGrid
        seats={lowerSeats}
        title="Lower Berth"
        selectedSeats={selectedSeats}
        handleSelect={handleSelect}
      />
        
       
         <SeatGrid
        seats={upperSeats}
        title="Upper Berth"
        selectedSeats={selectedSeats}
        handleSelect={handleSelect}
      />
        </div>
      
      
     
    </div>
  );
}
