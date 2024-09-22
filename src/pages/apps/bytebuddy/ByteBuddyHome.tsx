
const ByteBuddyHome = () => {
    return (
        <div className="flex flex-col mt-16 pt-4 mb-10 bg-black text-white">
            {/* Banner Section */}
            <div className="mx-2 justify-center w-fit justify-self-center mx-auto rounded-lg shadow-lg bg-black mb-5">
                <img
                    className="object-contain rounded-lg animate-fade-in"
                    src={"../assets/bytebuddy_banner.jpg"}
                    alt={"ByteBuddy Banner"} />
            </div>

            {/* Header Section */}
            <div className="flex flex-col px-6">
                <div
                    className="flex mt-5 bg-[#111] rounded-lg w-full items-center justify-start p-4 lg:p-10 gap-x-5">
                    <img src={"../assets/bytebuddy_logo.png"}
                         alt={"ByteBuddy Logo"}
                         className="rounded-full w-24 shadow-2xl "/>
                    <p className="lg:text-3xl text-2xl font-semibold">
                        ByteBuddy <br/>
                        <span className="text-blue-400">The EduCollab Center</span>
                    </p>
                </div>
            </div>

            {/* Key Features Section */}
            <section className="mt-10 px-6">
                <h2 className="text-center text-4xl font-bold mb-6 animate-slide-in-left">Why ByteBuddy?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-[#222] p-6 rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105">
                        <i className="fas fa-book-open text-blue-400 text-3xl mb-4"></i>
                        <h3 className="text-xl font-semibold">Learning Module</h3>
                        <p className="mt-2">
                            Offers in-depth course material, including BCA, MSC ICT, and multiple programming languages.
                            Users can upload and access notes.
                        </p>
                    </div>
                    <div className="bg-[#222] p-6 rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105">
                        <i className="fas fa-code text-blue-400 text-3xl mb-4"></i>
                        <h3 className="text-xl font-semibold">FAQ Module</h3>
                        <p className="mt-2">
                            Post questions with code, images, or screenshots, similar to Stack Overflow. Answers can be upvoted, downvoted, or saved.
                        </p>
                    </div>
                    <div className="bg-[#222] p-6 rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105">
                        <i className="fas fa-comments text-blue-400 text-3xl mb-4"></i>
                        <h3 className="text-xl font-semibold">Chat Module</h3>
                        <p className="mt-2">
                            Enables one-to-one chat, including features like message deletion, editing, and more.
                        </p>
                    </div>
                </div>
            </section>

            {/* Technical Approach Section */}
            <section className="mt-10 px-6 bg-[#111] py-10 rounded-lg">
                <h2 className="text-center text-4xl font-bold mb-6 animate-pulse">What We Have ?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Smart Learning */}
                    <div className="bg-[#222] p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-400 mb-2">Smart Learning</h3>
                        <ul className="list-disc ml-5">
                            <li>In-depth notes for BCA, MSC ICT, and programming languages.</li>
                            <li>Listen to notes, translate them, and save them for future use.</li>
                            <li>Upload custom notes and share knowledge with peers.</li>
                        </ul>
                    </div>

                    {/* Real-time Collaboration */}
                    <div className="bg-[#222] p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-400 mb-2">Real-time Collaboration</h3>
                        <ul className="list-disc ml-5">
                            <li>Peer-to-peer chat for real-time discussions.</li>
                            <li>FAQs with community-driven upvotes and code discussions.</li>
                            <li>Interactive discussions for deeper understanding.</li>
                        </ul>
                    </div>

                    {/* Scalable Infrastructure */}
                    <div className="bg-[#222] p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-400 mb-2">Scalable Infrastructure</h3>
                        <ul className="list-disc ml-5">
                            <li>Cloud-based infrastructure ensuring high availability.</li>
                            <li>Fast response time for quick access to learning materials.</li>
                            <li>Global reach and minimal latency for students across the world.</li>
                        </ul>
                    </div>

                    {/* Security */}
                    <div className="bg-[#222] p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-400 mb-2">Security</h3>
                        <ul className="list-disc ml-5">
                            <li>End-to-end encrypted chat and data transfer.</li>
                            <li>Robust authentication and user data privacy protection.</li>
                            <li>Periodic security audits to ensure the highest standard.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="mt-10 justify-center flex flex-col items-center gap-y-6 bg-[#111] text-gray-400 py-6">
                <a href={"https://play.google.com/store/apps/details?id=com.shakilpatel.notesapp"}>
                <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"} alt={""}
                className={"w-44 cursor-pointer"}/>
                </a>
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 ByteBuddy | All rights reserved</p>
                </div>
            </footer>
        </div>
    );
}

export default ByteBuddyHome;
