import './index.css';
import {BrowserRouter as Router, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import HomePage from "./pages/HomePage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import RequestProjectPage from "./pages/RequestProjectPage.tsx";
import Footer from "./components/Footer.tsx";
import ContactUsPage from "./pages/ContactUsPage.tsx";
import Navbar from "./components/Navbar.tsx";
import NotFoundPage from "./components/NotFoundPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import ServicesPage from "./pages/ServicesPage.tsx";
import AboutUsPage from "./pages/AboutUsPage.tsx";
import StudentProgramList from "./pages/student/programs/ProgramsList.tsx";
import StudentProgramDetails from "./pages/student/programs/ProgramDetails.tsx";
// import ClassesPage from "./pages/classes/ClassesPage.tsx";
import ClassesRegistration from "./pages/classes/ClassesRegistration.tsx";
import AdminWelcome from "./pages/admin/AdminWelcome.tsx";
import {useAuthState} from "./pages/admin/states/UseAuthState.tsx";
import AdminClasses from "./pages/admin/AdminClasses.tsx";
import AdminStudents from "./pages/admin/AdminStudents.tsx";
import AddClass from "./pages/admin/AddClass.tsx";
import PrivacyPolicy from "./pages/apps/bytebuddy/PrivacyPolicy.tsx";
import DeleteAc from "./pages/apps/bytebuddy/DeleteAc.tsx";
import Pages from "./utils/Pages.ts";
import ByteBuddyHome from "./pages/apps/bytebuddy/ByteBuddyHome.tsx";
import TechSavvyPrivacyPolicy from "./pages/apps/tech-savvy/TechSavvyPrivacyPolicy.tsx";

// NEW IMPORTS FOR PROGRAM MANAGEMENT
import AdminDashboard from "./pages/admin/programs/AdminDashboard.tsx";
import ProgramsList from "./pages/admin/programs/ProgramsList.tsx";
import AddProgram from "./pages/admin/programs/AddProgram.tsx";
import ProgramDetails from "./pages/admin/programs/ProgramDetails.tsx";
import ProgramApplicationForm from "./pages/ProgramApplicationForm.tsx";
import EditProgram from "./pages/admin/programs/EditProgram.tsx";
import ProgramsPage from "./pages/ProgramsPage.tsx";
import StudentLogin from "./pages/student/auth/StudentLogin.tsx";
import ForgotPassword from "./pages/student/auth/ForgotPassword.tsx";
import StudentLayout from "./components/student/layout/StudentLayout.tsx";
import StudentDashboard from "./pages/student/dashboard/StudentDashboard.tsx";
import StudentProfile from "./pages/student/profile/StudentProfile.tsx";
import Settings from "./pages/student/settings/Settings.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import EditProfile from "./pages/student/profile/EditProfile.tsx";
import PrivacyPolicyPage from "./pages/utility/PrivacyPolicyPage.tsx";
import TermsOfServicePage from "./pages/utility/TermsOfServicePage.tsx";
import SitemapPage from "./pages/utility/SitemapPage.tsx";
import RefundPolicyPage from "./pages/utility/RefundPolicyPage.tsx";
import SitemapXML from "./pages/SitemapXML.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
// import ProgramDetails from "./pages/admin/programs/ProgramDetails.tsx";
// import AdminApplications from "./pages/admin/programs/AdminApplications.tsx";

function App() {
    const {isLogin, user} = useAuthState();

    return (
        <Router>
            <ScrollToTop />
            <div className={"flex flex-col p-0 m-auto"}>
                <Navbar/>
                <Routes>
                    <Route path={"/"} element={<HomePage/>}/>
                    <Route path={"/signup"} element={<SignupPage/>}/>
                    <Route path={"/login"} element={<LoginPage/>}/>
                    <Route path={"/profile"} element={<ProfilePage/>}/>
                    <Route path={"/requestproject"} element={<RequestProjectPage isLogin={isLogin} user={user}/>}/>
                    <Route path={"/contactus"} element={<ContactUsPage/>}/>
                    <Route path={"/projects"} element={<ProjectsPage/>}/>
                    <Route path={"/services"} element={<ServicesPage/>}/>
                    <Route path={"/aboutus"} element={<AboutUsPage/>}/>
                    {/*<Route path={"/classes"} element={<ClassesPage/>}/>*/}
                    <Route path={"/classes/register"} element={<ClassesRegistration/>}/>
                    <Route path="/programs/apply/:programId" element={<ProgramApplicationForm/>}/>
                    <Route path="/programs" element={<ProgramsPage />} />
                    <Route path="/sitemap.xml" element={<SitemapXML />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/sitemap" element={<SitemapPage />} />
                    <Route path="/refund-policy" element={<RefundPolicyPage />} />

                    {/* Student Routes - NO REGISTRATION */}
                    <Route path="/student/login" element={<StudentLogin />} />
                    <Route path="/student/forgot-password" element={<ForgotPassword />} />

                    {/* Student Protected Routes with Layout */}
                    <Route path="/student" element={
                        <PrivateRoute role="student">
                            <StudentLayout />
                        </PrivateRoute>
                    }>
                        {/* Nested routes - these will render in <Outlet /> */}
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="programs" element={<StudentProgramList />} />
                        <Route path="programs/:id" element={<StudentProgramDetails />} />
                        <Route path="profile" element={<StudentProfile />} />
                        <Route path="profile/edit" element={<EditProfile />} />
                        <Route path="settings" element={<Settings />} />
                        <Route index element={<Navigate to="/student/dashboard" replace />} />
                    </Route>

                    {/* ADMIN ROUTES - Only accessible to admin email */}
                    {
                        user?.email === "patelsakib95@gmail.com" && (
                            <>
                                {/* Existing Admin Routes */}
                                <Route path={"/admin"} element={<AdminWelcome/>}/>
                                <Route path={"/admin/classes"} element={<AdminClasses/>}/>
                                <Route path={"/admin/students"} element={<AdminStudents/>}/>
                                <Route path={"/admin/addclass"} element={<AddClass/>}/>

                                {/* NEW: Program Management Routes */}
                                <Route path={"/admin/dashboard"} element={<AdminDashboard/>}/>
                                <Route path={"/admin/programs"} element={<ProgramsList/>}/>
                                <Route path={"/admin/programs/add"} element={<AddProgram/>}/>
                                <Route path={"/admin/programs/:id"} element={<ProgramDetails/>}/>
                                <Route path={"/admin/programs/edit/:id"} element={<EditProgram/>}/>
                                {/*<Route path={"/admin/programs/:id"} element={<ProgramDetails/>}/>*/}
                                {/*<Route path={"/admin/applications"} element={<AdminApplications/>}/>*/}
                            </>
                        )
                    }

                    {/* App-specific Routes */}
                    <Route path={Pages.Bytebuddy.Home} element={<ByteBuddyHome />} />
                    <Route path={Pages.Bytebuddy.PrivacyPolicy} element={<PrivacyPolicy />} />
                    <Route path={Pages.Bytebuddy.DeleteAc} element={<DeleteAc />} />
                    <Route path={Pages.TechSavvy.PrivacyPolicy} element={<TechSavvyPrivacyPolicy />} />

                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
                <ConditionalFooter/>
            </div>
        </Router>
    );
}

export default App;

const ConditionalFooter = () => {
    const location = useLocation();

    // Updated to hide footer on all admin pages
    const hiddenFooterPaths = ['/profile', '/admin', '/apps/bytebuddy','/student'];

    // Check if current path starts with any hidden path
    const isFooterPageVisible = !hiddenFooterPaths.some(path =>
        location.pathname.startsWith(path)
    );

    return isFooterPageVisible ? <Footer/> : null;
};
