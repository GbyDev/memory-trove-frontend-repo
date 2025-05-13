import { Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
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
                {/* Add this SVG definition for the gradient */}
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ff2a6d" />
                            <stop offset="100%" stopColor="#05d9e8" />
                        </linearGradient>
                    </defs>
                </svg>
                
                <div className="logo">
                    <h1>Memory Trove</h1>
                </div>
                <nav>
                    <Link to="/pages/albumList" className='all-albums-btn'>
                        <span>All Albums</span>
                    </Link>
                    <Link to="/pages/createAnAlbum" className='create-album-btn'>
                        <span>Create an Album</span>
                    </Link>
                    <Link to="/pages/accountSettings" className='account-settings-btn'>
                        <FontAwesomeIcon 
                            icon={faCircleUser} 
                            className="account-icon" 
                        />
                        <span>&nbsp;{username ? username : "User"}</span>
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
                <Link to = "/pages/media" className = "media-btn">
                    <span>Media</span>
                </Link>
                <Link to = "/pages/uploadImage" className = "upload-image-btn">
                    Upload an Image
                </Link>
                <Link to = "/pages/editAlbum" className='edit-album-btn'>
                    Edit Album
                </Link>
                <Link to = "/pages/albumList" className='back-to-albums-list-btn'>
                    Back to Albums List
                </Link>
            </nav>

        </header>
    );
}


