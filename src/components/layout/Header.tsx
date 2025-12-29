import { Menu, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';

export const Header = () => {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <SearchBar placeholder="Search cases, evidence, events..." />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </Button>
        
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          New Case
        </Button>
      </div>
    </header>
  );
};