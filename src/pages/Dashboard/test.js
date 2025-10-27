import React, { Component } from "react";
import "./test.css";
import AsyncSelect from "react-select/async";
import { API_WEB_URLS } from "constants/constAPI";
import {
  Container,
  Row,
  Col,

  Card,
  CardBody,

  Button,
  UncontrolledTooltip,
  Modal,
  ModalBody,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody
} from "reactstrap";
import Loader from "pages/loader";
import SeatLayout from "./SeatUI";
import SweetAlert from "react-bootstrap-sweetalert"
import { Fn_ChangeStateValue } from "store/functions";


const getformatteddate = (isoDate) => {
  const dateObj = new Date(isoDate);

  const day = String(dateObj.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return (
    <>
      <strong>{`${day}/${month}/${year}`}</strong>
      <span className="ms-2 fw-bold">{`${hours}:${minutes}`}</span>
    </>
  );
};


class Test extends Component {
   constructor(props) {
      super(props);
      this.state = {
        id: 0,
        formData: {},
        isMDistributor : false,
        isSDistributor : false,
        isDistributor : false,
        isRetailer : false,
        switch9 : false,
        success_msg:false,
        confirm_alert: false,
        balance : [{
          AvailableBalance : 0
        }],
        CalType : true,
        page: 1,
        sizePerPage: 10,
        productData: [],
        isTDS : false,
        modal_backdrop : false,
        F_PlanMaster : -1,
        F_UserType :  -1,
        F_ServiceMaster  : -1,
        seatData : null,
        isShowSeats : false,
        selectedBusId: null,
        selectedSeats: [] ,
        isRight : false,
        isloading : false,
        selectedSeats: [],
        Name : '',
        Phone : ''
  
      };
this.baseFare = 735;
       this.seats = [
      { id: 1, label: "1" },
      { id: 2, label: "2" },0/
      { id: 3, label: "3" },
      { id: 4, label: "4" },
      { id: 5, label: "5" },
      { id: 6, label: "6" },
      { id: 7, label: "7" },
      { id: 8, label: "8" },
      { id: "S", label: "S", price: 1260, booked: true },
    ];
      this.obj = this;
      this.formTitle = "Ticket";
      this.breadCrumbTitle = "Ticket";
      this.breadCrumbItem = "Book " + this.formTitle;
      this.API_URL_SAVE = API_WEB_URLS.PLANMASTERL + "/0/token";
      this.pushFormName = "/add-Balancedetails";
      this.rtPage_Redirect = "/add-Balancedetails";
  
      //Event Binding
     
      this.handleChange  =  this.handleChange.bind(this);
      this.loadOptions  = this.loadOptions.bind(this);
      this.handleChangeTo  =  this.handleChangeTo.bind(this);  
      this.searchbus  =  this.searchbus.bind(this);  
      this.handleChangeDate  =  this.handleChangeDate.bind(this);
      this.handleRowClick  =  this.handleRowClick.bind(this);
      this.getseats  =  this.getseats.bind(this);
      this.handleSelect  =  this.handleSelect.bind(this);
      this.blockseats  = this.blockseats.bind(this);
      this.bookticket  = this.bookticket.bind(this);
    this.tog_backdrop =  this.tog_backdrop.bind(this);
    this.syno  =  this.syno.bind(this);
    this.transus  = this.transus.bind(this);
    this.loadOptionsD   =  this.loadOptionsD.bind(this);
    this.loadOptionsb   =  this.loadOptionsb.bind(this);
    this.handleChangeB  =  this.handleChangeB.bind(this);
    this.handleChangeD  =  this.handleChangeD.bind(this);
  }


  loadOptions = async (inputValue) => {
   console.log(inputValue);
    if (!inputValue && inputValue.length<3) return [];

    // Example API call
    const response = await fetch(API_WEB_URLS.BASE+`CitySearch/0/${inputValue}`);
    const data = await response.json();
    const parsedData = JSON.parse(data.data);

// Check if cities exist and map them
if (parsedData.cities && Array.isArray(parsedData.cities)) {
  return parsedData.cities.map(city => ({
    label: city.name ,
    value: city.code
  }));
} else {
  return []; // return empty if no cities found
}
  };


  
  loadOptionsD = async (inputValue) => {
   
    if (!inputValue && inputValue.length<3) return [];

   

// Check if cities exist and map them
if (this.state.busdata.dropping && Array.isArray(this.state.busdata.dropping)) {
  return this.state.busdata.dropping.map(city => ({
    label: city.name ,
    value: city.id
  }));
} else {
  return []; // return empty if no cities found
}
  };
0

  loadOptionsb = async (inputValue) => {
   
    if (!inputValue && inputValue.length<3) return [];

   

// Check if cities exist and map them
if (this.state.busdata.boarding && Array.isArray(this.state.busdata.boarding)) {
  return this.state.busdata.boarding.map(city => ({
    label: city.name ,
    value: city.id
  }));
} else {
  return []; // return empty if no cities found
}
  };


  searchbus = async()=>{
    this.setState({isloading : true});
      var From =  this.state.From.value;
      var To  =  this.state.To.value;
  
      
      const formData = new FormData();
  formData.append('src', From);
  formData.append('dst', To);  
  formData.append('doj', this.state.doj || this.getToday()); // if you're uploading a file
  fetch(API_WEB_URLS.BASE  + 'SearchBus/0/token', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    const parsed = JSON.parse(data.data);
  
    this.setState({searchedbuses : parsed.trips, traceId : parsed.traceId, isloading : false, maindata : parsed})

    console.log('Success:', parsed.trips[0]);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
  
    }

    
  removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  tog_backdrop() {
    this.setState(prevState => ({
      modal_backdrop: !prevState.modal_backdrop,
    }))
    this.removeBodyCss()
  }


   handleChangeTo = (selectedOption) => {
    this.setState({To : selectedOption});
  };


  toggleSeat = (id) => {
    const { selectedSeats } = this.state;
    const seat = this.seats.find((s) => s.id === id);
    if (seat?.booked) return;

    const updatedSeats = selectedSeats.includes(id)
      ? selectedSeats.filter((s) => s !== id)
      : [...selectedSeats, id];

    this.setState({ selectedSeats: updatedSeats });
  };

  handleChange = (selectedOption) => {
    this.setState({From : selectedOption});
  };


    handleChangeD = (selectedOption) => {
    this.setState({ dpid : selectedOption.value ,dpids : selectedOption.id, dpname : selectedOption.label});
  };

    handleChangeB = (selectedOption) => {
      console.log(selectedOption);
    this.setState({ bpid : selectedOption.value ,bpids : selectedOption.id,   bpname : selectedOption.label});
  };

  getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  handleChangeDate = (event) => {
    this.setState({ doj: event.target.value });
  };

  getseats = async(busId,bpid,dpid, busName,busType, bpname, dpname) => {
    this.setState({isloading : true});
      const formData = new FormData();
      formData.append('traceId', this.state.traceId);
      formData.append('busId', busId); 
      formData.append('bpid', bpid);
      formData.append('dpid', dpid); 
      formData.append('seattype', "Vertical"); 
      fetch(API_WEB_URLS.BASE  + 'SearchBusBlocks/0/token', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        const parsed = JSON.parse(data.data);
      console.log(parsed.seats);
        this.setState({seatslist : parsed , seatData : parsed.seats, selectedBusId: busId,tripKey: parsed.tripKey, traceId : parsed.traceId , bpid : bpid, dpid : dpid, src : parsed.summary.src, dst : parsed.summary.dst, doj : parsed.summary.doj, busName : busName, busType : busType, bpname: bpname , dpname : dpname, isloading : false});
        
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }

    handleSelect = (seatId) => {
      this.setState((prevState) => {
        const { selectedSeats, seatData } = prevState;
        const maxSeats = 6;
    
        let updatedSeats;
        if (selectedSeats.includes(seatId)) {
          updatedSeats = selectedSeats.filter(id => id !== seatId);
        } else if (selectedSeats.length < maxSeats) {
          updatedSeats = [...selectedSeats, seatId];
        } else {
          updatedSeats = selectedSeats; // no change
        }
    
        const selectedSeatObjects = seatData.filter(seat => updatedSeats.includes(seat.id));
        const totalAmount = selectedSeatObjects.reduce((sum, seat) => sum + seat.fare.total, 0);
    
        return {
          selectedSeats: updatedSeats,
          TotalAmount: totalAmount,
        };
      });
    };
  


  handleRowClick = (bus, index) => {
 
  this.setState({ selectedRow: index, busdata : bus });
  
  this.getseats( bus.id, 
bus.boarding[0].id, bus.dropping[0].id,bus.name,
bus.type, bus.boarding[0].name ,
bus.dropping[0].name);

  //  if (bus?.boarding) {
  //     const transformed = bus.boarding.map(b => ({
  //       label: b.name,
  //       value: b.id
  //     }));

  //     this.setState({ boardings: transformed });
  //   }


  //   if (bus?.dropping) {
  //     const transformed = bus.dropping.map(b => ({
  //       label: b.name,
  //       value: b.id
  //     }));

  //     this.setState({ droppings: transformed });
  //   }

  // optional: to highlight the selected row
};


bookticket  =async() =>{

  const obj = JSON.parse(sessionStorage.getItem("authUser"));
    this.tog_backdrop();
    this.setState({isloading : true});

    var refno  =  this.state.BlockedData.trips[0].refNo;

    const formData = new FormData();
    formData.append('refNo', refno);
    formData.append('SRC', this.state.src);
    formData.append('DST', this.state.dst);
    formData.append('DOJ', this.state.doj);
    formData.append('PassengerName', this.state.Name);
    formData.append('Gender', "M");
    formData.append('Age', 25);
    formData.append('MobileNo', this.state.Phone);
    formData.append('EmailId', 'beinglksingh@gmail.com');
    formData.append('BusName', this.state.busName);
    formData.append('DropPointName', this.state.dpname);
    formData.append('PickPointName', this.state.bpname);
    formData.append('BusType', this.state.busType);
    formData.append('F_UserMaster', obj.uid);
    formData.append('Amount', this.state.TotalAmount);
    formData.append('GST', 0);
    formData.append('GrossAmount', this.state.TotalAmount);
     formData.append('seatId', this.state.selectedSeats); 


    fetch(API_WEB_URLS.BASE+ 'BookTicket/0/token', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      const parsed = JSON.parse(data.data);
      this.setState({success_msg : true, isloading : false , isRight : false, PNR : parsed.trips[0].pnrNo });
    })
    .catch(error => {
      console.error('Error:', error);
    });

  }

  
  blockseats =  async()=>{

    if (this.state.Name.length>=3 || this.state.Phone.length == 10){
    this.setState({isloading : true})
        const formData = new FormData();
        formData.append('tripKey', this.state.tripKey);
        formData.append('traceId', this.state.traceId); 
        formData.append('email', 'beinglksingh@gmail.com');
        formData.append('bpid', this.state.bpid); 
        formData.append('dpid', this.state.dpid); 
        formData.append('phone', this.state.Phone); 
        formData.append('name', this.state.Name); 
        formData.append('gender', "M"); 
        formData.append('age', 25); 
        formData.append('seatId', this.state.selectedSeats); 
    
        fetch(API_WEB_URLS.BASE+ 'SearchBusSelect/0/token', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          const parsed = JSON.parse(data.data);
        
          this.setState({BlockedData : parsed, isloading : false });
          this.tog_backdrop();
          
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }

      else {
        alert('Mobile No. and Name is required!')
      }
    
      }

      

  
  syno () {
    this.setState({success_msg : false ,update_msg : false})
    Fn_FillListData(this.obj, "productData", API_WEB_URLS.MASTER + "/0/token/PlanMasterL/Id/0");
    this.setState({formData:{
      F_PlanMaster : -1,
      F_ServiceMaster : -1,
      F_UserType : -1,
      From : '',
      To : '',
      CalType : false,
      switch9 : false,
      Amount : ''

    }})


  //  this.props.history.push(`${this.rtPage_Redirect}`, {});
  }


  
  transus() {
    this.setState({
      pay_modal: false,
      success_msg: false,
      Amount: 0,
      confirm_alert: false,
    });

    const newTabUrl = "ticketprint/" + this.state.PNR;
    window.open(newTabUrl, "_blank");
    //this.props.history.push('printreceipt/'+this.state.DMRId)
  }


  render() {
    const { selectedSeats } = this.state;
    // const total = selectedSeats.length * this.baseFare;

     const total = this.state.TotalAmount;

    return (
      <div className="page-content">
        {this.state.isloading ? <Loader/> : null}
        <div className="main-layout">
          {/* Left: Seat Map and Commission Section */}
          <div className="left-panel">
            {/* <div className="bus-info">
              <div>Bus Number: N/A</div>
              <div>Contact Number: N/A</div>
              <div className="verified">
                Verified <span className="verified-icon">✔️</span>
              </div>
            </div> */}
            {/* <div className="seat-map-grid">
              <div className="seat-row">
                <div className="seat-label">UP</div>
                <div className="seat-label">DN</div>
                <div className="seat-label">DN</div>
                <div className="seat-label">DN</div>
                <div className="seat-label">DN</div>
                <div className="seat-label">DN</div>
                <div className="seat-label">UP</div>
              </div>
              <div className="seat-row">
                <div className="seat-block">A</div>
                <div className="seat-block">L1</div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
              </div>
              <div className="seat-row">
                <div className="seat-block">1<br /><span className="seat-sub">735</span></div>
                <div className="seat-block">2<br /><span className="seat-sub">735</span></div>
                <div className="seat-block">3<br /><span className="seat-sub">735</span></div>
                <div className="seat-block">4</div>
                <div className="seat-block">5</div>
                <div className="seat-block">6</div>
                <div className="seat-block">B</div>
              </div>
              <div className="seat-row">
                <div className="seat-block">D</div>
                <div className="seat-block">L2</div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
              </div>
              <div className="seat-row">
                <div className="seat-block">7<br /><span className="seat-sub">735</span></div>
                <div className="seat-block">8<br /><span className="seat-sub">735</span></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block">C</div>
              </div>
              <div className="seat-row">
                <div className="seat-block">P</div>
                <div className="seat-block">L6</div>
                <div className="seat-block special-seat">S<br /><span className="seat-sub">1260</span></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
              </div>
              <div className="seat-row">
                <div className="seat-block">P</div>
                <div className="seat-block">L6</div>
                <div className="seat-block special-seat">S<br /><span className="seat-sub">1260</span></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
              </div>
              <div className="seat-row">
                <div className="seat-block">P</div>
                <div className="seat-block">L6</div>
                <div className="seat-block special-seat">S<br /><span className="seat-sub">1260</span></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
              </div>
              <div className="seat-row">
                <div className="seat-block">P</div>
                <div className="seat-block">L6</div>
                <div className="seat-block special-seat">S<br /><span className="seat-sub">1260</span></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
                <div className="seat-block"></div>
              </div>
            </div> */}
              {this.state.seatData == null ? null : <SeatLayout selectedSeats={this.state.selectedSeats} handleSelect={this.handleSelect} seats={this.state.seatData}/> }  

            
            
            {/* <div className="commission-section">
              <div>Commission on seat fare: ₹0</div>
              <div>Commission on reliability: ₹0</div>
              <div>Service charge: ₹0</div>
              <div className="total-commission"><strong>Total commission + service charge: ₹0</strong></div>
            </div> */}
          </div>

          {/* Right: Search, Bus List, Fare Summary */}
          <div className="right-panel">
            <div className="search-container" >
                <div >
              <label style={{width:'205px'}}>
                From
                {/* <select className="dropdowntest">
                  <option>Jodhpur</option>
                </select> */}
                <AsyncSelect
          cacheOptions
          loadOptions={(e)=>this.loadOptions(e)}
          defaultOptions
          onChange={(e)=>this.handleChange(e)}
          value={this.state.selectedOption}
          placeholder="Search and select..."
        />
              </label>
              </div>
              <span style={{marginTop:'13px'}} className="exchange-icon">⇄</span>
              <label style={{width:'205px'}}>
                To
                {/* <select className="dropdowntest">
                  <option>Jaipur</option>
                </select> */}
                <AsyncSelect
                                                          cacheOptions
                                                          loadOptions={this.loadOptions}
                                                          defaultOptions
                                                          onChange={this.handleChangeTo}
                                                          value={this.state.selectedOption}
                                                          placeholder="Search and select..."
                                                        />
              </label>
              <label>
                Date
                <div className="date-picker">
                  <input type="date" value={this.state.doj ? this.state.doj : this.getToday() } onChange={this.handleChangeDate} style={{width:'140px', height:'32px'}} />
                  {/* <span className="calendar-icon">📅</span> */}
                </div>
              </label>
              <button style={{marginTop:'13px', backgroundColor:'red'}} type="button" onClick={this.searchbus} className="search-button">Search</button>
            </div>
           <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
  <table className="bus-table">
    <thead>
      <tr>
        <th>Operator</th>
        <th>Departure</th>
        <th>Arrival</th>
        <th>Bus Type</th>
        <th>Seats</th>
        <th>Price</th>
        <th>Commission</th>
      </tr>
    </thead>
    <tbody>
      {this.state.searchedbuses !== undefined &&
        this.state.searchedbuses[0].buses.map((bus, index) => (
          <tr
  key={index}
  onClick={() => this.handleRowClick(bus, index)}
  
  
>
            <td style={{
    background: this.state.selectedRow === index ? '#1ee3c9' : 'white'
  }}>{bus.name}</td>
            <td style={{
    background: this.state.selectedRow === index ? '#1ee3c9' : 'white'
  }}>{bus.timeD.split('T')[1].substring(0, 5)}</td>
            <td style={{
    background: this.state.selectedRow === index ? '#1ee3c9' : 'white'
  }}>{bus.timeA.split('T')[1].substring(0, 5)}</td>
            <td style={{
    background: this.state.selectedRow === index ? '#1ee3c9' : 'white'
  }}>{bus.type}</td>
            <td style={{
    background: this.state.selectedRow === index ? '#1ee3c9' : 'white'
  }}>{bus.seats.avlAll}</td>
            <td style={{
    background: this.state.selectedRow === index ? '#1ee3c9' : 'white'
  }}>₹{bus.fares[0].total}</td>
            <td style={{
    background: this.state.selectedRow === index ? '#1ee3c9' : 'white'
  }}>7% ₹({bus.fares[0].commission.toFixed(2)})</td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

            <div className="fare-summary">
                <Row>
                    <Col>
                    <p>Pickup: 
                    <AsyncSelect
          cacheOptions
          loadOptions={(e)=>this.loadOptionsb(e)}
          defaultOptions
          onChange={(e)=>this.handleChangeB(e)}
          value={this.state.bpids}
          placeholder="Search and select..."
        />
                    </p>
                     {/* <p>Pickup: 01:10 - Mahadev travels railway station</p> */}
                    </Col>
                    <Col>
                    <p>Dropoff: <AsyncSelect
          cacheOptions
          loadOptions={(e)=>this.loadOptionsD(e)}
          defaultOptions
          onChange={(e)=>this.handleChangeD(e)}
          value={this.state.dpids}
          placeholder="Search and select..."
        /></p>
                    </Col>
                    
                    </Row>      
                          
              
              <input type="text"              value={this.state.Phone || ""}                           onChange={e => Fn_ChangeStateValue(this.obj, "Phone", e.target.value)} placeholder="Mobile Number" />
              <input type="text" 
                                        onChange={e => Fn_ChangeStateValue(this.obj, "Name", e.target.value)} placeholder="Passenger Name" />
              <div className="details">
                <Row>
                        <Col>
                          <p>Base fare: ₹{Number(this.state.TotalAmount)/Number(selectedSeats.length)} × {selectedSeats.length} </p>
                        </Col>
                        <Col>
                          <p>GST: ₹{Number(this.state.TotalAmount)/100*5}</p>
                        </Col>
                         <Col>
                          <p>Comm: ₹{Number(this.state.TotalAmount)/100*7}</p>
                        </Col>
                        <Col>
                        <p>Service Charge: ₹0</p>
                        </Col>
                        <Col>
                         <p><strong>Total: ₹{total}</strong></p>
                         </Col>

                        </Row> 
              
              
                
               
              </div>
              <button className="pay-btn" style={{backgroundColor : 'red'}} onClick={this.blockseats}>Pay ₹{total}</button>
            </div>

            <Modal
  isOpen={this.state.modal_backdrop}
  toggle={this.tog_backdrop}
  scrollable={true}
  backdrop="static"
  className="modal-dialog-centered"
>
  <div className="modal-content p-4 rounded-4 shadow-sm border-0">
    <div className="mb-3">
      <h5 className="fw-bold text-danger">{this.state.busName}</h5>
      <small className="text-muted">{this.state.busType}</small>
    </div>

    <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
      <div>
        <div className="d-flex align-items-center mb-1">
          <i className="bi bi-calendar-event me-2 text-danger"></i>
          <span className="text-muted">Departure</span>
        </div>
        <div>
          {getformatteddate(this.state.doj)}
          {/* <strong>15/May/2025</strong> <span className="ms-2 fw-bold">17:20</span> */}
        </div>
      </div>
      <div className="text-end">
        <span className="text-muted">Seats</span>
        <div className="fw-bold fs-5">{this.state.selectedSeats}</div>
      </div>
    </div>

    <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
      <div>
        <div className="d-flex align-items-center mb-1">
          <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
          <span className="text-muted">Boarding Point</span>
        </div>
        <div><strong>{this.state.src}</strong><br />
        {/* <small>Kashmere Gate ISBT</small> */}
        </div>
      </div>
      <div className="text-end">
        <span className="text-muted">Dropping Point</span>
        <div><strong>{this.state.dst}</strong><br />
        {/* <small>Sec 43</small> */}
        </div>
      </div>
    </div>

    <div className="mb-3">
      <div className="d-flex align-items-center mb-1">
        <i className="bi bi-person-circle me-2 text-danger"></i>
        <span className="fw-bold">{this.state.Name}</span>&nbsp; <small className="text-muted">({this.state.Age},{this.state.Gender})</small>
      </div>
    </div>

    <div className="bg-light p-3 rounded-3">
      <div className="d-flex align-items-center mb-2">
        <i className="bi bi-envelope-fill me-2 text-danger"></i>
        <span className="text-muted">Your ticket will be sent to</span>
      </div>
      <div className="fw-bold">{this.state.EmailID}</div>
      <div className="fw-bold">+91 {this.state.Phone}</div>
    </div>

    <div className="mt-4 d-flex justify-content-end gap-2">
      <button className="btn btn-light" onClick={() => this.setState({ modal_backdrop: false })}>Cancel</button>
      <button className="btn btn-danger" type="button" onClick={()=>this.bookticket()}>Confirm Booking</button>
    </div>
  </div>
</Modal>

            {this.state.success_msg ? (
                                <SweetAlert
                                  title={"Ticket Booked!"}
                                  success
                                  showCancel
                                  confirmBtnBsStyle="success"
                                  cancelBtnText="Print!"
                                  onConfirm={this.syno}
                                  onCancel={this.transus}
                                >
                                  PNR -{" "} {this.state.PNR}
                                  
                               
                                </SweetAlert>
                              ) : null}

                     {this.state.confirm_alert ? (
                                                                <SweetAlert
                                                                    title="Are you sure?"
                                                                    warning
                                                                    showCancel
                                                                    confirmButtonText="Yes, delete it!"
                                                                    confirmBtnBsStyle="success"
                                                                    cancelBtnBsStyle="danger"
                                                                    // onConfirm={() =>this.props.btnDelete_onClick(this.props.selectedFormData)}
                                                                    // onCancel={() =>this.props.toggleDeleteConfirm(this.props.obj,formData,false)}
                                                                >
                                                                    
                                                                </SweetAlert>
                                                                ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Test;
