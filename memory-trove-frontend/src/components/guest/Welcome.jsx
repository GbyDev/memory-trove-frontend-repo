import { useNavigate } from 'react-router-dom';
import welcomeImage from '../../assets/welcome-page-section-img.jpg';
import Footer from '../UI/Footer';
import { GuestHeader } from '../UI/Headers';

export default function Welcome(){
    const navigate = useNavigate();
    function redirectToLogin(){
        navigate('/pages/login');
    }
    function redirectToRegister(){
        navigate('/pages/register');
    }
    return(
        <>
            <div className = "WelcomePage">
                <GuestHeader/>
                <div className='hero-section'>
                    <div className="text-content">
                        <p>Your memories are cherished here at</p>
                        <h1>MemoryTrove</h1>
                        <p>Preserve, keep, and treasure them together with us!</p>
                    </div>
                </div>
                
                <div className="section">
                    <hr/>
                    <div className="flex-container">
                        <div className="text-content">
                            <h1>What is <span className = "memory-trove-big">MemoryTrove</span>?</h1>
                            <p>
                                <span className = "memory-trove-small">MemoryTrove</span> is your digital keepsake box, designed to store and organize photos with ease. Create albums, add descriptions, and  relive your special moments anytime, anywhere. Secure, simple, and beautiful — your memories, always within reach.
                            </p>
                            <div className="button-container">
                                <div className="button-wrapper">
                                    <button type = "button" className = "get-started-button" onClick={redirectToRegister} >
                                        <span className = "button-text">Get started</span>
                                    </button>
                                </div>
                                
                                <button type = "button" className = "login-button" onClick={redirectToLogin} >Login</button>
                            </div>
                        </div>
                        <div className="img-content">
                            <img src={welcomeImage} alt="Welcome Image" width="350px" height = "auto"></img>
                        </div>
                    </div>
                    <hr/>
                    <h2>Create an album, now!</h2>
                </div>
                <Footer/>
            </div>
        </>
    );
}