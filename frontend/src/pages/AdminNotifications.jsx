import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Bell, CheckCircle } from 'lucide-react';

const AdminNotifications = () => {
  return (
    <>
      <Helmet>
        <title>Admin Notifications - Sports Equipment Management System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Notifications
            </h1>
            <p className="text-gray-600">
              View and manage system notifications
            </p>
          </motion.div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item * 0.1 }}
                className="card p-6 flex items-center gap-4"
              >
                <Bell className="w-8 h-8 text-primary-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Notification {item}
                  </h3>
                  <p className="text-sm text-gray-600">
                    New equipment added to the catalog
                  </p>
                </div>
                <button className="btn btn-success btn-sm ml-auto">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark as Read
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNotifications; 