import { useLocation, Link } from "wouter";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

export function Header() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  
  const isHomePage = location === "/";
  
  return (
    <header className="bg-primary dark:bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">Farewell Memories</h1>
        <div className="flex items-center">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-700 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {!isHomePage && (
            <Link href="/">
              <a className="ml-4 px-3 py-1 bg-white bg-opacity-20 rounded-md text-sm hover:bg-opacity-30 transition">
                Admin Home
              </a>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
