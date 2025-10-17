import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Package, Calendar, User, CheckCircle } from 'lucide-react';

const EquipmentDetails = () => {
  return (
    <>
      <Helmet>
        <title>Equipment Details - Sports Equipment Management System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <Package className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Basketball
                </h1>
                <p className="text-gray-600">Sports Equipment</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Equipment Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">Basketball</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium text-success-600">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">Sports Complex</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition:</span>
                    <span className="font-medium">Good</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Borrowing Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Duration:</span>
                    <span className="font-medium">7 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Status:</span>
                    <span className="badge badge-success">Available</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="btn btn-primary">
                <CheckCircle className="w-5 h-5 mr-2" />
                Request Equipment
              </button>
              <button className="btn btn-outline">
                <Calendar className="w-5 h-5 mr-2" />
                View Schedule
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EquipmentDetails; 