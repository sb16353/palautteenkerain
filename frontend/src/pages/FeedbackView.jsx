import { useNavigate, useParams } from "react-router"
import { apiFetch } from "../api/client";
import { useEffect, useState, useId, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function FeedbackView() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const commentFieldId = useId();
  const commentRef = useRef("");
  const [errorMsg, setErrorMsg] = useState("");

  const {t, i18n} = useTranslation();

  const [submitting, setSubmitting] = useState(false);

  async function submitFeedback(rating) {
    if (submitting) return;

    setSubmitting(true);

    try {
      const comment = commentRef.current.value;

      const data = await apiFetch("/feedback", {
        method: "POST",
        body: JSON.stringify({
          room_id: roomId,
          rating,
          comment
        }),
      });
      navigate("/thanks");
    } catch (err) {
      console.error(err);
      setErrorMsg(t(err.message || 'An error occurred while submitting feedback'));
    }
    finally {
      setSubmitting(false);
    }
  }

  const [roomValidated, setRoomValidated] = useState(false);

  async function validateRoom() {
    let data;

    try {
      data = await apiFetch("/feedback?" + new URLSearchParams({room_id: roomId}), { method: "GET" });
    }
    catch {
      data = false;
    }

    if (!data) {
      navigate("/?error_msg=room-not-found");
    }
    else {
      setRoomValidated(true);
    }
  }

  useEffect(() => {
    validateRoom();
  }, []);

  function FeedbackControls() {
    if (roomValidated) {
      return (<>
        <h1>{t('room-id-submit')}</h1>

        <p>{errorMsg}</p>

        <div id="feedback-button-container">
          <button className="feedback-button" id="r5" onClick={() => submitFeedback(5)}>
            <div className="feedback-button-text">😀</div>
          </button>

          <button className="feedback-button" id="r4" onClick={() => submitFeedback(4)}>
            <div className="feedback-button-text">🙂</div>
          </button>

          <button className="feedback-button" id="r3" onClick={() => submitFeedback(3)}>
            <div className="feedback-button-text">😐</div>
          </button>

          <button className="feedback-button" id="r2" onClick={() => submitFeedback(2)}>
            <div className="feedback-button-text">🙁</div>
          </button>

          <button className="feedback-button" id="r1" onClick={() => submitFeedback(1)}>
            <div className="feedback-button-text">😞</div>
          </button>
        </div>

        <p id={commentFieldId}>{t('optional-feedback-field')}</p>
        <textarea ref={commentRef} aria-describedby={commentFieldId} />
      </>);
    }

    return <h1>...</h1>;
  }

  return (
    <>
      <div id="feedback-container">
        <FeedbackControls/>
      </div>
    </>
  );
}