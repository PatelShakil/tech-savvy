import { useEffect, useState, useCallback } from "react";
import { animate, motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {collection,addDoc} from "firebase/firestore";
import {analytics,db} from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import { logEvent } from "firebase/analytics";
import {generateId} from "../../components/utils/Constants.tsx";



const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const AddClass = () => {
    const color = useMotionValue(COLORS_TOP[0]);
    const navigate = useNavigate();
    const [batch, setBatch] = useState('June-2024');
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [tags, setTags] = useState('');
    const [desc, setDesc] = useState('');
    const [meet, setMeet] = useState('');

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

    const handleAddClass = useCallback(async () => {
        if (batch && startTime && endTime && tags && desc && meet) {
            const id = generateId(batch);
            const obj = {
                id,
                batch,
                starttime: startTime,
                endtime: endTime,
                tags,
                desc,
                meet,
                created: new Date().getTime(),
            };

            try {
                await addDoc(collection(db, 'classes/'+id), obj);
                alert("Class added successfully!");
                navigate('/admin');
            } catch (error) {
                console.error("Error writing to Firestore: ", error);
            }

            setBatch('June-2024');
            setStartTime(0);
            setEndTime(0);
            setTags('');
            setDesc('');
            setMeet('');
        } else {
            alert("Please fill in all fields correctly.");
        }
    }, [batch, startTime, endTime, tags, desc, meet, navigate]);

    const getData = async () => {
        try {
            const res = await axios.get("https://api.ipify.org/?format=json");
            logEvent(analytics, 'ip_address_logged', { ip_address: res.data.ip });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <motion.div className="flex items-center justify-center py-16 w-full px-5 sm:px-0" style={{ backgroundImage }}>
            <Helmet>
                <title>Add Class | Tech Savvy</title>
                <meta property="og:url" content="https://tech-savvy-solution.web.app/classes/add" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Add Class | Tech Savvy" />
                <meta property="og:description"
                      content="At Tech-Savvy Solution, we specialize in delivering top-notch IT services tailored to your unique business requirements. From web and mobile app development to robust backend solutions and dynamic API integration, we cover all aspects of software development. Our expertise spans full-stack development, cross-platform mobile applications, and comprehensive DevOps practices. We pride ourselves on providing innovative, scalable, and efficient solutions that help your business thrive in a digital world. Let's build the future together." />
                <meta property="og:image" content="https://tech-savvy-solution.web.app/assets/classes_brochure.png" />
            </Helmet>
            <motion.div
                className="flex rounded-lg shadow-lg border overflow-hidden items-center max-w-sm lg:max-w-4xl w-full bg-black"
                style={{ boxShadow, border }}>
                <div className="w-full p-8">
                    <motion.p className="text-xl text-center" style={{color}}>Add a New Class</motion.p>
                    <div className="mt-4">
                        <label className="block text-sm font-bold mb-2">Batch</label>
                        <motion.select
                            className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                            style={{border}} value={batch} onChange={(e) => setBatch(e.target.value)} required>
                            <option value="June-2024">June-2024</option>
                        </motion.select>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-bold mb-2">Start Time</label>
                        <input
                            className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                            onChange={(e)=>setStartTime(new Date(e.target.value).getTime())}
                            type={"datetime-local"}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-bold mb-2">End Time</label>
                        <input
                            className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                            onChange={(e) => setEndTime(new Date(e.target.value).getTime())}
                            type={"datetime-local"}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-bold mb-2">Tags</label>
                        <motion.input
                            className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                            type="text" style={{border}} value={tags} onChange={(e) => setTags(e.target.value)}
                            required/>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-bold mb-2">Description</label>
                        <motion.textarea
                            className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                            style={{border}} value={desc} onChange={(e) => setDesc(e.target.value)}
                            required/>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-bold mb-2">Meet Link</label>
                        <motion.input
                            className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                            type="text" style={{border}} value={meet} onChange={(e) => setMeet(e.target.value)}
                            required/>
                    </div>
                    <div className="mt-8">
                        <motion.button type='submit' onClick={handleAddClass}
                                       className={"text-white backdrop-blur-3xl shadow-lg font-bold py-2 px-4 w-full rounded-lg border-2 border-white hover:border-white hover:bg-white hover:text-black"}>Add
                            Class
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddClass;
