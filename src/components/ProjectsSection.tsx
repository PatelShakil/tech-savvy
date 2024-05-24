import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import {onValue, ref} from "firebase/database";
import {database} from "../firebase.ts";
import LoadingComponent from "./utils/Loading.tsx";
import ProjectItemCard from "./utils/ProjectItemCard.tsx";

const ProjectsSection = () =>{

    const [data, setData] = useState([]);

    useEffect(()=>{

        const dataRef = ref(database,"projects");

        onValue(dataRef,(snapshot) =>{

            const d = snapshot.val();
            setData(d);
        });
    },[]);
    const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

    const gradient = `linear-gradient(to right, ${COLORS_TOP.join(', ')})`;
    // const { scrollY } = useScroll();
    // const xTransform = useTransform(scrollY, [-100,100,200], [-100, 0, 100]);



    return (
        <div id={"projects"}>
            <motion.h1 className={"text-center font-bold text-4xl md:text-6xl lg:text-8xl m-3 text-transparent bg-clip-text"}
            style={{backgroundImage:gradient,
                position: 'relative', // Ensures it moves without affecting other elements
            }}
            >
                Portfolio Projects
            </motion.h1>
            {
                data.length != 0 ?
                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 lg:grid-cols-4 gap-4 m-2 align-middle">
                        {
                            data.map((item, index) => <ProjectItemCard item={item} index={index}/>)
                        }
                    </div>
                    : <div className={"h-screen justify-center items-center"}>
                        <LoadingComponent/>
                    </div>
            }
        </div>
    );
}

export default ProjectsSection
