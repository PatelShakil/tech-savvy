import ProjectsSection from "../components/ProjectsSection.tsx";
import {Helmet} from "react-helmet";

const ProjectsPage = () => {
    return (
        <div className={"flex flex-col mt-12"}>
            <Helmet>
                <title>Projects | Tech Savvy</title>
                <meta property="og:url" content="https://techsavvysolution.in/projects"/>
                <meta property="og:type" content="website"/>
                <meta property="og:title" content="Projects | Tech Savvy"/>
                <meta property="og:description"
                      content="At Tech-Savvy Solution, we specialize in delivering top-notch IT services tailored to your unique business requirements. From web and mobile app development to robust backend solutions and dynamic API integration, we cover all aspects of software development. Our expertise spans full-stack development, cross-platform mobile applications, and comprehensive DevOps practices. We pride ourselves on providing innovative, scalable, and efficient solutions that help your business thrive in a digital world. Let's build the future together."/>
                <meta property="og:image" content="https://techsavvysolution.in/assets/preview_image.png"/>
            </Helmet>
            <ProjectsSection/>
        </div>
    );
}

export default ProjectsPage
