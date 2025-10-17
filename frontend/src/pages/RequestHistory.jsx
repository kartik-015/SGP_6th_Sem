import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';

const RequestHistory = () => {
  return (
    <>
      <Helmet>
        <title>Request History - Sports Equipment Management System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Request History
            </h1>
            <p className="text-gray-600">
              View your equipment request history
            </p>
          </motion.div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="w-8 h-8 text-primary-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Equipment Request #{item}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Basketball • 3 days • Sports Complex
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {item % 3 === 0 ? (
                      <span className="badge badge-warning">Pending</span>
                    ) : item % 3 === 1 ? (
                      <span className="badge badge-success">Approved</span>
                    ) : (
                      <span className="badge badge-error">Rejected</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestHistory; 