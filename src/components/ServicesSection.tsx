import {motion} from "framer-motion";
import {services} from "./utils/Constants.tsx";
import ServiceCard from "./utils/ServicesCard.tsx";

const ServicesSection = () =>{

    const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

    const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;
    return (
        <div>
            <motion.h1
                className={"text-center font-bold text-4xl md:text-6xl lg:text-8xl m-3 text-transparent bg-clip-text"}
                style={{
                    backgroundImage: gradient,
                    position: 'relative', // Ensures it moves without affecting other elements
                }}
                initial={{
                    scale: 0.2,
                    rotate: "0deg",
                    x: 0,
                }}

                transition={{
                    duration: 1,
                    ease: 'easeIn',
                }}
                whileInView={{
                    rotate: "0deg",
                    scale: 1,
                    x: [0, -150, 150, 0],
                }}
                viewport={{once: false, amount: 0.5}}

            >
                Our Services
            </motion.h1>
                <div
                    className="container relative flex flex-col justify-between h-full max-w-6xl px-10 mx-auto xl:px-0 mt-5">
                    <p className="mb-8 text-lg text-gray-500">Here are a few of the awesome services we provide.</p>
                    <div className="w-full">
                        <div className="flex flex-wrap">
                            {services.map((service) => (
                                <ServiceCard key={service.id} {...service} />
                            ))}
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default ServicesSection
