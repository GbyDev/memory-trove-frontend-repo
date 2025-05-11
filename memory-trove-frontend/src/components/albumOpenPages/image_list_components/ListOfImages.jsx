import { useContext, useEffect, useState, useRef } from "react";
import { AlbumContext } from "../../../contexts/AlbumContext";
import axios from "axios";
import { ImageItem } from "./ImageItem";

async function fetchImages(imageTotal, albumId, albumFolderPath) {
    const imageDataList = [];

    for (let i = 0; i < imageTotal; i++) {
        const formData = new FormData();
        formData.append("album_id", albumId);
        formData.append("album_folder_path", albumFolderPath);
        formData.append("current_image_num", i);

        try {
            const response = await axios.post(
                "http://localhost/memory-trove-backend/getImageDetails.php",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            console.log("Image API Response:", response.data);  // Log API response to verify
            imageDataList.push(response.data);
        } catch (error) {
            console.error(`❌ Error fetching image #${i}:`, error);
            break;
        }
    }

    return imageDataList;
}

export default function ListOfImages({ imageTotal }) {
    const { albumId, albumFolderPath } = useContext(AlbumContext);
    const [imageList, setImageList] = useState([]);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!albumId || imageTotal <= 0 || hasFetched.current) return;
        hasFetched.current = true;

        async function loadImages() {
            const images = await fetchImages(imageTotal, albumId, albumFolderPath);
            setImageList(images);
        }

        loadImages();
    }, [albumId, albumFolderPath, imageTotal]);

    console.log(imageList);
    return (
        <>
            {imageList.map((img, index) => (
                <ImageItem key={index} img={img} />
            ))}
        </>
    );
}
