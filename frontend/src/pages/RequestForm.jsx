import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Package, Calendar, Send } from 'lucide-react';

const RequestForm = () => {
  return (
    <>
      <Helmet>
        <title>Request Equipment - Sports Equipment Management System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Request Equipment
            </h1>
            <p className="text-gray-600 mb-8">
              Submit a request to borrow sports equipment
            </p>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment
                </label>
                <select className="select">
                  <option value="">Select equipment</option>
                  <option value="basketball">Basketball</option>
                  <option value="football">Football</option>
                  <option value="tennis">Tennis Racket</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  className="input"
                  placeholder="Enter duration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose
                </label>
                <textarea
                  className="textarea"
                  placeholder="Describe why you need this equipment"
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary">
                  <Send className="w-5 h-5 mr-2" />
                  Submit Request
                </button>
                <button type="button" className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RequestForm; 