import { useNavigate } from 'react-router-dom';
import welcomeImage from '../../assets/welcome-image.jpg';

export default function Welcome(){
    const navigate = useNavigate();
    function redirectToLogin(){
        navigate('/pages/login');
    }
    return(
        <>
            <div className="main-container">
                <div className = "WelcomePage">
                    <div className="text-content">
                        <h1>Preserve your most precious of memories.</h1>
                        <p>
                            Memory Trove is your digital keepsake box, designed to store and organize photos, videos, and memories with ease. Create albums, add descriptions, and tag loved ones to relive your special moments anytime, anywhere. Secure, simple, and beautiful — your memories, always within reach.
                        </p>
                        <button type = "button" onClick={redirectToLogin} >Get started</button>
                    </div>
                    <div className="img-content">
                        <img src={welcomeImage} alt="Welcome Image"></img>
                    </div>
                </div>
            </div>
            
            
        </>
    );
}