import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface PrivateRouteProps {
    children: React.ReactNode;
    role?: 'student' | 'admin';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
    const [user, authLoading] = useAuthState(auth);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [roleLoading, setRoleLoading] = useState(true);
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        const checkUserRole = async () => {
            if (!user) {
                setRoleLoading(false);
                setAuthInitialized(true);
                return;
            }

            try {
                // Check if user is admin by email
                if (user.email === "patelsakib95@gmail.com") {
                    setUserRole('admin');
                    setRoleLoading(false);
                    setAuthInitialized(true);
                    return;
                }

                // Check if user is student by email (more reliable than uid)
                const studentsQuery = query(
                    collection(db, 'students'),
                    where('email', '==', user.email)
                );
                const studentsSnap = await getDocs(studentsQuery);

                if (!studentsSnap.empty) {
                    setUserRole('student');
                    setRoleLoading(false);
                    setAuthInitialized(true);
                    return;
                }

                // User exists but has no role
                setUserRole(null);
                setRoleLoading(false);
                setAuthInitialized(true);
            } catch (error) {
                console.error('Error checking user role:', error);
                setRoleLoading(false);
                setAuthInitialized(true);
            }
        };

        // Only check role after auth has loaded
        if (!authLoading) {
            checkUserRole();
        }
    }, [user, authLoading]);

    // Show loading spinner while checking authentication
    // IMPORTANT: Wait for both auth AND role to load
    if (authLoading || !authInitialized || (role && roleLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!user) {
        if (role === 'admin') {
            return <Navigate to="/admin/login" replace />;
        }
        return <Navigate to="/student/login" replace />;
    }

    // Check role-based access
    if (role && userRole !== role) {
        // Wrong role - redirect to appropriate dashboard
        if (userRole === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        if (userRole === 'student') {
            return <Navigate to="/student/dashboard" replace />;
        }
        // No role found - redirect to home
        return <Navigate to="/" replace />;
    }

    // All checks passed - render children
    return <>{children}</>;
};

export default PrivateRoute;
