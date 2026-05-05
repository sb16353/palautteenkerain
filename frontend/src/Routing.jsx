import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Thanks from "./pages/Thanks";
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Room from "./pages/Room"
import FeedbackView from "./pages/FeedbackView"

export default function Routing() {
  return (<>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/:errorMsg?" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />
          <Route path="/feedback/:roomId" element={<FeedbackView />} />
          <Route path="/thanks" element={<Thanks />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </>)
}