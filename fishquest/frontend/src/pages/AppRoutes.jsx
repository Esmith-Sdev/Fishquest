import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Badges from "./BadgesPage";
import Buddies from "./Buddies";
import CreateLog from "./CreateLog";
import EditBadgeShowcase from "./EditBadgeShowcase";
import EditPole from "./EditPole";
import EditProfile from "./EditProfile";
import EditRig from "./EditRig";
import Level from "./Level";
import Logs from "./Logs";
import Notes from "./Notes";
import Profile from "./Profile";
import RigPreset from "./RigPreset";
import Shop from "./Shop";
import Tacklebox from "./Tacklebox";

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
