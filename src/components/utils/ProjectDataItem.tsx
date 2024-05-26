import {ProjectData} from "../../obj/ProjectData.tsx";
import {animate,motion, useMotionTemplate, useMotionValue} from "framer-motion";
import {useEffect} from "react";

const ProjectDataItem = (props: { index: number; item: ProjectData; }) =>{
    const index = props.index;
    const item = props.item;
    const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
    const color = useMotionValue(COLORS_TOP[0]);

    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "anticipate",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    },[] );



    return(
      <motion.div key={index} className={"relative h-96 sm:w-full rounded-3xl shadow-lg flex"}
      style={{border,boxShadow}}>
          <div className={"flex flex-col pl-2 pr-2 overflow-scroll md:overflow-hidden lg:overflow-hidden rounded-3xl"}>
              <h1 className={"sticky top-0 p-3 text-3xl bg-black"}>{item.projectName}</h1>
              <span className={"ml-5 p-2 pb-12"}>{item.projectDescription}</span>

              {
                  item.isApproved ?
                      <span
                          className="absolute bottom-1 right-1 mb-2 text-right bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Approved</span>
                      : <span
                          className="absolute bottom-1 right-1 mb-2 text-right bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Pending Confirmation</span>

              }

          </div>
      </motion.div>
    );
}

export default ProjectDataItem
