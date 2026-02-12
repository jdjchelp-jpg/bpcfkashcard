import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { themes } from '@/utils/themes';
import { CreditCard, Key, Palette, Shield, Mail, Crown, Zap, Cpu } from 'lucide-react';

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
        { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Hermes 3 Llama 3.1 405B' },
        { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B Instruct' },
        { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B Instruct' },
        { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B IT' },
        { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1 24B' },
        { id: 'tngtech/deepseek-r1t-chimera:free', name: 'DeepSeek R1T Chimera' },
        { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1' },
        { id: 'tngtech/deepseek-r1t2-chimera:free', name: 'DeepSeek R1T2 Chimera' },
        { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder' },
        { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air' },
        { id: 'openai/gpt-oss-20b:free', name: 'GPT OSS 20B' },
        { id: 'nvidia/nemotron-nano-9b-v2:free', name: 'Nemotron Nano 9B' },
        { id: 'qwen/qwen3-next-80b-a3b-instruct:free', name: 'Qwen 3 Next 80B' },
        { id: 'nvidia/nemotron-nano-12b-v2-vl:free', name: 'Nemotron Nano 12B' },
        { id: 'tngtech/tng-r1t-chimera:free', name: 'TNG R1T Chimera' },
        { id: 'arcee-ai/trinity-mini:free', name: 'Trinity Mini' },
        { id: 'nvidia/nemotron-3-nano-30b-a3b:free', name: 'Nemotron 3 Nano 30B' },
        { id: 'upstage/solar-pro-3:free', name: 'Solar Pro 3 (Legacy)' },
        { id: 'arcee-ai/trinity-large-preview:free', name: 'Trinity Large Preview' },
        { id: 'stepfun/step-3.5-flash:free', name: 'Step 3.5 Flash' }
    ];

    const poeModels = [
        { id: 'grok-4-fast-reasoning', name: 'Grok 4 Fast Reasoning' },
        { id: 'gemini-3-flash', name: 'Gemini 3 Flash' },
        { id: 'claude-sonnet-4', name: 'Claude Sonnet 4' },
        { id: 'kimi-k2.5', name: 'Kimi K2.5' }
    ];

    const SOLAR_CUTOFF = new Date('2026-03-02').getTime();
    const isSolarDiscontinued = Date.now() >= SOLAR_CUTOFF;

    const filteredOrModels = orModels.filter(m =>
        !(isSolarDiscontinued && m.id === 'upstage/solar-pro-3:free')
    );

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
                                    {filteredOrModels.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

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
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
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
                    <h3 className="text-xl font-semibold">Pro Membership</h3>
                </div>

                <div className="glass rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="relative z-10 max-w-2xl space-y-8">
                        <div className="space-y-4">
                            {isPaid ? (
                                <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-yellow-500/20 w-fit transform hover:scale-105 transition-transform cursor-default">
                                    <Crown size={28} className="animate-pulse" />
                                    <span className="text-xl uppercase tracking-tighter">Pro Access Unlocked</span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-bold text-slate-900 dark:text-white leading-none">Upgrade Your Experience</h4>
                                        <p className="text-slate-500 dark:text-slate-400">Unlock premium AI models and extended storage limits.</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
                                        <div className="flex items-center gap-3 flex-1 px-4 w-full">
                                            <Key size={18} className="text-slate-400" />
                                            <input
                                                type="text"
                                                value={upgradeCode}
                                                onChange={(e) => setUpgradeCode(e.target.value)}
                                                placeholder="Enter your activation code"
                                                className={`flex-1 bg-transparent py-3 text-lg focus:outline-none font-bold placeholder:font-medium placeholder:text-slate-400 transition-colors ${codeError ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}
                                            />
                                        </div>
                                        <button
                                            onClick={handleUpgrade}
                                            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/30 active:scale-95"
                                        >
                                            <Zap size={20} fill="currentColor" /> ACTIVATE
                                        </button>
                                    </div>
                                    {codeError && <p className="text-sm font-black text-red-500 uppercase tracking-[0.2em] ml-4 animate-bounce">Access Denied: Invalid Code</p>}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <p className="text-slate-700 dark:text-slate-200 text-lg">
                                Enjoy higher upload limits and premium AI models.
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-slate-400 uppercase text-xs font-black tracking-widest">Active Storage Limit</span>
                                <span className="text-2xl font-black text-primary">{limitInMB}MB</span>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-8 items-center">
                            <div className="flex-1 min-w-[200px] space-y-4">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Contact Support:</p>
                                <a href="mailto:reactcc@atomicmail.io" className="flex items-center gap-3 p-4 glass rounded-2xl hover:border-primary/50 transition-colors group/mail w-fit">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/mail:bg-primary group-hover/mail:text-white transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white text-lg">reactcc@atomicmail.io</span>
                                </a>
                            </div>

                            <div className="w-32 h-32 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700">
                                <Shield size={128} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Appearance Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Palette size={24} className="text-secondary" />
                    <h3 className="text-xl font-semibold">Background & Themes</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {themes.map((theme) => {
                        const isActive = currentTheme.id === theme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => setTheme(theme.id)}
                                className={`
                            relative group p-5 rounded-2xl border transition-all duration-500 flex flex-col gap-4 text-left overflow-hidden
                            ${isActive
                                        ? 'border-primary ring-4 ring-primary/10 bg-primary/5'
                                        : 'border-slate-200 dark:border-white/10 bg-bgSurface dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl'
                                    }
                        `}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className={`font-black text-sm uppercase tracking-tighter ${isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {theme.name}
                                    </span>
                                    {isActive && <div className="w-2 h-2 rounded-full bg-primary animate-ping" />}
                                </div>

                                <div className="flex gap-2 h-4 w-full rounded-lg overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                                    <div className="h-full flex-1" style={{ backgroundColor: theme.colors.primary }} />
                                    <div className="h-full flex-1" style={{ backgroundColor: theme.colors.secondary }} />
                                    <div className="h-full flex-1" style={{ backgroundColor: theme.colors.accent }} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
