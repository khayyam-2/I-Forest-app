import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  Settings,
  Shield,
  FileText,
  Calendar,
  BarChart3,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'courses', label: 'Course Management', icon: BookOpen },
    { id: 'finances', label: 'Financial Reports', icon: DollarSign },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active', joinDate: '2024-01-15' },
    { id: '2', name: 'Dr. Sarah Wilson', email: 'sarah@example.com', role: 'doctor', status: 'active', joinDate: '2024-01-10' },
    { id: '3', name: 'Prof. Ahmed Hassan', email: 'ahmed@example.com', role: 'teacher', status: 'pending', joinDate: '2024-01-20' },
  ];

  const mockCourses = [
    { id: '1', title: 'React Development', instructor: 'Prof. Smith', students: 245, status: 'published', revenue: '$2,450' },
    { id: '2', title: 'Machine Learning', instructor: 'Dr. Johnson', students: 189, status: 'review', revenue: '$1,890' },
    { id: '3', title: 'Quran Studies', instructor: 'Ustadh Ali', students: 324, status: 'published', revenue: '$1,620' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '15,420', change: '+12%', icon: Users, color: 'blue' },
          { label: 'Active Courses', value: '234', change: '+8%', icon: BookOpen, color: 'green' },
          { label: 'Monthly Revenue', value: '$28,400', change: '+15%', icon: DollarSign, color: 'emerald' },
          { label: 'Platform Growth', value: '23%', change: '+5%', icon: TrendingUp, color: 'purple' },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    <p className="text-sm text-green-600 mt-1">{metric.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                    <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent User Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New teacher registration', user: 'Dr. Ahmed Khan', time: '2 hours ago' },
                { action: 'Course published', user: 'Prof. Sarah Johnson', time: '4 hours ago' },
                { action: 'Payment received', user: 'John Doe', time: '6 hours ago' },
                { action: 'Course enrollment', user: 'Mary Wilson', time: '8 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Platform Health</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: 'System Uptime', value: '99.9%', status: 'good' },
                { metric: 'API Response Time', value: '125ms', status: 'good' },
                { metric: 'Database Performance', value: 'Optimal', status: 'good' },
                { metric: 'Storage Usage', value: '67%', status: 'warning' },
              ].map((health, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{health.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{health.value}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      health.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <Button>Add New User</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'doctor' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{user.joinDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-green-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCourseManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
            <Button>Review Pending Courses</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Course</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Instructor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Students</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCourses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{course.title}</td>
                    <td className="py-3 px-4 text-gray-500">{course.instructor}</td>
                    <td className="py-3 px-4 text-gray-500">{course.students}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{course.revenue}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.status === 'published' ? 'bg-green-100 text-green-800' :
                        course.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-green-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUserManagement();
      case 'courses':
        return renderCourseManagement();
      case 'finances':
        return (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Reports</h3>
            <p className="text-gray-600">Detailed financial analytics and reports will be available here</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Settings</h3>
            <p className="text-gray-600">System configuration and platform settings will be available here</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    activeSection === section.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {renderContent()}
    </div>
  );
};