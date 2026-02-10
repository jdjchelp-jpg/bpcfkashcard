import { useState } from 'react';
import { Upload, FileText, Sparkles, MessageSquare, Loader2, Cpu, AlertCircle, Globe, Image as ImageIcon, Download, FileSpreadsheet, FileType } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard } from '@/components/flashcard/Flashcard';
import { useStore, StudySet } from '@/context/StoreContext';
import { generateCompletion } from '@/services/aiService';
import { parseFile } from '@/utils/fileParser';
import { exportToExcel, exportToWord, exportToCSV, exportToPDF, exportToText } from '@/utils/exportUtils';

export function GeneratorView() {
    const {
        openRouterKey, poeKey, preferredProvider, setPreferredProvider,
        openRouterModel, poeModel,
        setFlashcards, setIsGenerating, isGenerating, maxUploadSize,
        studySets, setStudySets, setActiveSetId,
        genInstruction, setGenInstruction,
        genContent, setGenContent,
        genMode, setGenMode,
        genInputMode, setGenInputMode
    } = useStore();

    const [file, setFile] = useState<File | null>(null);
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [generatedPreview, setGeneratedPreview] = useState<any[]>([]);
    const [batchProgress, setBatchProgress] = useState<{ current: number, total: number } | null>(null);

    const handleFileChange = (newFile: File | null) => {
        setError(null);
        if (newFile) {
            if (newFile.size > maxUploadSize) {
                const limitMB = maxUploadSize / (1024 * 1024);
                setError(`File is too large (${(newFile.size / (1024 * 1024)).toFixed(1)}MB). Your current limit is ${limitMB}MB.`);
                setFile(null);
                return;
            }
            setFile(newFile);
        }
    };

    const handleCreate = async () => {
        const apiKey = preferredProvider === 'openrouter' ? openRouterKey : poeKey;
        const model = preferredProvider === 'openrouter' ? openRouterModel : poeModel;

        if (!apiKey) {
            setError(`Please set your ${preferredProvider === 'openrouter' ? 'OpenRouter' : 'Poe'} API Key in Settings first.`);
            return;
        }

        setIsGenerating(true);
        setError(null);
        setGeneratedPreview([]);

        try {
            let sourceText = genContent;
            if (genInputMode === 'file' && file) {
                sourceText = await parseFile(file);
            } else if (genInputMode === 'website' && websiteUrl) {
                sourceText = `Content from website: ${websiteUrl}. (In a real app, we would fetch and scrape this URL).`;
            } else if (genInputMode === 'image' && imageFile) {
                sourceText = `Content from image: ${imageFile.name}. (In a real app, we would use Vision AI to extract text).`;
            }

            if (!sourceText && !genInstruction) {
                throw new Error("Please provide some content or instructions.");
            }

            const response = await generateCompletion({
                instruction: genInstruction,
                content: sourceText,
                provider: preferredProvider,
                model,
                apiKey,
                mode: genMode as any,
                onProgress: (current, total) => setBatchProgress({ current, total })
            });

            if (genMode === 'interactive_exam') {
                // Special handling for HTML exams
                const subjects = response.subjects;
                if (!subjects || !Array.isArray(subjects)) {
                    throw new Error("Invalid exam data format from AI");
                }

                const title = genInstruction.slice(0, 30) || (file ? file.name : genContent.slice(0, 30)) || `New Exam`;
                // Dynamically import to avoid circular dependency issues if any, or just ensure import is at top
                const { generateCBTHTML } = await import('@/utils/cbtTemplate');
                const htmlContent = generateCBTHTML(title, subjects);

                const newSet: StudySet = {
                    id: crypto.randomUUID(),
                    title: title,
                    items: [{
                        id: crypto.randomUUID(),
                        front: `Interactive Exam: ${title}`,
                        back: htmlContent,
                        type: 'interactive_exam'
                    }],
                    createdAt: Date.now()
                };

                setStudySets([...studySets, newSet]);
                setActiveSetId(newSet.id);
                setFlashcards(newSet.items);
                setGeneratedPreview(newSet.items);

            } else if (genMode === 'interactive_worksheet') {
                // Special handling for HTML worksheets
                const questions = response.questions;
                if (!questions || !Array.isArray(questions)) {
                    throw new Error("Invalid worksheet data format from AI");
                }

                const title = response.title || genInstruction.slice(0, 30) || `New Worksheet`;
                const { generateWorksheetHTML } = await import('@/utils/worksheetTemplate');
                const htmlContent = generateWorksheetHTML(title, questions);

                const newSet: StudySet = {
                    id: crypto.randomUUID(),
                    title: title,
                    items: [{
                        id: crypto.randomUUID(),
                        front: `Worksheet: ${title}`,
                        back: htmlContent,
                        type: 'interactive_worksheet'
                    }],
                    createdAt: Date.now()
                };

                setStudySets([...studySets, newSet]);
                setActiveSetId(newSet.id);
                setFlashcards(newSet.items);
                setGeneratedPreview(newSet.items);

            } else if (response && Array.isArray(response)) {
                // Standard Flashcards / Worksheet handling
                const itemsWithIds = response.map((item: any) => ({
                    ...item,
                    id: crypto.randomUUID(),
                    type: genMode
                }));

                // Create a new Study Set
                const newSet: StudySet = {
                    id: crypto.randomUUID(),
                    title: genInstruction.slice(0, 30) || (file ? file.name : genContent.slice(0, 30)) || `New ${genMode}`,
                    items: itemsWithIds,
                    createdAt: Date.now()
                };

                setStudySets([...studySets, newSet]);
                setActiveSetId(newSet.id);
                setFlashcards(itemsWithIds);
                setGeneratedPreview(itemsWithIds);
            } else {
                throw new Error("Invalid response format from AI");
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to generate content.");
        } finally {
            setIsGenerating(false);
            setBatchProgress(null);
        }
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileChange(droppedFile);
    };

    const currentModelName = preferredProvider === 'openrouter'
        ? openRouterModel.split('/').pop()?.split(':')[0]?.replace(/-/g, ' ') || openRouterModel
        : poeModel.replace(/-/g, ' ');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Column: Inputs */}
            <div className="space-y-6 flex flex-col h-full w-full">

                {/* Provider Selector */}
                <div className="glass flex p-1.5 rounded-2xl w-fit relative z-20 shadow-xl overflow-hidden group/provider">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover/provider:opacity-100 transition-opacity" />
                    <button
                        onClick={() => setPreferredProvider('openrouter')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all relative z-10 uppercase tracking-widest ${preferredProvider === 'openrouter' ? 'bg-white dark:bg-white/10 text-primary shadow-lg ring-1 ring-white/20' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Cpu size={14} className={preferredProvider === 'openrouter' ? 'animate-pulse' : ''} /> OpenRouter
                    </button>
                    <button
                        onClick={() => setPreferredProvider('poe')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all relative z-10 uppercase tracking-widest ${preferredProvider === 'poe' ? 'bg-white dark:bg-white/10 text-primary shadow-lg ring-1 ring-white/20' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Cpu size={14} className={preferredProvider === 'poe' ? 'animate-pulse' : ''} /> Poe
                    </button>
                    <div className="ml-6 flex items-center gap-2 px-4 py-2 bg-slate-900/5 dark:bg-white/5 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] relative z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active: {currentModelName}
                    </div>
                </div>

                {/* Instruction Box */}
                <div className="glass rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="flex items-center gap-2 mb-4 text-primary relative z-10">
                        <MessageSquare size={18} />
                        <span className="font-black text-xs uppercase tracking-[0.2em]">Instructions</span>
                    </div>
                    <textarea
                        value={genInstruction}
                        onChange={(e) => setGenInstruction(e.target.value)}
                        placeholder="e.g. 'Create 10 definition cards', 'Summarize key points', 'Make Q&A for exam prep'"
                        className="w-full bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-primary/20 resize-none h-32 transition-all relative z-10 font-medium"
                    />
                </div>

                {/* Content Input Box */}
                <div className="glass rounded-3xl p-6 shadow-2xl flex-1 flex flex-col min-h-[400px] relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-2 text-secondary">
                            <FileText size={18} />
                            <span className="font-black text-xs uppercase tracking-[0.2em]">Source Material</span>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-950/50 rounded-xl p-1 border border-slate-200 dark:border-white/5 shadow-inner">
                            {(['text', 'file', 'website', 'image'] as const).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setGenInputMode(m)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest ${genInputMode === m ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-400'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 relative h-full">
                        <AnimatePresence mode="wait">
                            {genInputMode === 'text' && (
                                <motion.textarea
                                    key="text-input"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    value={genContent}
                                    onChange={(e) => setGenContent(e.target.value)}
                                    placeholder="Paste your notes, article, or raw text here..."
                                    className="w-full h-full min-h-[200px] bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                                />
                            )}
                            {genInputMode === 'file' && (
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
                                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
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
                                            <p className="text-sm mt-2 text-slate-500 max-w-xs text-center">Max size: {maxUploadSize / (1024 * 1024)}MB</p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                            {genInputMode === 'website' && (
                                <motion.div
                                    key="website-input"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 gap-4"
                                >
                                    <Globe size={48} className="text-secondary opacity-50" />
                                    <input
                                        type="url"
                                        value={websiteUrl}
                                        onChange={(e) => setWebsiteUrl(e.target.value)}
                                        placeholder="https://example.com/article"
                                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                                    />
                                    <p className="text-xs text-slate-500 text-center">Enter a URL to summarize and extract study material from.</p>
                                </motion.div>
                            )}
                            {genInputMode === 'image' && (
                                <motion.div
                                    key="image-input"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="w-full h-full min-h-[200px] border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-secondary/50 bg-slate-50 dark:bg-slate-950/30 rounded-xl flex flex-col items-center justify-center text-slate-400 transition-colors cursor-pointer relative group"
                                >
                                    <input
                                        type="file"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                    {imageFile ? (
                                        <div className="flex flex-col items-center gap-2 p-4 text-slate-900 dark:text-slate-200">
                                            <ImageIcon size={48} className="text-secondary" />
                                            <span className="font-medium text-lg">{imageFile.name}</span>
                                            <button
                                                onClick={(e) => { e.preventDefault(); setImageFile(null); }}
                                                className="mt-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 text-xs font-bold uppercase tracking-wide z-10"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <ImageIcon size={32} className="text-secondary" />
                                            </div>
                                            <p className="font-medium text-lg text-slate-700 dark:text-slate-300">Upload Image / Photo of Notes</p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Generation Mode Selector */}
                <div className="glass rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="flex items-center gap-2 mb-4 text-accent relative z-10">
                        <Sparkles size={18} />
                        <span className="font-black text-xs uppercase tracking-[0.2em]">Generation Mode</span>
                    </div>
                    <div className="flex flex-wrap bg-slate-100 dark:bg-slate-950/50 rounded-xl p-1 border border-slate-200 dark:border-white/5 shadow-inner relative z-10 gap-1">
                        {/* Modes that return a single Object (harder to batch, processed as single chunk for now) */}
                        {/* const isObjectMode = ['interactive_worksheet', 'interactive_exam'].includes(mode); */}
                        {(['flashcards', 'worksheet', 'exam', 'interactive_worksheet', 'interactive_exam'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => setGenMode(m)}
                                className={`flex-1 min-w-[120px] py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest ${genMode === m ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-400'}`}
                            >
                                {m.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <div className="space-y-2">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center justify-center gap-2">
                            <AlertCircle size={16} />
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
                                <span>
                                    {batchProgress
                                        ? `Generating Part ${batchProgress.current}/${batchProgress.total}...`
                                        : "Generating Magic..."}
                                </span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="group-hover:animate-spin-slow" />
                                <span>Generate {genMode.replace('_', ' ')}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Right Column: Preview / Output */}
            <div className="glass rounded-3xl p-10 flex items-center justify-center relative overflow-hidden shadow-2xl flex-col h-full min-h-[500px]">
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
                        <div className="mt-8 text-center bg-slate-100 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/5 backdrop-blur-md w-full">
                            <p className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center justify-center gap-2 mb-3">
                                <Sparkles size={14} /> {generatedPreview.length} Items Generated!
                            </p>

                            <div className="flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => exportToExcel(generatedPreview, `export-${Date.now()}.xlsx`)}
                                    className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-green-500/20"
                                >
                                    <FileSpreadsheet size={14} /> Excel
                                </button>
                                <button
                                    onClick={() => exportToWord(generatedPreview, `export-${Date.now()}.docx`)}
                                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-500/20"
                                >
                                    <FileText size={14} /> Word
                                </button>
                                <button
                                    onClick={() => exportToCSV(generatedPreview, `export-${Date.now()}.csv`)}
                                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-amber-500/20"
                                >
                                    <FileType size={14} /> CSV
                                </button>
                                <button
                                    onClick={() => exportToPDF(generatedPreview, `export-${Date.now()}.pdf`, genMode)}
                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-red-500/20"
                                >
                                    <Download size={14} /> PDF
                                </button>
                                <button
                                    onClick={() => exportToText(generatedPreview, `export-${Date.now()}.txt`)}
                                    className="px-3 py-1.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-500/20"
                                >
                                    <FileText size={14} /> Text
                                </button>
                            </div>
                            <p className="text-slate-500 text-[10px] mt-3">All items also saved to your Library</p>
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
