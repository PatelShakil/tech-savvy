import {FiArrowRight} from "react-icons/fi";
import {animate, motion, useMotionTemplate, useMotionValue} from "framer-motion";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const ClassesPage = () => {
    const color = useMotionValue(COLORS_TOP[0]);
    const navigate = useNavigate();
    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "anticipate",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);

    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
    return (
        <div className={"flex flex-col mt-12 lg:mt-16"}>
            <Helmet>
                <title>Classes | Tech Savvy</title>
                <meta property="og:url" content="https://techsavvysolution.in/classes"/>
                <meta property="og:type" content="website"/>
                <meta property="og:title" content="Classes | Tech Savvy"/>
                <meta property="og:description"
                      content="At Tech-Savvy Solution, we specialize in delivering top-notch IT services tailored to your unique business requirements. From web and mobile app development to robust backend solutions and dynamic API integration, we cover all aspects of software development. Our expertise spans full-stack development, cross-platform mobile applications, and comprehensive DevOps practices. We pride ourselves on providing innovative, scalable, and efficient solutions that help your business thrive in a digital world. Let's build the future together."/>
                <meta property="og:image" content="https://techsavvysolution.in/assets/classes_brochure.png"/>
            </Helmet>
            <div className={"flex flex-col items-center justify-center w-full"}>
            <img src={"../assets/classes_landing.gif"} alt={"Gif"}
                     className={"shadow-lg mx-2 rounded-lg lg:h-96 lg:w-full lg:object-cover"}/>
            </div>
            <div className={"py-5 pb-12 bg-black flex justify-center"}>
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
                        navigate('/classes/register')
                    }}
                    className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
                >
                    {"Apply Now"}
                    <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12"/>
                </motion.button>
            </div>
            <div className={"flex w-full items-center justify-center"}>
                <img src={"../assets/classes_brochure.png"} alt={"Brochure"} className={"h-fit"}/>
            </div>


        </div>
    )
}

export default ClassesPage
