export function ImageItem({ img, index, onClick, isSelected }) {
    if (!img || !img.image_url) {
        console.error(`⚠️ Image URL is undefined for image at index ${index}`, img);
        return null;
    }

    const handleError = () => {
        console.error(`❌ Image failed to load at index ${index}`);
    };

    // Format the uploadedAt timestamp to show only the date (YYYY-MM-DD)
    const formattedDate = new Date(img.uploadedAt).toLocaleDateString();

    return (
        <div
            className="image-item"
            onClick={onClick}
            style={{
                cursor: "pointer",
                margin: "10px",
                display: "inline-block",
                position: "relative",
                border: isSelected ? "4px solid blue" : "none", // Border for selected image
                backgroundColor: isSelected ? "#e0f0ff" : "transparent", // Set background to transparent when not selected
                width: "200px",
                height: "auto",
                maxHeight: "280px",
                overflow: "hidden",
                transition: "background-color 0.3s ease, border-color 0.3s ease", // Smooth transition
            }}
        >
            <img
                src={img.image_url}
                alt={`Image ${index}`}
                style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "100%",
                    objectFit: "cover",
                    display: "block",
                    margin: "0 auto",
                }}
                onError={handleError}
            />
            <p style={{ textAlign: "center" }}>Uploaded on: {formattedDate}</p>
        </div>
    );
}
