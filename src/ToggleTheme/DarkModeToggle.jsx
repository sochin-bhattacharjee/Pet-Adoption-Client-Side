import { useState, useEffect } from "react";
import { Switch } from "@material-tailwind/react";
import { FaMoon, FaSun } from "react-icons/fa";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="flex items-center">
      <span className="mr-2 text-orange-400 dark:text-white text-[17px] sm:text-[20px]"><FaSun />
      </span>
      <Switch
      className="border-2 border-amber-400"
        color="amber"
        checked={!isDarkMode}
        onChange={() => setIsDarkMode(!isDarkMode)}
      />
      <span className="ml-2 text-black text-[17px] sm:text-[20px] dark:text-yellow-100"><FaMoon /></span>
    </div>
  );
};

export default DarkModeToggle;
