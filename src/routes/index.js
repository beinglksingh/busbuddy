import React from "react";
import { Redirect } from "react-router-dom";
// User profile
import UserProfile from "../pages/Authentication/UserProfile";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ChangePassword from "../pages/Authentication/ChangePassword";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
// Masters


import pageAddEdit_CustomerMaster from "pages/Masters/pageAddEdit_CustomerMaster";

import pageAddEdit_CompanyMaster from "pages/Masters/pageAddEdit_CompanyMaster";

import pageList_DayWiseAtt from "pages/Masters/pageList_DayWiseAtt";
import pageAddEdit_MemberMaster from "pages/Masters/pageAddEdit_MemberMaster";
import pageList_AuditAtt from "pages/Masters/pageList_AuditAtt";
import pageAddEdit_GlobalOptions from "pages/Help/pageAddEdit_GlobalOptions";
import pageList_Test from "pages/Masters/pageList_Test";

import pageAddEdit_ShiftMaster from "pages/Masters/pageAddEdit_ShiftMaster";
import pageAddEdit_Voucher from "pages/Masters/pageAddEdit_Voucher";
import pageList_MemberMaster from "pages/Masters/pageList_MemberMaster";
import pageList_LedgerMaster from "pages/Masters/pageList_LedgerMaster";
 import OTP from "pages/Authentication/OTP";
import pageAddEdit_AddBalance from "pages/Masters/pageAddEdit_AddBalance";
import pageList_BalanceAdd from "pages/Masters/pageList_BalanceAdd";
import pageList_SMSAPI from "pages/Masters/pageList_SMSAPI";
import pageAddEdit_AddSMSAPI from "pages/Masters/pageAddEdit_AddSMSAPI";
import pageAddEdit_Remitter from "pages/Masters/pageAddEdit_Remitter";
import pageAddEdit_PlanAdd from "pages/Masters/pageAddEdit_PlanAdd";
import pageList_AccountStatement from "pages/Masters/pageList_AccountStatement";
import pageAddEdit_PlanMaster from "pages/Masters/pageAddEdit_PlanMaster";
import pageList_PlanMaster from "pages/Masters/pageList_PlanMaster";
import pageList_BankMaster from "pages/Masters/pageList_BankMaster";
import pageAddEdit_BankMaster from "pages/Masters/pageAddEdit_BankMaster";
import pageList_TransactionStatusCode from "pages/Masters/pageList_TransactionStatusCode";
import pageAddEdit_TransactionCodeMaster from "pages/Masters/pageAddEdit_TransactionCodeMaster";
import pageList_IFSCSwap from "pages/Masters/pageList_IFSCSwap";
import pageAddEdit_IFSCSwapMaster from "pages/Masters/pageAddEdit_IFSCSwapMaster";
import pageAddEdit_IndoNepal from "pages/Masters/pageAddEdit_IndoNepal";
import pageAddEdit_AEPS from "pages/Masters/pageAddEdit_AEPS";
import pageList_RechargeOperator from "pages/Masters/pageList_RechargeOperator";
import pageAddEdit_RechargeOperator from "pages/Masters/pageAddEdit_RechargeOperator";
import pageList_RechargeAPI from "pages/Masters/pageList_RechargeAPI";
import pageAddEdit_RechargeAPI from "pages/Masters/pageAddEdit_RechargeAPI";
import pageAddEdit_Recharge from "pages/Masters/pageAddEdit_Recharge";

import pageList_ComissionReport from "pages/Masters/pageList_ComissionReport";

import pageAddEdit_AEPSRegistration from "pages/Masters/pageAddEdit_AEPSRegistration";
import pageList_Recharges from "pages/Masters/pageList_Recharges";
import pageList_BankUpload from "pages/Masters/pageList_BankUpload";
import pageList_DMRList from "pages/Masters/pageList_DMRList";
import pageList_IndoNepalList from "pages/Masters/pageList_IndoNepalList";
import pageList_AEPSList from "pages/Masters/pageList_AEPSList";
import pageList_TDSReportForAdmin from "pages/Masters/pageList_TDSReportForAdmin";
import pageList_LedgerDetails from "pages/Masters/pageList_LedgerDetails";
import pageList_UpdateUTR from "pages/Masters/pageList_UpdateUTR";
import pageAddEdit_LedgerMaster from "pages/Masters/pageAddEdit_LedgerMaster";
import pageAddEdit_Fundrequest from "pages/Masters/pageAddEdit_Fundrequest";
import pageList_FundRequest from "pages/Masters/pageList_FundRequest";
import pageAddEdit_MemberServices from "pages/Masters/pageAddEdit_MemberServices";
import pageAddEdit_RaiseTicket from "pages/Masters/pageAddEdit_RaiseTicket";
import pageList_TicketList from "pages/Masters/pageList_TicketList";
import pagelist_TicketChat from "pages/Masters/pagelist_TicketChat";
import PrintReceipt from "components/Print/PrintReceipt";
import pageList_MemberBalance from "pages/Masters/pageList_MemberBalance";
import pageList_TopRetailer from "pages/Masters/pageList_TopRetailer";
import PrintReceiptNMR from "components/Print/PrintReceiptNMR";
import pageList_DistAccountStatement from "pages/Masters/pageList_DistAccountStatement";
import pageList_BankLedger from "pages/Masters/pageList_BankLedger";
import pageList_CashLedger from "pages/Masters/pageList_CashLedger";
import pageList_AccountStatementAdmin from "pages/Masters/pageList_AccountStatementAdmin";
import PrintReceiptMiniStatement from "components/Print/PrintReceiptMiniStatement";
import pageList_VouchersList from "pages/Masters/pageList_VouchersList";
import pagelist_BalanceCheck from "pages/Masters/pagelist_BalanceCheck";
import PrintReceiptCashWithdrawal from "components/Print/PrintReceiptCashWithdrawal";
import pageList_APILogs from "pages/Masters/pageList_APILogs";
import pageList_Verificationreport from "pages/Masters/pageList_Verificationreport";
import pageAddEdit_IndoKYC from "pages/Masters/pageAddEdit_IndoKYC";
import pageList_Users from "pages/Masters/pageList_Users";
import pageAddEdit_UserMaster from "pages/Masters/pageAddEdit_UserMaster";
import pageAddEdit_PSOnBoarding from "pages/Masters/pageAddEdit_PSOnBoarding";
import pageAddEdit_CreasteCSP from "pages/Masters/pageAddEdit_CreasteCSP";
import pageAddEdit_AccountTypeScheme from "pages/Masters/pageAddEdit_AccountTypeScheme";
import pageList_AccountTypeScheme from "pages/Masters/pageList_AccountTypeScheme";
import pageAddEdit_AccountTypeSchemInterest from "pages/Masters/pageAddEdit_AccountTypeSchemInterest";
import pageList_AccountTypeSchemeInterest from "pages/Masters/pageList_AccountTypeSchemeInterest";
import pageAddEdit_LoanMaster from "pages/Masters/pageAddEdit_LoanMaster";
import pageList_LoanReport from "pages/Masters/pageList_LoanReport";
import pageList_LoanDetails from "pages/Masters/pageList_LoanDetails";
import pageAddEdit_LoanEMI from "pages/Masters/pageAddEdit_LoanEMI";
import pageList_LoanLedger from "pages/Masters/pageList_LoanLedger";
import pageList_AccountStatementExcel from "pages/Masters/pageList_AccountStatementExcel";

import pageAddEdit_Fdmaster from "pages/Masters/pageAddEdit_Fdmaster";
import AddEdit_Remitter from "pages/PaysprintServices/AddEdit_Remitter";
import AgentRegistration from "pages/PaysprintServices/AgentRegistration";
import PageList_PPWalletTran from "pages/PaysprintServices/PageList_PPWalletTran";
import pageAddEdit_BusBooking from "pages/Masters/pageAddEdit_BusBooking";
import TicketPrint from "pages/Masters/TicketPrint";
import pageList_TicketReport from "pages/Masters/pageList_TicketReport";
import test from "pages/Dashboard/test";
import UserDashboard from "pages/Masters/UserDashboard";
import BusesList from "pages/Masters/BusesList";
import PassengerDetails from "pages/Masters/PassengerDetails";
import Privacy from "pages/Masters/Privacy";
import DeletionRequest from "pages/Masters/DeletionRequest";
import BookingDetails from "pages/Masters/BookingDetails";
import Funding from "pages/Dashboard/funding";
import Campaign from "pages/Masters/campaign";
import AboutUs from "pages/Masters/aboutus";
import Footer from "pages/Masters/Footer";
import TermsAndConditions from "pages/Masters/TermsAndConditions";


const authProtectedRoutes = [
  // { path: "/dashboard", component: Dashboard },

   
  //profile
  { path: "/profile", component: UserProfile },
  { path: "/changepassword", component: ChangePassword },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },

  //Masters
  { path: "/smsapi", component: pageList_SMSAPI },

 
  { path: "/dashboard", component: test },

  


  
  { path: "/RemitterCheck", component: AddEdit_Remitter },
  { path: "/ticketreport", component: pageList_TicketReport },
  { path: "/AgentRegistration", component: AgentRegistration },
  { path: "/bankledger", component: pageList_BankLedger },
  { path: "/statementexcel", component: pageList_AccountStatementExcel },
  { path: "/loanemi", component: pageAddEdit_LoanEMI },

  { path: "/loanemi/:id", component: pageAddEdit_LoanEMI },

  { path: "/ticketprint/:id", component: TicketPrint },

  { path: "/loanreport", component: pageList_LoanReport },
  { path: "/loandetails", component: pageList_LoanDetails },

  { path: "/loanmaster", component: pageAddEdit_LoanMaster },
  { path: "/loanledger", component: pageList_LoanLedger },

  { path: "/FdMaster", component: pageAddEdit_Fdmaster },

  { path: "/accounttypeschemeinterest", component: pageAddEdit_AccountTypeSchemInterest },

  { path: "/accounttypeschemeinterestlist", component: pageList_AccountTypeSchemeInterest },


  { path: "/accounttypescheme", component: pageAddEdit_AccountTypeScheme },
  { path: "/accounttypeschemelist", component: pageList_AccountTypeScheme },
  { path: "/edit-accounttypescheme/:id", component: pageAddEdit_AccountTypeScheme },

  { path: "/createcsp", component: pageAddEdit_CreasteCSP },

  { path: "/psonboarding", component: pageAddEdit_PSOnBoarding },
  { path: "/psonboarding/:id", component: pageAddEdit_PSOnBoarding },

  { path: "/cashledger", component: pageList_CashLedger },

  // { path: "/busbooking", component: pageAddEdit_BusBooking },

  { path: "/verificationreport", component: pageList_Verificationreport },


  { path: "/apilogs", component: pageList_APILogs },
  


  { path: "/voucherslist", component: pageList_VouchersList },


  { path: "/add-smsapi", component: pageAddEdit_AddSMSAPI },
 
  { path: "/edit-smsapi/:id", component: pageAddEdit_AddSMSAPI },

  { path: "/add-user", component: pageAddEdit_UserMaster },
  { path: "/edit-user/:id", component: pageAddEdit_UserMaster },



  { path: "/ticketchat/:id", component: pagelist_TicketChat },

  { path: "/balancecheck", component: pagelist_BalanceCheck },


  { path: "/users", component: pageList_Users },


  { path: "/accountstatementadmin", component: pageList_AccountStatementAdmin },

  { path: "/printreceipt/:id", component: PrintReceipt },

  { path: "/printreceiptnmr/:id", component: PrintReceiptNMR },

  { path: "/printministatement", component: PrintReceiptMiniStatement },

  { path: "/printcashwithdrawal/:id", component: PrintReceiptCashWithdrawal },



  { path: "/distaccountstatement", component: pageList_DistAccountStatement },


  { path: "/indonepalreport", component: pageList_IndoNepalList },

  { path: "/memberbalance", component: pageList_MemberBalance },

  { path: "/raiseticket", component: pageAddEdit_RaiseTicket },


  { path: "/memberservice", component: pageAddEdit_MemberServices },


  { path: "/fundrequestreport", component: pageList_FundRequest },

  { path: "/tickets", component: pageList_TicketList },


  { path: "/fundrequest", component: pageAddEdit_Fundrequest },


  { path: "/LedgerDetails", component: pageList_LedgerDetails },

  { path: "/updateutrlist", component: pageList_UpdateUTR },

  { path: "/dmrreport", component: pageList_DMRList },
  { path: "/PPwalletreport", component: PageList_PPWalletTran },
  { path: "/aepsreport", component: pageList_AEPSList },


  { path: "/recharge", component: pageAddEdit_Recharge },

  { path: "/tdsreportforadmin", component: pageList_TDSReportForAdmin },

  { path: "/bankUpload", component: pageList_BankUpload },

  { path: "/rechargetran", component: pageList_Recharges },

  { path: "/topretailer", component: pageList_TopRetailer },



  { path: "/remitter", component: pageAddEdit_Remitter },


  { path: "/aepsregistration", component: pageAddEdit_AEPSRegistration },


  { path: "/comissionreport", component: pageList_ComissionReport },

  { path: "/indonepal", component: pageAddEdit_IndoNepal },

  { path: "/add-Balance", component: pageAddEdit_AddBalance },
  { path: "/add-Balancedetails", component: pageList_BalanceAdd },
  { path: "/edit-balance/:id", component: pageAddEdit_AddBalance },


  
  { path: "/add-planmaster", component: pageAddEdit_PlanMaster },
  { path: "/masters-planmaster", component: pageList_PlanMaster },
  { path: "/edit-planmaster/:id", component: pageAddEdit_PlanMaster },



    
  { path: "/add-rechargeapi", component: pageAddEdit_RechargeAPI },
  { path: "/masters-rechargeapi", component: pageList_RechargeAPI },
  { path: "/edit-rechargeapi/:id", component: pageAddEdit_RechargeAPI },


  { path: "/add-rechargeoperator", component: pageAddEdit_RechargeOperator },
  { path: "/masters-rechargeoperator", component: pageList_RechargeOperator },
  { path: "/edit-rechargeoperator/:id", component: pageAddEdit_RechargeOperator },


  
  // { path: "/add-shiftmaster", component: pageAddEdit_ShiftMaster },
  // { path: "/editemp-shiftmaster", component: pageAddEdit_EditShift },
  // { path: "/edit-shiftmaster", component: pageAddEdit_ShiftMaster },
  
  { path: "/add-customermaster", component: pageAddEdit_CustomerMaster },

  { path: "/accountstatement", component: pageList_AccountStatement },
  
  { path: "/audit-attendance", component: pageList_AuditAtt },


  { path: "/managevoucher", component: pageAddEdit_Voucher },

  { path: "/edit-managevoucher/:id", component: pageAddEdit_Voucher },

  
  { path: "/edit-customermaster/:id", component: pageAddEdit_CustomerMaster },



  { path: "/add-membermaster", component: pageAddEdit_MemberMaster },
  { path: "/edit-membermaster/:id", component: pageAddEdit_MemberMaster },
  { path: "/profile/:id", component: pageAddEdit_MemberMaster },
  { path: "/masters-membermaster", component: pageList_MemberMaster },


  


  //
  { path: "/add-ledgermaster", component: pageAddEdit_LedgerMaster },
  { path: "/edit-ledgermaster/:id", component: pageAddEdit_LedgerMaster },
  { path: "/masters-ledgermaster", component: pageList_LedgerMaster },

   //
   
   { path: "/masters-bankmaster", component: pageList_BankMaster },
   { path: "/add-bankmaster", component: pageAddEdit_BankMaster },
   { path: "/edit-bankmaster/:id", component: pageAddEdit_BankMaster },
 

  


  { path: "/listtest", component: pageList_Test },



  { path: "/ifscswap", component: pageList_IFSCSwap },
  { path: "/edit-ifscswap/:id", component: pageAddEdit_IFSCSwapMaster },
 


  
  { path: "/add-companymaster", component: pageAddEdit_CompanyMaster },
  { path: "/edit-companymaster/:id", component: pageAddEdit_CompanyMaster },

  //
  { path: "/add-plan", component: pageAddEdit_PlanAdd },
  
  { path: "/transactioncodemaster", component: pageList_TransactionStatusCode },
  { path: "/edit-transactioncodemaster/:id", component: pageAddEdit_TransactionCodeMaster },
  

//Global Options
  { path: "/GlobalOptions", component: pageAddEdit_GlobalOptions },


  //Reports
  { path: "/daywiseatt", component: pageList_DayWiseAtt },


  { path: "/aeps", component: pageAddEdit_AEPS },


];

const publicRoutes = [
  { path: "/logout", component: Logout },
  //{ path: "/login", component: Login },
  { path: "/login", component: UserDashboard },
  //{ path: "/redbus", component: redbus },
 { path: "/otp", component: OTP },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/funding/:id", component: Funding },
  { path: "/register", component: Register },
  { path: "/NMR/verification_new", component: pageAddEdit_IndoKYC },
  { path: "/userdashboard", component: UserDashboard },
  { path: "/campaign", component: Campaign },
  { path: "/aboutus", component: AboutUs },
  { path: "/buseslist/:from/:to/:date", component: BusesList },
  
  { path: "/passengerdetails", component: PassengerDetails },
  { path: "/bookingdetails/:id", component: BookingDetails },
  { path: "/privacypolicy", component: Privacy },
  { path: "/deleteionrequest.html", component: DeletionRequest },
  { path: "/termsandconditions", component: TermsAndConditions },
];

export { authProtectedRoutes, publicRoutes };
