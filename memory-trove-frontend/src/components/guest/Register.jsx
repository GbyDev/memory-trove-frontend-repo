import {useState} from "react";
import axios from "axios";

export default function Register(){
    const [username, set_username] = useState('');
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');
    const [password_reveal, set_password_reveal] = useState(false);
    const [prompt, set_prompt] = useState('');

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

        //Clear prompt
        set_prompt('')

        //If username has an @ symbol
        if (username.includes('@')){
            setPromptColor('error');
            set_prompt("Username cannot contain an '@' symbol.");
            return;
        }

        //If empty
        if (username === '' || email === '' || password === ''){ 
            setPromptColor('error');
            set_prompt("Please fill in all fields.");
            return;
        }   

        //If username is less than 3 characters
        if (username.length < 3){
            setPromptColor('error');
            set_prompt("Username must be at least 3 characters long.");
            return;
        }

        //If password is less than 8 characters
        if (password.length < 8){
            setPromptColor('error');
            set_prompt("Password must be at least 8 characters long.");
            return;
        }

        

        //If input passes through the following checks, 
        // send data to the backend to check if the username and email already exist in the database
        try {
            const response = await axios.post('http://localhost/memory-trove-backend/register.php', {
                username: username,
                email: email,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json', 
                }
            });
            console.log('Data sent!');
            setPromptColor(response.data.messageType);
            set_prompt(response.data.message); //Display connection message from the backend (IMPORTANT NI)
        } catch (error) {
            console.error('Error sending data', error);
            setPromptColor('error');
            set_prompt("There was an error during registration.");
        }
    }

    return (
        <>
            <h1>Register Page</h1>
            <form onSubmit={handle_submit}>
                <label>Username</label>
                <br/>
                <input 
                    type = "text" 
                    name = "username"
                    value = {username}
                    onChange = {(e) => set_username(e.target.value)}
                />
                <br/>
                <label>Email</label>
                <br/>
                <input 
                    type = "email" 
                    name = "email"
                    value = {email}
                    onChange = {(e) => set_email(e.target.value)}
                />
                <br/>
                <label>Password</label>
                <br/>
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
                    {password_reveal ? "Hide" : "Reveal"}
                </button>
                <br/>
                <button type = "submit">Register</button>
                <p className="prompt">{prompt}</p>
            </form>
        </>

    );
}