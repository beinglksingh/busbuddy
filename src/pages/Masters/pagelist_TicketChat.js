import React, { Component } from "react";

import moment from "moment";
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import {
  
  Button,
  Card,
  Col,
  Container,

  Row,
 
} from "reactstrap";


//Import Scrollbar
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";


//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { API_WEB_URLS } from "constants/constAPI";
import { Fn_FillListData, Fn_AddEditData } from "store/functions";
import { applyMiddleware } from "redux";


class pagelist_TicketChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoomId: 1,
     
      curMessage: "",
      test : [
       
      ],
      ticketdetails :[{
        Id : 0,
        UserName : '',
        Service : '',
        TransactionCode : '',
        F_Status : 0
      }]
    };
    this.messageBox = null;
    this.obj = this;
    this.addMessage =  this.addMessage.bind(this);
    this.refresh  =  this.refresh.bind(this);
    this.closeticket  = this.closeticket.bind(this);
  }

  componentDidMount() {



    
    const { id } = this.props.match.params;
    if (id) {
      this.setState({ id: id });
      Fn_FillListData(this.obj, "ticketdetails", API_WEB_URLS.MASTER + "/0/token/TicketDetail/Id/"+id);
      Fn_FillListData(this.obj, "test", API_WEB_URLS.MASTER + "/0/token/GetMessages/Id/"+id);

    } else {
      this.setState({ id: 0 });
    }
    
    
  }

//   // eslint-disable-next-line no-unused-vars
//   componentDidUpdate(prevProps, prevState, snapshot) {
//     const { messages } = this.props;
//     if (size(messages) !== size(prevProps.messages)) {
//       this.scrollToBottom();
//     }
//   }

  

//   //Use For Chat Box
//   userChatOpen = (id, name, status, roomId) => {
//     const { onGetMessages } = this.props;
//     this.setState({ Chat_Box_Username: name, currentRoomId: roomId });
//     onGetMessages(roomId);
//   };



refresh() {
  Fn_FillListData(this.obj, "test", API_WEB_URLS.MASTER + "/0/token/GetMessages/Id/"+this.state.id);
}

  addMessage ()  {


    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    //Information
    vformData.append("F_TicketMaster", this.state.ticketdetails[0].Id);
    vformData.append("SenderId", obj.uid);
    vformData.append("Message", this.state.curMessage );
    

      Fn_AddEditData(
        this.obj,
        { arguList: { id: 0, formData: vformData } },
        "InsertTicketMessage/0/token",
        "#",
        true,
        "chat",
        this.state.ticketdetails[0].Id
      );
    
    }


    closeticket () {


      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let vformData = new FormData();
      //Information
      vformData.append("F_TicketMaster", this.state.ticketdetails[0].Id);
      vformData.append("F_UserMaster", obj.uid);
  
        Fn_AddEditData(
          this.obj,
          { arguList: { id: 0, formData: vformData } },
          "CloseTicket/0/token",
          "/tickets",
          true,
          "",
          this.state.ticketdetails[0].Id
        );

    }
 


  scrollToBottom = () => {
    if (this.messageBox) {
      this.messageBox.scrollTop = this.messageBox.scrollHeight + 1000;
    }
  };

//   onKeyPress = e => {
//     const { key, value } = e;
//     const { currentRoomId, currentUser } = this.state;
//     if (key === "Enter") {
//       this.setState({ curMessage: value });
//       this.addMessage(currentRoomId, currentUser.name);
//     }
//   };

  //serach recent user
  
  render() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    return (
      <React.Fragment>
        <div className="page-content">
         
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs title="Skote" breadcrumbItem="Chat" />

            <Row>
              <Col lg="12">
                <div className="d-lg-flex">
                  <div className="chat-leftsidebar me-lg-4" style={{borderRight : '1px solid'}}>
                    <div className="">
                      <div className="py-4 border-bottom">
                        <div className="d-flex">
                          <div className="align-self-center me-3" style={{color:'black'}}>
                            Ticket No.  - #{this.state.ticketdetails[0].Id}
                          </div>
                       
                        </div>
                      </div>

                    

                   
                    </div>

                    <div className="">
                      <div className="py-4 border-bottom">
                        <div className="d-flex">
                          <div className="align-self-center me-3" style={{color:'black'}}>
                         SERVICE -  {this.state.ticketdetails[0].Service}
                          </div>
                       
                        </div>
                      </div>

                    

                   
                    </div>

                    <div className="">
                      <div className="py-4 border-bottom">
                        <div className="d-flex">
                          <div className="align-self-center me-3" style={{color:'black'}}>
                         TRANSACTION CODE -  {this.state.ticketdetails[0].TransactionCode}
                          </div>
                        </div>
                      </div>

                    

                   
                    </div>
                  </div>
                  <div className="w-100 user-chat">
                    <Card>
                      <div className="p-4 border-bottom ">
                        <Row>
                          <Col md="4" xs="9">
                            <h5 className="font-size-15 mb-1">
                              {this.state.ticketdetails[0].UserName}
                            </h5>

                            <p className="text-muted mb-0">
                              <i
                                className={
                                  // this.state.Chat_Box_User_Status === "online"
                                    //?
                                     "mdi mdi-circle text-success align-middle me-1"
                                    // : this.state.Chat_Box_User_Status ===
                                    //   "intermediate"
                                    //   ? "mdi mdi-circle text-warning align-middle me-1"
                                    //   : "mdi mdi-circle align-middle me-1"
                                }
                              />
                              online
                            </p>
                          </Col>
                          <Col md="8" xs="3">
                            <ul className="list-inline user-chat-nav text-end mb-0">
                            {this.state.ticketdetails[0].F_Status == 1 || this.state.ticketdetails[0].F_Status == 2 ?
                            <>
                              <li className="list-inline-item  d-none d-sm-inline-block">
                              <Button
                          type="button"
                          color="primary"
                          onClick={this.closeticket}
                          className="mr-1 waves-effect waves-light"
                        >
                          Close Issue
                        </Button>
                              </li>{" "}
                              <li className="list-inline-item  d-none d-sm-inline-block">
                              <Button
                          type="button"
                          color="primary"
                          onClick={this.refresh}
                          className="mr-1 waves-effect waves-light"
                        >
                          Refresh
                        </Button>
                              </li>{" "}
                              </>

                              : null}
                              
                            </ul>
                          </Col>
                        </Row>
                      </div>

                      <div>
                        <div className="chat-conversation p-3">
                          <ul className="list-unstyled mb-0">
                            <PerfectScrollbar
                              style={{ height: "486px", minHeight: "486px" }}
                              containerRef={ref => (this.messageBox = ref)}
                            >
                              <li>
                                <div className="chat-day-title">
                                  <span className="title">Today</span>
                                </div>
                              </li>
                              {this.state.test &&
                                this.state.test.map(message => (
                                  <li
                                    key={"test_k2" + message.id}
                                    className={
                                      message.sender == obj.uid
                                        ? "right"
                                        : ""
                                    }
                                  >
                                    <div className="conversation-list">
                                     
                                      <div className="ctext-wrap">
                                        {/* <div className="conversation-name">
                                          {message.sender}
                                        </div> */}
                                        <p>{message.message}</p>
                                        <p className="chat-time mb-0">
                                          <i className="bx bx-time-five align-middle me-1" />{" "}
                                          {moment(message.createdAt).format(
                                            "hh:mm"
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                            </PerfectScrollbar>
                          </ul>
                        </div>

                        {this.state.ticketdetails[0].F_Status == 1 || this.state.ticketdetails[0].F_Status == 2 ?
                        <div className="p-3 chat-input-section">
                          <Row>
                            <Col>
                              <div className="position-relative">
                                <input
                                  type="text"
                                  value={this.state.curMessage}
                                //  onKeyPress={this.onKeyPress}
                                  onChange={e => {
                                    this.setState({
                                      curMessage: e.target.value,
                                    });
                                  }}
                                  className="form-control chat-input"
                                  placeholder="Enter Message..."
                                />
                                {/* <div className="chat-input-links">
                                  <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                      <Link to="#">
                                        <i
                                          className="mdi mdi-emoticon-happy-outline"
                                          id="Emojitooltip"
                                        ></i>
                                        <UncontrolledTooltip
                                          placement="top"
                                          target="Emojitooltip"
                                        >
                                          Emojis
                                        </UncontrolledTooltip>
                                      </Link>
                                    </li>{" "}
                                    <li className="list-inline-item">
                                      <Link to="#">
                                        <i
                                          className="mdi mdi-file-image-outline"
                                          id="Imagetooltip"
                                        ></i>
                                        <UncontrolledTooltip
                                          placement="top"
                                          target="Imagetooltip"
                                        >
                                          Images
                                        </UncontrolledTooltip>
                                      </Link>
                                    </li>{" "}
                                    <li className="list-inline-item">
                                      <Link to="#">
                                        <i
                                          className="mdi mdi-file-document-outline"
                                          id="Filetooltip"
                                        ></i>
                                        <UncontrolledTooltip
                                          placement="top"
                                          target="Filetooltip"
                                        >
                                          Add Files
                                        </UncontrolledTooltip>
                                      </Link>
                                    </li>
                                  </ul>
                                </div> */}
                              </div>
                            </Col>
                            <Col className="col-auto">
                            
                              <Button
                                type="button"
                                color="primary"
                                onClick={this.addMessage}
                                className="btn-rounded chat-send w-md"
                              >
                                <span className="d-none d-sm-inline-block me-2">
                                  Send
                                </span>{" "}
                                <i className="mdi mdi-send"></i>
                              </Button>
                            </Col>
                          </Row>
                        </div>
                        : null}
                      </div>
                    </Card>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}



export default compose(container)(pagelist_TicketChat);
