import { useStore } from '@/context/StoreContext';
import { themes } from '@/utils/themes';
import { Check, CreditCard, Key, Palette, Shield, Mail, User, Lock, Crown, Zap } from 'lucide-react';

export function SettingsView() {
    const {
        openRouterKey, setOpenRouterKey,
        poeKey, setPoeKey,
        preferredProvider, setPreferredProvider,
        currentTheme, setTheme,
        isPaid, setIsPaid, maxUploadSize
    } = useStore();

    const accounts = [
        'reactcc@atomicmail.io',
        'simonejohnson840@gmail.com',
        'jdjchelp@gmail.com',
        'simonejohnson840+anything@gmail.com'
    ];

    const limitInMB = maxUploadSize / (1024 * 1024);

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <header>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your API keys, preferences, and themes.</p>
            </header>

            {/* AI Configuration Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Key size={24} className="text-primary" />
                    <h3 className="text-xl font-semibold">AI Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* OpenRouter Key */}
                    <div className={`bg-bgSurface border rounded-2xl p-6 shadow-sm transition-all ${preferredProvider === 'openrouter' ? 'border-primary ring-1 ring-primary/20' : 'border-slate-200 dark:border-slate-700/50'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                OpenRouter API Key
                            </label>
                            <input
                                type="radio"
                                checked={preferredProvider === 'openrouter'}
                                onChange={() => setPreferredProvider('openrouter')}
                                className="w-4 h-4 text-primary cursor-pointer"
                                name="preferredProvider"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                value={openRouterKey}
                                onChange={(e) => setOpenRouterKey(e.target.value)}
                                placeholder="sk-or-..."
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono transition-all pr-24"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {openRouterKey ? (
                                    <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-1 rounded-full font-medium border border-green-500/20 uppercase tracking-tighter">Active</span>
                                ) : (
                                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full font-medium uppercase tracking-tighter">Missing</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Poe Key */}
                    <div className={`bg-bgSurface border rounded-2xl p-6 shadow-sm transition-all ${preferredProvider === 'poe' ? 'border-primary ring-1 ring-primary/20' : 'border-slate-200 dark:border-slate-700/50'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Poe API Key
                            </label>
                            <input
                                type="radio"
                                checked={preferredProvider === 'poe'}
                                onChange={() => setPreferredProvider('poe')}
                                className="w-4 h-4 text-primary cursor-pointer"
                                name="preferredProvider"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                value={poeKey}
                                onChange={(e) => setPoeKey(e.target.value)}
                                placeholder="p-..."
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono transition-all pr-24"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {poeKey ? (
                                    <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-1 rounded-full font-medium border border-green-500/20 uppercase tracking-tighter">Active</span>
                                ) : (
                                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full font-medium uppercase tracking-tighter">Missing</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-2 px-2">
                    <Shield size={12} /> Your keys are stored locally in your browser and never sent to our servers.
                </p>
            </section>

            {/* Subscription Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <CreditCard size={24} className="text-accent" />
                    <h3 className="text-xl font-semibold">Subscription & Support</h3>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Plan Status: {isPaid ? 'Pro' : 'Free'}</h4>
                                {isPaid ? (
                                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-yellow-500/20">
                                        <Crown size={12} /> PRO
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setIsPaid(true)}
                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                    >
                                        <Zap size={12} /> Upgrade to Pro
                                    </button>
                                )}
                            </div>

                            <p className="text-slate-600 dark:text-slate-400">
                                Enjoy higher upload limits and premium AI models. Current limit: <strong>{limitInMB}MB</strong>
                            </p>

                            {isPaid && (
                                <button
                                    onClick={() => setIsPaid(false)}
                                    className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    (Debug) Downgrade to Free
                                </button>
                            )}

                            <div className="space-y-4">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact Support:</p>
                                <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-white dark:border-slate-800 shadow-inner">
                                    <Mail className="text-primary" size={20} />
                                    <a href="mailto:reactcc@atomicmail.io" className="font-semibold text-primary hover:underline">
                                        reactcc@atomicmail.io
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-80 bg-bgSurface border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                <User size={100} />
                            </div>
                            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                                <User size={18} className="text-secondary" />
                                Connected Accounts
                            </div>
                            <div className="space-y-3 relative z-10">
                                {accounts.map(acc => (
                                    <div key={acc} className="text-[10px] py-2 px-3 bg-slate-50 dark:bg-slate-900/80 rounded-lg text-slate-600 dark:text-slate-400 font-mono break-all border border-slate-100 dark:border-slate-800 shadow-sm">
                                        {acc}
                                    </div>
                                ))}
                                <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <span className="flex items-center gap-1 text-slate-400"><Lock size={12} /> Password</span>
                                    <span className="font-bold text-primary">011</span>
                                </div>
                            </div>
                        </div>
                    </div>
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
        </div>
    );
}
