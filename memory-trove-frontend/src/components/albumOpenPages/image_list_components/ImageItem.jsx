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
            className="image-item"
            onClick={onClick}
            style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: isSelected ? "4px solid blue" : "none",
                backgroundColor: isSelected ? "#e0f0ff" : "transparent",
                width: "200px",
                height: "280px",
                overflow: "hidden",
                margin: "10px",
            }}
        >
            <img
                src={img.image_url}
                alt={`Image ${index}`}
                style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "230px",
                    objectFit: "cover",
                }}
                onError={handleError}
            />
            <p style={{
                textAlign: "center",
                fontSize: "0.9em",
                margin: "4px 0",
            }}>
                Uploaded on: {formattedDate}
            </p>
        </div>
    );
}
