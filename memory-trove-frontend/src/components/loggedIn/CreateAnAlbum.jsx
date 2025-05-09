import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

export default function CreateAnAlbum() {
    const { userId } = useContext(AuthContext);
    const [albumName, setAlbumName] = useState("");
    const [prompt, setPrompt] = useState("");
    const [description, setDescription] = useState("");
    const [coverPhoto, setCoverPhoto] = useState(null); // New state for image

    async function handleSubmit(e) {
        e.preventDefault();
        const promptElement = document.querySelector(".prompt");

        function setPromptColor(msgType) {
            if (msgType === "error")
                promptElement.style.color = "red";
            else if (msgType === "success")
                promptElement.style.color = "green";
            else
                promptElement.style.color = "black";
        }

        function albumNameIsInvalid() {
            if (!albumName.trim()) {
                setPromptColor("error");
                setPrompt("Please enter a valid album name.");
                return true;
            }
            if (albumName.length > 30) {
                setPromptColor("error");
                setPrompt("Album name cannot exceed 30 characters.");
                return true;
            }
            return false;
        }

        function descriptionExceeds110Chars() {
            if (description.length > 110) {
                setPromptColor("error");
                setPrompt("Description cannot exceed 110 characters.");
                return true;
            }
            return false;
        }

        async function createTheAlbum() {
            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("album_name", albumName);
            formData.append("album_desc", description);
            formData.append("url", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"); // Optional, or remove
            if (coverPhoto) {
                formData.append("cover_photo", coverPhoto);
            }

            let response = {};
            try {
                response = await axios.post(
                    "http://localhost/memory-trove-backend/createAnAlbum.php",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
                console.log(response.data);
                setPromptColor(response.data.messageType);
                setPrompt(response.data.message);
            } catch (error) {
                console.error("Error sending data", error);
                setPromptColor("error");
                setPrompt("There was an error creating the album.");
            }
            return response.data;
        }

        if (albumNameIsInvalid()) return;
        if (descriptionExceeds110Chars()) return;

        let response = await createTheAlbum();
        if (response.messageType === "error") return;
    }

    return (
        <>
            <div className="container">
                <h1>Create an Album</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label>Album Name</label>
                    <br />
                    <input
                        type="text"
                        name="album_name"
                        value={albumName}
                        onChange={(e) => setAlbumName(e.target.value)}
                    />
                    <br />
                    <label>Description</label>
                    <br />
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="description-textarea"
                    />
                    <br />
                    <label>Cover Photo</label>
                    <br />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverPhoto(e.target.files[0])}
                    />
                    <br />
                    <button type="submit">Create</button>
                    <p className="prompt">{prompt}</p>
                </form>
            </div>
        </>
    );
}
