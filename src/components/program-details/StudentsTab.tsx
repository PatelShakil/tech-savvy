import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { PlusIcon, ArrowUpTrayIcon} from '@heroicons/react/24/outline';
import { getDoc, updateDoc } from 'firebase/firestore'; // Add these
import {db} from "../../firebase.ts";
import AddStudentModal from "./AddStudentModal.tsx";
import ExcelImportModal from "./ExcelImportModal.tsx";

interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
}

interface Enrollment {
    id: string;
    studentId: string;
    groupId: string;
    feeStatus: string;
    feeAmount: number;
}

interface StudentsTabProps {
    programId: string;
    feePerStudent: number;
    onUpdate: () => void;
}

const StudentsTab: React.FC<StudentsTabProps> = ({ programId, feePerStudent, onUpdate }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showExcelModal, setShowExcelModal] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, [programId]);

    const fetchStudents = async () => {
        try {
            // Fetch enrollments for this program
            const enrollmentsQuery = query(
                collection(db, 'programEnrollments'),
                where('programId', '==', programId)
            );
            const enrollmentsSnap = await getDocs(enrollmentsQuery);
            const enrollmentsData = enrollmentsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Enrollment[];

            setEnrollments(enrollmentsData);

            // Fetch student details
            const studentIds = enrollmentsData.map(e => e.studentId);
            if (studentIds.length > 0) {
                const studentsPromises = studentIds.map(id =>
                    getDoc(doc(db, 'students', id))
                );
                const studentsSnaps = await Promise.all(studentsPromises);
                const studentsData = studentsSnaps
                    .filter(snap => snap.exists())
                    .map(snap => ({ id: snap.id, ...snap.data() })) as Student[];

                setStudents(studentsData);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async (studentId: string) => {
        if (window.confirm('Are you sure you want to suspend this student?')) {
            try {
                await updateDoc(doc(db, 'students', studentId), {
                    status: 'suspended'
                });
                fetchStudents();
                alert('Student suspended successfully');
            } catch (error) {
                console.error('Error suspending student:', error);
                alert('Failed to suspend student');
            }
        }
    };

    const handleActivate = async (studentId: string) => {
        try {
            await updateDoc(doc(db, 'students', studentId), {
                status: 'active'
            });
            fetchStudents();
            alert('Student activated successfully');
        } catch (error) {
            console.error('Error activating student:', error);
            alert('Failed to activate student');
        }
    };

    const getEnrollmentForStudent = (studentId: string) => {
        return enrollments.find(e => e.studentId === studentId);
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading students...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Enrolled Students</h3>
                    <p className="text-sm text-gray-600 mt-1">Total: {students.length} students</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowExcelModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        Import Excel
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Student
                    </button>
                </div>
            </div>

            {students.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600 mb-4">No students enrolled yet</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add First Student
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fee Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {students.map((student) => {
                            const enrollment = getEnrollmentForStudent(student.id);
                            return (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{student.name}</p>
                                            <p className="text-sm text-gray-500">{student.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {student.phone}
                                    </td>
                                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === 'active' ? 'bg-green-100 text-green-800' :
                              student.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {enrollment && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                enrollment.feeStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                                    'bg-orange-100 text-orange-800'
                                            }`}>
                          {enrollment.feeStatus === 'paid' ? '✓ Paid' : 'Pending'}
                        </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {student.status === 'active' ? (
                                            <button
                                                onClick={() => handleSuspend(student.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Suspend
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleActivate(student.id)}
                                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                                            >
                                                Activate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Student Modal */}
            {showAddModal && (
                <AddStudentModal
                    programId={programId}
                    feePerStudent={feePerStudent}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        fetchStudents();
                        onUpdate();
                        setShowAddModal(false);
                    }}
                />
            )}

            {/* Excel Import Modal */}
            {showExcelModal && (
                <ExcelImportModal
                    programId={programId}
                    feePerStudent={feePerStudent}
                    onClose={() => setShowExcelModal(false)}
                    onSuccess={() => {
                        fetchStudents();
                        onUpdate();
                        setShowExcelModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default StudentsTab;
