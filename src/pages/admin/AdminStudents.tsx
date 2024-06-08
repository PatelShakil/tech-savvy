import {useCallback, useEffect, useState} from "react";
import {onValue, ref} from "firebase/database";
import {database} from "../../firebase.ts";
import StudentModel from "../../obj/StudentModel.tsx";

const AdminStudents = () => {
    const [students, setStudents] = useState<StudentModel[]>([]);


    const fetchStudents = useCallback(() => {
        const dataRef = ref(database, "students");
        onValue(dataRef, (snapshot) => {
            const list: StudentModel[] = [];
            snapshot.forEach((ch) => {
                list.push(ch.val());
            });
            setStudents(list);
        });
    }, []);

    useEffect(() => {
        fetchStudents()
    }, []);



    return(
        <div className={"justify-center items-center flex flex-col mt-16"}>
            <h1 className={"text-green-500 text-4xl font-bold my-3"}>Students</h1>
            <div className={"flex flex-wrap"}>
            {
                students.length > 0 && (
                    students.map((std,index)=>(
                        <div key={index} className={`flex flex-col p-5 ${std.isConfirmed ? "bg-emerald-950" : "bg-red-950"} rounded-lg m-2`}>
                            <h1 >
                                {
                                    index+1
                                }
                            </h1>
                            <h1>
                                {std.name}
                            </h1>
                            <button  onClick={()=>{
                                window.location.href = "https://wa.me/91" + std.phone
                            }}
                            className={"bg-green-500 rounded->lg hover:bg-black my-1"}
                            >
                                <h1>Message on Whatsapp</h1>
                            </button>
                            <span>
                                {std.email}
                            </span>
                        </div>
                    ))
                )
            }
            </div>
        </div>
    )
}

export default AdminStudents;
