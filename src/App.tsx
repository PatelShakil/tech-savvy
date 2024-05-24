import './index.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from "./pages/HomePage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import {useEffect, useState} from "react";
import {auth} from "./firebase.ts";
import RequestProjectPage from "./pages/RequestProjectPage.tsx";


function App() {
    const [isLogin, setIsLogin] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLogin(!!user);
        });
        return () => unsubscribe();
    }, []);

  return (
    <Router>
        <Routes>
            <Route path={"/"} element={<HomePage/>}/>
            <Route path={"/signup"} element={<SignupPage/>}/>
            <Route path={"/login"} element={<LoginPage/>}/>
            <Route path={"/profile"} element={<ProfilePage isLogin={isLogin}/>}/>
            <Route path={"/requestproject"} element={<RequestProjectPage isLogin={isLogin} />}/>
        </Routes>
    </Router>
  )
}

export default App
