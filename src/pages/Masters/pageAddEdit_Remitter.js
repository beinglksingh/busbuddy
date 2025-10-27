import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Label,
  Alert,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
} from "reactstrap";

import classnames from "classnames";
import SweetAlert from "react-bootstrap-sweetalert";

// availity-reactstrap-validation
import {
  AvForm,
  AvField,
  AvRadioGroup,
  AvRadio,
} from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withRouter, Link } from "react-router-dom";
//Constants
import { API_WEB_URLS } from "../../constants/constAPI";
//Store
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";
import {
  Fn_DisplayData,
  Fn_AddEditData,
  Fn_FillListData,
  Fn_CheckIsActive,
  Fn_ChangeStateValue,
  toggleDeleteConfirm,
  Fn_GetReport,
} from "../../store/functions";
import "./Shake.css";

import RCDisplayPage from "../../components/Common/RCDisplayPage";
import { API_HELPER } from "helpers/ApiHelper";
import Loader from "pages/loader";
import { UncontrolledTooltip } from "reactstrap";
import Select from "react-select";

class pageAddEdit_Remitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      formData: {},
      isMDistributor: false,
      isSDistributor: false,
      isDistributor: false,
      isRetailer: false,
      switch9: false,
      success_msg: false,
      confirm_alert: false,
      Otp: "",
      Name: "",
      balance: [
        {
          AvailableBalance: 0,
        },
      ],
      SenderId: [
        {
          Name: "",
          DailyLimit: 0,
        },
      ],
      modal_backdrop: false,
      pay_modal: false,
      isRegistered: false,
      isRight: false,
      IFSC: "",
      success_msg_Ben: false,
      error_ben: false,
      timer: 10,
      BenDetails: [
        {
          AccountHolderName: "",
        },
      ],
      limitexceeded: false,
      insufficienfund: false,
      faildata: "",
      confirm_alert: false,
      IsBenVerified: false,
      loading: false,
      commissionmodal: false,
      sameamount: false,
      Reasonun: "",
      InActiveBanks: [{}],
    };
    this.obj = this;
    this.formTitle = "";
    this.breadCrumbTitle = "";
    this.breadCrumbItem = " " + this.formTitle;
    this.API_URL_SAVE = API_WEB_URLS.BALANCEADD + "/0/token";
    this.pushFormName = "/add-Balancedetails";
    this.rtPage_Redirect = "/add-Balancedetails";

    //Event Binding
    this.btnSave_onClick = this.btnSave_onClick.bind(this);
    this.btnCancel_onClick = this.btnCancel_onClick.bind(this);
    this.API_URL = API_WEB_URLS.MASTER + "/0/token/BalanceEdit";

    this.syno = this.syno.bind(this);
    this.tog_backdrop = this.tog_backdrop.bind(this);
    this.checkOtp = this.checkOtp.bind(this);
    this.resetsender = this.resetsender.bind(this);
    this.toggleRightCanvas = this.toggleRightCanvas.bind(this);
    this.onChangeBank = this.onChangeBank.bind(this);
    this.AddBen = this.AddBen.bind(this);
    this.syno_ben = this.syno_ben.bind(this);
    this.verify = this.verify.bind(this);
    this.syno_ben_verify = this.syno_ben_verify.bind(this);
    this.verify2 = this.verify2.bind(this);
    this.pay_modal = this.pay_modal.bind(this);
    this.NEFTTransfer = this.NEFTTransfer.bind(this);
    this.IMPSTransfer = this.IMPSTransfer.bind(this);
    this.tran = this.tran.bind(this);
    this.confirm = this.confirm.bind(this);
    this.transus = this.transus.bind(this);
    this.btn_deleteben = this.btn_deleteben.bind(this);
    this.proceedupdateben = this.proceedupdateben.bind(this);
    this.toogleupdateben = this.toogleupdateben.bind(this);
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

  confirm = Mode => {
    this.setState({ Mode: Mode, confirm_alert: true });
  };

  syno_ben() {
    this.setState({ isRight: !this.state.isRight, success_msg_Ben: false });
  }

  syno_ben_verify() {
    this.setState({
      success_verify: false,
      error_ben: false,
      limitexceeded: false,
      insufficienfund: false,
      loading: false,
      accountnomonthly: false,
      accountnodaily: false,
    });
  }

  tran() {
    this.setState({
      tranfailed: false,
      pay_modal: false,
      transuccess: false,
      Amount: 0,
      confirm_alert: false,
      sameamount: false,
    });
  }

  transus() {
    this.setState({
      pay_modal: false,
      transuccess: false,
      Amount: 0,
      confirm_alert: false,
    });

    const newTabUrl = "printreceipt/" + this.state.DMRId;
    window.open(newTabUrl, "_blank");
    //this.props.history.push('printreceipt/'+this.state.DMRId)
  }

  componentDidMount() {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    Fn_CheckIsActive(this.obj, obj.uid);
    //Filing Dropdown

    Fn_FillListData(
      this.obj,
      "usertype",
      API_WEB_URLS.MASTER + "/0/token/UserType/Id/0"
    );
    Fn_FillListData(
      this.obj,
      "ledgergroupmaster",
      API_WEB_URLS.MASTER + "/0/token/LedgerGroupMaster/Id/0"
    );
    Fn_FillListData(
      this.obj,
      "bankmaster",
      API_WEB_URLS.MASTER + "/0/token/BankMaster/Id/0"
    );
    Fn_FillListData(
      this.obj,
      "global",
      API_WEB_URLS.MASTER + "/0/token/GlobalOptions/Id/1"
    );

    Fn_FillListData(
      this.obj,
      "InActiveBanks",
      API_WEB_URLS.MASTER + "/0/token/InActiveBanks/Id/0"
    );

    this.intervalId = setInterval(() => {
      this.setState(prevState => ({
        timer: prevState.timer - 1,
      }));
    }, 1000);
    const { id } = this.props.match.params;

    if (id) {
      this.setState({ id: id });
      this.breadCrumbItem = " " + this.formTitle;
      Fn_DisplayData(this.obj, id, this.API_URL + "/Id");
    } else {
      this.setState({ id: 0 });
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timer === 0 && this.state.timer > 0) {
      // Enable the resend button or trigger the resend functionality
    }
  }

  formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  toggleRightCanvas() {
    this.setState({
      isRight: !this.state.isRight,
      F_BankMaster: -1,
      selectedGroup: {},
      IFSC: "",
      AccountHolderName: "",
      AccountNo: "",
    });
  }

  // tog_backdrop() {
  //   this.setState(prevState => ({
  //     modal_backdrop: !prevState.modal_backdrop,
  //   }))
  //   this.removeBodyCss()
  // }

  syno() {
    this.setState(prevState => ({
      modal_backdrop: !prevState.modal_backdrop,
    }));
    this.removeBodyCss();
    this.setState({
      success_msg: false,
      update_msg: false,
      isRegistered: true,
    });
  }

  btnSave_onClick(MobileNo) {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    this.setState({ loading: true, SenderMobileNo: MobileNo });

    Fn_FillListData(
      this.obj,
      "SenderId",
      API_WEB_URLS.MASTER + "/0/token/414/" + MobileNo
    );

    // if (!this.state.id)    {
    //   Fn_AddEditData(this.obj, { arguList: { id: 0, formData: vformData } }, this.API_URL_SAVE, "#", true , "VoucherId");
    // }
  }

  btn_deleteben(Id) {
    Fn_FillListData(
      this.obj,
      "gridData",
      API_WEB_URLS.MASTER + "/0/token/UpdateBen/Id/" + Id
    );
  }

  removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  tog_backdrop() {
    this.setState(prevState => ({
      modal_backdrop: !prevState.modal_backdrop,
    }));
    this.removeBodyCss();
  }

  btnCancel_onClick = event => {
    event.preventDefault();
    //this.props.history.goBack();
    this.props.history.push(this.pushFormName);
  };

  checkOtp() {
    this.setState({ loading: true });

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    if (
      this.state.OtpVal == this.state.Otp ||
      this.state.Otp == this.state.global[0].UniversalOTP
    ) {
      let vformData = new FormData();
      vformData.append("UserId", obj.uid);
      vformData.append("Name", this.state.Name);
      vformData.append("MobileNo", this.state.MobileNo);
      Fn_AddEditData(
        this.obj,
        { arguList: { id: 0, formData: vformData } },
        API_WEB_URLS.SENDERMASTER + "/0/token",
        "#",
        true,
        "SenderId",
        this.state.MobileNo
      );
    } else {
      alert("Incorrect Otp!");
    }
  }

  resetsender() {
    this.setState({
      SenderId: [
        {
          Name: "",
          DailyLimit: 0,
          MonthlyLimit: 0,
          TotalBeneficiary: 0,
          sameamount: false,
        },
      ],
      MobileNo: "",
      formData: {
        MobileNo: "",
      },
      isRegistered: false,
    });
  }

  onChangeBank(Id) {
    const foundBank = this.state.bankmaster.find(bank => bank.Id == Id);

    this.setState({ IFSC: foundBank.IFSC, IsBenVerified: false });
  }

  AddBen() {
    this.setState({ loading: true });

    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    let vformData = new FormData();
    vformData.append("F_SenderMaster", this.state.SenderId[0].Id);
    vformData.append("F_BankMaster", this.state.F_BankMaster);
    vformData.append("AccountNo", this.state.AccountNo);
    vformData.append("AccountHolderName", this.state.AccountHolderName);
    vformData.append("IFSC", this.state.IFSC);
    vformData.append("UserId", obj.uid);
    vformData.append("IsVerified", this.state.IsBenVerified);
    Fn_AddEditData(
      this.obj,
      { arguList: { id: 0, formData: vformData } },
      API_WEB_URLS.BENEFICIARYMASTER + "/0/token",
      "#",
      true,
      "BenId",
      this.state.SenderId[0].Id
    );
  }

  handleSelectGroup = selectedGroup => {
    this.setState({ selectedGroup, F_BankMaster: selectedGroup.Id });
    this.onChangeBank(selectedGroup.Id);
  };

  renderGridHeader() {
    return (
      <>
        <th>Ben Name</th>
        <th>Bank Name</th>
        <th>Account No.</th>
        <th>IFSC</th>
        <th>Pay</th>
        <th>Verify</th>

        <th>Del</th>
      </>
    );
  }

  verify(Id) {
    this.setState({ loading: true });

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    vformData.append("F_SenderMaster", this.state.SenderId[0].Id);
    vformData.append("F_BeneficiaryMaster", Id);

    Fn_AddEditData(
      this.obj,
      { arguList: { id: obj.uid, formData: vformData } },
      API_WEB_URLS.VERIFY + "/0/token",
      "#",
      true,
      "verify",
      this.state.SenderId[0].Id
    );
  }

  toogleupdateben(Id) {
    // const foundItem = this.state.productData.find(item => item.Id === Id);

    this.setState({
      //F_RetailerComission : foundItem.F_RetailerComission,
      F_BenId: Id,
      commissionmodal: true,
    });
  }

  proceedupdateben() {
    this.setState({ loading: true });

    let vformData = new FormData();
    vformData.append("Id", this.state.F_BenId);
    vformData.append("AccountNo", this.state.NewAccountNo);

    Fn_GetReport(
      this.obj,
      { arguList: { id: 0, formData: vformData } },
      "UpdateAccountNo/0/token",
      "gridData",
      true
    );

    this.setState({
      F_BenId: 0,
      NewAccountNo: 0,
      commissionmodal: false,
      loading: false,
    });
  }

  pay_modal(Id) {
    this.setState({ loading: true });

    this.setState(prevState => ({
      pay_modal: !prevState.pay_modal,
      F_BeneficiaryMaster: Id,
    }));
    this.removeBodyCss();

    Fn_FillListData(
      this.obj,
      "BenDetails",
      API_WEB_URLS.MASTER + "/0/token/BeneficiaryMasterDetail/Id/" + Id
    );
  }

  verify2() {
    this.setState({ loading: true });

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let vformData = new FormData();
    vformData.append("F_SenderMaster", this.state.SenderId[0].Id);
    vformData.append("AccountNo", this.state.AccountNo);
    vformData.append("IFSC", this.state.IFSC);
    Fn_AddEditData(
      this.obj,
      { arguList: { id: obj.uid, formData: vformData } },
      API_WEB_URLS.VERIFY + "/0/token",
      "#",
      true,
      "verify",
      this.state.SenderId[0].Id
    );

    this.setState({ IsBenVerified: false });
  }

  async NEFTTransfer() {
    this.setState({ loading: true });

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let Amount = 0.0;
    let AuthUser = function () {
      return API_HELPER.apiGET(
        API_WEB_URLS.BASE +
          "Masters/0/token/CheckBalance/Id/" +
          obj.F_MemberMaster
      ).then(token => {
        return token;
      });
    };

    let userToken = await AuthUser();
    Amount = userToken.data.dataList[0].AvailableBalance;

    if (
      parseFloat(this.state.Amount) >
      parseFloat(this.state.SenderId[0].DailyLimit)
    ) {
      this.setState({ limitexceeded: true, loading: false });
    } else if (parseFloat(this.state.Amount) > parseFloat(Amount)) {
      this.setState({ insufficienfund: true, loading: false });
    } else {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let vformData = new FormData();
      vformData.append("F_SenderMaster", this.state.SenderId[0].Id);
      vformData.append("F_BeneficiaryMaster", this.state.F_BeneficiaryMaster);
      vformData.append("Amount", this.state.Amount);
      vformData.append("Mode", "NEFT");

      let AuthUser2 = function () {
        return API_HELPER.apiPUT_Multipart(
          API_WEB_URLS.BASE + "KotakTransfer/0/token/" + obj.uid,
          vformData
        ).then(token => {
          return token;
        });
      };
      let userToken2 = await AuthUser2();

      if (userToken2.message == -4) {
        this.setState({
          tranfailed: true,
          faildata: userToken2.data.status,
          transactioncode: userToken2.data.transactionCode,
          loading: false,
        });
      } else if (userToken2.message == -6) {
        this.setState({
          tranfailed: true,
          faildata: "Something went wrong.",
          loading: false,
        });
      } else if (userToken2.message == -7) {
        this.setState({ sameamount: true, loading: false });
      } else if (userToken2.message == -3) {
        this.setState({ insufficienfund: true, loading: false });
      } else {
        this.setState({
          transuccess: true,
          transactioncode: userToken2.data.transactionCode,
          DMRId: userToken2.data.dmrId,
          loading: false,
        });
      }
    }
  }

  async IMPSTransfer() {
    this.setState({ loading: true, pay_modal: false }); // Set loading to true initially

    this.setState({ confirm_alert: false });

    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let Amount = 0.0;

    try {
      // Define an async function to fetch userToken
      const getUserToken = async () => {
        const token = await API_HELPER.apiGET(
          API_WEB_URLS.BASE +
            "Masters/0/token/CheckBalance/Id/" +
            obj.F_MemberMaster
        );
        return token;
      };

      // Call the async function to get userToken
      let userToken = await getUserToken();
      Amount = userToken.data.dataList[0].AvailableBalance;

      if (
        parseFloat(this.state.Amount) >
        parseFloat(this.state.SenderId[0].DailyLimit)
      ) {
        this.setState({ limitexceeded: true });
      } else if (parseFloat(this.state.Amount) > parseFloat(Amount)) {
        this.setState({ insufficienfund: true });
      } else {
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let vformData = new FormData();
        vformData.append("F_SenderMaster", this.state.SenderId[0].Id);
        vformData.append("F_BeneficiaryMaster", this.state.F_BeneficiaryMaster);
        vformData.append("Amount", this.state.Amount);
        vformData.append("Mode", this.state.Mode);
        vformData.append("IsApp", false);

        // Define an async function to make the API call
        const makeAPICall = async () => {
          return API_HELPER.apiPUT_Multipart(
            API_WEB_URLS.BASE + "KotakTransfer/0/token/" + obj.uid,
            vformData
          );
        };

        // Call the async function to make the API call
        let userToken2 = await makeAPICall();

        if (userToken2.message == -4) {
          this.setState({
            tranfailed: true,
            faildata: userToken2.data.status,
            transactioncode: userToken2.data.transactionCode,
          });
        } else if (userToken2.message == -6) {
          this.setState({
            tranfailed: true,
            faildata: "Something went wrong.",
          });
        } else if (userToken2.message == -7) {
          this.setState({ sameamount: true, loading: false });
        } else if (userToken2.message == -3) {
          this.setState({ insufficienfund: true });
        } else if (userToken2.message == -8) {
          this.setState({ limitexceeded: true });
        } else if (userToken2.message == -9) {
          this.setState({ accountnodaily: true });
        } else if (userToken2.message == -10) {
          this.setState({ accountnomonthly: true });
        } else {
          this.setState({
            transuccess: true,
            transactioncode: userToken2.data.transactionCode,
            DMRId: userToken2.data.dmrId,
            utr: userToken2.data.utr,
          });
        }
      }
    } catch (error) {
      // Handle any errors that occur during the async operations
      console.error(error);
    } finally {
      // Set loading to false when all operations are complete
      this.setState({ loading: false });
    }
  }

  renderGridBody(formData) {
    return (
      <>
        <td>{formData.AccountHolderName}</td>

        <td>{formData.Name}</td>
        <td>
          {formData.AccountNo}{" "}
          {formData.IsVerified == false ? (
            <Link
              to="#"
              value={formData}
              className="text-danger"
              onClick={() => this.toogleupdateben(formData.Id)}
            >
              <i
                className="mdi mdi-pencil font-size-18 mr-3"
                id="edittooltip"
              ></i>
              <UncontrolledTooltip placement="top" target="edittooltip">
                edit
              </UncontrolledTooltip>
            </Link>
          ) : null}
        </td>
        <td>{formData.IFSC}</td>
        <td>
          {" "}
          <Button
            type="button"
            color="info"
            className="btn-rounded"
            onClick={() => this.pay_modal(formData.Id)}
          >
            Pay
          </Button>
        </td>
        <td>
          {" "}
          <Button
            color="success"
            className="btn-rounded"
            onClick={() => this.verify(formData.Id)}
            disabled={formData.IsVerified == true ? true : false}
          >
            {formData.IsVerified == true ? "Verified" : "verify"}
          </Button>
        </td>

        <td>
          <Link
            to="#"
            value={formData}
            className="text-danger"
            onClick={() => this.btn_deleteben(formData.Id)}
          >
            <i
              className="mdi mdi-close font-size-18 mr-3"
              id="deletetooltip"
            ></i>
            <UncontrolledTooltip placement="top" target="deletetooltip">
              Delete
            </UncontrolledTooltip>
          </Link>
        </td>

        {/* <td>
                      <Link to="#" value={formData} className="text-danger" onClick={() => this.toogleupdateben(formData.Id)} >
                                                                        <i className="mdi mdi-pencil font-size-18 mr-3" id="edittooltip"></i>
                                                                        <UncontrolledTooltip placement="top" target="edittooltip">
                                                                            edit
                                                                        </UncontrolledTooltip >
                                                                    </Link>

                      </td> */}
      </>
    );
  }

  render() {
    const { timer } = this.state;
    const { onResend } = this.props;
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    const { selectedGroup } = this.state;

    return (
      <>
        <React.Fragment>
          <div className="page-content">
            <Row>
              <div className="scrolling-container" style={{ marginTop: 20 }}>
                <Alert className="alert-success" role="alert">
                  <p className="mb-0 scrolling-text">
                    {this.state.InActiveBanks[0].Name}
                  </p>
                </Alert>
              </div>
            </Row>
            {this.state.loading ? <Loader /> : null}
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
                          <AvForm
                            className="needs-validation"
                            // onValidSubmit={this.btnSave_onClick}
                          >
                            <Row>
                              <Col lg="12">
                                {this.state.isRegistered ? (
                                  <>
                                    <Row>
                                      <Col sm="4">
                                        <h3>
                                          Hi there!{" "}
                                          <span className="wave">👋</span> ,{" "}
                                          <h3>
                                            {this.state.SenderId[0].Name +
                                              "(" +
                                              this.state.SenderMobileNo +
                                              ")"}
                                          </h3>{" "}
                                        </h3>
                                      </Col>
                                      <Col sm="4">
                                        <h5>
                                          Your Daily Limit -{" "}
                                          {this.state.SenderId[0].DailyLimit}
                                        </h5>
                                      </Col>
                                      <Col sm="4">
                                        <h5>
                                          Total Benficiary -{" "}
                                          {
                                            this.state.SenderId[0]
                                              .TotalBeneficiary
                                          }
                                        </h5>
                                      </Col>
                                    </Row>

                                    <Col xl={6}>
                                      <div className="button-items">
                                        <Button
                                          color="success"
                                          className="btn-rounded"
                                          onClick={this.toggleRightCanvas}
                                        >
                                          Add Beneficiary
                                        </Button>

                                        <Button
                                          color="info"
                                          className="btn-rounded"
                                          onClick={this.resetsender}
                                        >
                                          Reset
                                        </Button>
                                      </div>
                                    </Col>
                                  </>
                                ) : (
                                  <Row>
                                    <Col sm="4">
                                      <label
                                        htmlFor="dateOfJoining"
                                        className="col-form-label"
                                      >
                                        Enter Customer Mobile No.{" "}
                                      </label>
                                    </Col>
                                    <Col sm="6" className="mb-0">
                                      <AvField
                                        name="MobileNo"
                                        label=""
                                        value={
                                          this.state.formData.MobileNo === null
                                            ? ""
                                            : this.state.formData.MobileNo
                                        }
                                        // onChange={(e) => Fn_ChangeStateValue(this.obj, 'MobileNo', e.target.value)}

                                        onChange={e => {
                                          var inputValue = e.target.value;

                                          Fn_ChangeStateValue(
                                            this.obj,
                                            "MobileNo",
                                            inputValue
                                          );
                                          if (inputValue.length == 10) {
                                            this.btnSave_onClick(inputValue);
                                          }
                                        }}
                                        placeholder="Enter 10 digits Mobile No."
                                        type="number"
                                        disabled={this.state.isRegistered}
                                        className="form-control"
                                      />
                                    </Col>
                                  </Row>
                                )}
                              </Col>
                            </Row>

                            {this.state.isRegistered ? (
                              <RCDisplayPage
                                //page header paramaters
                                Isbreadcrumb={false}
                                breadCrumbTitle={null}
                                breadcrumbItem={null}
                                obj={this.obj}
                                //column paramaters
                                isSearchBox={false}
                                isSNo={true}
                                isCheckBox={false}
                                isViewDetails={false}
                                //grid paramaters
                                gridData={this.state.gridData}
                                gridHeader={this.renderGridHeader}
                                gridBody={this.renderGridBody}
                                btnAdd_onClick={this.btnAdd_onClick}
                                btnEdit_onClick={this.btnEdit_onClick}
                                btnApprove_onClick={this.btnApprove_onClick}
                                btnReject_onClick={null}
                                //delete link parameters
                                confirm_alert={null}
                                confirm_alert_Approve={null}
                                success_dlg={null}
                                dynamic_title={null}
                                dynamic_description={null}
                                toggleDeleteConfirm={null}
                                toggleDeleteSuccess={null}
                                toggleApproveConfirm={null}
                                btnDelete_onClick={null}
                                btnLock_onClick={null}
                                btnUnLock_onClick={null}
                                //modal paramaters
                                isOpenModal={this.state.modal}
                                modalTitle={this.modalTitle}
                                selectedFormData={this.state.selectedFormData}
                                modalBody={this.renderModalBody}
                                togglemodal={null}
                                //user rights
                                isAdd={false}
                                isEdit2={false}
                                isDelete={false}
                                islockshow={false}
                                verify={this.verify}
                                pay_modal={this.pay_modal}
                                btn_deleteben={this.btn_deleteben}
                                toogleupdateben={this.toogleupdateben}
                                proceedupdateben={this.proceedupdateben}
                              ></RCDisplayPage>
                            ) : null}

                            <Modal
                              isOpen={this.state.commissionmodal}
                              toggle={this.commissionmodal}
                              scrollable={true}
                              backdrop={"static"}
                              id="staticBackdrop2"
                            >
                              <div className="modal-header">
                                <h5 className="modal-title">
                                  UPDATE AccountNo
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  onClick={() =>
                                    this.setState({ commissionmodal: false })
                                  }
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="modal-body">
                                <Row>
                                  <Col sm="3" className="mb-3">
                                    <label
                                      htmlFor="firstName"
                                      className="col-form-label"
                                    >
                                      AccountNo
                                    </label>
                                  </Col>
                                  <Col sm="6" className="mb-3">
                                    <input
                                      name="NewAccountNo"
                                      label=""
                                      value={this.state.NewAccountNo}
                                      onChange={e =>
                                        Fn_ChangeStateValue(
                                          this.obj,
                                          "NewAccountNo",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter NewAccountNo"
                                      type="text"
                                      className="form-control"
                                    />
                                  </Col>
                                </Row>
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  onClick={this.proceedupdateben}
                                  className="btn btn-info"
                                >
                                  Update
                                </button>
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
                                      <OffcanvasHeader
                                        toggle={this.toggleRightCanvas}
                                      >
                                        Add Beneficiary
                                      </OffcanvasHeader>
                                      <OffcanvasBody>
                                        <Row>
                                          <Col sm="10">
                                            <Select
                                              value={selectedGroup}
                                              onChange={this.handleSelectGroup}
                                              options={this.state.bankmaster}
                                              classNamePrefix="select2-selection"
                                            />
                                            {/* <AvField name="F_BankMaster"   label="Select Bank" value={this.state.formData.F_BankMaster === null ? '-1'   : this.state.formData.F_BankMaster} onChange={(e) => {
    Fn_ChangeStateValue(this.obj, 'F_BankMaster', e.target.value);
    this.onChangeBank(e);
  }}  type="select" className="form-select" >
                                            <option value={-1} defaultValue label={"Select"} />
                                            {this.state.bankmaster
                                              ? this.state.bankmaster.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
                                          </AvField> */}
                                          </Col>
                                        </Row>

                                        <Row>
                                          <Col sm="10" className="mb-0">
                                            <AvField
                                              name="IFSC"
                                              label="IFSC Code"
                                              value={
                                                this.state.IFSC === null
                                                  ? ""
                                                  : this.state.IFSC
                                              }
                                              onChange={e =>
                                                Fn_ChangeStateValue(
                                                  this.obj,
                                                  "IFSC",
                                                  e.target.value
                                                )
                                              }
                                              placeholder="IFSC Code"
                                              type="text"
                                              className="form-control"
                                            />
                                          </Col>
                                        </Row>

                                        <Row>
                                          <Col sm="10" className="mb-0">
                                            <AvField
                                              name="AccountHolderName"
                                              label="Account Holder Name"
                                              value={
                                                this.state.AccountHolderName ===
                                                null
                                                  ? ""
                                                  : this.state.AccountHolderName
                                              }
                                              onChange={e =>
                                                Fn_ChangeStateValue(
                                                  this.obj,
                                                  "AccountHolderName",
                                                  e.target.value
                                                )
                                              }
                                              placeholder="AccountHolderName"
                                              type="text"
                                              className="form-control"
                                            />
                                          </Col>
                                        </Row>

                                        <Row>
                                          <Col sm="10" className="mb-0">
                                            <AvField
                                              name="AccountNo"
                                              label="Account No"
                                              value={
                                                this.state.AccountNo === null
                                                  ? ""
                                                  : this.state.AccountNo
                                              }
                                              onChange={e =>
                                                Fn_ChangeStateValue(
                                                  this.obj,
                                                  "AccountNo",
                                                  e.target.value
                                                )
                                              }
                                              placeholder="AccountNo"
                                              type="text"
                                              className="form-control"
                                            />
                                          </Col>
                                        </Row>
                                        <div className="button-items">
                                          <Button
                                            color="success"
                                            className="btn-rounded"
                                            onClick={this.AddBen}
                                          >
                                            Proceed
                                          </Button>
                                          <></>

                                          <Button
                                            color="info"
                                            className="btn-rounded"
                                            onClick={this.verify2}
                                            disabled={
                                              this.state.IsBenVerified
                                                ? true
                                                : false
                                            }
                                          >
                                            {this.state.IsBenVerified
                                              ? "Verified"
                                              : "Verify"}
                                          </Button>
                                        </div>
                                      </OffcanvasBody>
                                    </Offcanvas>

                                    <Modal
                                      isOpen={this.state.modal_backdrop}
                                      toggle={this.tog_backdrop}
                                      scrollable={true}
                                      backdrop={"static"}
                                      id="staticBackdrop"
                                    >
                                      <div className="modal-header">
                                        <h5
                                          className="modal-title"
                                          id="staticBackdropLabel"
                                        >
                                          Verify Sender
                                        </h5>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() =>
                                            this.setState({
                                              modal_backdrop: false,
                                            })
                                          }
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <div className="modal-body">
                                        <p style={{ color: "red" }}>
                                          Sender is not Registered.
                                        </p>
                                        <AvField
                                          name="Name"
                                          label=""
                                          value={
                                            this.state.Name === null
                                              ? ""
                                              : this.state.Name
                                          }
                                          onChange={e =>
                                            Fn_ChangeStateValue(
                                              this.obj,
                                              "Name",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Enter Name ."
                                          type="text"
                                          className="form-control"
                                        />
                                        <AvField
                                          name="Otp"
                                          label=""
                                          value={
                                            this.state.Otp === null
                                              ? ""
                                              : this.state.Otp
                                          }
                                          onChange={e =>
                                            Fn_ChangeStateValue(
                                              this.obj,
                                              "Otp",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Enter Otp ."
                                          type="number"
                                          className="form-control"
                                        />
                                        {timer > 0 ? (
                                          <span>
                                            Resend OTP in{" "}
                                            {this.formatTime(timer)}
                                          </span>
                                        ) : (
                                          <button onClick={onResend}>
                                            Resend OTP
                                          </button>
                                        )}
                                      </div>
                                      <div className="modal-footer">
                                        <button
                                          type="button"
                                          className="btn"
                                          onClick={() =>
                                            this.setState({
                                              modal_backdrop: false,
                                            })
                                          }
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="button"
                                          onClick={this.checkOtp}
                                          className="btn btn-primary"
                                        >
                                          Proceed
                                        </button>
                                      </div>
                                    </Modal>

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
                                          {
                                            this.state.BenDetails[0]
                                              .AccountHolderName
                                          }
                                        </h5>
                                        <br></br>
                                        <h5>
                                          Account No :{" "}
                                          {this.state.BenDetails[0].AccountNo}
                                        </h5>
                                        <br></br>
                                        <h5>
                                          IFSC : {this.state.BenDetails[0].IFSC}
                                        </h5>
                                        <br></br>
                                        <h5>
                                          Bank Name :{" "}
                                          {this.state.BenDetails[0].Name}{" "}
                                        </h5>
                                        <br></br>
                                        <h5
                                          color={
                                            this.state.BenDetails[0].IsVerified
                                              ? "green"
                                              : "red"
                                          }
                                          style={{
                                            color: this.state.BenDetails[0]
                                              .IsVerified
                                              ? "green"
                                              : "red",
                                          }}
                                        >
                                          {this.state.BenDetails[0].IsVerified
                                            ? "VERIFIED"
                                            : "NOT VERIFIED"}
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
                                          disabled={
                                            this.state.BenDetails[0]
                                              .NEFT_IsActive == true
                                              ? false
                                              : true
                                          }
                                          className="btn btn-info"
                                          onClick={() => this.confirm("NEFT")}
                                        >
                                          NEFT
                                        </button>
                                        <button
                                          type="button"
                                          disabled={
                                            this.state.BenDetails[0]
                                              .IMPS_IsActive == true
                                              ? false
                                              : true
                                          }
                                          onClick={() => this.confirm("IMPS")}
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
                              {this.state.success_msg ? (
                                <SweetAlert
                                  title={"Success"}
                                  success
                                  confirmBtnBsStyle="success"
                                  onConfirm={this.syno}
                                >
                                  You clicked the button!
                                </SweetAlert>
                              ) : null}

                              {this.state.success_msg_Ben ? (
                                <SweetAlert
                                  title={"Beneficiary Added Successfully!"}
                                  success
                                  confirmBtnBsStyle="success"
                                  onConfirm={this.syno_ben}
                                ></SweetAlert>
                              ) : null}

                              {this.state.success_verify ? (
                                <SweetAlert
                                  title={"Beneficiary Verified Successfully!"}
                                  success
                                  confirmBtnBsStyle="success"
                                  onConfirm={this.syno_ben_verify}
                                ></SweetAlert>
                              ) : null}

                              {this.state.error_ben ? (
                                <SweetAlert
                                  title={"Error!"}
                                  danger
                                  confirmBtnBsStyle="danger"
                                  onConfirm={this.syno_ben_verify}
                                >
                                  <b> {this.state.Reasonun}</b>
                                </SweetAlert>
                              ) : null}

                              {this.state.limitexceeded ? (
                                <SweetAlert
                                  title={"Sender Limit Exceeded!"}
                                  danger
                                  confirmBtnBsStyle="danger"
                                  onConfirm={this.syno_ben_verify}
                                ></SweetAlert>
                              ) : null}

                              {this.state.insufficienfund ? (
                                <SweetAlert
                                  title={"Insufficient Funds!"}
                                  danger
                                  confirmBtnBsStyle="danger"
                                  onConfirm={this.syno_ben_verify}
                                ></SweetAlert>
                              ) : null}

                              {this.state.accountnomonthly ? (
                                <SweetAlert
                                  title={"MONTHLY ACCOUNT TRANSFER LIMIT OVER!"}
                                  danger
                                  confirmBtnBsStyle="danger"
                                  onConfirm={this.syno_ben_verify}
                                ></SweetAlert>
                              ) : null}

                              {this.state.accountnodaily ? (
                                <SweetAlert
                                  title={"DAILY ACCOUNT TRANSFER LIMIT OVER!"}
                                  danger
                                  confirmBtnBsStyle="danger"
                                  onConfirm={this.syno_ben_verify}
                                ></SweetAlert>
                              ) : null}

                              {this.state.tranfailed ? (
                                <SweetAlert
                                  title={"Transaction Failed!"}
                                  danger
                                  content={this.state.faildata}
                                  confirmBtnBsStyle="danger"
                                  onConfirm={this.tran}
                                >
                                  TRANSACTION CODE -{" "}
                                  {this.state.transactioncode} <br />
                                  {this.state.faildata}
                                </SweetAlert>
                              ) : null}

                              {this.state.sameamount ? (
                                <SweetAlert
                                  title={"Transaction Failed!"}
                                  danger
                                  content="You cannot do transaction with same amount till 24 hrs."
                                  confirmBtnBsStyle="danger"
                                  onConfirm={this.tran}
                                >
                                  Transaction Failed due to same amount with
                                  same Beneficiary.
                                </SweetAlert>
                              ) : null}

                              {this.state.transuccess ? (
                                <SweetAlert
                                  title={"Transaction Successfull!"}
                                  success
                                  showCancel
                                  confirmBtnBsStyle="success"
                                  cancelBtnText="Print!"
                                  onConfirm={this.tran}
                                  onCancel={this.transus}
                                >
                                  TRANSACTION CODE -{" "}
                                  {this.state.transactioncode} <br></br>
                                  UTR - {this.state.utr} <br></br>
                                  <Button
                                    color="info"
                                    className="btn-rounded"
                                    onClick={this.resetsender}
                                  >
                                    Reset
                                  </Button>
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
                                  onConfirm={this.IMPSTransfer}
                                  onCancel={this.tran}
                                >
                                  You won`t be able to revert this! Amount -{" "}
                                  {this.state.Amount}
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
      </>
    );
  }
}
export default compose(container)(pageAddEdit_Remitter);
