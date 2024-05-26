import LoadingComponent from "../components/utils/Loading.tsx";
import {animate, motion, useMotionTemplate, useMotionValue} from "framer-motion";
import {ChangeEvent, useEffect, useState} from "react";
import {onValue, ref, set} from "firebase/database";
import {auth, database} from "../firebase.ts";
import User from "../obj/User.tsx";
import {Tooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'

import {Info} from "lucide-react";
import Navbar from "../components/Navbar.tsx";
import {useNavigate} from "react-router-dom";

const RequestProjectPage = (props: { isLogin: boolean | null, user: User | null; }) => {
    const isLogin = props.isLogin;
    const [user, setUser] = useState<User | null>(null);
    // State variables for form fields
    const [projectName, setProjectName] = useState('');
    const [projectRepo, setProjectRepo] = useState('')
    const [projectDescription, setProjectDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [projectType, setProjectType] = useState('');
    const [platform, setPlatform] = useState('');
    const [designPreferences, setDesignPreferences] = useState('');
    const [coreFeatures, setCoreFeatures] = useState('');
    const [additionalFeatures, setAdditionalFeatures] = useState('');
    const [budget, setBudget] = useState('');
    const [deadline, setDeadline] = useState('');
    const [comments, setComments] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
                const dataRef = ref(database, "users/" + user?.uid);
                onValue(dataRef, (snapshot) => {
                    const data = snapshot.val() as User;
                    setUser(data);
                });
        });
        return () => unsubscribe();

    }, []);


    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // Validation logic
        if (!projectRepo) {
            alert("Project ID is required");
            return;
        }
        if (!projectName) {
            alert("Project Name is required");
            return;
        }
        if (!projectDescription) {
            alert("Project Description is required");
            return;
        }
        if (!phone || !/^\d{10}$/.test(phone)) {
            alert("Valid 10-digit phone number is required");
            return;
        }
        if (!projectType) {
            alert("Project Type is required");
            return;
        }
        if (!platform.length) {
            alert("At least one platform must be selected");
            return;
        }
        if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
            alert("Valid budget is required");
            return;
        }
        if (!deadline) {
            alert("Deadline is required");
            return;
        }

        // Form data to save
        const formData = {
            projectRepo,
            projectName,
            projectDescription,
            phone,
            projectType,
            platform,
            designPreferences,
            coreFeatures,
            additionalFeatures,
            budget,
            deadline,
            comments,
            isApproved: false,
            uid:user?.uid
        };

        // Save Request Project data to Realtime Database
        set(ref(database, 'users/' + user?.uid + '/projects/' + projectRepo), formData)
            .then(() => {
                alert("Your Request Submitted Successfully");
                navigate('/profile');
            })
            .catch((error) => {
                console.error("Error submitting request:", error);
                alert("Failed to submit request. Please try again.");
            });
    };

    const handleProjectRepoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Validate to allow only alphanumeric characters and underscores
        if (/^[a-zA-Z0-9_]*$/.test(value)) {
            setProjectRepo(value);
        } else {
            alert("Only alphanumeric characters and underscores are allowed");
        }
    };



    const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
    const color = useMotionValue(COLORS_TOP[0]);


    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "anticipate",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);
    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
    const buttonBg = useMotionTemplate`linear-gradient(30deg,${color},white)`;
    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
    return (
        <div className={"flex flex-col h-screen"}>
            <Navbar/>
            {
                isLogin != null && user != null ?
                    isLogin ?
                        <motion.div className="flex w-full justify-center px-5 pt-24 pb-56 lg:pl-24 lg:pr-24"
                                    style={{backgroundImage}}
                        >
                            <motion.div
                                className="flex rounded-lg shadow-lg border overflow-hidden max-w-full w-full items-center bg-black"
                                style={{boxShadow, border}}
                            >
                                <div className="w-full p-8">
                                    <motion.p className="text-xl text-center" style={{color}}>Request Project</motion.p>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mt-4">
                                            <label
                                                className="block text-sm font-bold mb-2 flex flex-row gap-3 items-center">
                                                Project ID
                                                <a data-tooltip-id="tooltip"
                                                   data-tooltip-content="A unique identifier for your project for tracking functionality.">
                                                    <Info/>
                                                </a>
                                                <Tooltip id="tooltip"/>
                                            </label>
                                            <motion.input
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                type="text"
                                                value={projectRepo}
                                                onChange={(e) => handleProjectRepoChange(e)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-bold mb-2">
                                                Project Name
                                            </label>
                                            <motion.input
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                type="text"
                                                value={projectName}
                                                onChange={(e) => setProjectName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-bold mb-2">
                                                Project Description
                                            </label>
                                            <motion.textarea
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                value={projectDescription}
                                                onChange={(e) => setProjectDescription(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-bold mb-2">
                                                Contact Phone
                                            </label>
                                            <motion.input
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-bold mb-2">
                                                Project Type
                                            </label>
                                            <motion.input
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                type="text"
                                                value={projectType}
                                                onChange={(e) => setProjectType(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                className="block text-sm font-bold mb-2 flex flex-row gap-2 items-center">
                                                Service Type
                                                <a data-tooltip-id="tooltip"
                                                   data-tooltip-content="Which type of Application or Software you needed">
                                                    <Info/>
                                                </a>
                                            </label>
                                            <motion.select
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                value={platform}
                                                onChange={(e) => setPlatform(e.target.value)}
                                                required
                                            >
                                                <option value="web" selected={true}>Web Development</option>
                                                <option value="android">Android Development</option>
                                                <option value="ios">Cross Platform App Development</option>
                                                <option value="desktop">Desktop Development</option>
                                                <option value="api">API Development</option>
                                                <option value="backend">Backend Development</option>
                                                <option value="other">Other Service</option>
                                            </motion.select>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                className="block text-sm font-bold mb-2 flex flex-row gap-2 items-center">
                                                Design Preferences
                                                <a data-tooltip-id="tooltip"
                                                   data-tooltip-content="Any Example or Existing Resources or URL of that site.">
                                                    <Info/>
                                                </a>
                                            </label>
                                            <motion.textarea
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                value={designPreferences}
                                                onChange={(e) => setDesignPreferences(e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-bold mb-2">
                                                Core Features
                                            </label>
                                            <motion.textarea
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                value={coreFeatures}
                                                onChange={(e) => setCoreFeatures(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-bold mb-2">
                                                Additional Features
                                            </label>
                                            <motion.textarea
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                value={additionalFeatures}
                                                onChange={(e) => setAdditionalFeatures(e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                className="block text-sm font-bold mb-2 flex flex-row gap-3 items-center">
                                                Budget
                                                <a data-tooltip-id="tooltipBudget"
                                                   data-tooltip-content="Estimated budget for the project. (in Rupees)">
                                                    <Info/>
                                                </a>
                                                <Tooltip id="tooltipBudget"/>
                                            </label>
                                            <motion.input
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                type="number"
                                                value={budget}
                                                onChange={(e) => setBudget(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <label
                                                className="block text-sm font-bold mb-2 flex flex-row gap-3 items-center">
                                                Deadline
                                                <a data-tooltip-id="tooltipDeadline"
                                                   data-tooltip-content="Expected project completion date.">
                                                    <Info/>
                                                </a>
                                                <Tooltip id="tooltipDeadline"/>
                                            </label>
                                            <motion.input
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                type="date"
                                                value={deadline}
                                                onChange={(e) => setDeadline(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <label
                                                className="block text-sm font-bold mb-2 flex flex-row gap-3 items-center">
                                                Comments
                                                <a data-tooltip-id="tooltipComments"
                                                   data-tooltip-content="Additional information or special requests.">
                                                    <Info/>
                                                </a>
                                                <Tooltip id="tooltipComments"/>
                                            </label>
                                            <motion.textarea
                                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                                value={comments}
                                                onChange={(e) => setComments(e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <motion.button type={"submit"}
                                                           onClick={handleSubmit}
                                                           className={"text-black backdrop-blur-3xl shadow-lg font-bold py-2 px-4 w-full rounded hover:bg-black"}
                                                           style={{backgroundImage: buttonBg}}
                                            >
                                                Submit
                                            </motion.button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                        : <div><h1>Please Login First</h1></div>
                    : <div className={"flex h-screen justify-center items-center"}><LoadingComponent/></div>

            }
        </div>

    );
}

export default RequestProjectPage;
