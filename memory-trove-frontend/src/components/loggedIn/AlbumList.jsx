import { useContext, useEffect, useState} from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import EmptyAlbums from "./album_list_components/EmptyAlbums";
import AllAvailableAlbums from "./album_list_components/AllAvailableAlbums";

//NOTE: This component serves as a junction, between the album list and the empty album list components.
//You know the thing bla bla if empty, the empty component is used
export default function AlbumList() {
    const { userId } = useContext(AuthContext);
    const [numOfAlbums, setNumOfAlbums] = useState(null); // Use null as initial state to indicate loading

    useEffect(() => {
        async function determineAlbumCount() {
            try {
                const response = await axios.post(
                    "http://localhost/memory-trove-backend/countNumberOfAlbums.php",
                    JSON.stringify({ 
                        user_id: userId 
                    }),
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ); 
                console.log(response.data);
                //alert(response.data.message);
                setNumOfAlbums(response.data.albumCount);
            } 
            catch (error) {
                console.error("Error sending data", error);
                alert("There was an error during backend connection.");
                setNumOfAlbums(0); // Optional: default to 0 on error
            }
        }

        //This conditional ensures that a valid userId must be extracted first before loading albums.
        async function checkUserId() {
            if (userId) {
                await determineAlbumCount();
            }
        }
        checkUserId();
    }, [userId]);

    // Render loading state while data is being fetched
    if (numOfAlbums === null) {
        return <p>Loading albums...</p>;
    }
    
    return numOfAlbums > 0 ? 
    (
        <>
            <div className="main-container">
                <AllAvailableAlbums albumCount={numOfAlbums} />
            </div>
        </>
        
    ) 
    : 
    (
        <>
            <div className="main-container">
                <EmptyAlbums />
            </div>
        </>
        
    );
}

