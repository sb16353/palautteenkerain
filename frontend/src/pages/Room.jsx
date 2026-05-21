import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useTranslation } from "react-i18next";

export default function Room() {
  const { roomId } = useParams();
  const [stats, setStats] = useState(null);

  const {t, i18n} = useTranslation();

  async function loadStats() {
    const data = await apiFetch(`/rooms/${roomId}`);
    //console.log(data);
    setStats(data);
  }

  useEffect(() => {
    loadStats();
  }, []);

  const headers = {
    1: "😞",
    2: "🙁",
    3: "😐",
    4: "🙂",
    5: "😀",
  }

  function RatingsDisplay() {
    return (
      <div style={{width: "25%"}}>
        <h3>{t('Comments')}:</h3>
        {Object.entries(headers)
          .sort((a, b) => Number(b[0]) - Number(a[0])) // sort descending
          .map(([key, emoji]) => {
            const match = stats[2].find(([rating, comment]) => rating === Number(key) && String(comment).length > 0);

            return (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <h4>{emoji}</h4>
                <ul>
                  {match && <li>"{match[1]}"</li>}
                </ul>
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%"}}>
      {
        !stats ? <p>Loading...</p> : (<>
          <h1>{t('Room')} {roomId}</h1>
          <h3>{t('Average')}: {stats[0]}</h3>
          <h3>{t('Votes')}: {stats[1]}</h3>
          <RatingsDisplay/>
        </>)
      }
    </div>
  );
}