import { useStore } from '@/context/StoreContext';
import { themes } from '@/utils/themes';
import { Check, CreditCard, Key, Palette, Shield } from 'lucide-react';

export function SettingsView() {
    const { apiKey, setApiKey, currentTheme, setTheme } = useStore();

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <header>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your API keys, preferences, and themes.</p>
            </header>

            {/* API Key Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Key size={24} className="text-primary" />
                    <h3 className="text-xl font-semibold">AI Configuration</h3>
                </div>

                <div className="bg-bgSurface border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        OpenRouter / Poe API Key
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-or-..."
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {apiKey ? (
                                <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full font-medium border border-green-500/20">Configured</span>
                            ) : (
                                <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full font-medium">Missing</span>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-2">
                        <Shield size={12} /> Your key is stored locally in your browser and never sent to our servers.
                    </p>
                </div>
            </section>

            {/* Theme Selection Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Palette size={24} className="text-secondary" />
                    <h3 className="text-xl font-semibold">Appearance</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {themes.map((theme) => {
                        const isActive = currentTheme.id === theme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => setTheme(theme.id)}
                                className={`
                            relative group p-4 rounded-xl border transition-all duration-300 flex flex-col gap-3 text-left overflow-hidden
                            ${isActive
                                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                                        : 'border-slate-200 dark:border-slate-800 bg-bgSurface hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg'
                                    }
                        `}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className={`font-semibold text-sm ${isActive ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {theme.name}
                                    </span>
                                    {isActive && <Check size={16} className="text-primary" />}
                                </div>

                                {/* Theme Preview Swatches */}
                                <div className="flex gap-1 h-3 w-full rounded-full overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                                    <div className="h-full flex-1" style={{ backgroundColor: theme.colors.primary }} />
                                    <div className="h-full flex-1" style={{ backgroundColor: theme.colors.secondary }} />
                                    <div className="h-full flex-1" style={{ backgroundColor: theme.colors.accent }} />
                                    <div className="h-full flex-1" style={{ backgroundColor: theme.colors.bgApp }} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Billing Section (Placeholder) */}
            <section className="space-y-6 opacity-50 pointer-events-none filter grayscale">
                <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <CreditCard size={24} className="text-accent" />
                    <h3 className="text-xl font-semibold">Subscription</h3>
                    <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-bold">COMING SOON</span>
                </div>
            </section>
        </div>
    );
}
