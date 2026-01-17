import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
// import Users from "./pages/Users";
// import Medicines from "./pages/Medicines";
// import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/users" element={<Users />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/orders" element={<Orders />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
