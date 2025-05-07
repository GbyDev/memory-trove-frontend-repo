import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AccountSettings(){
    //const {logout, username, isLoggedIn} = useContext(AuthContext);
    const {logout, isLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogOut(){
        //alert(`${username} is logged out.`);
        logout();
    }

    useEffect(() => {
        if (isLoggedIn == false){
            setTimeout(() => {
                navigate('/pages/welcome');
            }, 2000);
            
        }
    })


    return(
        <>
            <h1>Account Settings</h1>
            <button
                type = "button"
                onClick = {handleLogOut}
            >Click to log out</button>
        </>
    );
}