import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { themes } from '@/utils/themes';
import { Check, CreditCard, Key, Palette, Shield, Mail, Crown, Zap, Cpu, Unlock } from 'lucide-react';

export function SettingsView() {
    const {
        openRouterKey, setOpenRouterKey,
        poeKey, setPoeKey,
        preferredProvider, setPreferredProvider,
        openRouterModel, setOpenRouterModel,
        poeModel, setPoeModel,
        currentTheme, setTheme,
        isPaid, setIsPaid, maxUploadSize
    } = useStore();

    const [upgradeCode, setUpgradeCode] = useState('');
    const [codeError, setCodeError] = useState(false);

    const handleUpgrade = () => {
        if (upgradeCode === '2121') {
            setIsPaid(true);
            setUpgradeCode('');
            setCodeError(false);
        } else {
            setCodeError(true);
            setTimeout(() => setCodeError(false), 2000);
        }
    };

    const orModels = [
        { id: 'nvidia/nemotron-nano-12b-v2-vl:free', name: 'Nemotron Nano 12B (Video/Text)' },
        { id: 'arcee-ai/trinity-large-preview:free', name: 'Trinity Large Preview' },
        { id: 'upstage/solar-pro-3:free', name: 'Solar Pro 3' },
        { id: 'nvidia/nemotron-3-nano-30b-a3b:free', name: 'Nemotron 3 Nano 30B' },
        { id: 'arcee-ai/trinity-mini:free', name: 'Trinity Mini' },
        { id: 'qwen/qwen3-next-80b-a3b-instruct:free', name: 'Qwen 3 Next 80B' },
        { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder' }
    ];

    const poeModels = [
        { id: 'grok-4-fast-reasoning', name: 'Grok 4 Fast Reasoning' }
    ];

    const limitInMB = maxUploadSize / (1024 * 1024);

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <header>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your AI keys, preferences, and themes.</p>
            </header>

            {/* AI Configuration Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Key size={24} className="text-primary" />
                    <h3 className="text-xl font-semibold">AI Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* OpenRouter Config */}
                    <div className={`bg-bgSurface border rounded-2xl p-6 shadow-sm transition-all flex flex-col gap-4 ${preferredProvider === 'openrouter' ? 'border-primary ring-1 ring-primary/20' : 'border-slate-200 dark:border-slate-700/50'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Cpu size={18} className="text-primary" />
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">OpenRouter</label>
                            </div>
                            <input
                                type="radio"
                                checked={preferredProvider === 'openrouter'}
                                onChange={() => setPreferredProvider('openrouter')}
                                className="w-4 h-4 text-primary cursor-pointer"
                                name="preferredProvider"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="password"
                                    value={openRouterKey}
                                    onChange={(e) => setOpenRouterKey(e.target.value)}
                                    placeholder="sk-or-..."
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono transition-all pr-20"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {openRouterKey ? (
                                        <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Active</span>
                                    ) : (
                                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Missing</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Selected Model</label>
                                <select
                                    value={openRouterModel}
                                    onChange={(e) => setOpenRouterModel(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                                >
                                    {orModels.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Poe Config */}
                    <div className={`bg-bgSurface border rounded-2xl p-6 shadow-sm transition-all flex flex-col gap-4 ${preferredProvider === 'poe' ? 'border-primary ring-1 ring-primary/20' : 'border-slate-200 dark:border-slate-700/50'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Cpu size={18} className="text-secondary" />
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Poe</label>
                            </div>
                            <input
                                type="radio"
                                checked={preferredProvider === 'poe'}
                                onChange={() => setPreferredProvider('poe')}
                                className="w-4 h-4 text-primary cursor-pointer"
                                name="preferredProvider"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="password"
                                    value={poeKey}
                                    onChange={(e) => setPoeKey(e.target.value)}
                                    placeholder="p-..."
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono transition-all pr-20"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {poeKey ? (
                                        <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Active</span>
                                    ) : (
                                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Missing</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Selected Model</label>
                                <select
                                    value={poeModel}
                                    onChange={(e) => setPoeModel(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-not-allowed opacity-80"
                                    disabled
                                >
                                    {poeModels.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-2 px-2">
                    <Shield size={12} /> Your credentials are encrypted and stored solely in your local browser sandbox.
                </p>
            </section>

            {/* Subscription Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <CreditCard size={24} className="text-accent" />
                    <h3 className="text-xl font-semibold">Subscription & Support</h3>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8 shadow-sm">
                    <div className="max-w-2xl space-y-8">
                        <div className="space-y-4">
                            {isPaid ? (
                                <div className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-yellow-500/20 w-fit">
                                    <Crown size={24} /> Professional Plan Active
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Upgrade to Pro</h4>
                                    <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-2 rounded-2xl w-full max-w-md shadow-inner">
                                        <input
                                            type="text"
                                            value={upgradeCode}
                                            onChange={(e) => setUpgradeCode(e.target.value)}
                                            placeholder="Enter Access Code"
                                            className={`flex-1 bg-transparent px-4 py-2 text-base focus:outline-none font-bold placeholder:font-medium transition-colors ${codeError ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}
                                        />
                                        <button
                                            onClick={handleUpgrade}
                                            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                                        >
                                            <Zap size={16} /> Upgrade Now
                                        </button>
                                    </div>
                                    {codeError && <p className="text-xs font-bold text-red-500 uppercase tracking-widest ml-4 animate-bounce">Invalid code provided.</p>}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="text-slate-700 dark:text-slate-200 text-lg font-medium">
                                Enjoy higher upload limits and premium AI models.
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">
                                Current storage limit: <strong className="text-primary">{limitInMB}MB</strong>
                            </p>
                        </div>

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Support:</p>
                            <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-white dark:border-slate-800 shadow-sm w-fit">
                                <Mail className="text-primary" size={20} />
                                <a href="mailto:reactcc@atomicmail.io" className="font-bold text-primary hover:underline text-lg">
                                    reactcc@atomicmail.io
                                </a>
                            </div>
                        </div>

                        {isPaid && (
                            <button
                                onClick={() => setIsPaid(false)}
                                className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                            >
                                (Debug) Disable Professional Access
                            </button>
                        )}
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
