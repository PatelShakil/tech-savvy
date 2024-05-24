import {useEffect, useRef} from "react";
import {
    animate,
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
} from "framer-motion";
import BubbleText from "./BubbleText.tsx";

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const ProjectItemCard = (props: { item: any; index: any; }) => {
    const item = props.item;
    const index = props.index;

    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x);
    const ySpring = useSpring(y);

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
        if (!ref.current) return [0, 0];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

        const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
        const rY = mouseX / width - HALF_ROTATION_RANGE;

        x.set(rX);
        y.set(rY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const color = useMotionValue(COLORS_TOP[0]);

    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "linear",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;


    return (
        <motion.div
            key={index}
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                transform,
                backgroundImage,
                boxShadow,
                color
            }}
            className="relative h-96 sm:w-full rounded-xl"
        >
            <div
                style={{
                    transform: "translateZ(75px)",
                    transformStyle: "preserve-3d",
                }}
                className="absolute inset-4 grid place-content-center rounded-xl shadow-lg"
            >
                <div className="px-6 py-4">
                    {
                        <BubbleText text={item.name} />
                    }

                    <p className="text-base mt-4 text-gray-100">
                        {item.shortDesc}
                    </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                    {item.platform.toString().split(",").map((str : string) => <span
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{str}</span>
                    )}
                    {
                        item.technology ?
                            item.technology.toString().split(",").map((str : string) =>
                                <span
                                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{str}</span>
                            )
                            : null
                    }
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectItemCard;
