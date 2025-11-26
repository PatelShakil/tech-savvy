import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import {db} from "../../../firebase.ts";

interface Program {
    id: string;
    name: string;
    description: string;
    category: string;
    status: string;
    startDate: string;
    endDate: string;
    maxStudents: number;
}

const ProgramsList: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'programs'));
            const programsData = querySnapshot.docs.map(doc => ({
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

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await deleteDoc(doc(db, 'programs', id));
                setPrograms(programs.filter(p => p.id !== id));
                alert('Program deleted successfully!');
            } catch (error) {
                console.error('Error deleting program:', error);
                alert('Failed to delete program');
            }
        }
    };

    const filteredPrograms = programs.filter(p =>
        filter === 'all' || p.status === filter
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'archived': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Programs Management">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-600">Loading programs...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Programs Management">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        {['all', 'active', 'upcoming', 'completed', 'archived'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                                    filter === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <Link
                        to="/admin/programs/add"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Program
                    </Link>
                </div>

                {/* Programs Grid */}
                {filteredPrograms.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <p className="text-gray-600 mb-4">No programs found</p>
                        <Link
                            to="/admin/programs/add"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Create Your First Program
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPrograms.map((program) => (
                            <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{program.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                      {program.status}
                    </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{program.description}</p>

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex justify-between">
                                            <span>Category:</span>
                                            <span className="font-medium capitalize">{program.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Duration:</span>
                                            <span className="font-medium">{program.startDate} to {program.endDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Max Students:</span>
                                            <span className="font-medium">{program.maxStudents}</span>
                                        </div>
                                    </div>
                                    // Add this button in each program card
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-xs text-gray-500 mb-2">Application Form URL:</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={`${window.location.origin}/programs/apply/${program.id}`}
                                                readOnly
                                                className="flex-1 px-3 py-1 text-xs bg-gray-50 border border-gray-200 rounded"
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/programs/apply/${program.id}`);
                                                    alert('Link copied!');
                                                }}
                                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>


                                    <div className="flex gap-2 pt-4 border-t">
                                        <Link
                                            to={`/admin/programs/${program.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            View
                                        </Link>
                                        <Link
                                            to={`/admin/programs/edit/${program.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(program.id, program.name)}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ProgramsList;
