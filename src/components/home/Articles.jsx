import React from 'react'

const Articles = () => {
  return (
    <div className='container py-16'>
      <h6 className='text-sm'> Resources </h6>
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-start leading-tight capitalize mb-4 md:mb-8"> Latest articles </h2>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='flex md:flex-col w-full gap-2 pb-4 border-b border-dark/20 hover:border-dark/50'>
          <div className='w-36 md:w-full h-full md:h-38 bg-dark rounded-sm'></div>
          <div className='w-full flex flex-col gap-1 overflow-hidden'>
            <span className='w-fit px-2 p-1 rounded-xs text-[10px] bg-gray-200'> Working at UrbanScope </span>
            <h5 className='text-nowrap overflow-hidden truncate'> Building Agents at UrbanScope </h5>
            <small className='text-xs mt-4'> Oct 20, 2025 — 14 min read </small>
          </div>
        </div>

        <div className='flex md:flex-col w-full gap-2 pb-4 border-b border-dark/20 hover:border-dark/50'>
          <div className='w-36 md:w-full h-full md:h-38 bg-dark rounded-sm'></div>
          <div className='w-full flex flex-col gap-1 overflow-hidden'>
            <span className='w-fit px-2 p-1 rounded-xs text-[10px] bg-gray-200'> Case Studies </span>
            <h5 className='text-nowrap overflow-hidden truncate'> Strategic PR for VCs: Breaking Through the Noise </h5>
            <small className='text-xs mt-3'> Oct 19, 2025 — 7 min read </small>
          </div>
        </div>

        <div className='flex md:flex-col w-full gap-2 pb-4 border-b border-dark/20 hover:border-dark/50'>
          <div className='w-36 md:w-full h-full md:h-38 bg-dark rounded-sm'></div>
          <div className='w-full flex flex-col gap-1 overflow-hidden'>
            <span className='w-fit px-2 p-1 rounded-xs text-[10px] bg-gray-200'> Case Studies </span>
            <h5 className='text-nowrap overflow-hidden truncate'> From First Draft to First Close: Navigating Fund Formation with Orrick </h5>
            <small className='text-xs mt-3'> Oct 19, 2025 — 5 min read </small>
          </div>
        </div>

        <div className='flex md:flex-col w-full gap-2 pb-4 border-b border-dark/20 hover:border-dark/50'>
          <div className='w-36 md:w-full h-full md:h-38 bg-dark rounded-sm'></div>
          <div className='w-full flex flex-col gap-1 overflow-hidden'>
            <span className='w-fit px-2 p-1 rounded-xs text-[10px] bg-gray-200'> Case Studies </span>
            <h5 className='text-nowrap overflow-hidden truncate'> From BCV to solo GP: How Sarah Smith Raised Fund I on UrbanScope </h5>
            <small className='text-xs mt-3'> Oct 1, 2025 — 4 min read </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Articles;