import ThemeSwitcher from "./ThemeSwitcher";
import { FiLayers } from "react-icons/fi";

export default function Topbar(){
  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo">
          <FiLayers size={22}/>
        </div>
        <div>
          <div className="title">Picks Tracker</div>
          <div className="subtitle">Tickets • Legs • Colorful insights</div>
        </div>
      </div>
      <ThemeSwitcher/>
    </header>
  );
}
