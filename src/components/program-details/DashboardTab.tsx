import React from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';

interface DashboardTabProps {
    program: any;
    stats: {
        totalStudents: number;
        totalGroups: number;
        feesCollected: number;
        feesPending: number;
        pendingApplications: number;
    };
}

const DashboardTab: React.FC<DashboardTabProps> = ({ program, stats }) => {
    const totalExpectedRevenue = stats.totalStudents * program.feePerStudent;
    const collectionRate = totalExpectedRevenue > 0
        ? ((stats.feesCollected / totalExpectedRevenue) * 100).toFixed(1)
        : 0;


    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Program Overview</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Program Category:</span>
                            <span className="font-medium text-black capitalize">{program.category && program.category}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium text-black">{program.startDate} to {program.endDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Application Deadline:</span>
                            <span className="font-medium text-black">{program.applicationDeadline}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Max Students:</span>
                            <span className="font-medium text-black">{program.maxStudents}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Fee Per Student:</span>
                            <span className="font-medium text-green-600">₹{program.feePerStudent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Enrolled Students:</span>
                            <span className="font-medium text-green-600 ">{stats.totalStudents}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Expected Revenue:</span>
                            <span className="font-medium text-green-600">₹{totalExpectedRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Collection Rate:</span>
                            <span className="font-medium text-green-600">{collectionRate}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500 p-3 rounded-lg">
                                <BanknotesIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-green-700">Fees Collected</p>
                                <p className="text-2xl font-bold text-green-800">₹{stats.feesCollected.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-500 p-3 rounded-lg">
                                <BanknotesIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-orange-700">Fees Pending</p>
                                <p className="text-2xl font-bold text-orange-800">₹{stats.feesPending.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500 p-3 rounded-lg">
                                <BanknotesIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-700">Total Expected</p>
                                <p className="text-2xl font-bold text-blue-800">₹{totalExpectedRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Eligibility Criteria</h3>
                <p className="text-gray-700 whitespace-pre-line">{program.eligibility}</p>
            </div>

            {program.milestones && program.milestones.length > 0 && (
                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Program Milestones</h3>
                    <div className="space-y-3">
                        {program.milestones.map((milestone: any, index: number) => (
                            <div key={milestone.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800">{milestone.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                                    <p className="text-xs text-gray-500 mt-2">Due: {milestone.dueDate}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardTab;
