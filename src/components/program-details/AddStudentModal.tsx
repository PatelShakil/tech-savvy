import React, { useState, useEffect } from 'react';
import {collection, addDoc,setDoc, getDocs, query, where, serverTimestamp, updateDoc, doc} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {auth, db} from "../../firebase.ts";

interface AddStudentModalProps {
    programId: string;
    feePerStudent: number;
    onClose: () => void;
    onSuccess: () => void;
}

interface Group {
    id: string;
    groupName: string;
    members: string[];
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ programId, feePerStudent, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        groupId: '',
        feeStatus: 'pending' as 'paid' | 'pending',
    });
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [createNewGroup, setCreateNewGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const groupsQuery = query(
                collection(db, 'groups'),
                where('programId', '==', programId)
            );
            const groupsSnap = await getDocs(groupsQuery);
            const groupsData = groupsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Group[];

            setGroups(groupsData);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create Firebase Auth account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const userId = userCredential.user.uid;

            // Add student to students collection
            await setDoc(doc(db, "students", userId), {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                status: "active",
                uid: userId,
                createdAt: serverTimestamp(),
            }, { merge: true });


            let groupId = formData.groupId;

            // Create new group if requested
            if (createNewGroup && newGroupName) {
                const groupRef = await addDoc(collection(db, 'groups'), {
                    programId: programId,
                    groupName: newGroupName,
                    members: [userId],
                    projectTitle: '',
                    totalFee: feePerStudent,
                    createdAt: serverTimestamp(),
                });
                groupId = groupRef.id;
            } else if (groupId) {
                // Update existing group members
                const group = groups.find(g => g.id === groupId);
                if (group) {
                    const updatedMembers = [...group.members, userId];
                    await updateDoc(doc(db, 'groups', groupId), {
                        members: updatedMembers,
                        totalFee: updatedMembers.length * feePerStudent,
                    });
                }
            }

            // Add enrollment
            await addDoc(collection(db, 'programEnrollments'), {
                programId: programId,
                studentId: userId,
                groupId: groupId || '',
                feeStatus: formData.feeStatus,
                feeAmount: feePerStudent,
                joinedAt: serverTimestamp(),
            });

            alert('Student added successfully!');
            onSuccess();
        } catch (error: any) {
            console.error('Error adding student:', error);
            alert(error.message || 'Failed to add student. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Add New Student</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Student full name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="student@example.com"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="1234567890"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Minimum 6 characters"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Group Assignment</label>

                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="groupOption"
                                    checked={!createNewGroup}
                                    onChange={() => setCreateNewGroup(false)}
                                    className="mr-2"
                                />
                                <label className="text-sm text-gray-700">Assign to existing group</label>
                            </div>

                            {!createNewGroup && (
                                <select
                                    name="groupId"
                                    value={formData.groupId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    <option value="">Select a group (optional)</option>
                                    {groups.map(group => (
                                        <option key={group.id} value={group.id}>
                                            {group.groupName} ({group.members.length} members)
                                        </option>
                                    ))}
                                </select>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="groupOption"
                                    checked={createNewGroup}
                                    onChange={() => setCreateNewGroup(true)}
                                    className="mr-2"
                                />
                                <label className="text-sm text-gray-700">Create new group</label>
                            </div>

                            {createNewGroup && (
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Enter new group name"
                                    required={createNewGroup}
                                />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fee Status</label>
                        <select
                            name="feeStatus"
                            value={formData.feeStatus}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Fee Amount: ₹{feePerStudent.toLocaleString()}</p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding Student...' : 'Add Student'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
