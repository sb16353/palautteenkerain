import { useState, useRef,  Suspense } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext';
import { apiFetch } from '../api/client';
import { useTranslation } from 'react-i18next';
import validator from 'validator'

function Home() {
  const navigate = useNavigate();

  const {t, i18n} = useTranslation();

  const [errorStr, setErrorStr] = useState("");

  const [roomId, setRoomId] = useState('');

  const usernameRef = useRef("");
  const passwordRef = useRef("");

  const { token, login, logout } = useAuth();

  async function handleLogin() {
    setErrorStr("");

    const username = validator.trim(usernameRef.current.value);
    const password = validator.trim(passwordRef.current.value);

    try {
      const data = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
      });

      login(data.token);
    }
    catch (err) {
      setErrorStr(t(err.message || 'login-failed'));
      console.log(err);
    }
  }

  async function handleRegistration() {
    setErrorStr("");

    const username = validator.trim(usernameRef.current.value);
    const password = validator.trim(passwordRef.current.value);

    try {
      const data = await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({ username, password }),
      });
      
      login(data.token);
    }  
    catch (err) {
      setErrorStr(t(err.message || 'login-failed'));
      console.log(err);
    }
  }

  //Displays controls for logging in / registering and the dashboard button
  function AuthControls() {
    if (token) { 
      return (<>
        <button onClick={() => navigate("/dashboard")}>{t('Dashboard')}</button>
        <button onClick={logout}>{t('Log out')}</button>
      </>); 
    }


    return (<>
      <div id="auth-inputs">
        <br/>
        <input placeholder={t('usr')} type="text" ref={usernameRef}/>
        <br/><br/>
        <input placeholder={t('pwd')} type="password" ref={passwordRef}/>
        <br/><br/>    
      </div>
      <div id="auth-buttons" style={{display: "flex"}}>
        <button onClick={handleLogin}>{t('login')}</button>
        <button onClick={handleRegistration}>{t('register')}</button>
      </div>
    </>);
  }
  
  function navigateToFeedback() {
    setRoomId(validator.trim(roomId));

    if (roomId.length < 1)  {
      setErrorStr(t('room-id-empty'));
      return;
    }

    navigate(`/feedback/${roomId}`)
  }

  return (
    <>
      <Suspense fallback="loading">
        <div id="input-room-code">
          <h1>{t('title')}</h1>
          <input name="roomId" placeholder={t('room-id')} onChange={e => setRoomId(e.target.value)} ></input>
          <button onClick={navigateToFeedback} style={{marginTop: "10px"}}>{t('room-id-submit')}</button>
          <AuthControls/>
          <br/>  
          <p>{errorStr}</p>
        </div>
      </Suspense>
    </>
  )
}

export default Home
