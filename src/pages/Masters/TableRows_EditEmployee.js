import React  , {useRef} from "react";


function TableRowsEmployee({rowsData ,add ,   print , edit, del}) {
const iu = print;
  

const F_PrintDiscriptions = useRef([]);
const rat = useRef([]);
const adds = useRef([]);


const handleFocus = (event) => event.target.select();
const handler2 = (index ,evnt , indo) => {

   

  const rowsInput = [...rowsData];    
  if (evnt.key == 'Enter') {
  if (index == 'Rate')
  rat.current[indo].focus();
 else if (index == 'F_PrintDiscription')
 F_PrintDiscriptions.current[indo].focus();
 else if (index == 'Adds')
 adds.current[indo].focus();
    

evnt.preventDefault();
  }

};



    return(
        
        rowsData.map((data, index)=>{
            const {Id , F_PrintDiscription , Rate}= data;
            return(
                <tr key={index}>

<td> <select  style={{"width" : "200px"}} onKeyPress={(evnt)=>(handler2('Rate' ,evnt, index))} ref={(el) => (F_PrintDiscriptions.current[index] = el)}  onChange={(evnt)=>(edit(index, evnt))} value={F_PrintDiscription} name="F_PrintDiscription"   className="form-select">
<option value={0} defaultValue label={"Print Desc..."} />
                                            {printdescription
                                              ? printdescription.map(
                                                  (option, key) => (
                                                    <option key={option.Id}  value={option.Id} label={option.Name} />
                                                  )
                                                )
                                              : null}
              </select>
              </td>

<select>
    <div>
        <input  type='text' name="SearchName" id="SearchNam"></input>
    </div>
</select>
              &nbsp;
              &nbsp;
              &nbsp;
              &nbsp;
              &nbsp;
              &nbsp;



              <td><input style={{"width" : "100px"}}
                             
                             className="form-control"
                             type="text"
                             name="Rate"
                             value={Rate}
                             onFocus={handleFocus}
                             ref={(el) => (rat.current[index] = el)}
                             onKeyPress={(evnt)=>(handler2('Adds' ,evnt , index))}
                            onChange={(evnt)=>(edit(index, evnt))}
                           />
                            </td>
   

              <td>
                  <button ref={(el) => (adds.current[index] = el)} onKeyPress={(evnt)=>(handler2('F_PrintDiscription' ,evnt , index+1))} type="button" className="btn btn-outline-success" onClick={add} >+</button>
                  </td>  
                  <td>
                  <button  className="btn btn-outline-danger" type="button" onClick={()=>(del(Id ,index))}>x</button>
                  </td>  
            </tr>
            )
        })
   
    )
    
}
export default TableRowsEmployee;