import {ProjectData} from "./ProjectData.tsx";

export default interface User {
    name: string,
    uid: string,
    password: string,
    email: string,
    projects:ProjectData[] | null
}
