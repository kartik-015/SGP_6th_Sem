import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Shield, 
  Users, 
  Package, 
  Clock, 
  CheckCircle, 
  Smartphone,
  QrCode,
  Bell,
  ArrowRight,
  Play
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure ID Verification",
      description: "Scan your student ID card for instant verification and secure access to equipment."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "OTP Authentication",
      description: "Two-factor authentication via SMS ensures your account security."
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Equipment Catalog",
      description: "Browse through a comprehensive catalog of sports equipment with real-time availability."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Requests",
      description: "Submit equipment requests instantly and track their status in real-time."
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Smart Notifications",
      description: "Get notified about new equipment, request updates, and important announcements."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Admin Management",
      description: "Comprehensive admin panel for managing equipment, requests, and student accounts."
    }
  ];

  const stats = [
    { number: "500+", label: "Equipment Items" },
    { number: "1000+", label: "Active Students" },
    { number: "50+", label: "Sports Categories" },
    { number: "24/7", label: "System Availability" }
  ];

  return (
    <>
      <Helmet>
        <title>Sports Equipment Management System - University Sports Equipment Platform</title>
        <meta name="description" content="Modern sports equipment management system for universities. Scan ID cards, verify with OTP, and manage equipment borrowing efficiently." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Navigation */}
        <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">SportsEquip</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <Link
                  to="/login/student"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  to="/login/admin"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Admin Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              >
                <span className="text-gradient">Sports Equipment</span>
                <br />
                Management System
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              >
                Streamline your university's sports equipment management with our modern platform. 
                Scan ID cards, verify with OTP, and manage equipment borrowing efficiently.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg group"
                >
                  Start Using Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button className="btn btn-outline btn-lg group">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </motion.div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20"
          />
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-40 right-20 w-16 h-16 bg-secondary-200 rounded-full opacity-20"
          />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our comprehensive solution provides everything you need for efficient sports equipment management.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover-lift p-6"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center text-white"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-primary-100">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Ready to Get Started?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 mb-8"
            >
              Join thousands of students and administrators who trust our platform for sports equipment management.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/register"
                className="btn btn-primary btn-lg"
              >
                Register Now
              </Link>
              
              <Link
                to="/login/student"
                className="btn btn-outline btn-lg"
              >
                Student Login
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">SportsEquip</span>
                </div>
                <p className="text-gray-400">
                  Modern sports equipment management for universities.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">For Students</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                  <li><Link to="/login/student" className="hover:text-white transition-colors">Login</Link></li>
                  <li><Link to="/equipment" className="hover:text-white transition-colors">Browse Equipment</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">For Admins</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/login/admin" className="hover:text-white transition-colors">Admin Login</Link></li>
                  <li><Link to="/admin" className="hover:text-white transition-colors">Dashboard</Link></li>
                  <li><Link to="/admin/equipment" className="hover:text-white transition-colors">Manage Equipment</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Sports Equipment Management System. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage; 