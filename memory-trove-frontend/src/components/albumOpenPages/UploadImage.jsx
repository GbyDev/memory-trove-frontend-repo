import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { AlbumContext } from '../../contexts/AlbumContext';
import { useNavigate } from 'react-router-dom';
import { AlbumHeader } from '../UI/Headers';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function UploadImage() {
  
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState('');

  const { userId } = useContext(AuthContext);
  const { albumId, albumFolderPath } = useContext(AlbumContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));

    setPreviews(previewUrls);
    setFiles(selectedFiles);
  };

  const handleCancel = () => {
    navigate('/pages/media');
  };

  const handleSubmit = () => {
    const promptElement = document.querySelector('.prompt');

    function setPromptColor(msgType) {
      if (msgType === 'error') {
        promptElement.style.color = 'red';
      } else if (msgType === 'success') {
        promptElement.style.color = 'green';
      } else {
        promptElement.style.color = 'black';
      }
    }

    function areUploadsInvalid() {
      if (files.length === 0) {
        setPromptColor('error');
        setPrompt('No files selected.');
        return true;
      }
      return false;
    }

    async function sendToBackend() {
      const formData = new FormData();

      formData.append('user_id', userId);
      formData.append('album_id', albumId);
      formData.append('album_folder_path', albumFolderPath);

      files.forEach(file => {
        formData.append('images[]', file);
      });

      try {
        const response = await axios.post(
          'http://localhost/memory-trove-backend/uploadImage.php',
          formData
        );
        setPromptColor('success');
        setPrompt('Upload successful!');
        console.log(response.data);

        setFiles([]);
        setPreviews([]);
        document.querySelector('input[type="file"]').value = '';
      } catch (err) {
        setPromptColor('error');
        setPrompt('Upload failed.');
        console.error(err);
      }
    }

    if (areUploadsInvalid()) return;

    console.log('Selected files:', files);
    sendToBackend();
  };

  return (
    <div className="UploadImagePage">
      
      <AlbumHeader />

      <div className="main-container">
        
        <h1>Upload Image</h1>

        <label htmlFor="fileInput" className="custom-upload-btn">
            Upload Cover Image
            &nbsp;&nbsp;
            <FontAwesomeIcon className="upload-icon" icon={faUpload} />
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          id="fileInput"
        />

        <div className="preview-container">
          {previews.map((src, index) => (
            <img key={index} src={src} alt={`Preview ${index}`} width="100" />
          ))}
        </div>

        <button onClick={handleSubmit} className='upload-confirm-btn'>
          Confirm and Upload
        </button>

        <button onClick={handleCancel} className='upload-cancel-btn'>
          Cancel
        </button>

        <p className="prompt">{prompt}</p>

      </div>

    </div>
  );
}
