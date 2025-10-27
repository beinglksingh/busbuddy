import React, { Component } from "react";
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


import SweetAlert from "react-bootstrap-sweetalert"


// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

// availity-reactstrap-validation
import {
  AvForm,
  AvField
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withRouter, Link } from "react-router-dom";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import { Fn_DisplayData, Fn_AddEditData, Fn_FillListData, Fn_CheckIsActive, Fn_DeleteData, Fn_ChangeStateValue } from "../../store/functions";
import  Switch  from "react-switch";
import './datatables.scss'
import * as XLSX from 'xlsx';
import AsyncSelect from "react-select/async";
import BusCard from "./BusCard";
import SeatSelector from "./SeatUI";
import Loader from "pages/loader";

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

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


function getCustomDateTime() {
  const now = new Date();

  // Get date and time parts
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Get milliseconds and convert to microseconds
  const milliseconds = now.getMilliseconds();
  const microseconds = String(milliseconds * 1000).padStart(6, '0');

  // Timezone offset in +HH:MM format
  const offsetMinutes = now.getTimezoneOffset(); // in minutes
  const offsetSign = offsetMinutes <= 0 ? '+' : '-';
  const offsetHours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, '0');
  const offsetMins = String(Math.abs(offsetMinutes) % 60).padStart(2, '0');

  const timezone = `${offsetSign}${offsetHours}:${offsetMins}`;

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${microseconds}${timezone}`;
}




class pageAddEdit_BusBooking extends Component {
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
      seatData : [],
      isShowSeats : false,
      selectedBusId: null,
      selectedSeats: [] ,
      isRight : false,
      isloading : false

    };
    this.obj = this;
    this.formTitle = "Ticket";
    this.breadCrumbTitle = "Ticket";
    this.breadCrumbItem = "Book " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.PLANMASTERL + "/0/token";
    this.pushFormName = "/add-Balancedetails";
    this.rtPage_Redirect = "/add-Balancedetails";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/PlanMasterL";
    this.syno  = this.syno.bind(this);
    this.tog_backdrop =  this.tog_backdrop.bind(this);
    this.saveplanname  =  this.saveplanname.bind(this);
    this.filterarray  =  this.filterarray.bind(this);
    this.exportToExcel  =  this.exportToExcel.bind(this);
    this.handleChange  =  this.handleChange.bind(this);
    this.loadOptions  = this.loadOptions.bind(this);
    this.searchbus  =  this.searchbus.bind(this);
    this.getseats  = this.getseats.bind(this);
    this.handleSelect  = this.handleSelect.bind(this);
    this.handleBooking  =  this.handleBooking.bind(this);
    this.toggleRightCanvas  = this.toggleRightCanvas.bind(this);
    this.blockseats  =  this.blockseats.bind(this);
    this.bookticket  = this.bookticket.bind(this);
    this.transus  = this.transus.bind(this);
  }




  componentDidMount() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    //Fn_CheckIsActive(this.obj, obj.uid);
    //Filing Dropdown

    
    // Fn_FillListData(this.obj, "planmaster", API_WEB_URLS.MASTER + "/0/token/PlanMaster/Id/0");
    // Fn_FillListData(this.obj, "servicemaster", API_WEB_URLS.MASTER + "/0/token/ServiceMaster/Id/0");
    // Fn_FillListData(this.obj, "usertypemaster", API_WEB_URLS.MASTER + "/0/token/UserType/Id/0");

    // Fn_FillListData(this.obj, "MainData", API_WEB_URLS.MASTER + "/0/token/PlanMasterL/Id/0");
   
    

    const { id } = this.props.match.params;

    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = "Edit " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
  }
  
  exportToExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(this.state.MainData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Plans');
                XLSX.writeFile(workbook, 'Plans.xlsx');
    
  };


 

  filterarray () {


const filterValues = {
  F_PlanMaster: this.state.F_PlanMaster,
  F_ServiceMaster: this.state.F_ServiceMaster,
  F_UserType: this.state.F_UserType
};


  // Use the filter() method to create a new filtered array
  const filteredArray = this.state.MainData.filter(item => {
    const matches = (
      (filterValues.F_PlanMaster == -1 || item.F_PlanMaster == filterValues.F_PlanMaster) &&
      (filterValues.F_ServiceMaster == -1 || item.F_ServiceMaster == filterValues.F_ServiceMaster) &&
      (filterValues.F_UserType == -1 || item.F_UserType == filterValues.F_UserType)
    );

   

    return matches;
  });

  this.setState({productData : filteredArray});

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

  removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  tog_backdrop() {
    this.setState(prevState => ({
      modal_backdrop: !prevState.modal_backdrop,
    }))
    this.removeBodyCss()
  }

   handleDelete  (rowId)  {
    Fn_DeleteData(this.obj, rowId, this.API_URL, this.API_URL + "/Id/0");
  };


   handleChange = (selectedOption) => {
    this.setState({From : selectedOption});
  };


  handleChangeTo = (selectedOption) => {
    this.setState({To : selectedOption});
  };


   loadOptions = async (inputValue) => {
    
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



  toggleRightCanvas() {
    this.setState({
      isRight: !this.state.isRight
    });
  }


  btnSave_onClick(event, formData) {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    if (formData.F_PlanMaster > 0 && formData.F_ServiceMaster > 0 && formData.F_UserType > 0 && formData.From>0 && formData.To>0
      )

      {
   
    let vformData = new FormData();
   
      //Information
      vformData.append("F_PlanMaster", formData.F_PlanMaster);
      vformData.append("F_ServiceMaster", formData.F_ServiceMaster);
      vformData.append("F_UserType", formData.F_UserType);
      vformData.append("RangeFrom", formData.From );
      vformData.append("RangeTo", formData.To);
      vformData.append("IsTDS", this.state.isTDS ? true : false);
      vformData.append("IsFlat",this.state.CalType ? true : false );
      vformData.append("IsCharge", this.state.switch9 ? true : false);
      vformData.append("Amount", formData.Amount);
      vformData.append("UserId", obj.uid);
    

      if (!this.state.id)    {
        Fn_AddEditData(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, "#", true , "VoucherId");
      }

      else if (obj.isAdmin == true) {
        Fn_AddEditData(this.obj, { arguList: { id: this.state.id, formData: vformData } }, this.API_URL_SAVE, "#", true , "kuku" , "update_msg");
      }
}

else{
  alert('Fill all details!');
}

  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };

  saveplanname () {

  }

  handleBooking = async()=>{

    this.setState({
      isRight: !this.state.isRight
    })

  }

  searchbus = async()=>{
    var From =  this.state.From.value;
    var To  =  this.state.To.value;

    

    
    const formData = new FormData();
formData.append('src', From);
formData.append('dst', To);  
formData.append('doj', this.state.doj); // if you're uploading a file
fetch(API_WEB_URLS.BASE  + 'SearchBus/0/token', {
  method: 'POST',
  body: formData,
})
.then(response => response.json())
.then(data => {
  const parsed = JSON.parse(data.data);

  this.setState({searchedbuses : parsed.trips, traceId : parsed.traceId })
  console.log('Success:', parsed.trips[0]);
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


  


  getseats = async(traceId,busId,bpid,dpid, busName,busType, bpname, dpname) => {
    const formData = new FormData();
    formData.append('traceId', traceId);
    formData.append('busId', busId); 
    formData.append('bpid', bpid);
    formData.append('dpid', dpid); 
    fetch(API_WEB_URLS.BASE  + 'SearchBusBlocks/0/token', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      const parsed = JSON.parse(data.data);
    
      this.setState({seatslist : parsed , seatData : parsed.seats, selectedBusId: busId,tripKey: parsed.tripKey, traceId : parsed.traceId , bpid : bpid, dpid : dpid, src : parsed.summary.src, dst : parsed.summary.dst, doj : parsed.summary.doj, busName : busName, busType : busType, bpname: bpname , dpname : dpname});
      
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }


  blockseats =  async()=>{
this.setState({isloading : true})
    const formData = new FormData();
    formData.append('tripKey', this.state.tripKey);
    formData.append('traceId', this.state.traceId); 
    formData.append('email', this.state.EmailID);
    formData.append('bpid', this.state.bpid); 
    formData.append('dpid', this.state.dpid); 
    formData.append('phone', this.state.Phone); 
    formData.append('name', this.state.Name); 
    formData.append('gender', this.state.Gender == "Male" ? "M" : "F"); 
    formData.append('age', this.state.Age); 
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
    formData.append('Gender', this.state.Gender == "Male" ? "M" : "F");
    formData.append('Age', this.state.Age);
    formData.append('MobileNo', this.state.Phone);
    formData.append('EmailId', this.state.EmailID);
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

    const columns = [{
      dataField: 'Plan',
      text: 'Plan',
      sort: true,
    }, {
      dataField: 'Service',
      text: 'Service',
      sort: true
    }, {
      dataField: 'Range',
      text: 'Range',
      sort: true
    }, {
      dataField: 'Type',
      text: 'Type',
      sort: true
    }, {
      dataField: 'CalType',
      text: 'Cal Type',
      sort: true
    },
    
    {
      dataField: 'TDS',
      text: 'TDS',
      sort: true
    },
    {
      dataField: 'Amount',
      text: 'Value',
      sort: true
    },
    {
      dataField: 'UserType',
      text: 'User',
      sort: true
    },
    {
      dataField: "remove",
      text: "Delete",
      formatter: (cellContent, row) => {
        return (
          <button
          type="button"
            className="btn btn-danger btn-xs"
            onClick={() => this.handleDelete(row.id)}
          >
            Delete
          </button>
        );
      },
    },

    
  
  ];

    const defaultSorted = [{
      dataField: 'id',
      order: 'asc'
    }];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: this.state.productData.length, // replace later with size(customers),
      custom: true,
    }

    // Custom Pagination Toggle
    const sizePerPageList = [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
      { text: '15', value: 15 },
      { text: '20', value: 20 },
      { text: '25', value: 25 },
      { text: 'All', value: (this.state.productData).length }];

  
    // Select All Button operation
    const selectRow = {
      mode: 'checkbox'
    }

    const { SearchBar } = Search;

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    
const Offsymbolb = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      {" "}
      No
    </div>
  )
}


const OnSymbolb = props => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      {" "}
      Yes
    </div>
  )
}


   
const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      {" "}
      Per
    </div>
  )
}


const OnSymbol = props => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2
      }}
    >
      {" "}
      Flat
    </div>
  )
}





    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={this.breadCrumbTitle}
              breadcrumbItem={this.breadCrumbItem}
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    {/* <h4 className="card-title mb-4">Basic Wizard</h4> */}
                    <div className="wizard clearfix">
                     
                      <div className="content clearfix">
                        <AvForm className="needs-validation" onValidSubmit={this.btnSave_onClick}>
                         
                                <Row>
                                  <Col lg="12">

                                  <h2>Search Bus</h2>
                                  <Card>
                                    <CardBody> 
                                 
                                     

                                    <Row>
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">From</label>
                                        </Col>
                                        <Col sm="3">
                                      
                                        <AsyncSelect
          cacheOptions
          loadOptions={this.loadOptions}
          defaultOptions
          onChange={this.handleChange}
          value={this.state.selectedOption}
          placeholder="Search and select..."
        />
                                        </Col>
                                   
                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">To</label>
                                        </Col>
                                        <Col sm="3">
                                      
                                        <AsyncSelect
                                          cacheOptions
                                          loadOptions={this.loadOptions}
                                          defaultOptions
                                          onChange={this.handleChangeTo}
                                          value={this.state.selectedOption}
                                          placeholder="Search and select..."
                                        />
                                        </Col>


                                        <Col sm="1" className="mb-3">
                                          <label htmlFor="DateofBirth" className="col-form-label">DOJ</label>
                                        </Col>
                                        <Col sm="2">
                                        <AvField name="FromDate" label="" value={this.state.doj  ==  undefined ? getCurrentDate() : this.state.formData.doj} 
                                          onChange={e => Fn_ChangeStateValue(this.obj, "doj", e.target.value)}
                                        placeholder="DOJ" errorMessage="Select Date " validate={{ required: { value: true } }} type="date"  className="form-control" />
                                        </Col>

                                        <Col sm="1">
                                        
                                         <Button
                                          type="button"
                                          onClick={this.searchbus}
                                          color="primary"
                                          className="mr-1 waves-effect waves-light"
                                        >
                                          Search
                                        </Button>

                                        
                                        </Col>

                                      </Row> 
                           
                             
                                     
                                     
                                    
                                    </CardBody>
                                  </Card>
                                  </Col>
                                 
                                </Row>




                                <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
      {/* {this.state.searchedbuses!=undefined ? 

                  this.state.searchedbuses[0].buses.map((bus,index) => (
                   
           <BusCard  busId={bus.id} getseats={this.getseats} traceId={this.state.traceId}  bpid={bus.boarding[0].id} dpid={bus.dropping[0].id} name={bus.name} type={bus.type} timeD={bus.timeD} timeA={bus.timeA} duration={bus.duration} rate={bus.fares[0].total} key={index}/>
          )) : null}
        <SeatSelector seats={this.state.seatData} maxSeats={6} /> */}
        {this.state.searchedbuses !== undefined &&
  this.state.searchedbuses[0].buses.map((bus, index) => (
    <div key={index}>
      <BusCard
        busId={bus.id}
        getseats={this.getseats}
        traceId={this.state.traceId}
        bpid={bus.boarding[0].id}
        dpid={bus.dropping[0].id}
        bpname={bus.boarding[0].name}
        dpname={bus.dropping[0].name}
        name={bus.name}
        type={bus.type}
        timeD={bus.timeD}
        timeA={bus.timeA}
        duration={bus.duration}
        rate={bus.fares[0].total}
      />

      {this.state.selectedBusId === bus.id && (
        <SeatSelector handleBooking={this.handleBooking} selectedSeats={this.state.selectedSeats} handleSelect={this.handleSelect}  seats={this.state.seatData} maxSeats={15} />
      )}
    </div>
  ))}

                  </CardBody>
                </Card>
              </Col>
              </Row>

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



                      <Row>
                              <Col lg={6}>
                                <Card>
                                  <CardBody>
                                    <Offcanvas
                                      isOpen={this.state.isRight}
                                      direction="end"
                                      toggle={this.toggleRightCanvas}
                                    >
                            <OffcanvasHeader toggle={this.toggleRightCanvas}>
                                  Passenger Details
                                </OffcanvasHeader>

                                <OffcanvasBody>
                                  {/* Passenger Info */}
                                  <Row className="mb-3">
                                    <Col>
                                      <h5>
                                        Passenger {this.state.passengerNumber} |{" "}
                                        <span className="text-dark fw-bold">Seat {this.state.selectedSeat}</span>
                                      </h5>
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col sm="10" className="mb-3">
                                      <AvField
                                        name="Name"
                                        label="Name"
                                        value={this.state.Name || ""}
                                        onChange={e => Fn_ChangeStateValue(this.obj, "Name", e.target.value)}
                                        placeholder="Name"
                                        type="text"
                                        className="form-control"
                                      />
                                    </Col>
                                  </Row>

                                  <Row className="align-items-end">
                                    <Col sm="5" className="mb-3">
                                      <AvField
                                        name="Age"
                                        label="Age"
                                        value={this.state.Age || ""}
                                        onChange={e => Fn_ChangeStateValue(this.obj, "Age", e.target.value)}
                                        placeholder="Age"
                                        type="number"
                                        className="form-control"
                                      />
                                    </Col>

                                    <Col sm="5" className="mb-3">
                                      <label className="form-label d-block">Gender</label>
                                      <div className="form-check form-check-inline">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="Gender"
                                          id="male"
                                          value="Male"
                                          checked={this.state.Gender === "Male"}
                                          onChange={e => Fn_ChangeStateValue(this.obj, "Gender", e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="male">Male</label>
                                      </div>
                                      <div className="form-check form-check-inline">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="Gender"
                                          id="female"
                                          value="Female"
                                          checked={this.state.Gender === "Female"}
                                          onChange={e => Fn_ChangeStateValue(this.obj, "Gender", e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="female">Female</label>
                                      </div>
                                    </Col>
                                  </Row>

                                  <hr />

                                  {/* Contact Details */}
                                  <h5>
                                    <i className="mdi mdi-email-outline me-2 text-warning"></i> Contact Details
                                  </h5>
                                  <div className="alert alert-warning py-2 px-3 mb-3">
                                    Your ticket will be sent to these details
                                  </div>

                                  <Row>
                                    <Col sm="10" className="mb-3">
                                      <AvField
                                        name="EmailID"
                                        label="Email ID"
                                        value={this.state.EmailID || ""}
                                        onChange={e => Fn_ChangeStateValue(this.obj, "EmailID", e.target.value)}
                                        placeholder="Email ID"
                                        type="email"
                                        className="form-control"
                                      />
                                    </Col>
                                  </Row>

                                  <Row>
                                    {/* <Col sm="2">
                                      <label className="form-label">+91</label>
                                    </Col> */}
                                    <Col sm="8" className="mb-3">
                                      <AvField
                                        name="Phone"
                                        label="Phone"
                                        value={this.state.Phone || ""}
                                        onChange={e => Fn_ChangeStateValue(this.obj, "Phone", e.target.value)}
                                        placeholder="Phone"
                                        type="Number"
                                        className="form-control"
                                      />
                                    </Col>
                                  </Row>

                                  {/* <Row className="mb-3">
                                    <Col sm="10">
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id="gstOption"
                                          checked={this.state.HasGST || false}
                                          onChange={e => Fn_ChangeStateValue(this.obj, "HasGST", e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="gstOption">
                                          I have a GST number (optional)?
                                        </label>
                                      </div>
                                    </Col>
                                  </Row> */}

                                  <Row className="mb-3">
                                    <Col sm="10">
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id="whatsappUpdates"
                                          checked={this.state.WhatsappUpdates || true}
                                          onChange={e => Fn_ChangeStateValue(this.obj, "WhatsappUpdates", e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="whatsappUpdates">
                                          <i className="mdi mdi-whatsapp text-success me-1"></i>
                                          Send booking details and trip updates on WhatsApp
                                        </label>
                                      </div>
                                    </Col>
                                  </Row>

                                  {this.state.isloading ? 
                                <Loader/>
                                : null  
                                }

                                  <div className="text-end">
                                    <h5 className="text-dark fw-bold">
                                      Total Amount : <span className="ms-2">INR {this.state.TotalAmount}.00</span>
                                    </h5>
                                    <p className="text-muted" style={{ fontSize: "12px" }}>
                                      (*Exclusive of Taxes)
                                    </p>
                                    <Button color="danger" className="btn-rounded" onClick={this.blockseats}>
                                      PROCEED TO PAY
                                    </Button>
                                  </div>
                                </OffcanvasBody>
                                </Offcanvas>

                                

                                    <Modal
                                      isOpen={this.state.pay_modal}
                                      toggle={this.pay_modal}
                                      scrollable={true}
                                      backdrop={"static"}
                                      id="staticBackdrop2"
                                    >
                                      <div className="modal-header">
                                        <h5 className="modal-title">
                                          Verify Details
                                        </h5>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() =>
                                            this.setState({ pay_modal: false })
                                          }
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <div className="modal-body">
                                        <h5>
                                          Account Holder Name :{" "}
                                         
                                        </h5>
                                        <br></br>
                                        <h5>
                                          Account No :{" "}
                                          
                                        </h5>
                                        <br></br>
                                        <h5>
                                          IFSC : 
                                        </h5>
                                        <br></br>
                                        <h5>
                                          Bank Name :{" "}
                                         {" "}
                                        </h5>
                                        <br></br>
                                        <h5
                                          color={
                                           
                                               "red"
                                          }
                                          style={{
                                            color:  "green"
                                              
                                          }}
                                        >
                                          
                                        </h5>
                                        <AvField
                                          name="Amount"
                                          label=""
                                          value={
                                            this.state.Amount === null
                                              ? ""
                                              : this.state.Amount
                                          }
                                          onChange={e =>
                                            Fn_ChangeStateValue(
                                              this.obj,
                                              "Amount",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Enter Amount"
                                          type="number"
                                          className="form-control"
                                        />
                                      </div>
                                      <div className="modal-footer">
                                       
                                        <button
                                          type="button"
                                         
                                         
                                          className="btn btn-primary"
                                        >
                                          IMPS
                                        </button>
                                      </div>
                                    </Modal>
                                  </CardBody>
                                </Card>
                              </Col>
                            </Row>



                               
                            
                          <div className="d-flex flex-wrap gap-2">
                         

                        {/* {this.state.success_msg ? (
                      <SweetAlert
                        title={'Success'}
                        success
                       
                        confirmBtnBsStyle="success"
                      
                        onConfirm={this.syno}
                        
                      >
                        Ticket Booked
                      </SweetAlert>
                    ) : null} */}

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
                        </AvForm>
                      </div>
                      
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}
export default compose(container)(pageAddEdit_BusBooking);
