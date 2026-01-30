import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Settings, Video } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface SidebarProps {
    activeTab: 'create' | 'library' | 'video' | 'settings';
    onTabChange: (tab: 'create' | 'library' | 'video' | 'settings') => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    // We don't need isDark toggle here anymore as it's part of themes in Settings
    // But we could show a mini theme indicator if we wanted.

    const navItems = [
        { id: 'create', icon: Sparkles, label: 'Create' },
        { id: 'library', icon: BookOpen, label: 'Library' },
        { id: 'video', icon: Video, label: 'Video' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ] as const;

    return (
        <div className="w-20 lg:w-64 border-r border-slate-200 dark:border-slate-800 bg-bgSurface dark:bg-slate-900 flex flex-col h-full transition-all duration-300 z-20 relative">
            <div className="p-6 flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                    <Sparkles className="text-white" size={18} />
                </div>
                <h1 className="hidden lg:block font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
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
                                ? 'text-primary bg-primary/10 font-semibold'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }
               `}
                    >
                        {activeTab === item.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-primary/10 rounded-xl"
                            />
                        )}
                        <item.icon size={22} className={activeTab === item.id ? 'text-primary' : ''} />
                        <span className="hidden lg:block">{item.label}</span>

                        {activeTab === item.id && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 w-1 h-8 bg-primary rounded-full hidden lg:block"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 shadow-xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles size={60} />
                    </div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Pro Plan</p>
                    <p className="text-white font-bold text-sm">Upgrade for unlimited generation</p>
                </div>
            </div>
        </div>
    );
}
