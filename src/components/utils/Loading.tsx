const LoadingComponent = () =>{

    return (
        <div className={'flex justify-center items-center text-center'}>
            <span className={'text-2xl pe-2'}>Loading</span>
            <span className="text-2xl animate-loading-dot-1">.</span>
            <span className="text-2xl animate-loading-dot-2">.</span>
            <span className="text-2xl animate-loading-dot-3">.</span>
        </div>
    );
}
export default LoadingComponent
