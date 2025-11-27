import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { CheckCircleIcon, XCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface Session {
    id: string;
    sessionName: string;
    dateTime: string;
    attendance: string[];
}

interface Student {
    id: string;
    name: string;
    email: string;
}

interface AttendanceTabProps {
    programId: string;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ programId }) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedSession, setSelectedSession] = useState<string>('');
    const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSessions();
        fetchStudents();
    }, [programId]);

    useEffect(() => {
        if (selectedSession) {
            loadAttendance();
        }
    }, [selectedSession]);

    const fetchSessions = async () => {
        try {
            const sessionsQuery = query(
                collection(db, 'sessions'),
                where('programId', '==', programId)
            );
            const sessionsSnap = await getDocs(sessionsQuery);
            const sessionsData = sessionsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Session[];

            setSessions(sessionsData);
            if (sessionsData.length > 0) {
                setSelectedSession(sessionsData[0].id);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const enrollmentsQuery = query(
                collection(db, 'programEnrollments'),
                where('programId', '==', programId)
            );
            const enrollmentsSnap = await getDocs(enrollmentsQuery);

            const studentsData = [];
            for (const enrollDoc of enrollmentsSnap.docs) {
                const enrollment = enrollDoc.data();
                const studentDoc = await getDocs(query(
                    collection(db, 'students'),
                    where('__name__', '==', enrollment.studentId)
                ));

                if (!studentDoc.empty) {
                    const student = studentDoc.docs[0].data();
                    studentsData.push({
                        id: enrollment.studentId,
                        name: student.name,
                        email: student.email
                    });
                }
            }

            setStudents(studentsData);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAttendance = () => {
        const session = sessions.find(s => s.id === selectedSession);
        if (session) {
            const attendanceMap: { [key: string]: boolean } = {};
            students.forEach(student => {
                attendanceMap[student.id] = session.attendance.includes(student.id);
            });
            setAttendance(attendanceMap);
        }
    };

    const toggleAttendance = (studentId: string) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    };

    const handleSaveAttendance = async () => {
        setSaving(true);
        try {
            const presentStudents = Object.keys(attendance).filter(id => attendance[id]);

            await updateDoc(doc(db, 'sessions', selectedSession), {
                attendance: presentStudents
            });

            alert('Attendance saved successfully!');
            fetchSessions();
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Failed to save attendance');
        } finally {
            setSaving(false);
        }
    };

    const calculateAttendancePercentage = (studentId: string) => {
        const totalSessions = sessions.length;
        if (totalSessions === 0) return 0;

        const attendedSessions = sessions.filter(s => s.attendance.includes(studentId)).length;
        return ((attendedSessions / totalSessions) * 100).toFixed(1);
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading attendance data...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Attendance Management</h3>
            </div>

            {sessions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No sessions available yet</p>
                </div>
            ) : (
                <>
                    {/* Session Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Session</label>
                        <select
                            value={selectedSession}
                            onChange={(e) => setSelectedSession(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            {sessions.map(session => (
                                <option key={session.id} value={session.id}>
                                    {session.sessionName} - {new Date(session.dateTime).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Attendance List */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Overall %</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {students.map((student) => {
                                const percentage = calculateAttendancePercentage(student.id);
                                return (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{student.email}</td>
                                        <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            parseFloat(percentage as string) >= 75 ? 'bg-green-100 text-green-800' :
                                parseFloat(percentage as string) >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                        }`}>
                          {percentage}%
                        </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleAttendance(student.id)}
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                                                    attendance[student.id]
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                            >
                                                {attendance[student.id] ? (
                                                    <>
                                                        <CheckCircleIcon className="w-5 h-5" />
                                                        Present
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircleIcon className="w-5 h-5" />
                                                        Absent
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveAttendance}
                            disabled={saving}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AttendanceTab;
