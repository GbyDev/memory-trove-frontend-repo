import React, { useContext, useEffect, useState } from 'react';
import { AlbumContext } from '../../contexts/AlbumContext';
import ListOfImages from './image_list_components/ListOfImages';
import axios from 'axios';

export default function Media() {
    const {
        openAlbumState,
        welcomeText,
        albumDescription,
        dateCreated,
        albumId,
        albumName,
    } = useContext(AlbumContext);

    const [imageCount, setImageCount] = useState(0);

    useEffect(() => {
        async function fetchImageCount() {
            const formData = new FormData();
            formData.append("album_id", albumId);

            try {
                const response = await axios.post(
                    "http://localhost/memory-trove-backend/countNumberOfImages.php",
                    formData
                );
                setImageCount(response.data.imageCount || 0);
            } catch (error) {
                console.error("Failed to fetch image count:", error);
            }
        }

        if (albumId) {
            fetchImageCount();
        }
    }, [albumId, welcomeText, albumDescription, albumName]);

    if (openAlbumState === false) {
        return <p>No album selected</p>;
    }

    return (
        <div className="main-container">
            <div className="text-content">
                <h3>{welcomeText}</h3>
                <p>{albumDescription}</p>
                <p>{dateCreated}</p>
            </div>
            <div className="section">
                <div className="floating-toolbar">
                    <p>bla bla</p>
                </div>
                <div className="img-list">
                    <ListOfImages imageTotal={imageCount} />
                </div>
            </div>
        </div>
    );
}
