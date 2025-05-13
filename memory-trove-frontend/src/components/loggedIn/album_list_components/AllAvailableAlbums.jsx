import { AuthContext } from "../../../contexts/AuthContext";
import { useContext, useEffect, useState, useRef } from "react";
import AlbumItem from "./AlbumItem";
import axios from "axios";

async function fetchAlbums(albumTotal, userId) {
    const albumDataList = [];

    for (let i = 0; i < albumTotal; i++) {
        console.log(`Fetching album #${i}`);

        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("current_album_num", i);

        try {
            const response = await axios.post(
                "http://localhost/memory-trove-backend/getAlbumDetails.php",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(`✅ Response for album #${i}:`, response.data);
            albumDataList.push(response.data);
        } catch (error) {
            console.error(`❌ Error fetching album #${i}:`, error);
            break;
        }
    }

    return albumDataList;
}

function ListOfAlbums({ albumTotal }) {
    const { userId } = useContext(AuthContext);
    const [albumList, setAlbumList] = useState([]);
    const hasFetched = useRef(false); // Prevent duplicate fetching

    useEffect(() => {
        if (!userId || albumTotal <= 0 || hasFetched.current) return;
        hasFetched.current = true; // Ensure only one fetch

        async function loadAlbums() {
            const albums = await fetchAlbums(albumTotal, userId);
            setAlbumList(albums);
        }

        loadAlbums();
    }, [albumTotal, userId]);

    return (
        <div className="album-item-container">
            {albumList.map((album, index) => (
                <AlbumItem key={index} album={album} />
            ))}
        </div>
    );
}

export default function AllAvailableAlbums({ albumCount }) {
    const { username } = useContext(AuthContext);
    console.log("albumCount passed to AllAvailableAlbums:", albumCount);

    return (
        <>
            <LoggedInHeader/>
            <div className="album-list-header">
                <h1>{username}&apos;s Album Collection</h1>
                <p>You have {albumCount} albums.</p>
            </div>
            <ListOfAlbums albumTotal={albumCount} />
        </>
    );
}