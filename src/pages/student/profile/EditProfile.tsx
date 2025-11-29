import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
    ArrowLeftIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    college?: string;
    degree?: string;
    year?: string;
    bio?: string;
    skills?: string[];
    photoURL?: string;
}

const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [student, setStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        college: '',
        degree: '',
        year: '',
        bio: '',
        skills: [] as string[]
    });
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        if (user) {
            fetchStudent();
        }
    }, [user]);

    const fetchStudent = async () => {
        try {
            const studentsQuery = query(
                collection(db, 'students'),
                where('email', '==', user?.email)
            );
            const studentsSnap = await getDocs(studentsQuery);

            if (!studentsSnap.empty) {
                const studentData = {
                    id: studentsSnap.docs[0].id,
                    ...studentsSnap.docs[0].data()
                } as Student;

                setStudent(studentData);
                setFormData({
                    name: studentData.name || '',
                    phone: studentData.phone || '',
                    college: studentData.college || '',
                    degree: studentData.degree || '',
                    year: studentData.year || '',
                    bio: studentData.bio || '',
                    skills: studentData.skills || []
                });
            }
        } catch (error) {
            console.error('Error fetching student:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!student) return;

        setSaving(true);
        try {
            await updateDoc(doc(db, 'students', student.id), {
                name: formData.name,
                phone: formData.phone,
                college: formData.college,
                degree: formData.degree,
                year: formData.year,
                bio: formData.bio,
                skills: formData.skills
            });

            navigate('/student/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/student/profile')}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Profile
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                <p className="text-gray-600 mt-2">Update your personal information</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email (Cannot be changed)
                            </label>
                            <input
                                type="email"
                                value={student?.email || ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="+91 1234567890"
                            />
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                College/University
                            </label>
                            <input
                                type="text"
                                value={formData.college}
                                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Your college name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Degree/Course
                                </label>
                                <input
                                    type="text"
                                    value={formData.degree}
                                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="e.g., B.Tech CSE"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Year
                                </label>
                                <select
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    <option value="">Select year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="Graduate">Graduate</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About You</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Tell us about yourself..."
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            {formData.bio.length}/500 characters
                        </p>
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Interests</h2>

                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Add a skill (e.g., React, Python)"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                            >
                                Add
                            </button>
                        </div>

                        {formData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                    {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="hover:bg-blue-200 rounded-full p-0.5 transition"
                                        >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckIcon className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/student/profile')}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-semibold"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
