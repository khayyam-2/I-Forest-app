import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  BookOpen, 
  Star, 
  Clock, 
  Users, 
  Filter,
  Play,
  Award,
  Search
} from 'lucide-react';
import { Course } from '../../types';

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete React Development Course',
    description: 'Master React from basics to advanced concepts with real-world projects.',
    price: 89.99,
    currency: 'USD',
    thumbnail: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '24h 30m',
    level: 'intermediate',
    category: 'Programming',
    teacherId: 'teacher1',
    teacher: {
      id: 'teacher1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@example.com',
      role: 'teacher',
      verified: true,
      createdAt: new Date(),
      profile: {
        bio: 'Full-stack developer with 8+ years experience',
        specialization: 'Web Development',
        rating: 4.9,
      }
    },
    enrolled: 1247,
    rating: 4.8,
    lessons: [
      { id: '1', title: 'Introduction to React', description: 'Learn the basics', duration: '45m', order: 1 },
      { id: '2', title: 'Components and JSX', description: 'Building blocks of React', duration: '1h 15m', order: 2 },
    ],
    createdAt: new Date(),
    isEnrolled: false,
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    description: 'Dive into AI and ML with Python and practical examples.',
    price: 129.99,
    currency: 'USD',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '32h 15m',
    level: 'advanced',
    category: 'AI/ML',
    teacherId: 'teacher2',
    teacher: {
      id: 'teacher2',
      name: 'Prof. Ahmed Hassan',
      email: 'ahmed@example.com',
      role: 'teacher',
      verified: true,
      createdAt: new Date(),
      profile: {
        bio: 'AI Research Professor',
        specialization: 'Machine Learning',
        rating: 4.7,
      }
    },
    enrolled: 892,
    rating: 4.6,
    lessons: [],
    createdAt: new Date(),
    isEnrolled: true,
  },
  {
    id: '3',
    title: 'Quran Recitation & Tajweed',
    description: 'Learn proper Quran recitation with Tajweed rules and practice.',
    price: 49.99,
    currency: 'USD',
    thumbnail: 'https://images.pexels.com/photos/6001047/pexels-photo-6001047.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '18h 45m',
    level: 'beginner',
    category: 'Islamic Studies',
    teacherId: 'teacher3',
    teacher: {
      id: 'teacher3',
      name: 'Ustadh Omar Ali',
      email: 'omar@example.com',
      role: 'teacher',
      verified: true,
      createdAt: new Date(),
      profile: {
        bio: 'Certified Quran Teacher',
        specialization: 'Islamic Studies',
        rating: 4.9,
      }
    },
    enrolled: 2156,
    rating: 4.9,
    lessons: [],
    createdAt: new Date(),
    isEnrolled: false,
  }
];

export const CourseMarketplace: React.FC = () => {
  const [courses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const categories = ['all', 'Programming', 'AI/ML', 'Islamic Studies', 'Business', 'Design'];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {levels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              {course.isEnrolled && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Enrolled
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${course.teacher.name}`}
                  alt={course.teacher.name}
                  className="h-6 w-6 rounded-full"
                />
                <span className="text-sm text-gray-700">{course.teacher.name}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolled.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-gray-900">
                  ${course.price}
                </div>
                {course.isEnrolled ? (
                  <Button variant="secondary" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                ) : (
                  <Button size="sm">
                    Enroll Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse our featured courses.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};