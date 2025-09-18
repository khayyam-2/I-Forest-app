import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  BookOpen, 
  Search, 
  Play, 
  Pause,
  Volume2,
  Moon,
  Star,
  Calendar,
  Clock,
  Users
} from 'lucide-react';

interface QuranVerse {
  surah: number;
  surahName: string;
  ayah: number;
  arabic: string;
  translation: string;
  transliteration: string;
}

const sampleVerses: QuranVerse[] = [
  {
    surah: 1,
    surahName: 'Al-Fatihah',
    ayah: 1,
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the name of Allah, the Beneficent, the Merciful.',
    transliteration: 'Bismillahi Rahmanir Rahim'
  },
  {
    surah: 2,
    surahName: 'Al-Baqarah',
    ayah: 255,
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    translation: 'Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining.',
    transliteration: 'Allahu la ilaha illa Huwa al-Hayyu al-Qayyum'
  },
  {
    surah: 112,
    surahName: 'Al-Ikhlas',
    ayah: 1,
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    translation: 'Say: He is Allah, the One!',
    transliteration: 'Qul Huwa Allahu Ahad'
  }
];

export const QuranAcademy: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerse, setSelectedVerse] = useState<QuranVerse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tabs = [
    { id: 'search', label: 'Quran Search', icon: Search },
    { id: 'recitation', label: 'Recitation Practice', icon: Volume2 },
    { id: 'ramadan', label: 'Ramadan Features', icon: Moon },
    { id: 'teachers', label: 'Quran Teachers', icon: Users },
  ];

  const filteredVerses = sampleVerses.filter(verse =>
    verse.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verse.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verse.surahName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderQuranSearch = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Quran by translation, transliteration, or surah name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredVerses.map((verse, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedVerse(verse)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-green-600">
                    Surah {verse.surah}: {verse.surahName} - Ayah {verse.ayah}
                  </h3>
                </div>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="space-y-3">
                <p className="text-2xl text-right text-gray-900 leading-loose font-arabic">
                  {verse.arabic}
                </p>
                <p className="text-gray-600 italic">
                  {verse.transliteration}
                </p>
                <p className="text-gray-900">
                  {verse.translation}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {searchTerm && filteredVerses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No verses found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );

  const renderRecitationPractice = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Tajweed Practice</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Practice Modules</h4>
              <div className="space-y-2">
                {['Makharij (Articulation Points)', 'Sifat (Characteristics)', 'Waqf (Stopping Rules)', 'Madd (Prolongation)'].map((module) => (
                  <button key={module} className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{module}</span>
                      <Play className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">AI Pronunciation Guide</h4>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 mb-2">
                  Our AI will analyze your recitation and provide feedback on:
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Pronunciation accuracy</li>
                  <li>• Tajweed rule application</li>
                  <li>• Rhythm and melody</li>
                  <li>• Areas for improvement</li>
                </ul>
              </div>
              <Button variant="secondary" className="w-full">
                Start Practice Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRamadanFeatures = () => (
    <div className="space-y-6">
      {/* Prayer Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span>Prayer Times Today</span>
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Fajr', time: '5:30 AM', passed: true },
                { name: 'Dhuhr', time: '12:45 PM', passed: true },
                { name: 'Asr', time: '4:15 PM', passed: false, current: true },
                { name: 'Maghrib', time: '6:30 PM', passed: false },
                { name: 'Isha', time: '8:00 PM', passed: false },
              ].map((prayer) => (
                <div key={prayer.name} className={`flex items-center justify-between p-3 rounded-lg ${
                  prayer.current ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}>
                  <span className={`font-medium ${prayer.current ? 'text-green-800' : 'text-gray-900'}`}>
                    {prayer.name}
                  </span>
                  <span className={`text-sm ${prayer.passed ? 'text-gray-500' : prayer.current ? 'text-green-600' : 'text-gray-900'}`}>
                    {prayer.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ramadan Calendar */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Moon className="h-5 w-5 text-blue-600" />
              <span>Ramadan Calendar</span>
            </h3>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-blue-600">Day 15</div>
              <div className="text-sm text-gray-600">of Ramadan 1445</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Suhur ends:</span>
                <span className="font-medium">5:20 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Iftar begins:</span>
                <span className="font-medium">6:30 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fast duration:</span>
                <span className="font-medium">13h 10m</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Set Ramadan Reminders
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Daily Duas and Dhikr */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Daily Duas & Dhikr</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Morning Duas', count: '7 supplications' },
              { title: 'Evening Dhikr', count: '5 remembrances' },
              { title: 'Before Iftar', count: '3 special duas' },
            ].map((item) => (
              <button key={item.title} className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <Star className="h-6 w-6 mx-auto text-gray-600 mb-2" />
                <div className="text-sm font-medium text-gray-700">{item.title}</div>
                <div className="text-xs text-gray-500">{item.count}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuranTeachers = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Find Quran Teachers</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Ustadh Muhammad Ahmad',
                specialization: 'Tajweed & Memorization',
                experience: '15 years',
                students: 234,
                rating: 4.9,
                price: '$25/hour'
              },
              {
                name: 'Ustadha Aisha Rahman',
                specialization: 'Quran Translation & Tafseer',
                experience: '12 years',
                students: 189,
                rating: 4.8,
                price: '$30/hour'
              }
            ].map((teacher) => (
              <div key={teacher.name} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{teacher.name}</h4>
                    <p className="text-green-600 font-medium">{teacher.specialization}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{teacher.experience} experience</span>
                      <span>{teacher.students} students</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{teacher.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-bold text-gray-900">{teacher.price}</span>
                      <Button size="sm" variant="secondary">Book Session</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return renderQuranSearch();
      case 'recitation':
        return renderRecitationPractice();
      case 'ramadan':
        return renderRamadanFeatures();
      case 'teachers':
        return renderQuranTeachers();
      default:
        return renderQuranSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    activeTab === tab.id
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};