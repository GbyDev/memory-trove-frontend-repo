import { AuthContext } from "../../../contexts/AuthContext";
import { useContext, useState} from "react";
import AlbumItem from "../../UI/AlbumItem";
import axios from "axios";


export function ListOfAlbums(){
    const { userId } = useContext(AuthContext);
    const [numOfAlbums, setNumOfAlbums] = useState(0);

    async function handleAlbumLoad(albumTotal){
        //Set the initial num of albums
        setNumOfAlbums(albumTotal);

        async function getAnAlbum(currentAlbumNum) {
            //Boilerplate for the details you want to send to the backend
            //("value type", value)
            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("current_album_num", currentAlbumNum);
            let response = {};
            try {
                response = await axios.post(
                    "http://localhost/memory-trove-backend/getAlbumDetails.php",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
                console.log(response.data);
                alert(response.data.message);
            } 
            catch (error) {
                console.error("Error sending data", error);
                alert("There was an error getting the album details.");
            }
            return response.data;
        }
        for (let i = 0; i < numOfAlbums; i++) 
            await getAnAlbum(i);
        
    }
    handleAlbumLoad();
}

export default function AllAvailableAlbums({ albumCount }) {
    const { username} = useContext(AuthContext);
    return (
        <>
            <h1>{username}&apos;s Album Colletion</h1>
            <p>You have {albumCount} albums.</p>
            <ListOfAlbums albumTotal={albumCount}/>     
        </>
    );
}