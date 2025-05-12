import React from "react";

export function ImageItem({ img, index, onClick }) {
    if (!img || !img.image_url) {
        console.error(`⚠️ Image URL is undefined for image at index ${index}`, img);
        return null;
    }

    const handleError = () => {
        console.error(`❌ Image failed to load at index ${index}`);
    };

    return (
        <div
            className="image-item"
            onClick={onClick}
            style={{ cursor: "pointer", margin: "10px", display: "inline-block" }}
        >
            <img
                src={img.image_url}
                alt={`Image ${index}`}
                height="200px"
                width="140px"
                style={{
                    objectFit: "contain",
                    backgroundColor: "lightgray",
                    display: "block",
                }}
                onError={handleError}
            />
            <p style={{ textAlign: "center" }}>Uploaded at: {img.uploadedAt}</p>
        </div>
    );
}
