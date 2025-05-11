
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import defaultCoverImg from '../../../assets/default-album-cover.jpg';
import { AlbumContext } from '../../../contexts/AlbumContext';



export default function AlbumItem({ album }) {
    const navigate = useNavigate();
    const {openAlbum} = useContext(AlbumContext);
    function handleClick(){
        console.log(album);
        openAlbum(album);
        navigate(`/pages/media`);
    }

    return (
        <div className="album-item" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <img 
                src={convertToWebPath(album.albumCoverImagePath)} 
                height="200px" 
                width="140px" 
                alt="Album Cover" 
                style={{ objectFit: "contain" }}
            />
            <h4>{album.albumName}</h4>
            <p>Date Created: {album.dateCreated}</p>
            <p>Description: {album.albumDescription || "No description"}</p>
        </div>
        
    );
}

// Utility to fix local file paths if needed
function convertToWebPath(localPath) {
    if (!localPath || localPath === 'empty') return defaultCoverImg; 
    
    //Replace local path with web path
    return localPath.replace("C:/xampp/htdocs", "http://localhost");
}