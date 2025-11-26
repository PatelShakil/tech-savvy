import ServicesItem from "../../obj/ServicesItem.tsx";
export const services: ServicesItem[] = [
    {
        id: 2,
        name: 'Web Development',
        color: '#ed9c1f',
        icon: null,
        description: 'Our web development services focus on creating dynamic, responsive, and user-friendly websites. We specialize in the latest web technologies to ensure your online presence is robust and scalable.'
    },
    {
        id: 3,
        name: 'Android Development',
        color: '#88cc2e',
        icon: null,
        description: 'We build high-performance Android applications tailored to your needs. Our apps are designed for optimal user experience, leveraging the full potential of the Android platform to deliver exceptional functionality.'
    },
    {
        id: 4,
        name: 'College Projects',
        color: '#3fc563',
        icon: null,
        description: 'Our team assists students in developing comprehensive college projects that meet academic standards. We provide guidance and technical support, ensuring your project is well-researched and professionally presented.'
    },
    {
        id: 5,
        name: 'Mobile Development',
        color: '#39b8a6',
        icon: null,
        description: 'We create innovative mobile applications for various platforms, ensuring seamless functionality and superior user experience. Our solutions are tailored to meet your specific business needs and drive engagement.'
    },
    {
        id: 6,
        name: 'API Development',
        color: '#39a4e5',
        icon: null,
        description: 'Our API development services focus on building robust and secure APIs that enable seamless communication between different systems. We ensure our APIs are scalable, reliable, and easy to integrate.'
    },
    {
        id: 7,
        name: 'Backend Development',
        color: '#8b56f1',
        icon: null,
        description: 'Specializing in server-side development, we ensure your application runs efficiently and securely. Our backend solutions are designed to support your front-end applications and provide a solid foundation for your digital presence.'
    },
    {
        id: 8,
        name: 'Desktop Development',
        color: '#d23aea',
        icon: null,
        description: 'We develop reliable and user-friendly desktop applications tailored to your specific needs. Our solutions are designed to enhance productivity and provide a seamless user experience across different operating systems.'
    }
];


export function LightenDarkenColor(col: string, amt: number) {
    let usePound = false;
    if ( col[0] == "#" ) {
        col = col.slice(1);
        usePound = true;
    }

    const num = parseInt(col, 16);

    let r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;

    let g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

export function generateId(batch: string): string {
    const now = new Date();

    const pad = (num: number) => num.toString().padStart(2, '0');
    const hours = now.getHours();
    const minutes = pad(now.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert to 12-hour format
    const day = pad(now.getDate());
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    return `TS_${pad(hours12)}_${minutes}_${ampm}_${day}_${month}_${year}_${batch}`;
}

