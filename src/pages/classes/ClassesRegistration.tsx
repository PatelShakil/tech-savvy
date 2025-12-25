import { useEffect, useState, useCallback } from "react";
import { animate, motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { onValue, ref, set } from "firebase/database";
import {analytics, database} from "../../firebase";
import { useNavigate } from "react-router-dom";
import {Helmet} from "react-helmet";
import axios from "axios";
import { logEvent } from "firebase/analytics";
import ClassesRegistrationObj from "../../obj/ClassesRegistrationObj.tsx";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{10}$/;

const ClassesRegistration = () => {
    const color = useMotionValue(COLORS_TOP[0]);
    const navigate = useNavigate();
    const [regCount, setRegCount] = useState(0);
    const [penCount, setPenCount] = useState(0);

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "anticipate",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });

        const dataRef = ref(database, "students");

        const unsubscribe = onValue(dataRef, (snapshot) => {
            let count = 0;
            let countP = 0;
            snapshot.forEach((c) => {
                const std = c.val() as ClassesRegistrationObj;
                if (std.isConfirmed) {
                    count++;
                }else{
                    countP++;
                }
            });
            setPenCount(countP)
            setRegCount(count);
        });

        return () => unsubscribe();
    }, []);

    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

    const validateEmail = useCallback((email: string) => emailPattern.test(email), []);
    const validatePhone = useCallback((phone: string) => phonePattern.test(phone), []);

    const handleClassesRegistration = useCallback(() => {
        let valid = true;

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            valid = false;
        } else {
            setEmailError('');
        }

        if (!validatePhone(phone)) {
            setPhoneError("Please enter a valid 10-digit phone number.");
            valid = false;
        } else {
            setPhoneError('');
        }

        if (name && email && phone && address && valid) {
            const obj: ClassesRegistrationObj = {
                name,
                email,
                phone,
                address,
                isConfirmed: false,
                timestamp:new Date().toLocaleString()
            };

            set(ref(database, 'students/' + phone), obj)
                .then(() => {
                    alert("Registration successful!");
                    navigate('/');
                })
                .catch((error) => {
                    console.error("Error writing to Firebase: ", error);
                });

            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
        } else {
            if (!valid) {
                alert(emailError + "\n" + phoneError);
            } else {
                alert("Please fill in all fields correctly.");
            }
        }
    }, [name, email, phone, address, emailError, phoneError, validateEmail, validatePhone, navigate]);

    const getData = async () => {
        try {
            const res = await axios.get("https://api.ipify.org/?format=json");
            logEvent(analytics, 'ip_address_logged', { ip_address: res.data.ip });
        }catch(e){
            console.log(e)
        }
    };

    useEffect(() => {
        //passing getData method to the lifecycle method
        getData();
    }, []);

    return (
        <motion.div className="flex items-center justify-center py-16 w-full px-5 sm:px-0" style={{ backgroundImage }}>
            <Helmet>
                <title>Registration | Tech Savvy</title>
                <meta property="og:url" content="https://techsavvysolution.in/classes/register"/>
                <meta property="og:type" content="website"/>
                <meta property="og:title" content="Registration | Tech Savvy"/>
                <meta property="og:description"
                      content="At Tech-Savvy Solution, we specialize in delivering top-notch IT services tailored to your unique business requirements. From web and mobile app development to robust backend solutions and dynamic API integration, we cover all aspects of software development. Our expertise spans full-stack development, cross-platform mobile applications, and comprehensive DevOps practices. We pride ourselves on providing innovative, scalable, and efficient solutions that help your business thrive in a digital world. Let's build the future together."/>
                <meta property="og:image" content="https://techsavvysolution.in/assets/classes_brochure.png"/>
            </Helmet>
            <motion.div
                className="flex rounded-lg shadow-lg border overflow-hidden items-center max-w-sm lg:max-w-4xl w-full bg-black"
                style={{boxShadow, border}}>
                <div
                    className="hidden md:block lg:w-1/2 bg-cover"
                >
                    <img src={'../assets/classes_reg_lg.png'} alt={"login img"}/>
                </div>
                <div className="w-full p-8 lg:w-1/2">
                    <div className={"flex justify-center"}>
                        <PendingAnimation initialValue={0} targetValue={penCount} />
                        <CountUpAnimation initialValue={0} targetValue={regCount}/>
                    </div>
                    <div className="bg-white w-full h-0.5 my-2 rounded-lg"/>
                    <motion.p className="text-xl text-center" style={{color}}>Welcome to <br/>Tech Savvy Classes
                    </motion.p>
                    <div className="mt-4">
                        <label className="block text-sm font-bold mb-2">Your Good Name</label>
                        <motion.input
                            className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                            type="text" style={{border}} value={name} onChange={(e) => setName(e.target.value)}
                            required/>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <motion.input
                            className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                            type="email" style={{border}} value={email} onChange={(e) => setEmail(e.target.value)}
                            required/>
                        {emailError && <span className="text-red-500 text-sm">{emailError}</span>}
                    </div>
                    <div className="mt-4 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <label className="block text-sm font-bold mb-2">Phone No.</label>
                        </div>
                        <motion.input className="border rounded py-2 px-4 block w-full focus:outline-2" type="tel"
                                      style={{border}} value={phone} onChange={(e) => setPhone(e.target.value)}
                                      required/>
                        {phoneError && <span className="text-red-500 text-sm">{phoneError}</span>}
                    </div>
                    <div className="mt-4 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <label className="block text-sm font-bold mb-2">Address</label>
                        </div>
                        <motion.input className="border rounded py-2 px-4 block w-full focus:outline-2" type="text"
                                      style={{border}} value={address} onChange={(e) => setAddress(e.target.value)}
                                      required/>
                    </div>
                    <div className="mt-8">
                        <motion.button type='submit' onClick={handleClassesRegistration}
                                       className={"text-white backdrop-blur-3xl shadow-lg font-bold py-2 px-4 w-full rounded-lg border-2 border-white hover:border-white hover:bg-white hover:text-black"}>Register
                        </motion.button>
                    </div>
                </div>

            </motion.div>
        </motion.div>
    );
}

const CountUpAnimation = ({initialValue, targetValue}: { initialValue: number, targetValue: number }) => {
    const [count, setCount] = useState(initialValue);
    const duration = 4000;

    useEffect(() => {
        let startValue = initialValue;
        const interval = Math.floor(duration / (targetValue - initialValue));

        const counter = setInterval(() => {
            startValue += 1;
            setCount(startValue);
            if (startValue >= targetValue) {
                clearInterval(counter);
            }
        }, interval);

        return () => clearInterval(counter);
    }, [targetValue, initialValue]);

    return (
        <div className="flex flex-col w-full items-center justify-center space-y-2">
            <div className="flex flex-row justify-center items-center gap-2">
                <span className="text-5xl font-bold">{targetValue == 0 ? 0 : count}</span>
                <CheckCircle className="text-green-500 mb-1" />
            </div>
            <span className="text-sm font-light text-center">Confirmed<br/>Registrations</span>
        </div>
    );
};
const PendingAnimation = ({initialValue, targetValue}: { initialValue: number, targetValue: number }) => {
    const [count, setCount] = useState(initialValue);
    const duration = 4000;

    useEffect(() => {
        let startValue = initialValue;
        const interval = Math.floor(duration / (targetValue - initialValue));

        const counter = setInterval(() => {
            startValue += 1;
            setCount(startValue);
            if (startValue >= targetValue) {
                clearInterval(counter);
            }
        }, interval);

        return () => clearInterval(counter);
    }, [targetValue, initialValue]);

    return (
        <div className="flex flex-col w-full items-center justify-center space-y-2">
            <div className="flex flex-row justify-center items-center gap-2">
                <span className="text-5xl font-bold">{targetValue == 0 ? 0 : count}</span>
                <CheckCircle className="text-yellow-500 mb-1" />
            </div>
            <span className="text-sm font-light text-center">Pending<br/>Registration</span>
        </div>
    );
};

export default ClassesRegistration;
