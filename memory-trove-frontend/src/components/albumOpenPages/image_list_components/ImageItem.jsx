export function ImageItem({ img, index, onClick, isSelected }) {
    if (!img || !img.image_url) {
        console.error(`⚠️ Image URL is undefined for image at index ${index}`, img);
        return null;
    }

    const handleError = () => {
        console.error(`❌ Image failed to load at index ${index}`);
    };

    const formattedDate = new Date(img.uploadedAt).toLocaleDateString();

    return (
        <div
            className={`image-item${isSelected ? " selected" : ""}`}
            onClick={onClick}
        >
            <div className="image-wrapper">
                <img
                    src={img.image_url}
                    alt={`Image ${index}`}
                    onError={handleError}
                />
            </div>
            <p>{formattedDate}</p>
        </div>
    );
}
