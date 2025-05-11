import React from "react";

export function ImageItem({ img, index }) {
    console.log("🧩 ImageItem received props:", { img, index });

    // Check if the image object or image_url is undefined
    if (!img || !img.image_url) {
        console.error(`⚠️ Image URL is undefined for image at index ${index}`, img);
        return null; // Don't render anything if image_url is missing
    }

    // Handle image load errors
    const handleError = () => {
        console.error(`❌ Image failed to load at index ${index}`);
    };

    return (
        <div className="image-item">
            <img
                src={img.image_url} // Use the image_url directly
                alt={`Image ${index}`}
                height="200px"
                width="140px"
                style={{ objectFit: "contain",  backgroundColor:"lightgray" }}
                onError={handleError} // If the image fails to load, log an error
            />
            <p>Uploaded at: {img.uploadedAt}</p>
        </div>
    );
}
