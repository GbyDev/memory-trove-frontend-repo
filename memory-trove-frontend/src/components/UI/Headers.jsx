import { Link} from 'react-router-dom';
import { useContext} from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { AlbumContext } from '../../contexts/AlbumContext';

export function GuestHeader(){
    return(
        <>
            <header>
                <div className = "logo">
                    <h1>Memory Trove</h1>
                </div>
                <nav>
                    <Link to="/pages/welcome" className = "home-btn">
                        <span>Home</span>
                    </Link>
                    <Link to="/pages/login" className = "login-btn">
                        <span>Login</span>
                    </Link>
                    <Link to="/pages/register" className = "register-btn">
                        <span>Register</span>
                    </Link>
                </nav>
            </header>
        </>
    );
}

export function LoggedInHeader(){
    const {username} = useContext(AuthContext);
    return(
        <>
            <header>
                <div className = "logo">
                    <h1>Memory Trove</h1>
                </div>
                <nav>
                    <Link to = "/pages/albumList">
                        <span>All Albums</span>
                    </Link>
                    <Link to = "/pages/createAnAlbum">
                        <span>Create an Album</span>
                    </Link>
                    <Link to = "/pages/accountSettings">
                        <span>{username ? username : "User"}</span>
                    </Link>
                </nav>
            </header>
        </>
    );
}

export function AlbumHeader(){
    const {albumName} = useContext(AlbumContext);
    return (
        <header>
            <div className = "logo-album-name">
                <h1>{albumName}</h1>
            </div>
            <nav>
                <Link to = "/pages/media">
                    Media
                </Link>
                <Link to = "/pages/uploadImage">
                    Upload an Image
                </Link>
                <Link to = "/pages/editAlbum">
                    Edit Album
                </Link>
                <Link to = "/pages/albumList">
                    Back to Albums List
                </Link>
            </nav>

        </header>
    );
}


