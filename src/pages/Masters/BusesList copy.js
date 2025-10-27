import React, { Component } from 'react';
import cities from './cities';
import { API_WEB_URLS } from 'constants/constAPI';
import { Modal, ModalBody } from 'reactstrap';

class BusesList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      buses: [{buses : []}],
      fromCityName : '',
      toCityName : '',
      date : '',
      isloading: false,
      isSeatsLoading: false,
      showSeats: false, // for seat selection UI
      seatData: [],     // for seat layout
      selectedSeats: [],// for selected seat ids
      selectedBusId: null, // Track which bus's seats are shown
      showBoardDropModal: false,
      selectedBoardingId: '',
      selectedDroppingId: '',
    };
    this.obj = this;
    // Bindings
    this.getbuses = this.getbuses.bind(this);
    this.viewseats = this.viewseats.bind(this);
    this.handleSeatClick = this.handleSeatClick.bind(this);
    this.handleProceed = this.handleProceed.bind(this);
    this.handleBoardDropConfirm = this.handleBoardDropConfirm.bind(this);
  }

  componentDidMount() {
    const { from, to, date } = this.props.match.params;
    // Find city names by value
    const fromCity = cities.find(city => city.value === from);
    const toCity = cities.find(city => city.value === to);
    this.setState({
      from: from,
      to : to,
      date : date,
      fromCityName: fromCity ? fromCity.label : '',
      toCityName: toCity ? toCity.label : ''
    });
    this.getbuses(from, to, date);
  }

  getbuses = async(from, to, date) => {
    this.setState({ isloading: true });
    const formData = new FormData();
    formData.append('src', from);
    formData.append('dst', to);  
    formData.append('doj', date); // if you're uploading a file
    fetch(API_WEB_URLS.BASE  + 'SearchBus/0/token', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      const parsed = JSON.parse(data.data);
    
      this.setState({buses : parsed.trips, traceId : parsed.traceId, isloading : false, maindata : parsed})
      
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({ isloading: false });
    })
    .finally(() => {
      this.setState({ isloading: false });
    });
  }

  viewseats = async(busId,busName,busType, bus) => {
    this.setState({ isSeatsLoading: true, selectedBusId: busId, showSeats: true, busdata: bus });
    const formData = new FormData();
    formData.append('traceId', this.state.traceId);
    formData.append('busId', busId); 
    formData.append('bpid', 0);
    formData.append('dpid', 0);
    formData.append('seattype', "Vertical"); 
    fetch(API_WEB_URLS.BASE  + 'SearchBusBlocks/0/token', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      const parsed = JSON.parse(data.data);
      this.setState({
        seatslist : parsed ,
        seatData : parsed.seats,
        tripKey: parsed.tripKey,
        traceId : parsed.traceId ,
        src : parsed.summary.src,
        dst : parsed.summary.dst,
        doj : parsed.summary.doj,
        busName : busName,
        busType : busType,
        isSeatsLoading : false,
        busdata : bus,
        showSeats: true, // show seat selection UI
        selectedSeats: [], // reset selection
        selectedBusId: busId, // Set selected bus
      });
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({ isSeatsLoading: false });
    })
    .finally(() => {
      this.setState({ isSeatsLoading: false });
    });
  }

  handleSeatClick(seat) {
    const { selectedSeats } = this.state;
    const isSelected = selectedSeats.includes(seat.id);
    if (isSelected) {
      // Deselect
      this.setState({ selectedSeats: selectedSeats.filter(id => id !== seat.id) });
    } else {
      if (selectedSeats.length >= 6) return; // Max 6
      this.setState({ selectedSeats: [...selectedSeats, seat.id] });
    }
  }

  getGridBounds(seats, z) {
    let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
    seats.filter(s => s.z === z).forEach(seat => {
      minX = Math.min(minX, seat.x);
      minY = Math.min(minY, seat.y);
      maxX = Math.max(maxX, seat.x + seat.width - 1);
      maxY = Math.max(maxY, seat.y + seat.height - 1);
    });
    return { minX, minY, maxX, maxY };
  }

  renderSeatGrid(seats, z, leftOffset = 0) {
    const { selectedSeats } = this.state;
    // Get bounds for the grid
    const { minX, minY, maxX, maxY } = this.getGridBounds(seats, z);
    const seatSize = 48; // px per grid unit
    // For steering icon, only for lower deck
    const isLower = z == 0;
    // Container size
    const seatGridWidth = (maxX - minX + 1) * seatSize;
    const seatGridHeight = (maxY - minY + 1) * seatSize;
    // Filter seats for this deck
    const deckSeats = seats.filter(s => s.z === z);
    return (
      <div style={{
        position: 'relative',
        width: seatGridWidth,
        height: seatGridHeight + 40,
        background: '#fafbfc',
        borderRadius: 20,
        margin: '0 0 24px 0',
        boxShadow: '0 2px 8px #0001',
        padding: 16,
        minWidth: 400,
        minHeight: 200,
      }}>
        {/* Deck label and steering */}
        <div style={{ position: 'absolute', left: 16, top: 8, fontWeight: 700, fontSize: 18 }}>{isLower ? 'Lower deck' : 'Upper deck'}</div>
        {isLower && <div style={{ position: 'absolute', right: 16, top: 8, fontSize: 28, color: '#bbb' }}> <span role="img" aria-label="steering">🛞</span></div>}
        {/* Render seats */}
        {deckSeats.map(seat => {
          const isSelected = selectedSeats.includes(seat.id);
          const isBooked = seat.status && seat.status.startsWith('B');
          const isFemale = seat.status && seat.status.endsWith('F');
          const isMale = seat.status && seat.status.endsWith('M');
          const isSleeper = seat.width > 1;
          // Colors
          let bg = '#fff', border = '#1aaf5d', color = '#222', opacity = 1;
          if (isBooked) { bg = '#eee'; border = '#bbb'; color = '#bbb'; opacity = 0.6; }
          if (isSelected) { bg = '#0fa11f'; border = '#0fa11f'; color = '#fff'; }
          if (isFemale && !isBooked) { border = '#e91e63'; }
          if (isMale && !isBooked) { border = '#2196f3'; }
          // Position
          const left = (seat.x - minX) * seatSize + leftOffset;
          const top = (seat.y - minY) * seatSize + 32;
          // Sleeper seat dimensions
          const sleeperWidth = seatSize - 8;
          const sleeperHeight = seat.height * seatSize * 2 - 8;
          return (
            <div
              key={seat.id}
              onClick={() => !isBooked && this.handleSeatClick(seat)}
              style={{
                position: 'absolute',
                left,
                top,
                width: isSleeper ? sleeperWidth : seat.width * seatSize - 8,
                height: isSleeper ? sleeperHeight : seat.height * seatSize - 8,
                background: bg,
                border: `2px solid ${border}`,
                color,
                borderRadius: isSleeper ? 12 : 8,
                boxShadow: isSelected ? '0 0 0 3px #0fa11f44' : '0 2px 8px #0001',
                opacity,
                cursor: isBooked ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: isSleeper ? 18 : 16,
                zIndex: isSelected ? 2 : 1,
                transition: 'background 0.2s, border 0.2s',
                userSelect: 'none',
              }}
            >
              {/* Gender icon */}
              {isFemale && <span style={{ color: '#e91e63', fontSize: 18, marginBottom: 2 }}>♀️</span>}
              {isMale && <span style={{ color: '#2196f3', fontSize: 18, marginBottom: 2 }}>♂️</span>}
              {/* Seat name */}
              <div>{seat.name}</div>
              {/* Price or Sold */}
              <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>
                {isBooked ? <span style={{ color: '#bbb' }}>Sold</span> : `₹${seat.fare?.total || ''}`}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  handleProceed() {
    // Open modal for boarding/dropping selection
    this.setState({ showBoardDropModal: true });
  }

  handleBoardDropConfirm() {
    // You can use selectedBoardingId and selectedDroppingId for next steps
    this.setState({ showBoardDropModal: false });
    const busdata  =  {
      busid : this.state.selectedBusId,
      busname : this.state.busdata.name,
      bustype : this.state.busdata.type,
      date : this.state.date,
      DpId :  this.state.selectedDroppingId,
      BpId : this.state.selectedBoardingId,
      BpName   : this.state.busdata.boarding.find(bp => bp.id === this.state.selectedBoardingId).name,
      DpName : this.state.busdata.dropping.find(dp => dp.id === this.state.selectedDroppingId).name,
      Seats : this.state.selectedSeats,
      Dptime : this.state.busdata.timeD,
      Bptime : this.state.busdata.timeA,
      traceid : this.state.traceId,
      tripkey : this.state.tripKey,
      from : this.state.from,
      to : this.state.to,
      src : this.state.fromCityName,
      dst : this.state.toCityName,
      fare : this.state.busdata.fares[0].total,
      totalfare : Number(this.state.busdata.fares[0].total)*Number(this.state.selectedSeats.length),
    }
    localStorage.setItem("busdata", JSON.stringify(busdata));
      this.props.history.push(`/passengerdetails`);
  }

  render() {
    const { buses, showSeats, seatData, selectedSeats, selectedBusId, showBoardDropModal, selectedBoardingId, selectedDroppingId, busdata } = this.state;
    return (
      <div style={{ background: '#f5f5fa', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0 0 0' }}>
          <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 8px #0001', display: 'flex', alignItems: 'center', padding: '24px 32px', gap: 32, minWidth: 900 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="from" style={{ fontSize: 24 }}>🚌</span>
              <div>
                <div style={{ fontSize: 14, color: '#888' }}>From</div>
                <div style={{ fontWeight: 600, fontSize: 20 }}>{this.state.fromCityName}</div>
              </div>
            </div>
            <div style={{ fontSize: 24, color: '#aaa' }}>⇄</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="to" style={{ fontSize: 24 }}>🚌</span>
              <div>
                <div style={{ fontSize: 14, color: '#888' }}>To</div>
                <div style={{ fontWeight: 600, fontSize: 20 }}>{this.state.toCityName}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="calendar" style={{ fontSize: 24 }}>📅</span>
              <div>
                <div style={{ fontSize: 14, color: '#888' }}>Date of journey</div>
                <div style={{ fontWeight: 600, fontSize: 20 }}>
                  {(() => {
                    // Format date as "02 Jun, 2025"
                    const dateStr = this.state.date;
                    if (!dateStr) return '';
                    const dateObj = new Date(dateStr);
                    if (isNaN(dateObj)) return this.state.date;
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = dateObj.toLocaleString('en-US', { month: 'short' });
                    const year = dateObj.getFullYear();
                    return `${day} ${month}, ${year}`;
                  })()}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ background: '#ffe6e6', border: 'none', borderRadius: 20, padding: '8px 20px', fontWeight: 600, color: '#d44', fontSize: 16 }}>Today</button>
              <button style={{ background: '#ffe6e6', border: 'none', borderRadius: 20, padding: '8px 20px', fontWeight: 600, color: '#d44', fontSize: 16 }}>Tomorrow</button>
            </div>
            <button style={{ background: '#d44', border: 'none', borderRadius: '50%', width: 48, height: 48, color: '#fff', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔍</button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', maxWidth: 1400, margin: '40px auto 0 auto', gap: 32 }}>
          {/* Sidebar Filters */}
          <div style={{ width: 320, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px #0001', minHeight: 400 }}>
            <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Filter buses</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
              {['Primo', 'AC', 'Sleeper', 'Single seat', 'Seater', 'Non-AC', 'Evening', 'High rated', 'Live tracking'].map((filter, i) => (
                <button key={i} style={{ background: '#f5f5fa', border: '1px solid #ddd', borderRadius: 12, padding: '8px 16px', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>{filter}</button>
              ))}
            </div>
            <div style={{ fontWeight: 600, fontSize: 18, margin: '24px 0 8px 0' }}>Departure time from source</div>
            <div style={{ fontWeight: 600, fontSize: 18, margin: '24px 0 8px 0' }}>Arrival time at destination</div>
          </div>

          {/* Bus List */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
            {this.state.isloading ? (
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px #0001', textAlign: 'center', fontWeight: 600 }}>Loading buses...</div>
            ) : (
            (buses && buses[0] && buses[0].buses ? buses[0].buses : []).map(bus => {
          // Debug log to inspect bus structure
              return (
                <React.Fragment key={bus.id}>
                  <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 8px #0001', padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ color: '#888', fontWeight: 500, fontSize: 16, marginBottom: 8 }}>{'Direct Bus'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 22 }}>{bus.name} <span role="img" aria-label="bus">🚌</span></div>
                        <div style={{ color: '#888', fontSize: 16, margin: '4px 0 8px 0' }}>{bus.type}</div>
                        {/* {bus.freeChange && <div style={{ display: 'inline-block', background: '#f5f5fa', border: '1px solid #d44', color: '#d44', borderRadius: 8, padding: '2px 10px', fontSize: 14, marginBottom: 4 }}>🚌 Free bus change</div>}
                        <div style={{ color: '#b88', background: '#f5f5fa', borderRadius: 8, display: 'inline-block', padding: '2px 10px', fontSize: 14, marginTop: 4 }}>{bus.offer}</div> */}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ background: '#e6f7e6', color: '#228B22', borderRadius: 8, padding: '4px 10px', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span role="img" aria-label="star">⭐</span> {4.1}
                          </div>
                          {/* <div style={{ color: '#888', fontSize: 14 }}>{bus.ratingCount}</div> */}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 22 }}>
                          {bus.timeD.split('T')[1].substring(0, 5)} <span style={{ color: '#888', fontWeight: 400 }}>—</span> {bus.timeA.split('T')[1].substring(0, 5)}
                        </div>
                        <div style={{ color: '#888', fontSize: 16 }}>
                          {(() => {
                            // Calculate duration in hours and minutes
                            const dep = bus.timeD;
                            const arr = bus.timeA;
                            if (dep && arr) {
                              const depDate = new Date(dep);
                              let arrDate = new Date(arr);
                              // If arrival is before departure, assume next day
                              if (arrDate < depDate) {
                                arrDate.setDate(arrDate.getDate() + 1);
                              }
                              const diffMs = arrDate - depDate;
                              const hours = Math.floor(diffMs / (1000 * 60 * 60));
                              const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                              return `${hours}h ${minutes}m`;
                            }
                            return '';
                          })()} • <span style={{ color: '#d44' }}>{bus.seats.avlAll}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {/* {bus.lastMin && <div style={{ background: '#ffe6a1', color: '#b88a00', borderRadius: 8, padding: '2px 10px', fontWeight: 700, fontSize: 14, display: 'inline-block', marginBottom: 4 }}>Last min. ₹200 OFF</div>} */}
                        <div style={{ fontWeight: 700, fontSize: 24, color: '#222' }}>₹{bus.fares[0].total} <span style={{ color: '#888', fontWeight: 400, textDecoration: bus.fares[0].total+100 ? 'line-through' : 'none', fontSize: 18, marginLeft: 8 }}>{bus.fares[0].total+100 ? `₹${bus.fares[0].total+100}` : ''}</span></div>
                        <div style={{ color: '#888', fontSize: 14 }}>Onwards</div>
                      </div>
                      <button onClick={() => this.viewseats(bus.id,bus.name,bus.type,bus)} style={{ background: '#d44', color: '#fff', border: 'none', borderRadius: 32, padding: '16px 32px', fontWeight: 700, fontSize: 20, marginLeft: 24, cursor: 'pointer' }}>View seats</button>
                    </div>
                  </div>
                  {/* Seat Selection Modal/Section for this bus */}
                  {showSeats && selectedBusId === bus.id && (
                    <div style={{ background: '#fff', borderRadius: 16, padding: 24, margin: '24px 0', boxShadow: '0 2px 8px #0001' }}>
                      {this.state.isSeatsLoading ? (
                        <div style={{ textAlign: 'center', fontWeight: 600 }}>Loading seats...</div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'row', gap: 32 }}>
                            <div>
                              <h3 style={{ marginBottom: 8 }}>Lower Berth</h3>
                              {this.renderSeatGrid(seatData, 0)}
                            </div>
                            <div>
                              <h3 style={{ marginBottom: 8 }}>Upper Berth</h3>
                              {this.renderSeatGrid(seatData, 1, this.getGridBounds(seatData, 0).maxX * 48 + 32)}
                            </div>
                          </div>
                          <div style={{ margin: '16px 0', fontWeight: 600 }}>
                            Selected Seats: {selectedSeats.join(', ') || 'None'}
                            {selectedSeats.length >= 6 && <span style={{ color: '#d44', marginLeft: 12 }}>(Max 6 seats)</span>}
                          </div>
                          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                            <button onClick={() => this.setState({ showSeats: false, selectedBusId: null })} style={{ background: '#d44', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>Cancel</button>
                            {selectedSeats.length > 0 && (
                              <button onClick={this.handleProceed} style={{ background: '#0fa11f', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>Proceed</button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })
            )}
          </div>
        </div>

        {/* Modal for Boarding/Dropping Selection */}
        <Modal isOpen={showBoardDropModal} toggle={() => this.setState({ showBoardDropModal: false })} centered={true}>
          <ModalBody>
            <h4 className="mb-3">Select Boarding & Dropping Point</h4>
            <div className="mb-3">
              <label htmlFor="boarding-select" className="form-label">Boarding Point</label>
              <select
                id="boarding-select"
                className="form-control"
                value={selectedBoardingId}
                onChange={e => this.setState({ selectedBoardingId: e.target.value })}
              >
                <option value="">Select Boarding</option>
                {busdata && busdata.boarding && busdata.boarding.map(point => (
                  <option key={point.id} value={point.id}>{point.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="dropping-select" className="form-label">Dropping Point</label>
              <select
                id="dropping-select"
                className="form-control"
                value={selectedDroppingId}
                onChange={e => this.setState({ selectedDroppingId: e.target.value })}
              >
                <option value="">Select Dropping</option>
                {busdata && busdata.dropping && busdata.dropping.map(point => (
                  <option key={point.id} value={point.id}>{point.name}</option>
                ))}
              </select>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-light" onClick={() => this.setState({ showBoardDropModal: false })}>Cancel</button>
              <button className="btn btn-danger" type="button" disabled={!selectedBoardingId || !selectedDroppingId} onClick={this.handleBoardDropConfirm}>Confirm</button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default BusesList;
