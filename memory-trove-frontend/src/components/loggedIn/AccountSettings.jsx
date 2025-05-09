import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AccountSettings(){
    const {logout, isLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogOut(){
        //alert(`${username} is logged out.`);
        logout();
    }

    useEffect(() => {
        if (isLoggedIn == false){
            navigate('/pages/welcome');
        }
    })

    return(
        <>
            <div className="AccountSettingsPage">
                <h1>Account Settings</h1>
                <button type = "button" onClick = {handleLogOut}>
                    Click to log out
                </button>
            </div>
            
        </>
    );
}