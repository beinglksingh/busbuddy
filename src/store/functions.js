import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
//Constants
import {API_WEB_URLS} from '../constants/constAPI';
import { API_HELPER } from 'helpers/ApiHelper';
import * as base_acTypes from './actionTypes';
import * as XLSX from 'xlsx';
import { get } from 'lodash';
import { callGet_Data } from './common-actions';
/** Common Functions **/
//Change state value
export const Fn_ChangeStateValue = (obj, name, value, ruru) => {
    if (ruru  ==  'Plan'){
        obj.setState({ [name]: value }, () => {
            // After updating the state, call filterarray to apply the filter
            obj.filterarray();
          });
    }
    else {
    obj.setState({[name]: value});
    }
};

export const Fn_FillListData = (obj,gridName,apiURL) => {
    var otpValue = generateOTP(6);
    const request = {
        apiURL: apiURL,
        callback: (response) => {
            if (response && response.status === 200 && response.data) {

                
                obj.setState({
                    [gridName]: response.data.dataList,
                    isProgress : false
                })

                if (gridName == "SenderId"){
                    if (response.data.dataList[0].Id> 0){
                        obj.setState({
                            isRegistered: true

                          })

                          Fn_FillListData(obj, "gridData", API_WEB_URLS.MASTER + "/0/token/BeneficiaryMaster/Id/"+response.data.dataList[0].Id);
                    }
                    else {
                        obj.setState(prevState => ({
                            modal_backdrop: !prevState.modal_backdrop,
                            OtpVal  : otpValue
                          }))
                          document.body.classList.add("no_padding");

                          let vformData = new FormData();

                          vformData.append("F_AccountUsage", 2);
                          let GetUrl = function() {
                            return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"GetSMSUrl/0/token" , vformData).then(token => { return token } )
                          }

                          let userToken = GetUrl();
                          userToken.then(function(result) {
                            var url =result.data.response[0].Url;
                            var to =  obj.state.MobileNo;

                            url = url.replace("{to}", to);
                            url = url.replace("{otp}", otpValue);

                            let SendOtp = function() {
                              return API_HELPER.apiGET_OTP(url).then(token => { return token } )
                            }

                            let res  = SendOtp();
                          })

                           // alert("Sender Not registered!")
                    }
                }
                else if (gridName == "MainData"){
                    obj.filterarray();


                    obj.setState({
                        rows : [Object.keys(response.data.dataList[0])]
                    })
                }
                else if (gridName == "DefaultScheme"){
                    obj.getinterest(response.data.dataList[0].LoanScheme)
                }

                

            } else {
                showToastWithCloseButton("error", "Some error occurred while displaying grid data");
            }

        },
    };
    obj.props.callFill_GridData(request);
    obj.setState({loading: false});
};





function generateOTP(length) {
    var digits = '0123456789';
    var OTP = '';
    for (var i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }


export const Fn_CheckBalance = async(obj, id) => {

    if(id>0){
    const formData = new FormData();
    formData.append('F_LedgerMaster', id);


    let AuthUser2 = function() {
        return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"GetBalance/0/token" , formData).then(token => { return token } )
      }
      let userToken2 = await AuthUser2();
      obj.setState({Balance : userToken2.data.response[0].Balance, isloading : false})

    //   
    //   sessionStorage.setItem("Balance",userToken2.data.response[0].Balance);

    }
};


export const Fn_CheckIsActive = (obj, id) => {
    const request = {
        apiURL: "Masters/0/token/CheckIsActive/Id/"+id,
        callback: (response) => {
            if (response && response.status === 200 && response.data) {
                if(response.data.dataList[0].IsActive  == false)
                obj.props.history.push(`/logout`, {});
            } else {
                showToastWithCloseButton("error", "Some error occurred while displaying grid data");
            }
        },
    };
    obj.props.callFill_GridData(request);

};


export const Fn_CheckIsAEPSAuth = (obj, id) => {
    const request = {
        apiURL: "Masters/0/token/CheckAEPSAuth/Id/"+id,
        callback: (response) => {
            if (response && response.status === 200 && response.data) {
                obj.setState({
                    IsAEPSAut : !response.data.dataList[0].IsAEPSAut,
                    RetailerAadhaarNo : response.data.dataList[0].AadhaarNo,
                    RetailerName : response.data.dataList[0].Name,
                    RetailerFullAadhaarNo : response.data.dataList[0].FullAadhaar,
                    RetailerMobileNo : response.data.dataList[0].AEPSMobileNo
                })
            } else {
                showToastWithCloseButton("error", "Some error occurred while displaying grid data");
            }
        },
    };
    obj.props.callFill_GridData(request);

};

export const Fn_CheckIsAEPSAuth2 = (obj, id) => {
    return new Promise((resolve, reject) => {
        const request = {
            apiURL: "Masters/0/token/CheckAEPSAuth/Id/" + id,
            callback: (response) => {
                if (response && response.status === 200 && response.data) {
                    obj.setState({
                        IsAEPSAut: !response.data.dataList[0].IsAEPSAut,
                        RetailerAadhaarNo: response.data.dataList[0].AadhaarNo,
                        RetailerName: response.data.dataList[0].Name,
                        RetailerFullAadhaarNo: response.data.dataList[0].FullAadhaar,
                        RetailerMobileNo: response.data.dataList[0].AEPSMobileNo
                    });
                    resolve(response.data); // Resolve with the data if successful
                } else {
                    showToastWithCloseButton("error", "Some error occurred while displaying grid data");
                    reject(new Error("Error in response")); // Reject the promise on error
                }
            },
        };
        obj.props.callFill_GridData(request);
    });
};


export const Fn_GetReportForExcel = async (obj, data, apiURL, gridName, isMultiPart = false, id) => {
    return new Promise((resolve, reject) => {
        const { arguList } = data;
        const request = {
            arguList: arguList,
            apiURL: apiURL,
            callback: (response) => {
                if (response && response.status === 200 && response.data) {
                    if (gridName === "excelall") {
                        try {
                                const filename = 'AccountStatement' + id;
                            const worksheet = XLSX.utils.json_to_sheet(response.data.response);
                            const workbook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workbook, worksheet, 'AccountStatement' + id);
                            XLSX.writeFile(workbook, `${filename}.xlsx`);
                            resolve(response.data.data);
                           
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        obj.setState({
                            [gridName]: response.data.response,
                            isProgress: false,
                            loadings: false
                        });
                        resolve(response.data.response);
                    }
                } else {
                    showToastWithCloseButton("error", "Some error occurred.");
                    reject(new Error("Some error occurred."));
                }
            },
        };

        obj.props.callAdd_Data_Multipart(request);
        obj.setState({ loading: false });
    });
};

export const Fn_GetReport = (obj,data,apiURL,gridName,isMultiPart=false, id) => {
    const { arguList } = data;
    const request = {
        arguList: arguList,
        apiURL: apiURL,
        callback: (response) => {
            if (response && response.status === 200 && response.data) {

                if(apiURL  ==  "NMRGetStaticdata/0/token"){

                    obj.setState({
                        [gridName]: response.data.data,
                        isProgress : false
                    })

                }
                else if (apiURL  == "NMRBankBranchList/0/token"){


                    const groupedArray = [...new Set(response.data.data.map(item => item.bankName))].map(bankName => {
                        const stateObj = response.data.data.find(item => item.bankName === bankName);
                        return { name: stateObj.bankName, value : stateObj.bankName  };
                      });


                    obj.setState({
                        bankData : groupedArray,
                        [gridName]: response.data.data,
                        isProgress : false
                    })
                }

                else if (apiURL  == "NMRGetStateDistrict/0/token"){

                    const groupedArray = [...new Set(response.data.data.map(item => item.stateCode))].map(stateCode => {
                        const stateObj = response.data.data.find(item => item.stateCode === stateCode);
                        return { name: stateObj.state, value : stateObj.stateCode  };
                      });


                    obj.setState({
                        [gridName]: response.data.data,
                        state   : groupedArray,
                        isProgress : false
                    })
                }

                else if (apiURL  == "GetOfflineDMRList/0/token" || apiURL == "TDSReportForAdmin/0/token" || apiURL == "TopRetailer/0/token"){



                    obj.setState({
                        [gridName]: response.data.response,
                        rows : [Object.keys(response.data.response[0])],
                        isProgress : false
                    })
                }

                else if (apiURL  == "UpdateAccountNo/0/token" ){

                        if (response.data.response[0].Id > 0){

                    obj.setState({
                        [gridName]: response.data.response,
                        isProgress : false
                    })
                }

                else {
                    obj.setState({
                        isProgress : false
                    })

                    alert('Account No can not be completely different')

                }
                }


               else if (gridName  ==  "excelall"){
                    const filename  =  'AccountStatement'+id;
                    const worksheet =  XLSX.utils.json_to_sheet(response.data.data);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'AccountStatement'+id);
                    XLSX.writeFile(workbook, `${filename}.xlsx`);
                }


                else {
                obj.setState({
                        [gridName]: response.data.response,
                        isProgress : false,
                        loadings : false
                    })
                }


            } else {
                showToastWithCloseButton("error", "Some error occurred.");
            }
        },
    };
    obj.props.callAdd_Data_Multipart(request);
    obj.setState({loading: false});

};




export const Fn_ExportExcel = (obj,data,apiURL,filename,isMultiPart=false) => {
    const { arguList } = data;
    const request = {
        arguList: arguList,
        apiURL: apiURL,
        callback: (response) => {
            if (response && response.status === 200 && response.data) {

                // const filename  =  filename;

                if (filename == "Kotak Export"){
                    const worksheet = XLSX.utils.json_to_sheet(response.data.response, { skipHeader: true });
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                    XLSX.writeFile(workbook, `${filename}.xlsx`);
                }
                else {
                const worksheet = XLSX.utils.json_to_sheet(response.data.response);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                XLSX.writeFile(workbook, `${filename}.xlsx`);
                }


            } else {
                showToastWithCloseButton("error", "Some error occurred.");
            }
        },
    };
    obj.props.callAdd_Data_Multipart(request);
    obj.setState({loading: false});

};



export const Fn_DisplayDataNew = async (obj, id, apiURL, ii) => {
    return new Promise((resolve, reject) => {
        const request = {
            id: id,
            apiURL: apiURL,
            callback: (response) => {
                if (response && response.status === 200 && response.data) {
                    obj.setState({
                        formData: response.data.dataList[0],
                    });

                    // Other conditional logic remains the same (not rewritten per your request)
                    
                } else {
                    showToastWithCloseButton("error", "Some error occurred while displaying data");
                }
                resolve(response); // Resolve the promise with the response
            },
        };

        obj.props.callGet_Data(request);
        obj.setState({ loading: false });
    });
};



export const Fn_DisplayData = (obj,id,apiURL, ii) => {
    const request = {
        id:id,
        apiURL: apiURL,
        callback: (response) => {
            if (response && response.status === 200 && response.data) {
                obj.setState({
                    formData: response.data.dataList[0]
                })

                if(apiURL===API_WEB_URLS.BALANCEEDITDATA)
                {
                    //Fill Ledger drop down

                        Fn_FillListData(obj,'ledgermaster',API_WEB_URLS.MASTER + "/0/token/LedgerMaster/F_LedgerGroupMaster/"+response.data.dataList[0].F_LedgerGroupMaster);
                        obj.setState({
                            switch9: response.data.dataList[0].IsType
                        })

                        if (response.data.dataList[0].F_UserType == 4){
                            Fn_FillListData(obj, "retailer", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/4");
                            obj.setState({ isRetailer: true });
                          }

                          //Distributor
                          if (response.data.dataList[0].F_UserType == 3){
                            Fn_FillListData(obj, "distributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/3");
                            obj.setState({ isDistributor: true });
                          }

                            //SuperDistributor
                            if (response.data.dataList[0].F_UserType == 2){
                              Fn_FillListData(obj, "superdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/2");
                              obj.setState({ isSDistributor: true });
                            }


                            if (response.data.dataList[0].F_UserType == 1){
                              Fn_FillListData(obj, "masterdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/1");
                              obj.setState({ isMDistributor: true });
                            }

                            Fn_FillListData(obj, "selectedGroup", API_WEB_URLS.MASTER + "/0/token/SelectedUser/Id/"+response.data.dataList[0].F_MemberMaster);


                }


                else if(apiURL===API_WEB_URLS.SMSAPIEDITADD)
                {
                    obj.setState({ IsActive: response.data.dataList[0].IsActive,
                        Iswitch9 : response.data.dataList[0].IsDefault
                    });

                }
                else if (apiURL  == API_WEB_URLS.MEMBEREDITDATA){
                    if (response.data.dataList[0].F_UserType == 4){
                        Fn_FillListData(obj, "distributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/3");
                        obj.setState({ isDistributor: true });
                      }
                      else {
                        obj.setState({ isDistributor: false });
                      }
                      //Distributor
                      if (response.data.dataList[0].F_UserType == 3){
                        Fn_FillListData(obj, "superdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/2");
                        obj.setState({ isSDistributor: true });
                      }
                      else {
                        obj.setState({ isSDistributor: false });
                      }
                        //SuperDistributor
                        if (response.data.dataList[0].F_UserType == 2){
                          Fn_FillListData(obj, "masterdistributor", API_WEB_URLS.MASTER + "/0/token/MemberForUserD/F_UserType/1");
                          obj.setState({ isMDistributor: true });
                        }
                        else {
                            obj.setState({ isMDistributor: false });
                        }
                }

                else if (apiURL== "Masters/0/token/GetVoucherHDetails/Id"){

                        obj.setState({
                            TotalAmount: response.data.dataList[0].TotalAmount
                        });

                        Fn_FillListData(obj, "VoucherL", API_WEB_URLS.MASTER + "/0/token/GetVoucherLDetails/Id/"+response.data.dataList[0].Id);

                }
                else if(ii == "ledger"){
                    obj.setState({
                        F_LedgerGroupMaster: response.data.dataList[0].F_LedgerGroupMaster
                    })

                }
                else if(ii  = "global"){
                    obj.setState({
                        IsAEPS : response.data.dataList[0].IsAEPS,
                        IsDMR : response.data.dataList[0].IsDMR,
                        IsRecharge : response.data.dataList[0].IsRecharge,
                        IsIndoNepal : response.data.dataList[0].IsIndoNepal

                    });

                }


            } else {
                showToastWithCloseButton("error", "Some error occurred while displaying data");
            }
        },



    };
    obj.props.callGet_Data(request);
    obj.setState({loading: false});
};




export const Fn_AddEditAwait = async (obj, data, apiURL, pushFormName, isMultiPart = false, getid, getmsg) => {
    return new Promise((resolve, reject) => {
        const { arguList } = data;
        const request = {
            arguList: arguList,
            apiURL: apiURL,
            callback: (response) => {
                if (response && response.status === 200) {
                    try {
                        if (getid == "VoucherId") {
                            if (response.data.response[0].Id > 0) {
                                obj.setState({ success_msg: true });
                            } else {
                                obj.setState({
                                    failed: true,
                                    ReBalance: response.data.response[0].Name
                                });
                            }
                        } 
                       console.log(getid);
                      
                        if (arguList.id === 0 ) {
                            showToastWithCloseButton("success", "Data added successfully");
                        } else {
                            obj.setState({
                                [getmsg]: true,
                                success_dlg: true,
                                confirm_alert_Approve: false
                            });
                            showToastWithCloseButton("success", "Data updated successfully");
                        }
                        obj.props.history.push(pushFormName);
                        resolve(response); // Resolve the Promise with the response
                    } catch (error) {
                        reject(error); // Reject the Promise if any error occurs
                    }
                } else {
                    if (arguList.id === 0) {
                        if (getid == "BenId") {
                            obj.setState({ loading: false });
                            showToastWithCloseButton("error", "Beneficiary already exists.");
                        } else {
                            showToastWithCloseButton("error", "Some error occurred while updating data");
                        }
                    } else if (getid == "verify") {
                        if (response.status === -3) {
                            obj.setState({ insufficienfund: true });
                        } else {
                            obj.setState({
                                error_ben: true,
                                Reasonun: response.data.data.name
                            });
                        }
                    } else {
                        showToastWithCloseButton("error", "Some error occurred while updating data");
                    }
                    reject(response); // Reject the Promise with the response
                }
            }
        };

        if (arguList.id === 0) {
            if (isMultiPart) obj.props.callAdd_Data_Multipart(request);
            else obj.props.callAdd_Data(request);
        } else {
            if (isMultiPart) obj.props.callEdit_Data_Multipart(request);
            else obj.props.callEdit_Data(request);
        }
    });
};


export const Fn_AddEditData = (obj, data,apiURL,pushFormName,isMultiPart=false , getid, getmsg) => {

    const { arguList } = data;
    const request = {
        arguList: arguList,
        apiURL: apiURL,
        callback: (response) => {


            if (response && response.status === 200) {
                if (getid == "VoucherId") {

                    if (response.data.response[0].Id > 0){
                        obj.setState({
                            success_msg : true
                        })
                    }

                    else {
                        obj.setState({
                            failed : true,
                            ReBalance : response.data.response[0].Name
                        })

                    }



                }
                    if (getid == "BenId") {

                        if (response.data.data.id > 0) {

                        obj.setState({

                            success_msg_Ben : true,
                            modal_backdrop : false,
                            F_BankMaster : -1,
                            IFSC : '',
                            AccountHolderName : '',
                            AccountNo : ''

                        })

                        Fn_FillListData(obj, "gridData", API_WEB_URLS.MASTER + "/0/token/BeneficiaryMaster/Id/"+getmsg);



                        let vformData = new FormData();

                        vformData.append("F_AccountUsage", 4);
                        let GetUrl = function() {
                          return API_HELPER.apiPOST_Multipart(API_WEB_URLS.BASE+"GetSMSUrl/0/token" , vformData).then(token => { return token } )
                        }

                        let userToken = GetUrl();
                        userToken.then(function(result) {
                          var url =result.data.response[0].Url;
                          var to =  obj.state.MobileNo;
                          var name =  obj.state.AccountHolderName;
                          var accountno =  obj.state.AccountNo;
                          var ifsc  =  obj.state.IFSC;

                          url = url.replace("{to}", to);
                          url = url.replace("{name}", name);
                          url = url.replace("{accountno}", accountno);
                          url = url.replace("{ifsc}", ifsc);

                          let SendOtp = function() {
                            return API_HELPER.apiGET_OTP(url).then(token => { return token } )
                          }

                          let res  = SendOtp();
                        })
                    }

                  
                    }
                   else if (getid  ==  "SenderId"){
                    obj.setState({modal_backdrop : false});
                        Fn_FillListData(obj, "SenderId", API_WEB_URLS.MASTER + "/0/token/414/"+getmsg);
                    }


                    else if (getid  == "verify") {
                        Fn_FillListData(obj, "gridData", API_WEB_URLS.MASTER + "/0/token/BeneficiaryMaster/Id/"+getmsg);


                        obj.setState({
                            IsBenVerified : true,
                            success_verify: true,
                            AccountHolderName : response.data.data.name
                        })

                    }

                    else if (getid  ==  "VoucherL"){
                        let vformData = new FormData();
                        vformData.append("F_VoucherH", response.data.response[0].Id);
                        vformData.append("Data", JSON.stringify(getmsg));

                    Fn_AddEditData(obj, { arguList: { id: 0, formData: vformData } }, "InsertVoucherL/0/token", '#', true);
                    obj.props.history.push(pushFormName);
                   
                    }

                    else if (getid  ==  "rusu"){

                        let vformData = new FormData();
                    vformData.append("Id", 1);
                    vformData.append("FromDate", obj.state.FromDate);
                    vformData.append("ToDate",  obj.state.ToDate);

                    Fn_GetReport(obj, { arguList: { id: obj.uid, formData: vformData } }, "Recharges/0/token", "productData", true);

                        obj.setState({
                            commissionmodal: false,
                            F_RetailerComission : 0,
                            F_DistributorComission: 0,
                            F_SDistributorComission : 0,
                            F_MDistributorComission : 0,
                            F_RechargeId   : 0,
                            Charges : 0,
                            Amount : 0,
                            UTR : '',
                            F_TransactionStatusCode : 0,
                            success_dlg : true

                        })
                    }

                    else if (getid  ==  "rusudmr"){

                        let vformData = new FormData();
                    vformData.append("Id", 1);
                    vformData.append("FromDate", obj.state.FromDate);
                    vformData.append("ToDate",  obj.state.ToDate);

                    Fn_GetReport(obj, { arguList: { id: obj.uid, formData: vformData } }, "DMRTran/0/token", "productData", true);

                        obj.setState({
                            commissionmodal: false,
                            F_RetailerComission : 0,
                            F_DistributorComission: 0,
                            F_SDistributorComission : 0,
                            F_MDistributorComission : 0,
                            F_RechargeId   : 0,
                            Charges : 0,
                            Amount : 0,
                            UTR : '',
                            F_TransactionStatusCode : 0,
                            success_dlg : true

                        })
                    }

                    else if (getid == "updateutr"){
                        let vformData = new FormData();
                        vformData.append("Id", 0);
                        vformData.append("FromDate", obj.state.FromDate);
                        vformData.append("ToDate", obj.state.ToDate);

                        vformData.append("Mode", obj.state.ModeId == '' ? 0 : obj.state.ModeId);
                        vformData.append("F_MemberMaster", obj.state.F_MemberMaster == '' ? 0 : obj.state.F_MemberMaster);

                        Fn_GetReport(obj, { arguList: { id: 0, formData: vformData } }, "UTRUpdateList/0/token", "productData", true);

                        obj.setState({
                            success_dlg: true
                        })

                    }


                    else if (getid  ==  "rusuindo"){

                        let vformData = new FormData();
                    vformData.append("Id", 1);
                    vformData.append("FromDate", obj.state.FromDate);
                    vformData.append("ToDate",  obj.state.ToDate);

                    Fn_GetReport(obj, { arguList: { id: obj.uid, formData: vformData } }, "IndoNepalTran/0/token", "productData", true);

                        obj.setState({
                            commissionmodal: false,
                            F_RetailerComission : 0,
                            F_DistributorComission: 0,
                            F_SDistributorComission : 0,
                            F_MDistributorComission : 0,
                            F_RechargeId   : 0,
                            Charges : 0,
                            Amount : 0,
                            UTR : '',
                            F_TransactionStatusCode : 0,
                            success_dlg : true

                        })


                    }

                    else if (getid  ==  "aeps"){

                        let vformData = new FormData();
                    vformData.append("Id", 1);
                    vformData.append("FromDate", obj.state.FromDate);
                    vformData.append("ToDate",  obj.state.ToDate);

                    Fn_GetReport(obj, { arguList: { id: obj.uid, formData: vformData } }, "AEPSTran/0/token", "productData", true);

                        obj.setState({
                            commissionmodal: false,
                            F_RetailerComission : 0,
                            F_DistributorComission: 0,
                            F_SDistributorComission : 0,
                            F_MDistributorComission : 0,
                            F_AEPSId   : 0,
                            Charges : 0,
                            Amount : 0,
                            UTR : '',
                            F_TransactionStatusCode : 0,
                            success_dlg : true

                        })
                    }
                    else if (getid  ==  "rusufund"){

                        let vformData = new FormData();
                    vformData.append("Id", obj.state.uid);
                    vformData.append("FromDate", obj.state.FromDate);
                    vformData.append("ToDate", obj.state.ToDate);
                    vformData.append("Status", obj.state.Status == undefined ? 0 : obj.state.Status);

                    Fn_GetReport(obj, { arguList: { id: obj.state.uid, formData: vformData } }, "FundRequestTran/0/token", "productData", true);

                        obj.setState({
                            commissionmodal: false,
                            Remarks : '',
                            F_FundRequestId: 0,
                            success_dlg : true,
                            IsApproved : 0

                        })
                    }

                    else if(getid == "serid"){
                        obj.setState({Search : '', memberlist : [],  success_msg : true,
                        success_dlg: true})
                    }
                        else if(getid=="chat"){
                 Fn_FillListData(obj, "test", API_WEB_URLS.MASTER + "/0/token/GetMessages/Id/"+getmsg);
                 obj.setState({curMessage : ''})

                        }




                                    else {

                                obj.setState({
                                    kit: response.data.data.id,
                                    success_msg : true,
                                    success_dlg: true
                                })

                            }

                obj.setState({
                    [getid]: response.data.data.id,

                })


                if (arguList.id === 0) {
                    obj.setState({
                       // success_msg : true
                    })
                    showToastWithCloseButton("success", "Data added successfully");
                }

                else{
                    obj.setState({
                      [getmsg] : true,
                        success_dlg : true,
                        confirm_alert_Approve : false
                    })

                    showToastWithCloseButton("success", "Data updated successfully");
                }
                obj.props.history.push(pushFormName);
            } else {
                if (arguList.id === 0){
                    if (getid == "BenId"){

                        obj.setState({
                            loading : false,
                        })
                            showToastWithCloseButton("error", "Benfeciary already exists.");
                    }
                    else {
                    showToastWithCloseButton("error", "Some error occurred while updating datas");
                    }
                }
                else if (getid == "verify"){
                    if (response.status == -3){
                        obj.setState({insufficienfund : true});
                    }
                    else {
                obj.setState({
                    error_ben : true,
                    Reasonun : response.data.data.name
                  })
                }

                }
                else
                    showToastWithCloseButton("error", "Some error occurred while updating data");
            }
        },
    };

    if (arguList.id === 0)

        if (isMultiPart) obj.props.callAdd_Data_Multipart(request);
        else obj.props.callAdd_Data(request);
    else
        if (isMultiPart) obj.props.callEdit_Data_Multipart(request);
        else obj.props.callEdit_Data(request);


       // obj.setState({loading: false});
};







export const Fn_ChangePassword = (obj,data,apiURL,pushFormName,isMultiPart=false) => {
    const { arguList } = data;
     const request = {
        arguList: arguList,
        apiURL: apiURL,
        callback: (response) => {

            if (response.data.response[0].Id>0) {
                if (arguList.id === 0)
                    showToastWithCloseButton("success", "Password Changed Successfully");
                else
                    showToastWithCloseButton("success", "Data updated successfully");
                obj.props.history.push(pushFormName);
            } else {
                if (arguList.id === 0)
                    showToastWithCloseButton("error", "Old Password is wrong.");
                else
                    showToastWithCloseButton("error", "Some error occurred while updating data");
            }
        },
    }

    if (arguList.id === 0)

        if (isMultiPart) obj.props.callAdd_Data_Multipart(request);
        else obj.props.callAdd_Data(request);
    else
        if (isMultiPart) obj.props.callEdit_Data_Multipart(request);
        else obj.props.callEdit_Data(request);
        obj.setState({loading: false});

    };





export const Fn_TransactionWithdraw = (obj,data,apiURL,pushFormName,isMultiPart=false) => {
    const { arguList } = data;
    const request = {
        arguList: arguList,
        apiURL: apiURL,
        callback: (response) => {
            if (response && response.status === 200 && response.data) {

                if (response.data.response[0].Id == 0){
                    obj.setState({
                        unsuccess_msg : true,
                        isProgress : false
                    })
                }
                else {
                obj.setState({
                    success_msg: true,
                    isProgress : false,
                    fo : '',
                    formData : {
                        'AccountValue' : 0,
                        'membershipno' : '',
                        'MembershipTypeId' : 0,
                        'Amount' : '',

                    }

                })

            }
            } else {
                showToastWithCloseButton("error", "Some error occurred.");
            }
        },
    };
    obj.props.callAdd_Data_Multipart(request);
    obj.setState({loading: false});
};





export const Fn_UserLogin = (obj,data,apiURL,pushFormName,isMultiPart=false) => {

    const { arguList } = data;
    const request = {
        arguList: arguList,
        apiURL: apiURL,
        callback: (response) => {

            if (response && response.status === 200) {
                if (arguList.id === 0)
                    showToastWithCloseButton("success", "Logged in successfully");
                else
                    showToastWithCloseButton("success", "Logged in successfully");
                obj.props.history.push(pushFormName);
            } else {
                if (arguList.id === 0)
                    showToastWithCloseButton("error", "UserName or Password Incorrect!");
                else
                    showToastWithCloseButton("error", "UserName or Password Incorrect!");
            }
        },
    };

    if (arguList.id === 0)
        if (isMultiPart) obj.props.callAdd_Data_Multipart(request);
        else obj.props.callAdd_Data(request);
    else
        if (isMultiPart) obj.props.callEdit_Data_Multipart(request);
        else obj.props.callEdit_Data(request);
        obj.setState({loading: false});
};

export const Fn_DeleteData = (obj,id,apiURL,apiURL_Display) => {
    const request = {
        id:id,
        apiURL: apiURL,
        callback: (response) => {
            //console.log(response.status);
            if (response && response.status === 200) {
                obj.setState({
                    confirm_alert: false,
                    success_dlg: true,
                    dynamic_title: "Deleted",
                    dynamic_description: "Selected data has been deleted.",
                })
                showToastWithCloseButton("success", "Data deleted successfully");
                if(apiURL_Display)
                Fn_FillListData(obj,'gridData',apiURL_Display);
                Fn_FillListData(obj,'MainData',apiURL_Display);
            }
            else{
                obj.setState({
                    confirm_alert: false,
                    dynamic_title: "Deleted",
                    dynamic_description: "Selected data has been deleted.",
                })
                showToastWithCloseButton("error", "Some error occurred while deleting data");
            }
        },
    };
    obj.props.callDelete_Data(request);
    obj.setState({loading: false});
};

export const togglemodal = (obj,formData) => {
    obj.setState(prevState => ({
        modal: !prevState.modal,
        selectedFormData: formData ? formData : {}
    }));
}




export const toggleDeleteConfirm = (obj,formData,value) => {
    obj.setState({confirm_alert: value,
        selectedFormData: formData ? formData : {}
    });
}


export const toggleApproveConfirm = (obj,formData,value) => {
    obj.setState({confirm_alert_Approve: value,
        selectedFormData: formData ? formData : {}
    });
}

export const toggleDeleteSuccess = (obj,value) => {
    obj.setState({success_dlg: value , confirm_alert_Approve : value});
}

function showToastWithCloseButton(toastType, message) {
    toastr.options = {
        closeButton: true,
        preventDuplicates: true,
        newestOnTop: true,
        progressBar: true,
        timeOut: 2000
    }
    if (toastType == "success")
        toastr.success(message);
    else if (toastType == "error")
        toastr.error(message);
}
/***/
