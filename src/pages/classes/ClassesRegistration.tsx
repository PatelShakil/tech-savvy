import {useEffect} from "react";

const ClassesRegistration = () =>{
    useEffect(() => {
        window.location.href = 'https://tech-savvy-solution.web.app/classes';

    }, []);
    return(
        <div>
            <h1 className={"mt-96"}>Classes Registration</h1>
        </div>
    );
}

export default ClassesRegistration
