import { AuthContext } from "../../../contexts/AuthContext";
import { useContext, useEffect } from "react";
import AlbumItem from "../../UI/AlbumItem";

export default function AllAvailableAlbums({ albumCount }) {
    const { username} = useContext(AuthContext);
    console.log("albumCount:", albumCount);

    function handle_album_loading() {

    }

    useEffect(() => {
        handle_album_loading();
    }, []);
    return (
        <>
            <h1>{username}&apos;s Album Colletion</h1>
            <p>You have {albumCount} albums.</p>
            <div className="album-list-container">
                <AlbumItem/>
                <AlbumItem/>
                <AlbumItem/>
            </div>
            
        </>
    );
}