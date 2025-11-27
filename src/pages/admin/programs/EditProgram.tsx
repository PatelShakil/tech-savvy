import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import AdminLayout from '../../../components/admin/AdminLayout';
import { PlusIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Milestone {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    order: number;
}

const EditProgram: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'internship',
        status: 'upcoming',
        startDate: '',
        endDate: '',
        applicationDeadline: '',
        maxStudents: '',
        feePerStudent: '',
        minGroupSize: '',
        maxGroupSize: ''
    });

    const [milestones, setMilestones] = useState<Milestone[]>([]);

    useEffect(() => {
        if (id) {
            fetchProgram();
        }
    }, [id]);

    const fetchProgram = async () => {
        try {
            const docRef = doc(db, 'programs', id!);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    category: data.category || 'internship',
                    status: data.status || 'upcoming',
                    startDate: data.startDate || '',
                    endDate: data.endDate || '',
                    applicationDeadline: data.applicationDeadline || '',
                    maxStudents: data.maxStudents?.toString() || '',
                    feePerStudent: data.feePerStudent?.toString() || '',
                    minGroupSize: data.minGroupSize?.toString() || '',
                    maxGroupSize: data.maxGroupSize?.toString() || ''
                });
                setMilestones(data.milestones || []);
            }
        } catch (error) {
            console.error('Error fetching program:', error);
            alert('Failed to load program details');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddMilestone = () => {
        const newMilestone: Milestone = {
            id: `milestone-${Date.now()}`,
            title: '',
            description: '',
            dueDate: '',
            order: milestones.length + 1
        };
        setMilestones([...milestones, newMilestone]);
    };

    const handleMilestoneChange = (index: number, field: keyof Milestone, value: string) => {
        const updatedMilestones = [...milestones];
        updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
        setMilestones(updatedMilestones);
    };

    const handleRemoveMilestone = (index: number) => {
        setMilestones(milestones.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateDoc(doc(db, 'programs', id!), {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                status: formData.status,
                startDate: formData.startDate,
                endDate: formData.endDate,
                applicationDeadline: formData.applicationDeadline,
                maxStudents: parseInt(formData.maxStudents) || 0,
                feePerStudent: parseInt(formData.feePerStudent) || 0,
                minGroupSize: parseInt(formData.minGroupSize) || 0,
                maxGroupSize: parseInt(formData.maxGroupSize) || 0,
                milestones: milestones,
                updatedAt: serverTimestamp()
            });

            alert('Program updated successfully!');
            navigate(`/admin/programs/${id}`);
        } catch (error) {
            console.error('Error updating program:', error);
            alert('Failed to update program');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Edit Program">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-600">Loading program...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Edit Program">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        to={`/admin/programs/${id}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to Program Details
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Program</h1>
                    <p className="text-gray-600 mt-1">Update program information and settings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Program Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                                    >
                                        <option value="internship">Internship</option>
                                        <option value="mentorship">Mentorship</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="training">Training</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Program Dates</h2>

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

                    {/* Program Settings */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Program Settings</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Students *</label>
                                <input
                                    type="number"
                                    name="maxStudents"
                                    value={formData.maxStudents}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fee Per Student (₹) *</label>
                                <input
                                    type="number"
                                    name="feePerStudent"
                                    value={formData.feePerStudent}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Min Group Size *</label>
                                <input
                                    type="number"
                                    name="minGroupSize"
                                    value={formData.minGroupSize}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Group Size *</label>
                                <input
                                    type="number"
                                    name="maxGroupSize"
                                    value={formData.maxGroupSize}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Milestones */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Milestones</h2>
                            <button
                                type="button"
                                onClick={handleAddMilestone}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add Milestone
                            </button>
                        </div>

                        {milestones.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No milestones added yet</p>
                        ) : (
                            <div className="space-y-4">
                                {milestones.map((milestone, index) => (
                                    <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-sm font-medium text-gray-700">Milestone {index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMilestone(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Milestone Title"
                                                value={milestone.title}
                                                onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />

                                            <textarea
                                                placeholder="Description"
                                                value={milestone.description}
                                                onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                                                rows={2}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />

                                            <input
                                                type="date"
                                                value={milestone.dueDate}
                                                onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(`/admin/programs/${id}`)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Updating...' : 'Update Program'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditProgram;
