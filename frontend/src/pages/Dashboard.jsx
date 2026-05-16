import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../api/client";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import validator from 'validator';
import DeleteRoom from "../components/DeleteRoom";
import { useError } from "../components/ErrorProvider";

export default function Dashboard() {

  const {errorMsg, setErrorMsg} = useError();

  const [rooms, setRooms] = useState([]);

  const {t, i18n} = useTranslation();

  const roomIdRef = useRef("");

  const [operationInProgress, setOperationInProgress] = useState(false);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  async function loadRooms() {
    if (operationInProgress) return;
    
    setOperationInProgress(true);

    try {
      const data = await apiFetch("/rooms");
      setRooms(data);
    }
    catch(e) {
      setErrorMsg(t(e.message | 'room-load-error'))
      console.log(e);
    }
    finally {
      setOperationInProgress(false);
    }  
  }

  async function createRoom() {
    if (operationInProgress) return;

    setOperationInProgress(true);

    try {
      const roomId = validator.trim(roomIdRef.current.value).replace(/\s+/g, "_").toLowerCase();

      roomIdRef.current.value = "";

      const data = await apiFetch(`/rooms/${roomId}`, { method: "POST" });

      setErrorMsg(`${t('Room')} "${roomId}" ${t('created')}`)

      loadRooms();
    }
    catch (e) {
      setErrorMsg(t(e.message | 'room-create-error'))
      console.log(e);
    }
    finally {
      setOperationInProgress(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  return (<>
      <div id="dashboard">
        <h1>{t('Your Rooms')}</h1>
        <input className="dashboard-element" placeholder={t('room-id')} ref={roomIdRef}/>
        <button className="dashboard-element" onClick={createRoom}>{t('Create Room')}</button>
        {rooms.map(room => (
          <div className="dashboard-element" key={room.id}>
            <a 
              href="#" 
              aria-label={t('View statistics for room') + ' ' + room.id}
              onClick={
                (e) => {
                  e.preventDefault();
                  navigate(`/room/${room.id}`);
                }
              }
            >
              {room.id}
            </a> 
            &nbsp;
            <DeleteRoom roomId={room.id}/>
          </div>
        ))}
      </div>
  </>);
}