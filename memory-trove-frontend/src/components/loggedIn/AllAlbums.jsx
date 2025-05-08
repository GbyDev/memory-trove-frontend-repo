import { useContext, useEffect, useState} from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";



export default function AllAlbums() {
    const { userId } = useContext(AuthContext);
    const [numOfAlbums, setNumOfAlbums] = useState(null); // Use null as initial state to indicate loading

    useEffect(() => {
        async function loadAlbums() {
            try {
                const response = await axios.post(
                    "http://localhost/memory-trove-backend/countNumberOfAlbums.php",
                    { userId },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log(response.data);
                //alert(response.data.message);
                setNumOfAlbums(response.data.albumCount);
            } catch (error) {
                console.error("Error sending data", error);
                alert("There was an error during backend connection.");
                setNumOfAlbums(0); // Optional: default to 0 on error
            }
        }

        //This conditional ensures that a valid userId must be extracted first before loading albums.
        if (userId) {
            loadAlbums();
        }
    }, [userId]);

    // Render loading state while data is being fetched
    if (numOfAlbums === null) {
        return <p>Loading albums...</p>;
    }

    return numOfAlbums > 0 ? 
    (
        <AlbumList />
    ) 
    : 
    (
        <EmptyAlbums />
    );
}

export function EmptyAlbums(){
    return(
        <>  
            <h1>All Albums</h1>
            <h2>No albums found.</h2>
            <p>Click the button below to create an album.</p>
        </>
    );
}

export function AlbumList(){
    const {numOfAlbums} = useContext(AuthContext);

    return(
        <>
            <h1>All Albums</h1>
            <p>You have {numOfAlbums} albums.</p>
        </>
    );
}