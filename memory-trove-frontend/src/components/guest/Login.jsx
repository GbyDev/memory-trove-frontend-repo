import { AuthContext } from "../../contexts/AuthContext.jsx";
import {useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        
        setPrompt('');

        //Input Checking

        //1. Check if null/blank/empty
        if (username_email === '' || password === ''){
            setPromptColor('error');
            setPrompt("Please fill in all fields.");
            return;
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
                return;
            }
        }

        //If input is a username:
        try {
            const response = await axios.post('http://localhost/memory-trove-backend/login.php', {
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

            //FINAL STEP
            //Redirect to login page if registration is successful
            if (response.data.messageType === 'success') {
                setTimeout(() => {
                    navigate('/pages/login');
                }, 2000); // Redirect after 2 seconds
            }

        } catch (error) {
            console.error('Error sending data', error);
            setPromptColor('error');
            setPrompt("There was an error during registration.");
        }
        


        login({username_email, password});



        alert(`${username_email} is logged in.` );
        
    }

    //If the user is logged in, redirect sa All Albums Page
    useEffect(() => {
        if (isLoggedIn)
            navigate('/pages/allALbums');
    }, [isLoggedIn, navigate]);
    
    return (
        <>
            <h1>Login Page</h1>
            <form onSubmit = {handle_submit}>
                <label>Username or Email</label>
                <br/>
                <input 
                    type = "text" 
                    name = "username_email" 
                    value = {username_email} 
                    onChange = {(e) => set_username_Email(e.target.value)}
                />
                <br/>
                <label>Password</label>
                <br/>
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
                    {password_reveal ? "Hide" : "Reveal"}
                </button>
                <br/>
                <button>Login</button>
                <p className="prompt">{prompt}</p>
            </form>
        </> 
    );
}