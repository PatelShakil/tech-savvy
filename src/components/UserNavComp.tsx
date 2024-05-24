import {useEffect, useState} from "react";
import {auth, database} from "../firebase.ts";
import {onValue, ref} from "firebase/database";
import LoadingComponent from "./utils/Loading.tsx";
import {Link} from "react-router-dom";
import User from "../obj/User.tsx";
import ProfileImage from "./utils/ProfileImage.tsx";


export const handleLogout = () => {
    auth.signOut();
    window.location.reload();
}


const UserNavComp = () => {

    const [user, setUser] = useState<User | null>(null)


    useEffect(() => {

        const dataRef = ref(database, "users/" + auth.currentUser!.uid);

        onValue(dataRef, (snapshot) => {

            const data = snapshot.val() as User;
            setUser(data);
        });
    }, []);


    return (
        <div className={"flex flex-row gap-2 items-center"}>
            {user != null ?
                <Link to={'/profile'} className={"flex flex-row items-center"}>
                    <ProfileImage username={user.name} height={"45"} width={"45"}/>

                        <span className={'text-sm'}>
                  {user.name}
          </span>
                </Link>
                : <LoadingComponent/>
            }
            <button
                onClick={handleLogout}
                className={'ml-2 drop-shadow-lg bg-gradient-to-r from-red-700 to-black px-3 py-2 rounded-xl'}>
                {
                    <span className={'text-sm'}>
                    Logout
                    </span>
                }
            </button>
        </div>
    );
}

export default UserNavComp
