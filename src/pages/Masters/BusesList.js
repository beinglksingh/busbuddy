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
      // responsive/ui state
      isMobile: false,
      showFilters: false,
    };
    this.obj = this;
    // Bindings
    this.getbuses = this.getbuses.bind(this);
    this.viewseats = this.viewseats.bind(this);
    this.handleSeatClick = this.handleSeatClick.bind(this);
    this.handleProceed = this.handleProceed.bind(this);
    this.handleBoardDropConfirm = this.handleBoardDropConfirm.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleSetDateToday = this.handleSetDateToday.bind(this);
    this.handleSetDateTomorrow = this.handleSetDateTomorrow.bind(this);
  }

 
    

  formatToAPIDate(dateObj) {
    // Default to YYYY-MM-DD to keep API consistent
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  handleSetDateToday() {
    const today = new Date();
    const formatted = this.formatToAPIDate(today);
    this.setState({ date: formatted, showSeats: false, selectedBusId: null }, () => {
      this.getbuses(this.state.from, this.state.to, formatted);
    });
  }

  handleSetDateTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatted = this.formatToAPIDate(tomorrow);
    this.setState({ date: formatted, showSeats: false, selectedBusId: null }, () => {
      this.getbuses(this.state.from, this.state.to, formatted);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    const isMobile = window.innerWidth < 768;
    if (this.state.isMobile !== isMobile) {
      this.setState({ isMobile });
    }
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
    if (this.state.selectedBusId  ==  busId){
    this.setState({ isSeatsLoading: !this.state.isSeatsLoading, selectedBusId: busId, showSeats: !this.state.showSeats, busdata: bus });
    }
    else{
      this.setState({ isSeatsLoading: true, selectedBusId: busId,showSeats:true, busdata: bus });
    }
    const formData = new FormData();
    formData.append('traceId', this.state.traceId);
    formData.append('busId', busId); 
    formData.append('bpid', 0);
    formData.append('dpid', 0);
    formData.append('seattype', "Horizontal"); 
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
   //     isSeatsLoading : false,
        busdata : bus,
     //   showSeats: true, // show seat selection UI
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
      // According to pattern: X as Y-axis, Y as X-axis
      // So: seat.x = vertical position, seat.y = horizontal position
      // height extends vertically (affects X), width extends horizontally (affects Y)
      minX = Math.min(minX, seat.x);
      minY = Math.min(minY, seat.y);
      maxX = Math.max(maxX, seat.x + (seat.height || 1) - 1); // height extends vertically (x-axis)
      maxY = Math.max(maxY, seat.y + (seat.width || 1) - 1);  // width extends horizontally (y-axis)
    });
    return { minX, minY, maxX, maxY };
  }

  componentDidMount() {
    const { from, to, date } = this.props.match.params;
    // set initial responsive flag and listen for changes
    this.setState({ isMobile: window.innerWidth < 768 });
    window.addEventListener('resize', this.handleResize);
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
  
  renderSeatGrid(seats, z, leftOffset = 0) {
    const { selectedSeats, isMobile } = this.state;
    
    // According to the image pattern: "use X as Y-axis coordinates and Y as X-axis coordinates"
    // For VERTICAL bus layout: 
    // - seat.x (from API) controls vertical position (rows - top to bottom)
    // - seat.y (from API) controls horizontal position (columns - left to right)
    
    const { minX, minY, maxX, maxY } = this.getGridBounds(seats, z);
    const seatSize = isMobile ? 32 : 48; // px per grid unit
    const isLower = z == 0;
    
    // Use actual API Y values to preserve natural spacing between columns
    // Don't compress gaps - keep natural spacing like in the reference image
    const columnValues = new Set();
    seats.filter(s => s.z === z).forEach(seat => {
      for (let i = 0; i < (seat.width || 1); i++) {
        columnValues.add(seat.y + i);
      }
    });
    const sortedColumns = Array.from(columnValues).sort((a, b) => a - b);
    
    // Create mapping: API column value -> position
    // Keep natural positions with gaps preserved
    const columnMapping = new Map();
    sortedColumns.forEach((col, index) => {
      columnMapping.set(col, col); // Use actual Y value instead of sequential index
    });
    
    const totalColumns = sortedColumns.length;
    const columnSpan = maxY - minY + 1; // Actual span of columns
    
    // Container size based on actual column span to preserve spacing
    const seatGridWidth = columnSpan * seatSize;
    const seatGridHeight = (maxX - minX + 1) * seatSize;
    
    const deckSeats = seats.filter(s => s.z === z);
    
    return (
 
      <>
            
      <div style={{
        position: 'relative',
        width: seatGridWidth + 24, // Add padding on both sides
        height: seatGridHeight + 32,
        background: '#fafbfc',
        borderRadius: 16,
        margin: '0 0 12px 0',
        boxShadow: '0 2px 8px #0001',
        paddingTop: 28,
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 12,
        minHeight: isMobile ? 160 : 180,
      }}>
        {/* Deck label and steering */}
        <div style={{ position: 'absolute', left: 12, top: -9, fontWeight: 700, fontSize: isMobile ? 16 : 18 }}>{isLower ? 'Lower deck' : 'Upper deck'}</div>
        {isLower && <div style={{ position: 'absolute', right: 12, top: -9, fontSize: isMobile ? 24 : 28, color: '#bbb' }}> <span role="img" aria-label="steering">🛞</span></div>}
       
        {/* Render seats */}
        {deckSeats.map(seat => {
          const isSelected = selectedSeats.includes(seat.id);
          // Check status - handle various formats
          const seatStatus = (seat.status || seat.Status || '').toString().toUpperCase();
          
          // Determine if seat is booked - must explicitly start with 'B' for booked status
          // Status like 'BFA', 'BFM', 'BFF' means booked, 'AFA', 'AFM', 'AFF' means available
          const isBooked = seatStatus && seatStatus.startsWith('B');
          const isFemale = seatStatus && seatStatus.endsWith('F');
          const isMale = seatStatus && seatStatus.includes('M') && !isBooked;
          
          // Detect sleeper types based on the pattern
          const isHorizontalSleeper = seat.width > 1; // Width > 1 means horizontal sleeper
          const isVerticalSleeper = seat.height > 1; // Height > 1 means vertical sleeper  
          const isSleeper = isHorizontalSleeper || isVerticalSleeper;
          
          // Colors
          let bg = '#fff', border = '#1aaf5d', color = '#222', opacity = 1;
          if (isBooked) { bg = '#eee'; border = '#bbb'; color = '#bbb'; opacity = 0.6; }
          if (isSelected) { bg = '#0fa11f'; border = '#0fa11f'; color = '#fff'; }
          if (isFemale && !isBooked) { border = '#e91e63'; }
          if (isMale && !isBooked) { border = '#2196f3'; }
          
          // Position for VERTICAL layout with horizontal flip:
          // seat.x controls vertical (top/bottom), seat.y controls horizontal (left/right)
          // Use actual Y position to preserve natural gaps
          const actualY = columnMapping.get(seat.y) || seat.y; // Get actual Y value
          
          // Flip horizontally: rightmost becomes leftmost
          // Use actual Y values to preserve spacing gaps
          const relativeY = actualY - minY; // Convert to 0-based position
          const flippedY = columnSpan - 1 - relativeY; // Flip: rightmost becomes leftmost
          
          // Position seats using the flipped, preserved spacing
          const left = flippedY * seatSize + leftOffset;
          const top = (seat.x - minX) * seatSize + 28;
          
          // Seat dimensions for VERTICAL layout - create visible gaps between seats
          // Make seats narrower to create horizontal spacing
          const horizontalGap = 16; // Gap for visibility
          let seatWidth = seatSize - horizontalGap;
          
          if (isHorizontalSleeper && seat.width > 1) {
            // For horizontal sleepers, they span multiple Y positions (columns)
            // Use width directly
            seatWidth = seat.width * seatSize - horizontalGap;
          }
          
          // Keep vertical height with some spacing
          const seatHeight = isVerticalSleeper ? seat.height * seatSize - 20 : seatSize - 20;
          
          return (
            <>
            <div
              key={seat.id}
              onClick={() => !isBooked && this.handleSeatClick(seat)}
              style={{
                position: 'absolute',
                left,
                top,
                width: seatWidth,
                height: seatHeight,
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
                fontSize: isMobile ? (isSleeper ? 12 : 10) : (isSleeper ? 15 : 13),
                zIndex: isSelected ? 2 : 1,
                transition: 'background 0.2s, border 0.2s',
                userSelect: 'none',
              }}
            >

              
              {/* Gender icon */}
              {isFemale && <span style={{ color: '#e91e63', fontSize: 14, marginBottom: 1 }}>♀️</span>}
              {isMale && <span style={{ color: '#2196f3', fontSize: 14, marginBottom: 1 }}>♂️</span>}
              {/* Seat name */}
              <div>{seat.name}</div>
              {/* Price or Sold */}
              <div style={{ fontSize: 11, fontWeight: 500, marginTop: 1 }}>
             {isBooked ? <span style={{ color: '#bbb' }}>Sold</span> : `₹${seat.fare?.base || ''}`}
           </div>
            </div>
           
           </>
          );
        })}
      </div>
      </>
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
      fare : this.state.busdata.fares[0].base,
      gst : this.state.busdata.fares[0].gst,
      totalfare : Number(this.state.busdata.fares[0].base)*Number(this.state.selectedSeats.length),
    }
    localStorage.setItem("busdata", JSON.stringify(busdata));
      this.props.history.push(`/passengerdetails`);
  }

  render() {
    
    const { buses, showSeats, seatData, selectedSeats, selectedBusId, showBoardDropModal, selectedBoardingId, selectedDroppingId, busdata, isMobile, showFilters } = this.state;
    return (
      <div style={{ background: '#f5f5fa', minHeight: '100vh', fontFamily: 'Inter, sans-serif', width: '100%', overflowX: 'hidden' }}>
        {/* Top Header (breadcrumb + count) */}
        <div style={{ maxWidth: 1400, margin: isMobile ? '12px auto 0 auto' : '24px auto 0 auto', padding: isMobile ? '0 12px' : '0 20px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#111' }}>
            <button onClick={() => this.props.history.goBack()} aria-label="Back"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 6 }}>
              ←
            </button>
            <div style={{ fontWeight: 700, fontSize: isMobile ? 18 : 22 }}>
              {this.state.fromCityName || 'From'} <span style={{ color: '#9ca3af', fontWeight: 400 }}>→</span> {this.state.toCityName || 'To'}
            </div>
          </div>
          <div style={{ marginTop: 6, color: '#6b7280', fontSize: 14, paddingLeft: isMobile ? 46 : 46 }}>
            {(() => {
              const list = (this.state.buses && this.state.buses[0] && this.state.buses[0].buses) ? this.state.buses[0].buses : [];
              const count = Array.isArray(list) ? list.length : 0;
              return `${count} buses`;
            })()}
          </div>
        </div>

        {/* Search Summary Bar */}
        {!isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 20px 0 20px', width: '94%' }}>
            <div
              style={{
                background: '#fff',
                borderRadius: 24,
                border: '1px solid #ebedf0',
                boxShadow: '0 1px 2px #0000000a',
                display: 'flex',
                alignItems: 'stretch',
                padding: 0,
                minWidth: 1100,
                width: '90%',
                maxWidth: 1400,
                overflow: 'hidden'
              }}
            >
              {/* From */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', flex: 1 }}>
                <span role="img" aria-label="from" style={{ fontSize: 26, marginRight: 6 }}>🚌</span>
                <div>
                  <div style={{ fontSize: 14, color: '#6b7280' }}>From</div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{this.state.fromCityName}</div>
                </div>
              </div>
              {/* Divider + Swap */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
                <button
                  onClick={() => {
                    const prevFrom = this.state.fromCityName;
                    const prevTo = this.state.toCityName;
                    this.setState({
                      fromCityName: prevTo,
                      toCityName: prevFrom,
                    });
                  }}
                  style={{
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: -70,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px #0000000a'
                  }}
                  aria-label="Swap cities"
                >
                  <svg width="22" height="22"  viewBox="0 0 22 22" fill="none" aria-hidden="true ">
                    <path d="M7 7L3 11L7 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 11H19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 15L19 11L15 7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div style={{ width: 1, height: 104, background: '#e5e7eb', marginTop: 2 }} />
              </div>
              {/* To */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', flex: 1 }}>
                <span role="img" aria-label="to" style={{ fontSize: 24 }}>🚌</span>
                <div>
                  <div style={{ fontSize: 14, color: '#6b7280' }}>To</div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{this.state.toCityName}</div>
                </div>
              </div>
              <div style={{ width: 1, background: '#e5e7eb' }} />
              {/* Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', flex: 1 }}>
                <span role="img" aria-label="calendar" style={{ fontSize: 24 }}>📅</span>
                <div>
                  <div style={{ fontSize: 14, color: '#6b7280' }}>Date of journey</div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>
                    {(() => {
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
              <div style={{ width: 1, background: '#e5e7eb' }} />
              {/* Today/Tomorrow + Search */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  justifyContent: 'flex-start',
                  flex: 1,
                }}
              >
                <button
                  onClick={this.handleSetDateToday}
                  style={{
                    background: '#ffd9d9',
                    border: 'none',
                    borderRadius: 22,
                    padding: '10px 16px',
                    fontWeight: 700,
                    color: '#b91c1c',
                    fontSize: 14,
                    minWidth: 80,
                  }}
                >
                  Today
                </button>
                <button
                  onClick={this.handleSetDateTomorrow}
                  style={{
                    background: '#ffd9d9',
                    border: 'none',
                    borderRadius: 22,
                    padding: '10px 16px',
                    fontWeight: 700,
                    color: '#b91c1c',
                    fontSize: 14,
                    minWidth: 80,
                  }}
                >
                  Tomorrow
                </button>
                <div
                  style={{
                    width: 1,
                    height: 40,
                    background: '#e5e7eb',
                  }}
                />
                <button
                  aria-label="Search"
                  style={{
                    background: '#dc2626',
                    border: 'none',
                    borderRadius: '50%',
                    width: 56,
                    height: 56,
                    color: '#fff',
                    fontSize: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 16px rgba(220,38,38,0.3)',
                    cursor: 'pointer',
                    marginLeft: 0,
                  }}
                  onClick={() =>
                    this.getbuses(
                      this.state.from,
                      this.state.to,
                      this.state.date
                    )
                  }
                >
                  🔍
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Discount Offers Slider */}
        {isMobile ? (
        // Mobile quick filter section
        <div className="row justify-content-center" style={{ width: '100%' }}>
          <div className="col-12" style={{ maxWidth: 480, width: '100%' }}>
            {/* Subtitle */}
            <div style={{ color: '#6b7280', fontSize: 16, padding: '8px 12px' }}>
              {this.state.fromCityName} to {this.state.toCityName} Bus
            </div>
              {/* All buses card */}
              <div style={{ padding: '0 12px 8px 12px' }}>
              <div
                style={{
                  background: '#fff',
                    borderRadius: 24,
                    boxShadow: '0 8px 18px rgba(0,0,0,0.10)',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                    width: 160,
                    height: 168,
                    margin: 0,
                    alignSelf: 'flex-start',
                  position: 'relative',
                  overflow: 'visible',
                    border: '1px solid #f2f2f4',
                }}
              >
                {/* "Pink" circle behind bus icon */}
                <div
                  style={{
                      width: 88,
                      height: 88,
                    borderRadius: '50%',
                    background: '#ffe8eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                      marginTop: 18,
                  }}
                >
                    {/* Font Awesome bus icon */}
                    <i className="fa fa-bus" aria-hidden="true" style={{ fontSize: 26, color: '#111' }}></i>
                </div>
                  <div
                  style={{
                      fontWeight: 800,
                      fontSize: 20,
                    color: '#222',
                      marginTop: 10,
                  }}
                >
                    All buses
                </div>
                  {/* Bottom red rail (rounded) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 10,
                      right: 10,
                      bottom: -8,
                      height: 12,
                      background: '#ea4343',
                      borderBottomLeftRadius: 24,
                      borderBottomRightRadius: 24,
                      zIndex: 0,
                    }}
                  />
              </div>
            </div>
            {/* Chips row */}
            <div style={{ display: 'flex', gap: 12, padding: '8px 12px', overflowX: 'auto' }}>
              <button onClick={() => this.setState({ showFilters: !showFilters })} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>⚙️ Filter & Sort</button>
              <button style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>❄️ AC (2)</button>
              <button style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>🛏️ SLEEPER (3)</button>
            </div>
            {/* Eazzy Filter card */}
            <div style={{ background: '#efe9ff', borderRadius: 16, margin: '8px 12px 0 12px', padding: 12, boxShadow: 'inset 0 0 0 2px #e2d5ff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontWeight: 800, fontSize: 22, color: '#8a1436' }}>Eazzy Filter</div>
                <div style={{ color: '#6b7280', fontWeight: 600 }}>AI-powered smart filtering</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '12px 14px', border: '2px solid', borderImage: 'linear-gradient(90deg, #ffb400, #7b61ff) 1' }}>
                <span style={{ color: '#6b7280' }}>Try </span>
                <span style={{ color: '#ff7a00', fontWeight: 700 }}>&quot;evening departure&quot;</span>
              </div>
            </div>
          </div>
        </div>
        ) : (
        <div className="row justify-content-center" style={{ width: '100%' }}>
          <div
            className="col-md-10 col-lg-10 col-xs-12"
            style={{
              marginTop: isMobile ? 16 : 28,
              width: isMobile ? '100%' : '86%',
              maxWidth: 1400,
              padding: isMobile ? 0 : undefined,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: isMobile ? 16 : 24,
                boxShadow: "0 8px 32px rgba(44,62,80,0.18)",
                padding: isMobile ? "12px 8px" : "16px 24px",
                marginBottom: isMobile ? 12 : 24,
                marginTop: isMobile ? 0 : 0,
                height: "auto",
                width: '96%',
                minWidth: 0,
                overflow: "visible",
              }}
            >
              <div
                className={`d-flex ${isMobile ? "flex-column" : "justify-content-between"} align-items-center mb-3`}
                style={isMobile ? { gap: 8 } : {}}
              >
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: isMobile ? 18 : 24,
                    color: "#222",
                    margin: 0,
                    marginBottom: isMobile ? 8 : 0,
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  Bus Booking Discount Offers
                </h2>
                <a
                  href="#"
                  style={{
                    fontWeight: 600,
                    fontSize: isMobile ? 14 : 16,
                    color: "#dc3545",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  View All <i className="fa fa-angle-right"></i>
                </a>
              </div>
              <div
                style={{
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  paddingBottom: 8,
                  marginLeft: 0,
                  marginRight: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: isMobile ? 12 : 32,
                    minWidth: 0,
                  }}
                >
                  {/* Offer 1 */}
                  <div
                    style={{
                      flex: "0 0 auto",
                      borderRadius: 18,
                      background: "linear-gradient(180deg,#fff7e6,#ffe8bf)",
                      border: "1px solid #fde7b0",
                      minHeight: isMobile ? 120 : 140,
                      maxWidth: 260,
                      width: isMobile ? 160 : 220,
                      padding: isMobile ? 10 : 16,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 2px 8px rgba(44,62,80,0.08)",
                      marginRight: 0,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: isMobile ? 16 : 24,
                          fontWeight: 800,
                          color: "#1f2937",
                        }}
                      >
                        70% OFF
                      </div>
                      <div style={{ fontSize: 13, color: "#374151" }}>
                        on bus bookings
                      </div>
                    </div>
                    <div
                      style={{
                        alignSelf: "flex-start",
                        background: "#ef4444",
                        color: "#fff",
                        borderRadius: 8,
                        padding: isMobile ? "5px 8px" : "8px 12px",
                        fontWeight: 700,
                        fontSize: isMobile ? 12 : 13,
                        marginTop: 8,
                      }}
                    >
                      Code: SALE
                    </div>
                  </div>
                  {/* Offer 2 */}
                  <div
                    style={{
                      flex: "0 0 auto",
                      borderRadius: 18,
                      background: "linear-gradient(180deg,#ffe9ef,#ffd2dd)",
                      border: "1px solid #ffd1dc",
                      minHeight: isMobile ? 120 : 140,
                      maxWidth: 260,
                      width: isMobile ? 160 : 220,
                      padding: isMobile ? 10 : 16,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 2px 8px rgba(44,62,80,0.08)",
                      marginRight: 0,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: isMobile ? 16 : 24,
                          fontWeight: 800,
                          color: "#1f2937",
                        }}
                      >
                        Get ₹500 off
                      </div>
                      <div style={{ fontSize: 13, color: "#374151" }}>
                        on 1st Bus Booking
                      </div>
                    </div>
                    <div
                      style={{
                        alignSelf: "flex-start",
                        background: "#ef4444",
                        color: "#fff",
                        borderRadius: 8,
                        padding: isMobile ? "5px 8px" : "8px 12px",
                        fontWeight: 700,
                        fontSize: isMobile ? 12 : 13,
                        marginTop: 8,
                      }}
                    >
                      CODE: ABHIFIRST
                    </div>
                  </div>
                  {/* Offer 3 */}
                  <div
                    style={{
                      flex: "0 0 auto",
                      borderRadius: 18,
                      background: "linear-gradient(180deg,#e7f3ff,#cfe7ff)",
                      border: "1px solid #cfe2ff",
                      minHeight: isMobile ? 120 : 140,
                      maxWidth: 260,
                      width: isMobile ? 160 : 220,
                      padding: isMobile ? 10 : 16,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 2px 8px rgba(44,62,80,0.08)",
                      marginRight: 0,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: isMobile ? 14 : 22,
                          fontWeight: 800,
                          color: "#1f2937",
                        }}
                      >
                        Flat 10% off
                      </div>
                      <div style={{ fontSize: 13, color: "#374151" }}>
                        on Orange Travels
                      </div>
                    </div>
                    <div
                      style={{
                        alignSelf: "flex-start",
                        background: "#f97316",
                        color: "#fff",
                        borderRadius: 8,
                        padding: isMobile ? "5px 8px" : "8px 12px",
                        fontWeight: 700,
                        fontSize: isMobile ? 12 : 13,
                        marginTop: 8,
                      }}
                    >
                      CODE: ORANGE10
                    </div>
                  </div>
                  {/* Offer 4 - hide on mobile */}
                  {!isMobile && (
                    <div
                      style={{
                        flex: "0 0 auto",
                        borderRadius: 18,
                        background: "linear-gradient(180deg,#e9fff0,#cbfce0)",
                        border: "1px solid #c9f7d6",
                        minHeight: 140,
                        maxWidth: 260,
                        width: 220,
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 2px 8px rgba(44,62,80,0.08)",
                        marginRight: 0,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: "#1f2937",
                          }}
                        >
                          Get 15% off
                        </div>
                        <div style={{ fontSize: 16, color: "#374151" }}>
                          on first bus booking
                        </div>
                      </div>
                      <div
                        style={{
                          alignSelf: "flex-start",
                          background: "#22c55e",
                          color: "#fff",
                          borderRadius: 8,
                          padding: "8px 12px",
                          fontWeight: 700,
                          fontSize: 13,
                          marginTop: 8,
                        }}
                      >
                        Code: FREEDOM
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Main Content */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          maxWidth: 1400,
          margin: isMobile ? '16px auto 0 auto' : '40px auto 0 auto',
          gap: 32,
          padding: isMobile ? '0 12px' : 0,
          width: '100%'
        }}>
         
          {/* Sidebar Filters */}
          <div style={{
            width: isMobile ? '100%' : 320,
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 2px 8px #0001',
            minHeight: 200,
            display: isMobile && !showFilters ? 'none' : 'block'
          }}>
            <div style={{ fontWeight: 800, fontSize: isMobile ? 28 : 28, lineHeight: 1.2, marginBottom: 20 }}>Filter buses</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '⭐', label: 'Primo Bus', count: 21 },
                { icon: '🧊', label: 'AC', count: 347 },
                { icon: '🛏️', label: 'SLEEPER', count: 300 },
                { icon: '🪑', label: 'Single Seats', count: 215 },
                { icon: '💺', label: 'SEATER', count: 403 },
                { icon: '🚫🧊', label: 'NONAC', count: 88 },
                { icon: '🌅', label: '18:00-24:00', count: 329 },
                { icon: '🌄', label: '06:00-12:00', count: 2 },
                { icon: '🏆', label: 'High Rated Buses', count: 192 },
              ].map((f, i) => (
                <button
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    textAlign: 'left',
                    background: '#fff',
                    border: '2px solid #d1d5db',
                    borderRadius: 14,
                    padding: '14px 18px',
                    fontWeight: 600,
                    fontSize: 18,
                    color: '#111827',
                    cursor: 'pointer',
                    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
                    transition: 'background 0.15s ease, border-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#9ca3af'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#d1d5db'; }}
                >
                  <span aria-hidden="true" style={{ fontSize: 22, width: 26, textAlign: 'center' }}>{f.icon}</span>
                  <span style={{ flex: 1 }}>{f.label}</span>
                  <span style={{ color: '#111827', fontWeight: 700 }}>({f.count})</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Bus List Column (header + list) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 32, width: '100%' }}>
            {/* List Header: count + sort row and green info strip (desktop only) */}
            {!isMobile && (
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '14px 16px' : '18px 24px' }}>
                <div style={{ fontWeight: 800, fontSize: isMobile ? 18 : 22, color: '#111827' }}>
                  {(() => {
                    const list = (this.state.buses && this.state.buses[0] && this.state.buses[0].buses) ? this.state.buses[0].buses : [];
                    const count = Array.isArray(list) ? list.length : 0;
                    return `${count} buses found`;
                  })()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 28, color: '#111827', fontWeight: 700 }}>
                  <span style={{ color: '#6b7280', fontWeight: 700 }}>Sort by:</span>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Ratings</button>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Departure time</button>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Price</button>
                </div>
              </div>
              <div style={{ background: '#b9f3c6', padding: isMobile ? '10px 16px' : '12px 24px' }}>
                <div style={{ fontWeight: 800, fontSize: isMobile ? 16 : 20, color: '#111827' }}>2000+ searches on this route last month</div>
              </div>
            </div>
            )}
            {/* Mobile green info strip under quick filters */}
            {isMobile && (
              <div style={{ background: '#b9f3c6', marginTop: 8, borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', fontWeight: 800, fontSize: 18, color: '#111827' }}>2000+ searches on this route last month</div>
              </div>
            )}
            {this.state.isloading ? (
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px #0001', textAlign: 'center', fontWeight: 600 }}>Loading buses...</div>
            ) : (
            (buses && buses[0] && buses[0].buses ? buses[0].buses : []).map(bus => {
              // Defensive value pulls
              const busName = bus.name || 'RSRTC';
              const busType = bus.type || 'A/C Sleeper';
              const rating = bus.rating || 3.6;
              const ratingCount = bus.rev || 43;
              const dep = bus.timeD || '';
              const arr = bus.timeA || '';
              const depTime = dep.split('T')[1]?.substring(0,5) || '--:--';
              const arrTime = arr.split('T')[1]?.substring(0,5) || '--:--';
              const baseFare = bus.fares?.[0]?.base != null ? bus.fares[0].base : '---';
              const seats = bus.seats?.avlAll != null ? bus.seats.avlAll : '--';
              const duration = (() => {
                if (!dep || !arr) return '';
                const depDate = new Date(dep);
                let arrDate = new Date(arr);
                if (arrDate < depDate) arrDate.setDate(arrDate.getDate() + 1);
                const diffMs = arrDate - depDate;
                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                return `${hours}h ${minutes}m`;
              })();

              return (
                <React.Fragment key={bus.id}>
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: 18,
                      boxShadow: '0 2px 12px rgba(44,62,80,0.09)',
                      padding: isMobile ? 12 : 24,
                      margin: isMobile ? '10px 0' : '12px 0',
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'stretch' : 'center',
                      justifyContent: 'space-between',
                      gap: isMobile ? 14 : 24,
                      position: 'relative',
                      minHeight: 120,
                    }}
                  >
                    {/* Operator, type, and sub-info */}
                    <div style={{flex:2, minWidth: 180}}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                        {/* STATUS BADGE - for demo purposes */}
                        {bus.status === 'IS STARTING' && (
                          <span style={{background:'#e8eaff',fontWeight:700,padding:'2px 8px',fontSize:12,borderRadius:6,color:'#4257f6',marginRight:8,letterSpacing:0.6}}>IS STARTING</span>
                        )}
                        <span style={{ fontWeight: 700, fontSize: isMobile ? 15 : 18 }}>{busName}</span>
                      </div>
                      <div style={{ fontSize: isMobile ? 13 : 15, color: '#222', fontWeight: 500, marginBottom: 3 }}>{busType}</div>
                      <div style={{ fontSize: isMobile ? 11 : 13, color: '#888' }}>Volvo A/C Seater (2+2)</div>
                    </div>

                    {/* RATING */}
                    <div style={{minWidth: isMobile ? 56 : 68, marginLeft: isMobile ? 0 : 16, textAlign:'center'}}>
                      <div style={{background:'#fdeee5',color:'#984c04',display:'inline-flex',alignItems:'center',gap:5,padding:'3px 9px',borderRadius:8, fontWeight:700,fontSize:isMobile?15:16}}>
                        <span style={{fontSize:16}}>★</span> {rating}
                      </div>
                      <div style={{fontWeight:600,fontSize:13,margin:'2px 0',color:'#222'}}>{ratingCount}</div>
                    </div>

                    {/* TIMING + Seats */}
                    <div style={{flex:1,minWidth:120, display:'flex',flexDirection:'column',alignItems:isMobile?'flex-start':'center',gap:2}}>
                      <div style={{fontWeight:700,fontSize:isMobile?17:20,color:'#222',letterSpacing:0.5}}>
                        {depTime} <span style={{color:'#888',fontWeight:400,margin:'0 4px'}}>—</span> {arrTime}
                      </div>
                      <div style={{fontSize:isMobile?12:14,color:'#878'}}>
                        {duration} &#183; <span>{seats} Seats</span>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div style={{flex:1, minWidth:90, textAlign:isMobile?'left':'right', alignSelf:isMobile?'flex-start':'center'}}>
                      <div style={{fontWeight: 700, fontSize: isMobile ? 17 : 20,color:'#232'}}>
                        ₹{baseFare}
                      </div>
                      <div style={{color:'#888', fontSize:isMobile?12:13, fontWeight: 500, marginTop: 2}}>Onwards</div>
                    </div>

                    {/* BUTTON */}
                    <div style={{width: isMobile ? '100%' : 150, textAlign: isMobile ? 'center' : 'right', alignSelf: isMobile ? 'stretch' : 'center'}}>
                      <button
                        onClick={() => this.viewseats(bus.id, bus.name, bus.type, bus)}
                        style={{
                          background:'#dc2626',
                          color:'#fff',
                          border:'none',
                          borderRadius: 32,
                          padding: isMobile ? '12px 0' : '13px 0',
                          width: isMobile ? '100%' : 135,
                          minWidth: 120,
                          fontWeight: 700,
                          fontSize: isMobile ? 16 : 19,
                          cursor: 'pointer',
                          marginLeft: isMobile?0:12,
                          marginTop: isMobile ? 12 : 0,
                          boxShadow: '0 2px 8px #e44a',
                          transition: 'background 0.18s',
                          outline: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        View seats
                      </button>
                    </div>
                  </div>
                  {showSeats && selectedBusId === bus.id && (
                    <div style={{ background: '#fff', borderRadius: 16, padding: isMobile ? 16 : 24, margin: '24px 0', boxShadow: '0 2px 8px #0001', width: isMobile ? '100%' : '100%' }}>
                      {this.state.isSeatsLoading ? (
                        <div style={{ textAlign: 'center', fontWeight: 600 }}>Loading seats...</div>
                      ) : (
                        <>
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row', 
                            gap: isMobile ? 24 : 32, 
                            width: '100%', 
                            justifyContent: 'center', 
                            alignItems: 'flex-start',
                            flexWrap: 'wrap'
                          }}>
                            <div style={{ flex: isMobile ? '1 1 100%' : '0 0 calc(50% - 16px)', minWidth: isMobile ? '100%' : 400, maxWidth: isMobile ? '100%' : 'calc(50% - 16px)' }}>
                              <h3 style={{ marginBottom: 8, fontWeight: 700, fontSize: isMobile ? 18 : 22 }}></h3>
                              {this.renderSeatGrid(seatData, 0)}
                            </div>
                            <div style={{ flex: isMobile ? '1 1 100%' : '0 0 calc(50% - 16px)', minWidth: isMobile ? '100%' : 400, maxWidth: isMobile ? '100%' : 'calc(50% - 16px)' }}>
                              <h3 style={{ marginBottom: 8, fontWeight: 700, fontSize: isMobile ? 18 : 22 }}></h3>
                              {this.renderSeatGrid(seatData, 1)}
                            </div>
                          </div>
                          <div style={{ margin: '16px 0', fontWeight: 600 }}>
                            Selected Seats: {selectedSeats.join(', ') || 'None'}
                            {selectedSeats.length >= 6 && <span style={{ color: '#d44', marginLeft: 12 }}>(Max 6 seats)</span>}
                          </div>
                          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                            <button onClick={() => this.setState({ showSeats: false, selectedBusId: null })} style={{ background: '#d44', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: isMobile ? 16 : 18, cursor: 'pointer' }}>Cancel</button>
                            {selectedSeats.length > 0 && (
                              <button onClick={this.handleProceed} style={{ background: '#0fa11f', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: isMobile ? 16 : 18, cursor: 'pointer' }}>Proceed</button>
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
