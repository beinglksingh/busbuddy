import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cities from './cities';
import { API_WEB_URLS } from 'constants/constAPI';
import PassengerDetails from './PassengerDetails';

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
      selectedSeatsData: [], // for full seat objects with fare info
      selectedBusId: null, // Track which bus's seats are shown
      showBoardDropModal: false,
      selectedBoardingId: '',
      selectedDroppingId: '',
      activeTab: 1, // 1: Select seats, 2: Board/Drop point, 3: Passenger Info
      preparedBusdata: null, // Bus data prepared for PassengerDetails component
      // responsive/ui state
      isMobile: false,
      showFilters: false,
      showMobileBusDetails: false, 
      copyNotification: null, // For showing copy confirmation
      activeFilters: {
        ac: false,
        sleeper: false,
        seater: false,
        nonAc: false,
        singleSeats: false,
        eveningDeparture: false,
        morningDeparture: false,
        highRated: false,
      }
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
    this.handleCopyCode = this.handleCopyCode.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.filterBuses = this.filterBuses.bind(this);
    this.getFilterCount = this.getFilterCount.bind(this);
  }

  handleCopyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
      this.setState({ copyNotification: code });
      setTimeout(() => {
        this.setState({ copyNotification: null });
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  toggleFilter(filterName) {
    this.setState(prevState => ({
      activeFilters: {
        ...prevState.activeFilters,
        [filterName]: !prevState.activeFilters[filterName]
      }
    }));
  }

  filterBuses(buses) {
    const { activeFilters } = this.state;
    const busList = (buses && buses[0] && buses[0].buses) ? buses[0].buses : [];
    
    if (!activeFilters || busList.length === 0) return busList;
    
    return busList.filter(bus => {
      // No filter active, show all
      const hasActiveFilter = Object.values(activeFilters).some(v => v);
      if (!hasActiveFilter) return true;

      // AC filter
      if (activeFilters.ac && !bus.tags?.ac) return false;
      
      // Sleeper filter
      if (activeFilters.sleeper && !bus.tags?.sleeper) return false;
      
      // Seater filter
      if (activeFilters.seater && !bus.tags?.seater) return false;
      
      // Non-AC filter
      if (activeFilters.nonAc && !bus.tags?.nonAc) return false;
      
      // Evening departure (18:00-24:00)
      if (activeFilters.eveningDeparture) {
        const hour = new Date(bus.timeD).getHours();
        if (hour < 18) return false;
      }
      
      // Morning departure (06:00-12:00)
      if (activeFilters.morningDeparture) {
        const hour = new Date(bus.timeD).getHours();
        if (hour < 6 || hour >= 12) return false;
      }
      
      // High rated (rating >= 4)
      if (activeFilters.highRated) {
        if (!bus.rating || bus.rating < 4) return false;
      }
      
      return true;
    });
  }

  getFilterCount(filterName, buses) {
    const busList = (buses && buses[0] && buses[0].buses) ? buses[0].buses : [];
    if (busList.length === 0) return 0;
    
    switch(filterName) {
      case 'ac':
        return busList.filter(b => b.tags?.ac).length;
      case 'sleeper':
        return busList.filter(b => b.tags?.sleeper).length;
      case 'seater':
        return busList.filter(b => b.tags?.seater).length;
      case 'nonAc':
        return busList.filter(b => b.tags?.nonAc).length;
      case 'eveningDeparture':
        return busList.filter(b => {
          const hour = new Date(b.timeD).getHours();
          return hour >= 18;
        }).length;
      case 'morningDeparture':
        return busList.filter(b => {
          const hour = new Date(b.timeD).getHours();
          return hour >= 6 && hour < 12;
        }).length;
      case 'highRated':
        return busList.filter(b => b.rating && b.rating >= 4).length;
      default:
        return 0;
    }
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

  componentDidUpdate(prevProps, prevState) {
    // Auto-select boarding/dropping points when tab 2 is active and busdata is available
    if (this.state.activeTab === 2 && this.state.busdata && 
        (!prevState.busdata || prevState.activeTab !== 2)) {
      const { busdata, selectedBoardingId, selectedDroppingId } = this.state;
      
      let shouldUpdate = false;
      let newBoardingId = selectedBoardingId;
      let newDroppingId = selectedDroppingId;
      
      // Auto-select if only 1 boarding point exists and not already selected
      if (busdata.boarding && busdata.boarding.length === 1 && !selectedBoardingId) {
        newBoardingId = busdata.boarding[0].id;
        shouldUpdate = true;
      }
      
      // Auto-select if only 1 dropping point exists and not already selected
      if (busdata.dropping && busdata.dropping.length === 1 && !selectedDroppingId) {
        newDroppingId = busdata.dropping[0].id;
        shouldUpdate = true;
      }
      
      if (shouldUpdate) {
        this.setState({
          selectedBoardingId: newBoardingId,
          selectedDroppingId: newDroppingId
        });
      }
    }
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
      console.log('parsed----------------->>>>>',parsed);
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
        selectedSeatsData: [], // reset seat data with fare info
        selectedBusId: busId, // Set selected bus
        selectedBoardingId: '', // reset boarding point
        selectedDroppingId: '', // reset dropping point
        activeTab: 1, // reset to tab 1
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
    const { selectedSeats, selectedSeatsData } = this.state;
    const isSelected = selectedSeats.includes(seat.id);
    if (isSelected) {
      // Deselect - remove from both arrays
      this.setState({ 
        selectedSeats: selectedSeats.filter(id => id !== seat.id),
        selectedSeatsData: selectedSeatsData.filter(s => s.id !== seat.id)
      });
    } else {
      if (selectedSeats.length >= 6) return; // Max 6
      // Select - add to both arrays (IDs and full seat objects)
      this.setState({ 
        selectedSeats: [...selectedSeats, seat.id],
        selectedSeatsData: [...selectedSeatsData, seat]
      });
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
    const seatSize = isMobile ? 36 : 50; // Optimized seat size
    const gapBetweenSeats = isMobile ? 6 : 8; // Reduced gap between seats
    const isLower = z == 0;
    
    // Get all unique column positions (Y values)
    const columnValues = new Set();
    seats.filter(s => s.z === z).forEach(seat => {
      columnValues.add(seat.y);
    });
    const sortedColumns = Array.from(columnValues).sort((a, b) => a - b);
    
    // Create a mapping from original Y to normalized position
    // This compresses large gaps (aisles) significantly
    const columnMapping = new Map();
    let normalizedPosition = 0;
    const maxGap = 1.5; // Reduced maximum gap for aisle (compress gallery more)
    
    sortedColumns.forEach((col, index) => {
      if (index === 0) {
        columnMapping.set(col, normalizedPosition);
      } else {
        const actualGap = col - sortedColumns[index - 1];
        // Compress large gaps (aisles) significantly - maximum 1.5 units
        const normalizedGap = actualGap > maxGap ? maxGap : actualGap;
        normalizedPosition += normalizedGap;
        columnMapping.set(col, normalizedPosition);
      }
    });
    
    // Calculate total grid width based on normalized positions
    const maxNormalizedY = Math.max(...Array.from(columnMapping.values()));
    const totalColumns = maxNormalizedY + 1;
    
    // Calculate container width - each column gets seatSize + gap
    const seatGridWidth = totalColumns * (seatSize + gapBetweenSeats) - gapBetweenSeats;
    const seatGridHeight = (maxX - minX + 1) * (seatSize + (isMobile ? 6 : 8));
    
    const deckSeats = seats.filter(s => s.z === z);
    
    return (
      <>
        <div style={{
          position: 'relative',
          width: seatGridWidth + (isMobile ? 8 : 10), // Exact width: grid width + left padding only
          height: seatGridHeight + (isMobile ? 24 : 28),
          background: '#fafbfc',
          borderRadius: 16,
          margin: '0 0 12px 0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          paddingTop: isMobile ? 20 : 24,
          paddingLeft: isMobile ? 8 : 10,
          paddingRight: 0, // No right padding - no extra space after last seat
          paddingBottom: isMobile ? 8 : 10,
          minHeight: isMobile ? 160 : 180,
          overflow: 'visible',
        }}>
          {/* Deck label and steering */}
          <div style={{ position: 'absolute', left: isMobile ? 8 : 10, top: isMobile ? -6 : -8, fontWeight: 700, fontSize: isMobile ? 16 : 18, color: '#333' }}>
            {isLower ? 'Lower deck' : 'Upper deck'}
          </div>
          {isLower && <div style={{ position: 'absolute', right: 0, top: isMobile ? -6 : -8, fontSize: isMobile ? 24 : 28, color: '#bbb' }}> 
            <span role="img" aria-label="steering">🛞</span>
          </div>}
         
          {/* Render seats */}
          {deckSeats.map(seat => {
            const isSelected = selectedSeats.includes(seat.id);
            // Check status - handle various formats
            const seatStatus = (seat.status || seat.Status || '').toString().toUpperCase();
            
            // Determine if seat is booked
            const isBooked = seatStatus && seatStatus.startsWith('B');
            const isFemale = seatStatus && seatStatus.endsWith('F');
            const isMale = seatStatus && seatStatus.includes('M') && !isBooked;
            
            // Detect sleeper types
            const isHorizontalSleeper = seat.width > 1;
            const isVerticalSleeper = seat.height > 1;
            const isSleeper = isHorizontalSleeper || isVerticalSleeper;
            
            // Colors
            let bg = '#fff', border = '#1aaf5d', color = '#222', opacity = 1;
            if (isBooked) { bg = '#f5f5f5'; border = '#ddd'; color = '#999'; opacity = 0.7; }
            if (isSelected) { bg = '#0fa11f'; border = '#0fa11f'; color = '#fff'; }
            if (isFemale && !isBooked && !isSelected) { border = '#e91e63'; }
            if (isMale && !isBooked && !isSelected) { border = '#2196f3'; }
            
            // Get normalized Y position
            const normalizedY = columnMapping.get(seat.y) || 0;
            
            // Flip horizontally: rightmost becomes leftmost (like RedBus)
            const flippedY = maxNormalizedY - normalizedY;
            
            // Calculate position - ensure no overlaps
            const left = flippedY * (seatSize + gapBetweenSeats) + leftOffset;
            const top = (seat.x - minX) * (seatSize + (isMobile ? 6 : 8)) + (isMobile ? 20 : 24);
            
            // Calculate seat width - ensure no overlaps
            let seatWidth = seatSize;
            
            if (isHorizontalSleeper && seat.width > 1) {
              // For horizontal sleepers spanning multiple columns
              const startY = normalizedY;
              const endY = columnMapping.get(seat.y + seat.width - 1);
              if (endY !== undefined) {
                const spanColumns = Math.abs(endY - startY) + 1;
                seatWidth = spanColumns * (seatSize + gapBetweenSeats) - gapBetweenSeats;
              } else {
                // Fallback: use seat width directly
                seatWidth = seat.width * (seatSize + gapBetweenSeats) - gapBetweenSeats;
              }
              // Ensure minimum width
              seatWidth = Math.max(seatWidth, seatSize);
            }
            
            // Calculate seat height
            const seatHeight = isVerticalSleeper ? seat.height * (seatSize + (isMobile ? 6 : 8)) - (isMobile ? 6 : 8) : seatSize;
            
            return (
              <div
                key={seat.id}
                onClick={() => !isBooked && this.handleSeatClick(seat)}
                style={{
                  position: 'absolute',
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${seatWidth}px`,
                  height: `${seatHeight}px`,
                  background: bg,
                  border: `2px solid ${border}`,
                  color,
                  borderRadius: isSleeper ? 10 : 6,
                  boxShadow: isSelected ? '0 0 0 3px rgba(15, 161, 31, 0.3)' : '0 2px 4px rgba(0,0,0,0.08)',
                  opacity,
                  cursor: isBooked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: isMobile ? (isSleeper ? 11 : 10) : (isSleeper ? 14 : 12),
                  zIndex: isSelected ? 10 : 1,
                  transition: 'all 0.2s ease',
                  userSelect: 'none',
                  overflow: 'hidden',
                  padding: '4px 6px',
                  boxSizing: 'border-box',
                  minWidth: isMobile ? 36 : 44,
                }}
                onMouseEnter={(e) => {
                  if (!isBooked && !isSelected) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isBooked && !isSelected) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
                  }
                }}
              >
                {/* Gender icon */}
                {isFemale && !isBooked && <span style={{ color: '#e91e63', fontSize: isMobile ? 10 : 12, marginBottom: 2, lineHeight: 1 }}>♀</span>}
                {isMale && !isBooked && <span style={{ color: '#2196f3', fontSize: isMobile ? 10 : 12, marginBottom: 2, lineHeight: 1 }}>♂</span>}
                
                {/* Seat name */}
                <div style={{ 
                  fontSize: isMobile ? (isSleeper ? 11 : 10) : (isSleeper ? 14 : 12),
                  fontWeight: 600,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  width: '100%',
                  marginTop: (isFemale || isMale) && !isBooked ? 0 : 0
                }}>
                  {seat.name}
                </div>
                
                {/* Price or Sold */}
                <div style={{ 
                  fontSize: isMobile ? 9 : 10, 
                  fontWeight: isBooked ? 400 : 500, 
                  marginTop: 2,
                  lineHeight: 1.1,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  width: '100%',
                  opacity: isBooked ? 0.7 : 1
                }}>
                  {isBooked ? <span style={{ color: '#999' }}>Sold</span> : `₹${seat.fare?.base || ''}`}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  handleProceed() {
    // Switch to tab 2 (Board/Drop point) instead of opening modal
    const { busdata } = this.state;
    
    // Auto-select if only 1 boarding point and 1 dropping point exist
    let autoSelectedBoarding = '';
    let autoSelectedDropping = '';
    
    if (busdata && busdata.boarding && busdata.boarding.length === 1) {
      autoSelectedBoarding = busdata.boarding[0].id;
    }
    
    if (busdata && busdata.dropping && busdata.dropping.length === 1) {
      autoSelectedDropping = busdata.dropping[0].id;
    }
    
    this.setState({ 
      activeTab: 2,
      selectedBoardingId: autoSelectedBoarding || this.state.selectedBoardingId,
      selectedDroppingId: autoSelectedDropping || this.state.selectedDroppingId
    });
  }

  handleBoardDropConfirm() {
    // Calculate total base fare from individual selected seats (jo seat par dikh rahi hai)
    const { selectedSeatsData } = this.state;
    let totalBase = 0;
    
    if (selectedSeatsData && selectedSeatsData.length > 0) {
      selectedSeatsData.forEach(seat => {
        totalBase += (seat.fare?.base || 0);
      });
    } else {
      // Fallback to bus fare if seat data not available
      totalBase = this.state.busdata.fares[0].base * this.state.selectedSeats.length;
    }
    
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
      SeatsData : selectedSeatsData, // Include full seat data with individual fares
      Dptime : this.state.busdata.timeD,
      Bptime : this.state.busdata.timeA,
      traceid : this.state.traceId,
      tripkey : this.state.tripKey,
      from : this.state.from,
      to : this.state.to,
      src : this.state.fromCityName,
      dst : this.state.toCityName,
      fare : totalBase, // Total base fare of all selected seats (jo seat par show hai)
      totalfare : totalBase, // Base fare - charges aage add honge
    }
    localStorage.setItem("busdata", JSON.stringify(busdata));
    // Store busdata in state for passing to PassengerDetails component
    this.setState({ preparedBusdata: busdata });
    // Navigation removed - now handled by modal tab switching
  }

  render() {
    
    const { buses, showSeats, seatData, selectedSeats, selectedBusId, showBoardDropModal, selectedBoardingId, selectedDroppingId, busdata, isMobile, showFilters, copyNotification, activeFilters } = this.state;
    
    const filteredBusesList = this.filterBuses(buses) || [];
    
    return (
      <div style={{ background: '#f5f5fa', minHeight: '100vh', fontFamily: 'Inter, sans-serif', width: '100%', overflowX: 'hidden', position: 'relative' }}>
        {/* Copy Notification Toast */}
        {copyNotification && (
          <div style={{
            position: 'fixed',
            top: 20,
            right: 20,
            background: '#22c55e',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 9999,
            fontWeight: 700,
            fontSize: 16,
            animation: 'fadeIn 0.3s ease-in'
          }}>
            ✓ Copied: {copyNotification}
          </div>
        )}
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
            {filteredBusesList.length} buses
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
              <button onClick={() => this.setState({ showFilters: !showFilters })} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, background: showFilters ? '#dc2626' : '#fff', color: showFilters ? '#fff' : '#111', border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>⚙️ Filter & Sort</button>
              <button 
                onClick={() => this.toggleFilter('ac')} 
                style={{ 
                  flexShrink: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  background: activeFilters.ac ? '#dc2626' : '#fff', 
                  color: activeFilters.ac ? '#fff' : '#111',
                  border: '1px solid #e5e7eb', 
                  borderRadius: 12, 
                  padding: '10px 14px', 
                  fontWeight: 700 
                }}
              >
                ❄️ AC ({this.getFilterCount('ac', buses)})
              </button>
              <button 
                onClick={() => this.toggleFilter('sleeper')} 
                style={{ 
                  flexShrink: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  background: activeFilters.sleeper ? '#dc2626' : '#fff',
                  color: activeFilters.sleeper ? '#fff' : '#111',
                  border: '1px solid #e5e7eb', 
                  borderRadius: 12, 
                  padding: '10px 14px', 
                  fontWeight: 700 
                }}
              >
                🛏️ SLEEPER ({this.getFilterCount('sleeper', buses)})
              </button>
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
                {/* <a
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
                </a> */}
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

<div
                    style={{
                      flex: "0 0 auto",
                      borderRadius: 18,
                      background: "linear-gradient(180deg,#e7f3ff,#cfe7ff)",
                      border: "1px solid #cfe2ff",
                      minHeight: isMobile ? 120 : 140,
                      maxWidth: 260,
                      width: isMobile ? 160 : 260,
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
                        On First ticket booking 
                      </div>
                      <div style={{ fontSize: 13, color: "#374151" }}>
                      get 100 off
                      </div>
                    </div>
                    <div
                      onClick={() => this.handleCopyCode('WELCOMEBUDDY')}
                      style={{
                        alignSelf: "flex-start",
                        background: "#f97316",
                        color: "#fff",
                        borderRadius: 8,
                        padding: isMobile ? "5px 8px" : "8px 12px",
                        fontWeight: 700,
                        fontSize: isMobile ? 12 : 13,
                        marginTop: 8,
                        cursor: 'pointer',
                        transition: 'transform 0.2s, background 0.2s',
                        userSelect: 'none'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = '#ea5c00'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#f97316'; }}
                    >
                      CODE: WELCOMEBUDDY
                    </div>
                  </div>
                  {/* Offer 1 */}
               
                  {/* Offer 2 */}

                  {!isMobile && (
                    <div
                      style={{
                        flex: "0 0 auto",
                        borderRadius: 18,
                        background: "linear-gradient(180deg,#e9fff0,#cbfce0)",
                        border: "1px solid #c9f7d6",
                        minHeight: 140,
                        maxWidth: 260,
                        width: 260,
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
                          Get Darchis Cafe Voucher on every 7th booking
                        </div>
                        <div style={{ fontSize: 16, color: "#374151" }}>
                          *upto 30% 
                        </div>
                      </div>
                      <div
                        onClick={() => this.handleCopyCode('DARCHI14')}
                        style={{
                          alignSelf: "flex-start",
                          background: "#22c55e",
                          color: "#fff",
                          borderRadius: 8,
                          padding: "8px 12px",
                          fontWeight: 700,
                          fontSize: 13,
                          marginTop: 8,
                          cursor: 'pointer',
                          transition: 'transform 0.2s, background 0.2s',
                          userSelect: 'none'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = '#16a34a'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#22c55e'; }}
                      >
                        Code: DARCHI14
                      </div>
                    </div>
                  )}
             
                  {/* Offer 3 */}
                  <div
                    style={{
                      flex: "0 0 auto",
                      borderRadius: 18,
                      background: "linear-gradient(180deg,#fff7e6,#ffe8bf)",
                      border: "1px solid #fde7b0",
                      minHeight: isMobile ? 120 : 140,
                      maxWidth: 260,
                      width: isMobile ? 160 : 260,
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
                        Get your 26th ticket for free
                      </div>
                      <div style={{ fontSize: 13, color: "#374151" }}>
                       *upto 500
                      </div>
                    </div>
                    <div
                      onClick={() => this.handleCopyCode('HAPPY26')}
                      style={{
                        alignSelf: "flex-start",
                        background: "#ef4444",
                        color: "#fff",
                        borderRadius: 8,
                        padding: isMobile ? "5px 8px" : "8px 12px",
                        fontWeight: 700,
                        fontSize: isMobile ? 12 : 13,
                        marginTop: 8,
                        cursor: 'pointer',
                        transition: 'transform 0.2s, background 0.2s',
                        userSelect: 'none'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = '#dc2626'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#ef4444'; }}
                    >
                      Code: HAPPY26
                    </div>
                  </div>
                  {/* Offer 4 - hide on mobile */}
                  <div
                    style={{
                      flex: "0 0 auto",
                      borderRadius: 18,
                      background: "linear-gradient(180deg,#ffe9ef,#ffd2dd)",
                      border: "1px solid #ffd1dc",
                      minHeight: isMobile ? 120 : 140,
                      maxWidth: 260,
                      width: isMobile ? 160 : 260,
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
                        Get your 51th ticket for free
                      </div>
                      <div style={{ fontSize: 13, color: "#374151" }}>
                        *upto 1000
                      </div>
                    </div>
                    <div
                      onClick={() => this.handleCopyCode('LOYAL51')}
                      style={{
                        alignSelf: "flex-start",
                        background: "#ef4444",
                        color: "#fff",
                        borderRadius: 8,
                        padding: isMobile ? "5px 8px" : "8px 12px",
                        fontWeight: 700,
                        fontSize: isMobile ? 12 : 13,
                        marginTop: 8,
                        cursor: 'pointer',
                        transition: 'transform 0.2s, background 0.2s',
                        userSelect: 'none'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = '#dc2626'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#ef4444'; }}
                    >
                      CODE: LOYAL51
                    </div>
                  </div>
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
                { icon: '🧊', label: 'AC', key: 'ac' },
                { icon: '🛏️', label: 'SLEEPER', key: 'sleeper' },
                { icon: '💺', label: 'SEATER', key: 'seater' },
                { icon: '🚫🧊', label: 'NONAC', key: 'nonAc' },
                { icon: '🌅', label: '18:00-24:00', key: 'eveningDeparture' },
                { icon: '🌄', label: '06:00-12:00', key: 'morningDeparture' },
                { icon: '🏆', label: 'High Rated Buses', key: 'highRated' },
              ].map((f, i) => {
                const count = this.getFilterCount(f.key, buses);
                const isActive = activeFilters[f.key];
                return (
                  <button
                    key={i}
                    onClick={() => this.toggleFilter(f.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      width: '100%',
                      textAlign: 'left',
                      background: isActive ? '#dc2626' : '#fff',
                      border: `2px solid ${isActive ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: 14,
                      padding: '14px 18px',
                      fontWeight: 600,
                      fontSize: 18,
                      color: isActive ? '#fff' : '#111827',
                      cursor: 'pointer',
                      boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
                      transition: 'background 0.15s ease, border-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => { 
                      if (!isActive) {
                        e.currentTarget.style.background = '#f9fafb'; 
                        e.currentTarget.style.borderColor = '#9ca3af';
                      }
                    }}
                    onMouseLeave={(e) => { 
                      if (!isActive) {
                        e.currentTarget.style.background = '#fff'; 
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }
                    }}
                  >
                    <span aria-hidden="true" style={{ fontSize: 22, width: 26, textAlign: 'center' }}>{f.icon}</span>
                    <span style={{ flex: 1 }}>{f.label}</span>
                    <span style={{ color: isActive ? '#fff' : '#111827', fontWeight: 700 }}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Bus List Column (header + list) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 32, width: '100%' }}>
            {/* List Header: count + sort row and green info strip (desktop only) */}
            {!isMobile && (
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '14px 16px' : '18px 24px' }}>
                <div style={{ fontWeight: 800, fontSize: isMobile ? 18 : 22, color: '#111827' }}>
                  {`${filteredBusesList.length} buses found`}
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
            ) : filteredBusesList.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 16, padding: 48, boxShadow: '0 2px 8px #0001', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 24, color: '#111827', marginBottom: 12 }}>No buses found</div>
                <div style={{ color: '#6b7280', fontSize: 16 }}>Try adjusting your filters</div>
              </div>
            ) : (
            filteredBusesList.map(bus => {
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
                  {/* {showSeats && selectedBusId === bus.id && (
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
                  )} */}

{showSeats && selectedBusId === bus.id && (
                    <div>
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      style={{
                      position: 'fixed',
                      bottom: 0,
                      left: 0,
                      right: 0,
                        top: isMobile ? 0 : 'auto',
                      background: '#fff',
                        borderRadius: isMobile ? '0' : '20px 20px 0 0',
                      padding: isMobile ? 16 : 24,
                      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
                      width: '100%',
                        height: isMobile ? '100vh' : '100vh',
                        maxHeight: isMobile ? '100vh' : '100vh',
                        minHeight: isMobile ? '100vh' : '100vh',
                      overflowY: isMobile ? 'visible' : 'hidden',
                        overflowX: 'hidden',
                      zIndex: 1000,
                      animation: 'slideUpFromBottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      transform: isMobile ? 'none' : 'translateY(0)',
                        borderTop: isMobile ? 'none' : '3px solid #d44',
                        display: 'flex',
                        flexDirection: 'column',
                        boxSizing: 'border-box'
                    }}>
                      <style>
                        {`
                          @keyframes slideUpFromBottom {
                            0% {
                              transform: translateY(100%);
                              opacity: 0;
                            }
                            100% {
                              transform: translateY(0);
                              opacity: 1;
                            }
                          }
                          @keyframes fadeIn {
                            0% {
                              opacity: 0;
                            }
                            100% {
                              opacity: 1;
                            }
                          }
                        `}
                      </style>
                      {/* Header with Close Button and Route */}
                      <div style={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: 24,
                        flexShrink: 0,
                        position: 'relative'
                      }}>
                        {/* Close Button - Top Left */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.setState({ showSeats: false, selectedBusId: null, activeTab: 1 });
                          }}
                          onTouchStart={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.setState({ showSeats: false, selectedBusId: null, activeTab: 1 });
                          }}
                          style={{
                            background: '#fff',
                            border: '2px solid #ddd',
                            borderRadius: '50%',
                            width: isMobile ? 36 : 40,
                            height: isMobile ? 36 : 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer', 
                            fontSize: isMobile ? 20 : 22,
                            color: '#333',
                            fontWeight: 'bold',
                            flexShrink: 0,
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            zIndex: 10
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#f0f0f0';
                            e.currentTarget.style.borderColor = '#bbb';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.borderColor = '#ddd';
                          }}
                        >
                          ✕
                        </button>
                        
                        {/* Route Information - Centered */}
                        <div style={{ 
                          flex: 1, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          marginLeft: isMobile ? 44 : 52,
                          marginRight: isMobile ? 44 : 52,
                          width: '100%'
                        }}>
                          <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: '#333', marginBottom: 8, textAlign: 'center' }}>
                            {this.state.fromCityName} → {this.state.toCityName}
                        </div>
                        
                        {/* Step Navigation - Clickable Tabs */}
                          <div style={{ display: 'flex', gap: isMobile ? 12 : 24, alignItems: 'center', overflowX: 'auto', width: '100%', justifyContent: 'center' }}>
                          <div 
                            onClick={() => this.setState({ activeTab: 1 })}
                            style={{ 
                              color: this.state.activeTab === 1 ? '#d44' : '#666', 
                              fontWeight: this.state.activeTab === 1 ? 600 : 500, 
                              fontSize: isMobile ? 12 : 14,
                              borderBottom: this.state.activeTab === 1 ? '2px solid #d44' : 'none',
                              paddingBottom: 4,
                              whiteSpace: 'nowrap',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            1. Select seats
                          </div>
                          <div 
                            onClick={() => {
                              if (selectedSeats.length > 0) {
                                const { busdata } = this.state;
                                let autoSelectedBoarding = this.state.selectedBoardingId;
                                let autoSelectedDropping = this.state.selectedDroppingId;
                                
                                // Auto-select if only 1 boarding point and 1 dropping point exist
                                if (busdata && busdata.boarding && busdata.boarding.length === 1 && !autoSelectedBoarding) {
                                  autoSelectedBoarding = busdata.boarding[0].id;
                                }
                                
                                if (busdata && busdata.dropping && busdata.dropping.length === 1 && !autoSelectedDropping) {
                                  autoSelectedDropping = busdata.dropping[0].id;
                                }
                                
                                this.setState({ 
                                  activeTab: 2,
                                  selectedBoardingId: autoSelectedBoarding,
                                  selectedDroppingId: autoSelectedDropping
                                });
                              }
                            }}
                            style={{ 
                              color: this.state.activeTab === 2 ? '#d44' : '#666', 
                              fontWeight: this.state.activeTab === 2 ? 600 : 500, 
                              fontSize: isMobile ? 12 : 14,
                              borderBottom: this.state.activeTab === 2 ? '2px solid #d44' : 'none',
                              paddingBottom: 4,
                              whiteSpace: 'nowrap',
                              cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed',
                              opacity: selectedSeats.length > 0 ? 1 : 0.5,
                              transition: 'all 0.2s'
                            }}
                          >
                            2. Board/Drop point
                          </div>
                          <div 
                            onClick={() => selectedSeats.length > 0 && selectedBoardingId && selectedDroppingId && this.setState({ activeTab: 3 })}
                            style={{ 
                              color: this.state.activeTab === 3 ? '#d44' : '#666', 
                              fontWeight: this.state.activeTab === 3 ? 600 : 500, 
                              fontSize: isMobile ? 12 : 14,
                              borderBottom: this.state.activeTab === 3 ? '2px solid #d44' : 'none',
                              paddingBottom: 4,
                              whiteSpace: 'nowrap',
                              cursor: (selectedSeats.length > 0 && selectedBoardingId && selectedDroppingId) ? 'pointer' : 'not-allowed',
                              opacity: (selectedSeats.length > 0 && selectedBoardingId && selectedDroppingId) ? 1 : 0.5,
                              transition: 'all 0.2s'
                            }}
                          >
                            3. Passenger Info
                          </div>
                        </div>
                        </div>
                        
                        {/* Right side spacer to balance the close button */}
                        <div style={{ width: isMobile ? 36 : 40, flexShrink: 0 }}></div>
                      </div>
                      
                      {/* Tab 1: Select Seats */}
                      {this.state.activeTab === 1 && (
                        <>
                      {this.state.isSeatsLoading ? (
                        <div style={{ textAlign: 'center', fontWeight: 600 }}>Loading seats...</div>
                      ) : (
                        <div style={{ 
                          display: 'flex', 
                          gap: 20, 
                          height: isMobile ? 'auto' : 'calc(100vh - 150px)', 
                          alignItems: 'flex-start', 
                          paddingBottom: isMobile && selectedSeats.length > 0 ? '90px' : (isMobile && showSeats ? '180px' : (selectedSeats.length > 0 ? '100px' : '0')), 
                          flexDirection: isMobile ? 'column' : 'row',
                          flex: isMobile ? '0 0 auto' : 1,
                          minHeight: 0,
                          overflowY: isMobile ? 'visible' : 'auto',
                          overflowX: 'hidden',
                          position: 'relative',
                          boxSizing: 'border-box',
                          width: '100%'
                        }}>
                          {/* Left Section - Decks Side by Side, Legend Below */}
                          <div style={{ 
                            flex: isMobile ? 1 : 1, 
                            display: (isMobile && this.state.showMobileBusDetails) ? 'none' : 'flex', 
                            flexDirection: 'column', 
                            gap: 12, // Reduced gap
                            height: 'auto',
                            overflow: 'visible',
                            minHeight: 0,
                            width: isMobile ? '100%' : 'auto',
                            minWidth: 'fit-content',
                            paddingBottom: isMobile && selectedSeats.length > 0 ? '100px' : (isMobile && showSeats ? '180px' : '0')
                          }}>
                            {/* Decks Row - Always Side by Side Like RedBus */}
                            {(() => {
                              // Minimal gap - just 2px between decks since paddingRight is 0
                              var deckGap = 2;
                              
                              return (
                                <div style={{ 
                                  display: 'flex', 
                                  gap: deckGap,
                                  flexShrink: 0,
                                  flexDirection: 'row', // Always side by side
                                  alignItems: 'flex-start',
                                  justifyContent: 'flex-start',
                                  width: '100%',
                                  minWidth: 'fit-content',
                                  overflowX: isMobile ? 'auto' : 'visible',
                                  overflowY: 'visible',
                                  WebkitOverflowScrolling: 'touch'
                                }}>
                              {/* Lower Deck Section */}
                              <div style={{ 
                                flex: '0 0 auto', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                background: 'transparent', 
                                borderRadius: 12, 
                                padding: 0,
                                minWidth: isMobile ? 100 : 380,
                                width: 'auto',
                                height: 'auto',
                                alignSelf: 'flex-start',
                                flexShrink: 0
                              }}>
                            {/* Lower Deck Grid */}
                            <div style={{ 
                              overflowX: 'visible', 
                              overflowY: 'visible',
                              width: '100%',
                              minHeight: 'auto',
                              position: 'relative',
                              WebkitOverflowScrolling: 'touch'
                            }}>
                              {this.renderSeatGrid(seatData, 0)}
                            </div>
                          </div>

                              {/* Upper Deck Section */}
                              <div style={{ 
                                flex: '0 0 auto', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                background: 'transparent', 
                                borderRadius: 12, 
                                padding: 0,
                                minWidth: isMobile ? 270 : 380,
                                width: 'auto',
                                height: 'auto',
                                visibility: 'visible',
                                opacity: 1,
                                flexShrink: 0,
                                alignSelf: 'flex-start'
                              }}>
                            {/* Upper Deck Grid */}
                            <div className="seat-scroll" style={{ 
                              overflowX: 'visible', 
                                  overflowY: 'visible',
                                  width: '100%',
                                  minHeight: 'auto',
                                  position: 'relative',
                                  WebkitOverflowScrolling: 'touch'
                            }}>
                              {this.renderSeatGrid(seatData, 1, 0)}
                                </div>
                            </div>
                          </div>
                            );
                            })()}

                            {/* Seat Types Legend - Below the Decks */}
                          <div
                            style={{
                              background: '#fafbfd',
                              borderRadius: 16,
                              padding: 0,
                              boxShadow: '0px 1px 4px 0 rgba(20,60,120,0.04)',
                              border: '1px solid #eee',
                              marginTop: isMobile ? 16 : 0,
                              width: isMobile ? '90vw' : '100%',
                              maxWidth: isMobile ? '100vw' : '100%',
                             // horizontally align to viewport on mobile
                            }}
                          >
                            <div
                              style={{
                                padding: isMobile ? '20px 8px 12px 8px' : '24px 24px 12px 24px',
                                fontWeight: 700,
                                fontSize: isMobile ? 16 : 17,
                                color: '#222',
                                textAlign: 'center',
                              }}
                            >
                              Know your seat types
                            </div>
                            <div
                              style={{
                                padding: isMobile ? '0 8px 16px 8px' : '0 24px 16px 24px',
                              }}
                            >
                              <table
                                style={{
                                  width: '100%',
                                  borderCollapse: 'collapse',
                                  fontSize: isMobile ? 11 : 15,
                                  color: '#444',
                                  background: 'transparent',
                                }}
                              >
                                <thead>
                                  <tr
                                    style={{
                                      borderBottom: '1px solid #eee',
                                      height: isMobile ? 32 : 38,
                                    }}
                                  >
                                    <th
                                      style={{
                                        textAlign: 'left',
                                        fontWeight: 600,
                                        fontSize: isMobile ? 10 : 14,
                                        color: '#666',
                                      }}
                                    >
                                      Seat Types
                                    </th>
                                    <th
                                      style={{
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        fontSize: isMobile ? 10 : 14,
                                        color: '#666',
                                      }}
                                    >
                                      Seater
                                    </th>
                                    <th
                                      style={{
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        fontSize: isMobile ? 10 : 14,
                                        color: '#666',
                                      }}
                                    >
                                      Sleeper
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* Available */}
                                    <tr style={{ borderBottom: '1px solid #f1f1f1', height: isMobile ? 60 : 70 }}>
                                    <td style={{ 
                                      fontSize: isMobile ? 10 : 'inherit', 
                                      padding: isMobile ? '8px 4px' : undefined,
                                      lineHeight: isMobile ? 1.3 : 'inherit',
                                      wordWrap: isMobile ? 'break-word' : undefined
                                    }}>Available</td>
                                    <td style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : undefined }}>
                                      <span style={{
                                        display: 'inline-block',
                                          width: isMobile ? 24 : 32,
                                          height: isMobile ? 24 : 32,
                                        borderRadius: 7,
                                        background: '#fff',
                                        boxSizing: 'border-box',
                                          border: '2px solid #13a857',
                                          position: 'relative',
                                          verticalAlign: 'middle'
                                        }}>
                                          <svg width={isMobile ? 20 : 28} height={isMobile ? 20 : 28} style={{ display: 'block', margin: 'auto', marginTop: 2 }}>
                                            <rect 
                                              x="7" y="5" width="14" height="11" 
                                              rx="3" 
                                              fill="none" 
                                              stroke="#13a857" 
                                              strokeWidth="2"
                                            />
                                            <rect 
                                              x="8.5" y="8.5" width="11" height="3" 
                                              rx="1.2"
                                              fill="none" 
                                              stroke="#13a857"
                                              strokeWidth="1.4"
                                            />
                                            <rect 
                                              x="12" y="19" width="4" height="2" 
                                              rx="1"
                                              fill="#13a857"
                                              stroke="#13a857"
                                              strokeWidth="0"
                                            />
                                          </svg>
                                      </span>
                                    </td>
                                    <td style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : undefined }}>
                                        <span style={{
                                          display: 'inline-block',
                                          width: isMobile ? 28 : 36,
                                          height: isMobile ? 24 : 32,
                                          borderRadius: 7,
                                          background: '#fff',
                                          boxSizing: 'border-box',
                                          border: '2px solid #13a857',
                                          position: 'relative',
                                          verticalAlign: 'middle'
                                        }}>
                                          <svg width={isMobile ? 24 : 32} height={isMobile ? 20 : 28} style={{ display: 'block', margin: 'auto', marginTop: 2 }}>
                                            <rect 
                                              x="4" y="7" width="22" height="14" 
                                              rx="6" 
                                              fill="none" 
                                              stroke="#13a857" 
                                              strokeWidth="2"
                                            />
                                          </svg>
                                        </span>
                                      </td>
                                    </tr>
                                    {/* Available only for male passenger */}
                                    <tr style={{ borderBottom: '1px solid #f1f1f1', height: isMobile ? 60 : 70 }}>
                                      <td style={{ 
                                        fontSize: isMobile ? 10 : 'inherit', 
                                        padding: isMobile ? '8px 4px' : undefined,
                                        lineHeight: isMobile ? 1.3 : 'inherit',
                                        wordWrap: isMobile ? 'break-word' : undefined
                                      }}>Available only for male passenger</td>
                                      <td style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : undefined }}>
                                      <span style={{
                                        display: 'inline-block',
                                        width: isMobile ? 24 : 32,
                                          height: isMobile ? 24 : 32,
                                          border: '2px solid #3576C9',
                                          borderRadius: 7,
                                          background: '#fff',
                                          boxSizing: 'border-box',
                                          position: 'relative',
                                          verticalAlign: 'middle'
                                        }}>
                                          <svg width={isMobile ? 20 : 28} height={isMobile ? 20 : 28} style={{ display: 'block', margin: 'auto', marginTop: 2 }}>
                                            <rect 
                                              x="7" y="5" width="14" height="11" 
                                              rx="3" 
                                              fill="none" 
                                              stroke="#3576C9" 
                                              strokeWidth="2"
                                            />
                                            <rect 
                                              x="8.5" y="8.5" width="11" height="3" 
                                              rx="1.2"
                                              fill="none" 
                                              stroke="#3576C9"
                                              strokeWidth="1.4"
                                            />
                                            {/* Male icon */}
                                            <circle cx="14" cy="18" r="2.5" fill="#3576C9"/>
                                            <rect x="12.8" y="13.5" width="2.4" height="4" rx="1" fill="#3576C9"/>
                                          </svg>
                                        </span>
                                      </td>
                                      <td style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : undefined }}>
                                        <span style={{
                                          display: 'inline-block',
                                          width: isMobile ? 28 : 36,
                                          height: isMobile ? 24 : 32,
                                          border: '2px solid #3576C9',
                                          borderRadius: 7,
                                          background: '#fff',
                                          boxSizing: 'border-box',
                                          position: 'relative',
                                          verticalAlign: 'middle'
                                        }}>
                                          <svg width={isMobile ? 24 : 32} height={isMobile ? 20 : 28} style={{ display: 'block', margin: 'auto', marginTop: 2 }}>
                                            <rect 
                                              x="4" y="7" width="22" height="14" 
                                              rx="6"
                                              fill="none"
                                              stroke="#3576C9"
                                              strokeWidth="2"
                                            />
                                            {/* Male icon */}
                                            <circle cx="16" cy="21" r="2.5" fill="#3576C9"/>
                                            <rect x="14.8" y="15.5" width="2.4" height="4" rx="1" fill="#3576C9"/>
                                          </svg>
                                        </span>
                                      </td>
                                    </tr>
                                    {/* Already booked */}
                                    <tr style={{ borderBottom: '1px solid #f1f1f1', height: isMobile ? 60 : 70 }}>
                                      <td style={{ 
                                        fontSize: isMobile ? 10 : 'inherit', 
                                        padding: isMobile ? '8px 4px' : undefined,
                                        lineHeight: isMobile ? 1.3 : 'inherit'
                                      }}>Already booked</td>
                                      <td style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : undefined }}>
                                        <span style={{
                                          display: 'inline-block',
                                          width: isMobile ? 24 : 32,
                                          height: isMobile ? 24 : 32,
                                          borderRadius: 7,
                                          background: '#fafbfd',
                                          boxSizing: 'border-box',
                                          border: '2px solid #f5f5f5',
                                          position: 'relative',
                                          verticalAlign: 'middle'
                                        }}>
                                          <svg width={isMobile ? 20 : 28} height={isMobile ? 20 : 28} style={{ display: 'block', margin: 'auto', marginTop: 2, opacity: 0.38 }}>
                                            <rect 
                                              x="7" y="5" width="14" height="11" 
                                              rx="3" 
                                              fill="#e6e6e6"
                                              stroke="#e6e6e6" 
                                              strokeWidth="2"
                                            />
                                            <rect 
                                              x="8.5" y="8.5" width="11" height="3" 
                                              rx="1.2"
                                              fill="#ededed"
                                              stroke="#e6e6e6"
                                              strokeWidth="1.4"
                                            />
                                          </svg>
                                        </span>
                                      </td>
                                      <td style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : undefined }}>
                                        <span style={{
                                          display: 'inline-block',
                                          width: isMobile ? 28 : 36,
                                          height: isMobile ? 24 : 32,
                                          borderRadius: 7,
                                          background: '#fafbfd',
                                          boxSizing: 'border-box',
                                          border: '2px solid #f5f5f5',
                                          position: 'relative',
                                          verticalAlign: 'middle'
                                        }}>
                                          <svg width={isMobile ? 24 : 32} height={isMobile ? 20 : 32} style={{ display: 'block', margin: 'auto', marginTop: 2, opacity: 0.38 }}>
                                            <rect 
                                              x="4" y="7" width="22" height="14" 
                                              rx="6"
                                              fill="#e6e6e6"
                                              stroke="#e6e6e6"
                                              strokeWidth="2"
                                            />
                                          </svg>
                                        </span>
                                      </td>
                                    </tr>
                                    {/* Selected by you */}
                                    <tr style={{ borderBottom: '1px solid #f1f1f1', height: isMobile ? 60 : 70 }}>
                                      <td style={{ 
                                        fontSize: isMobile ? 10 : 'inherit', 
                                        padding: isMobile ? '8px 4px' : undefined,
                                        lineHeight: isMobile ? 1.3 : 'inherit'
                                      }}>Selected by you</td>
                                      <td style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : undefined }}>
                                        <span style={{
                                          display: 'inline-block',
                                          width: isMobile ? 24 : 32,
                                          height: isMobile ? 24 : 32,
                                          borderRadius: 7,
                                          background: '#13a857',
                                          boxSizing: 'border-box',
                                          border: '2px solid #13a857',
                                          position: 'relative',
                                          verticalAlign: 'middle'
                                        }}>
                                          <svg width={isMobile ? 20 : 28} height={isMobile ? 20 : 28} style={{ display: 'block', margin: 'auto', marginTop: 2 }}>
                                            <rect 
                                              x="7" y="5" width="14" height="11" 
                                              rx="3" 
                                              fill="#13a857"
                                              stroke="#13a857"
                                              strokeWidth="2"
                                            />
                                            <rect 
                                              x="8.5" y="8.5" width="11" height="3" 
                                              rx="1.2"
                                              fill="#fff"
                                              stroke="#fff"
                                              strokeWidth="0.5"
                                            />
                                            <rect 
                                              x="12" y="19" width="4" height="2" 
                                              rx="1"
                                              fill="#fff"
                                              stroke="#13a857"
                                              strokeWidth="0"
                                            />
                                          </svg>
                                        </span>
                                      </td>
                                      <td style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : undefined }}>
                                        <span style={{
                                          display: 'inline-block',
                                          width: isMobile ? 28 : 36,
                                          height: isMobile ? 24 : 32,
                                          borderRadius: 7,
                                          background: '#13a857',
                                          boxSizing: 'border-box',
                                          border: '2px solid #13a857',
                                          position: 'relative',
                                          verticalAlign: 'middle'
                                        }}>
                                          <svg width={isMobile ? 24 : 32} height={isMobile ? 20 : 28} style={{ display: 'block', margin: 'auto', marginTop: 2 }}>
                                            <rect 
                                              x="4" y="7" width="22" height="14" 
                                              rx="6"
                                              fill="#13a857"
                                              stroke="#13a857"
                                              strokeWidth="2"
                                            />
                                          </svg>
                                        </span>
                                      </td>
                                    </tr>
                                    {/* Available only for female passenger */}
                                    <tr style={{ borderBottom: '1px solid #f1f1f1', height: isMobile ? 60 : 70 }}>
                                      <td style={{ 
                                        fontSize: isMobile ? 10 : 'inherit', 
                                        padding: isMobile ? '8px 4px' : undefined,
                                        lineHeight: isMobile ? 1.3 : 'inherit',
                                        wordWrap: isMobile ? 'break-word' : undefined
                                      }}>Available only for female passenger</td>
                                      <td style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : undefined }}>
                                        <span style={{
                                          display: 'inline-block',
                                          width: isMobile ? 24 : 32,
                                          height: isMobile ? 24 : 32,
                                          border: '2px solid #E671B8',
                                          borderRadius: 7,
                                          background: '#fff',
                                          boxSizing: 'border-box',
                                          position: 'relative',
                                          verticalAlign: 'middle'
                                        }}>
                                          <svg width={isMobile ? 20 : 28} height={isMobile ? 20 : 28} style={{ display: 'block', margin: 'auto', marginTop: 2 }}>
                                            <rect 
                                              x="7" y="5" width="14" height="11" 
                                              rx="3" 
                                              fill="none" 
                                              stroke="#E671B8" 
                                              strokeWidth="2"
                                            />
                                            <rect 
                                              x="8.5" y="8.5" width="11" height="3" 
                                              rx="1.2"
                                              fill="none" 
                                              stroke="#E671B8"
                                              strokeWidth="1.4"
                                            />
                                            {/* Female icon */}
                                            <circle cx="14" cy="18" r="2.5" fill="#E671B8"/>
                                            <rect x="12.8" y="14.5" width="2.4" height="2.7" rx="1" fill="#E671B8"/>
                                            <rect x="13.2" y="17.5" width="1.6" height="1.8" rx="0.8" fill="#fff" />
                                          </svg>
                                        </span>
                                      </td>
                                      <td style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : undefined }}>
                                        <span style={{
                                          display: 'inline-block',
                                          width: isMobile ? 28 : 36,
                                          height: isMobile ? 24 : 32,
                                          border: '2px solid #E671B8',
                                          borderRadius: 7,
                                          background: '#fff',
                                          boxSizing: 'border-box',
                                          position: 'relative',
                                          verticalAlign: 'middle',
                                        }}
                                      >
                                        <svg
                                          width={isMobile ? 24 : 32}
                                          height={isMobile ? 20 : 32}
                                          style={{
                                            display: 'block',
                                            margin: 'auto',
                                            marginTop: 2,
                                          }}
                                        >
                                          <rect
                                            x={isMobile ? "3" : "4"}
                                            y={isMobile ? "5" : "7"}
                                            width={isMobile ? "18" : "22"}
                                            height={isMobile ? "10" : "14"}
                                            rx={isMobile ? "4" : "6"}
                                            fill="none"
                                            stroke="#E671B8"
                                            strokeWidth="2"
                                          />
                                          {/* Female icon */}
                                          <circle cx={isMobile ? "12" : "16"} cy={isMobile ? "15" : "21"} r="2.5" fill="#E671B8" />
                                          <rect x={isMobile ? "10.8" : "14.8"} y={isMobile ? "15.5" : "17.5"} width="2.4" height="2.7" rx="1" fill="#E671B8" />
                                          <rect x={isMobile ? "11.2" : "15.2"} y={isMobile ? "18.5" : "20.5"} width="1.6" height="1.8" rx="0.8" fill="#fff" />
                                        </svg>
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          </div>

                          {/* Right Section - Bus Details - 50% */}
                          {!isMobile && (
                          <div style={{ 
                            flex: '0 0 50%', 
                            position: 'sticky',
                            top: 0,
                            alignSelf: 'flex-start',
                            minWidth: '50%',
                            maxWidth: '50%',
                            height: 'calc(100vh - 48px)',
                            maxHeight: 'calc(100vh - 48px)'
                          }}>
                            <div style={{ 
                              background: '#f8f9fa', 
                              borderRadius: 16, 
                              padding: 20, 
                              overflowY: 'auto',
                              overflowX: 'hidden',
                              height: '100%',
                              maxHeight: '100%'
                            }}>
                            {/* Bus Operator Info */}
                            <div style={{ marginBottom: 20 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <div style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 4 }}>
                                    {busdata?.name || this.state.busName || 'Bus Name'}
                                  </div>
                                  <div style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>
                                    {busdata?.timeD ? busdata.timeD.split('T')[1].substring(0, 5) : '00:00'} - {busdata?.timeA ? busdata.timeA.split('T')[1].substring(0, 5) : '00:00'} · {(() => {
                                      if (!this.state.date) return '';
                                      const dateObj = new Date(this.state.date);
                                      if (isNaN(dateObj)) return this.state.date;
                                      const day = String(dateObj.getDate()).padStart(2, '0');
                                      const month = dateObj.toLocaleString('en-US', { month: 'short' });
                                      return `${day} ${month}`;
                                    })()}
                                  </div>
                                  <div style={{ fontSize: 14, color: '#666' }}>
                                    {busdata?.type || this.state.busType || 'Bus Type'}
                                  </div>
                                </div>
                                <div style={{ background: '#0fa11f', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: 14, fontWeight: 700 }}>
                                  ★{busdata?.rating || '4.1'} ({busdata?.reviews || '100'})
                                </div>
                              </div>
                            </div>

                            {/* Image Carousel */}
                            <div style={{ marginBottom: 20 }}>
                              <style>
                                {`
                                  .bus-carousel {
                                    scroll-behavior: smooth;
                                    transition: transform 0.3s ease;
                                  }
                                  .bus-carousel::-webkit-scrollbar {
                                    display: none;
                                  }
                                  .bus-carousel:hover {
                                    transform: translateY(-2px);
                                  }
                                  .bus-image {
                                    transition: all 0.3s ease;
                                    cursor: pointer;
                                  }
                                  .bus-image:hover {
                                    transform: scale(1.02);
                                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                                  }
                                  .seat-scroll {
                                    scroll-behavior: smooth;
                                    transition: all 0.3s ease;
                                  }
                                  .seat-scroll:hover {
                                    transform: translateY(-1px);
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                  }
                                  .seat-scroll::-webkit-scrollbar {
                                    width: 6px;
                                    height: 6px;
                                  }
                                  .seat-scroll::-webkit-scrollbar-track {
                                    background: #f1f1f1;
                                    border-radius: 3px;
                                  }
                                  .seat-scroll::-webkit-scrollbar-thumb {
                                    background: #d44;
                                    border-radius: 3px;
                                  }
                                  .seat-scroll::-webkit-scrollbar-thumb:hover {
                                    background: #b33;
                                  }
                                `}
                              </style>
                              <div className="bus-carousel" style={{ 
                                display: 'flex', 
                                overflowX: 'auto', 
                                gap: 0, 
                                padding: '8px 0',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                              }}>
                                <div className="bus-image" style={{
                                  width: 244.8,
                                  height: 158.97,
                                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                  borderRadius: 8,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: '#666',
                                  border: '1px solid #ddd',
                                  marginRight: 8,
                                  flexShrink: 0
                                }}>
                                  Bus Exterior
                                </div>
                                <div className="bus-image" style={{
                                  width: 244.8,
                                  height: 158.97,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  borderRadius: 8,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: '#fff',
                                  marginRight: 8,
                                  flexShrink: 0
                                }}>
                                  Interior View
                                </div>
                                <div className="bus-image" style={{
                                  width: 244.8,
                                  height: 158.97,
                                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                  borderRadius: 8,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: '#fff',
                                  marginRight: 8,
                                  flexShrink: 0
                                }}>
                                  Amenities
                                </div>
                                <div style={{
                                  width: 40,
                                  height: 159,
                                  background: '#ddd',
                                  borderRadius: 8,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 16,
                                  color: '#666',
                                  flexShrink: 0
                                }}>
                                  →
                                </div>
                              </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div style={{ marginBottom: 20 }}>
                              <div style={{ display: 'flex', gap: 16, marginBottom: 16, overflowX: 'auto' }}>
                                <div style={{ 
                                  color: '#d44', 
                                  fontWeight: 600, 
                                  fontSize: 14,
                                  borderBottom: '2px solid #d44',
                                  paddingBottom: 4,
                                  whiteSpace: 'nowrap'
                                }}>
                                  Why book this bus?
                                </div>
                                <div style={{ color: '#666', fontSize: 14, whiteSpace: 'nowrap' }}>Bus route</div>
                                <div style={{ color: '#666', fontSize: 14, whiteSpace: 'nowrap' }}>Boarding point</div>
                                <div style={{ color: '#666', fontSize: 14, whiteSpace: 'nowrap' }}>Dropping point</div>
                                <div style={{ color: '#666', fontSize: 14, whiteSpace: 'nowrap' }}>Rest stop</div>
                              </div>
                            </div>

                            {/* Why book this bus content */}
                            <div>
                              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: '#333' }}>Why book this bus?</div>
                              <div style={{ 
                                background: '#fff', 
                                borderRadius: 12, 
                                border: '1px solid #e9ecef',
                                padding: 16
                              }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f8f9fa' }}>
                                    <div style={{ fontSize: 20 }}>🧳</div>
                                    <div style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Women Traveling</div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f8f9fa' }}>
                                    <div style={{ fontSize: 20 }}>👤</div>
                                    <div style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Highly rated by women</div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f8f9fa' }}>
                                    <div style={{ fontSize: 20 }}>🚽</div>
                                    <div style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Toilet</div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
                                    <div style={{ fontSize: 20 }}>📍</div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 4 }}>Live Tracking</div>
                                      <div style={{ fontSize: 12, color: '#666', lineHeight: 1.4 }}>
                                        You can now track your bus and plan your commute to the boarding...
                                      </div>
                                    </div>
                                    <div style={{ fontSize: 16, color: '#666', marginLeft: 8 }}>⌄</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Bus route content */}
                            <div style={{ marginTop: 24 }}>
                              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#333' }}>Bus route</div>
                              <div style={{ 
                                background: '#fff', 
                                borderRadius: 12, 
                                border: '1px solid #e9ecef',
                                padding: 16,
                                marginBottom: 8
                              }}>
                                <div style={{ fontSize: 20, color: '#666', fontWeight: 600, marginBottom: 12 }}>
                                  {(() => {
                                    if (!busdata?.timeD || !busdata?.timeA) return '';
                                    const dep = new Date(busdata.timeD);
                                    let arr = new Date(busdata.timeA);
                                    if (arr < dep) arr.setDate(arr.getDate() + 1);
                                    const diffMs = arr - dep;
                                    const hours = Math.floor(diffMs / (1000 * 60 * 60));
                                    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                    return `${hours} hr ${minutes} min`;
                                  })()}
                                </div>
                                {/* Route cities */}
                                <div style={{ 
                                  display: 'flex', 
                                  flexWrap: 'wrap', 
                                  gap: '8px 4px',
                                  fontSize: 20,
                                  color: '#333'
                                }}>
                                  <span style={{ fontWeight: 700 }}>{this.state.fromCityName}</span>
                                  {this.state.toCityName && (
                                    <>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span>Kaparda(Rajasthan)</span>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span>Bilara</span>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span>Khariya (rajasthan)</span>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span>Jaitaran</span>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span>Nimbaj</span>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span>Bar (rajasthan)</span>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span>Beawar (Rajasthan)</span>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span>Kharwa</span>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span>Ajmer</span>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span>Kishangarh (Rajasthan)</span>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span>Dudu</span>
                                      <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                      <span style={{ fontWeight: 700 }}>{this.state.toCityName}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Boarding point content */}
                            <div style={{ marginTop: 24 }}>
                              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, color: '#222', letterSpacing: 0.1 }}>Boarding point</div>
                              <div style={{ fontSize: 15, color: '#888', marginBottom: 20 }}>
                                {this.state.fromCityName}
                              </div>
                              <div
                                style={{
                                  background: "#fff",
                                  borderRadius: 16,
                                  border: "1px solid #f4f1f1",
                                  padding: 24,
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                }}
                              >
                                <div style={{ position: "relative", paddingLeft: 0, marginBottom: 10 }}>
                                  {busdata && busdata.boarding && busdata.boarding.length > 0 ? (
                                    <>
                                      {/* Vertical line */}
                                      <div
                                        style={{
                                          position: "absolute",
                                          left: 90,
                                          top: 0,
                                          bottom: busdata.boarding.length > 0 ? 14 : 0,
                                          width: 2,
                                          background: "#e0e0e0",
                                          zIndex: 0,
                                        }}
                                      />
                                      {busdata.boarding.slice(0, 4).map((point, index) => {
                                      // For "disabled" style: last item of first 4 that is not in top 3, for demo only
                                      const isFaded =
                                        busdata.boarding.length > 4 && index === 3;
                                      return (
                                        <div
                                          key={point.id || index}
                                          style={{
                                            display: "flex",
                                            position: "relative",
                                            alignItems: "flex-start",
                                            marginBottom:
                                              index !== Math.min(busdata.boarding.length, 4) - 1
                                                ? 16
                                                : 0,
                                            opacity: isFaded ? 0.5 : 1,
                                          }}
                                        >
                                          {/* Time and Date */}
                                           <div style={{ width: 70, textAlign: "right", marginRight: 18, flexShrink: 0 }}>
                                             <div
                                               style={{
                                                 fontWeight: 600,
                                                 fontSize: 18,
                                                 color: isFaded ? "#aaa" : "#222",
                                                 marginBottom: 2,
                                                 letterSpacing: 0.15,
                                               }}
                                             >
                                               {point.btime ? point.btime.substring(0, 5) : (point.time ? point.time.substring(0, 5) : "00:00")}
                                             </div>
                                            <div
                                              style={{
                                                fontSize: 18,
                                                color: isFaded ? "#bbb" : "#888",
                                                fontWeight: 500,
                                              }}
                                            >
                                              {(() => {
                                                if (!this.state.date) return "";
                                                const dateObj = new Date(this.state.date);
                                                if (isNaN(dateObj)) return "";
                                                const day = dateObj.getDate();
                                                const month = dateObj.toLocaleString("en-US", {
                                                  month: "short",
                                                });
                                                return `${day} ${month}`;
                                              })()}
                                            </div>
                                          </div>

                                          {/* Dot */}
                                          <div
                                            style={{
                                              position: "absolute",
                                              left: 86,
                                              top: 2,
                                              width: 14,
                                              height: 14,
                                              background: isFaded ? "#ededed" : "#222",
                                              border:
                                                "3px solid #fff",
                                              borderRadius: "50%",
                                              zIndex: 1,
                                            }}
                                          />

                                          {/* Boarding point details */}
                                          <div style={{ flex: 1, marginLeft: 26 }}>
                                            <div
                                              style={{
                                                fontSize: 20,
                                                fontWeight: 700,
                                                color: isFaded ? "#999" : "#222",
                                                marginBottom: 4,
                                                lineHeight: 1.4,
                                                textTransform: "none",
                                              }}
                                            >
                                              {point.name || point.boardingPointName || 'Boarding Point'}
                                            </div>
                                            {(point.address || point.fullAddress) && (
                                              <div
                                                style={{
                                                  fontSize: 11,
                                                  color: isFaded ? "#aaa" : "#888",
                                                  textTransform: "uppercase",
                                                  lineHeight: 1.4,
                                                  fontWeight: 400,
                                                  letterSpacing: 0.5,
                                                }}
                                              >
                                                {point.address || point.fullAddress}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                      </>
                                    ) : (
                                      <div style={{ textAlign: 'center', padding: '20px 0', color: '#888' }}>
                                        No boarding points available
                                      </div>
                                    )}
                                  </div>

                                  {/* View all button if more than 4 points */}
                                  {busdata && busdata.boarding && busdata.boarding.length > 4 && (
                                    <button
                                      style={{
                                        width: "100%",
                                        background: "#ffe5e5",
                                        color: "#ba5555",
                                        border: "none",
                                        borderRadius: 22,
                                        padding: "13px 0",
                                        fontWeight: 700,
                                        fontSize: 16,
                                        marginTop: 18,
                                        cursor: "pointer",
                                        boxShadow:
                                          "0 1px 4px 0 rgba(235, 60, 60, 0.09)",
                                        letterSpacing: 0.04,
                                        outline: 0,
                                        transition: "background 0.15s"
                                      }}
                                    >
                                      View all boarding points
                                    </button>
                                  )}
                                </div>
                              </div>

                            {/* Dropping point content */}
                            {busdata && busdata.dropping && busdata.dropping.length > 0 && (
                              <div style={{ marginTop: 24 }}>
                                <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, color: '#222', letterSpacing: 0.1 }}>Dropping point</div>
                                <div style={{ fontSize: 15, color: '#888', marginBottom: 20 }}>
                                  {this.state.toCityName}
                                </div>
                                <div style={{ 
                                  background: '#fff', 
                                  borderRadius: 16, 
                                  border: '1px solid #f4f1f1',
                                  padding: 24,
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                }}>
                                  <div style={{ position: 'relative', paddingLeft: 0, marginBottom: 10 }}>
                                    {(() => {
                                      const droppingPoints = busdata.dropping && busdata.dropping.length > 0 ? busdata.dropping.slice(0, 4) : [];
                                      const totalPoints = droppingPoints.length;
                                      
                                      return (
                                        <>
                                          <div style={{
                                            position: 'absolute',
                                            left: 90,
                                            top: 0,
                                            bottom: totalPoints > 0 ? 14 : 0,
                                            width: 2,
                                            background: '#e0e0e0',
                                            zIndex: 0,
                                          }} />
                                          {droppingPoints.map((point, index) => {
                                            const isFaded = totalPoints > 4 && index === 3;
                                            const isLast = index === totalPoints - 1;
                                            return (
                                              <div key={point.id || index} style={{
                                                display: 'flex',
                                                position: 'relative',
                                                alignItems: 'flex-start',
                                                marginBottom: isLast ? 0 : 16,
                                                opacity: isFaded ? 0.5 : 1,
                                              }}>
                                                <div style={{ width: 70, textAlign: 'right', marginRight: 18, flexShrink: 0 }}>
                                                  <div style={{ fontWeight: 600, fontSize: 20, color: isFaded ? '#aaa' : '#222', marginBottom: 2, letterSpacing: 0.15 }}>
                                                    {point.dtime ? point.dtime.substring(0, 5) : (point.time ? point.time.substring(0, 5) : '06:00')}
                                                  </div>
                                                  <div style={{ fontSize: 18, color: isFaded ? '#bbb' : '#888', fontWeight: 500 }}>
                                                    {(() => {
                                                      if (!this.state.date) return '';
                                                      const dateObj = new Date(this.state.date);
                                                      if (isNaN(dateObj)) return '';
                                                      const day = dateObj.getDate();
                                                      const month = dateObj.toLocaleString('en-US', { month: 'short' });
                                                      return `${day} ${month}`;
                                                    })()}
                                                  </div>
                                                </div>
                                                <div style={{ position: 'absolute', left: 86, top: 2, width: 14, height: 14, background: isFaded ? '#ededed' : '#222', border: '3px solid #fff', borderRadius: '50%', zIndex: 1 }} />
                                                <div style={{ flex: 1, marginLeft: 26 }}>
                                                  <div style={{ fontSize: 18, fontWeight: 700, color: isFaded ? '#999' : '#222', marginBottom: 4, lineHeight: 1.4 }}>
                                                    {point.name || point.droppingPointName || 'Dropping Point'}
                                                  </div>
                                                  {(point.address || point.fullAddress) && (
                                                    <div style={{ fontSize: 11, color: isFaded ? '#aaa' : '#888', textTransform: 'uppercase', lineHeight: 1.4, fontWeight: 400, letterSpacing: 0.5 }}>
                                                      {point.address || point.fullAddress}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </>
                                      );
                                    })()}
                                  </div>

                                  {/* View all button if more than 4 points */}
                                  {busdata.dropping && busdata.dropping.length > 4 && (
                                    <button
                                      style={{
                                        width: "100%",
                                        background: "#ffe5e5",
                                        color: "#ba5555",
                                        border: "none",
                                        borderRadius: 22,
                                        padding: "13px 0",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        marginTop: 18,
                                        cursor: "pointer",
                                        boxShadow:
                                          "0 1px 4px 0 rgba(235, 60, 60, 0.09)",
                                        letterSpacing: 0.04,
                                        outline: 0,
                                        transition: "background 0.15s"
                                      }}
                                    >
                                      View all dropping points
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Rest stop content */}
                            <div style={{ marginTop: 24 }}>
                              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#222', letterSpacing: 0.1 }}>Rest stop</div>
                              <div style={{ 
                                background: '#ffe5e5', 
                                borderRadius: 12, 
                                padding: '12px 16px',
                                color: '#ba5555',
                                fontSize: 15,
                                fontWeight: 600
                              }}>
                                This bus has no rest stop
                              </div>
                            </div>

                            {/* Amenities content */}
                            <div style={{ marginTop: 24 }}>
                              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#222', letterSpacing: 0.1 }}>3 amenities</div>
                              <div style={{ 
                                background: '#fff', 
                                borderRadius: 16, 
                                border: '1px solid #f4f1f1',
                                padding: 24,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                  <span style={{ fontSize: 24 }}>🚰</span>
                                  <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Water Bottle</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                  <span style={{ fontSize: 24 }}>⚡</span>
                                  <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Charging Point</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <span style={{ fontSize: 24 }}>💡</span>
                                  <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Reading Light</span>
                                </div>
                              </div>
                            </div>

                            {/* Ratings & reviews content */}
                            <div style={{ marginTop: 24 }}>
                              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#222', letterSpacing: 0.1 }}>Ratings & reviews</div>
                              <div style={{ 
                                background: '#fff', 
                                borderRadius: 16, 
                                border: '1px solid #f4f1f1',
                                padding: 24,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                              }}>
                                {/* Overall Rating */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24 }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 32 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                      <span style={{ fontSize: 40, fontWeight: 700, color: '#333' }}>4.6</span>
                                      <span style={{ fontSize: 32, color: '#22c55e' }}>★</span>
                                    </div>
                                    <div style={{ fontSize: 14, color: '#666' }}>371 Ratings</div>
                                  </div>

                                  {/* Rating Distribution */}
                                  <div style={{ flex: 1 }}>
                                    {[
                                      { stars: 5, percent: 79 },
                                      { stars: 4, percent: 14 },
                                      { stars: 3, percent: 4 },
                                      { stars: 2, percent: 0 },
                                      { stars: 1, percent: 3 }
                                    ].map((rating) => (
                                      <div key={rating.stars} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', width: 80 }}>
                                          <span style={{ fontSize: 14, color: '#333', fontWeight: 600 }}>{rating.stars}</span>
                                          <span style={{ fontSize: 14, color: '#333', marginLeft: 4 }}>★</span>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                                          <div style={{ 
                                            width: `${rating.percent}%`, 
                                            height: 8, 
                                            background: '#333',
                                            borderRadius: 4
                                          }} />
                                          <div style={{ 
                                            width: `${100 - rating.percent}%`, 
                                            height: 8, 
                                            background: '#e5e5e5',
                                            borderRadius: 4
                                          }} />
                                          <span style={{ fontSize: 12, color: '#666', marginLeft: 8, minWidth: 35, textAlign: 'right' }}>
                                            {rating.percent}%
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Loved by travelers */}
                                <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 20 }}>
                                  <div style={{ fontSize: 18, fontWeight: 700, color: '#222', marginBottom: 16 }}>Loved by travelers</div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {[
                                      { name: 'Punctuality', count: 127 },
                                      { name: 'Seat / Sleep Comfort', count: 119 },
                                      { name: 'Driving', count: 118 },
                                      { name: 'AC', count: 118 },
                                      { name: 'Cleanliness', count: 116 },
                                      { name: 'Staff behavior', count: 113 },
                                      { name: 'Live tracking', count: 99 },
                                      { name: 'Rest stop hygiene', count: 91 }
                                    ].map((item) => (
                                      <div key={item.name} style={{
                                        background: '#22c55e',
                                        color: '#fff',
                                        borderRadius: 20,
                                        padding: '6px 12px',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        display: 'inline-block'
                                      }}>
                                        {item.name} ({item.count})
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Read all reviews button */}
                                <button style={{
                                  width: '100%',
                                  background: '#ffe5e5',
                                  color: '#ba5555',
                                  border: 'none',
                                  borderRadius: 22,
                                  padding: '13px 0',
                                  fontWeight: 700,
                                  fontSize: 14,
                                  marginTop: 20,
                                  cursor: 'pointer',
                                  boxShadow: '0 1px 4px 0 rgba(235, 60, 60, 0.09)',
                                  letterSpacing: 0.04,
                                  outline: 0,
                                  transition: 'background 0.15s'
                                }}>
                                  Read all 109 reviews
                                </button>
                              </div>
                            </div>

                            {/* Cancellation policy content */}
                            <div style={{ marginTop: 24 }}>
                              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#222', letterSpacing: 0.1 }}>Cancellation policy</div>
                              <div style={{ 
                                background: '#fff', 
                                borderRadius: 16, 
                                border: '1px solid #f4f1f1',
                                padding: 24,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                              }}>
                                {/* Cancellation Policy Table */}
                                <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                                  {/* Table Headers */}
                                  <div style={{ display: 'flex', background: '#f9f9f9', borderBottom: '1px solid #e5e5e5' }}>
                                    <div style={{ flex: 1, padding: '12px 16px', fontWeight: 700, fontSize: 14, color: '#222' }}>Time before travel</div>
                                    <div style={{ flex: 0.5, padding: '12px 16px', fontWeight: 700, fontSize: 14, color: '#222', textAlign: 'right' }}>Deduction</div>
                                  </div>
                                  
                                  {/* Table Rows */}
                                  {(() => {
                                    // Calculate dates based on current booking date
                                    const bookingDate = this.state.date ? new Date(this.state.date) : new Date();
                                    const month = bookingDate.toLocaleString('en-US', { month: 'short' });
                                    const day = bookingDate.getDate();
                                    const year = bookingDate.getFullYear();
                                    
                                    return (
                                      <>
                                        {/* Row 1 - Highlighted */}
                                        <div style={{ display: 'flex', background: '#fff4e5', borderBottom: '1px solid #e5e5e5' }}>
                                          <div style={{ flex: 1, padding: '12px 16px', fontSize: 14, color: '#333' }}>
                                            Before {day} {month} {year} 01:30 PM
                                          </div>
                                          <div style={{ flex: 0.5, padding: '12px 16px', fontSize: 14, color: '#333', textAlign: 'right', fontWeight: 600 }}>
                                            ₹65 (10%)
                                          </div>
                                        </div>
                                        
                                        {/* Row 2 */}
                                        <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
                                          <div style={{ flex: 1, padding: '12px 16px', fontSize: 14, color: '#333' }}>
                                            From {day} {month} {year} 01:30 PM Until {day} {month} {year} 06:30 PM
                                          </div>
                                          <div style={{ flex: 0.5, padding: '12px 16px', fontSize: 14, color: '#333', textAlign: 'right', fontWeight: 600 }}>
                                            ₹325 (50%)
                                          </div>
                                        </div>
                                        
                                        {/* Row 3 */}
                                        <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
                                          <div style={{ flex: 1, padding: '12px 16px', fontSize: 14, color: '#333' }}>
                                            From {day} {month} {year} 06:30 PM Until {day} {month} {year} 08:30 PM
                                          </div>
                                          <div style={{ flex: 0.5, padding: '12px 16px', fontSize: 14, color: '#333', textAlign: 'right', fontWeight: 600 }}>
                                            ₹488 (75%)
                                          </div>
                                        </div>
                                        
                                        {/* Row 4 */}
                                        <div style={{ display: 'flex', background: '#fff' }}>
                                          <div style={{ flex: 1, padding: '12px 16px', fontSize: 14, color: '#333' }}>
                                            From {day} {month} {year} 08:30 PM Until {day} {month} {year} 10:30 PM
                                          </div>
                                          <div style={{ flex: 0.5, padding: '12px 16px', fontSize: 14, color: '#333', textAlign: 'right', fontWeight: 600 }}>
                                            ₹650 (100%)
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>

                                {/* Notes */}
                                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
                                  <div style={{ marginBottom: 8 }}>
                                    • Cancellation charges are computed on a per seat basis. Above cancellation fare is calculated based on seat fare of ₹ 650
                                  </div>
                                  <div style={{ marginBottom: 8 }}>
                                    • Cancellation charges are calculated based on service start date + time at : {(() => {
                                      const date = this.state.date ? new Date(this.state.date) : new Date();
                                      const day = String(date.getDate()).padStart(2, '0');
                                      const month = String(date.getMonth() + 1).padStart(2, '0');
                                      const year = date.getFullYear();
                                      return `${day}-${month}-${year} 22:30`;
                                    })()}
                                  </div>
                                  <div style={{ marginBottom: 8 }}>
                                    • Ticket cannot be cancelled after scheduled bus departure time from the first boarding point
                                  </div>
                                  <div style={{ marginBottom: 8 }}>
                                    • Note: Cancellation charges mentioned above are excluding GST
                                  </div>
                                  <div>
                                    • For group bookings cancellation of individual seats is not allowed.
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Other Policies content */}
                            <div style={{ marginTop: 24 }}>
                              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#222', letterSpacing: 0.1 }}>Other Policies</div>
                              <div style={{ 
                                background: '#fff', 
                                borderRadius: 16, 
                                border: '1px solid #f4f1f1',
                                padding: 24,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                              }}>
                                {/* Child passenger policy */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                                  <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #333', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ fontSize: 20 }}>👤</div>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                                      Child passenger policy
                                    </div>
                                    <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                      Children above the age of 8 will need a ticket
                                    </div>
                                  </div>
                                </div>

                                {/* Luggage policy */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                                  <div style={{ width: 40, height: 40, borderRadius: 8, border: '2px solid #333', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ fontSize: 18 }}>📦</div>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                                      Luggage policy
                                    </div>
                                    <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                      2 pieces of luggage will be accepted free of charge per passenger. Excess items will be chargeable
                                    </div>
                                  </div>
                                </div>

                                {/* Pets Policy */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                                  <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #d44', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                    <div style={{ fontSize: 20 }}>🐾</div>
                                    <div style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 2, background: '#d44', transform: 'rotate(45deg)' }} />
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                                      Pets Policy
                                    </div>
                                    <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                      Pets are not allowed
                                    </div>
                                  </div>
                                </div>

                                {/* Liquor Policy */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                                  <div style={{ width: 40, height: 40, borderRadius: 8, border: '2px solid #d44', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ fontSize: 18 }}>🍾</div>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                                      Liquor Policy
                                    </div>
                                    <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                      Carrying or consuming liquor inside the bus is prohibited. Bus operator reserves the right to deboard drunk passengers.
                                    </div>
                                  </div>
                                </div>

                                {/* Pick up time policy */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                  <div style={{ width: 40, height: 40, borderRadius: 8, border: '2px solid #333', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ fontSize: 18 }}>🚍</div>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                                      Pick up time policy
                                    </div>
                                    <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                      Bus operator is not obligated to wait beyond the scheduled departure time of the bus. No refund request will be entertained for late arriving passengers.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            </div>
                          </div>
                          )}

                          {/* Mobile Bus Details Bottom Sheet - Always Visible, Partially Shown */}
                          {isMobile && showSeats && (
                            <>
                              {/* Backdrop overlay when expanded */}
                              {this.state.showMobileBusDetails && (
                                <div 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    this.setState({ showMobileBusDetails: false });
                                  }}
                              style={{ 
                                position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                bottom: selectedSeats.length > 0 ? '80px' : 0,
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    zIndex: 1001,
                                    animation: 'fadeIn 0.3s ease-out'
                                  }}
                                />
                              )}
                              <div 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onTouchStart={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onTouchEnd={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              style={{ 
                                position: 'fixed',
                                bottom: selectedSeats.length > 0 ? '80px' : '0px',
                                left: '0px',
                                right: '0px',
                                top: 'auto',
                                background: '#fff',
                                borderRadius: this.state.showMobileBusDetails ? '0' : '16px 16px 0 0',
                                boxShadow: this.state.showMobileBusDetails ? '0 0 20px rgba(0,0,0,0.3)' : '0 -2px 12px rgba(0,0,0,0.15)',
                                zIndex: 1002,
                                height: this.state.showMobileBusDetails ? 'calc(100vh - ' + (selectedSeats.length > 0 ? '80px' : '0px') + ')' : 'auto',
                                minHeight: this.state.showMobileBusDetails ? 'calc(100vh - ' + (selectedSeats.length > 0 ? '80px' : '0px') + ')' : '120px',
                                maxHeight: this.state.showMobileBusDetails ? 'calc(100vh - ' + (selectedSeats.length > 0 ? '80px' : '0px') + ')' : '40vh',
                                width: '100%',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                touchAction: 'pan-y',
                                willChange: 'transform',
                                WebkitTransform: 'translateZ(0)',
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                margin: 0,
                                padding: 0,
                                boxSizing: 'border-box'
                              }}
                            >
                                {/* Header with Close Button when expanded */}
                                {this.state.showMobileBusDetails && (
                              <div style={{ 
                                    padding: '16px',
                                    borderBottom: '1px solid #eee',
                                    flexShrink: 0,
                                    background: '#fff'
                                  }}>
                                    {/* Drag Handle */}
                                    <div 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        this.setState({ showMobileBusDetails: false });
                                      }}
                                      onTouchStart={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        this.setState({ showMobileBusDetails: false });
                                      }}
                                      style={{ 
                                        width: '100%',
                                        paddingBottom: 8,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        touchAction: 'manipulation',
                                        WebkitTapHighlightColor: 'transparent',
                                        userSelect: 'none'
                                      }}
                                    >
                                      <div style={{ 
                                        width: 48,
                                        height: 5,
                                        background: '#ccc',
                                        borderRadius: 3,
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                      }}></div>
                                    </div>
                                    {/* Close Button - Top Right */}
                                    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'flex-end' }}>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          this.setState({ showMobileBusDetails: false });
                                        }}
                                        onTouchStart={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          this.setState({ showMobileBusDetails: false });
                                        }}
                                        style={{
                                          background: '#fff',
                                          border: '2px solid #ddd',
                                          fontSize: 20,
                                          color: '#333',
                                          cursor: 'pointer',
                                          padding: '4px',
                                display: 'flex',
                                          alignItems: 'center',
                                justifyContent: 'center',
                                          width: 36,
                                          height: 36,
                                          borderRadius: '50%',
                                          transition: 'all 0.2s',
                                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                          fontWeight: 'bold'
                                        }}
                                        onMouseOver={(e) => {
                                          e.currentTarget.style.background = '#f0f0f0';
                                          e.currentTarget.style.borderColor = '#bbb';
                                        }}
                                        onMouseOut={(e) => {
                                          e.currentTarget.style.background = '#fff';
                                          e.currentTarget.style.borderColor = '#ddd';
                                        }}
                                      >
                                        ←
                                      </button>
                              </div>
                              
                                    {/* Bus Operator Name and Rating */}
                              <div style={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'flex-start',
                                      marginBottom: 8
                                    }}>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 8 }}>
                                      {busdata?.name || this.state.busName || 'Bus Name'}
                                    </div>
                                        <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                                      {busdata?.timeD ? busdata.timeD.split('T')[1].substring(0, 5) : '00:00'} - {busdata?.timeA ? busdata.timeA.split('T')[1].substring(0, 5) : '00:00'} · {(() => {
                                        if (!this.state.date) return '';
                                        const dateObj = new Date(this.state.date);
                                        if (isNaN(dateObj)) return this.state.date;
                                        const day = String(dateObj.getDate()).padStart(2, '0');
                                        const month = dateObj.toLocaleString('en-US', { month: 'short' });
                                            const dayName = dateObj.toLocaleString('en-US', { weekday: 'short' });
                                            return `${dayName} ${day} ${month}`;
                                      })()}
                                    </div>
                                        <div style={{ fontSize: 14, color: '#666', lineHeight: 1.4 }}>
                                      {busdata?.type || this.state.busType || 'Bus Type'}
                                    </div>
                                  </div>
                                      {/* Rating Badge */}
                                      <div style={{ 
                                        background: '#0fa11f', 
                                        color: '#fff', 
                                        padding: '8px 12px', 
                                        borderRadius: 20, 
                                        fontSize: 12, 
                                        fontWeight: 700,
                                        marginLeft: 12,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        minWidth: 60
                                      }}>
                                        <div style={{ fontSize: 16, marginBottom: 2 }}>★{busdata?.rating || '4.3'}</div>
                                        <div style={{ fontSize: 10 }}>({busdata?.reviews || '303'})</div>
                                  </div>
                                </div>
                              </div>
                                )}
                              
                              {/* Collapsed/Peek View - Always Visible when collapsed */}
                              {!this.state.showMobileBusDetails && (
                                <div style={{ flexShrink: 0 }}>
                                  {/* Drag Handle */}
                                  <div 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      e.nativeEvent?.stopImmediatePropagation?.();
                                      if (!this.state.showMobileBusDetails) {
                                        this.setState({ showMobileBusDetails: true });
                                      }
                                    }}
                                    onTouchStart={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (!this.state.showMobileBusDetails) {
                                        this.setState({ showMobileBusDetails: true });
                                      }
                                    }}
                                    onTouchEnd={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    style={{ 
                                      width: '100%',
                                      paddingTop: 12,
                                      paddingBottom: 4,
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      cursor: 'pointer',
                                      flexShrink: 0,
                                      touchAction: 'manipulation',
                                      WebkitTapHighlightColor: 'transparent',
                                      userSelect: 'none'
                                    }}
                                  >
                                    <div style={{ 
                                      width: 48,
                                      height: 5,
                                      background: '#ccc',
                                      borderRadius: 3,
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                    }}></div>
                                  </div>
                                  
                                  {/* Bus Info Card */}
                                  <div 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      e.nativeEvent?.stopImmediatePropagation?.();
                                      if (!this.state.showMobileBusDetails) {
                                        this.setState({ showMobileBusDetails: true });
                                      }
                                    }}
                                    onTouchStart={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (!this.state.showMobileBusDetails) {
                                        this.setState({ showMobileBusDetails: true });
                                      }
                                    }}
                                    onTouchEnd={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    style={{ 
                                      padding: '0 16px 16px 16px',
                                      cursor: 'pointer',
                                      flexShrink: 0,
                                      touchAction: 'manipulation',
                                      WebkitTapHighlightColor: 'transparent'
                                    }}
                                  >
                                    <div 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!this.state.showMobileBusDetails) {
                                          this.setState({ showMobileBusDetails: true });
                                        }
                                      }}
                                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                                    >
                                      <div style={{ flex: 1 }}>
                                        {/* Bus Operator Name */}
                                        <div style={{ fontSize: 16, fontWeight: 700, color: '#333', marginBottom: 6 }}>
                                        {busdata?.name || this.state.busName || 'Bus Name'}
                                      </div>
                                        {/* Journey Timing and Date */}
                                        <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                                        {busdata?.timeD ? busdata.timeD.split('T')[1].substring(0, 5) : '00:00'} - {busdata?.timeA ? busdata.timeA.split('T')[1].substring(0, 5) : '00:00'} · {(() => {
                                          if (!this.state.date) return '';
                                          const dateObj = new Date(this.state.date);
                                          if (isNaN(dateObj)) return this.state.date;
                                          const day = String(dateObj.getDate()).padStart(2, '0');
                                          const month = dateObj.toLocaleString('en-US', { month: 'short' });
                                            const dayName = dateObj.toLocaleString('en-US', { weekday: 'short' });
                                            return `${dayName} ${day} ${month}`;
                                        })()}
                                      </div>
                                        {/* Bus Type */}
                                        <div style={{ fontSize: 13, color: '#666', lineHeight: 1.4 }}>
                                        {busdata?.type || this.state.busType || 'Bus Type'}
                                      </div>
                                    </div>
                                      {/* Rating Badge */}
                                      <div style={{ 
                                        background: '#0fa11f', 
                                        color: '#fff', 
                                        padding: '6px 12px', 
                                        borderRadius: 20, 
                                        fontSize: 12, 
                                        fontWeight: 700,
                                        marginLeft: 12,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        minWidth: 60
                                      }}>
                                        <div style={{ fontSize: 14 }}>★{busdata?.rating || '4.3'}</div>
                                        <div style={{ fontSize: 10, marginTop: 2 }}>({busdata?.reviews || '303'})</div>
                                    </div>
                                  </div>
                                </div>
                                </div>
                              )}

                              {/* Expanded View - Scrollable Content */}
                              {this.state.showMobileBusDetails && (
                                <div style={{ 
                                  flex: 1,
                                  overflowY: 'auto',
                                  overflowX: 'hidden',
                                  background: '#f8f9fa',
                                  WebkitOverflowScrolling: 'touch',
                                  minHeight: 0,
                                  width: '100%',
                                  position: 'relative'
                                }}>
                                  <div style={{ padding: '0 16px 16px 16px' }}>

                                {/* Image Carousel */}
                                    <div style={{ marginBottom: 20, marginTop: 16 }}>
                                  <style>
                                    {`
                                      .bus-carousel {
                                        scroll-behavior: smooth;
                                        transition: transform 0.3s ease;
                                      }
                                      .bus-carousel::-webkit-scrollbar {
                                            width: 4px;
                                          }
                                          .bus-carousel::-webkit-scrollbar-track {
                                            background: transparent;
                                          }
                                          .bus-carousel::-webkit-scrollbar-thumb {
                                            background: #ccc;
                                            border-radius: 2px;
                                      }
                                    `}
                                  </style>
                                  <div className="bus-carousel" style={{ 
                                    display: 'flex', 
                                    overflowX: 'auto', 
                                        gap: 12, 
                                    padding: '8px 0',
                                        scrollbarWidth: 'thin',
                                        msOverflowStyle: 'auto'
                                  }}>
                                    <div className="bus-image" style={{
                                          width: '70%',
                                          minWidth: 200,
                                          height: 160,
                                          background: 'linear-gradient(135deg, #8B4513 0%, #D4AF37 100%)',
                                          borderRadius: 12,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                          fontSize: 14,
                                      fontWeight: 600,
                                          color: '#fff',
                                          flexShrink: 0,
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}>
                                      Bus Exterior
                                    </div>
                                    <div className="bus-image" style={{
                                          width: '25%',
                                          minWidth: 120,
                                          height: 160,
                                          background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                                          borderRadius: 12,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: 12,
                                      fontWeight: 600,
                                      color: '#fff',
                                          flexShrink: 0,
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}>
                                          More Images
                                    </div>
                                  </div>
                                </div>

                                {/* Navigation Tabs */}
                                <div style={{ marginBottom: 20 }}>
                                      <div style={{ display: 'flex', gap: 20, marginBottom: 16, overflowX: 'auto', paddingBottom: 8 }}>
                                    <div style={{ 
                                      color: '#d44', 
                                      fontWeight: 600, 
                                          fontSize: 15,
                                      borderBottom: '2px solid #d44',
                                          paddingBottom: 6,
                                          whiteSpace: 'nowrap',
                                          cursor: 'pointer'
                                    }}>
                                      Why book this bus?
                                    </div>
                                        <div style={{ 
                                          color: '#666', 
                                          fontSize: 15, 
                                          whiteSpace: 'nowrap',
                                          paddingBottom: 6,
                                          cursor: 'pointer'
                                        }}>
                                          Bus route
                                        </div>
                                        <div style={{ 
                                          color: '#666', 
                                          fontSize: 15, 
                                          whiteSpace: 'nowrap',
                                          paddingBottom: 6,
                                          cursor: 'pointer'
                                        }}>
                                          Boarding point
                                        </div>
                                  </div>
                                </div>

                                {/* Why book this bus content */}
                                <div>
                                      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#333' }}>Why book this bus?</div>
                                  <div style={{ 
                                    background: '#fff', 
                                    borderRadius: 12, 
                                    border: '1px solid #e9ecef',
                                    padding: 16
                                  }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #f8f9fa' }}>
                                            <div style={{ fontSize: 22, minWidth: 30 }}>👤</div>
                                            <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>Highly rated by women</div>
                                      </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #f8f9fa' }}>
                                            <div style={{ fontSize: 22, minWidth: 30 }}>🚽</div>
                                            <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>Toilet</div>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 0' }}>
                                            <div style={{ fontSize: 22, minWidth: 30, marginTop: 2 }}>📍</div>
                                            <div style={{ flex: 1 }}>
                                              <div style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 4 }}>Live Tracking</div>
                                              <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                                                You can now track your bus and plan your commute to the boarding point
                                              </div>
                                            </div>
                                            <div style={{ fontSize: 18, color: '#999', marginLeft: 8, alignSelf: 'flex-start', marginTop: 2 }}>⌄</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Bus route content */}
                                    <div style={{ marginTop: 24 }}>
                                      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#333' }}>Bus route</div>
                                      <div style={{ 
                                        background: '#fff', 
                                        borderRadius: 12, 
                                        border: '1px solid #e9ecef',
                                        padding: 16,
                                        marginBottom: 8
                                      }}>
                                        <div style={{ fontSize: 20, color: '#666', fontWeight: 600, marginBottom: 12 }}>
                                          {(() => {
                                            if (!busdata?.timeD || !busdata?.timeA) return '';
                                            const dep = new Date(busdata.timeD);
                                            let arr = new Date(busdata.timeA);
                                            if (arr < dep) arr.setDate(arr.getDate() + 1);
                                            const diffMs = arr - dep;
                                            const hours = Math.floor(diffMs / (1000 * 60 * 60));
                                            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                            return `${hours} hr ${minutes} min`;
                                          })()}
                                        </div>
                                        {/* Route cities */}
                                        <div style={{ 
                                          display: 'flex', 
                                          flexWrap: 'wrap', 
                                          gap: '8px 4px',
                                          fontSize: 20,
                                          color: '#333'
                                        }}>
                                          <span style={{ fontWeight: 700 }}>{this.state.fromCityName}</span>
                                          {this.state.toCityName && (
                                            <>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span>Kaparda(Rajasthan)</span>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span>Bilara</span>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span>Khariya (rajasthan)</span>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span>Jaitaran</span>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span>Nimbaj</span>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span>Bar (rajasthan)</span>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span>Beawar (Rajasthan)</span>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span>Kharwa</span>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span>Ajmer</span>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span>Kishangarh (Rajasthan)</span>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span>Dudu</span>
                                              <span style={{ color: '#999' }}>{'>'}{'>'}</span>
                                              <span style={{ fontWeight: 700 }}>{this.state.toCityName}</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Boarding point content */}
                                    <div style={{ marginTop: 24 }}>
                                      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, color: '#222', letterSpacing: 0.1 }}>Boarding point</div>
                                      <div style={{ fontSize: 15, color: '#888', marginBottom: 20 }}>
                                        {this.state.fromCityName}
                                      </div>
                                      <div
                                        style={{
                                          background: "#fff",
                                          borderRadius: 16,
                                          border: "1px solid #f4f1f1",
                                          padding: 24,
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                        }}
                                      >
                                        <div style={{ position: "relative", paddingLeft: 0, marginBottom: 10 }}>
                                          {busdata && busdata.boarding && busdata.boarding.length > 0 ? (
                                            <>
                                              {/* Vertical line */}
                                              <div
                                                style={{
                                                  position: "absolute",
                                                  left: 90,
                                                  top: 0,
                                                  bottom: busdata.boarding.length > 0 ? 14 : 0,
                                                  width: 2,
                                                  background: "#e0e0e0",
                                                  zIndex: 0,
                                                }}
                                              />
                                              {busdata.boarding.slice(0, 4).map((point, index) => {
                                              // For "disabled" style: last item of first 4 that is not in top 3, for demo only
                                              const isFaded =
                                                busdata.boarding.length > 4 && index === 3;
                                              return (
                                                <div
                                                  key={point.id || index}
                                                  style={{
                                                    display: "flex",
                                                    position: "relative",
                                                    alignItems: "flex-start",
                                                    marginBottom:
                                                      index !== Math.min(busdata.boarding.length, 4) - 1
                                                        ? 16
                                                        : 0,
                                                    opacity: isFaded ? 0.5 : 1,
                                                  }}
                                                >
                                                  {/* Time and Date */}
                                                   <div style={{ width: 70, textAlign: "right", marginRight: 18, flexShrink: 0 }}>
                                                     <div
                                                       style={{
                                                         fontWeight: 600,
                                                         fontSize: 18,
                                                         color: isFaded ? "#aaa" : "#222",
                                                         marginBottom: 2,
                                                         letterSpacing: 0.15,
                                                       }}
                                                     >
                                                       {point.btime ? point.btime.substring(0, 5) : (point.time ? point.time.substring(0, 5) : "00:00")}
                                                     </div>
                                                    <div
                                                      style={{
                                                        fontSize: 18,
                                                        color: isFaded ? "#bbb" : "#888",
                                                        fontWeight: 500,
                                                      }}
                                                    >
                                                      {(() => {
                                                        if (!this.state.date) return "";
                                                        const dateObj = new Date(this.state.date);
                                                        if (isNaN(dateObj)) return "";
                                                        const day = dateObj.getDate();
                                                        const month = dateObj.toLocaleString("en-US", {
                                                          month: "short",
                                                        });
                                                        return `${day} ${month}`;
                                                      })()}
                                                    </div>
                                                  </div>

                                                  {/* Dot */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      left: 86,
                                                      top: 2,
                                                      width: 14,
                                                      height: 14,
                                                      background: isFaded ? "#ededed" : "#222",
                                                      border:
                                                        "3px solid #fff",
                                                      borderRadius: "50%",
                                                      zIndex: 1,
                                                    }}
                                                  />

                                                  {/* Boarding point details */}
                                                  <div style={{ flex: 1, marginLeft: 26 }}>
                                                    <div
                                                      style={{
                                                        fontSize: 20,
                                                        fontWeight: 700,
                                                        color: isFaded ? "#999" : "#222",
                                                        marginBottom: 4,
                                                        lineHeight: 1.4,
                                                        textTransform: "none",
                                                      }}
                                                    >
                                                      {point.name || point.boardingPointName || 'Boarding Point'}
                                                    </div>
                                                    {(point.address || point.fullAddress) && (
                                                      <div
                                                        style={{
                                                          fontSize: 11,
                                                          color: isFaded ? "#aaa" : "#888",
                                                          textTransform: "uppercase",
                                                          lineHeight: 1.4,
                                                          fontWeight: 400,
                                                          letterSpacing: 0.5,
                                                        }}
                                                      >
                                                        {point.address || point.fullAddress}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                              </>
                                            ) : (
                                              <div style={{ textAlign: 'center', padding: '20px 0', color: '#888' }}>
                                                No boarding points available
                                              </div>
                                            )}
                                          </div>

                                          {/* View all button if more than 4 points */}
                                          {busdata && busdata.boarding && busdata.boarding.length > 4 && (
                                            <button
                                              style={{
                                                width: "100%",
                                                background: "#ffe5e5",
                                                color: "#ba5555",
                                                border: "none",
                                                borderRadius: 22,
                                                padding: "13px 0",
                                                fontWeight: 700,
                                                fontSize: 16,
                                                marginTop: 18,
                                                cursor: "pointer",
                                                boxShadow:
                                                  "0 1px 4px 0 rgba(235, 60, 60, 0.09)",
                                                letterSpacing: 0.04,
                                                outline: 0,
                                                transition: "background 0.15s"
                                              }}
                                            >
                                              View all boarding points
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                    {/* Dropping point content */}
                                    {busdata && busdata.dropping && busdata.dropping.length > 0 && (
                                      <div style={{ marginTop: 24 }}>
                                        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, color: '#222', letterSpacing: 0.1 }}>Dropping point</div>
                                        <div style={{ fontSize: 15, color: '#888', marginBottom: 20 }}>
                                          {this.state.toCityName}
                                        </div>
                                        <div style={{ 
                                          background: '#fff', 
                                          borderRadius: 16, 
                                          border: '1px solid #f4f1f1',
                                          padding: 24,
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                        }}>
                                          <div style={{ position: 'relative', paddingLeft: 0, marginBottom: 10 }}>
                                            {(() => {
                                              const droppingPoints = busdata.dropping && busdata.dropping.length > 0 ? busdata.dropping.slice(0, 4) : [];
                                              const totalPoints = droppingPoints.length;
                                              
                                              return (
                                                <>
                                                  <div style={{
                                                    position: 'absolute',
                                                    left: 90,
                                                    top: 0,
                                                    bottom: totalPoints > 0 ? 14 : 0,
                                                    width: 2,
                                                    background: '#e0e0e0',
                                                    zIndex: 0,
                                                  }} />
                                                  {droppingPoints.map((point, index) => {
                                                    const isFaded = totalPoints > 4 && index === 3;
                                                    const isLast = index === totalPoints - 1;
                                                    return (
                                                      <div key={point.id || index} style={{
                                                        display: 'flex',
                                                        position: 'relative',
                                                        alignItems: 'flex-start',
                                                        marginBottom: isLast ? 0 : 16,
                                                        opacity: isFaded ? 0.5 : 1,
                                                      }}>
                                                        <div style={{ width: 70, textAlign: 'right', marginRight: 18, flexShrink: 0 }}>
                                                          <div style={{ fontWeight: 600, fontSize: 20, color: isFaded ? '#aaa' : '#222', marginBottom: 2, letterSpacing: 0.15 }}>
                                                            {point.dtime ? point.dtime.substring(0, 5) : (point.time ? point.time.substring(0, 5) : '06:00')}
                                                          </div>
                                                          <div style={{ fontSize: 18, color: isFaded ? '#bbb' : '#888', fontWeight: 500 }}>
                                                            {(() => {
                                                              if (!this.state.date) return '';
                                                              const dateObj = new Date(this.state.date);
                                                              if (isNaN(dateObj)) return '';
                                                              const day = dateObj.getDate();
                                                              const month = dateObj.toLocaleString('en-US', { month: 'short' });
                                                              return `${day} ${month}`;
                                                            })()}
                                                          </div>
                                                        </div>
                                                        <div style={{ position: 'absolute', left: 86, top: 2, width: 14, height: 14, background: isFaded ? '#ededed' : '#222', border: '3px solid #fff', borderRadius: '50%', zIndex: 1 }} />
                                                        <div style={{ flex: 1, marginLeft: 26 }}>
                                                          <div style={{ fontSize: 18, fontWeight: 700, color: isFaded ? '#999' : '#222', marginBottom: 4, lineHeight: 1.4 }}>
                                                            {point.name || point.droppingPointName || 'Dropping Point'}
                                                          </div>
                                                          {(point.address || point.fullAddress) && (
                                                            <div style={{ fontSize: 11, color: isFaded ? '#aaa' : '#888', textTransform: 'uppercase', lineHeight: 1.4, fontWeight: 400, letterSpacing: 0.5 }}>
                                                              {point.address || point.fullAddress}
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </>
                                              );
                                            })()}
                                          </div>

                                          {/* View all button if more than 4 points */}
                                          {busdata.dropping && busdata.dropping.length > 4 && (
                                            <button
                                              style={{
                                                width: "100%",
                                                background: "#ffe5e5",
                                                color: "#ba5555",
                                                border: "none",
                                                borderRadius: 22,
                                                padding: "13px 0",
                                                fontWeight: 700,
                                                fontSize: 14,
                                                marginTop: 18,
                                                cursor: "pointer",
                                                boxShadow:
                                                  "0 1px 4px 0 rgba(235, 60, 60, 0.09)",
                                                letterSpacing: 0.04,
                                                outline: 0,
                                                transition: "background 0.15s"
                                              }}
                                            >
                                              View all dropping points
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Rest stop content */}
                                    <div style={{ marginTop: 24 }}>
                                      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#222', letterSpacing: 0.1 }}>Rest stop</div>
                                      <div style={{ 
                                        background: '#ffe5e5', 
                                        borderRadius: 12, 
                                        padding: '12px 16px',
                                        color: '#ba5555',
                                        fontSize: 15,
                                        fontWeight: 600
                                      }}>
                                        This bus has no rest stop
                                      </div>
                                    </div>

                                    {/* Amenities content */}
                                    <div style={{ marginTop: 24 }}>
                                      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#222', letterSpacing: 0.1 }}>3 amenities</div>
                                      <div style={{ 
                                        background: '#fff', 
                                        borderRadius: 16, 
                                        border: '1px solid #f4f1f1',
                                        padding: 24,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                      }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                          <span style={{ fontSize: 24 }}>🚰</span>
                                          <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Water Bottle</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                          <span style={{ fontSize: 24 }}>⚡</span>
                                          <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Charging Point</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                          <span style={{ fontSize: 24 }}>💡</span>
                                          <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Reading Light</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Ratings & reviews content */}
                                    <div style={{ marginTop: 24 }}>
                                      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#222', letterSpacing: 0.1 }}>Ratings & reviews</div>
                                      <div style={{ 
                                        background: '#fff', 
                                        borderRadius: 16, 
                                        border: '1px solid #f4f1f1',
                                        padding: 24,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                      }}>
                                        {/* Overall Rating */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24 }}>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 32 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                              <span style={{ fontSize: 40, fontWeight: 700, color: '#333' }}>4.6</span>
                                              <span style={{ fontSize: 32, color: '#22c55e' }}>★</span>
                                            </div>
                                            <div style={{ fontSize: 14, color: '#666' }}>371 Ratings</div>
                                          </div>

                                          {/* Rating Distribution */}
                                          <div style={{ flex: 1 }}>
                                            {[
                                              { stars: 5, percent: 79 },
                                              { stars: 4, percent: 14 },
                                              { stars: 3, percent: 4 },
                                              { stars: 2, percent: 0 },
                                              { stars: 1, percent: 3 }
                                            ].map((rating) => (
                                              <div key={rating.stars} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', width: 80 }}>
                                                  <span style={{ fontSize: 14, color: '#333', fontWeight: 600 }}>{rating.stars}</span>
                                                  <span style={{ fontSize: 14, color: '#333', marginLeft: 4 }}>★</span>
                                                </div>
                                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                  <div style={{ 
                                                    width: `${rating.percent}%`, 
                                                    height: 8, 
                                                    background: '#333',
                                                    borderRadius: 4
                                                  }} />
                                                  <div style={{ 
                                                    width: `${100 - rating.percent}%`, 
                                                    height: 8, 
                                                    background: '#e5e5e5',
                                                    borderRadius: 4
                                                  }} />
                                                  <span style={{ fontSize: 12, color: '#666', marginLeft: 8, minWidth: 35, textAlign: 'right' }}>
                                                    {rating.percent}%
                                                  </span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Loved by travelers */}
                                        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 20 }}>
                                          <div style={{ fontSize: 18, fontWeight: 700, color: '#222', marginBottom: 16 }}>Loved by travelers</div>
                                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {[
                                              { name: 'Punctuality', count: 127 },
                                              { name: 'Seat / Sleep Comfort', count: 119 },
                                              { name: 'Driving', count: 118 },
                                              { name: 'AC', count: 118 },
                                              { name: 'Cleanliness', count: 116 },
                                              { name: 'Staff behavior', count: 113 },
                                              { name: 'Live tracking', count: 99 },
                                              { name: 'Rest stop hygiene', count: 91 }
                                            ].map((item) => (
                                              <div key={item.name} style={{
                                                background: '#22c55e',
                                                color: '#fff',
                                                borderRadius: 20,
                                                padding: '6px 12px',
                                                fontSize: 13,
                                                fontWeight: 600,
                                                display: 'inline-block'
                                              }}>
                                                {item.name} ({item.count})
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Read all reviews button */}
                                        <button style={{
                                          width: '100%',
                                          background: '#ffe5e5',
                                          color: '#ba5555',
                                          border: 'none',
                                          borderRadius: 22,
                                          padding: '13px 0',
                                          fontWeight: 700,
                                          fontSize: 14,
                                          marginTop: 20,
                                          cursor: 'pointer',
                                          boxShadow: '0 1px 4px 0 rgba(235, 60, 60, 0.09)',
                                          letterSpacing: 0.04,
                                          outline: 0,
                                          transition: 'background 0.15s'
                                        }}>
                                          Read all 109 reviews
                                        </button>
                                      </div>
                                    </div>

                                    {/* Cancellation policy content */}
                                    <div style={{ marginTop: 24 }}>
                                      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#222', letterSpacing: 0.1 }}>Cancellation policy</div>
                                      <div style={{ 
                                        background: '#fff', 
                                        borderRadius: 16, 
                                        border: '1px solid #f4f1f1',
                                        padding: 24,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                      }}>
                                        {/* Cancellation Policy Table */}
                                        <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                                          {/* Table Headers */}
                                          <div style={{ display: 'flex', background: '#f9f9f9', borderBottom: '1px solid #e5e5e5' }}>
                                            <div style={{ flex: 1, padding: '12px 16px', fontWeight: 700, fontSize: 14, color: '#222' }}>Time before travel</div>
                                            <div style={{ flex: 0.5, padding: '12px 16px', fontWeight: 700, fontSize: 14, color: '#222', textAlign: 'right' }}>Deduction</div>
                                          </div>
                                          
                                          {/* Table Rows */}
                                          {(() => {
                                            // Calculate dates based on current booking date
                                            const bookingDate = this.state.date ? new Date(this.state.date) : new Date();
                                            const month = bookingDate.toLocaleString('en-US', { month: 'short' });
                                            const day = bookingDate.getDate();
                                            const year = bookingDate.getFullYear();
                                            
                                            return (
                                              <>
                                                {/* Row 1 - Highlighted */}
                                                <div style={{ display: 'flex', background: '#fff4e5', borderBottom: '1px solid #e5e5e5' }}>
                                                  <div style={{ flex: 1, padding: '12px 16px', fontSize: 14, color: '#333' }}>
                                                    Before {day} {month} {year} 01:30 PM
                                                  </div>
                                                  <div style={{ flex: 0.5, padding: '12px 16px', fontSize: 14, color: '#333', textAlign: 'right', fontWeight: 600 }}>
                                                    ₹65 (10%)
                                                  </div>
                                                </div>
                                                
                                                {/* Row 2 */}
                                                <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
                                                  <div style={{ flex: 1, padding: '12px 16px', fontSize: 14, color: '#333' }}>
                                                    From {day} {month} {year} 01:30 PM Until {day} {month} {year} 06:30 PM
                                                  </div>
                                                  <div style={{ flex: 0.5, padding: '12px 16px', fontSize: 14, color: '#333', textAlign: 'right', fontWeight: 600 }}>
                                                    ₹325 (50%)
                                                  </div>
                                                </div>
                                                
                                                {/* Row 3 */}
                                                <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
                                                  <div style={{ flex: 1, padding: '12px 16px', fontSize: 14, color: '#333' }}>
                                                    From {day} {month} {year} 06:30 PM Until {day} {month} {year} 08:30 PM
                                                  </div>
                                                  <div style={{ flex: 0.5, padding: '12px 16px', fontSize: 14, color: '#333', textAlign: 'right', fontWeight: 600 }}>
                                                    ₹488 (75%)
                                                  </div>
                                                </div>
                                                
                                                {/* Row 4 */}
                                                <div style={{ display: 'flex', background: '#fff' }}>
                                                  <div style={{ flex: 1, padding: '12px 16px', fontSize: 14, color: '#333' }}>
                                                    From {day} {month} {year} 08:30 PM Until {day} {month} {year} 10:30 PM
                                                  </div>
                                                  <div style={{ flex: 0.5, padding: '12px 16px', fontSize: 14, color: '#333', textAlign: 'right', fontWeight: 600 }}>
                                                    ₹650 (100%)
                                                  </div>
                                                </div>
                                              </>
                                            );
                                          })()}
                                        </div>

                                        {/* Notes */}
                                        <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
                                          <div style={{ marginBottom: 8 }}>
                                            • Cancellation charges are computed on a per seat basis. Above cancellation fare is calculated based on seat fare of ₹ 650
                                          </div>
                                          <div style={{ marginBottom: 8 }}>
                                            • Cancellation charges are calculated based on service start date + time at : {(() => {
                                              const date = this.state.date ? new Date(this.state.date) : new Date();
                                              const day = String(date.getDate()).padStart(2, '0');
                                              const month = String(date.getMonth() + 1).padStart(2, '0');
                                              const year = date.getFullYear();
                                              return `${day}-${month}-${year} 22:30`;
                                            })()}
                                          </div>
                                          <div style={{ marginBottom: 8 }}>
                                            • Ticket cannot be cancelled after scheduled bus departure time from the first boarding point
                                          </div>
                                          <div style={{ marginBottom: 8 }}>
                                            • Note: Cancellation charges mentioned above are excluding GST
                                          </div>
                                          <div>
                                            • For group bookings cancellation of individual seats is not allowed.
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Other Policies content */}
                                    <div style={{ marginTop: 24, marginBottom: 24 }}>
                                      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#222', letterSpacing: 0.1 }}>Other Policies</div>
                                      <div style={{ 
                                        background: '#fff', 
                                        borderRadius: 16, 
                                        border: '1px solid #f4f1f1',
                                        padding: 24,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                      }}>
                                        {/* Child passenger policy */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                                          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #333', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ fontSize: 20 }}>👤</div>
                                      </div>
                                          <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                                              Child passenger policy
                                      </div>
                                            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                              Children above the age of 8 will need a ticket
                                            </div>
                                          </div>
                                        </div>

                                        {/* Luggage policy */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                                          <div style={{ width: 40, height: 40, borderRadius: 8, border: '2px solid #333', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ fontSize: 18 }}>📦</div>
                                          </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                                              Luggage policy
                                          </div>
                                            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                              2 pieces of luggage will be accepted free of charge per passenger. Excess items will be chargeable
                                        </div>
                                      </div>
                                    </div>

                                        {/* Pets Policy */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                                          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #d44', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                            <div style={{ fontSize: 20 }}>🐾</div>
                                            <div style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 2, background: '#d44', transform: 'rotate(45deg)' }} />
                                          </div>
                                          <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                                              Pets Policy
                                            </div>
                                            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                              Pets are not allowed
                                            </div>
                                  </div>
                                </div>

                                        {/* Liquor Policy */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                                          <div style={{ width: 40, height: 40, borderRadius: 8, border: '2px solid #d44', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ fontSize: 18 }}>🍾</div>
                                </div>
                                          <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                                              Liquor Policy
                                            </div>
                                            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                              Carrying or consuming liquor inside the bus is prohibited. Bus operator reserves the right to deboard drunk passengers.
                                            </div>
                                          </div>
                                        </div>

                                        {/* Pick up time policy */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                          <div style={{ width: 40, height: 40, borderRadius: 8, border: '2px solid #333', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ fontSize: 18 }}>🚍</div>
                                          </div>
                                          <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                                              Pick up time policy
                                            </div>
                                            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                              Bus operator is not obligated to wait beyond the scheduled departure time of the bus. No refund request will be entertained for late arriving passengers.
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                </div>
                              </div>
                            </div>
                              )}
                            </div>
                            </>
                          )}
                        </div>
                      )}
                        </>
                      )}
                      
                      {/* Tab 2: Board/Drop Point Selection */}
                      {this.state.activeTab === 2 && (
                        <div style={{ 
                          padding: isMobile ? '20px 16px' : '40px', 
                          background: '#fff',
                          borderRadius: 16,
                          maxWidth: isMobile ? '100%' : 1200,
                          margin: '0 auto',
                          width: '100%',
                          height: isMobile ? 'auto' : 'calc(100vh - 200px)',
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            fontSize: isMobile ? 20 : 24, 
                            fontWeight: 700, 
                            color: '#333', 
                            marginBottom: 8,
                            flexShrink: 0
                          }}>
                            Select Boarding & Dropping Point
                    </div>
                          <div style={{ 
                            fontSize: 14, 
                            color: '#666', 
                            marginBottom: 24,
                            flexShrink: 0
                          }}>
                            Choose your preferred boarding and dropping points for this journey
                          </div>
                          
                          {/* Two Column Layout */}
                          <div style={{
                            display: 'flex',
                            gap: isMobile ? 16 : 20,
                            flex: 1,
                            minHeight: 0,
                            overflow: 'hidden',
                            flexDirection: isMobile ? 'column' : 'row'
                          }}>
                            {/* Left Column - Boarding Points */}
                            <div style={{ 
                              flex: isMobile ? '1 1 auto' : '0 0 50%',
                              width: isMobile ? '100%' : 'auto',
                              display: 'flex',
                              flexDirection: 'column',
                              minHeight: isMobile ? '300px' : 0,
                              maxWidth: isMobile ? '100%' : '50%'
                            }}>
                              <label style={{ 
                                display: 'block',
                                fontSize: 16, 
                                fontWeight: 600,
                                color: '#333',
                                marginBottom: 16,
                                flexShrink: 0
                              }}>
                                Boarding Point
                              </label>
                              <div style={{
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: 12,
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                flex: 1,
                                minHeight: 0
                              }}>
                                {busdata && busdata.boarding && busdata.boarding.length > 0 ? (
                                  busdata.boarding.map((point, index) => (
                                    <div
                                      key={point.id}
                                      onClick={() => this.setState({ selectedBoardingId: point.id })}
                                      style={{
                                        padding: '16px 20px',
                                        cursor: 'pointer',
                                        borderBottom: index < busdata.boarding.length - 1 ? '1px solid #e5e7eb' : 'none',
                                        background: selectedBoardingId === point.id ? '#fff5f5' : '#fff',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 12,
                                        minHeight: '60px'
                                      }}
                                      onMouseOver={(e) => {
                                        if (selectedBoardingId !== point.id) {
                                          e.currentTarget.style.background = '#f9fafb';
                                        }
                                      }}
                                      onMouseOut={(e) => {
                                        if (selectedBoardingId !== point.id) {
                                          e.currentTarget.style.background = '#fff';
                                        }
                                      }}
                                    >
                                      <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                                        <div style={{ 
                                          fontSize: 16, 
                                          fontWeight: selectedBoardingId === point.id ? 600 : 500,
                                          color: selectedBoardingId === point.id ? '#d44' : '#333',
                                          marginBottom: 4,
                                          wordBreak: 'break-word',
                                          overflowWrap: 'break-word'
                                        }}>
                                          {point.name}
                                        </div>
                                        {point.time && (
                                          <div style={{ 
                                            fontSize: 13, 
                                            color: '#666',
                                            marginTop: 2
                                          }}>
                                            Time: {point.time}
                                          </div>
                                        )}
                                      </div>
                                      <div style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        border: selectedBoardingId === point.id ? '6px solid #d44' : '2px solid #ddd',
                                        background: selectedBoardingId === point.id ? '#fff' : 'transparent',
                                        transition: 'all 0.2s',
                                        flexShrink: 0,
                                        marginLeft: 'auto'
                                      }} />
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    No boarding points available
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Right Column - Dropping Points */}
                            <div style={{ 
                              flex: isMobile ? '1 1 auto' : '0 0 50%',
                              width: isMobile ? '100%' : 'auto',
                              display: 'flex',
                              flexDirection: 'column',
                              minHeight: isMobile ? '300px' : 0,
                              maxWidth: isMobile ? '100%' : '50%'
                            }}>
                              <label style={{ 
                                display: 'block',
                                fontSize: 16, 
                                fontWeight: 600,
                                color: '#333',
                                marginBottom: 16,
                                flexShrink: 0
                              }}>
                                Dropping Point
                              </label>
                              <div style={{
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: 12,
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                flex: 1,
                                minHeight: 0
                              }}>
                                {busdata && busdata.dropping && busdata.dropping.length > 0 ? (
                                  busdata.dropping.map((point, index) => (
                                    <div
                                      key={point.id}
                                      onClick={() => this.setState({ selectedDroppingId: point.id })}
                                      style={{
                                        padding: '16px 20px',
                                        cursor: 'pointer',
                                        borderBottom: index < busdata.dropping.length - 1 ? '1px solid #e5e7eb' : 'none',
                                        background: selectedDroppingId === point.id ? '#fff5f5' : '#fff',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 12,
                                        minHeight: '60px'
                                      }}
                                      onMouseOver={(e) => {
                                        if (selectedDroppingId !== point.id) {
                                          e.currentTarget.style.background = '#f9fafb';
                                        }
                                      }}
                                      onMouseOut={(e) => {
                                        if (selectedDroppingId !== point.id) {
                                          e.currentTarget.style.background = '#fff';
                                        }
                                      }}
                                    >
                                      <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                                        <div style={{ 
                                          fontSize: 16, 
                                          fontWeight: selectedDroppingId === point.id ? 600 : 500,
                                          color: selectedDroppingId === point.id ? '#d44' : '#333',
                                          marginBottom: 4,
                                          wordBreak: 'break-word',
                                          overflowWrap: 'break-word'
                                        }}>
                                          {point.name}
                                        </div>
                                        {point.time && (
                                          <div style={{ 
                                            fontSize: 13, 
                                            color: '#666',
                                            marginTop: 2
                                          }}>
                                            Time: {point.time}
                                          </div>
                                        )}
                                      </div>
                                      <div style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        border: selectedDroppingId === point.id ? '6px solid #d44' : '2px solid #ddd',
                                        background: selectedDroppingId === point.id ? '#fff' : 'transparent',
                                        transition: 'all 0.2s',
                                        flexShrink: 0,
                                        marginLeft: 'auto'
                                      }} />
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    No dropping points available
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div style={{ 
                            display: 'flex', 
                            gap: 12, 
                            justifyContent: 'flex-end',
                            marginTop: 24,
                            paddingTop: 24,
                            borderTop: '1px solid #e5e7eb',
                            flexShrink: 0
                          }}>
                            <button 
                              onClick={() => this.setState({ activeTab: 1 })} 
                              style={{ 
                                background: 'transparent', 
                                color: '#666', 
                                border: '1px solid #ddd', 
                                borderRadius: 8, 
                                padding: '12px 24px', 
                                fontWeight: 600, 
                                fontSize: 16, 
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#f5f5f5';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              Back
                            </button>
                            <button 
                              type="button" 
                              disabled={!selectedBoardingId || !selectedDroppingId} 
                              onClick={() => {
                                // Prepare busdata and then switch to tab 3
                                const { selectedSeatsData } = this.state;
                                let totalBase = 0;
                                
                                if (selectedSeatsData && selectedSeatsData.length > 0) {
                                  selectedSeatsData.forEach(seat => {
                                    totalBase += (seat.fare?.base || 0);
                                  });
                                } else {
                                  totalBase = this.state.busdata.fares[0].base * this.state.selectedSeats.length;
                                }
                                
                                const busdata = {
                                  busid: this.state.selectedBusId,
                                  busname: this.state.busdata.name,
                                  bustype: this.state.busdata.type,
                                  date: this.state.date,
                                  DpId: this.state.selectedDroppingId,
                                  BpId: this.state.selectedBoardingId,
                                  BpName: this.state.busdata.boarding.find(bp => bp.id === this.state.selectedBoardingId).name,
                                  DpName: this.state.busdata.dropping.find(dp => dp.id === this.state.selectedDroppingId).name,
                                  Seats: this.state.selectedSeats,
                                  SeatsData: selectedSeatsData,
                                  Dptime: this.state.busdata.timeD,
                                  Bptime: this.state.busdata.timeA,
                                  traceid: this.state.traceId,
                                  tripkey: this.state.tripKey,
                                  from: this.state.from,
                                  to: this.state.to,
                                  src: this.state.fromCityName,
                                  dst: this.state.toCityName,
                                  fare: totalBase,
                                  totalfare: totalBase,
                                };
                                localStorage.setItem("busdata", JSON.stringify(busdata));
                                this.setState({ 
                                  preparedBusdata: busdata,
                                  activeTab: 3 
                                });
                              }}
                              style={{ 
                                background: (!selectedBoardingId || !selectedDroppingId) ? '#ccc' : '#d44', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: 8, 
                                padding: '12px 32px', 
                                fontWeight: 700, 
                                fontSize: 16, 
                                cursor: (!selectedBoardingId || !selectedDroppingId) ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: (!selectedBoardingId || !selectedDroppingId) ? 'none' : '0 2px 8px rgba(212, 68, 68, 0.3)'
                              }}
                              onMouseOver={(e) => {
                                if (selectedBoardingId && selectedDroppingId) {
                                  e.currentTarget.style.background = '#b91c1c';
                                }
                              }}
                              onMouseOut={(e) => {
                                if (selectedBoardingId && selectedDroppingId) {
                                  e.currentTarget.style.background = '#d44';
                                }
                              }}
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Tab 3: Passenger Info */}
                      {this.state.activeTab === 3 && this.state.preparedBusdata && (
                        <div style={{ 
                          padding: 0, 
                          background: '#f5f5fa',
                          borderRadius: 16,
                          maxWidth: '100%',
                          width: '100%',
                          height: isMobile ? 'auto' : 'calc(100vh - 200px)',
                          overflowY: 'auto',
                          overflowX: 'hidden'
                        }}>
                          <PassengerDetails 
                            busdata={this.state.preparedBusdata}
                            history={this.props.history}
                            onBack={() => this.setState({ activeTab: 2 })}
                            isModal={true}
                          />
                        </div>
                      )}
                    </div>
                  {!isMobile && selectedSeats.length > 0 && this.state.activeTab === 1 && (
                            <div style={{ 
                              position: 'fixed', 
                              bottom: 0, 
                              left: 0, 
                              right: 0, 
                              background: '#fff', 
                              padding: '16px 24px', 
                              boxShadow: '0 -2px 12px rgba(0,0,0,0.15)', 
                              borderTop: '2px solid #f0f0f0',
                              zIndex: 1001,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 16,
                              animation: 'slideUpFromBottom 0.3s ease-out'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '1 1 auto', minWidth: 0, maxWidth: 'calc(100% - 400px)' }}>
                                <div style={{ fontWeight: 700, fontSize: 18, color: '#333', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                  {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#333', flexShrink: 0 }}>
                                  <span style={{ fontWeight: 700, fontSize: 20, whiteSpace: 'nowrap' }}>
                                    ₹{(() => {
                                      const { selectedSeatsData } = this.state;
                                      // Calculate total by summing individual seat BASE prices (jo seat par dikh rahi hai)
                                      if (selectedSeatsData && selectedSeatsData.length > 0) {
                                        return selectedSeatsData.reduce((total, seat) => {
                                          return total + (seat.fare?.base || 0);
                                        }, 0);
                                      }
                                      // Fallback to bus fare if seat data not available
                                      if (!busdata?.fares?.[0]?.base) return selectedSeats.length * 650;
                                      return busdata.fares[0].base * selectedSeats.length;
                                    })()}
                                  </span>
                                  <span style={{ fontSize: 14, color: '#666', whiteSpace: 'nowrap' }}>+</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                                <button 
                                  onClick={() => this.setState({ selectedSeats: [], selectedSeatsData: [], activeTab: 1 })} 
                                  style={{ 
                                    background: 'transparent', 
                                    color: '#666', 
                                    border: '1px solid #ddd', 
                                    borderRadius: 8, 
                                    padding: '12px 20px', 
                                    fontWeight: 600, 
                                    fontSize: 16, 
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0
                                  }}
                                >
                                  Clear
                                </button>
                                <button 
                                  onClick={this.handleProceed} 
                                  style={{ 
                                    background: '#d44', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: 8, 
                                    padding: '12px 32px', 
                                    fontWeight: 700, 
                                    fontSize: 16, 
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(212, 68, 68, 0.3)',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0
                                  }}
                                >
                                  Select boarding & dropping points
                                </button>
                              </div>
                            </div>
                          )}
                          {/* Mobile Bottom Bar - Shows when seats are selected */}
                          {isMobile && selectedSeats.length > 0 && this.state.activeTab === 1 && (
                            <div style={{ 
                              position: 'fixed', 
                              bottom: 0, 
                              left: 0, 
                              right: 0, 
                              background: '#fff', 
                              padding: '12px 16px', 
                              boxShadow: '0 -2px 12px rgba(0,0,0,0.15)', 
                              borderTop: '2px solid #f0f0f0',
                              zIndex: 1003,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              animation: 'slideUpFromBottom 0.3s ease-out'
                            }}>
                              <button 
                                onClick={this.handleProceed} 
                                style={{ 
                                  background: '#d44', 
                                  color: '#fff', 
                                  border: 'none', 
                                  borderRadius: 8, 
                                  padding: '12px 24px', 
                                  fontWeight: 700, 
                                  fontSize: 16, 
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 8px rgba(212, 68, 68, 0.3)',
                                  whiteSpace: 'nowrap',
                                  width: '100%',
                                  maxWidth: '100%'
                                }}
                              >
                                Select boarding & dropping points
                              </button>
                            </div>
                          )}
                    </div>
                  )}
                </React.Fragment>
              );
            })
            )}
          </div>
        </div>

        {/* Modal removed - now using tab system instead */}
      </div>
    );
  }
}

export default BusesList;
