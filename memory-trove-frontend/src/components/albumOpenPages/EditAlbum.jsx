import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { AlbumContext } from "../../contexts/AlbumContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditAlbum() {
    const [nameOfAlbum, setNameOfAlbum] = useState("");
    const [welcomeTxt, setWelcomeTxt] = useState("");
    const [description, setDescription] = useState("");
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
    const [prompt, setPrompt] = useState("");
    const navigate = useNavigate();

    const { userId } = useContext(AuthContext);
    const {albumId, albumName, welcomeText, albumDescription, albumCoverImagePath, albumFolderPath, openAlbum, closeAlbum} = useContext(AlbumContext);
    const promptElement = document.querySelector(".prompt");

    // Fetch album details from the AlbumContext when the component mounts/loads
    useEffect(() => {
        console.log("Album path: " + albumFolderPath + ", album id: " + albumId);
        if (albumId) {
            setNameOfAlbum(albumName);
            setWelcomeTxt(welcomeText);
            setDescription(albumDescription);
            setCoverPhotoPreview(convertToWebPath(albumCoverImagePath));
        }
    }, [albumId, albumName, welcomeText, albumDescription, albumCoverImagePath]);

    function convertToWebPath(localPath) { 
        // Replace local path with web path
        return localPath.replace("C:/xampp/htdocs", "http://localhost");
    }   

    function setPromptColor(msgType) {
        if (msgType === "error")
            promptElement.style.color = "red";
        else if (msgType === "success")
            promptElement.style.color = "green";
        else
            promptElement.style.color = "black";
    }

    const handleCoverPhotoChange = (e) => {
        const file = e.target.files[0];
        setCoverPhoto(file);
        if (file) {
            setCoverPhotoPreview(URL.createObjectURL(file));
        }
    };

    async function handleDeleteAlbum(){
        const confirmed = window.confirm("Are you sure you want to delete this album? This action cannot be undone.");
        if (!confirmed) return;
        
        let response = await axios.post('http://localhost/memory-trove-backend/deleteAlbum.php', {
            album_id: albumId,
            album_folder_path: albumFolderPath,
        })
        .catch(error => {
            console.error('Delete failed:', error);
        });

        alert(response.data.message);
        //Clear from album context
        closeAlbum();
        navigate('/pages/albumList');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        

        function areInputsInvalid(){
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
            if (welcomeTxt.length > 100) {
                setPromptColor("error");
                setPrompt("Welcome text cannot exceed 100 characters.");
                return true;
            }
            if (description.length > 200) {
                setPromptColor("error");
                setPrompt("Description cannot exceed 200 characters.");
                return true;
            }
            return false;
        }

        function thereAreNoChangesMade(){
            if (nameOfAlbum === albumName && welcomeTxt === welcomeText && description === albumDescription && !coverPhoto) {
                setPromptColor("error");
                setPrompt("There are no changes made.");
                return true;
            }
            return false;
        }

        async function updateAlbum() {
            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("album_id", albumId);
            formData.append("old_album_name", albumName);
            formData.append("new_album_name", nameOfAlbum);
            formData.append("welcome_text", welcomeTxt);
            formData.append("album_desc", description);
            formData.append("url", "https://www.youtube.com/watch?v=dQw4w9WgXcQ");

            // ✅ Append file ONLY if present
            if (coverPhoto) {
                formData.append("cover_photo", coverPhoto);
            }

            let response = {};
            try {
                response = await axios.post(
                    "http://localhost/memory-trove-backend/updateAlbum.php",
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
                setPrompt("There was an error updating the album.");
            }
            return response.data;
        }

        // Function calls
        if (areInputsInvalid()) return;
        if (thereAreNoChangesMade()) return;
        setPromptColor("success");
        setPrompt("Updating album...");
        let response = await updateAlbum();
        openAlbum(response.data);
    }
    return(
        <>  
            <h1>Edit Album</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label>Album Name</label>
                    <br />
                    <input
                        type="text"
                        name="album_name"
                        value={nameOfAlbum}
                        onChange={(e) => setNameOfAlbum(e.target.value)}
                    />
                    <br/>
                    <label>Welcome text</label>
                    <br />
                    <textarea
                        name="welcomeTxt"
                        value={welcomeTxt}
                        onChange={(e) => setWelcomeTxt(e.target.value)}
                        className="welcomeTxt-textarea"
                    />
                    <br />

                    <label>Description (maximum 200 characters)</label>
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
                        name="cover_photo"  // <-- Added name attribute
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

                    <button type="submit">Update</button>
                    <button>Cancel</button>
                    <p className="prompt">{prompt}</p>
            </form>
            <p>Want to delete this album?</p>
            <button onClick = {handleDeleteAlbum}>Delete</button>
        </>
    );
}
