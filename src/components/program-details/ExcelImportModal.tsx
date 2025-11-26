import React, { useState } from 'react';
import {collection, addDoc, serverTimestamp, doc, updateDoc} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase.ts';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

interface ExcelImportModalProps {
    programId: string;
    feePerStudent: number;
    onClose: () => void;
    onSuccess: () => void;
}

interface StudentRow {
    name: string;
    email: string;
    phone: string;
    password: string;
    groupName?: string;
    feeStatus?: string;
}

const ExcelImportModal: React.FC<ExcelImportModalProps> = ({ programId, feePerStudent, onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [students, setStudents] = useState<StudentRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const downloadTemplate = () => {
        const template = [
            { name: 'John Doe', email: 'john@example.com', phone: '1234567890', password: 'password123', groupName: 'Group A', feeStatus: 'pending' },
            { name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210', password: 'password456', groupName: 'Group A', feeStatus: 'paid' },
            { name: 'Bob Wilson', email: 'bob@example.com', phone: '5555555555', password: 'password789', groupName: 'Group B', feeStatus: 'pending' },
        ];

        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students');
        XLSX.writeFile(wb, 'students_template.xlsx');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseExcel(selectedFile);
            console.log(file)
        }
    };

    const parseExcel = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet) as StudentRow[];

                // Validate data
                const validationErrors: string[] = [];
                const validStudents: StudentRow[] = [];

                jsonData.forEach((row, index) => {
                    const rowNum = index + 2; // +2 because row 1 is header

                    if (!row.name) validationErrors.push(`Row ${rowNum}: Name is required`);
                    if (!row.email) validationErrors.push(`Row ${rowNum}: Email is required`);
                    if (!row.phone) validationErrors.push(`Row ${rowNum}: Phone is required`);
                    if (!row.password) validationErrors.push(`Row ${rowNum}: Password is required`);
                    if (row.password && row.password.length < 6) {
                        validationErrors.push(`Row ${rowNum}: Password must be at least 6 characters`);
                    }

                    if (row.name && row.email && row.phone && row.password) {
                        validStudents.push({
                            ...row,
                            feeStatus: row.feeStatus?.toLowerCase() === 'paid' ? 'paid' : 'pending',
                        });
                    }
                });

                setErrors(validationErrors);
                setStudents(validStudents);
            } catch (error) {
                console.error('Error parsing Excel:', error);
                setErrors(['Failed to parse Excel file. Please check the format.']);
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleImport = async () => {
        if (students.length === 0) {
            alert('No valid students to import');
            return;
        }

        setLoading(true);
        const importErrors: string[] = [];
        let successCount = 0;

        try {
            // Group students by groupName
            const groupedStudents = students.reduce((acc, student) => {
                const groupName = student.groupName || 'Default Group';
                if (!acc[groupName]) acc[groupName] = [];
                acc[groupName].push(student);
                return acc;
            }, {} as Record<string, StudentRow[]>);

            // Process each group
            for (const [groupName, groupStudents] of Object.entries(groupedStudents)) {
                try {
                    // Create group
                    const groupRef = await addDoc(collection(db, 'groups'), {
                        programId: programId,
                        groupName: groupName,
                        members: [],
                        projectTitle: '',
                        totalFee: groupStudents.length * feePerStudent,
                        createdAt: serverTimestamp(),
                    });

                    const memberIds: string[] = [];

                    // Add each student in the group
                    for (const student of groupStudents) {
                        try {
                            // Create Firebase Auth account
                            const userCredential = await createUserWithEmailAndPassword(
                                auth,
                                student.email,
                                student.password
                            );
                            const userId = userCredential.user.uid;

                            // Add to students collection
                            const studentRef = await addDoc(collection(db, 'students'), {
                                uid: userId,
                                name: student.name,
                                email: student.email,
                                phone: student.phone,
                                status: 'active',
                                createdAt: serverTimestamp(),
                            });

                            memberIds.push(studentRef.id);

                            // Add enrollment
                            await addDoc(collection(db, 'programEnrollments'), {
                                programId: programId,
                                studentId: studentRef.id,
                                groupId: groupRef.id,
                                feeStatus: student.feeStatus || 'pending',
                                feeAmount: feePerStudent,
                                joinedAt: serverTimestamp(),
                            });

                            successCount++;
                        } catch (error: any) {
                            importErrors.push(`${student.name} (${student.email}): ${error.message}`);
                        }
                    }

                    // Update group with member IDs
                    await updateDoc(doc(db, 'groups', groupRef.id), {
                        members: memberIds,
                    });

                } catch (error: any) {
                    importErrors.push(`Group ${groupName}: ${error.message}`);
                }
            }

            if (successCount > 0) {
                alert(`Successfully imported ${successCount} student(s)!`);
                if (importErrors.length > 0) {
                    console.error('Import errors:', importErrors);
                    alert(`${importErrors.length} error(s) occurred. Check console for details.`);
                }
                onSuccess();
            } else {
                alert('Failed to import any students. Please check the data.');
            }

        } catch (error: any) {
            console.error('Import error:', error);
            alert('Import failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Import Students from Excel</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Download Template */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 mb-3">
                            Download the template file, fill in student details, and upload it back.
                        </p>
                        <button
                            onClick={downloadTemplate}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Download Template
                        </button>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Validation Errors */}
                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-red-800 mb-2">Validation Errors:</p>
                            <ul className="text-sm text-red-700 space-y-1">
                                {errors.map((error, index) => (
                                    <li key={index}>• {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Preview */}
                    {students.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Preview ({students.length} student{students.length !== 1 ? 's' : ''})
                            </p>
                            <div className="border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-700">Phone</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-700">Group</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-700">Fee Status</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {students.map((student, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-2">{student.name}</td>
                                            <td className="px-4 py-2">{student.email}</td>
                                            <td className="px-4 py-2">{student.phone}</td>
                                            <td className="px-4 py-2">{student.groupName || 'Default'}</td>
                                            <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.feeStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {student.feeStatus || 'pending'}
                          </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            onClick={handleImport}
                            disabled={loading || students.length === 0 || errors.length > 0}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Importing...' : `Import ${students.length} Student${students.length !== 1 ? 's' : ''}`}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExcelImportModal;
