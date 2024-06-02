import './index.css';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
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
import ClassesPage from "./pages/classes/ClassesPage.tsx";
import ClassesRegistration from "./pages/classes/ClassesRegistration.tsx";
import AdminWelcome from "./pages/admin/AdminWelcome.tsx";
import {useAuthState} from "./pages/admin/states/UseAuthState.tsx";
import AdminClasses from "./pages/admin/AdminClasses.tsx";
import AdminStudents from "./pages/admin/AdminStudents.tsx";


function App() {
    const {isLogin, user} = useAuthState();


    return (
        <Router>
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
                    <Route path={"/classes"} element={<ClassesPage/>}/>
                    <Route path={"/classes/register"} element={<ClassesRegistration/>}/>
                    {
                        user?.email === "patelsakib95@gmail.com" && (
                            <>
                                <Route path={"/admin"} element={<AdminWelcome/>}/>
                                <Route path={"/admin/classes"} element={<AdminClasses/>}/>
                                <Route path={"/admin/students"} element={<AdminStudents/>}/>
                            </>
                        )
                    }


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

    // List of paths where the footer should be hidden
    const hiddenFooterPaths = ['/profile', '/admin'];

    // Check if the current path is one of the hidden paths
    const isFooterPageVisible = !hiddenFooterPaths.includes(location.pathname);

    // Conditionally render the footer
    return isFooterPageVisible ? <Footer/> : null;
};
