import positions from "./../../positions.json";


const ExpField = ({onRemove, id,  err}) => {


let btnStatus = "hide-exp";


function setError(key){
  return(`* ${err[key]}`);
}
    return (
      <>
       <div className= "exp-field-controller">
          <div className='input-field exp-field' >
                  <select type="text" className={err.hasOwnProperty(`FOE${id}`) ? "err foe-select":"foe-select"}  name={`FOE${id}`} >
                      <option value="">Select Field</option>
                      {positions.positions.map((v, i)=>{
                          return(<option key={i} value={v}>{v}</option>)
                      })}
                    
                  </ select >
                  <input type="number" className={err.hasOwnProperty(`YOE${id}`) ? "err":""}  min={1} max={30} name={`YOE${id}`}/>
                  
          </div>
            <button className={(id === "og") ? btnStatus + ' exp-btn' : 'exp-btn'} form='' onClick={onRemove}>x</button>
       </div>
  
      </>
    
    )

  }

export default ExpField