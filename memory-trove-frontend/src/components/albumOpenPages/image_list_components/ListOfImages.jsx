import { useContext, useEffect, useState, useRef } from "react";
import { AlbumContext } from "../../../contexts/AlbumContext";
import axios from "axios";
import { ImageItem } from "./ImageItem";

export default function ListOfImages({ imageTotal }) {
    const { albumId, albumFolderPath, albumName } = useContext(AlbumContext);
    const [imageList, setImageList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [slideshowIndex, setSlideshowIndex] = useState(null);
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
        console.log("Delete these:", selectedImages);
        if (selectedImages.length <= 0) return;

        let confirm = window.confirm(`Are you sure you want to delete ${selectedImages.length} images? This action cannot be undone.`);
        if (!confirm) return;

        const selectedFilenames = selectedImages.map((url) => url.split('/').pop());

        const data = {
            album_id: albumId,
            album_folder_path: albumFolderPath,
            selected_images: selectedFilenames,
        };

        try {
            const response = await axios.post(
                "http://localhost/memory-trove-backend/deleteImages.php",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Backend response:", response.data);
        } catch (err) {
            console.error("Error deleting images:", err);
        }

        setImageList((prevList) => prevList.filter((img) => !selectedImages.includes(img.image_url)));
        setSelectedImages([]);
    };

    const handleDownload = async () => {
        if (selectedImages.length === 0) return;

        const selectedFilenames = selectedImages.map((url) => url.split('/').pop());

        const data = {
            album_name: albumName,
            album_folder_path: albumFolderPath,
            selected_images: selectedFilenames,
        };

        try {
            const response = await fetch("http://localhost/memory-trove-backend/downloadImages.php", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                console.error("Download failed with status:", response.status);
                return;
            }

            const blob = await response.blob();
            const contentDisposition = response.headers.get("Content-Disposition");
            let filename = albumName + ".zip";
            if (contentDisposition && contentDisposition.includes("filename=")) {
                filename = contentDisposition.split("filename=")[1].replace(/["']/g, "").trim();
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Download failed with error:", error);
        }
    };

    const handleSlideshow = () => {
        if (imageList.length === 0) return;
        setSlideshowIndex(0); // Start from first image
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

    // Keyboard navigation + auto-play
    useEffect(() => {
        if (slideshowIndex === null) return;

        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") {
                setSlideshowIndex((prev) => (prev + 1) % imageList.length);
            } else if (e.key === "ArrowLeft") {
                setSlideshowIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
            } else if (e.key === "Escape") {
                setSlideshowIndex(null);
            }
        };

        const interval = setInterval(() => {
            setSlideshowIndex((prev) => (prev + 1) % imageList.length);
        }, 3000); // change every 3s

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearInterval(interval);
        };
    }, [slideshowIndex, imageList.length]);

    return (
        <div>
            <div className="toolbar" style={{ marginBottom: "10px" }}>
                <button onClick={handleSlideshow}>Slideshow</button>
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

            {slideshowIndex !== null && (
                <div
                    onClick={() => setSlideshowIndex(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 10000,
                    }}
                >
                    {/* Previous Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSlideshowIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
                        }}
                        style={{
                            position: "absolute",
                            left: 20,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "rgba(255, 255, 255, 0.2)",
                            border: "none",
                            color: "white",
                            fontSize: "2rem",
                            padding: "10px 15px",
                            cursor: "pointer",
                            zIndex: 10001,
                        }}
                    >
                        ‹
                    </button>

                    <img
                        src={imageList[slideshowIndex].image_url}
                        alt={`Slideshow ${slideshowIndex + 1}`}
                        style={{
                            maxWidth: "90%",
                            maxHeight: "90%",
                            border: "2px solid white",
                            transition: "opacity 0.3s ease-in-out",
                            cursor: "pointer",
                        }}
                    />

                    {/* Next Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSlideshowIndex((prev) => (prev + 1) % imageList.length);
                        }}
                        style={{
                            position: "absolute",
                            right: 20,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "rgba(255, 255, 255, 0.2)",
                            border: "none",
                            color: "white",
                            fontSize: "2rem",
                            padding: "10px 15px",
                            cursor: "pointer",
                            zIndex: 10001,
                        }}
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
}
