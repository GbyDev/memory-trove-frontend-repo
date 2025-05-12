import { useContext, useEffect, useState, useRef } from "react";
import { AlbumContext } from "../../../contexts/AlbumContext";
import axios from "axios";
import { ImageItem } from "./ImageItem";

export default function ListOfImages({ imageTotal }) {
    const { albumId, albumFolderPath } = useContext(AlbumContext);
    const [imageList, setImageList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
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

    const handleImageClick = (img) => setSelectedImage(img.image_url);

    return (
        <>
            {imageList.length > 0 ? (
                imageList.map((img, i) => (
                    <ImageItem key={i} img={img} index={i} onClick={() => handleImageClick(img)} />
                ))
            ) : (
                <p>No images to display.</p>
            )}

            {selectedImage && (
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
        </>
    );
}
