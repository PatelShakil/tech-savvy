import {useEffect, useState} from "react";
import {auth, database} from "../firebase.ts";
import {Link, useNavigate} from "react-router-dom";
import {onValue, ref} from "firebase/database";
import User from "../obj/User.tsx";
import ProfileImage from "../components/utils/ProfileImage.tsx";
import LoadingComponent from "../components/utils/Loading.tsx";
import Navbar from "../components/Navbar.tsx";
import {handleLogout} from "../components/UserNavComp.tsx";
import {animate, motion, useMotionTemplate, useMotionValue} from "framer-motion";
import {FiArrowRight} from "react-icons/fi";

const ProfilePage = (props: { isLogin: boolean | null; }) => {
    const isLogin = props.isLogin
    const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
    const color = useMotionValue(COLORS_TOP[0]);
    const navigate = useNavigate();
    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "anticipate",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, );
    const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;

    const [user, setUser] = useState<User | null>(null)
    const [isVerified, setIsVerified] = useState(false)
    useEffect(() => {
        if (isLogin) {
            setIsVerified(auth.currentUser!.emailVerified);
            const dataRef = ref(database, "users/" + auth.currentUser!.uid);
            onValue(dataRef, (snapshot) => {
                const data = snapshot.val() as User;
                setUser(data);
            });
        }
    },[user]);

    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

    return (
        <div>
            <Navbar/>
            {
                isLogin ?
                user != null ?
                    isVerified ?
                        <div className="container mx-auto py-8">
                            <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4 mt-6">
                                <div className="col-span-4 sm:col-span-3">
                                    <div className="shadow rounded-lg p-6">
                                        <div className="flex flex-col items-center">
                                            <ProfileImage username={user.name.toString()} height={"112"} width={"112"}/>
                                            <h1 className="text-xl font-bold">{user.name}</h1>
                                            <p className="text-gray-300">{user.email}</p>
                                            <div className="flex flex-wrap mt-2 gap-4 justify-center">
                                                <Link to="/editprofile"
                                                      className="bg-gray-400 hover:bg-blue-600 text-white py-2 px-4 rounded">Edit
                                                    Profile</Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className={'flex flex-row drop-shadow-lg bg-gradient-to-r from-red-700 to-black px-4 py-2 rounded-xl hover:bg-black'}>
                                                    {
                                                        <span className={'text-sm'}>
                                                            Logout
                                                        </span>
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                        <hr className="my-6 border-t border-gray-300"/>
                                    </div>
                                </div>
                                <div className="col-span-4 sm:col-span-9">
                                    <h1 className={"text-xl lg:text-4xl bg-clip-text text-transparent lg:mt-3"} style={{backgroundImage:gradient}}>Your Projects</h1>
                                    <div className={"flex items-center justify-center pt-20"}>
                                            <motion.button
                                                style={{
                                                    border,
                                                    boxShadow,
                                                }}
                                                whileHover={{
                                                    scale: 1.015,
                                                }}
                                                whileTap={{
                                                    scale: 0.985,
                                                }}
                                                onClick={() => {
                                                    navigate('/requestproject')
                                                }}
                                                className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
                                            >
                                                Request Project
                                                <FiArrowRight
                                                    className="transition-transform group-hover:-rotate-45 group-active:-rotate-12"/>
                                            </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <div className={"flex flex-col h-screen items-center justify-center"}>
                            <h1>Please Verify your Email</h1>
                        </div>
                    : <div className={"flex flex-col h-screen items-center justify-center"}>
                        <LoadingComponent/>
                    </div>
                    : <div className={"flex h-screen justify-center items-center"}><h1>Please Login First</h1></div>
            }
        </div>
    )
        ;
}

export default ProfilePage;
