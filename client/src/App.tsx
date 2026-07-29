import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { MapView } from "./pages/MapView";
import { LotDetail } from "./pages/LotDetail";
import { OwnerLots } from "./pages/OwnerLots";
import { OwnerLotSpaces } from "./pages/OwnerLotSpaces";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute role="DRIVER">
                  <MapView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lots/:id"
              element={
                <ProtectedRoute role="DRIVER">
                  <LotDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/lots"
              element={
                <ProtectedRoute role="OWNER">
                  <OwnerLots />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/lots/:id/spaces"
              element={
                <ProtectedRoute role="OWNER">
                  <OwnerLotSpaces />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
