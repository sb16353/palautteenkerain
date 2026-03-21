import { useState, useId } from 'react'
import { useNavigate } from 'react-router'

function App() {
  const navigate = useNavigate()
  const roomIdInputFieldId = useId();
  const [roomId, setRoomId] = useState('');
  
  return (
    <>
      <div id="input-room-code">
        <h1>Palautteenkeräin</h1>
        <input id={roomIdInputFieldId} name="roomId" onChange={e => setRoomId(e.target.value)} ></input>
        <button onClick={() => navigate(`/feedback/${roomId}`)}>Anna palautetta</button>
      </div>
    </>
  )
}

export default App
