import React ,{useState , useRef} from "react";
import TableRowsPly from "./TableRowsPly";
function AddDeleteTableRowsPly({  data , add , edit , Ledger, del}){



    const [rowsData, setRowsData] = useState([]);
  
  
   const deleteTableRows = (index)=>{
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(rows);
   }


   
 
    return(
        <div className="table-responsive">
                <table className="" style={{"padding": "0" , "marginBottom" : "10px"}}>
                    <thead>
                      <tr>
                      <th>Cr Ledger</th>
                            <th>Dr Ledger</th>  
                            <th>Amount</th>  
                            <th> <button   type="button" className="btn btn-outline-success" onClick={add} >+</button></th>    
                      </tr>
                    </thead>
                    <tbody>
                   <TableRowsPly rowsData={data}   add ={add} Ledger={Ledger}  edit={edit} del={del}/>
                   </tbody> 
                </table>
              
        </div>
    )
}
export default AddDeleteTableRowsPly