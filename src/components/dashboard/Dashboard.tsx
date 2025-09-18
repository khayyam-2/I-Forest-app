import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../layout/Header';
import { CourseMarketplace } from './CourseMarketplace';
import { AppointmentBooking } from './AppointmentBooking';
import { AIAcademy } from './AIAcademy';
import { AdminPanel } from './AdminPanel';
import { DashboardStats } from './DashboardStats';
import { QuranAcademy } from './QuranAcademy';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', roles: ['student', 'teacher', 'doctor', 'admin'] },
    { id: 'courses', label: 'Courses', roles: ['student', 'teacher', 'admin'] },
    { id: 'appointments', label: 'Appointments', roles: ['student', 'doctor', 'admin'] },
    { id: 'ai-academy', label: 'AI Academy', roles: ['student', 'teacher', 'doctor', 'admin'] },
    { id: 'quran', label: 'Quran Academy', roles: ['student', 'teacher', 'doctor', 'admin'] },
    { id: 'admin', label: 'Admin Panel', roles: ['admin'] },
  ];

  const visibleTabs = tabs.filter(tab => tab.roles.includes(user?.role || 'student'));

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardStats />;
      case 'courses':
        return <CourseMarketplace />;
      case 'appointments':
        return <AppointmentBooking />;
      case 'ai-academy':
        return <AIAcademy />;
      case 'quran':
        return <QuranAcademy />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 capitalize">
            {user?.role} Dashboard - {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};