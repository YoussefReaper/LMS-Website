import React, {useState} from 'react'
import {assets} from '../../assets/assets'

const CallToAction = () => {

  const [showUselessPanel, setShowUselessPanel] = useState(false)

  const showPopup = () => {
    setShowUselessPanel(!showUselessPanel)
  }

  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
        <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>Learn anything, anytime, anywhere</h1>
        <p className='text-gray-500 sm:text-sm'>Idk what to say here but this would be a nice layout to be added, so, act like this is useful text somehow without being dramatic.</p>
        <p className='text-sm text-gray-200'>Just don't click it</p>
        <div className='flex items-center font-medium gap-6 mt-4'>
          <button onClick={showPopup} className='px-10 py-3 rounded-md text-white bg-red-600 cursor-pointer'>Get started</button>
          <button className='flex items-center gap-2 cursor-pointer'>Learn more <img src={assets.arrow_icon} alt="arrow_icon" /></button>
        </div>
        {showUselessPanel && 
        <div className='flex flex-col items-center gap-4 w-100 h-30 bg-white-500 border-gray-500/30 rounded-lg'>
          <p>You've wasted 20 seconds reading this text which is just me applying what I learned in React, specifically (useState)</p>
        </div>}
    </div>
  )
}

export default CallToAction