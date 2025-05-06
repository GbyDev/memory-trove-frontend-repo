import { AuthContext } from "../../contexts/AuthContext.jsx";
import {useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const {login, isLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();
    const [username_email, set_username_Email] = useState('');
    const [password, set_password] = useState('');
    const [password_reveal, set_password_reveal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    function handle_submit(e){
        let prompt = document.querySelector('.error-prompt');
        prompt.style.color = 'red';
        e.preventDefault();
        
        setErrorMessage('');


        //Input Checking
        //Check if null/blank/empty
        if (username_email === '' || password === ''){
            setErrorMessage("Please fill in all fields.");
            return;
        }

        //Check if inputted value is a username or an email, and check if exists in the db
        if (username_email.includes('@')){
            let email = username_email;
        } 
        else {
            let username = username_email;
        }



        login({username_email, password});
        console.log("Logged in.");
        console.log(`Username/Email is ${username_email}`);
        console.log(`Password is ${password}`);


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
                <p className="error-prompt">{errorMessage}</p>
            </form>
        </> 
    );
}