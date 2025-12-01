import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {collection, addDoc, doc, getDoc, serverTimestamp} from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const ProgramApplicationForm: React.FC = () => {
    const { programId } = useParams<{ programId: string }>();
    const navigate = useNavigate();
    const [program, setProgram] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        year: '',
        reason: '',
        portfolio: '',
    });

    useEffect(() => {
        if (programId) {
            fetchProgram();
        }
    }, [programId]);

    const fetchProgram = async () => {
        try {
            const docRef = doc(db, 'programs', programId!);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProgram({ id: docSnap.id, ...docSnap.data() });
            } else {
                alert('Program not found');
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching program:', error);
            alert('Failed to load program');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await addDoc(collection(db, 'applications'), {
                programId: programId,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                college: formData.college,
                year: formData.year,
                reason: formData.reason || "",
                portfolio: formData.portfolio || null,
                status: 'pending',
                submittedAt: serverTimestamp(),
            });

            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!program) {
        return (
            <div className="min-h-screen mt-5 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-gray-600">Program not found</div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen mt-5 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for applying to <strong>{program.name}</strong>.
                        We will review your application and get back to you soon.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                        <p className="text-sm text-blue-800 font-medium mb-2">What's Next?</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Your application is now under review</li>
                            <li>• You'll receive an email once it's approved</li>
                            <li>• Check your email for login credentials</li>
                        </ul>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-5 bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Program Info */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{program.name}</h1>
                    <p className="text-gray-600 mb-4">{program.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Duration</p>
                            <p className="font-medium text-gray-800">{program.startDate} to {program.endDate}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Application Deadline</p>
                            <p className="font-medium text-gray-800">{program.applicationDeadline}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Fee</p>
                            <p className="font-medium text-gray-800">₹{program.feePerStudent?.toLocaleString()}</p>
                        </div>
                        <p className={"text-gray-700 text-sm lg:col-span-3"}>**Notes : This fee includes cost of server, live sessions recordings and certifications.</p>
                    </div>
                </div>

                {/* Application Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply for this Program</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="1234567890"
                                            required
                                            pattern="[0-9]{10}"
                                            title="Please enter a valid 10-digit phone number"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">College/Institution *</label>
                                    <input
                                        type="text"
                                        name="college"
                                        value={formData.college}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="e.g., Veer Narmad South Gujarat University"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study *</label>
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="">Select year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                        <option value="Final Year">Final Year</option>
                                        <option value="Graduate">Graduate</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Why do you want to join this program?
                                    </label>
                                    <textarea
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Tell us about your motivation, goals, and what you hope to learn..."
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Minimum 50 characters</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Portfolio/GitHub (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        name="portfolio"
                                        value={formData.portfolio}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="https://github.com/yourusername or your portfolio link"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Eligibility Notice */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-yellow-800 mb-2">Eligibility Criteria:</p>
                            <p className="text-sm text-yellow-700 whitespace-pre-line">{program.eligibility}</p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProgramApplicationForm;
