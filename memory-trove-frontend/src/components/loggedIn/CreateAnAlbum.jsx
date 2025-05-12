import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateAnAlbum() {
    const { userId } = useContext(AuthContext);
    const [albumName, setAlbumName] = useState("");
    const [prompt, setPrompt] = useState("");
    const [description, setDescription] = useState("");
    const [welcomeTxt, setWelcomeTxt] = useState("");
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState("");

    const navigate = useNavigate();


    function handleCancel(e) {
        e.preventDefault();
        navigate("/pages/albumList");
    }
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

        function welcomeTextExceeds100Chars() {
            if (welcomeTxt.length > 100) {
                setPromptColor("error");
                setPrompt("Welcome text cannot exceed 100 characters.");
                return true;
            }
            return false;
        }

        function descriptionExceeds200Chars() {
            if (description.length > 200) {
                setPromptColor("error");
                setPrompt("Description cannot exceed 200 characters.");
                return true;
            }
            return false;
        }

        async function createTheAlbum() {
            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("album_name", albumName);
            formData.append("welcome_text", welcomeTxt);
            formData.append("album_desc", description);
            formData.append("url", "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
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
            } 
            catch (error) {
                console.error("Error sending data", error);
                setPromptColor("error");
                setPrompt("There was an error creating the album.");
            }
            return response.data;
        }

        if (albumNameIsInvalid()) return;
        if (welcomeTextExceeds100Chars()) return;
        if (descriptionExceeds200Chars()) return;

        let response = await createTheAlbum();
        if (response.messageType === "error") return;
    }

    const handleCoverPhotoChange = (e) => {
        const file = e.target.files[0];
        setCoverPhoto(file);
        if (file) {
            setCoverPhotoPreview(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <div className="CreateAnAlbumPage">
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
                    <p>The following options below are optional. You may fill them in later.</p>
                    <br />

                    <label>Welcome text</label>
                    <br />
                    <textarea
                        name="welcomeTxt"
                        value={welcomeTxt}
                        onChange={(e) => setWelcomeTxt(e.target.value)}
                        className="welcomeTxt-textarea"
                    />
                    <br />

                    <label>Description (maximum 110 characters)</label>
                    <br />
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="description-textarea"
                    />
                    <br />
                    
                    <label>Cover Photo </label>
                    <br />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverPhotoChange}
                    />
                    <br />

                    {coverPhotoPreview && (
                        <div className="preview-container">
                            <h3>Cover Photo Preview:</h3>
                            <img
                                src={coverPhotoPreview}
                                alt="Cover Preview"
                                style={{ width: "200px", height: "auto", objectFit: "cover" }}
                            />
                        </div>
                    )}

                    <button type="submit">Create</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                    <p className="prompt">{prompt}</p>
                </form>
            </div>
        </>
    );
}
