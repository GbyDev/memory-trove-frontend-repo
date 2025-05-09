
import sampleQrCode from '../../assets/sample_qr_code.png';
export default function OpenAnAlbum(){
    return(
        <>  
            <div className="OpenAnAlbumPage">
                <div className="text-content">
                    <h1>Scan QR Code</h1>
                    <p>bla bla bla</p>
                </div>
                <div className="img-content">
                    <img src={sampleQrCode} alt="Sample QR Code"></img>
                </div>

            </div>

        </>
    );
}