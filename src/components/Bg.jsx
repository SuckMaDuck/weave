import React from 'react'

const Bg = () => {
  return (
    <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url('./images/bg16.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        opacity: "0.3",
        zIndex: 0,
        pointerEvents:"none"
       
    }}></div>
  )
}

export default Bg