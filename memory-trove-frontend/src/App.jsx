import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useContext } from 'react';

//Components
import Welcome from './components/guest/Welcome.jsx';
import Login from './components/guest/Login.jsx';
import Register from './components/guest/Register.jsx';
import OpenAnAlbum from './components/guest/OpenAnAlbum.jsx';

import AlbumList from './components/loggedIn/AlbumList.jsx';
import CreateAnAlbum from './components/loggedIn/CreateAnAlbum.jsx';
import AccountSettings from './components/loggedIn/AccountSettings.jsx';

import Media from './components/albumOpenPages/Media.jsx';
import EditAlbum from './components/albumOpenPages/EditAlbum.jsx';
import UploadImage from './components/albumOpenPages/UploadImage.jsx';

//UI

import './styles/style.scss';
import { AuthContext } from './contexts/AuthContext.jsx';

function App() {
  const {isLoggedIn} = useContext(AuthContext);

  return (
    <>
      <BrowserRouter>
        <div className="main-container">
          <Routes>  
              {/*Default route*/}
              <Route path="/" element={
                isLoggedIn
                  ? <Navigate to="/pages/albumList" replace />
                  : <Navigate to="/pages/welcome" replace />
              }/>

              <Route path="/pages/welcome" element={<Welcome/>} />
              <Route path="/pages/login" element={<Login/>}/>
              <Route path="/pages/register" element={<Register/>}/>
              <Route path="/pages/openAnAlbum" element={<OpenAnAlbum/>}/>
              <Route path="/pages/albumList" element={<AlbumList/>}/>
              <Route path="/pages/createAnAlbum" element={<CreateAnAlbum/>}/>
              <Route path="/pages/accountSettings" element={<AccountSettings/>}/>
              <Route path ="/pages/media" element={<Media/>}/>
              <Route path="/pages/editAlbum" element={<EditAlbum/>}/>
              <Route path="/pages/uploadImage" element={<UploadImage/>}/>

            </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
