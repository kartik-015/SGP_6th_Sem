import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { 
  Smartphone, 
  Lock, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  User,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const StudentLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resendOTP } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [studentId, setStudentId] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm();

  const onSubmitPhone = async (data) => {
    setIsSubmitting(true);
    try {
      // This would typically call an API to send OTP
      // For now, we'll simulate the process
      setPhoneNumber(data.phoneNumber);
      setStudentId(data.studentId);
      setStep('otp');
      setValue('otp', '');
    } catch (error) {
      console.error('Phone verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitOTP = async (data) => {
    setIsSubmitting(true);
    try {
      await login({
        studentId,
        phoneNumber,
        otp: data.otp
      }, 'student');
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResendingOTP(true);
    try {
      await resendOTP(studentId, phoneNumber);
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setIsResendingOTP(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setPhoneNumber('');
    setStudentId('');
  };

  return (
    <>
      <Helmet>
        <title>Student Login - Sports Equipment Management System</title>
        <meta name="description" content="Login to access sports equipment borrowing system" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Student Login
            </h1>
            <p className="text-gray-600">
              {step === 'phone' 
                ? 'Enter your details to receive OTP'
                : 'Enter the OTP (check console for testing)'
              }
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <form onSubmit={handleSubmit(step === 'phone' ? onSubmitPhone : onSubmitOTP)} className="p-6 space-y-6">
              {step === 'phone' ? (
                // Phone Number Step
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID *
                    </label>
                    <input
                      type="text"
                      {...register('studentId', { 
                        required: 'Student ID is required',
                        minLength: { value: 3, message: 'Student ID must be at least 3 characters' }
                      })}
                      className="input"
                      placeholder="Enter your student ID"
                    />
                    {errors.studentId && (
                      <p className="text-error-600 text-sm mt-1">{errors.studentId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phoneNumber', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[\+]?[1-9][\d]{0,15}$/,
                          message: 'Invalid phone number'
                        }
                      })}
                      className="input"
                      placeholder="Enter your phone number"
                    />
                    {errors.phoneNumber && (
                      <p className="text-error-600 text-sm mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-5 h-5 mr-2" />
                        Send OTP
                      </>
                    )}
                  </button>
                </>
              ) : (
                // OTP Step
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-success-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      OTP Sent Successfully!
                    </h3>
                    <p className="text-gray-600">
                      Check the console for your 6-digit OTP code
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP *
                    </label>
                    <input
                      type="text"
                      {...register('otp', { 
                        required: 'OTP is required',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'OTP must be 6 digits'
                        }
                      })}
                      className="input text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                    />
                    {errors.otp && (
                      <p className="text-error-600 text-sm mt-1">{errors.otp.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          Verify & Login
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isResendingOTP}
                      className="btn btn-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResendingOTP ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Resending...
                        </>
                      ) : (
                        'Resend OTP'
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleBackToPhone}
                    className="text-sm text-primary-600 hover:text-primary-700 text-center w-full"
                  >
                    ← Back to phone number
                  </button>
                </>
              )}
            </form>
          </motion.div>

          {/* Registration Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Register here
              </Link>
            </p>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 card"
          >
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Login Information
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use your registered student ID and phone number</li>
                <li>• OTP will be sent to your registered phone number</li>
                <li>• OTP expires in 5 minutes</li>
                <li>• Contact admin if you face any issues</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default StudentLogin; 