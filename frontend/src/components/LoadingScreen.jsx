import React from 'react'

const LoadingScreen = ({state}) => {

  return (
    <div className='loader-container' style={(state == 1)?{visibility: 'visible'}: {}}>
        <div className='spinner'></div>
    </div>
  )
}

export default LoadingScreen