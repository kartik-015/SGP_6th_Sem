import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { User, CheckCircle, XCircle } from 'lucide-react';

const AdminStudents = () => {
  return (
    <>
      <Helmet>
        <title>Admin Students - Sports Equipment Management System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Students
            </h1>
            <p className="text-gray-600">
              View and manage student accounts
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
                    <User className="w-8 h-8 text-primary-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Student Name {item}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ID: STU{item} • Computer Science
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-success btn-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </button>
                    <button className="btn btn-error btn-sm">
                      <XCircle className="w-4 h-4 mr-1" />
                      Deactivate
                    </button>
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

export default AdminStudents; 