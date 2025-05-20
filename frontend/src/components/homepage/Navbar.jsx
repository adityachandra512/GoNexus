import { motion } from 'framer-motion'
import { useState } from 'react'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle navbar background change on scroll
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`fixed w-full ${isScrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-transparent'} transition-all duration-300 z-50`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center space-x-2"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GoNexus
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Destinations', 'About', 'Contact'].map((item) => (
              <motion.a
                key={item}
                whileHover={{ scale: 1.1, y: -2 }}
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-blue-600 font-medium transition-colors duration-200`}
                href="#"
              >
                {item}
              </motion.a>
            ))}
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                onClick={() => window.location.href = '/login'}
              >
                Login
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => window.location.href = '/signup'}
              >
                Sign Up
              </motion.button>
            </div>
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-gray-600 hover:text-blue-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar