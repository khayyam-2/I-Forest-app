import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Star, 
  Filter,
  User,
  Stethoscope
} from 'lucide-react';
import { Appointment, User as UserType } from '../../types';
import { format, addDays } from 'date-fns';

const mockDoctors: UserType[] = [
  {
    id: 'doc1',
    name: 'Dr. Ahmad Rahman',
    email: 'ahmad@example.com',
    role: 'doctor',
    verified: true,
    createdAt: new Date(),
    profile: {
      bio: 'Experienced cardiologist with 15+ years of practice',
      specialization: 'Cardiology',
      location: 'Karachi, Pakistan',
      rating: 4.9,
      totalStudents: 324,
      experience: 15,
    }
  },
  {
    id: 'doc2',
    name: 'Dr. Fatima Ali',
    email: 'fatima@example.com',
    role: 'doctor',
    verified: true,
    createdAt: new Date(),
    profile: {
      bio: 'Pediatric specialist focused on child health',
      specialization: 'Pediatrics',
      location: 'Lahore, Pakistan',
      rating: 4.8,
      totalStudents: 189,
      experience: 12,
    }
  },
  {
    id: 'doc3',
    name: 'Dr. Hassan Khan',
    email: 'hassan@example.com',
    role: 'doctor',
    verified: true,
    createdAt: new Date(),
    profile: {
      bio: 'General physician and family medicine expert',
      specialization: 'General Medicine',
      location: 'Islamabad, Pakistan',
      rating: 4.7,
      totalStudents: 567,
      experience: 10,
    }
  }
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: 'doc1',
    patientId: 'patient1',
    doctor: mockDoctors[0],
    patient: {
      id: 'patient1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student',
      verified: true,
      createdAt: new Date(),
      profile: {}
    },
    type: 'online',
    date: addDays(new Date(), 2),
    duration: 30,
    status: 'scheduled',
    meetingLink: 'https://zoom.us/j/123456789'
  }
];

export const AppointmentBooking: React.FC = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<UserType | null>(null);
  const [appointmentType, setAppointmentType] = useState<'online' | 'physical'>('online');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const specializations = ['all', 'Cardiology', 'Pediatrics', 'General Medicine', 'Dermatology', 'Orthopedics'];
  
  const filteredDoctors = selectedSpecialization === 'all' 
    ? mockDoctors 
    : mockDoctors.filter(doc => doc.profile.specialization === selectedSpecialization);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleBookAppointment = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      alert(`Appointment booked with ${selectedDoctor.name} on ${selectedDate} at ${selectedTime} (${appointmentType})`);
      // Reset form
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
        </CardHeader>
        <CardContent>
          {mockAppointments.length > 0 ? (
            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">
                          {appointment.doctor.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {appointment.doctor.profile.specialization}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(appointment.date, 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{format(appointment.date, 'hh:mm a')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {appointment.type === 'online' ? (
                              <>
                                <Video className="h-4 w-4" />
                                <span>Online</span>
                              </>
                            ) : (
                              <>
                                <MapPin className="h-4 w-4" />
                                <span>Physical Visit</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {appointment.status}
                      </span>
                      {appointment.type === 'online' && (
                        <div className="mt-2">
                          <Button size="sm" variant="outline">
                            Join Meeting
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming appointments</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Book New Appointment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Find a Doctor</h3>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>
                      {spec === 'all' ? 'All Specializations' : spec}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedDoctor?.id === doctor.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-gray-900">
                            {doctor.name}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{doctor.profile.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-blue-600 font-medium">
                          {doctor.profile.specialization}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {doctor.profile.bio}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{doctor.profile.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{doctor.profile.experience} years exp.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointment Booking */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Book Appointment</h3>
          </CardHeader>
          <CardContent>
            {selectedDoctor ? (
              <div className="space-y-4">
                {/* Selected Doctor */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDoctor.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {selectedDoctor.profile.specialization}
                  </p>
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAppointmentType('online')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        appointmentType === 'online'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Video className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-xs font-medium">Online</div>
                    </button>
                    <button
                      onClick={() => setAppointmentType('physical')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        appointmentType === 'physical'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <MapPin className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-xs font-medium">Physical</div>
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 text-xs rounded border transition-colors ${
                          selectedTime === time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full"
                >
                  Book Appointment
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a doctor to book an appointment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};