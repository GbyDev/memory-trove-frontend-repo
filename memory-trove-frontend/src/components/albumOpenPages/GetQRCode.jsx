import { useContext } from "react";
import { AlbumContext } from "../../contexts/AlbumContext";


export default function GetQRCode(){
    const {albumName,albumFolderPath} = useContext(AlbumContext);
    const qrCodePath = albumFolderPath + "/qrcode/qrcode.png";
    console.log(convertToWebPath(qrCodePath));
    return(
        <div className="main-container">
            <h1>{albumName}</h1>
            <p>QR Code</p>
            <img src={convertToWebPath(qrCodePath)} alt="QR Code"></img>
            <p>Scan it with your phone camera</p>
        </div>
    );
}
function convertToWebPath(localPath) {
    //Replace local path with web path
    return localPath.replace("C:/xampp/htdocs", "http://localhost");
}