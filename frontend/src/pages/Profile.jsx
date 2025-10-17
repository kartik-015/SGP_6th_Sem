import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { User } from 'lucide-react';

const Profile = () => {
  return (
    <>
      <Helmet>
        <title>Profile - Sports Equipment Management System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8"
          >
            <div className="flex items-center mb-6">
              <User className="w-12 h-12 text-primary-600 mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Profile
                </h1>
                <p className="text-gray-600">View and update your profile information</p>
              </div>
            </div>
            <div className="text-gray-500">(Profile details and update form coming soon...)</div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile; 