import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Badges from "./BadgesPage";
import Buddies from "../pages/Buddies";
import CreateLog from "../pages/CreateLog";
import EditBadgeShowcase from "../pages/EditBadgeShowcase";
import EditPole from "../pages/EditPole";
import EditProfile from "../pages/EditProfile";
import EditRig from "../pages/EditRig";
import Level from "../pages/Level";
import Logs from "../pages/Logs";
import Notes from "../pages/Notes";
import Profile from "../pages/Profile";
import RigPreset from "../pages/RigPreset";
import Shop from "../pages/Shop";
import Tacklebox from "../pages/Tacklebox";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/badges" element={<Badges />} />
      <Route path="/buddies" element={<Buddies />} />
      <Route path="/create-log" element={<CreateLog />} />
      <Route path="/edit-badge-showcase" element={<EditBadgeShowcase />} />
      <Route path="/edit-pole" element={<EditPole />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/edit-rig" element={<EditRig />} />
      <Route path="/level" element={<Level />} />
      <Route path="/logs" element={<Logs />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/rig-preset" element={<RigPreset />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/tacklebox" element={<Tacklebox />} />
    </Routes>
  );
}
