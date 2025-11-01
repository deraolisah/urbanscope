import React from 'react'

const Newsletter = () => {
  return (
    <div className="bg-dark py-12 px-4 md:px-10">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl text-light font-bold">Stay Updated on New Properties</h3>
        <p className="text-gray-300 text-sm mb-6">Get the latest listings and market insights delivered to your inbox</p>
        <div className="flex max-w-lg mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="input-field text-light rounded-l-sm border-r-0 focus:border-light"
          />
          <button className="btn-secondary rounded-none rounded-r-sm hover:bg-light">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
}

export default Newsletter;