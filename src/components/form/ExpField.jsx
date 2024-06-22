const ExpField = ({onRemove, id,  err}) => {

let btnStatus = "hide-exp";


function setError(key){
  return(`* ${err[key]}`);
}
    return (
      <>
       <div className= "exp-field-controller">
          <div className='input-field exp-field' >
                  <input type="text" className={err.hasOwnProperty(`FOE${id}`) ? "err":""}  name={`FOE${id}`}  />
                  <input type="number" className={err.hasOwnProperty(`YOE${id}`) ? "err":""}  min={1} max={30} name={`YOE${id}`}/>
          </div>
            <button className={(id === "og") ? btnStatus + ' exp-btn' : 'exp-btn'} form='' onClick={onRemove}>x</button>
       </div>
  
      </>
    
    )

  }

export default ExpField