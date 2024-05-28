import { Variants, motion } from "framer-motion"
import { BsCircleFill } from "react-icons/bs"
import { useEffect, useState } from "react"
type AnimatedTextProps = {
    text: string
    className?: string
}

export const slideFromBottom = {
    active: {
        y: 0,
        opacity: 1,
        transition: {
            ease: "easeInOut"
        }
    },
    hidden: {
        y: 100,
        opacity: 0
    }
}

export const slideFromTop = {
    active: {
        y: 0,
        opacity: 1,
    },
    hidden: {
        y: -100,
        opacity: 0
    }
}

export const slideFromLeft = {
    active: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            duration: 0.5
        }
    },
    hidden: {
        x: -100,
        opacity: 0
    }
}

export const scaleFromLeft = {
    active: {
        scale: 1,
        opacity: 1,
        position: "relative",
    },
    hidden: {
        scale: 0,
        opacity: 0,
        position: "absolute",
    }
}

export const shrinkVanish = {
    active: {
        scale: 1,
        opacity: 1,
    },
    hidden: {
        scale: 0,
        opacity: 0,
    }
}

export const AnimatedText = ({ text, className = '' }: AnimatedTextProps) => {
    const [circle, setCircle] = useState(true)
    const length = text.split(" ").length
    const staggerDelay = 0.0025
    const time = length * staggerDelay

    useEffect(() => {
        const timer = setTimeout(() => {
            setCircle(false)
        }, time * 1000 + 1000)

        return () => {
            clearTimeout(timer)
        }

    }, [])
    return (
        <p className="flex flex-row items-center">
            <span className="sr-only">{text}</span>
            <motion.span
                initial="hidden"
                animate="active"
                exit="hidden"
                transition={{ staggerChildren: 0.2 }}
                variants={slideFromTop}
                className={`${className} w-fit`}
                aria-hidden>
                {text.split(" ").map((word, index) => (
                    <motion.span variants={scaleFromLeft as Variants} className="" key={index}>
                        {word}
                        <span className="">&nbsp;</span>
                    </motion.span>
                ))}
            </motion.span>
            <motion.span variants={shrinkVanish} animate={circle ? "active" : "hidden"}>
                <BsCircleFill className="text-p-3 w-8 h-8" />
            </motion.span>
        </p>

    )
}
