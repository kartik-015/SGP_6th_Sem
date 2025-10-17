import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';

const AdminEquipment = () => {
  return (
    <>
      <Helmet>
        <title>Admin Equipment - Sports Equipment Management System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Manage Equipment
                </h1>
                <p className="text-gray-600">
                  Add, edit, and manage sports equipment
                </p>
              </div>
              <button className="btn btn-primary">
                <Plus className="w-5 h-5 mr-2" />
                Add Equipment
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: item * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center mb-4">
                  <Package className="w-8 h-8 text-primary-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Equipment {item}
                    </h3>
                    <p className="text-sm text-gray-600">Basketball</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="badge badge-success">Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm">Sports Complex</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-outline btn-sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button className="btn btn-error btn-sm">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminEquipment; 