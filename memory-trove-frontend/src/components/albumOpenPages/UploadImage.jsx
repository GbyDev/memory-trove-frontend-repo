import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

export default function UploadImage() {
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState('');
  const {userId} = useContext(AuthContext);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
    setFiles(selectedFiles);
  };

  const handleSubmit = () => {
    const promptElement = document.querySelector('.prompt');

    function setPromptColor(msgType) {
        if (msgType === 'error') 
            promptElement.style.color = "red";
        else if (msgType === 'success') 
            promptElement.style.color = "green";
        else 
            promptElement.style.color = "black"; // Default color
    }

    function areUploadsInvalid() {
        if (files.length == 0) {
            setPromptColor('error');
            setPrompt('No files selected.');
            return true;
        }
        return false;
    }
    
    function sendToBackend() {
        const formData = new FormData();
        formData.append('user_id', userId);
        files.forEach(file => {
            formData.append('images[]', file); 
        });

        axios.post('http://localhost/your-backend/upload.php', formData)
            .then(res => {
                setPromptColor('success');
                setPrompt('Upload successful!');
                console.log(res.data);
            })
            .catch(err => {
                setPromptColor('error');
                setPrompt('Upload failed.');
                console.error(err);
            });
    }


    if (areUploadsInvalid()) return;
    console.log('Selected files:', files);
    sendToBackend();
    
  };

  return (
    <div className="main-container">
      <h1>Upload Image</h1>

      <input type="file" multiple accept="image/*" onChange={handleChange} />

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
        {previews.map((src, index) => (
          <img key={index} src={src} alt={`Preview ${index}`} width="100" />
        ))}
      </div>

      <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
        Upload
      </button>
      <p className='prompt'>{prompt}</p>
    </div>
  );
}