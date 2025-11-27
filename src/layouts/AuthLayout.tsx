import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Business Activity Tracker
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Track and manage your business activities
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
