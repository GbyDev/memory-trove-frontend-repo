import {Link} from 'react-router-dom';
import { useContext} from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export function Headers(){
    const { isLoggedIn, loading } = useContext(AuthContext);

    if (loading) return null; // Prevent rendering while loading

    return isLoggedIn ? <LoggedInHeader/> : <GuestHeader/>;
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
                    <Link to = "/pages/allAlbums">
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


