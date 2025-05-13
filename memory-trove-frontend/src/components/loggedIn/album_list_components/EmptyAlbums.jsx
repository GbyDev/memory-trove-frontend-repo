import { LoggedInHeader } from "../../UI/Headers";
import Footer from "../../UI/Footer";

export default function EmptyAlbums(){
    return(
        <>  
            <div className="EmptyAlbumsPage">
                <LoggedInHeader/>
                <div className="main-container">
                    <h1>No albums found.</h1>
                    <p>Click the button below to create an album.</p>
                    <a href = "/pages/createAnAlbum">Create an Album</a>
                </div>
                <Footer/>
            </div>
            
        </>
    );
}