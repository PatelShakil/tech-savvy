import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuthState } from '../../pages/admin/states/UseAuthState';
import { ChatBubbleLeftIcon, CheckCircleIcon, ClockIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface SupportTicket {
    id: string;
    programId: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    subject: string;
    status: 'open' | 'resolved';
    messages: TicketMessage[];
    createdAt: any;
    updatedAt: any;
}

interface TicketMessage {
    sender: string;
    senderType: 'admin' | 'student';
    message: string;
    timestamp: any;
}

interface SupportPanelProps {
    programId: string;
}

const SupportPanel: React.FC<SupportPanelProps> = ({ programId }) => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('open');
    const { user } = useAuthState();

    useEffect(() => {
        fetchTickets();

        // Real-time listener for tickets
        const ticketsQuery = query(
            collection(db, 'supportTickets'),
            where('programId', '==', programId),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(ticketsQuery, (snapshot) => {
            const ticketsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SupportTicket[];
            setTickets(ticketsData);

            // Update selected ticket if it's still in the list
            if (selectedTicket) {
                const updated = ticketsData.find(t => t.id === selectedTicket.id);
                if (updated) setSelectedTicket(updated);
            }
        });

        return () => unsubscribe();
    }, [programId]);

    const fetchTickets = async () => {
        try {
            const ticketsQuery = query(
                collection(db, 'supportTickets'),
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

    const handleSendReply = async () => {
        if (!replyMessage.trim() || !selectedTicket) return;

        setSending(true);
        try {
            const newMessage: TicketMessage = {
                sender: user?.email || 'Admin',
                senderType: 'admin',
                message: replyMessage.trim(),
                timestamp: serverTimestamp(),
            };

            const updatedMessages = [...selectedTicket.messages, newMessage];

            await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
                messages: updatedMessages,
                updatedAt: serverTimestamp(),
            });

            setReplyMessage('');
        } catch (error) {
            console.error('Error sending reply:', error);
            alert('Failed to send reply');
        } finally {
            setSending(false);
        }
    };

    const handleMarkResolved = async (ticketId: string) => {
        try {
            await updateDoc(doc(db, 'supportTickets', ticketId), {
                status: 'resolved',
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error updating ticket status:', error);
            alert('Failed to update status');
        }
    };

    const handleMarkOpen = async (ticketId: string) => {
        try {
            await updateDoc(doc(db, 'supportTickets', ticketId), {
                status: 'open',
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error updating ticket status:', error);
            alert('Failed to update status');
        }
    };

    const getFilteredTickets = () => {
        switch (filter) {
            case 'open':
                return tickets.filter(t => t.status === 'open');
            case 'resolved':
                return tickets.filter(t => t.status === 'resolved');
            default:
                return tickets;
        }
    };

    const filteredTickets = getFilteredTickets();

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading support tickets...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Tickets List */}
            <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">Support Tickets</h3>

                    {/* Filter */}
                    <div className="flex gap-2">
                        {['all', 'open', 'resolved'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition ${
                                    filter === f
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredTickets.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">No tickets found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredTickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                                        selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <p className="font-medium text-gray-800 text-sm">{ticket.studentName}</p>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            ticket.status === 'open'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                      {ticket.status}
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">{ticket.subject}</p>
                                    <p className="text-xs text-gray-500">
                                        {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                {selectedTicket ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-800">{selectedTicket.subject}</h3>
                                <p className="text-sm text-gray-600">{selectedTicket.studentName} • {selectedTicket.studentEmail}</p>
                            </div>
                            <div className="flex gap-2">
                                {selectedTicket.status === 'open' ? (
                                    <button
                                        onClick={() => handleMarkResolved(selectedTicket.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                                    >
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Mark Resolved
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleMarkOpen(selectedTicket.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                    >
                                        <ClockIcon className="w-4 h-4" />
                                        Reopen
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {selectedTicket.messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                            msg.senderType === 'admin'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-800 border border-gray-200'
                                        }`}
                                    >
                                        <p className="text-sm font-medium mb-1">{msg.sender}</p>
                                        <p className="text-sm">{msg.message}</p>
                                        <p className={`text-xs mt-1 ${
                                            msg.senderType === 'admin' ? 'text-blue-100' : 'text-gray-500'
                                        }`}>
                                            {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleString('en-IN') : 'Just now'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Box */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendReply()}
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    disabled={sending}
                                />
                                <button
                                    onClick={handleSendReply}
                                    disabled={sending || !replyMessage.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <ChatBubbleLeftIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p>Select a ticket to view conversation</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportPanel;
