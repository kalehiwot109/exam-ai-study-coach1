import {
  Target,
  BookOpen,
  FileText,
  BarChart2,
  Bot,
  Trophy,
  UserCircle,
  Settings,
  X,
} from "lucide-react";

export type Page =
  | "mission-control"
  | "practice"
  | "question-bank"
  | "analytics"
  | "study-coach"
  | "achievements"
  | "profile"
  | "settings";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navigation: {
  name: string;
  page: Page;
  icon: React.ElementType;
}[] = [
  {
    name: "Mission Control",
    page: "mission-control",
    icon: Target,
  },
  { name: "Practice", page: "practice", icon: BookOpen },
  {
    name: "Question Bank",
    page: "question-bank",
    icon: FileText,
  },
  { name: "Analytics", page: "analytics", icon: BarChart2 },
  { name: "Study Coach", page: "study-coach", icon: Bot },
  { name: "Achievements", page: "achievements", icon: Trophy },
];

const secondaryNavigation: {
  name: string;
  page: Page;
  icon: React.ElementType;
}[] = [
  { name: "Profile", page: "profile", icon: UserCircle },
  { name: "Settings", page: "settings", icon: Settings },
];

export function Sidebar({
  isOpen,
  onClose,
  activePage,
  onNavigate,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:z-30
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                StudyStreak
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.page;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    onNavigate(item.page);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors text-left
                    ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${active ? "text-blue-600" : "text-gray-400"}`}
                    strokeWidth={1.75}
                  />
                  {item.name}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Secondary */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-1">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.page;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    onNavigate(item.page);
                    onClose();
                  }}
                  className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
          transition-colors text-left
          ${
            active
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      active ? "text-blue-600" : "text-gray-400"
                    }`}
                    strokeWidth={1.75}
                  />

                  {item.name}

                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}