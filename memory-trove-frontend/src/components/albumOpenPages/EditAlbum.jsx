import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { AlbumContext } from "../../contexts/AlbumContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AlbumHeader } from "../UI/Headers";
import Footer from "../UI/Footer";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
            setNameOfAlbum(albumName || "");
            setWelcomeTxt(welcomeText || "");
            setDescription(albumDescription || "");

            const convertedPath = convertToWebPath(albumCoverImagePath);
            if (convertedPath) {
                setCoverPhotoPreview(convertedPath);
            } 
            else {
                setCoverPhotoPreview(null); // Or a fallback default image URL
            }
        }
    }, [albumId, albumName, welcomeText, albumDescription, albumCoverImagePath, albumFolderPath]);

    function convertToWebPath(localPath) {
        if (!localPath || typeof localPath !== "string") return null;
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
            album_name: albumName,
            album_folder_path: albumFolderPath,
        })
        .catch(error => {
            console.error('Delete failed:', error);
        });
        console.log(response.data)
        //Clear from album context
        closeAlbum();
        navigate('/pages/albumList');
    }

    function handleDownloadAlbum() {
        const payload = {
            album_id: albumId,
            album_folder_path: albumFolderPath,
        };

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'http://localhost/memory-trove-backend/downloadAlbum.php';
        form.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'payload';
        input.value = JSON.stringify(payload);
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }


    function handleCancel(e){
        e.preventDefault();
        navigate('/pages/media');
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
            formData.append("album_folder_path", albumFolderPath);
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
        console.log(response);
        openAlbum({
            albumId: response.albumId,
            albumName: response.albumName,
            albumFolderPath: response.albumFolderPath,
            welcomeText: response.albumWelcomeText,
            albumDescription: response.albumDescription,
            albumCoverImagePath: response.albumCoverImagePath,
            dateCreated: response.dateCreated
        });
        navigate(`/pages/media`);
    }
    return(
        <>  
            <div className="EditAlbumPage">
                <AlbumHeader/>
                <div className="main-container">
                    <h1>Edit Album</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">

                        <div className="all-fields">
                            <div className="input-text-fields">
                                <div>
                                    <label>Album Name</label>
                                    <input
                                        type="text"
                                        name="album_name"
                                        value={nameOfAlbum}
                                        onChange={(e) => setNameOfAlbum(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label>Welcome text</label>
                                    <textarea
                                        name="welcomeTxt"
                                        value={welcomeTxt}
                                        onChange={(e) => setWelcomeTxt(e.target.value)}
                                        className="welcomeTxt-textarea"
                                    />
                                </div>
                                

                                <div>
                                    <label>Description (maximum 200 characters)</label>
                                    <textarea
                                        name="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="description-textarea"
                                    />
                                </div>
                            </div>

                            <div className="cover-img-section">
                                <div className="upload-img-field">
                                    <label className = "upload-label" htmlFor="cover-photo-upload">
                                        Upload Cover Image
                                        &nbsp;&nbsp;
                                        <FontAwesomeIcon className="upload-icon" icon={faUpload} />
                                    </label>
                                    <input
                                        id="cover-photo-upload"
                                        type="file"
                                        name="cover_photo"  // <-- Added name attribute
                                        accept="image/*"
                                        onChange={handleCoverPhotoChange}
                                    />
                                </div>
                                
                                <div className="preview-img-section">
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
                                </div>
                            </div>
                        </div>
                        
                        <div className="buttons-section">
                            <button type="submit" className="update-button">Update</button>
                            <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
                            <p className="prompt">{prompt}</p>
                        </div>
                    </form>
                    
                    <div className="bottom-section">
                        <p>Download all photos in this album</p>
                        <button onClick = {handleDownloadAlbum} className="download-button">Download Album</button>
                        <p className="warning">Warning, this action cannot be undone.</p>
                        <button onClick = {handleDeleteAlbum} className="delete-button">Delete</button>
                        
                    </div>
                    
                    
                </div>
                <Footer/>
            </div>
            
            
            
            
        </>
    );
}
