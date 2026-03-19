import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, animate, useMotionValue, useMotionTemplate } from 'framer-motion';

const COLORS = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C'];

interface CertificateDoc {
    id: string;
    programId: string;
    studentId: string;
    studentName: string;
    type: 'offer_letter' | 'certificate';
    title: string;
    downloadUrl: string;
    createdAt: any;
    isActive?: boolean;
}

// ─── Animated background hook ───────────────────────────────────────────────
function useAuroraBackground() {
    const color = useMotionValue(COLORS[0]);

    useEffect(() => {
        const controls = animate(color, COLORS, {
            ease: 'anticipate',
            duration: 8,
            repeat: Infinity,
            repeatType: 'mirror',
        });
        return controls.stop;
    }, []);

    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 55%, ${color})`;
    const glowColor = color;

    return { backgroundImage, glowColor };
}

// ─── Main Page ───────────────────────────────────────────────────────────────
const CertificateVerificationPage = () => {
    const { cid } = useParams<{ cid: string }>();
    const [certDoc, setCertDoc] = useState<CertificateDoc | null>(null);
    const [status, setStatus] = useState<'loading' | 'found' | 'invalid' | 'disabled'>('loading');

    const { backgroundImage, glowColor } = useAuroraBackground();
    const border = useMotionTemplate`1px solid ${glowColor}`;
    const boxShadow = useMotionTemplate`0px 0px 40px ${glowColor}40`;

    useEffect(() => {
        if (!cid) { setStatus('invalid'); return; }
        const fetchCert = async () => {
            try {
                const docRef = doc(db, 'documents', cid);
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    const data = { id: snapshot.id, ...snapshot.data() } as CertificateDoc;
                    setCertDoc(data);
                    setStatus(data.isActive === false ? 'disabled' : 'found');
                } else {
                    setStatus('invalid');
                }
            } catch {
                setStatus('invalid');
            }
        };
        fetchCert();
    }, [cid]);

    return (
        <motion.div
            style={{ backgroundImage }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-950"
        >
            {/* Floating particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full opacity-10"
                        style={{
                            width: `${Math.random() * 6 + 2}px`,
                            height: `${Math.random() * 6 + 2}px`,
                            background: COLORS[i % COLORS.length],
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.05, 0.2, 0.05],
                        }}
                        transition={{
                            duration: Math.random() * 4 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            {/* Logo Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 text-center z-10"
            >
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Powered by</p>
                <h1
                    className="text-2xl font-bold text-transparent bg-clip-text"
                    style={{
                        backgroundImage: `linear-gradient(to right, ${COLORS.join(', ')})`,
                    }}
                >
                    Tech Savvy Solution
                </h1>
            </motion.div>

            {/* Card */}
            <div className="w-full max-w-md z-10">
                {status === 'loading' && <LoadingCard />}
                {status === 'invalid' && <InvalidCard />}
                {status === 'disabled' && <DisabledCard />}
                {status === 'found' && certDoc && (
                    <VerifiedCard cert={certDoc} border={border} boxShadow={boxShadow} />
                )}
            </div>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-10 text-xs text-gray-600 text-center z-10"
            >
                © {new Date().getFullYear()} Tech Savvy Solution. All rights reserved.
            </motion.p>
        </motion.div>
    );
};

// ─── Loading Card ─────────────────────────────────────────────────────────────
const LoadingCard = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-10 flex flex-col items-center gap-5 shadow-2xl"
    >
        <div className="relative w-16 h-16">
            <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent"
                style={{ borderTopColor: '#13FFAA', borderRightColor: '#1E67C6' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-2 rounded-full bg-gray-900" />
        </div>
        <p className="text-gray-400 text-sm tracking-wide">Verifying certificate…</p>
    </motion.div>
);

// ─── Invalid Card ─────────────────────────────────────────────────────────────
const InvalidCard = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-red-900/50 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl text-center"
    >
        {/* X icon */}
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center"
        >
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </motion.div>

        <div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Invalid Certificate</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
                This certificate could not be verified. It may have been revoked or the link is incorrect.
            </p>
        </div>

        <div className="w-full bg-red-900/20 border border-red-900/30 rounded-xl p-4 mt-2">
            <p className="text-xs text-red-400/80 text-center">
                If you believe this is an error, please contact Tech Savvy Solution directly.
            </p>
        </div>
    </motion.div>
);

// ─── Disabled Card ────────────────────────────────────────────────────────────
const DisabledCard = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-amber-900/50 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl text-center"
    >
        {/* Pause icon */}
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center"
        >
            <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </motion.div>

        <div>
            <h2 className="text-xl font-bold text-amber-400 mb-2">Temporarily Disabled</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
                This certificate has been temporarily disabled by the issuer and cannot be verified at this time.
            </p>
        </div>

        <div className="w-full bg-amber-900/20 border border-amber-900/30 rounded-xl p-4 mt-2">
            <p className="text-xs text-amber-400/80 text-center">
                Please contact Tech Savvy Solution if you believe this is an error.
            </p>
        </div>
    </motion.div>
);

// ─── Verified Card ────────────────────────────────────────────────────────────
const VerifiedCard = ({
    cert,
    border,
    boxShadow,
}: {
    cert: CertificateDoc;
    border: any;
    boxShadow: any;
}) => {
    const issuedDate = cert.createdAt?.toDate
        ? new Date(cert.createdAt.toDate()).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : 'Recently Issued';

    const typeLabel = cert.type === 'certificate' ? 'Certificate' : 'Offer Letter';
    const typeColor =
        cert.type === 'certificate'
            ? { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' }
            : { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        >
            <motion.div
                style={{ border, boxShadow }}
                className="bg-gray-900/85 backdrop-blur-xl rounded-2xl overflow-hidden"
            >
                {/* Top verified banner */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                    className="h-1 w-full"
                    style={{
                        background: `linear-gradient(to right, ${COLORS.join(', ')})`,
                        transformOrigin: 'left',
                    }}
                />

                <div className="p-8">
                    {/* Verified badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="relative">
                            {/* Pulsing ring */}
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-0 rounded-full bg-emerald-400/20"
                            />
                            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center">
                                <motion.svg
                                    className="w-12 h-12 text-emerald-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                                >
                                    <motion.path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M5 13l4 4L19 7"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                    />
                                </motion.svg>
                            </div>
                        </div>
                    </motion.div>

                    {/* Verified text */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mb-8"
                    >
                        <span className="text-xs uppercase tracking-[0.3em] text-emerald-400/80 font-medium">
                            ✓ Verified & Authentic
                        </span>
                        <h2 className="text-2xl font-bold text-white mt-1">
                            {typeLabel} Verified
                        </h2>
                    </motion.div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6" />

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-4"
                    >
                        {/* Recipient */}
                        <DetailRow
                            icon={
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                            label="Recipient"
                            value={cert.studentName}
                            highlight
                        />

                        {/* Title */}
                        <DetailRow
                            icon={
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            }
                            label="Document"
                            value={cert.title}
                        />

                        {/* Type */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-1">Type</p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${typeColor.bg} ${typeColor.border} ${typeColor.text}`}>
                                    {typeLabel}
                                </span>
                            </div>
                        </div>

                        {/* Issue Date */}
                        <DetailRow
                            icon={
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                            label="Issue Date"
                            value={issuedDate}
                        />

                        {/* Certificate ID */}
                        <DetailRow
                            icon={
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                                </svg>
                            }
                            label="Certificate ID"
                            value={cert.id}
                            mono
                        />
                    </motion.div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-6" />

                    {/* View Certificate Button */}
                    <motion.a
                        href={cert.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-gray-950 text-sm transition-all"
                        style={{
                            background: `linear-gradient(135deg, #13FFAA, #1E67C6)`,
                            boxShadow: '0 4px 24px rgba(19, 255, 170, 0.25)',
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Certificate
                    </motion.a>

                    {/* Issuer note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-center text-xs text-gray-600 mt-4"
                    >
                        Issued by <span className="text-gray-400 font-medium">Tech Savvy Solution</span> · Surat, Gujarat
                    </motion.p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Reusable Detail Row ──────────────────────────────────────────────────────
const DetailRow = ({
    icon,
    label,
    value,
    highlight = false,
    mono = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
    mono?: boolean;
}) => (
    <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p
                className={`text-sm break-words ${highlight ? 'text-white font-semibold text-base' : 'text-gray-300'} ${mono ? 'font-mono text-xs text-gray-500' : ''}`}
            >
                {value}
            </p>
        </div>
    </div>
);

export default CertificateVerificationPage;
