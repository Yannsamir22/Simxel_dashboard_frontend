import { Monitor, Moon, Sun } from "lucide-react";
import { useT } from "../../hooks/useT";
import { useTheme } from "../../hooks/useTheme";

const ToggleTheme = () => {
  const { t } = useT();
  const { theme, setTheme } = useTheme();

  const THEMES = [
    { label: t("settings.themes.system"), value: "system" as const, icon: Monitor },
    { label: t("settings.themes.light"), value: "light" as const, icon: Sun },
    { label: t("settings.themes.dark"), value: "dark" as const, icon: Moon },
  ];

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="btn btn-ghost btn-circle hover:scale-110 transition-transform"
      >
        {theme === "dark" ? (
          <Moon size={15} />
        ) : theme === "light" ? (
          <Sun size={15} />
        ) : (
          <Monitor size={15} />
        )}
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-md w-44"
      >
        {THEMES.map(({ label, value, icon: Icon }) => (
          <li key={value}>
            <button
              onClick={() => setTheme(value)}
              className={`flex items-center gap-2 rounded-md ${
                theme === value ? "font-bold text-primary" : ""
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToggleTheme;
