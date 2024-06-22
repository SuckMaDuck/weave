import React, { useEffect, useState } from 'react'
import {Bg} from "../../components/export.js" ;
import{SideMenu, Userinfo} from "../../containers/export.js";
const Overview = () => {

  

  return (
    <>
        <Bg />
        <SideMenu name="Overview" />
        <Userinfo />

      
    </>

  )
}


export default Overview