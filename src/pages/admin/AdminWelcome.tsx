import {useNavigate} from "react-router-dom";

interface AdminOperation {
    name:string,
    path:string
}


const AdminWelcome = () =>{

    const navigate = useNavigate();

    const opList :AdminOperation[]= [
        {
            name:"Students",
            path:"/students"
        },
        {
            name:"Classes",
            path:"/classes"
        }
    ]


    return(
        <div className={"flex flex-col justify-center items-center mt-16"}>
            <h1 className={"text-center text-8xl"}>Welcome Admin</h1>
            <div className={"flex flex-wrap"}>
                {
                    opList.map((op:AdminOperation,index) => (
                        <button key={index}
                                className={"shadow-lg bg-gray-800 p-5 rounded-lg hover:bg-black m-2"}
                                onClick={()=>navigate("/admin"+op.path)}
                        >
                            <h1>
                                {op.name}
                            </h1>
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default AdminWelcome
