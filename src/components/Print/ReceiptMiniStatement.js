import React, { Component } from 'react';



class ReceiptMiniStatement extends Component {



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

    console.log(this.props);
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
                                       cellPadding="0" cellSpacing="0" width="100%">
                                   <tbody>
                                      
                                           <td style={{ width:"10px"}} >
                                               
                                               <img id="imgcompany10" alt="AltName10" align="middle" border="0" src={require('./printlogo.png').default} style={{width:"100px"}} />
                                           </td>
                                        
                                           <td style={{padding: 0, width:"10px"}} align="center">
                                           <label style={{fontSize:"large", color:'black'}}>AePS</label><br />
                                           <label style={{}}>Mini Statement Receipt</label><br />
                                           </td>
                                       
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
                                          <h6 style={{color:'black'}}>{this.props.ShopName}</h6>
                                          <h6 style={{color:'black'}}>{this.props.AltMobileNo}</h6>
                                           <span>{this.props.Address}</span> <br></br>
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
                                           <b style={{color:'black'}}>  Customer Details: </b>
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
                                           Customer Name
                                           </td>
                                           <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                           <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="aadharcard">
                                          <b style={{color:'black'}}> {this.props.CustomerName} </b>
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
                                                     Customer Aadhar
                                                     </td>
                                                     <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                     <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="senderphoneno">
                                                     <b style={{color:'black'}}> *** **** {this.props.CustomerAadhar} </b>
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
                                                     <b style={{color:'black'}}>  Transaction Details: </b>
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
                                                     Transaction ID
                                                     </td>
                                                     <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                     <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="senderphoneno">
                                                     <b style={{color:'black'}}> {this.props.clientrefno} </b>
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
                                                     RRN
                                                     </td>
                                                     <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                     <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="senderphoneno">
                                                     <b style={{color:'black'}}> {this.props.bankrrn} </b>
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
                                                     Transaction Date & Time
                                                     </td>
                                                     <td width="16" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal"}}>:</td>
                                                     <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontWeight: "normal", fontSize: "14px"}} id="senderphoneno">
                                                     <b style={{color:'black'}}> {this.props.datetime} </b>
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
                                     <td align="left" valign="middle" colSpan="2" style={{borderCollapse: "collapse", padding: "10px 0", borderBottom: "1px solid #eaeaed", fontSize: "12px"}}>
                                         <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
                                             <tbody>
                                                 <tr>
                                                     <td width="15%" align="left" rowSpan="2" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                     <b style={{color:'black'}}>  Last 9 Transactions: </b>
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
                                               
                                             {this.props.ministatement
                                              ? this.props.ministatement.map(
                                                  (option, key) => (
                                                    
                                                 <tr key={key}>
                                                 <td width="15%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", textTransform: "capitalize"}}>
                                                 {option.date} <br></br>
                                                {option.narration}
                                                 </td>
                                                 
                                                 <td width="35%" align="left" valign="top" style={{borderCollapse: "collapse", fontSize: "14px", fontWeight: "normal"}}>
                                                 ₹{option.amount} {option.txnType}
                                                 </td>
                                             </tr>
                                                  )
                                                )
                                              : null}
                                                
                                                
 
                                             </tbody>
                                         </table>
                                     </td>
                                 </tr>
                                
                                 <tr>
                                     <td><hr /></td>
                                 </tr>
                                
                                 <tr>
                                     <td><br /></td>
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

export default ReceiptMiniStatement;