import {useNavigate} from "react-router-dom";

const DeleteAc = () => {

    const navigate = useNavigate();
    return <div className={"h-screen flex flex-col text-center justify-center items-center"}>
        <h1 className={"text-center mb-10"}>Delete Your Account From<br/>ByteBuddy Application</h1>

        <input name={"email"} type={"email"}
               className={"bg-black text-white outline-1 p-3 rounded-md px-2 w-full mx-3 lg:w-1/3"}
               placeholder={"Enter your registered email"}/>
        <button
            onClick={()=>{
                navigate('/')
            }}
            name={"delete"} value={"Delete Anyway"}
                className={"bg-red-500 rounded-md p-3 px-5 mb-10 mt-2 w-full mx-3 lg:w-1/3 hover:bg-red-700"}>Delete
            Anyway
        </button>
    </div>
}

export default DeleteAc