import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { GuestHeader } from "../UI/Headers";


export default function Register(){
    const [username, set_username] = useState('');
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');
    const [password_reveal, set_password_reveal] = useState(false);
    const [prompt, setPrompt] = useState('');
    const navigate = useNavigate();

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

        //You'll probably see this code pattern regularly, 
        // i've been using this basically as boilerplate code for my backend communication events.
        async function submitToBackend(){
            let response = {}; // Initialize response variable
            try {
                    response = await axios.post('http://localhost/memory-trove-backend/register.php', {
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

        function evaluateResponse(response) {
            //If the response is all valid, set the prompt to success
            if (response.messageType == 'success') {
                setTimeout(() => {
                    navigate('/pages/login');
                }, 2000); // Redirect to login 2 seconds
            }
        }
        
        // Function Execution Order
        setPrompt('') //clear previous prompt
        if (areInputsInvalid()) return; //Check if input is valid
        let backEndResponse = await submitToBackend(); //Submit to backend if input is valid
        evaluateResponse(backEndResponse); //if all inputs are valid, redirect to login page
        
    }

    return (
        <>
            <div className="RegisterPage">
                <GuestHeader/>
                <div className="main-container">
                    
                    <form onSubmit={handle_submit}>

                        <h1>Register Page</h1>

                        <div className="username-field">
                            <label>Username</label>
                            <input 
                                type = "text" 
                                name = "username"
                                value = {username}
                                onChange = {(e) => set_username(e.target.value)}
                            />
                        </div>
                        
                        <div className="email-field">
                            <label>Email</label>
                            <input 
                                type = "email" 
                                name = "email"
                                value = {email}
                                onChange = {(e) => set_email(e.target.value)}
                            />
                        </div>
                        
                        <div className="password-field">
                            <label>Password</label>

                            <div className="password-txt-fld">
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
                        </div>

                        <button type = "submit" className="create-account-btn">
                            <span>Create Account</span>
                        </button>

                        <p className="login-redirect">Already have an account? <a href="/pages/login">Login here</a></p>
                        <p className="prompt">{prompt}</p>
                    </form>
                </div>
            </div>
        </>

    );
}