import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  GraduationCap,
  Calendar,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { registerStudent } = useAuth();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setValue('idCard', file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const onSubmit = async (data) => {
    if (!uploadedFile) {
      alert('Please upload your ID card image');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('studentId', data.studentId);
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('department', data.department);
      formData.append('year', data.year);
      formData.append('semester', data.semester);
      formData.append('idCard', uploadedFile);

      // Debug logging
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      console.log('Uploaded file:', uploadedFile);

      await registerStudent(formData);
      navigate('/login/student');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Information Technology',
    'Business Administration',
    'Economics',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Medicine',
    'Law',
    'Arts',
    'Literature',
    'History',
    'Geography',
    'Psychology',
    'Sociology'
  ];

  return (
    <>
      <Helmet>
        <title>Student Registration - Sports Equipment Management System</title>
        <meta name="description" content="Register as a student to access sports equipment borrowing system" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Student Registration
            </h1>
            <p className="text-gray-600">
              Create your account to access sports equipment borrowing (OTP will be logged to console)
            </p>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('fullName', { 
                        required: 'Full name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      className="input"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-error-600 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="input"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-error-600 text-sm mt-1">{errors.email.message}</p>
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
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Academic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      {...register('department', { required: 'Department is required' })}
                      className="select"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="text-error-600 text-sm mt-1">{errors.department.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <select
                      {...register('year', { required: 'Year is required' })}
                      className="select"
                    >
                      <option value="">Select Year</option>
                      {[1, 2, 3, 4, 5, 6].map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {errors.year && (
                      <p className="text-error-600 text-sm mt-1">{errors.year.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester *
                    </label>
                    <select
                      {...register('semester', { required: 'Semester is required' })}
                      className="select"
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                    {errors.semester && (
                      <p className="text-error-600 text-sm mt-1">{errors.semester.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ID Card Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  ID Card Upload
                </h3>
                
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary-400 bg-primary-50'
                      : uploadedFile
                      ? 'border-success-400 bg-success-50'
                      : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-12 h-12 text-success-600 mx-auto" />
                      <p className="text-success-600 font-medium">File uploaded successfully!</p>
                      <p className="text-sm text-gray-600">{uploadedFile.name}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                          setValue('idCard', null);
                        }}
                        className="text-sm text-error-600 hover:text-error-700"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-gray-600">
                        {isDragActive
                          ? 'Drop your ID card image here'
                          : 'Drag & drop your ID card image here, or click to select'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: JPG, PNG, GIF, WEBP (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                
                {errors.idCard && (
                  <p className="text-error-600 text-sm mt-2">{errors.idCard.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !uploadedFile}
                  className="btn btn-primary btn-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
                
                <Link
                  to="/login/student"
                  className="btn btn-outline btn-lg flex-1"
                >
                  Already have an account? Login
                </Link>
              </div>
            </form>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 card"
          >
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Important Information</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your ID card image will be used for verification</li>
                <li>• You'll receive an OTP on your phone number for verification</li>
                <li>• Make sure your ID card is clearly visible in the uploaded image</li>
                <li>• All information will be kept secure and confidential</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default StudentRegistration; 