import { useContext, useEffect, useState, useRef } from "react";
import { AlbumContext } from "../../../contexts/AlbumContext";
import axios from "axios";
import { ImageItem } from "./ImageItem";

export default function ListOfImages({ imageTotal }) {
    const { albumId, albumFolderPath } = useContext(AlbumContext);
    const [imageList, setImageList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!albumId || imageTotal <= 0 || hasFetched.current) return;
        hasFetched.current = true;

        async function fetchImages() {
            const list = [];
            for (let i = 0; i < imageTotal; i++) {
                const formData = new FormData();
                formData.append("album_id", albumId);
                formData.append("album_folder_path", albumFolderPath);
                formData.append("current_image_num", i);
                try {
                    const res = await axios.post(
                        "http://localhost/memory-trove-backend/getImageDetails.php",
                        formData
                    );
                    list.push(res.data);
                } catch (err) {
                    console.error("Failed to load image", err);
                    break;
                }
            }
            setImageList(list);
        }

        fetchImages();
    }, [albumId, albumFolderPath, imageTotal]);

    const handleImageClick = (img) => {
        if (selectMode) {
            setSelectedImages((prev) =>
                prev.includes(img.image_url)
                    ? prev.filter((url) => url !== img.image_url)
                    : [...prev, img.image_url]
            );
        } else {
            setSelectedImage(img.image_url);
        }
    };

    const handleSelectAll = () => {
        const allUrls = imageList.map((img) => img.image_url);
        setSelectedImages(allUrls);
    };

    const handleDelete = async () => {
        console.log("Delete these:", selectedImages); // Log selected images to make sure they are correct

        let numOfSelectedImages = selectedImages.length;

        if (numOfSelectedImages <= 0) return;

        let confirm = window.confirm(`Are you sure you want to delete ${numOfSelectedImages} images? This action cannot be undone.`);
        if (!confirm) return;

        // Extract the filenames from the image URLs
        const selectedFilenames = selectedImages.map((url) => {
            const parts = url.split('/');
            return parts[parts.length - 1]; // Extract filename from the URL
        });
        console.log("Selected image filenames:", selectedFilenames); // Log filenames

        const data = {
            album_id: albumId,
            album_folder_path: albumFolderPath,
            selected_images: selectedFilenames, 
        };

        try {
            const response = await axios.post(
                "http://localhost/memory-trove-backend/deleteImages.php",
                data, // Send JSON data instead of FormData
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Backend response:", response.data);
        } 
        catch (err) {
            console.error("Error deleting images:", err);
        }

        setImageList((prevList) => prevList.filter((img) => !selectedImages.includes(img.image_url)));
        setSelectedImages([]);
    };
    
    const handleDownload = async () => {

        // Extract the filenames from the image URLs
        const selectedFilenames = selectedImages.map((url) => {
            const parts = url.split('/');
            return parts[parts.length - 1]; // Extract filename from the URL
        });
        console.log("Selected image filenames:", selectedFilenames);
      
        const data = {
            album_folder_path: albumFolderPath,
            selected_images: selectedFilenames, 
        };

        try {
            const response = await axios.post(
                "http://localhost/memory-trove-backend/deleteImages.php",
                data, // Send JSON data instead of FormData
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Backend response:", response.data);
        } 
        catch (err) {
            console.error("Error deleting images:", err);
        }
    };

    const handleExitSelectMode = () => {
        setSelectMode(false);
        setSelectedImages([]);
    };

    const handleSelectModeToggle = () => {
        if (selectMode) {
            handleExitSelectMode();
        } else {
            setSelectMode(true);
        }
    };

    return (
        <div>
            <div className="toolbar" style={{ marginBottom: "10px" }}>
                <button onClick={handleSelectModeToggle}>
                    {selectMode ? "Cancel" : "Select"}
                </button>
                {selectMode && (
                    <>
                        <button onClick={handleSelectAll}>Select All</button>
                        <button onClick={handleDelete}>Delete</button>
                        <button onClick={handleDownload}>Download</button>
                        <p>{selectedImages.length} selected</p>
                    </>
                )}
            </div>

            {imageList.length > 0 ? (
                imageList.map((img, i) => (
                    <ImageItem
                        key={i}
                        img={img}
                        index={i}
                        onClick={() => handleImageClick(img)}
                        isSelected={selectedImages.includes(img.image_url)}
                    />
                ))
            ) : (
                <p>No images to display.</p>
            )}

            {!selectMode && selectedImage && (
                <div
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        cursor: "zoom-out",
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Preview"
                        style={{
                            maxWidth: "90%",
                            maxHeight: "90%",
                            border: "2px solid white",
                        }}
                    />
                </div>
            )}
        </div>
    );
}
