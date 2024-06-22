import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

const Links = (props) => {

  
let state = (props.makeActive == props.name);
let cN = "navLink";
let active = "active-nav-link";

  return (
    
    <Link to={props.name == "Overview" ? "/" : "/"  +props.name}  className= {state? (cN+ " " + active) : cN} >

      <figure style={{backgroundImage: props.img}}></figure>
      <h1>{props.name} </h1> 
      
      <span></span>

    </Link>


  )
}

export default Links

