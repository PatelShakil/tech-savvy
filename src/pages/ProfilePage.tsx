import {useEffect, useState, useCallback} from "react";
import {auth, database} from "../firebase.ts";
import {Link, useNavigate} from "react-router-dom";
import {onValue, ref} from "firebase/database";
import User from "../obj/User.tsx";
import ProfileImage from "../components/utils/ProfileImage.tsx";
import LoadingComponent from "../components/utils/Loading.tsx";
import {handleLogout} from "../components/UserNavComp.tsx";
import {animate, motion, useMotionTemplate, useMotionValue} from "framer-motion";
import {FiArrowRight} from "react-icons/fi";
import {ProjectData} from "../obj/ProjectData.tsx";
import ProjectDataItem from "../components/utils/ProjectDataItem.tsx";
import {PlusCircle} from "lucide-react";
import {RotatingLogo} from "../components/utils/RotatingLogo.tsx";
import {Helmet} from "react-helmet";

const ProfilePage = () => {
    const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
    const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;
    const color = useMotionValue(COLORS_TOP[0]);
    const navigate = useNavigate();
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "anticipate",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, [color]);

    const fetchProjects = useCallback((uid: string) => {
        const dataRef = ref(database, "users/" + uid + "/projects");
        onValue(dataRef, (snapshot) => {
            const list: ProjectData[] = [];
            snapshot.forEach((ch) => {
                list.push(ch.val());
            });
            setProjects(list);
        });
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsVerified(user.emailVerified);
                if (user.emailVerified) {
                    const userRef = ref(database, "users/" + user.uid);
                    onValue(userRef, (snapshot) => {
                        setUser(snapshot.val());
                    });
                    fetchProjects(user.uid);
                }
            } else {
                setUser(null);
                setProjects([]);
            }
        });
        return () => unsubscribe();
    }, [fetchProjects]);

    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

    return (
        <div>
            {user ? (
                isVerified ? (
                    <div className="container mx-auto py-8">
                        <Helmet>
                            <title>{user.name} | Tech Savvy</title>
                            <meta property="og:url" content="https://tech-savvy-solution.web.app"/>
                            <meta property="og:type" content="website"/>
                            <meta property="og:title" content="Profile | Tech Savvy"/>
                            <meta property="og:description"
                                  content="At Tech-Savvy Solution, we specialize in delivering top-notch IT services tailored to your unique business requirements. From web and mobile app development to robust backend solutions and dynamic API integration, we cover all aspects of software development. Our expertise spans full-stack development, cross-platform mobile applications, and comprehensive DevOps practices. We pride ourselves on providing innovative, scalable, and efficient solutions that help your business thrive in a digital world. Let's build the future together."/>
                            <meta property="og:image" content="https://tech-savvy-solution.web.app/assets/preview_image.png"/>
                        </Helmet>
                        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4 mt-6">
                            <div className="col-span-4 sm:col-span-3">
                                <div className="shadow rounded-lg p-6 sticky top-12">
                                    <div className="flex flex-col items-center">
                                        <ProfileImage username={user.name.toString()} height={"112"} width={"112"}/>
                                        <h1 className="text-xl font-bold">{user.name}</h1>
                                        <p className="text-gray-300">{user.email}</p>
                                        <div className="flex flex-wrap mt-2 gap-4 justify-center">
                                            <Link to="/editprofile"
                                                  className="bg-gray-400 hover:bg-blue-600 text-white py-2 px-4 rounded">
                                                Edit Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex flex-row drop-shadow-lg bg-gradient-to-r from-red-700 to-black px-4 py-2 rounded-xl hover:bg-black"
                                            >
                                                <span className="text-sm">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                    <hr className="my-6 border-t border-gray-300"/>
                                </div>
                            </div>
                            <div className="col-span-4 sm:col-span-9">
                                <div className={"flex flex-row items-center gap-1"}>
                                    <h1
                                        className="text-xl lg:text-4xl bg-clip-text text-transparent lg:mt-2 p-4"
                                        style={{backgroundImage: gradient}}
                                    >
                                        Your Projects ({projects.length})
                                    </h1>
                                    <Link to={'/requestproject'}>
                                        <PlusCircle className={"size-8 lg:mt-3"}/>
                                    </Link>
                                </div>
                                {projects.length > 0 ? (
                                    <div className="sm:w-full p-5 flex flex-row flex-wrap gap-5">
                                        {projects.map((pr, index) => (
                                            <ProjectDataItem key={index} item={pr} index={index}/>
                                        ))}
                                    </div>
                                ) : null}
                                <div className="flex items-center justify-center pt-20">
                                    <motion.button
                                        style={{border, boxShadow}}
                                        whileHover={{scale: 1.015}}
                                        whileTap={{scale: 0.985}}
                                        onClick={() => navigate('/requestproject')}
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
                ) : (
                    <div className="flex flex-col h-screen items-center justify-center">
                        <h1>Please Verify your Email</h1>
                    </div>
                )
            ) : (
                user == null ?
                    <div className="flex flex-col h-screen items-center justify-center">
                        <div className={"mb-5"}>
                            <RotatingLogo />

                        </div>
                        <h1>Please Verify your Email</h1>
                        <Link to={'/login'}>Go To Login</Link>
                    </div>
                    : <div className="flex flex-col h-screen items-center justify-center">
                        <LoadingComponent/>
                    </div>

            )}
        </div>
    );
};

export default ProfilePage;
