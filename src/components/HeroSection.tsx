import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FiArrowRight } from "react-icons/fi";
import {
    useMotionTemplate,
    useMotionValue,
    motion,
    animate,
} from "framer-motion";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {auth} from "../firebase.ts";


const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;
const HeroSection = () => {
    const color = useMotionValue(COLORS_TOP[0]);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(
        false
    );
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLogin(!!user);
        });
        return () => unsubscribe();
    },[]);

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
        <motion.section
            style={{
                backgroundImage,
            }}
            className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
        >
            <div className="relative z-10 flex flex-col items-center">
        <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
          50% off on first Project
        </span>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
                    Shaping Your Future With
                    <span className="text-transparent bg-clip-text"
                          style={{ backgroundImage: gradient }}
                    >
                {" "}
                        Our Code.
                </span>
                </h1>
                <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
                    At <b>Shakil IT Solution</b>, we specialize in delivering top-notch IT services tailored to your unique business requirements. From web and mobile app development to robust backend solutions and dynamic API integration, we cover all aspects of software development. Our expertise spans full-stack development, cross-platform mobile applications, and comprehensive DevOps practices. We pride ourselves on providing innovative, scalable, and efficient solutions that help your business thrive in a digital world. Let's build the future together.
                </p>
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
                    onClick={()=>{
                        if(isLogin) {
                            navigate('/profile');
                        }else {
                            navigate('/signup');
                        }
                    }}
                    className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
                >
                    {isLogin ? "Go to Profile" : "Create an Account"}
                    <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12"/>
                </motion.button>
            </div>

            <div className="absolute inset-0 z-0">
                <Canvas>
                    <Stars radius={50} count={2500} factor={4} fade speed={2}/>
                </Canvas>
            </div>
        </motion.section>
    );
};

export default HeroSection
