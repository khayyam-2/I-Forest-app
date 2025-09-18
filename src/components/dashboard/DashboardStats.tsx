import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  TrendingUp, 
  Star, 
  Clock,
  DollarSign,
  Award
} from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const { user } = useAuth();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'student':
        return [
          { label: 'Enrolled Courses', value: '12', icon: BookOpen, color: 'blue' },
          { label: 'Completed Lessons', value: '89', icon: Award, color: 'green' },
          { label: 'Study Hours', value: '156h', icon: Clock, color: 'purple' },
          { label: 'Certificates Earned', value: '5', icon: Star, color: 'yellow' },
        ];
      case 'teacher':
        return [
          { label: 'Total Courses', value: '8', icon: BookOpen, color: 'blue' },
          { label: 'Total Students', value: '342', icon: Users, color: 'green' },
          { label: 'Monthly Earnings', value: '$2,840', icon: DollarSign, color: 'emerald' },
          { label: 'Average Rating', value: '4.8', icon: Star, color: 'yellow' },
        ];
      case 'doctor':
        return [
          { label: 'Total Appointments', value: '156', icon: Calendar, color: 'blue' },
          { label: 'Active Patients', value: '89', icon: Users, color: 'green' },
          { label: 'Monthly Revenue', value: '$4,200', icon: DollarSign, color: 'emerald' },
          { label: 'Patient Rating', value: '4.9', icon: Star, color: 'yellow' },
        ];
      case 'admin':
        return [
          { label: 'Total Users', value: '15,420', icon: Users, color: 'blue' },
          { label: 'Active Courses', value: '234', icon: BookOpen, color: 'green' },
          { label: 'Monthly Revenue', value: '$28,400', icon: DollarSign, color: 'emerald' },
          { label: 'Platform Growth', value: '+12%', icon: TrendingUp, color: 'purple' },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  const recentActivity = [
    { action: 'Completed lesson: React Hooks Advanced', time: '2 hours ago', type: 'completion' },
    { action: 'New appointment scheduled', time: '4 hours ago', type: 'appointment' },
    { action: 'Quiz submitted: JavaScript Fundamentals', time: '1 day ago', type: 'quiz' },
    { action: 'Course enrollment: AI & Machine Learning', time: '2 days ago', type: 'enrollment' },
    { action: 'Certificate earned: Web Development', time: '3 days ago', type: 'certificate' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completion': return <BookOpen className="h-4 w-4 text-blue-600" />;
      case 'appointment': return <Calendar className="h-4 w-4 text-green-600" />;
      case 'quiz': return <Award className="h-4 w-4 text-purple-600" />;
      case 'enrollment': return <Users className="h-4 w-4 text-orange-600" />;
      case 'certificate': return <Star className="h-4 w-4 text-yellow-600" />;
      default: return <BookOpen className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {user?.role === 'student' && (
                <>
                  <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <BookOpen className="h-6 w-6 mx-auto text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Browse Courses</span>
                  </button>
                  <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <Calendar className="h-6 w-6 mx-auto text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Book Appointment</span>
                  </button>
                </>
              )}
              
              {user?.role === 'teacher' && (
                <>
                  <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <BookOpen className="h-6 w-6 mx-auto text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Create Course</span>
                  </button>
                  <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <Users className="h-6 w-6 mx-auto text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">View Students</span>
                  </button>
                </>
              )}
              
              {user?.role === 'doctor' && (
                <>
                  <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Calendar className="h-6 w-6 mx-auto text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">View Schedule</span>
                  </button>
                  <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <Users className="h-6 w-6 mx-auto text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Patient Records</span>
                  </button>
                </>
              )}
              
              <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors col-span-2">
                <Award className="h-6 w-6 mx-auto text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">AI Learning Assistant</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};