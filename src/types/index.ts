export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'doctor' | 'admin';
  avatar?: string;
  verified: boolean;
  createdAt: Date;
  profile: UserProfile;
}

export interface UserProfile {
  bio?: string;
  specialization?: string;
  location?: string;
  phone?: string;
  experience?: number;
  rating?: number;
  totalStudents?: number;
  totalCourses?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  thumbnail: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  teacherId: string;
  teacher: User;
  enrolled: number;
  rating: number;
  lessons: Lesson[];
  createdAt: Date;
  isEnrolled?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: string;
  order: number;
  completed?: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctor: User;
  patient: User;
  type: 'online' | 'physical';
  date: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  meetingLink?: string;
}

export interface QuranData {
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  transliteration: string;
}

export interface AIResponse {
  message: string;
  type: 'course_help' | 'quran_tutor' | 'quiz_generation';
  metadata?: Record<string, any>;
}