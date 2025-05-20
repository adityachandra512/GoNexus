import { useState } from 'react';import { motion } from 'framer-motion';
import { Compass, Clock, Map, Star, ArrowRight, Users } from 'lucide-react';

const Description = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    { 
      icon: Compass, 
      title: "AI-Powered Planning", 
      desc: "Our advanced AI algorithms analyze thousands of data points to create personalized travel recommendations that match your unique preferences, budget, and travel style.",
      color: "from-blue-500 to-indigo-600",
      lightColor: "bg-blue-50",
      accent: "border-blue-500"
    },
    { 
      icon: Clock, 
      title: "Smart Itineraries", 
      desc: "Automatically generate optimized daily schedules that maximize your experiences while respecting your pace. Balance sightseeing, dining, and relaxation perfectly.",
      color: "from-purple-500 to-pink-600",
      lightColor: "bg-purple-50",
      accent: "border-purple-500"
    },
    { 
      icon: Map, 
      title: "Local Insights", 
      desc: "Discover hidden gems and authentic experiences curated by locals. Go beyond tourist traps and experience destinations like a true insider with neighborhood guides.",
      color: "from-emerald-500 to-teal-600",
      lightColor: "bg-emerald-50",
      accent: "border-emerald-500"
    },
    { 
      icon: Users, 
      title: "Group Harmony", 
      desc: "Traveling with others? Our collaborative planning tools help accommodate everyone's wishes into a single satisfying itinerary that keeps the whole group happy.",
      color: "from-amber-500 to-orange-600",
      lightColor: "bg-amber-50",
      accent: "border-amber-500"
    }
  ];

  // Staggered container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  // Testimonials
  const testimonials = [
    {
      text: "GoNexus transformed our family vacation - saved hours of planning and found experiences we would've missed!",
      author: "Sarah J.",
      location: "Family trip to Japan"
    },
    {
      text: "Completely changed how I travel. The AI recommendations were spot-on for my interests in local cuisine and history.",
      author: "Marcus T.",
      location: "Solo adventure in Portugal"
    },
    {
      text: "We used GoNexus for our honeymoon and it felt like having a personal travel agent. Absolutely perfect!",
      author: "Elena & David",
      location: "Honeymoon in Bali"
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block mb-3"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium px-4 py-1.5 rounded-full">
              Revolutionary Travel Tech
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Why Travelers Choose GoNexus
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Experience travel planning reimagined with advanced AI technology that understands 
            what makes your perfect trip unique
          </motion.p>
        </motion.div>
        
        {/* Interactive Feature Showcase */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-8 items-center mb-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300" 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }} 
          viewport={{ once: true, margin: "-100px" }} 
        > 
          {/* Left side: Feature selector */} 
          <div className="lg:w-2/5"> 
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Experience the Difference</h3> 
            <div className="space-y-3"> 
              {features.map((feature, index) => ( 
                <motion.div 
                  key={index} 
                  whileHover={{ x: 5, scale: 1.02 }} 
                  onClick={() => setActiveFeature(index)} 
                  className={`cursor-pointer p-4 rounded-lg flex items-center gap-4 transition-all duration-300 ${  
                    activeFeature === index 
                      ? `bg-gradient-to-r ${feature.color} text-white shadow-md` 
                      : 'hover:bg-gray-50 hover:shadow-sm' 
                  }`} 
                > 
                  <div className={`p-2.5 rounded-full transform transition-transform duration-300 ${activeFeature === index ? 'bg-white/30 rotate-12' : `bg-gradient-to-r ${feature.color} text-white`}`}> 
                    <feature.icon size={20} /> 
                  </div> 
                  <span className="font-semibold tracking-wide">{feature.title}</span> 
                </motion.div> 
              ))} 
            </div> 
          </div> 
          
          {/* Right side: Image/visualization */} 
          <div className="lg:w-3/5 h-full"> 
            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-white rounded-xl overflow-hidden shadow-lg border border-gray-200"> 
              {features.map((feature, index) => ( 
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ 
                    opacity: activeFeature === index ? 1 : 0,
                    scale: activeFeature === index ? 1 : 0.95
                  }} 
                  transition={{ duration: 0.4 }} 
                  className="absolute inset-0 flex items-center justify-center" 
                > 
                  <div className={`absolute inset-0 bg-gradient-to-tr ${feature.color} opacity-40`}></div> 
                  <div className="absolute inset-0 flex items-center justify-center text-white backdrop-blur-sm"> 
                    <div className="text-center p-8 transform transition-transform duration-300 hover:scale-105"> 
                      <feature.icon size={56} className="mx-auto mb-5 drop-shadow-lg" /> 
                      <h4 className="text-2xl font-bold mb-3 text-shadow">{feature.title}</h4> 
                      <p className="text-white/95 max-w-md text-lg leading-relaxed">{feature.desc}</p> 
                    </div> 
                  </div> 
                </motion.div> 
              ))} 
            </div> 
          </div> 
        </motion.div>
        
        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">What Our Travelers Say</h3>
            <p className="text-gray-600">Join thousands of satisfied travelers who've transformed their journeys</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 relative"
              >
                <div className="absolute -top-4 -left-4 text-indigo-500">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.685.41-2.205.315-.53.772-.966 1.368-1.307.71-.398 1.367-.865 1.968-1.4.602-.54 1.116-1.12 1.533-1.74.418-.62.73-1.26.938-1.912.21-.652.315-1.303.315-1.954 0-.67-.128-1.274-.384-1.81-.258-.544-.603-.984-1.038-1.32-.435-.334-.938-.6-1.5-.795C10.76.29 10.166.17 9.54.17c-.75 0-1.456.12-2.12.364-.666.243-1.24.59-1.727 1.04-.485.45-.873.983-1.168 1.598-.292.614-.44 1.28-.44 2.004 0 .52.108.99.327 1.42.218.428.51.778.87 1.05.364.273.77.418 1.225.436.45.018.9-.07 1.347-.26.45-.19.83-.512 1.14-.968.31-.455.465-.975.465-1.558 0-.42-.096-.8-.288-1.15-.19-.35-.446-.623-.767-.83-.32-.21-.695-.315-1.122-.315-.237 0-.422.035-.55.103.075-.577.256-1.04.54-1.388.285-.35.656-.614 1.12-.795.464-.18.98-.27 1.55-.27.975 0 1.722.27 2.24.81.507.54.762 1.316.762 2.324v4.667c0 .353.104.66.31.92.208.262.487.468.84.62.354.15.695.226 1.023.226.596 0 1.096-.13 1.5-.393.404-.262.72-.603.948-1.025.23-.42.343-.882.343-1.384 0-.548-.1-1.05-.302-1.504-.2-.455-.485-.847-.85-1.173-.363-.324-.804-.574-1.32-.75-.518-.174-1.07-.26-1.66-.26-.624 0-1.19.102-1.693.308-.503.205-.932.48-1.287.827-.354.345-.636.74-.843 1.188-.21.446-.313.91-.313 1.388 0 .48.104.9.312 1.255.21.355.478.638.807.847.328.21.704.315 1.128.315.29 0 .562-.054.816-.16.253-.108.465-.258.637-.453.17-.194.3-.425.384-.69.086-.264.128-.54.128-.828 0-.323-.07-.6-.2-.828-.134-.23-.313-.405-.54-.527-.224-.123-.488-.184-.79-.184-.218 0-.42.028-.606.084l.288-1.5c.236.035.505.053.807.053.813 0 1.456-.26 1.928-.78.47-.52.706-1.24.706-2.158 0-.57-.1-1.08-.296-1.535-.198-.455-.48-.827-.84-1.115-.364-.287-.806-.51-1.332-.664-.526-.155-1.1-.232-1.727-.232-.597 0-1.17.07-1.72.21-.55.14-1.05.35-1.5.63-.45.28-.83.63-1.14 1.05-.31.42-.53.92-.65 1.5.288.17.53.398.726.683.196.285.293.63.293 1.03 0 .51-.147.934-.44 1.275-.295.34-.74.51-1.334.51-.38 0-.703-.09-.975-.264-.273-.176-.485-.407-.635-.7-.15-.29-.225-.614-.225-.974 0-.49.118-.933.352-1.328.234-.396.55-.728.95-.998.398-.27.86-.465 1.382-.584.523-.12 1.084-.18 1.683-.18.91 0 1.726.15 2.443.45.718.3 1.32.714 1.803 1.245.485.53.85 1.156 1.098 1.88.246.722.37 1.5.37 2.336v.15c-.048-.036-.088-.07-.122-.102-.596-.55-1.316-.828-2.163-.828-1.006 0-1.857.375-2.553 1.123-.697.75-1.045 1.805-1.045 3.165 0 .645.086 1.245.258 1.8.17.553.418 1.035.74 1.444.323.41.71.726 1.165.946.452.22.975.33 1.567.33.785 0 1.45-.22 1.998-.66.545-.44.97-.997 1.268-1.67.3-.67.444-1.387.444-2.15v-4.444z" />
                  </svg>
                </div>
                
                <div className="pt-6">
                  <p className="text-gray-700 mb-6 italic">{testimonial.text}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.author}</p>
                      <p className="text-gray-500 text-sm">{testimonial.location}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">Ready to transform your travel experience?</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg"
          >
            Start Planning Your Journey
          </motion.button>
          <p className="mt-4 text-gray-500">Join 50,000+ travelers already using GoNexus</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Description;