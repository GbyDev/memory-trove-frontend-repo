import React, { useEffect, useContext } from 'react';
import { AlbumContext } from '../../../contexts/AlbumContext';

export default function AlbumOpened() {
    const {closeAlbum} = useContext(AlbumContext);

    //If user leaves album opened page, remove album details from storage yessiree
    useEffect(() => {
    if (location.pathname === '/pages/albumList') {
        closeAlbum();
    }
    }, [location.pathname]);

    return (
        <>
            <h1>Album Opened</h1>
        </>
    );
}