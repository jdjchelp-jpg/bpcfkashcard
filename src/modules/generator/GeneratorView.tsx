import { useState } from 'react';
import { Upload, FileText, Sparkles, MessageSquare, Loader2, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard } from '@/components/flashcard/Flashcard';
import { useStore } from '@/context/StoreContext';
import { generateCompletion } from '@/services/aiService';
import { parseFile } from '@/utils/fileParser';

export function GeneratorView() {
    const {
        openRouterKey, poeKey, preferredProvider, setPreferredProvider,
        setFlashcards, setIsGenerating, isGenerating
    } = useStore();

    const [instruction, setInstruction] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [activeInputMode, setActiveInputMode] = useState<'text' | 'file'>('text');
    const [error, setError] = useState<string | null>(null);
    const [generatedPreview, setGeneratedPreview] = useState<any[]>([]);

    const handleCreate = async () => {
        const apiKey = preferredProvider === 'openrouter' ? openRouterKey : poeKey;

        if (!apiKey) {
            setError(`Please set your ${preferredProvider === 'openrouter' ? 'OpenRouter' : 'Poe'} API Key in Settings first.`);
            return;
        }

        setIsGenerating(true);
        setError(null);
        setGeneratedPreview([]);

        try {
            let sourceText = content;
            if (activeInputMode === 'file' && file) {
                sourceText = await parseFile(file);
            }

            if (!sourceText && !instruction) {
                throw new Error("Please provide some content or instructions.");
            }

            const response = await generateCompletion({
                instruction,
                content: sourceText.slice(0, 15000),
                provider: preferredProvider,
                apiKey
            });

            if (response && Array.isArray(response)) {
                const cardsWithIds = response.map((card: any) => ({
                    ...card,
                    id: crypto.randomUUID(),
                }));

                setFlashcards(cardsWithIds);
                setGeneratedPreview(cardsWithIds);
            } else {
                throw new Error("Invalid response format from AI");
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to generate flashcards.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Column: Inputs */}
            <div className="space-y-6 flex flex-col h-full w-full">

                {/* Provider Selector */}
                <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-white/10 w-fit">
                    <button
                        onClick={() => setPreferredProvider('openrouter')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${preferredProvider === 'openrouter' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Cpu size={14} /> OpenRouter
                    </button>
                    <button
                        onClick={() => setPreferredProvider('poe')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${preferredProvider === 'poe' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Cpu size={14} /> Poe
                    </button>
                </div>

                {/* Instruction Box */}
                <div className="bg-bgSurface dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-3 text-primary">
                        <MessageSquare size={18} />
                        <span className="font-semibold text-sm uppercase tracking-wider">Instructions</span>
                    </div>
                    <textarea
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="e.g. 'Create 10 definition cards', 'Summarize key points', 'Make Q&A for exam prep'"
                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-32 transition-all"
                    />
                </div>

                {/* Content Input Box */}
                <div className="bg-bgSurface dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-lg flex-1 flex flex-col min-h-[300px]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-secondary">
                            <FileText size={18} />
                            <span className="font-semibold text-sm uppercase tracking-wider">Source Material</span>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-950/50 rounded-lg p-1 border border-slate-200 dark:border-white/5">
                            <button
                                onClick={() => setActiveInputMode('text')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeInputMode === 'text' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}
                            >
                                Text
                            </button>
                            <button
                                onClick={() => setActiveInputMode('file')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeInputMode === 'file' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}
                            >
                                File
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative h-full">
                        <AnimatePresence mode="wait">
                            {activeInputMode === 'text' ? (
                                <motion.textarea
                                    key="text-input"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Paste your notes, article, or raw text here..."
                                    className="w-full h-full min-h-[200px] bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                                />
                            ) : (
                                <motion.div
                                    key="file-input"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleFileDrop}
                                    className="w-full h-full min-h-[200px] border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-secondary/50 bg-slate-50 dark:bg-slate-950/30 rounded-xl flex flex-col items-center justify-center text-slate-400 transition-colors cursor-pointer relative group"
                                >
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".txt,.md,.pdf,.docx"
                                    />
                                    {file ? (
                                        <div className="flex flex-col items-center gap-2 p-4 text-slate-900 dark:text-slate-200">
                                            <FileText size={48} className="text-secondary" />
                                            <span className="font-medium text-lg">{file.name}</span>
                                            <span className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                                            <button
                                                onClick={(e) => { e.preventDefault(); setFile(null); }}
                                                className="mt-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 text-xs font-bold uppercase tracking-wide z-10"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <Upload size={32} className="text-secondary" />
                                            </div>
                                            <p className="font-medium text-lg text-slate-700 dark:text-slate-300">Click to upload or drag & drop</p>
                                            <p className="text-sm mt-2 text-slate-500 max-w-xs text-center">Supported: .txt, .md, .pdf, .docx</p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="space-y-2">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center animate-pulse">
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleCreate}
                        disabled={isGenerating}
                        className="w-full py-4 bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="animate-spin" />
                                <span>Generating Magic...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="group-hover:animate-spin-slow" />
                                <span>Generate Flashcards</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Right Column: Preview / Output */}
            <div className="bg-bgSurface dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden shadow-2xl flex-col h-full min-h-[500px]">
                <div className="absolute inset-0 bg-grid-slate-900/[0.02] dark:bg-grid-white/[0.02] bg-[length:32px_32px]" />

                {generatedPreview.length > 0 ? (
                    <div className="w-full max-w-md relative z-10 scale-90 lg:scale-100 transition-transform h-full flex flex-col">
                        <h3 className="text-center text-slate-400 mb-4 font-medium uppercase tracking-widest text-xs">Previewing 1 of {generatedPreview.length}</h3>
                        <div className="flex-1 flex items-center justify-center">
                            <Flashcard
                                front={generatedPreview[0].front}
                                back={generatedPreview[0].back}
                            />
                        </div>
                        <div className="mt-8 text-center bg-slate-100 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/5 backdrop-blur-md">
                            <p className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center justify-center gap-2">
                                <Sparkles size={14} /> Success!
                            </p>
                            <p className="text-slate-500 text-xs mt-1">Go to Library to view all cards</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md relative z-10 scale-90 lg:scale-100 transition-transform">
                        <Flashcard
                            front="What is the powerhouse of the cell?"
                            back="The **Mitochondria**.\n\nIt generates most of the chemical energy needed to power the cell's biochemical reactions."
                        />
                        <div className="mt-8 text-center bg-slate-100 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/5 backdrop-blur-md">
                            <p className="text-slate-400 text-sm font-medium">✨ Preview Mode</p>
                            <p className="text-slate-500 text-xs mt-1">Fill inputs to create your own!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
