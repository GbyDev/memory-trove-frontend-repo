import welcomeImage from '../../assets/welcome-image.jpg';

export default function Welcome(){
    return(
        <>
            
            <div className = "WelcomePage">
                <div className="textContent">
                    <h1>Preserve your most precious of memories.</h1>
                    <p>
                        Memory Trove is your digital keepsake box, designed to store and organize photos, videos, and memories with ease. Create albums, add descriptions, and tag loved ones to relive your special moments anytime, anywhere. Secure, simple, and beautiful — your memories, always within reach.
                    </p>
                    <button>Get started</button>
                </div>
                <div className="imgContent">
                    <img src={welcomeImage} alt="Welcome Image"></img>
                </div>
            </div>
            
        </>
    );
}