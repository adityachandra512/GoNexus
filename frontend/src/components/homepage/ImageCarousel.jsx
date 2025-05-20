import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const ImageCarousel = () => {
  const images = [
    '/images/destination1.jpg',
    '/images/destination2.jpg',
    '/images/destination3.jpg',
    '/images/destination4.jpg',
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden"> {/* Changed from h-screen to h-[90vh] */}
      <AnimatePresence mode='wait'>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Travel destination ${currentIndex + 1}`}
          className="absolute w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      </AnimatePresence>
    </div>
  )
}

export default ImageCarousel