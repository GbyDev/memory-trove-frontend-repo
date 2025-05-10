import { createContext, useState} from "react";

export const AlbumContext = createContext();

export function AlbumDataProvider({ children }) {
    const [albumName, setAlbumName] = useState("");
    const [albumFilePath, setAlbumFilePath] = useState("");
    const [dateCreated, setDateCreated] = useState("");
    const [albumDescription, setAlbumDescription] = useState("");
    const [openAlbumState , setOpenAlbumState] = useState(false);


    function openAlbum(albumData) {
        setAlbumName(albumData.albumName);
        setAlbumFilePath(albumData.albumFilePath);
        setDateCreated(albumData.dateCreated);
        setAlbumDescription(albumData.albumDescription);
        setOpenAlbumState(true);

        //Store in storage
        localStorage.setItem("albumName", albumData.albumName);
        localStorage.setItem("albumFilePath", albumData.albumFilePath);
        localStorage.setItem("dateCreated", albumData.dateCreated);
        localStorage.setItem("albumDescription", albumData.albumDescription);
        localStorage.setItem("openAlbumState", "true");
    }

    function closeAlbum(){
        setAlbumName(null);
        setAlbumFilePath(null);
        setDateCreated(null);
        setAlbumDescription(null);
        setOpenAlbumState(false);

        //Remove from storage
        localStorage.removeItem("albumName");
        localStorage.removeItem("albumFilePath");
        localStorage.removeItem("dateCreated");
        localStorage.removeItem("albumDescription");
        localStorage.removeItem("openedAlbum");
    }

    return (
        <AlbumContext.Provider value={{ albumName, albumFilePath, dateCreated, albumDescription, openAlbumState, openAlbum, closeAlbum }}>{children}</AlbumContext.Provider>
    );
}
