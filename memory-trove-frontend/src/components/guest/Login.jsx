import { AuthContext } from "../../contexts/AuthContext.jsx";
import {useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login(){
    const {login, isLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();
    const [username_email, set_username_Email] = useState('');
    const [password, set_password] = useState('');
    const [password_reveal, set_password_reveal] = useState(false);
    const [prompt, setPrompt] = useState('');

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
            //1. Check if null/blank/empty
            if (username_email === '' || password === ''){
                setPromptColor('error');
                setPrompt("Please fill in all fields.");
                return true;
            }

            //Check if username_email is an email or a username
            //If input is an email
            if (username_email.includes('@')){
                //Check if email is valid
                const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                //If email is not valid, set prompt and return
                if (!email_regex.test(username_email)){
                    setPromptColor('error');
                    setPrompt("Please enter a valid email address.");
                    return true;
                }
            }
            return false;
        }
        
        async function submitToBackend(){
            let response = {}; 
            try {
                    response = await axios.post('http://localhost/memory-trove-backend/login.php', {
                    username_email: username_email,
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
            return response.data; 
        }

        function responseReturnsErrors(response) {
            //If the response is all valid, set the prompt to success
            if (response.messageType == 'success') {
                setPromptColor('success');
                setPrompt("User has been logged in successfully. Redirecting to Dashboard...");
                return false;
            }
            if (response.messageType == 'error'){
                setPromptColor('error');
                setPrompt("Invalid username/email or password. Please try again.");
                return true;
            }
            return false; // Default case
        }

        
        //Function process order
        setPrompt(''); //clear previous prompt

        if (areInputsInvalid()) return; //Check if input is valid

        let response = await submitToBackend(); //Submit to backend

        //Store all extracted data in the AuthContext for access everywhere 
        let extractedUsername = response.username; 
        let extractedUserId = response.userId;
        let extractedPassword = response.password; //Get the password from the response 

        //If response returns errors, return and cannot redirect/store data to AuthContext
        if (responseReturnsErrors(response)) return; //If there is an error, return

        //Store to AuthContext and localStorage
        login({
            username: extractedUsername, 
            userId: extractedUserId, 
            contextPassword: extractedPassword
        });

    }

    //If the user is logged in, redirect sa All Albums Page (Automatic)
    useEffect(() => {
        if (isLoggedIn){
            alert("User is logged in. Redirecting to Dashboard...");
            navigate('/pages/accountSettings'); 
        }
            
    }, [isLoggedIn, navigate]);
    
    return (
        <>
            <div className="LoginPage">
                <h1>Login Page</h1>
                <form onSubmit = {handle_submit}>
                    <label>Username or Email</label>
                    <input 
                        type = "text" 
                        name = "username_email" 
                        value = {username_email} 
                        onChange = {(e) => set_username_Email(e.target.value)}
                    />
                    <label>Password</label>
                    <div className="password-field">
                        <input 
                            type = {password_reveal ? "text" : "password"}
                            name = "password"
                            value = {password}
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
                        <button>Login</button>
                    </div>
                    <p className="prompt">{prompt}</p>
                </form>
            </div>
            
        </> 
    );
}