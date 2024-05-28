import {useEffect, useState} from "react";
import {Menu, X} from "lucide-react";
import {ref, onValue} from "firebase/database";
import {auth, database} from "../firebase.ts";
import LoadingComponent from "./utils/Loading.tsx";
import {Link} from "react-router-dom";
import UserNavComp from "./UserNavComp.tsx";
import NavItem from "../obj/NavItem.tsx";
import {animate, motion, useMotionTemplate, useMotionValue, useScroll, useSpring} from "framer-motion";
import {RotatingLogo} from "./utils/RotatingLogo.tsx";


const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const Navbar = () => {


    const [navListData, setNavListData] = useState<NavItem[]>([]);

    useEffect(() => {

        const dataRef = ref(database, "navList");

        onValue(dataRef, (snapshot) => {

            const data = snapshot.val();
            setNavListData(data);
        });
    },[]);
    const {scrollYProgress} = useScroll();
    const scaleX = useSpring(scrollYProgress);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const toggleNavbar = () => {
        setIsMobileDrawerOpen(!isMobileDrawerOpen);
    }
    const color = useMotionValue(COLORS_TOP[0]);
    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "anticipate",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);

    const backgroundImage = useMotionTemplate`linear-gradient(30deg,${color},white)`;


    return (
        <nav className={'fixed z-50 w-full pt-1 backdrop-blur-lg border-b-neutral-700 shadow-green-400'}>
            <div className={'container px-4 mx-auto relative text-sm'}>
                <div className={'flex justify-between items-center'}>
                    <Link to={"/"} className={'flex items-center flex-shrink-0'}>
                        <RotatingLogo/>
                        <motion.span className={"text-2xl lg:text-3xl font-bold bg-clip-text text-transparent"}
                                     style={{backgroundImage}}>Tech Savvy
                        </motion.span>
                    </Link>
                    <ul className={'hidden lg:flex ml-14 space-x-12'}>
                        {
                            navListData.length != 0 ?
                                navListData.map((item, i) => <li key={i}>
                                        <Link to={item.path}>{item.name}</Link>
                                    </li>
                                )
                                :
                                <LoadingComponent/>
                        }
                    </ul>
                    {
                        auth.currentUser != null ?
                            <div className={"hidden lg:flex md:flex"}>
                                <UserNavComp/>
                            </div>
                            : <div className="hidden lg:flex justify-center space-x-12 items-center">
                                <Link to="/login" className="py-2 px-3 border rounded-md">
                                    Login
                                </Link>
                                <Link to={'/signup'}
                                      className={'bg-gradient-to-r from-green-500 to-green-900 py-2 px-3 rounded-md'}>Create
                                    Account</Link>
                            </div>

                    }
                    <div className={'lg:hidden md-flex flex-col justify-end'}>

                        <button onClick={toggleNavbar}>
                            {
                                isMobileDrawerOpen ? <X/> : <Menu/>
                            }
                        </button>
                    </div>
                </div>
                {
                    isMobileDrawerOpen && (
                        <div
                            className={'fixed right-0 mt-2 z-20 bg-neutral-900 w-full pb-12 flex flex-col justify-center items-center lg:hidden'}>

                            <ul className={'text-center'}>
                                {
                                    navListData.length != 0 ?
                                        navListData.map((item, i) => <li key={i} className={'py-4'}>
                                                <a href={item.path.toString()}>{item.name.toString()}</a>
                                            </li>
                                        ) : <LoadingComponent/>
                                }

                            </ul>
                            {
                                auth.currentUser != null ?
                                    <UserNavComp/>
                                    : <div className={'flex space-x-6 pt-5'}>
                                        <div className="lg:hidden justify-center space-x-12 items-center">
                                            <Link to="/login" className="py-2 px-3 border rounded-md">
                                                Login
                                            </Link>
                                            <Link to={'/signup'}
                                                  className={'bg-gradient-to-r from-green-500 to-green-900 py-2 px-3 rounded-md'}>Create
                                                an Account</Link>
                                        </div>
                                    </div>
                            }

                        </div>
                    )
                }

            </div>
            <motion.div className={"w-full h-1 mt-1"}
                 style={{
                     scaleX: scaleX,
                     backgroundImage:backgroundImage,
                     transformOrigin:'left'
                 }}
            />

        </nav>
    );

}

export default Navbar

