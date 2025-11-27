import {useEffect, useState} from "react";
import {Menu, X} from "lucide-react";
import {auth} from "../firebase.ts";
import LoadingComponent from "./utils/Loading.tsx";
import {Link, useLocation} from "react-router-dom";
import UserNavComp from "./UserNavComp.tsx";
import NavItem from "../obj/NavItem.tsx";
import {animate, motion, useMotionTemplate, useMotionValue, useScroll} from "framer-motion";
import {RotatingLogo} from "./utils/RotatingLogo.tsx";


const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const Navbar = () => {


    const navListData: NavItem[] = [
        {
            "name": "Programs",
            "path": "/programs"
        },
        {
            "name": "Services",
            "path": "/services"
        },
        {
            "name": "Projects",
            "path": "/projects"
        },
        {
            "name": "About Us",
            "path": "/aboutus"
        },
        {
            "name": "Contact Us",
            "path": "/contactus"
        }
    ];
    const location = useLocation();

    const {scrollYProgress} = useScroll();
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

    if(window.location.pathname.includes("/admin")) return ;

    return (
        <nav className={'fixed z-50 w-full pt-1 bg-gray-900 border-b-neutral-700 shadow-green-400'}>
            <div className={''}>
                <div className={'flex justify-between items-center text-sm px-2'}>
                    <Link to={"/"} className={'flex items-center flex-shrink-0'}>
                        <RotatingLogo/>
                        <motion.span className={"text-2xl lg:text-3xl font-bold bg-clip-text text-transparent"}
                                     style={{backgroundImage}}>Tech Savvy
                        </motion.span>
                    </Link>
                    <ul
                        className={'hidden lg:flex space-x-8'}>
                        {
                            navListData.length != 0 ?
                                navListData.map((item, i) => <li key={i}>
                                        {
                                            <Link reloadDocument={true}
                                                  className={"text-gray-400  text-sm hover:text-white font-bold " +
                                                      `${location.pathname === item.path && "text-white underline rounded-xl"}`}
                                                  to={item.path}
                                            >{item.name}
                                            </Link>
                                        }
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
                        <div className={"fixed flex flex-col h-screen w-full shadow-lg z-20 lg:hidden"}>
                            <div
                                className={'relative bg-neutral-900 pb-12 flex flex-col justify-center items-center '}>
                                <ul className={'text-center space-y-5 my-5'}>
                                    {
                                        navListData.length != 0 ?
                                            navListData.map((item, i) =>
                                                <li>
                                                    <Link key={i} reloadDocument={true}
                                                          className={"text-gray-200 backdrop-blur-2xl rounded-lg p-1 bg-neutral-600 px-3 text-sm hover:text-black font-bold " +
                                                              `${location.pathname === item.path && "text-black underline rounded-xl"}`}
                                                          to={item.path}>{item.name}
                                                    </Link>
                                                </li>
                                            ) : <LoadingComponent/>
                                    }
                                </ul>
                                {
                                    auth.currentUser != null ?
                                        <UserNavComp/>
                                        : <div className="flex flex-col justify-center">
                                                <a href="/login" className="py-2 text-center px-3 border rounded-md mb-2">
                                                    Login
                                                </a>

                                                <a href={'/signup'}
                                                      className={'bg-green-600 text-center py-2 px-3 rounded-md'}>Create
                                                    an Account</a>
                                        </div>
                                }
                            </div>
                            <div className={"flex-1 backdrop-blur-2xl bg-transparent"}
                            onClick={toggleNavbar}
                            >

                            </div>
                        </div>
                    )
                }

            </div>
            <motion.div className={"w-full h-1 mt-1"}
                        style={{
                            scaleX: scrollYProgress,
                            backgroundImage: backgroundImage,
                            transformOrigin: 'left'
                        }}
            />

        </nav>
    );

}

export default Navbar
