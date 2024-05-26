import './index.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from "./pages/HomePage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import {useEffect, useState} from "react";
import {auth, database} from "./firebase.ts";
import RequestProjectPage from "./pages/RequestProjectPage.tsx";
import User from "./obj/User.tsx";
import {onValue, ref} from "firebase/database";


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
        <Routes>
            <Route path={"/"} element={<HomePage/>}/>
            <Route path={"/signup"} element={<SignupPage/>}/>
            <Route path={"/login"} element={<LoginPage/>}/>
            <Route path={"/profile"} element={<ProfilePage/>}/>
            <Route path={"/requestproject"} element={<RequestProjectPage isLogin={isLogin} user={user} />}/>
        </Routes>
    </Router>
  )
}

export default App
