import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../api/client";

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);

  const roomIdRef = useRef("");

  async function loadRooms() {
    const data = await apiFetch("/rooms");
    setRooms(data);
  }

  async function createRoom() {
    const roomId = roomIdRef.current.value;

    const data = await apiFetch("/rooms?" + new URLSearchParams({room_id: roomId}), { method: "POST" });

    loadRooms();
  }

  useEffect(() => {
    loadRooms();
  }, []);

  return (<>
      <div id="dashboard">
        <h1>Your Rooms</h1>
        <input className="dashboard-element" ref={roomIdRef}/>
        <button className="dashboard-element" onClick={createRoom}>Create Room</button>

        {rooms.map(room => (
          <div className="dashboard-element" key={room.id}>
            <a href={`/room/${room.id}`}>{room.id}</a>
          </div>
        ))}
      </div>
  </>);
}