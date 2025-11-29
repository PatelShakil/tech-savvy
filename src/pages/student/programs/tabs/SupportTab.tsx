import React, { useEffect, useState, useRef } from 'react';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    orderBy,
    onSnapshot,
    arrayUnion
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import {
    LifebuoyIcon,
    PlusIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    CheckCircleIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    ArrowLeftIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';


interface TicketMessage {
    sender: string;
    senderType: 'admin' | 'student';
    message: string;
    timestamp: any;
}

interface SupportTicket {
    id: string;
    programId: string;
    studentId: string;
    studentName: string;
    subject: string;
    status: 'open' | 'resolved';
    messages: TicketMessage[];
    createdAt: any;
    updatedAt: any;
    priority: 'low' | 'medium' | 'high';
}

interface SupportTabProps {
    programId: string;
    student: any;
}

const SupportTab: React.FC<SupportTabProps> = ({ programId, student }) => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (student?.id) {
            fetchTickets();
        }
    }, [student?.id, programId]);

    // Real-time listener for selected ticket messages
    useEffect(() => {
        if (!selectedTicket?.id) return;

        const unsubscribe = onSnapshot(
            doc(db, 'supportTickets', selectedTicket.id),
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const updatedTicket = {
                        id: docSnapshot.id,
                        ...docSnapshot.data()
                    } as SupportTicket;
                    setSelectedTicket(updatedTicket);

                    // Scroll to bottom when new message arrives
                    setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }
        );

        return () => unsubscribe();
    }, [selectedTicket?.id]);

    const fetchTickets = async () => {
        try {
            const ticketsQuery = query(
                collection(db, 'supportTickets'),
                where('studentId', '==', student.id),
                where('programId', '==', programId),
                orderBy('updatedAt', 'desc')
            );
            const ticketsSnap = await getDocs(ticketsQuery);
            const ticketsData = ticketsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SupportTicket[];

            setTickets(ticketsData);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!student?.id) return;

        setSubmitting(true);
        try {
            const initialMessage: TicketMessage = {
                sender: student.name + " (Web)",
                senderType: 'student',
                message: formData.description,
                timestamp: new Date()
            };

            await addDoc(collection(db, 'supportTickets'), {
                programId,
                studentId: student.id,
                studentName: student.name,
                subject: formData.subject,
                description: formData.description,
                priority: formData.priority,
                status: 'open',
                messages: [initialMessage],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            setFormData({ subject: '', description: '', priority: 'medium' });
            setShowCreateForm(false);
            await fetchTickets();
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Failed to create ticket');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTicket || !student?.id) return;

        setSendingMessage(true);
        try {
            const message: TicketMessage = {
                sender: student.name + " (Web)",
                senderType: 'student',
                message: newMessage.trim(),
                timestamp: new Date()
            };

            await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
                messages: arrayUnion(message),
                updatedAt: serverTimestamp(),
                status: selectedTicket.status === 'resolved' ? 'open' : selectedTicket.status
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        } finally {
            setSendingMessage(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            open: { text: 'Open', class: 'bg-blue-100 text-blue-800', icon: ClockIcon },
            'in-progress': { text: 'In Progress', class: 'bg-yellow-100 text-yellow-800', icon: ChatBubbleLeftRightIcon },
            resolved: { text: 'Resolved', class: 'bg-green-100 text-green-800', icon: CheckCircleIcon }
        };
        return badges[status as keyof typeof badges] || badges.open;
    };

    const getPriorityBadge = (priority: string) => {
        const badges = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-red-100 text-red-800'
        };
        return badges[priority as keyof typeof badges] || badges.medium;
    };

    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Chat View - When ticket is selected
    if (selectedTicket) {
        const statusBadge = getStatusBadge(selectedTicket.status);
        const StatusIcon = statusBadge.icon;

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSelectedTicket(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge.class}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusBadge.text}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getPriorityBadge(selectedTicket.priority)}`}>
                                {selectedTicket.priority} Priority
                            </span>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Messages Area */}
                    <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
                        {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                            selectedTicket.messages.map((message, index) => {
                                const isOwnMessage = message.senderType === 'student';

                                return (
                                    <div
                                        key={index}
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                            {!isOwnMessage && (
                                                <div className="flex items-center gap-2 mb-1 px-1">
                                                    <UserCircleIcon className="w-4 h-4 text-gray-600" />
                                                    <span className="text-xs font-semibold text-gray-700">
                                                        {message.sender || 'Support Team'}
                                                    </span>
                                                </div>
                                            )}
                                            <div
                                                className={`rounded-2xl px-4 py-2 ${
                                                    isOwnMessage
                                                        ? 'bg-blue-600 text-white rounded-br-none'
                                                        : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                                                }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                            </div>
                                            <div className={`text-xs text-gray-500 mt-1 px-1 ${
                                                isOwnMessage ? 'text-right' : 'text-left'
                                            }`}>
                                                {formatTimestamp(message.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">No messages yet</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    {selectedTicket.status !== 'resolved' && (
                        <form
                            onSubmit={handleSendMessage}
                            className="border-t border-gray-200 p-4 bg-white"
                        >
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sendingMessage}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <span>Send</span>
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    )}

                    {selectedTicket.status === 'resolved' && (
                        <div className="border-t border-gray-200 p-4 bg-green-50 text-center">
                            <CheckCircleIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-green-800 font-medium">
                                This ticket has been resolved
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // List View - Default
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Support Center</h2>
                    <p className="text-gray-600 mt-1">Get help from our support team</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                >
                    {showCreateForm ? (
                        <>
                            <XMarkIcon className="w-5 h-5" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <PlusIcon className="w-5 h-5" />
                            New Ticket
                        </>
                    )}
                </button>
            </div>

            {/* Create Ticket Form */}
            {showCreateForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Support Ticket</h3>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Brief description of your issue"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Provide detailed information about your issue..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Creating...' : 'Create Ticket'}
                        </button>
                    </form>
                </div>
            )}

            {/* Tickets List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Tickets</h3>

                {tickets.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <LifebuoyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No support tickets</h3>
                        <p className="text-gray-600 mb-4">You haven't created any support tickets yet</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Create Your First Ticket
                        </button>
                    </div>
                ) : (
                    tickets.map((ticket) => {
                        const statusBadge = getStatusBadge(ticket.status);
                        const StatusIcon = statusBadge.icon;
                        const lastMessage = ticket.messages?.[ticket.messages.length - 1];

                        return (
                            <button
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition text-left"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                            {ticket.subject}
                                        </h4>
                                        {lastMessage && (
                                            <p className="text-sm text-gray-600 line-clamp-1">
                                                {lastMessage.senderType === 'admin' ? '🎧 Support: ' : 'You: '}
                                                {lastMessage.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}>
                                            <StatusIcon className="w-4 h-4" />
                                            {statusBadge.text}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPriorityBadge(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {formatTimestamp(ticket.updatedAt)}
                                    </span>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>

            {/* Quick Help */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3">💡 Quick Help</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Response time: Usually within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Click on a ticket to view conversation and send messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>For urgent issues, mark priority as "High"</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SupportTab;
