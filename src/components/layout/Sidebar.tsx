import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Settings, Crown, LayoutGrid } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface SidebarProps {
    activeTab: 'create' | 'catalog' | 'library' | 'settings';
    onTabChange: (tab: 'create' | 'catalog' | 'library' | 'settings') => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    const { isPaid } = useStore();

    const navItems = [
        { id: 'create', icon: Sparkles, label: 'Create' },
        { id: 'catalog', icon: LayoutGrid, label: 'Catalog' },
        { id: 'library', icon: BookOpen, label: 'Library' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ] as const;

    return (
        <div className="w-20 lg:w-64 border-r border-slate-200 dark:border-slate-800 bg-bgSurface/40 dark:bg-slate-900/40 backdrop-blur-3xl flex flex-col h-full transition-all duration-300 z-20 relative">
            <div className="p-6 flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                    <Sparkles className="text-white" size={18} />
                </div>
                <h1 className="hidden lg:block font-extrabold text-xl tracking-tighter bg-gradient-to-r from-slate-900 via-primary to-slate-500 dark:from-white dark:via-primary dark:to-slate-400 bg-clip-text text-transparent">
                    Flash.AI
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 relative group
                  ${activeTab === item.id
                                ? 'text-primary bg-primary/10 font-bold'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        {activeTab === item.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-primary/10 rounded-xl"
                            />
                        )}
                        <item.icon size={22} className={activeTab === item.id ? 'text-primary' : ''} />
                        <span className="hidden lg:block uppercase text-xs tracking-widest">{item.label}</span>

                        {activeTab === item.id && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 w-1.5 h-6 bg-primary rounded-full hidden lg:block"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                {isPaid ? (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg relative overflow-hidden group">
                        <div className="absolute -top-2 -right-2 opacity-20 transform rotate-12 group-hover:scale-110 transition-transform">
                            <Crown size={60} />
                        </div>
                        <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-white font-black text-sm uppercase tracking-tighter">Pro Member</p>
                    </div>
                ) : (
                    <button
                        onClick={() => onTabChange('settings')}
                        className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden relative group text-left"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles size={60} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Free Tier</p>
                        <p className="text-white font-bold text-sm leading-tight">Upgrade to Pro Access</p>
                    </button>
                )}
            </div>
        </div>
    );
}

