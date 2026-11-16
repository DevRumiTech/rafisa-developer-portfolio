import { SiReact, SiTypescript, SiJavascript, SiHtml5, SiNodedotjs, SiExpress, SiPython, SiFlask, SiPhp, SiMysql, SiPostgresql, SiSqlite, SiVitest, SiPytest, SiVite, SiGit, SiGithub, SiFigma } from "react-icons/si";
import { FaCss3Alt } from "react-icons/fa";
import { Globe, Palette, PenTool, MonitorCheck } from "lucide-react";

// Icon names are resolved safely so unavailable logos
// do not prevent the portfolio from rendering.
const technologyIcons = {
  React: [SiReact, "#61DAFB"],
  TypeScript: [SiTypescript, "#3178C6"],
  JavaScript: [SiJavascript, "#D6B600"],
  HTML5: [SiHtml5, "#E34F26"],
  CSS3: [FaCss3Alt, "#1572B6"],
  "Node.js": [SiNodedotjs, "#5FA04E"],
  Express: [SiExpress, "currentColor"],
  Python: [SiPython, "#3776AB"],
  Flask: [SiFlask, "currentColor"],
  PHP: [SiPhp, "#777BB4"],
  MySQL: [SiMysql, "#4479A1"],
  PostgreSQL: [SiPostgresql, "#4169E1"],
  SQLite: [SiSqlite, "#0C78A8"],
  Vitest: [SiVitest, "#729B1B"],
  Playwright: [MonitorCheck, "#2EAD33"],
  pytest: [SiPytest, "#0A9EDC"],
  Vite: [SiVite, "#646CFF"],
  Git: [SiGit, "#F05032"],
  GitHub: [SiGithub, "currentColor"],
  Figma: [SiFigma, "#A259FF"],
  Canva: [Palette, "#00C4CC"],
  Adobe: [PenTool, "#EB1000"]
};

export default function TechnologyLogo({ name }) {
  if (name === "REST APIs" || name === "API REST") {
    return <Globe className="technology-logo" aria-hidden="true" />;
  }

  const config = technologyIcons[name];
  if (!config) return null;

  const [iconName, color] = config;
  const Icon = iconName;

  // Use a text mark when a brand icon is unavailable.
  if (!Icon) {
    return (
      <span className="technology-logo-letter" aria-hidden="true">
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <Icon
      className="technology-logo"
      style={{ color }}
      aria-hidden="true"
    />
  );
}
