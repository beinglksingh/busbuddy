import React, { Component } from 'react';
import './ReceiptForm.css';


class ReceiptForm extends Component {



    handlePrint() {
        // Get a reference to the table you want to print
        const tableToPrint = document.getElementById('printTable');
      
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
        <div id="printTable1">
          <div id=":12r" className="ii gt">
            <div id=":12s" className="a3s aXjCH">
              <div style={{ margin: 0, padding: 0 }}>
                <div className="hello">
                <table style={{borderCollapse: 'collapse', margin: '0 auto', borderSpacing: 0,  padding: 0,  height: '90%!important', width: '90%!important', fontWeight: 'normal', color: '#3e4152', fontFamily: 'roboto,Arial,Helvetica,sans-serif', fontSize: '14px', lineHeight: '1.4'}}
                                   height="100%" border="0" cellPadding="0" cellSpacing="0" width="100%" id="printTable">
                                <tbody>
                                    <tr>
                                        <td style={{background: '#ffffff', padding: '16px 0'}}>
                                            <table style={{maxWidth: '600px', margin: 'auto',borderSpacing: 0, background: '#3ab74f', padding: '2px', borderRadius: '16px', overflow: 'hidden'}}
                                                   align="center" border="1" bordercolor="green" cellPadding="0" cellSpacing="0" width="100%" id='ptable'>
                                                <tbody>
                                                    <tr>
                                                        <td style={{borderCollapse: 'collapse'}}>
                                                            <table style={{margin: 'auto', borderSpacing: 0, background: 'white', borderRadius: '12px', overflow: 'hidden'}}
                                                                   align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                <tbody>
                                                                   
                                                                    <tr>
                                                                        <td style={{borderCollapse: 'collapse'}}>
                                                                            <table style={{borderSpacing: 0, borderCollapse: 'collapse'}}
                                                                                   bgcolor="#ffffff" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style={{borderCollapse: 'collapse', padding: '16px 32px'}} align='left'valign='middle'>
                                                                                            <table style={{borderSpacing: 0, borderCollapse: 'collapse'}}
                                                                                                   bgcolor="#ffffff" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td align="center" valign="middle" style={{borderCollapse: 'collapse', fontSize: '20px', fontFamily: 'cursive', fontWeight: '300'}} id="agentname">
                                                                                                        {this.props.agentName}
                                                                                                        </td>
                                                                                                        
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td align="center" valign="middle" style={{borderCollapse: 'collapse', fontSize: '15px', fontWeight: '300'}}>
                                                                                                            <label id="AgentAddress" style={{borderCollapse: 'collapse', fontSize: '12px', fontWeight: '300'}}> {this.props.agentaddress}</label>
                                                                                                            <label id="AgentCity" style={{borderCollapse: 'collapse', fontSize: '12px', fontWeight: '300'}}>{this.props.agentcity}</label> 
                                                                                                            <label id="AgentPincode" style={{borderCollapse: 'collapse', fontSize: '12px', fontWeight: '300'}}>{this.props.apentpin}</label>
                                                                                                        </td>
                                                                                                        
                                                                                                    </tr>
                                                                                                    <tr>

                                                                                                        <td align="center" valign="middle" style={{borderCollapse: 'collapse', fontSize: '12px', fontWeight: '300'}} id="agentmno">
                                                                                                        {this.props.agentno}
                                                                                                        </td>
                                                                                                        
                                                                                                    </tr>
                                                                                                   
                                                                                                    <tr>
                                                                                                        <td align="left" id="date" style={{fontSize: '14px'}}>
                                                                                                            Date: {this.props.date}
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
                                                                        <td style={{borderCollapse: 'collapse', padding: '0 16px'}}>
                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%"
                                                                                   style={{background: '#f7f9fa', padding: '16px', borderRadius: '8px', overflow: 'hidden'}}>
                                                                                <tbody>

                                                                                 
                                                                                    
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: 'collapse' , padding: '6px 0', borderBottom: '1px solid #eaeaed'}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="25%" align="left" valign="top" style={{borderCollapse: 'collapse', fontSize: '14px', textTransform: 'capitalize'}}>
                                                                                                            Txn. ID
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: 'collapse', fontWeight: 'normal'}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style={{borderCollapse: 'collapse', fontSize: '14px', fontWeight: 'normal'}} id="txnid">
                                                                                                        {this.props.transactioncode}
                                                                                                        </td>

                                                                                                      

                                                                                                        <td width="30%" align="right" valign="middle" style={{borderCollapse: 'collapse', fontSize: '14px', fontWeight: 500 }}>
                                                                                                            Amount :
                                                                                                        </td>
                                                                                                        <td align="left" valign="middle" style={{borderCollapse: 'collapse', fontSize: '14px', fontWeight: 500}} id="amo">
                                                                                                        {this.props.amount}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                   
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" style={{borderCollapse: 'collapse', padding: '6px 0', borderBottom: '1px solid #eaeaed', fontSize: '12px'}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>

                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: 'collapse', fontSize: '14px', textTransform: 'capitalize'}}>
                                                                                                            Sender Mobile
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: 'collapse', fontWeight: 'normal'}}>:</td>

                                                                                                        <td align="left" valign="top" style={{borderCollapse: 'collapse', fontWeight: 'normal', fontSize: '14px'}}  id="sendermobile">
                                                                                                        {this.props.sendermobile}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td style={{padding: 0, textAlign: 'left', borderCollapse: 'collapse'}} rowSpan="3" width="20" align="left" valign="bottom">

                                                                                            <img id="imgcompany" alt="Alt Name" className="image imgpath CToWUd" align="middle" border="0"  src={require('./printlogo.png').default} style={{width:'150px',margin: 'auto', textAlign: 'center', border: 0, outline: 'none', textDecoration: 'none', minHeight: '10px',maxHeight:'100px'}} />

                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" style={{borderCollapse: 'collapse', padding: '6px 0', borderBottom: '1px solid #eaeaed', fontSize: '12px'}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: 'collapse', fontSize: '14px', textTransform: 'capitalize'}}>
                                                                                                            Paid to
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: 'collapse',fontSize: '14px', fontWeight: 'normal'}}>:</td>
                                                                                                        <td align="left" valign="top" style={{borderCollapse: 'collapse', fontSize: '14px', fontWeight: 'normal'}} id="bname">
                                                                                                        {this.props.benname}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>

                                                                                    </tr>
                                                                                   
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" style={{borderCollapse: 'collapse', padding: '6px 0', borderBottom: '1px solid #eaeaed', fontSize: '12px'}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="35%" align="left" valign="top" style={{borderCollapse: 'collapse', fontSize: '14px', textTransform: 'capitalize'}}>
                                                                                                            Credited To
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: 'collapse', fontSize: '14px', fontWeight: 'normal'}}>:</td>

                                                                                                        <td align="left" valign="top" style={{borderCollapse: 'collapse', fontWeight: 'normal', fontSize: '12px'}}>
                                                                                                            <span style={{borderCollapse: 'collapse', fontSize: '14px', width: '100%', display: 'block'}} id="acc">
                                                                                                            {this.props.accountno}
                                                                                                            </span>
                                                                                                            <span style={{borderCollapse: 'collapse', width: '100%', fontSize: '14px', fontWeight: 'normal', display: 'none'}}>
                                                                                                                <span id="lblbankname">{this.props.bankname}</span>
                                                                                                            </span>
                                                                                                        </td>


                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>


                                                                                    </tr>
                                                                                   
                                                                                    <tr>
                                                                                        <td align="left" valign="middle" colSpan="2" style={{borderCollapse: 'collapse', padding: '10px 0', borderBottom: '1px solid #eaeaed', fontSize: '12px'}}>
                                                                                            <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width="25%" align="left" valign="top" style={{borderCollapse: 'collapse', fontSize: '14px', textTransform: 'capitalize'}}>
                                                                                                            Bank Ref. No.
                                                                                                        </td>
                                                                                                        <td width="16" align="left" valign="top" style={{borderCollapse: 'collapse', fontSize: '14px', fontWeight: 'normal'}}>
                                                                                                            :
                                                                                                        </td>
                                                                                                        <td align="left" valign="top" style={{borderCollapse: 'collapse', fontSize: '14px', fontWeight: 'normal'}} id="utr">
                                                                                                        {this.props.utr}
                                                                                                        </td>

                                                                                                        <td width="32" align="left" valign="middle" style={{borderCollapse: 'collapse'}}></td>
                                                                                                        <td align="right" valign="middle" style={{borderCollapse: 'collapse', fontSize: '14px', fontWeight: '500' }}>
                                                                                                            Txn. status :
                                                                                                        </td>

                                                                                                        <td width="13%" align="left" valign="middle" style={{borderCollapse: 'collapse', fontSize: '14px', fontWeight: '500'}}>
                                                                                                        {this.props.status}
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
                                                                        <td style={{borderCollapse: 'collapse', padding: '4px', background: '#ffffff', fontFamily: 'roboto,Arial,Helvetica,sans-serif'}}>
                                                                            <p style={{padding: 0, margin: 0, textAlign: 'center', fontSize:'14px'}}>
                                                                                This is System Generated Receipt.
                                                                            </p>
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
                            <div style={{textAlign:'center'}}>
                                <table style={{marginLeft:'auto',marginRight:'auto'}}>
                                    <tr>
                                       
                                        <td><button className="btn pull-center" id="print" style={{width:'100px'}} onClick={this.handlePrint}>Print</button></td>
                                    </tr>
                                </table>
                               
                            </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default ReceiptForm;