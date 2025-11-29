import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import {
    PaintBrushIcon,
    BellIcon,
    ShieldCheckIcon,
    ArrowRightOnRectangleIcon,
    MoonIcon,
    SunIcon,
    CheckCircleIcon,
    XMarkIcon,
    KeyIcon
} from '@heroicons/react/24/outline';

const themes = [
    {
        id: 'blue',
        name: 'Tech Savvy Blue',
        description: 'Professional & Trustworthy',
        colors: {
            primary: '#1E40AF',
            secondary: '#7C3AED',
            preview: 'bg-gradient-to-r from-blue-600 to-purple-600'
        }
    },
    {
        id: 'ocean',
        name: 'Ocean Breeze',
        description: 'Calm & Refreshing',
        colors: {
            primary: '#0891B2',
            secondary: '#06B6D4',
            preview: 'bg-gradient-to-r from-cyan-600 to-blue-500'
        }
    },
    {
        id: 'sunset',
        name: 'Sunset Orange',
        description: 'Warm & Energetic',
        colors: {
            primary: '#EA580C',
            secondary: '#F59E0B',
            preview: 'bg-gradient-to-r from-orange-600 to-amber-500'
        }
    },
    {
        id: 'forest',
        name: 'Forest Green',
        description: 'Natural & Trustworthy',
        colors: {
            primary: '#059669',
            secondary: '#10B981',
            preview: 'bg-gradient-to-r from-emerald-600 to-green-500'
        }
    },
    {
        id: 'purple',
        name: 'Royal Purple',
        description: 'Premium & Elegant',
        colors: {
            primary: '#7C3AED',
            secondary: '#9333EA',
            preview: 'bg-gradient-to-r from-violet-600 to-purple-600'
        }
    },
    {
        id: 'dark',
        name: 'Pure Dark',
        description: 'AMOLED Friendly',
        colors: {
            primary: '#60A5FA',
            secondary: '#818CF8',
            preview: 'bg-gradient-to-r from-gray-900 to-gray-800'
        }
    }
];

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const [selectedTheme, setSelectedTheme] = useState('blue');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        programUpdates: true,
        newMessages: true
    });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // Load saved preferences
    useEffect(() => {
        const savedTheme = localStorage.getItem('studentTheme') || 'blue';
        const savedDarkMode = localStorage.getItem('studentDarkMode') === 'true';
        const savedNotifications = localStorage.getItem('studentNotifications');

        setSelectedTheme(savedTheme);
        setDarkMode(savedDarkMode);
        if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
        }

        // Apply theme
        applyTheme(savedTheme, savedDarkMode);
    }, []);

    const applyTheme = (themeId: string, isDark: boolean) => {
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
            document.documentElement.style.setProperty('--color-primary', theme.colors.primary);
            document.documentElement.style.setProperty('--color-secondary', theme.colors.secondary);
        }

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleThemeChange = (themeId: string) => {
        setSelectedTheme(themeId);
        localStorage.setItem('studentTheme', themeId);
        applyTheme(themeId, darkMode);
    };

    const handleDarkModeToggle = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('studentDarkMode', String(newDarkMode));
        applyTheme(selectedTheme, newDarkMode);
    };

    const handleNotificationChange = (key: string) => {
        const updated = { ...notifications, [key]: !notifications[key as keyof typeof notifications] };
        setNotifications(updated);
        localStorage.setItem('studentNotifications', JSON.stringify(updated));
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user || !user.email) return;

            // Re-authenticate user
            const credential = EmailAuthProvider.credential(
                user.email,
                passwordForm.currentPassword
            );
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, passwordForm.newPassword);

            setPasswordSuccess(true);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess(false);
            }, 2000);
        } catch (error: any) {
            if (error.code === 'auth/wrong-password') {
                setPasswordError('Current password is incorrect');
            } else {
                setPasswordError('Failed to update password. Please try again.');
            }
        }
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await signOut(auth);
                navigate('/student/login');
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">Manage your preferences and account settings</p>
            </div>

            {/* Appearance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <PaintBrushIcon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                    <div className="flex items-center gap-3">
                        {darkMode ? (
                            <MoonIcon className="w-5 h-5 text-gray-700" />
                        ) : (
                            <SunIcon className="w-5 h-5 text-gray-700" />
                        )}
                        <div>
                            <div className="font-semibold text-gray-900">Dark Mode</div>
                            <div className="text-sm text-gray-600">
                                {darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleDarkModeToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            darkMode ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                    >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
                    </button>
                </div>

                {/* Theme Selection */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Choose Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => handleThemeChange(theme.id)}
                                className={`text-left p-4 rounded-lg border-2 transition ${
                                    selectedTheme === theme.id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                                        <p className="text-sm text-gray-600">{theme.description}</p>
                                    </div>
                                    {selectedTheme === theme.id && (
                                        <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                                    )}
                                </div>
                                <div className={`h-12 rounded-lg ${theme.colors.preview}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <BellIcon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                </div>

                <div className="space-y-4">
                    {Object.entries({
                        email: 'Email Notifications',
                        push: 'Push Notifications',
                        programUpdates: 'Program Updates',
                        newMessages: 'New Messages'
                    }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">{label}</div>
                                <div className="text-sm text-gray-600">
                                    Receive {label.toLowerCase()}
                                </div>
                            </div>
                            <button
                                onClick={() => handleNotificationChange(key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                    notifications[key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Security</h2>
                </div>

                <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center gap-3 w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-left"
                >
                    <KeyIcon className="w-5 h-5 text-gray-700" />
                    <div className="flex-1">
                        <div className="font-medium text-gray-900">Change Password</div>
                        <div className="text-sm text-gray-600">Update your account password</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-600" />
                    <h2 className="text-xl font-bold text-gray-900">Account</h2>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition font-semibold"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition"
                            >
                                <XMarkIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {passwordSuccess ? (
                            <div className="text-center py-8">
                                <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Password Updated!</h4>
                                <p className="text-gray-600">Your password has been changed successfully.</p>
                            </div>
                        ) : (
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                {passwordError && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                        {passwordError}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
                                    >
                                        Update Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(false)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
