import './index.css';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import HomePage from "./pages/HomePage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import {useEffect, useState} from "react";
import {auth, database} from "./firebase.ts";
import RequestProjectPage from "./pages/RequestProjectPage.tsx";
import User from "./obj/User.tsx";
import {onValue, ref} from "firebase/database";
import Footer from "./components/Footer.tsx";
import ContactUsPage from "./pages/ContactUsPage.tsx";
import Navbar from "./components/Navbar.tsx";
import NotFoundPage from "./components/NotFoundPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import ServicesPage from "./pages/ServicesPage.tsx";
import AboutUsPage from "./pages/AboutUsPage.tsx";


function App() {
    const [isLogin, setIsLogin] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLogin(!!user);
            if(isLogin){
                const dataRef = ref(database, "users/" + user?.uid);
                onValue(dataRef, (snapshot) => {
                    const data = snapshot.val() as User;
                    setUser(data);
                });
            }
        });
        return () => unsubscribe();
    }, []);


  return (
    <Router>
        <div className={"flex flex-col p-0 m-auto"}>
        <Navbar/>
        <Routes >
            <Route path={"/"} element={<HomePage/>}/>
            <Route path={"/signup"} element={<SignupPage/>}/>
            <Route path={"/login"} element={<LoginPage/>}/>
            <Route path={"/profile"} element={<ProfilePage/>}/>
            <Route path={"/requestproject"} element={<RequestProjectPage isLogin={isLogin} user={user} />}/>
            <Route path={"/contactus"} element={<ContactUsPage />}/>
            <Route path={"/projects"} element={<ProjectsPage/>}/>
            <Route path={"/services"} element={<ServicesPage />} />
            <Route path={"/aboutus"} element={<AboutUsPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ConditionalFooter />
        </div>
    </Router>
  );
}

export default App;

const ConditionalFooter= () => {
    const location = useLocation();

    // List of paths where the footer should be hidden
    const hiddenFooterPaths = [ '/profile'];

    // Check if the current path is one of the hidden paths
    const isFooterPageVisible = !hiddenFooterPaths.includes(location.pathname);

    // Conditionally render the footer
    return isFooterPageVisible ? <Footer /> : null;
};
