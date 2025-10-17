import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  Package, 
  Clock, 
  CheckCircle,
  Settings,
  Bell
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Sports Equipment Management System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage sports equipment and student requests
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <Package className="w-8 h-8 text-secondary-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Equipment Items</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-warning-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-success-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Loans</p>
                  <p className="text-2xl font-bold text-gray-900">34</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full btn btn-primary">
                    <Package className="w-5 h-5 mr-2" />
                    Manage Equipment
                  </button>
                  <button className="w-full btn btn-outline">
                    <Clock className="w-5 h-5 mr-2" />
                    Review Requests
                  </button>
                  <button className="w-full btn btn-outline">
                    <Users className="w-5 h-5 mr-2" />
                    Manage Students
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                    <Bell className="w-5 h-5 text-primary-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        New equipment request received
                      </p>
                      <p className="text-xs text-gray-600">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-success-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Equipment returned successfully
                      </p>
                      <p className="text-xs text-gray-600">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 