'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Hall = {
  id: number;
  name: string;
  capacity: number;
  available: boolean;
  updated_at: string;
};

type AvailabilityResponse = {
  data: Hall[];
  source: string;
  error?: string;
  message?: string;
};

export default function Home() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [status, setStatus] = useState('loading');
  const [source, setSource] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch('/api/availability');
        const result: AvailabilityResponse = await response.json();

        setHalls(result.data);
        setSource(result.source);
        setError(result.error ?? result.message ?? null);
        setStatus('loaded');
      } catch {
        setError('Unable to load availability data.');
        setStatus('error');
      }
    };

    fetchAvailability();
  }, []);

  const defaultHalls: Hall[] = [
    { id: 1, name: 'Seminar Hall 1', capacity: 80, available: true, updated_at: new Date().toISOString() },
    { id: 2, name: 'Seminar Hall 2', capacity: 80, available: true, updated_at: new Date().toISOString() },
    { id: 3, name: 'Main Auditorium', capacity: 300, available: false, updated_at: new Date().toISOString() },
  ];

  const showHalls = halls.length > 0 ? halls : defaultHalls;

  return (
    <div className="bg-black text-white selection:bg-green-500/30 font-sans">
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-10 py-6 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <h1 className="text-lg font-semibold tracking-tighter">CampusHalls</h1>
        <nav className="flex gap-8 text-gray-300 text-sm font-medium">
          <a href="#home" className="hover:text-white transition-colors">Home</a>
          <a href="#availability" className="hover:text-white transition-colors">Availability</a>
        </nav>
      </header>

      <section id="home" className="relative h-screen flex items-center px-16 pt-24 overflow-hidden">
        <img
          src="https://media.gettyimages.com/id/186826741/photo/empty-lecture-hall-with-several-rows-of-seats-and-a-screen.jpg?s=612x612&w=0&k=20&c=p_LGSVbjdY_tQoRLjP8N7FL8wYNrZ8LPdgNVypY3cJU="
          className="absolute inset-0 w-full h-full object-cover"
          alt="Lecture Hall"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>

        <div className="relative max-w-xl z-10">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 px-4 py-2 rounded-full text-green-400 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Availability
          </div>
          <h1 className="text-6xl font-bold leading-[1.1] mt-6 tracking-tight">
            Book Your <br />
            <span className="text-green-400">Event Space</span><br />
            Instantly
          </h1>
          <p className="text-gray-300 mt-6 text-lg leading-relaxed font-light">
            Check real-time availability of our seminar halls and auditorium. Book your preferred time slot in just a few clicks.
          </p>
          <a href="#availability">
            <button className="mt-8 bg-green-500 hover:bg-green-600 transition-all duration-300 px-8 py-4 rounded-full font-semibold shadow-xl shadow-green-500/25 hover:shadow-2xl hover:scale-105 text-lg">
              Check Availability →
            </button>
          </a>
        </div>

        <div className="absolute right-16 bottom-20 space-y-4 z-10 hidden lg:block">
          {showHalls.slice(0, 3).map((hall) => (
            <div key={hall.id} className="w-96 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1 transition-all duration-300 group flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg group-hover:text-green-400 transition-colors">{hall.name}</h2>
                <p className="text-gray-400 text-xs mt-1">Capacity: {hall.capacity}</p>
              </div>
              <span className={`text-sm font-medium flex items-center gap-2 ${hall.available ? 'text-green-400' : 'text-red-400'}`}>
                {hall.available ? '● Available' : '● Booked'}
                <div className={`w-2 h-2 rounded-full ${hall.available ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="availability" className="bg-white text-gray-800 py-24 px-10">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-green-600 text-sm font-bold tracking-widest uppercase">REAL-TIME UPDATES</p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gray-900 tracking-tight">Hall Availability</h2>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
            Check the current status of all event spaces and find the perfect venue for your next event.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            {status === 'loading' && 'Loading availability...'}
            {status === 'error' && `Error loading availability: ${error}`}
            {status === 'loaded' && `Showing live data from ${source}.`}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-7xl mx-auto">
          {showHalls.map((hall) => (
            <div key={hall.id} className="group bg-gray-50 rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img src={`https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&hall=${encodeURIComponent(hall.name)}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={hall.name} />
                <span className={`absolute top-4 left-4 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-2 ${hall.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {hall.available ? 'Available Now' : 'Currently Booked'}
                </span>
              </div>
              <div className="p-8">
                <h3 className="font-bold text-2xl text-gray-900 group-hover:text-green-600 transition-colors mb-3">{hall.name}</h3>
                <p className="text-gray-600 text-sm mb-6 flex flex-wrap gap-2">
                  <span>👥 {hall.capacity} seats</span> • <span>📶 High-speed WiFi</span>
                </p>
                <Link href="/calendar">
                  <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-all duration-300">
                    View Calendar →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-white px-10 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter mb-2">CampusHalls</h2>
            <p className="text-gray-400 text-sm">© 2026 University Event Management</p>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="mailto:booking@college.edu" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
