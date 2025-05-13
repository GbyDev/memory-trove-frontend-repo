import { LoggedInHeader } from "../../UI/Headers";

export default function EmptyAlbums(){
    return(
        <>  
            <LoggedInHeader/>
            <h1>All Albums</h1>
            <h2>No albums found.</h2>
            <p>Click the button below to create an album.</p>
        </>
    );
}