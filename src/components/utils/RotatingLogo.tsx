import {motion} from "framer-motion";

export const RotatingLogo = () => {
    return (
        <motion.img
            src="/assets/logo_gr_tr.png"
            alt="Logo"
            className="h-12 mr-2 rounded-full"
            // animate={{ rotate: 360 }}
            // transition={{
            //     repeat: Infinity,
            //     repeatType: "reverse",
            //     duration: 5,
            //     ease: "anticipate",
            // }}
        />
    );
};

