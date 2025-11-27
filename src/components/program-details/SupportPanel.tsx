import React, {useState, useEffect, useRef} from 'react';
import { collection, query, where, updateDoc,arrayUnion, doc, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { ChatBubbleLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

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
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('open');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
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
            setLoading(false);

            // Auto-select first ticket if none selected
            if (!selectedTicket && ticketsData.length > 0) {
                setSelectedTicket(ticketsData[0]);
            }

            // Update selected ticket if it's still in the list
            if (selectedTicket) {
                const updated = ticketsData.find(t => t.id === selectedTicket.id);
                if (updated) setSelectedTicket(updated);
            }
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [programId, selectedTicket]);


    const handleSendMessage = async () => {
        if (!replyMessage.trim() || !selectedTicket) return;

        try {
            // const newMessage: TicketMessage = {
            //     sender: 'Admin',
            //     senderType: 'admin',
            //     message: replyMessage,
            //     timestamp: serverTimestamp()
            // };

            // await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
            //     messages: [...selectedTicket.messages, newMessage],
            //     updatedAt: serverTimestamp()
            // });
            await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
                messages: arrayUnion({
                    sender: 'Admin',
                    senderType: 'admin',
                    message: replyMessage.trim(),
                    timestamp: new Date() // Use client time OR keep null
                }),
                updatedAt: serverTimestamp(),
            });

            setReplyMessage('');
            setSelectedTicket(selectedTicket); // Update the selected ticket
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    };

    const handleResolveTicket = async () => {
        if (!selectedTicket) return;

        if (window.confirm('Mark this ticket as resolved?')) {
            try {
                await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
                    status: 'resolved',
                    updatedAt: serverTimestamp()
                });
            } catch (error) {
                console.error('Error resolving ticket:', error);
                alert('Failed to resolve ticket');
            }
        }
    };

    const handleReopenTicket = async () => {
        if (!selectedTicket) return;

        try {
            await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
                status: 'open',
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error reopening ticket:', error);
            alert('Failed to reopen ticket');
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
        <div className="flex h-[600px] bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Left Panel - Tickets List (35%) */}
            <div className="w-[35%] border-r border-gray-200 flex flex-col">
                {/* Header with Filters */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Support Tickets</h3>
                    <div className="flex gap-2">
                        {['all', 'open', 'resolved'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
                                    filter === f
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tickets List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredTickets.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>No {filter !== 'all' ? filter : ''} tickets</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredTickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`p-4 cursor-pointer transition ${
                                        selectedTicket?.id === ticket.id
                                            ? 'bg-blue-50 border-l-4 border-blue-600'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">
                                            {ticket.subject}
                                        </h4>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            ticket.status === 'open'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                      {ticket.status}
                    </span>
                                    </div>

                                    <p className="text-xs text-gray-600 mb-1">{ticket.studentName}</p>

                                    {ticket.messages.length > 0 && (
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {ticket.messages[ticket.messages.length - 1].message}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                        {ticket.messages.length}
                    </span>
                                        <span>
                      {ticket.updatedAt?.toDate ?
                          formatDate(ticket.updatedAt.toDate()) :
                          'Just now'}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel - Chat (65%) */}
            {selectedTicket ? (
                <div className="w-[65%] flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-gray-800">{selectedTicket.subject}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedTicket.studentName} • {selectedTicket.studentEmail}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTicket.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedTicket.status.toUpperCase()}
                </span>
                                {selectedTicket.status === 'open' ? (
                                    <button
                                        onClick={handleResolveTicket}
                                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition"
                                    >
                                        Mark Resolved
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleReopenTicket}
                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Reopen
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                        {selectedTicket.messages.map((message, index) => {
                            const isAdmin = message.senderType === 'admin';
                            return (
                                <div
                                    key={index}
                                    className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${
                                            isAdmin
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-800 border border-gray-200'
                                        }`}
                                    >
                                        <p className="text-sm">{message.message}</p>
                                        <p className={`text-xs mt-1 ${
                                            isAdmin ? 'text-blue-100' : 'text-gray-500'
                                        }`}>
                                            {message.sender} • {message.timestamp?.toDate ?
                                            formatTime(message.timestamp.toDate()) :
                                            'Just now'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />

                    </div>

                    {/* Reply Input */}
                    {selectedTicket.status === 'open' && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!replyMessage.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-[65%] flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <ChatBubbleLeftIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Select a ticket to view conversation</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper functions
function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

    return new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        day: 'numeric'
    }).format(date);
}

function formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
}

export default SupportPanel;
