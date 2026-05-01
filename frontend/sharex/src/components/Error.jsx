import React from 'react'

function Error() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
    <div className="flex flex-col items-center gap-4 bg-zinc-800/80 p-10 rounded-2xl border border-zinc-700">
      <h1 className='text-4xl text-center font-bold text-white'>The server is taking a nap! 😴</h1> 
      <h3 className='text-zinc-400'>Please refresh the page in a moment.</h3>
    </div>
    </div>
  )
}

export default Error