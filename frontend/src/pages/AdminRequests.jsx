import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Package, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/requests');
      setRequests(response.data.data.requests);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/requests/${id}/approve`);
      toast.success('Request approved');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/requests/${id}/reject`);
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filterStatus === 'all') return true;
    return req.status === filterStatus;
  });

  return (
    <>
      <Helmet>
        <title>Admin Requests - Sports Equipment Management System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Manage Requests
              </h1>
              <p className="text-gray-600">
                Review and approve equipment requests
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </motion.div>

          {loading ? (
            <p>Loading requests...</p>
          ) : (
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <p>No requests found.</p>
              ) : (
                filteredRequests.map((req) => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="w-8 h-8 text-primary-600 mr-4" />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Request #{req._id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {req.equipmentName} • Student ID: {req.studentId} • {new Date(req.requestDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleApprove(req._id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </button>
                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => handleReject(req._id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        {req.status !== 'pending' && (
                          <span className={`text-sm font-semibold ${
                            req.status === 'approved' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRequests;
