import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Search, ChevronRight } from 'lucide-react';
import ImageCarousel from './ImageCarousel';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchDestination, setSearchDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Define background images
  const images = ['destination1.jpg', 'destination2.jpg', 'destination3.jpg', 'destination4.jpg'];

  // Image carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Search countries by name
  useEffect(() => {
    const searchCountries = async () => {
      if (searchDestination.length >= 3) {
        setIsLoading(true);
        try {
          const response = await fetch(`https://restcountries.com/v3.1/name/${searchDestination}`);
          if (response.ok) {
            const data = await response.json();
            const countryDetails = data.map(country => ({
              name: country.name.common,
              capital: country.capital?.[0] || 'N/A',
              region: country.region,
              subregion: country.subregion,
              flag: country.flag
            }));
            setSuggestions(countryDetails);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error('Error searching countries:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(searchCountries, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchDestination]);

  const handleSuggestionClick = (country) => {
    setSearchDestination(country.name);
    setShowSuggestions(false);
  };

  // Add fade-in animation variant
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image Carousel with Overlay */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentImageIndex === index ? 1 : 0 
            }}
            transition={{ duration: 1.5 }}
          >
            <ImageCarousel image={image} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>
          </motion.div>
        ))}
      </div>
      
      {/* Content Section */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-8">
        <motion.div
          className="max-w-5xl mx-auto text-center text-white"
          initial="initial"
          animate="animate"
          variants={{
            initial: {},
            animate: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {/* Main Heading with Text Effect */}
          <motion.div
            variants={fadeIn}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="block">Discover Your</span>
              <motion.span 
                className="block bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
                animate={{ 
                  backgroundPosition: ['0% center', '100% center'],
                }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 6,
                }}
              >
                Perfect Journey
              </motion.span>
            </h1>
          </motion.div>
          
          {/* Tagline */}
          <motion.p
            variants={fadeIn}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto"
          >
            AI-powered travel planning that understands your preferences
            and creates personalized itineraries in seconds
          </motion.p>
          
          {/* Search Box */}
          <motion.div
            variants={fadeIn}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-xl max-w-3xl mx-auto w-full mb-8 border border-white/20"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-3 text-gray-300" size={20} />
                {isLoading && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="w-full py-3 pl-10 pr-4 bg-white/20 rounded-lg focus:outline-none text-white placeholder:text-gray-300"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  onFocus={() => searchDestination.length >= 3 && setShowSuggestions(true)}
                />
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto"
                  >
                    {suggestions.map((country, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.8)' }}
                        className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-none"
                        onClick={() => handleSuggestionClick(country)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{country.flag} {country.name}</div>
                            <div className="text-sm text-gray-500">{country.capital}, {country.region}</div>
                          </div>
                          <ChevronRight className="text-gray-400" size={16} />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
              <div className="relative md:w-40">
                <Calendar className="absolute left-3 top-3 text-gray-300" size={20} />
                <select className="w-full py-3 pl-10 pr-4 bg-white/20 rounded-lg focus:outline-none text-black appearance-none">
                  <option>Duration</option>
                  <option>Weekend</option>
                  <option>1 Week</option>
                  <option>2 Weeks</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-6 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
              >
                <Search size={20} />
                <span>Explore</span>
              </motion.button>
            </div>
          </motion.div>
          
          {/* Call to Action Buttons */}
          <motion.div
            variants={fadeIn}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#4338ca' }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2"
            >
              Start Planning
              <ChevronRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-3 px-8 rounded-lg"
            >
              View Destinations
            </motion.button>
          </motion.div>
          
          {/* Popular Destinations Tags */}
          <motion.div 
            variants={fadeIn}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-8"
          >
            <p className="text-gray-300 mb-3">Popular Destinations:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Bali', 'Tokyo', 'Paris', 'New York', 'Santorini'].map((destination, index) => (
                <motion.span
                  key={destination}
                  className="bg-white/20 hover:bg-white/30 cursor-pointer px-4 py-1.5 rounded-full text-sm backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 1.2 + (index * 0.1) } 
                  }}
                >
                  {destination}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Background Effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      />
    </div>
  );
};

export default Hero;