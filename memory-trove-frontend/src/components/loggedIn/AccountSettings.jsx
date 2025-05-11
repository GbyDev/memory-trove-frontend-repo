import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export default function AccountSettings(){
    const [username, set_username] = useState("");
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [password_reveal, set_password_reveal] = useState(false);
    const [prompt, setPrompt] = useState("");
    const {user, userId, logout, login, isLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogOut(){
        //alert(`${username} is logged out.`);
        logout();
    }
    

    useEffect(() => {
        //Predetermined values (old values)
        if (user){
            set_username(username);
            set_password(password);
        }
        if (isLoggedIn == false){
            navigate('/pages/welcome');
        }
    }, [username, email, password, isLoggedIn]);


    async function handle_submit(e){
        e.preventDefault();
        const promptElement = document.querySelector('.prompt');
        
        function setPromptColor(msgType) {
            if (msgType === 'error') 
                promptElement.style.color = "red";
            else if (msgType === 'success') 
                promptElement.style.color = "green";
            else 
                promptElement.style.color = "black"; // Default color
        }

        function areInputsInvalid(){
            //If username has an @ symbol
            if (username.includes('@')){
                setPromptColor('error');
                setPrompt("Username cannot contain an '@' symbol.");
                return true;
            }

            //If empty
            if (username === '' || email === '' || password === ''){ 
                setPromptColor('error');
                setPrompt("Please fill in all fields.");
                return true;
            }   

            //If username is less than 3 characters
            if (username.length < 3){
                setPromptColor('error');
                setPrompt("Username must be at least 3 characters long.");
                return true;
            }

            //If username exceeds 30 characters
            if (username.length > 30){
                setPromptColor('error');
                setPrompt("Username cannot exceed 30 characters.");
                return true;
            }

            //If password is less than 8 characters
            if (password.length < 8){
                setPromptColor('error');
                setPrompt("Password must be at least 8 characters long.");
                return true;
            }
            return false; // All inputs are valid
        }

        async function sendToBackend(){
            let response = {}; // Initialize response variable
            try {
                    response = await axios.post('http://localhost/memory-trove-backend/updateAccount.php', {
                    userId: userId,
                    username: username,
                    email: email,
                    password: password,
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json', 
                    }
                });
                console.log('Data sent!');
                setPromptColor(response.data.messageType);
                setPrompt(response.data.message); //Display connection message from the backend (IMPORTANT NI)
    
            } 
            catch (error) {
                console.error('Error sending data', error);
                setPromptColor('error');
                setPrompt("There was an error during registration.");
            }
            return response.data; // Return the response
        }



        //Function calls
        if (areInputsInvalid()) return;
        let response = await sendToBackend();
        login({
            username: response.newUsername,
            email: response.newEmail,
            password: response.newPassword,
        });

    }
    return(
        <>
            <div className="AccountSettingsPage">
                <h1>Account Settings</h1>
                <h2>Edit Account Details</h2>
                <form onSubmit={handle_submit}>
                    <label>Username</label>
                    <input 
                        type = "text" 
                        name = "username"
                        value = {username}
                        onChange = {(e) => set_username(e.target.value)}
                    />
                    <label>Email</label>
                    <input 
                        type = "email" 
                        name = "email"
                        value = {email}
                        onChange = {(e) => set_email(e.target.value)}
                    />
                    <label>Password</label>
                    <div className="password-field">
                        <input 
                            type = {password_reveal ? "text" : "password"}
                            name = "password"
                            value={password}
                            onChange = {(e) => set_password(e.target.value)}
                        />
                        
                        <button 
                            type = "button"
                            onClick = {() => set_password_reveal(!password_reveal)}
                        >
                            <FontAwesomeIcon icon = {password_reveal ? faEyeSlash : faEye}/>
                        </button>
                    </div>
                    <div className="submit-btn">
                        <button type = "submit">Save Changes</button>
                    </div>
                    <p className="prompt">{prompt}</p>
                </form>
                <button>Cancel</button>
                <button>Delete Account</button>
                <button type = "button" onClick = {handleLogOut}>
                    Click to log out
                </button>
            </div>
            
        </>
    );
}