import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { LoggedInHeader } from "../UI/Headers";
import Footer from "../UI/Footer";

export default function AccountSettings(){
    const [input_username, set_input_username] = useState("");
    const [input_email, set_input_email] = useState("");
    const [input_password, set_input_password] = useState("");
    const [password_reveal, set_password_reveal] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [promptType, setPromptType] = useState("");
    const {userId, logout, storeUserData, isLoggedIn, username, password, loading} = useContext(AuthContext);
    const navigate = useNavigate();
    
     

    function handleLogOut(){
        //alert(`${username} is logged out.`);
        logout();
    }

    async function handleDeleteAccount(){
        const confirmed = window.confirm("All your albums and pictures will be deleted. This action cannot be undone. Are you sure?");
        if (!confirmed) return;
        
        let response = await axios.post('http://localhost/memory-trove-backend/deleteAccount.php', {
            user_id: userId,
        })
        .catch(error => {
            console.error('Delete failed:', error);
        });
        console.log(response.data)
        //Clear from authContext
        logout();
        navigate('/pages/welcome');
    }

    function handleCancel(e){
        e.preventDefault();
        navigate('/pages/albumList');
    }

    //Literally just returns email, since i'm too lazy to change my code and have it be posted on AuthContext
    async function getEmail(){

        async function getEmailFromBackend(){
            let response = {}; // Initialize response variable
            try {
                    response = await axios.post('http://localhost/memory-trove-backend/getEmail.php', {
                    user_id: userId,
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json', 
                    }
                });
                console.log('Data sent!');
                console.log(response.data);
                setPromptType(response.data.messageType);
                setPrompt(response.data.message); //Display connection message from the backend (IMPORTANT NI)
    
            } 
            catch (error) {
                console.error('Error sending data', error);
                setPromptType('error');
                setPrompt("There was an error during registration.");
            }
            return response.data; // Return the response
        }
        let response = await getEmailFromBackend();
        
        return response.newEmail;
    }

    useEffect(() => {
        async function initializeFields() {
        if (loading) return;
        if (userId) {
            const fetchedEmail = await getEmail();
            set_input_username(username); 
            set_input_email(fetchedEmail);
            set_input_password(password); 
        }
        if (!isLoggedIn) {
            navigate('/pages/welcome');
        }
    }

    initializeFields();
    }, [username, input_email, password, isLoggedIn]);


    async function handle_submit(e){
        e.preventDefault();

        function areInputsInvalid(){
            if (input_username.includes('@')){
                setPromptType('error');
                setPrompt("Username cannot contain an '@' symbol.");
                return true;
            }

            if (input_username === '' || input_email === '' || input_password === ''){ 
                setPromptType('error');
                setPrompt("Please fill in all fields.");
                return true;
            }   

            if (input_username.length < 3){
                setPromptType('error');
                setPrompt("Username must be at least 3 characters long.");
                return true;
            }

            if (input_username.length > 30){
                setPromptType('error');
                setPrompt("Username cannot exceed 30 characters.");
                return true;
            }

            if (input_password.length < 8){
                setPromptType('error');
                setPrompt("Password must be at least 8 characters long.");
                return true;
            }
            return false;
        }

        async function sendToBackend(){
            let response = {};
            try {
                response = await axios.post('http://localhost/memory-trove-backend/updateAccount.php', {
                    user_id: userId,
                    username: input_username,
                    email: input_email,
                    password: input_password,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log('Data sent!');
                console.log(response.data);
                setPromptType(response.data.messageType);
                setPrompt(response.data.message);
            } 
            catch (error) {
                console.error('Error sending data', error);
                setPromptType('error');
                setPrompt("There was an error during registration.");
            }
            return response.data;
        }

        // Main logic
        if (areInputsInvalid()) return;
        let response = await sendToBackend();

        storeUserData({
            userId: userId, // Make sure we keep this!
            username: response.newUsername,
            contextPassword: response.newPassword, // IMPORTANT: use `contextPassword` not `password`
        });
    }
    return(
        <>
            <div className="AccountSettingsPage">
                <LoggedInHeader/>

                <div className="main-container">

                    <h1>Account Settings</h1>

                    <div className="all-fields">
                        <form onSubmit={handle_submit}>

                            <div className="edit-account-text-container">
                                <h2>Edit Account Details</h2>
                            </div>
                            

                            <div className="username-field">
                                <label>Username</label>
                                <input 
                                    type = "text" 
                                    name = "username"
                                    value = {input_username || ""}
                                    onChange = {(e) => set_input_username(e.target.value)}
                                />
                            </div>
                            
                            <div className="email-field">
                                <label>Email</label>
                                <input 
                                    type = "email" 
                                    name = "email"
                                    value = {input_email || ""}
                                    onChange = {(e) => set_input_email(e.target.value)}
                                />
                            </div>

                            <div className="password-field">

                                <label>Password</label>

                                <div className="password-input-fld">
                                    <input 
                                        type = {password_reveal ? "text" : "password"}
                                        name = "password"
                                        value={input_password || ""}
                                        onChange = {(e) => set_input_password(e.target.value)}
                                    />
                                    <button 
                                        type = "button"
                                        onClick = {() => set_password_reveal(!password_reveal)}
                                    >
                                        <FontAwesomeIcon icon = {password_reveal ? faEyeSlash : faEye}/>
                                    </button>
                                </div>

                            </div>
                            
                                <button type = "submit">Save Changes</button>
                                <button type = "button" onClick = {handleCancel}>Cancel</button>
                        </form>

                        <div className="other-options">

                            <div className="log-out-section">
                                <p>Want to log out?</p>
                                <button type = "button" onClick = {handleLogOut}>Log out</button>
                            </div>
                            

                            <div className="delete-section">
                                <h3>!DANGER ZONE!</h3>
                                <button type = "button" onClick = {handleDeleteAccount}>Delete Account</button>
                            </div>
                        
                        </div>
                    </div>
                    
                    
                </div>
                
                
                
                
                
                <p 
                    className="prompt"
                    style={{
                        color: 
                        promptType === 'error' 
                        ? 'red' 
                        : promptType === 'success' 
                            ? 'green' 
                            : 'black'
                    }}
                >
                    {prompt}
                </p>

                <Footer/>
            </div>
            
        </>
    );
}