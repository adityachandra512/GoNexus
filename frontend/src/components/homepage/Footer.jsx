import { motion } from 'framer-motion'

const Footer = () => {
  const footerSections = {
    Programs: ['Corporate', 'Family', 'Solo'],
    Service: ['Flights', 'Trains', 'Buses', 'Cabs', 'Hospitals', 'Restaurants'],
    Contact: ['Home', 'About', 'Contact']
  }

  const socialIcons = [
    { icon: '📱', link: '#', label: 'WhatsApp' },
    { icon: '▶️', link: '#', label: 'YouTube' },
    { icon: '📸', link: '#', label: 'Instagram' },
    { icon: '👥', link: '#', label: 'Facebook' },
    { icon: '💼', link: '#', label: 'LinkedIn' },
    { icon: '🐦', link: '#', label: 'Twitter' }
  ]

  return (
    <footer className="bg-[#020B2D] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Programs, Service, Contact Sections */}
          {Object.entries(footerSections).map(([title, items], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <motion.li
                    key={item}
                    whileHover={{ x: 5 }}
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Email Address"
                className="px-4 py-2 rounded bg-white text-gray-800"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#E67E22] text-white px-4 py-2 rounded hover:bg-[#D35400]"
              >
                Subscribe
              </motion.button>
            </div>

            {/* Social Media Icons */}
            <div className="mt-6 flex space-x-4">
              {socialIcons.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.link}
                  whileHover={{ scale: 1.2 }}
                  className="text-2xl"
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Contact Information */}
            <div className="mt-4 text-sm text-gray-300">
              <p>Mobile: +91 7852474250</p>
              <p>Email: contact@gonexus.com</p>
            </div>
          </motion.div>
        </div>

        {/* Copyright Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm"
        >
          <p>© 2024 GoNexus. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-white">Terms & Conditions</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Dinning & Traveling Policy</a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
