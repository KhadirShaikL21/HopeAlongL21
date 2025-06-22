import React from "react";
import { motion } from "framer-motion";
import { 
  FaHandsHelping, 
  FaUsers, 
  FaGlobe, 
  FaLightbulb, 
  FaCheckCircle, 
  FaBolt,
  FaRoute,
  FaLeaf,
  FaShieldAlt,
  FaChartLine
} from "react-icons/fa";
import { IoMdRocket } from "react-icons/io";
import { GiPathDistance } from "react-icons/gi";

const AboutUs = () => {
  const teamMembers = [
    { 
      name: "Aarav Mehta", 
      role: "Co-Founder & CEO", 
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Transportation visionary with 15+ years in mobility tech"
    },
    { 
      name: "Priya Sharma", 
      role: "Head of Product", 
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "User experience expert passionate about community solutions"
    },
    { 
      name: "Raj Patel", 
      role: "Lead Engineer", 
      image: "https://randomuser.me/api/portraits/men/41.jpg",
      bio: "Full-stack developer specializing in route optimization"
    },
    { 
      name: "Neha Gupta", 
      role: "Community Manager", 
      image: "https://randomuser.me/api/portraits/women/50.jpg",
      bio: "Connector who builds trust between members"
    },
  ];

  const milestones = [
    { year: "2018", event: "Founded in Bangalore with 3 team members" },
    { year: "2019", event: "Launched first ride-sharing MVP with 100 users" },
    { year: "2020", event: "Expanded to goods delivery during pandemic" },
    { year: "2021", event: "Reached 10,000 active users nationwide" },
    { year: "2022", event: "Won National Sustainability Innovation Award" },
    { year: "2023", event: "Launched AI-powered route optimization" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 to-blue-800 py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Redefining How India Moves
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            We're building India's most trusted network for shared rides and deliveries - 
            connecting communities while reducing costs and carbon footprints.
          </motion.p>
        </div>
      </section>

      {/* Our Story - Enhanced */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Our Journey
            </motion.h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to transforming urban mobility across India
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">How It All Began</h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                In 2018, our founders noticed how many cars traveled with empty seats while 
                delivery trucks ran half-full. The idea was simple: connect people going the 
                same way and optimize delivery routes to reduce waste.
              </p>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                What started as a college project became a mission to solve India's mobility 
                challenges through technology and community. Today, we've grown into a platform 
                serving thousands daily while keeping our original values intact.
              </p>
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h4 className="font-semibold text-indigo-700 mb-2 flex items-center">
                  <IoMdRocket className="mr-2" /> Our Breakthrough Moment
                </h4>
                <p className="text-gray-700">
                  During the 2020 lockdowns, we pivoted to help transport essential goods, 
                  proving our model's resilience and earning community trust that still defines us today.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-blue-50 p-8 rounded-2xl shadow-inner border border-blue-100">
                <h4 className="text-xl font-semibold text-gray-800 mb-6 text-center">Milestones</h4>
                <div className="space-y-6">
                  {milestones.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                          {item.year}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-700">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Beliefs</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Principles that guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRoute className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Efficient Mobility</h3>
              <p className="text-gray-600">
                Optimizing every journey to reduce empty seats and idle cargo space
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sustainable Growth</h3>
              <p className="text-gray-600">
                Building solutions that benefit both people and the planet
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Trust First</h3>
              <p className="text-gray-600">
                Verified users, secure payments, and reliable service
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <GiPathDistance className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Last-Mile Focus</h3>
              <p className="text-gray-600">
                Solving the toughest part of India's logistics challenge
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-6 bg-indigo-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
              Numbers that tell our story better than words
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 p-6 rounded-xl backdrop-blur-sm"
            >
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-indigo-200">Daily Rides</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 p-6 rounded-xl backdrop-blur-sm"
            >
              <div className="text-4xl font-bold mb-2">1.2M</div>
              <div className="text-indigo-200">Tons CO₂ Saved</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 p-6 rounded-xl backdrop-blur-sm"
            >
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-indigo-200">On-Time Deliveries</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 p-6 rounded-xl backdrop-blur-sm"
            >
              <div className="text-4xl font-bold mb-2">4.8★</div>
              <div className="text-indigo-200">Average Rating</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                <FaBolt className="inline mr-3 text-yellow-500" />
                Smart Technology
              </h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Our proprietary algorithms match riders and deliveries with precision, 
                considering real-time traffic, vehicle capacity, and user preferences.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">AI-powered route optimization</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Real-time tracking and ETAs</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Secure digital payments</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Smart verification systems</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-100 p-8 rounded-2xl"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 mr-3"></div>
                    <div>
                      <div className="h-2 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="bg-indigo-50 p-4 rounded border border-indigo-100">
                  <div className="flex justify-between mb-2">
                    <div className="h-2 bg-indigo-200 rounded w-16"></div>
                    <div className="h-2 bg-indigo-200 rounded w-8"></div>
                  </div>
                  <div className="h-8 bg-white rounded border border-indigo-200 mb-2"></div>
                  <div className="h-8 bg-indigo-500 rounded"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet The Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Passionate problem-solvers dedicated to transforming mobility
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
              >
                <div className="p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-indigo-100"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Move With Us?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Indians who are redefining mobility through sharing
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/register"
              className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg shadow-md transition"
            >
              Sign Up Now
            </a>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;