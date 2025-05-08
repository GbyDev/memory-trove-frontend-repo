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

//UI
import { Headers } from './components/UI/Headers.jsx';

import './styles/style.scss';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { AuthContext } from './contexts/AuthContext.jsx';



function App() {
  const {isLoggedIn} = useContext(AuthContext);

  return (
    <>
      <BrowserRouter>
        <Headers/>
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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
