import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import User from "../../../obj/User.tsx";
import {auth,database} from "../../../firebase.ts";

export const useAuthState = () => {
    const [isLogin, setIsLogin] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLogin(!!user);
            if (user) {
                const dataRef = ref(database, "users/" + user.uid);
                onValue(dataRef, (snapshot) => {
                    const data = snapshot.val() as User;
                    setUser(data);
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return { isLogin, user };
};
