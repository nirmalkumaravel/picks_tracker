import { useEffect, useState } from "react";
import { FiSun, FiMoon, FiFeather, FiZap, FiCloud } from "react-icons/fi";

const THEMES = ["light", "aurora", "sunset", "ocean", "neon"] as const;
type ThemeName = typeof THEMES[number];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    return (localStorage.getItem("picks.theme") as ThemeName) || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("picks.theme", theme);
  }, [theme]);

  return (
    <div className="theme-switcher">
      <button className={`pill ${theme==="light" ? "active":""}`} title="Light" onClick={()=>setTheme("light")}><FiCloud/></button>
      <button className={`pill ${theme==="aurora" ? "active":""}`} title="Aurora" onClick={()=>setTheme("aurora")}><FiFeather/></button>
      <button className={`pill ${theme==="sunset" ? "active":""}`} title="Sunset" onClick={()=>setTheme("sunset")}><FiSun/></button>
      <button className={`pill ${theme==="ocean" ? "active":""}`} title="Ocean" onClick={()=>setTheme("ocean")}><FiMoon/></button>
      <button className={`pill ${theme==="neon" ? "active":""}`} title="Neon" onClick={()=>setTheme("neon")}><FiZap/></button>
    </div>
  );
}
