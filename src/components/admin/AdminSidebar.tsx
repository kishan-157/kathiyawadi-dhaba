import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  Grid,
  UtensilsCrossed,
  Layers,
  FileEdit,
  Image as ImageIcon,
  ToggleLeft,
  Store,
  Palette,
  Settings2,
  Share2,
  Globe,
  MessageSquare,
  Mic,
  Volume2,
  Database,
  Download,
  HelpCircle,
  ExternalLink,
  LogOut,
  Flame,
  X,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export type AdminTabId =
  | 'dashboard'
  | 'orders'
  | 'stock'
  | 'categories'
  | 'items'
  | 'variants'
  | 'content'
  | 'gallery'
  | 'sections'
  | 'info'
  | 'branding'
  | 'ordersettings'
  | 'socials'
  | 'seo'
  | 'chatbot'
  | 'voiceassistant'
  | 'audio'
  | 'database'
  | 'backup'
  | 'help';

interface AdminSidebarProps {
  activeTab: AdminTabId;
  onSelectTab: (tab: AdminTabId) => void;
  onCloseAdmin: () => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onCloseAdmin,
  onLogout,
  mobileOpen,
  onCloseMobile,
}) => {
  const { data, orders, reservations, contactMessages } = useRestaurant();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready'
  ).length;
  const pendingResCount = reservations.filter((r) => r.status === 'pending').length;
  const unreadMessagesCount = contactMessages.filter((m) => !m.isRead).length;
  const totalOrderBadge = pendingOrdersCount + pendingResCount + unreadMessagesCount;

  const soldOutCount = data.items.filter((i) => i.stockStatus === 'out_of_stock').length;

  const navGroups: {
    groupTitle: string;
    items: {
      id: AdminTabId;
      label: string;
      icon: React.FC<{ className?: string }>;
      badge?: number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      groupTitle: 'Live Operations',
      items: [
        { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
        {
          id: 'orders',
          label: 'Orders & Bookings',
          icon: ShoppingBag,
          badge: totalOrderBadge > 0 ? totalOrderBadge : undefined,
          badgeColor: 'bg-[#e8281a] text-white',
        },
        {
          id: 'stock',
          label: 'Quick Stock Toggle',
          icon: PackageCheck,
          badge: soldOutCount > 0 ? soldOutCount : undefined,
          badgeColor: 'bg-[#f6a623] text-[#1a1a1a]',
        },
      ],
    },
    {
      groupTitle: 'Menu & Catalog',
      items: [
        { id: 'categories', label: 'Menu Categories', icon: Grid },
        { id: 'items', label: 'Dishes & Pricing', icon: UtensilsCrossed },
        { id: 'variants', label: 'Sizes & Add-ons', icon: Layers },
      ],
    },
    {
      groupTitle: 'Website & Content',
      items: [
        { id: 'content', label: 'Content Studio', icon: FileEdit },
        { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
        { id: 'sections', label: 'Section Toggles', icon: ToggleLeft },
        { id: 'info', label: 'Identity & Hours', icon: Store },
        { id: 'branding', label: 'Colors & Fonts', icon: Palette },
      ],
    },
    {
      groupTitle: 'AI, Audio & Marketing',
      items: [
        { id: 'chatbot', label: 'Smart Chatbot', icon: MessageSquare },
        { id: 'voiceassistant', label: 'AI Voice Waiter', icon: Mic },
        { id: 'audio', label: 'Welcome Audio Studio', icon: Volume2 },
        { id: 'ordersettings', label: 'Delivery & Checkout', icon: Settings2 },
        { id: 'socials', label: 'Socials & Links', icon: Share2 },
        { id: 'seo', label: 'SEO & Meta Tags', icon: Globe },
      ],
    },
    {
      groupTitle: 'Cloud & System',
      items: [
        { id: 'database', label: 'Supabase Cloud Sync', icon: Database },
        { id: 'backup', label: 'Backup & Export', icon: Download },
        { id: 'help', label: 'Setup Guide', icon: HelpCircle },
      ],
    },
  ];

  const handleSelect = (id: AdminTabId) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#1a1a1a] text-white flex flex-col border-r border-white/10 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {data.profile.logoUrl && data.profile.logoUrl.trim() ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 flex items-center justify-center shrink-0">
              <img
                src={data.profile.logoUrl}
                alt={data.profile.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e8281a] to-[#f6a623] flex items-center justify-center text-white shrink-0 shadow-md">
              <Flame className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <h2
              className="font-bold text-lg text-white truncate leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {data.profile.name || 'Sarab'}
              <span className="text-[#e8281a]">.</span>
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#f6a623] block">
              Admin Studio
            </span>
          </div>
        </div>

        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.groupTitle}>
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {group.groupTitle}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#e8281a] text-white font-semibold shadow-md shadow-[#e8281a]/30'
                        : 'text-white/70 hover:text-white hover:bg-white/8'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-[#f6a623]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                          isActive
                            ? 'bg-white text-[#e8281a]'
                            : item.badgeColor || 'bg-[#e8281a] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2 bg-black/20">
        <button
          onClick={onCloseAdmin}
          className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#f6a623]" />
          <span>Back to Live Website</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full py-2 px-4 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock Admin Session</span>
        </button>
      </div>
    </aside>
  );
};
