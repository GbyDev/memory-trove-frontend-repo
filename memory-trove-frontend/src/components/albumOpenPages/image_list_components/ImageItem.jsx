export function ImageItem({ img, index }) {
    console.log(img);
    if (!img || !img.image_url) {
        console.error(`Image URL is undefined for image at index ${index}`);
        return null; // Don't render anything if image_url is not provided
    }

    return (
        <div key={index} className="image-item">
            <img 
                src={convertToWebPath(img.image_url)} 
                alt={`Image ${index}`}  
                height="200px" 
                width="140px" 
                style={{ objectFit: "contain" }}
            />
            <p>{img.caption || img.uploadedAt}</p>
        </div>
    );
}

function convertToWebPath(localPath) {
    if (!localPath) return ''; // Ensure we return an empty string if no path is provided
    return localPath.replace("C:/xampp/htdocs", "http://localhost");
}