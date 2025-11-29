export interface Program {
    id?: string;
    name: string;
    description: string;
    category: string;
    status: 'active' | 'upcoming' | 'completed' | 'archived';
    startDate: string;
    endDate: string;
    applicationDeadline: string;
    eligibility: string;
    maxStudents: number;
    feePerStudent: number; // NEW
    milestones: Milestone[];
    mentors: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    order: number;
}

export interface Student {
    id?: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    status: 'active' | 'suspended' | 'pending';
    createdAt: Date;
}

export interface Group {
    id?: string;
    programId: string;
    groupName: string;
    members: string[]; // student IDs
    projectTitle: string;
    mentorId?: string;
    totalFee: number;
    createdAt: Date;
}

export interface Enrollment {
    id?: string;
    programId: string;
    studentId: string;
    groupId: string;
    feeStatus: 'paid' | 'pending';
    feeAmount: number;
    joinedAt: any;
}

export interface Session {
    id?: string;
    programId: string;
    sessionName: string;
    description: string;
    tags: string[];
    meetingLink: string;
    dateTime: string;
    attachments?: string[];
    attendance: string[]; // student IDs
    createdAt: Date;
}

export interface Application {
    id?: string;
    programId: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    reason: string;
    portfolio?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
}

export interface SupportTicket {
    id?: string;
    programId: string;
    studentId: string;
    studentName: string;
    subject: string;
    status: 'open' | 'resolved';
    messages: TicketMessage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface TicketMessage {
    sender: string;
    senderType: 'admin' | 'student';
    message: string;
    timestamp: Date;
}

export interface GroupChatMessage {
    id?: string;
    programId: string;
    senderId: string;
    senderName: string;
    senderType: 'admin' | 'student';
    message: string;
    timestamp: Date;
    isHidden: boolean;
    isPinned: boolean;
}
// Web Admin - TypeScript
// interface Recording {
//     id: string;
//     programId: string;
//     sessionId?: string; // Optional link to session
//     title: string;
//     description: string;
//     youtubeUrl: string;
//     thumbnailUrl?: string;
//     duration?: string;
//     tags: string[];
//     uploadedAt: any;
//     uploadedBy: string;
//     views: number;
// }
