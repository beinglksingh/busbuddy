import React  , {useRef} from "react";


function TableRowsPly({rowsData ,add , Ledger , edit, del}) {

  
 

 


    return(
        
        rowsData.map((data, index)=>{
            const {Id ,F_LedgerMasterCr , F_LedgerMasterDr , Amount}= data;
            return(
                <tr key={index}>

<td> <select    style={{"width" : "300px"}}  onChange={(evnt)=>(edit(index, evnt))}   value={F_LedgerMasterCr} name="F_LedgerMasterCr"   className="form-select">
<option value={0} defaultValue label={"Select Credit Ledger..."} />
                                            {Ledger
                                              ? Ledger.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
              </select>
              </td>


              <td> <select    style={{"width" : "300px"}}  onChange={(evnt)=>(edit(index, evnt))}   value={F_LedgerMasterDr} name="F_LedgerMasterDr"   className="form-select">
<option value={0} defaultValue label={"Select Debit ledger.."} />
                                            {Ledger
                                              ? Ledger.map(
                                                  (option, key) => (
                                                    <option key={option.Id} value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
              </select>
              </td>


              <td> <input    style={{"width" : "200px"}}  onChange={(evnt)=>(edit(index, evnt))}   value={Amount} name="Amount"  type="number"  className="form-control"/>

       
              </td>


             
            

              

                            

           
   

              <td>
                  <button    type="button" className="btn btn-outline-success" onClick={add} >+</button>
                  </td>  
                  <td>
                  <button  className="btn btn-outline-danger" type="button" onClick={()=>(del(Id, index))}>x</button>
                  </td>  
            </tr>
            )
        })
   
    )
    
}
export default TableRowsPly;