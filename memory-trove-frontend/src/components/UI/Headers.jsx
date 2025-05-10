import { Link} from 'react-router-dom';
import { useContext} from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { AlbumContext } from '../../contexts/AlbumContext';

export function Headers() {
    const { isLoggedIn } = useContext(AuthContext);
    const { openAlbumState} = useContext(AlbumContext);

    if (openAlbumState) return <AlbumHeader />;
    return isLoggedIn ? <LoggedInHeader /> : <GuestHeader />;
}

export function GuestHeader(){
    return(
        <>
            <header>
                <div className = "logo">
                    <h1>Memory Trove</h1>
                </div>
                <nav>
                    <Link to="/pages/welcome">Home</Link>
                    <Link to="/pages/login">Login</Link>
                    <Link to="/pages/register">Register</Link>
                    <Link to="/pages/openAnAlbum">Open an Album</Link>
                </nav>
            </header>
        </>
    );
}

export function LoggedInHeader(){
    const {userId} = useContext(AuthContext);
    const {username} = useContext(AuthContext);
    return(
        <>
            <header>
                <div className = "logo">
                    <h1>Memory Trove</h1>
                </div>
                <nav>
                    <Link to = "/pages/albumList">
                        All Albums
                    </Link>
                    <Link to = "/pages/createAnAlbum">
                        Create an Album
                    </Link>
                    <Link to = "/pages/accountSettings">
                        {username ? username : "User"}, ID {userId ? userId : "?"}
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
                <Link to = "/pages/getQRCode">
                    Get QR Code
                </Link>
                <Link to = "/pages/editAlbum">
                    Edit Album
                </Link>
                <Link to = "/pages/albumList">
                    Back to Album List
                </Link>
            </nav>

        </header>
    );
}


