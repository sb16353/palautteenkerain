import { useNavigate, useParams } from "react-router"

export default function FeedbackView() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  async function submitFeedback(rating) {
    try {
      const response = await fetch("http://localhost:8000/feedback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: roomId,
          rating: rating,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.detail || "Error submitting feedback");
        return;
      }

      const data = await response.json();
      console.log("Feedback submitted:", data);

    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  }

  return (
    <>
      <div id="feedback-container">
        <h1>Anna palautetta</h1>

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
   
      </div>

      
    </>
  );
}