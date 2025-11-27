import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import {
    CalendarIcon,
    UserGroupIcon,
    CurrencyRupeeIcon,
    ClockIcon,
    ArrowRightIcon,
    AcademicCapIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Program {
    id: string;
    name: string;
    description: string;
    category: string;
    status: string;
    startDate: string;
    endDate: string;
    applicationDeadline: string;
    maxStudents: number;
    feePerStudent: number;
    minGroupSize: number;
    maxGroupSize: number;
}

const ProgramsPage: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'internship' | 'mentorship' | 'workshop'>('all');

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            // Fetch only active and upcoming programs
            const programsQuery = query(
                collection(db, 'programs'),
                where('status', 'in', ['active', 'upcoming']),
                orderBy('startDate', 'desc')
            );

            const programsSnap = await getDocs(programsQuery);
            const programsData = programsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Program[];

            setPrograms(programsData);
        } catch (error) {
            console.error('Error fetching programs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPrograms = filter === 'all'
        ? programs
        : programs.filter(p => p.category === filter);

    const isDeadlinePassed = (deadline: string) => {
        return new Date(deadline) < new Date();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Explore Our Programs</h1>
                        <p className="text-xl text-blue-100 mb-2">
                            Join Tech Savvy Solution and transform your career
                        </p>
                        <p className="text-blue-100">
                            🏢 MSME Registered | 500+ Students Trained | Industry-Focused Learning
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {['all', 'internship', 'mentorship', 'workshop'].map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category as any)}
                            className={`px-6 py-2 rounded-lg font-medium capitalize transition ${
                                filter === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="text-gray-600">Loading programs...</div>
                    </div>
                )}

                {/* Programs Grid */}
                {!loading && filteredPrograms.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <AcademicCapIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg">No programs available at the moment</p>
                        <p className="text-gray-500 text-sm mt-2">Check back soon for new opportunities!</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map((program) => {
                        const deadlinePassed = isDeadlinePassed(program.applicationDeadline);

                        return (
                            <div
                                key={program.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
                            >
                                {/* Category Badge */}
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3">
                                    <div className="flex justify-between items-center">
                    <span className="text-white font-semibold capitalize">
                      {program.category}
                    </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            program.status === 'active'
                                                ? 'bg-green-400 text-green-900'
                                                : 'bg-blue-400 text-blue-900'
                                        }`}>
                      {program.status === 'active' ? 'Active' : 'Upcoming'}
                    </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                                        {program.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {program.description}
                                    </p>

                                    {/* Details */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                                            <span>{program.startDate} to {program.endDate}</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <ClockIcon className="w-5 h-5 mr-2 text-orange-600" />
                                            <span>Apply by: {program.applicationDeadline}</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <UserGroupIcon className="w-5 h-5 mr-2 text-purple-600" />
                                            <span>Group Size: {program.minGroupSize}-{program.maxGroupSize} students</span>
                                        </div>

                                        <div className="flex items-center text-sm font-semibold text-gray-800">
                                            <CurrencyRupeeIcon className="w-5 h-5 mr-2 text-green-600" />
                                            <span>₹{program.feePerStudent.toLocaleString()} per student</span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                                        <div className="flex items-start text-xs text-gray-700 mb-1">
                                            <CheckCircleIcon className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <span>Live project deployment</span>
                                        </div>
                                        <div className="flex items-start text-xs text-gray-700 mb-1">
                                            <CheckCircleIcon className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <span>Certificate on completion</span>
                                        </div>
                                        <div className="flex items-start text-xs text-gray-700">
                                            <CheckCircleIcon className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <span>Mentorship & support</span>
                                        </div>
                                    </div>

                                    {/* Apply Button */}
                                    {deadlinePassed ? (
                                        <button
                                            disabled
                                            className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold cursor-not-allowed"
                                        >
                                            Applications Closed
                                        </button>
                                    ) : (
                                        <Link
                                            to={`/programs/apply/${program.id}`}
                                            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-center py-3 rounded-lg font-semibold transition group"
                                        >
                      <span className="flex items-center justify-center">
                        Apply Now
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Call to Action */}
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-xl mb-6 text-blue-100">
                        Join hundreds of students who have transformed their careers with Tech Savvy Solution
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a
                            href="https://techsavvysolution.patelshakil.tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                        >
                            Visit Website
                        </a>
                        <a
                            href="https://techsavvysolution.patelshakil.tech/contactus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white mt-16 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">
                        © 2025 Tech Savvy Solution. All rights reserved. | MSME Registered
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ProgramsPage;
