import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Home from "./pages/Home";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/profile" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
