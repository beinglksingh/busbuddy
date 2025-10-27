import React, { Component } from "react"
import MetaTags from 'react-meta-tags';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Input,
  Alert
} from "reactstrap"
import CardShop from "./CardShop"

import { API_WEB_URLS } from "../../constants/constAPI";
import SweetAlert from "react-bootstrap-sweetalert"

import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import {
  Fn_FillListData,
  Fn_CheckIsActive,
  Fn_CheckBalance
} from "../../store/functions";
import MonthlyEarning from "./MonthlyEarning";
import CardContact from "pages/cardcn";
import Pie from "pages/Masters/Pien";
import CardAdmin from "pages/cardadmin";
import Loader from "pages/loader";




function formatNumber(number) {
  if (!number) {
    return "0";
  }

  // Convert the input to a number if it's not already
  const numericValue = parseFloat(number);

  // Check if the numericValue is a valid number
  if (!isNaN(numericValue)) {
    // Format the number with commas for thousands and add the rupee sign
    return "₹" + numericValue.toLocaleString("en-IN");
  } else {
    // Handle the case where the input is not a valid number
    return "Invalid Number";
  }
}





class Dashboard extends Component {


  constructor(props) {
    super(props);
    this.state = {
      Company: [],
      kycmessage: false,
      kycpending: false,
      colors: 'white',
      // reports: [
      //   { title: "Orders", iconClass: "bx-copy-alt", description: "1,235" },
      //   {
      //     title: "Revenue",
      //     iconClass: "bx-archive-in",
      //     description: "Rs.35,723",
      //   },
      //   {
      //     title: "Average Price",
      //     iconClass: "bx-purchase-tag-alt",
      //     description: "Rs.16.2",
      //   },
      // ],
      // email: [
      //   { title: "Week", linkto: "#", isActive: false },
      //   { title: "Month", linkto: "#", isActive: false },
      //   { title: "Year", linkto: "#", isActive: true },
      // ],
      modal: false,
      subscribemodal: false,
      chartSeries: [],
      periodType: "yearly",
      dashboarledgers: [{}],
      dashboarddata: [{
        TotalDMR: 0,
        TotalDMRAmount: 0,
        TotaAEPS: 0,
        TotaAEPSAmount: 0,
        TotalIndoNepal: 0,
        TotalIndoNepalAmount: 0,
        TotalRecharge: 0,
        TotalRechargeAmount: 0,

        DMRPaidAmount: 0,
        DMRPaidCount: 0,
        DMRFailureAmount: 0,
        DMRFailureCount: 0,
        DMRPendingAmount: 0,
        DMRPendingCount: 0,
        AEPSPaidAmount: 0,
        AEPSPaidCount: 0,
        AEPSFailureAmount: 0,
        AEPSFailureCount: 0,
        AEPSPendingAmount: 0,
        AEPSPendingCount: 0,
        RechargePaidAmount: 0,
        RechargePaidCount: 0,
        RechargeFailureAmount: 0,
        RechargeFailureCount: 0,
        RechargePendingAmount: 0,
        RechargePendingCount: 0,
        IndoNepalPaidAmount: 0,
        IndoNepalPaidCount: 0,
        IndoNepalFailureAmount: 0,
        IndoNepalFailureCount: 0,
        IndoNepalPendingAmount: 0,
        IndoNepalPendingCount: 0
      }],
      latesttran: [],
      GlobalOptions: [{}],
      balances: {}
    };

    this.obj = this;
    this.rtPage_Edit = "profile";
    this.rtPage_logout = "logout";
    this.API_URL_COMPANY = API_WEB_URLS.MASTER + "/0/token/CompanyMaster";
    this.syno = this.syno.bind(this);

    this.logout = this.logout.bind(this);
    this.handrefresh = this.handrefresh.bind(this);


  }

  syno() {
    this.setState({ success_msg: false })
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    this.props.history.push(`${this.rtPage_Edit}/${obj.F_MemberMaster}`, {});
  }

  logout() {
    this.props.history.push(`${this.rtPage_logout}`, {});
  }




  handrefresh = (Id) => {
    this.setState({ isloading: true });

    // Assuming Fn_CheckBalance returns a Promise
    Fn_CheckBalance(this.obj, Id)
      .then((balance) => {
        // Get the balance from the state
        const currentBalance = this.state.Balance;

        // Update the state with the new balance for the specific item
        this.setState((prevState) => ({
          balances: {
            ...prevState.balances,
            [Id]: currentBalance,
          },
          isloading: false,
        }));

        // Optionally, you can set a timeout to reset the balance to 0 after a certain duration
        setTimeout(() => {
          this.setState((prevState) => ({
            balances: {
              ...prevState.balances,
              [Id]: 0,
            },
          }));
        }, 5000); // 5000 milliseconds = 5 seconds
      })
      .catch((error) => {
        console.error('Error fetching balance:', error);
        this.setState({ isloading: false });
      });
  };

  componentDidMount() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    this.setState({ name: obj.username, email: obj.email, aid: obj.uid, role: obj.role });
    //Fn_FillListData(this.obj, "GlobalOptions", API_WEB_URLS.MASTER + "/0/token/GlobalOPtions/Id/0");


    // if (obj.isAdmin == false) {
    //   Fn_FillListData(this.obj, "dashboarddata", API_WEB_URLS.MASTER + "/0/token/DataForDashboard/Id/" + obj.uid);
    //   if (obj.roleid == 4) {

    //     Fn_FillListData(this.obj, "latesttran", API_WEB_URLS.MASTER + "/0/token/LatestTransaction/Id/" + obj.uid);
    //   }
    //   Fn_CheckIsActive(this.obj, obj.uid);

    //   if (obj.IsVerified == 0) {
    //     this.setState({ kycmessage: true })
    //   }
    //   else if (obj.IsVerified == 1) {
    //     this.setState({ kycpending: true })
    //   }
    // }
    // else if (obj.isAdmin == true) {
    //   Fn_FillListData(this.obj, "dashboarddata", API_WEB_URLS.MASTER + "/0/token/DataForDashboard/Id/" + obj.uid);
    //   Fn_FillListData(this.obj, "dashboarledgers", API_WEB_URLS.MASTER + "/0/token/DashboardLedgers/Id/0");

    // }

    // Fn_FillListData(this.obj, "Company", this.API_URL_COMPANY + "/F_CustomerMaster/"+obj.uid);
  }






  render() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    const shop = {
      name: "lk",
    }
    return (
      <React.Fragment>
        {this.state.isloading ?

          <Loader /> : null}

        <div className="page-content">
          <Row>
            <div className="scrolling-container" style={{ marginTop: 20 }}>
              <Alert className="alert-success" role="alert">
                <p className="mb-0 scrolling-text">{this.state.GlobalOptions[0].DashboardLine}</p>
              </Alert>
            </div>
          </Row>
          <MetaTags>
            <title>Dashboard | BUSBUDDY</title>
          </MetaTags>
          <Container fluid>
            <h4>Dashboard</h4>

            <Row >
              {/* Reports Render */}

              {obj.roleid == 4 ?
                <>
                  {obj.IsAEPS ?
                    <CardContact key={1} src={"https://static.javatpoint.com/fullformpages/images/aeps-full-form.png"} name={"AEPS"} data={this.state.dashboarddata[0].TotaAEPSAmount} count={this.state.dashboarddata[0].TotaAEPS} link="/aeps" />
                    : null}
                  {obj.IsDMR ?
                    <CardContact key={2} src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuWVl8mX8UfVjEwoFfY_u__K739jW_D_lPZg&usqp=CAU"} name={"Fund Transfer"} data={this.state.dashboarddata[0].TotalDMRAmount} count={this.state.dashboarddata[0].TotalDMR} link="/remitter" />
                    : null}

                  {obj.IsIndoNepal ?

                    <CardContact key={3} src={"https://cyrusrecharge.com/img/inner-page/indo-nepal-api.jpg"} name={"Indo Nepal"} data={this.state.dashboarddata[0].TotalIndoNepalAmount} count={this.state.dashboarddata[0].TotalIndoNepal} link="/indonepal" />
                    : null}

                  {obj.IsRecharge ?
                    <CardContact key={4} src={"https://recharge-mobiles.com/wp-content/uploads/2021/03/recharge-mobiles-.png"} name={"Recharge"} data={this.state.dashboarddata[0].TotalRechargeAmount} count={this.state.dashboarddata[0].TotalRecharge} link="/recharge" />
                    : null}

                  {obj.IsPPIWallet ?
                    <CardContact key={5} src={"/PPI.png"} name={"PPI Wallet"} data={this.state.dashboarddata[0].TotalPPIAmount} count={this.state.dashboarddata[0].TotalPPI} link="/agentRegistration" />
                    : null}
                </>

                : null
              }



              {obj.isAdmin ?

                <>
                  <CardAdmin key={4} name={"Total Tickets"}
                    PaidAmount={this.state.dashboarddata[0].DMRPaidAmount}
                    PaidCount={this.state.dashboarddata[0].DMRPaidCount}

                    FailureAmount={this.state.dashboarddata[0].DMRFailureAmount}
                    FailureCount={this.state.dashboarddata[0].DMRFailureCount}

                    PendingAmount={this.state.dashboarddata[0].DMRPendingAmount}
                    PendingCount={this.state.dashboarddata[0].DMRPendingCount}

                    link="/dmrreport"
                  />
{/* 
                  <CardAdmin key={4} name={"Recharge"}
                    PaidAmount={this.state.dashboarddata[0].RechargePaidAmount}
                    PaidCount={this.state.dashboarddata[0].RechargePaidCount}

                    FailureAmount={this.state.dashboarddata[0].RechargeFailureAmount}
                    FailureCount={this.state.dashboarddata[0].RechargeFailureCount}

                    PendingAmount={this.state.dashboarddata[0].RechargePendingAmount}
                    PendingCount={this.state.dashboarddata[0].RechargePendingCount}

                    link="/rechargetran"
                  />



                  <CardAdmin key={4} name={"Indo Nepal"}
                    PaidAmount={this.state.dashboarddata[0].IndoNepalPaidAmount}
                    PaidCount={this.state.dashboarddata[0].IndoNepalPaidCount}

                    FailureAmount={this.state.dashboarddata[0].IndoNepalFailureAmount}
                    FailureCount={this.state.dashboarddata[0].IndoNepalFailureCount}

                    PendingAmount={this.state.dashboarddata[0].IndoNepalPendingAmount}
                    PendingCount={this.state.dashboarddata[0].IndoNepalPendingCount}

                    link="/indonepalreport"
                  />


                  <CardAdmin key={4} name={"AEPS"}
                    PaidAmount={this.state.dashboarddata[0].AEPSPaidAmount}
                    PaidCount={this.state.dashboarddata[0].AEPSPaidCount}

                    FailureAmount={this.state.dashboarddata[0].AEPSFailureAmount}
                    FailureCount={this.state.dashboarddata[0].AEPSFailureCount}

                    PendingAmount={this.state.dashboarddata[0].AEPSPendingAmount}
                    PendingCount={this.state.dashboarddata[0].AEPSPendingCount}

                    link="/aepsreport"
                  /> */}

                </>
                : null

              }
            </Row>

            {this.state.kycmessage ? (
              <SweetAlert
                title="UPDATE KYC!!!"
                error

                confirmBtnBsStyle="success"

                onConfirm={this.syno}

              >

              </SweetAlert>
            ) : null}
            {this.state.kycpending ? (
              <SweetAlert
                title="KYC IS UNDER REVIEW !!"
                warning
                confirmBtnBsStyle="success"
                onConfirm={this.logout}
              >


                Please wait we will complete as soon as possible.!

              </SweetAlert>
            ) : null}
            <Row>
              <Col xl="4">
                <Pie AEPS={this.state.dashboarddata[0].TotaAEPSAmount} DMR={this.state.dashboarddata[0].TotalDMRAmount}
                  RECHARGE={this.state.dashboarddata[0].TotalRechargeAmount} INDONEPAL={this.state.dashboarddata[0].TotalIndoNepalAmount}
                />
              </Col>


              {obj.roleid == 4 ?

                <Col md={8}>
                  <Card>
                    <CardBody>
                      <CardTitle className="h4">Latest Transactions</CardTitle>


                      <div className="table-responsive">
                        <Table className="table mb-0">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Date</th>
                              <th>Narration</th>
                              <th>Amount</th>

                            </tr>
                          </thead>
                          <tbody>
                            {this.state.latesttran.map((item, index) => (
                              <tr key={index}>
                                <th scope="row">{item.Id}</th>
                                <td>{item.Date}</td>
                                <td>{item.Narration}</td>
                                <td>{item.Amount}</td>
                              </tr>
                            ))}

                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                : null}





              {/* {obj.isAdmin ?

                <Col md={8}>
                  <Card>
                    <CardBody>
                      <CardTitle className="h4">Ledger Balance</CardTitle>


                      <div className="table-responsive">
                        <Table className="table mb-0">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Action</th>


                            </tr>
                          </thead>
                          <tbody>
                            {this.state.dashboarledgers.map((item, index) => (
                              <tr key={index}>
                                <th scope="row">{item.Name}</th>
                                <td>

                                  {this.state.balances[item.Id] !== undefined && this.state.balances[item.Id] != 0 ? (
                                    <span className="" style={{ marginRight: '10px' }}>
                                      {formatNumber(this.state.balances[item.Id])}
                                    </span>
                                  ) : (
                                    <span
                                      className=""
                                      style={{ marginRight: '10px', cursor: 'pointer' }}
                                      onClick={() => this.handrefresh(item.Id)}
                                    >
                                      View Balance
                                    </span>
                                  )}
                                </td>

                              </tr>
                            ))}

                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                : null} */}





            </Row>
          </Container>
        </div>
      </React.Fragment>
    )
  }
}

export default compose(container)(Dashboard);
