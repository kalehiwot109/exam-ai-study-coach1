import { Search, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions, chapters, or subjects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1536337005238-94b997371b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFdGhpb3BpYW4lMjBzdHVkZW50JTIweW91bmclMjBwZXJzb24lMjBzdHVkeWluZ3xlbnwxfHx8fDE3ODM5NjY2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Student"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900">Abebe Kebede</div>
              <div className="text-xs text-gray-500">Grade 12</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}