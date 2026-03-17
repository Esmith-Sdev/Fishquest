import AppRoutes from "./pages/AppRoutes.jsx";
import "./styles/App.css";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter basename="/Fishquest">
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
