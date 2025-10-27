import React, { Component } from 'react';
import './ReceiptForm.css';



class ReceiptNMR extends Component {



    handlePrint() {
        const tableToPrint = document.getElementById('printTable11');

        // Create a new window for printing
        const newWindow = window.open('', '_blank');
        newWindow.document.open();
        newWindow.document.write(`
          <html>
            <head>
              <title>Print Table</title>
            </head>
            <body>
              <table>${tableToPrint.innerHTML}</table>
              <script>window.print();</script>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    
      
      
      
      


  render() {
    return (
        <form id="form1">
        <div id="printTable11">
            <div id="12r" className="ii gt">
                <div id="12s" className="a3s aXjCH ">
                    <div style={{margin: 0 , padding: 0}}>
                        <div className="hello" id="Mydiv">
                            
                            <table style={{borderCollapse: "collapse", tableLayout: "fixed", margin:"0 auto", borderSpacing: 0, padding: 0, height: "90%!important", width: "90%!important", fontWeight: "normal", color: '#3e4152', fontFamily: 'roboto,Arial,Helvetica,sans-serif', fontSize: '14px', lineHeight: 1.4}}
                                   height="100%" border="0" cellPadding="0" cellSpacing="0" width="100%" >
                                <tbody>
                                    <tr>
                                        <td style={{background: '#ffffff', padding: "16px 0"}}>
                                            <table style={{maxWidth: '1200px', margin: "auto", borderSpacing: 0,  background: '#3ab74f', padding: '2px', borderRadius: "16px", overflow: "hidden"}}
                                                   align="center" border="1" bordercolor="green" cellPadding="0" cellSpacing="0" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td style={{borderCollapse : "collapse"}}>
                                                            <table style={{margin: "auto", borderSpacing: 0, background: "white", borderRadius: "12px", overflow: "hidden"}}
                                                                   align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                <tbody>
                                                                   
                                                                    <tr>
                                                                        <td style={{borderCollapse: "collapse"}}>
                                                                            <table style={{borderSpacing: 0, borderCollapse: "collapse"}}
                                                                                   bgcolor="#ffffff" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style={{borderCollapse: "collapse", padding: "16px 32px"}} align="left" valign="middle">
                                                                                            <table style={{borderSpacing: 0, borderCollapse: "collapse"}}
                                                                                                   bgcolor="#ffffff" border="1" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr >
                                                                                                        <td style={{padding: 0, width:"10px"}} align="center">
                                                                                                            
                                                                                                            <img id="imgcompany10" alt="AltName10" align="middle" border="0" src={require('./printlogo.png').default} style={{width:"100px"}} />
                                                                                                        </td>
                                                                                                        <td style={{padding: 0, textAlign: "left", borderCollapse: "collapse",width:"400px", textAlign:"center"}} align="center" valign="top">
                                                                                                            <label style={{fontSize:"large"}}>R Seva Kendra Ltd.</label><br />
                                                                                                            <label style={{fontSize:"small"}}>MAIN BHIWANDI BRANCH</label><br />
                                                                                                            <label style={{fontSize:"small"}}>BHIWANDI</label><br />
                                                                                                            <label style={{fontSize:"small"}} align="left">PHONE NO: +91 7798571577 </label><br />
                                                                                                            <label style={{fontSize:"small"}} align="right">EMAIL:ramdev.101enterprises@GMAIL.COM</label><br /><hr />
                                                                                                            <label style={{fontSize:"large"}}>PIN NO : </label><label id="pinno">{this.props.UTR}</label>
                                                                                                        </td>
                                                                                                        <td style={{padding: 0, width:"10px"}} align="center">
                                                                                                            <img id="imgcompany1" alt="AltName1" align="middle" border="0" src={require('./IndoNepalLogo.jpeg').default} style={{width:"100px"}} />
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>

                                                                   
                                                                    <tr>
                                                                        <td style={{borderCollapse: "collapse", padding: "0 16px"}}>
                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%"
                                                                                   style={{background: "#f7f9fa", padding: "16px", borderRadius: "8px", overflow: "hidden"}}>
                                                                                <tbody>
                                                                                   
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Local Time
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}} id="localtime">
                                                                                                        {this.props.LocalDate}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Collected Amount
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="collectedamount">
                                                                                                        {this.props.CollectedAmount} [INR]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", padding: "6px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Sender Name
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="sendername">
                                                                                                        {this.props.SenderName}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Service Charge
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="servicecharge">
                                                                                                        {this.props.ServiceCharge}  [INR]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", padding: "6px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Nationality
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="nationality">
                                                                                                        {this.props.SenderNationality}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}></td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                        [Including applicable Gov. Tax]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>

                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", padding: "6px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Aadhar Card
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="aadharcard">
                                                                                                        {this.props.SenderIDNumber}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Send Amount
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="sendamount">
                                                                                                        {this.props.SendAmount}   [INR]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse", padding: "10px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Phone/Mobile
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="senderphoneno">
                                                                                                        {this.props.SenderMobile}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Rate
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="rate">
                                                                                                            1.00 [INR] = 1.6 [NPR]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse", padding: "10px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" rowSpan="2" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Address
                                                                                                        </td>
                                                                                                        <td width="16" align="left" rowSpan="2" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td width="35%" align="left" valign="top" rowSpan="2" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="address">
                                                                                                        {this.props.SenderAddress}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Payout Charges
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="payoutcharges">
                                                                                                        {this.props.PayoutCharges} [NPR]
                                                                                                        </td>

                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse", padding: "10px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" rowSpan="2" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                        </td>
                                                                                                        <td width="16" align="left" rowSpan="2" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}></td>
                                                                                                        <td width="35%" align="left" valign="top" rowSpan="2" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}}>
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Payout Amount
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="payoutamount">
                                                                                                        {this.props.PayAmount} [NPR]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                 
                                                                                    <tr>
                                                                                        <td><hr /></td>
                                                                                    </tr>
                                                                                   
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Beneficiary Country
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}}>
                                                                                                            Nepal
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Mode Of Payment
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="paymentmode">
                                                                                                        {this.props.PaymentMode}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Receiver Name
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}} id="receivername">
                                                                                                        {this.props.ReceiverName}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Address
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}} id="receiveraddress">
                                                                                                        {this.props.ReceiverAddress}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Phone/Mobile
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}} id="receiverphoneno">
                                                                                                        {this.props.ReceiverMobile}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            payout Agent
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}}>
                                                                                                            Anywhere within Nepal
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    
                                                                                    <tr>
                                                                                        <td><hr /></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style={{border:"1px"}} valign="middle" align="center">
                                                                                            <label style={{fontSize:"small"}}><u>Customer Support : Prabhu Money Transfer Provate Limited  Phone:+91-11-47084942 / +91-11-47084042</u></label>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td><br /></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="50%" align="center" valign="bottom" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            <label style={{fontSize:"small", textAlign:"left"}}>Customer Sign ____________</label>
                                                                                                        </td>
                                                                                                        <td width="50%" align="center" valign="bottom" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            <label style={{fontSize:"small",textAlign:"right"}}>Counter Staff Sign ____________</label>
                                                                                                        </td>

                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>

                                                                

                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            </td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <br /><br /><br /><br />
                            <br /><br /><br /><br />
                            
                            <table style={{borderCollapse: "collapse", tableLayout: "fixed", margin: "0 auto", borderSpacing: 0, padding: 0, height: "90%!important", width: "90%!important", fontWeight: "normal", color: "#3e4152", fontFamily: "robotoArial,Helvetica,sans-serif", fontSize: "14px", lineHeight: 1.4}}
                                   height="100%" border="0" cellPadding="0" cellSpacing="0" width="100%" id="printTable">
                                <tbody>
                                    <tr>
                                        <td style={{background: "#ffffff", padding: "16px 0"}}>
                                            <table style={{maxWidth: "1200px", margin: "auto", borderSpacing: 0,  background: "#3ab74f", padding: "2px", borderRadius: "16px", overflow: "hidden"}}
                                                   align="center" border="1" bordercolor="green" cellPadding="0" cellSpacing="0" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td style={{borderCollapse: "collapse"}}>
                                                            <table style={{margin: "auto", borderSpacing: 0, background: "white", borderRadius: "12px", overflow: "hidden"}}
                                                                   align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                <tbody>
                                                                  
                                                                    <tr>
                                                                        <td style={{borderCollapse: "collapse"}}>
                                                                            <table style={{borderSpacing: 0, borderCollapse: "collapse"}}
                                                                                   bgcolor="#ffffff" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style={{borderCollapse: "collapse", padding: "16px 32px"}} align="left" valign="middle">
                                                                                            <table style={{borderSpacing: 0, borderCollapse: "collapse"}}
                                                                                                   bgcolor="#ffffff" border="1" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr >
                                                                                                        <td style={{padding: 0, width:"10px"}} align="center">
                                                                                                            <img id="imgcompany2" alt="AltName2" align="middle" border="0" src={require('./printlogo.png').default} style={{width:"100px",margin: "auto"}} />
                                                                                                        </td>
                                                                                                        <td style={{padding: 0, textAlign: "left", borderCollapse: "collapse",width:"400px", textAlign:"center"}} align="center" valign="top">
                                                                                                            <label style={{fontSize:"large"}}>R Seva Kendra Ltd.</label><br />
                                                                                                            <label style={{fontSize:"small"}}>MAIN BHIWANDI BRANCH</label><br />
                                                                                                            <label style={{fontSize:"small"}}>BHIWANDI</label><br />
                                                                                                            <label style={{fontSize:"small"}} align="left">PHONE NO: +91 7798571577 </label><br />
                                                                                                            <label style={{fontSize:"small"}} align="right">EMAIL:ramdev.101enterprises@GMAIL.COM</label><br /><hr />
                                                                                                            <label style={{fontSize:"large"}}>TRN NO : </label><label id="trnno">{this.props.TransactionId}</label>
                                                                                                        </td>
                                                                                                        <td style={{padding: 0, width:"10px"}} align="center">
                                                                                                            <img id="imgcompany3" alt="AltName3" align="middle" border="0" src={require('./IndoNepalLogo.jpeg').default} style={{width:"100px",margin: "auto"}} />
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>

                                                                  
                                                                    <tr>
                                                                        <td style={{borderCollapse: "collapse", padding: "0 16px"}}>
                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%"
                                                                                   style={{background: "#f7f9fa", padding: "16px", borderRadius: "8px", overflow: "hidden"}}>
                                                                                <tbody>
                                                                                   
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Local Time
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}} id="Olocaltime">
                                                                                                        {this.props.LocalDate}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Collected Amount
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="Ocollectedamount">
                                                                                                        {this.props.CollectedAmount} [INR]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", padding: "6px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Sender Name
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="Osendername">
                                                                                                        {this.props.SenderName}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Service Charge
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="Oservicecharge">
                                                                                                        {this.props.ServiceCharge} [INR]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", padding: "6px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Nationality
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="Onationality">
                                                                                                        {this.props.SenderNationality}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}></td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            [Including applicable Gov. Tax]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>

                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", padding: "6px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Aadhar Card
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="Oaadharcard">
                                                                                                        {this.props.SenderIDNumber}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Send Amount
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="Osendamount">
                                                                                                        {this.props.SendAmount} [INR]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse", padding: "10px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Phone/Mobile
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="Osenderphoneno">
                                                                                                        {this.props.SenderMobile}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Rate
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="rate">
                                                                                                            1.00 [INR] = 1.6 [NPR]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse", padding: "10px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" rowSpan="2" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Address
                                                                                                        </td>
                                                                                                        <td width="16" align="left" rowSpan="2" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td width="35%" align="left" valign="top" rowSpan="2" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="Oaddress">
                                                                                                        {this.props.SenderAddress}
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Payout Charges
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="Opayoutcharges">
                                                                                                        {this.props.PayoutCharges}  [NPR]
                                                                                                        </td>

                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse", padding: "10px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" rowSpan="2" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                        </td>
                                                                                                        <td width="16" align="left" rowSpan="2" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}></td>
                                                                                                        <td width="35%" align="left" valign="top" rowSpan="2" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}}>
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Payout Amount
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="Opayoutamount">
                                                                                                        {this.props.PayAmount}  [NPR]
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                   
                                                                                    <tr>
                                                                                        <td><hr /></td>
                                                                                    </tr>
                                                                                   
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Beneficiary Country
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}}>
                                                                                                            Nepal
                                                                                                        </td>

                                                                                                        <td width="20%" align="right" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}}>
                                                                                                            Mode Of Payment
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: 500}} id="Opaymentmode">
                                                                                                        {this.props.PaymentMode}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Receiver Name
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}} id="Oreceivername">
                                                                                                        {this.props.ReceiverName}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Address
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}} id="Oreceiveraddress">
                                                                                                        {this.props.ReceiverAddress}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            Phone/Mobile
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}} id="Oreceiverphoneno">
                                                                                                        {this.props.ReceiverMobile}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            payout Agent
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}}>
                                                                                                            Anywhere within Nepal
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                   
                                                                                    <tr>
                                                                                        <td><hr /></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style={{border:"1px"}} valign="middle" align="center">
                                                                                           
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td><br /></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse" , padding: "6px 0", borderBottom: "1px solid #eaeaed"}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="20%" align="center" valign="bottom" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                                                                            <label style={{fontSize:"small", textAlign:"left"}}>Customer Sign ____________</label>
                                                                                                        </td>
                                                                                                        <td width="50%" align="center" valign="bottom" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            <label style={{fontSize:"small",textAlign:"right"}}>Counter Staff Sign ____________</label>
                                                                                                        </td>
                                                                                                        <td width="40%" align="center" valign="bottom" style={{borderCollapse: "collapse", fontWeight: "normal"}}>
                                                                                                            <label style={{fontSize:"small",textAlign:"right"}}>Approved By ____________</label>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>

                                                                   

                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            </td>
                                    </tr>
                                </tbody>
                            </table>
                          


                        </div>

                        <div >
                        </div>
                        <div >
                        </div>
                    </div>

                    <div >
                    </div>

                </div>
            </div>
        </div>
        <div style={{textAlign:"center"}}>
            <table style={{marginLeft:"auto",marginRight:"auto"}}>
                <tbody>
                <tr>
                   
                    <td><button className="btn pull-center" onClick={this.handlePrint} style={{width:"100px"}} >Print</button></td>
                    
                </tr>
                </tbody>
            </table>
          
        </div>
    </form>
    );
  }
}

export default ReceiptNMR;