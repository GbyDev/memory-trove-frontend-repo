import { AuthContext } from "../../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import AlbumItem from "../../UI/AlbumItem";
import axios from "axios";

async function GetAlbumFromBackend(albumTotal, userId) {
    const albumDataList = [];

    for (let i = 0; i < albumTotal; i++) {
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
            console.log(response.data);
            //alert(response.data.message);
            albumDataList.push(response.data);
        } 
        catch (error) {
            console.error("Error sending data", error);
            alert("There was an error getting the album details.");
            break;
        }
    }

    return albumDataList;
}

export function ListOfAlbums({ albumTotal }) {
    const { userId } = useContext(AuthContext);
    const [albumList, setAlbumList] = useState([]);

    useEffect(() => {
        async function handleAlbumLoad() {
            const albums = await GetAlbumFromBackend(albumTotal, userId);
            setAlbumList(albums);
        }

        if (albumTotal > 0) {
            handleAlbumLoad();
        }
    }, [albumTotal, userId]);

    return (
        <div>
            {albumList.map((album, index) => (
                <AlbumItem key={index} album={album} />
            ))}
        </div>
    );
}

export default function AllAvailableAlbums({ albumCount }) {
    const { username } = useContext(AuthContext);

    return (
        <>  
        <div className="AllAvailableAlbumsPage">
            <h1>{username}&apos;s Album Collection</h1>
            <p>You have {albumCount} albums.</p>
            <ListOfAlbums className="AlbumItemContainer" albumTotal={albumCount} />
        </div>
            
        </>
    );
}