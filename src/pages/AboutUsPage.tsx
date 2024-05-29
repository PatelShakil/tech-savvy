import {Helmet} from "react-helmet";

const AboutUsPage = () =>{
    return(
        <div className={"flex flex-col items-center justify-center min-h-screen"}>
            <Helmet>
                <title>About Us | Tech Savvy</title>
                <meta property="og:url" content="https://tech-savvy-solution.web.app"/>
                <meta property="og:type" content="website"/>
                <meta property="og:title" content="About Us | Tech Savvy"/>
                <meta property="og:description"
                      content="At Tech-Savvy Solution, we specialize in delivering top-notch IT services tailored to your unique business requirements. From web and mobile app development to robust backend solutions and dynamic API integration, we cover all aspects of software development. Our expertise spans full-stack development, cross-platform mobile applications, and comprehensive DevOps practices. We pride ourselves on providing innovative, scalable, and efficient solutions that help your business thrive in a digital world. Let's build the future together."/>
                <meta property="og:image" content="https://tech-savvy-solution.web.app/assets/preview_image.png"/>
            </Helmet>
            <h1 className={"text-4xl font-bold text-center"}>About Us</h1>
        </div>
        )
    ;
}

export default AboutUsPage
