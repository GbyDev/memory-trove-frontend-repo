import {Link} from 'react-router-dom';
import { useContext} from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export function Headers(){
    const {isLoggedIn} = useContext(AuthContext);
    if (isLoggedIn == true){
        return (
            <LoggedInHeader/> 
        );
    }
    else {
        return(
            <GuestHeader/>
        );
    }
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
    return(
        <>
            <header>
                <div className = "logo">
                    <h1>Memory Trove</h1>
                </div>
                <nav>
                    <Link to = "/pages/allAlbums">All Albums</Link>
                    <Link to = "/pages/createAnAlbum">Create an Album</Link>
                    <Link to = "/pages/accountSettings">Account Settings</Link>
                </nav>
            </header>
        </>
    );
}


