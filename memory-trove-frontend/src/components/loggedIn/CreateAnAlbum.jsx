import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

export default function CreateAnAlbum(){
    const {userId} = useContext(AuthContext);
    const [albumName, setAlbumName] = useState("");
    const [prompt, setPrompt] = useState("");

    async function handleSubmit(e){
        e.preventDefault();

        const promptElement = document.querySelector(".prompt");

        function setPromptColor(msgType) {
            if (msgType === 'error') 
                promptElement.style.color = "red";
            else if (msgType === 'success') 
                promptElement.style.color = "green";
            else 
                promptElement.style.color = "black"; // Default color
            
        }

        //Check for invalid album name
        function albumNameIsInvalid(){
            if (!albumName.trim()) {
                setPromptColor("error");
                setPrompt("Please enter a valid album name.");
                return true;
            } 
            return false;
        }

        async function createTheAlbum(){
            let response = {}; // Initialize response variable
            try {
                    response = await axios.post('http://localhost/memory-trove-backend/createAnAlbum.php', {
                    //Data to be sent 
                    user_id: userId,
                    album_name: albumName,
                    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json', 
                    }
                });
                console.log(response.data);
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
        if (albumNameIsInvalid()) return;
        let response = await createTheAlbum();
        if (response.messageType == "error") return;

        
    } 
    return(
        <>
            <h1>Create an Album</h1>

            <form onSubmit = {handleSubmit}>
                <label>Album Name</label>
                <br/>
                <input 
                    type = "text" 
                    name = "album_name" 
                    value = {albumName}
                    onChange = {(e) => setAlbumName(e.target.value)}
                />
                <br/>
                <button type = "submit">Create</button>
                <p className = "prompt">{prompt}</p>
            </form>

        </>
    );
}