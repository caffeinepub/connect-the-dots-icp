import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Newspaper, Twitter, Sparkles, TrendingUp, Users, Shield } from 'lucide-react';

interface NavigationMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'progress', label: 'Latest Progress', icon: Newspaper },
  { id: 'xposts', label: 'X Posts', icon: Twitter },
  { id: 'spotlight', label: 'Ecosystem Spotlight', icon: Sparkles },
  { id: 'wisdom', label: 'Investing Wisdom', icon: TrendingUp },
  { id: 'resources', label: 'Trusted Resources', icon: Users },
  { id: 'cybercrime', label: 'Cybercrime Awareness', icon: Shield },
];

export function NavigationMenu({ activeTab, onTabChange }: NavigationMenuProps) {
  const [open, setOpen] = useState(false);

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-black/40 border-white/10 hover:bg-black/60 hover:border-purple-500/50 transition-all"
        >
          <Menu className="h-5 w-5 text-white" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-[#1a0a2e] border-white/10 backdrop-blur-xl"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <DropdownMenuItem
              key={item.id}
              onClick={() => handleTabSelect(item.id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-white'}`} />
              <span className="text-sm font-medium text-white">{item.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
