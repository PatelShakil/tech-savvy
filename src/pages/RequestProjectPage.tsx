import LoadingComponent from "../components/utils/Loading.tsx";

const RequestProjectPage = (props: { isLogin: boolean | null; }) =>{
    const isLogin = props.isLogin;
    return(
        <div>
            {
                isLogin != null?
                    isLogin ?
                        <div>Request Project</div>
                        : <div><h1>Please Login First</h1></div>
                    :<div className={"flex h-screen justify-center items-center"}><LoadingComponent /> </div>

            }
        </div>

    );
}

export default RequestProjectPage;
