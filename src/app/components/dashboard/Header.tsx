import { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  onLogout: () => Promise<void>;
}

export function Header({
  onMenuClick,
  onLogout,
  userName,
  userEmail,
}: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  async function handleLogout() {
    setUserMenuOpen(false);
    await onLogout();
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search questions, chapters, or subjects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open notifications"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((current) => !current)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-expanded={userMenuOpen}
              aria-haspopup="menu"
            >
              <img
                src="https://images.unsplash.com/photo-1536337005238-94b997371b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFdGhpb3BpYW4lMjBzdHVkZW50JTIweW91bmclMjBwZXJzb24lMjBzdHVkeWluZ3xlbnwxfHx8fDE3ODM5NjY2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Student profile"
                className="w-8 h-8 rounded-full object-cover"
              />

              <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
  {userName}
</div>

<div className="text-xs text-gray-500 dark:text-gray-400">
  {userEmail}
</div>
              </div>

              <ChevronDown
                className={`hidden md:block w-4 h-4 text-gray-500 transition-transform ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {userMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <User className="w-4 h-4" />
                  View profile
                </button>

                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}