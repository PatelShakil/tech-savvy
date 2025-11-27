import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import AdminLayout from '../../../components/admin/AdminLayout';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {db} from "../../../firebase.ts";

interface Milestone {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    order: number;
}

interface ProgramFormData {
    name: string;
    description: string;
    category: string;
    status: string;
    startDate: string;
    endDate: string;
    applicationDeadline: string;
    eligibility: string;
    maxStudents: number;
    milestones: Milestone[];
    feePerStudent: number; // NEW
}

const AddProgram: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ProgramFormData>({
        name: '',
        description: '',
        category: 'internship',
        status: 'upcoming',
        startDate: '',
        endDate: '',
        applicationDeadline: '',
        eligibility: '',
        maxStudents: 50,
        milestones: [],
        feePerStudent: 10000, // NEW

    });

    const [milestone, setMilestone] = useState({
        title: '',
        description: '',
        dueDate: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if(e.target.name == "feePerStudent"){
            setFormData({...formData,feePerStudent: parseInt(e.target.value)})
        }

        setFormData({ ...formData, [e.target.name]: e.target.value });

    };

    const addMilestone = () => {
        if (milestone.title && milestone.dueDate) {
            const newMilestone: Milestone = {
                id: Date.now().toString(),
                title: milestone.title,
                description: milestone.description || '',
                dueDate: milestone.dueDate,
                order: formData.milestones.length + 1,
            };

            setFormData({
                ...formData,
                milestones: [...formData.milestones, newMilestone],
            });

            setMilestone({ title: '', description: '', dueDate: '' });
        }
    };

    const removeMilestone = (id: string) => {
        setFormData({
            ...formData,
            milestones: formData.milestones.filter(m => m.id !== id),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, 'programs'), {
                ...formData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            alert('Program created successfully!');
            navigate('/admin/programs');
        } catch (error) {
            console.error('Error creating program:', error);
            alert('Failed to create program. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout title="Add New Program">
            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Program Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g., Full Stack Development Internship 2026"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Detailed program description..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                >
                                    <option value="internship">Internship</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="training">Training</option>
                                    <option value="certification">Certification</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4 border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-800">Timeline</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline *</label>
                                <input
                                    type="date"
                                    name="applicationDeadline"
                                    value={formData.applicationDeadline}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Eligibility & Capacity */}
                    <div className="space-y-4 border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-800">Eligibility & Capacity</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria *</label>
                            <textarea
                                name="eligibility"
                                value={formData.eligibility}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g., BCA 3rd year students, Basic programming knowledge..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Students</label>
                            <input
                                type="number"
                                name="maxStudents"
                                value={formData.maxStudents}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                min="1"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fee Per Student (₹)</label>
                        <input
                            type="number"
                            name="feePerStudent"
                            value={formData.feePerStudent}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            min="0"
                            step="100"
                            required
                        />
                    </div>

                    {/* Milestones */}
                    <div className="space-y-4 border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-800">Program Milestones</h2>

                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Milestone Title</label>
                                <input
                                    type="text"
                                    value={milestone.title}
                                    onChange={(e) => setMilestone({ ...milestone, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="e.g., Project Submission Phase 1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <input
                                    type="text"
                                    value={milestone.description}
                                    onChange={(e) => setMilestone({ ...milestone, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Milestone details..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        value={milestone.dueDate}
                                        onChange={(e) => setMilestone({ ...milestone, dueDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addMilestone}
                                    className="self-end px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Add
                                </button>
                            </div>
                        </div>

                        {formData.milestones.length > 0 && (
                            <div className="space-y-2">
                                {formData.milestones.map((m) => (
                                    <div key={m.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                        <div>
                                            <p className="font-medium text-gray-800">{m.title}</p>
                                            <p className="text-sm text-gray-600">{m.description} • Due: {m.dueDate}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeMilestone(m.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-6 border-t">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Program...' : 'Create Program'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/programs')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddProgram;
