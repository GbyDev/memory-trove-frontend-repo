import { createContext, useState, useEffect} from "react";

export const AlbumContext = createContext();

export function AlbumDataProvider({ children }) {
    const [albumName, setAlbumName] = useState("");
    const [albumFolderPath, setAlbumFolderPath] = useState("");
    const [dateCreated, setDateCreated] = useState("");
    const [welcomeText, setWelcomeText] = useState("");
    const [albumDescription, setAlbumDescription] = useState("");
    const [albumCoverImagePath, setAlbumCoverImagePath] = useState("");
    

    const [openAlbumState , setOpenAlbumState] = useState(false);

     // Load from localStorage on mount
    useEffect(() => {
        const storedOpen = localStorage.getItem("openAlbumState");
        if (storedOpen === "true") {
            setAlbumName(localStorage.getItem("albumName") || "");
            setAlbumFolderPath(localStorage.getItem("albumFolderPath") || "");
            setDateCreated(localStorage.getItem("dateCreated") || "");
            setWelcomeText(localStorage.getItem("welcomeText") || "");
            setAlbumDescription(localStorage.getItem("albumDescription") || "");
            setAlbumCoverImagePath(localStorage.getItem("albumCoverImagePath") || "");
            setOpenAlbumState(true);
        }
    }, []);

    function openAlbum(albumData) {
        setAlbumName(albumData.albumName);
        setAlbumFolderPath(albumData.albumFolderPath);
        setDateCreated(albumData.dateCreated);
        setWelcomeText(albumData.welcomeText);
        setAlbumDescription(albumData.albumDescription);
        setAlbumCoverImagePath(albumData.albumCoverImagePath);
        setOpenAlbumState(true);

        //Store in storage
        localStorage.setItem("albumName", albumData.albumName);
        localStorage.setItem("albumFolderPath", albumData.albumFolderPath);
        localStorage.setItem("dateCreated", albumData.dateCreated);
        localStorage.setItem("welcomeText", albumData.welcomeText);
        localStorage.setItem("albumDescription", albumData.albumDescription);
        localStorage.setItem("albumCoverImagePath", albumData.albumCoverImagePath);
        localStorage.setItem("openAlbumState", "true");
    }

    function closeAlbum(){
        setAlbumName(null);
        setAlbumFolderPath(null);
        setDateCreated(null);
        setWelcomeText(null);
        setAlbumDescription(null);
        setAlbumCoverImagePath(null);
        setOpenAlbumState(false);

        //Remove from storage
        localStorage.removeItem("albumName");
        localStorage.removeItem("albumFolderPath");
        localStorage.removeItem("dateCreated");
        localStorage.removeItem("welcomeText");
        localStorage.removeItem("albumDescription");
        localStorage.removeItem("albumCoverImagePath");
        localStorage.removeItem("openedAlbum");
    }

    return (
        <AlbumContext.Provider value={{ albumName, albumFolderPath, dateCreated, welcomeText,albumDescription, albumCoverImagePath, openAlbumState, openAlbum, closeAlbum }}>{children}</AlbumContext.Provider>
    );
}
