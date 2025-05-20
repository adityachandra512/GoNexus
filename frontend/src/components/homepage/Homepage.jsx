import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Description from './Description'
import Footer from './Footer'

const Homepage = () => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <Hero />
      <div className="relative z-10">
      <Description />
        <Footer />
      </div>
    </div>
  )
}

export default Homepage