import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db as firestore } from "../../firebase";
import { Helmet } from "react-helmet";
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import ClassesObj from "../../obj/ClassesObj.tsx";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const AdminClasses = () => {
    const color = useMotionValue(COLORS_TOP[0]);
    const [classes, setClasses] = useState<ClassesObj[]>([]);

    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "anticipate",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });

        const fetchClasses = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'classes'));
            const classesData = querySnapshot.docs.map(doc => doc.data());
            setClasses(classesData as ClassesObj[]);
        };

        fetchClasses();
    }, []);

    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

    return (
        <motion.div className="flex flex-col items-center justify-center py-16 w-full px-5 sm:px-0" style={{ backgroundImage }}>
            <Helmet>
                <title>Admin Classes | Tech Savvy</title>
                <meta property="og:url" content="https://techsavvysolution.in/admin/classes" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Admin Classes | Tech Savvy" />
                <meta property="og:description"
                      content="Manage all classes in Tech-Savvy Solution. View, edit, and delete classes from this admin panel." />
                <meta property="og:image" content="https://techsavvysolution.in/assets/admin_classes.png" />
            </Helmet>
            <motion.div
                className="flex flex-col rounded-lg shadow-lg border overflow-hidden items-center max-w-4xl w-full bg-black"
                style={{ boxShadow, border }}>
                <motion.p className="text-2xl text-center mt-8 mb-4" style={{ color }}>Admin Classes</motion.p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 w-full">
                    {classes.map((classData, index) => (
                        <motion.div key={index} className="border border-gray-300 text-wrap rounded p-4 bg-black shadow-lg">
                            <p className={"text-wrap"}><strong>ID:</strong> {classData.id}</p>
                            <p><strong>Batch:</strong> {classData.batch}</p>
                            <p><strong>Start Time:</strong> {new Date(classData.starttime).toLocaleString()}</p>
                            <p><strong>End Time:</strong> {new Date(classData.endtime).toLocaleString()}</p>
                            <p><strong>Description:</strong> {classData.desc}</p>
                            <p className={"mb-2"}><strong>Meet Link:</strong> <a href={classData.meet} target="_blank" rel="noopener noreferrer">{classData.meet}</a></p>
                            {
                                classData.tags ?
                                    classData.tags.toString().split(",").map((str : string) =>
                                        <span
                                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{str}</span>
                                    )
                                    : null
                            }
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminClasses;
