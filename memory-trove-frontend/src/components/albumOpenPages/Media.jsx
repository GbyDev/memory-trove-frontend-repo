import React, { useContext } from 'react';
import { AlbumContext } from '../../contexts/AlbumContext';

export default function Media() {
    const {openAlbumState, welcomeText, albumDescription, dateCreated} = useContext(AlbumContext);

    //This part catches a scenario where the user has returned to the album list page,
    //and when he uses the forward button in browser and tries to open the album again,
    //where all the recent album data have been cleared, it redirects it here.
    if (openAlbumState == false) {
        return (
            <>
                <p>No album selected</p>
            </>
        );
    }
        
    //Main page
    return (
        <div className="main-container">
            <div className="text-content">
                <h3>{welcomeText}</h3>
                <p>{albumDescription}</p>
                <p>{dateCreated}</p>
            </div>
            <div className="section">
                <div className="sidebar">
                    
                </div>
                <div className="img-list">
                    
                </div>
            </div>
        </div>
    );
}