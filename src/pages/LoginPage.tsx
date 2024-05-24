import {animate, useMotionTemplate, useMotionValue, motion} from "framer-motion";
import {useEffect, useState} from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import login from '../assets/login.svg';
import {Link, useNavigate} from "react-router-dom";
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from "../firebase.ts";


const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if(email.length > 0 && password.length > 0) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    if (userCredential.user.emailVerified) {
                        alert('Login successful');
                        navigate('/')
                    } else {
                        alert('Please verify your email first.');
                    }
                }).catch(alert)
        }else{
            alert("Email and password both required")
        }
    };






    const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
    const color = useMotionValue(COLORS_TOP[0]);

    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "anticipate",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);
    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;


    return (
        <motion.div className="flex items-center justify-center h-screen w-full px-5 sm:px-0"
                    style={{
                        backgroundImage: backgroundImage
                    }}

        >

            <motion.div className="flex rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full bg-black"
                        style={{
                            // backgroundImage,
                            boxShadow,
                            border
                        }}
            >
                <div
                    className="hidden md:block lg:w-1/2 bg-cover"
                >
                    <img src={login} alt={"login img"}/>
                </div>
                <div className="w-full p-8 lg:w-1/2">
                    <motion.p className="text-xl text-center" style={{color}}>Welcome back!</motion.p>
                    <div className="mt-4">
                        <label className="block text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <motion.input
                            className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                            type="email"
                            style={{
                                border
                            }}
                            onChange={(str) => setEmail(str.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-4 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <label className="block text-sm font-bold mb-2">
                                Password
                            </label>
                        </div>
                        <motion.input
                            className="border rounded py-2 px-4 block w-full focus:outline-2"
                            type="password"
                            style={{
                                border
                            }}
                            onChange={(str) => setPassword(str.target.value)}
                            required

                        />
                        <Link
                            to="/forgotpass"
                            className="text-xs text-gray-500 hover:text-white text-end w-full mt-2"
                        >
                            Forget Password?
                        </Link>
                    </div>
                    <div className="mt-8">
                        <motion.button
                            type={'submit'}
                            onClick={handleLogin}
                            className={"text-white backdrop-blur-3xl shadow-lg font-bold py-2 px-4 w-full rounded hover:bg-black"}>
                            Login
                        </motion.button>
                    </div>
                    <div className="mt-4 flex items-center w-full text-center">
                        <Link
                            to="/signup"
                            className="text-xs capitalize text-center w-full"
                        >
                            Don&apos;t have any account yet ?
                            <span className="text-blue-400 font-bold text-xl"> Sign Up</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
export default LoginPage
