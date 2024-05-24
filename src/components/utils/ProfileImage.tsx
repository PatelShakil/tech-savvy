import { minidenticon } from 'minidenticons'
import { useMemo } from 'react'

const ProfileImage = (props: { username: string ,height:string,width:string}) => {
    const username = props.username
    const height = props.height;
    const width = props.width;
    const svgURI = useMemo(
        () => 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(username)),
        [username]
    )
    return (<img src={svgURI} alt={username} height={height} width={width} className={`rounded-full bg-gray-800 shadow-lg`}/>)
}
export default ProfileImage
