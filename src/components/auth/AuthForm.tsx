import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { BookOpen, User, Stethoscope, GraduationCap, Shield } from 'lucide-react';

export const AuthForm: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student' as const,
  });

  const roles = [
    { id: 'student', label: 'Student', icon: User, description: 'Learn and grow' },
    { id: 'teacher', label: 'Teacher', icon: GraduationCap, description: 'Share knowledge' },
    { id: 'doctor', label: 'Doctor', icon: Stethoscope, description: 'Provide consultations' },
    { id: 'admin', label: 'Admin', icon: Shield, description: 'Manage platform' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password, formData.role);
      } else {
        await register(formData.email, formData.password, formData.name, formData.role);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl inline-block mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EduPlatform</h1>
          <p className="text-gray-600">Global AI-powered Learning Hub</p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-xl font-semibold text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600 text-center text-sm">
              {isLogin ? 'Sign in to your account' : 'Join our learning community'}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              )}

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">I am a...</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: role.id as any })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.role === role.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <Icon className="h-5 w-5 mx-auto mb-1" />
                        <div className="text-xs font-medium">{role.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-gray-500">
                <div>Student: student@demo.com / demo123</div>
                <div>Teacher: teacher@demo.com / demo123</div>
                <div>Doctor: doctor@demo.com / demo123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};