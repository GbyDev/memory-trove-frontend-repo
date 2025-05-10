
import defaultCoverImg from '../../../assets/default-album-cover.jpg';
export default function AlbumItem({ album }) {
    return (
        <div className="album-item">
            <img 
                src={convertToWebPath(album.albumCoverImagePath)} 
                height="200px" 
                width="140px" 
                alt="Album Cover" 
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