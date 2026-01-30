import { useState } from 'react';
import { Youtube, Upload, Film, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/context/StoreContext';

export function VideoView() {
    const { maxUploadSize } = useStore();
    const [videoUrl, setVideoUrl] = useState('');
    const [activeMode, setActiveMode] = useState<'url' | 'upload'>('url');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (newFile: File | null) => {
        setError(null);
        if (newFile) {
            if (newFile.size > maxUploadSize) {
                const limitMB = maxUploadSize / (1024 * 1024);
                setError(`File is too large. Your current limit is ${limitMB}MB. Please upgrade to Pro for higher limits.`);
                setFile(null);
                return;
            }
            setFile(newFile);
        }
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileChange(droppedFile);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Video to Flashcards</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Extract key concepts from YouTube videos or uploads.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mode Selection Cards */}
                <button
                    onClick={() => setActiveMode('url')}
                    className={`p-6 rounded-2xl border transition-all text-left group relative overflow-hidden ${activeMode === 'url' ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'bg-bgSurface dark:bg-slate-900/50 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 shadow-sm'}`}
                >
                    <div className="flex items-center gap-4 mb-3">
                        <div className={`p-3 rounded-xl transition-colors ${activeMode === 'url' ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                            <Youtube size={24} />
                        </div>
                        <div>
                            <h3 className={`font-bold ${activeMode === 'url' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>YouTube URL</h3>
                            <p className="text-xs text-slate-400">Import from any public video</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setActiveMode('upload')}
                    className={`p-6 rounded-2xl border transition-all text-left group relative overflow-hidden ${activeMode === 'upload' ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'bg-bgSurface dark:bg-slate-900/50 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 shadow-sm'}`}
                >
                    <div className="flex items-center gap-4 mb-3">
                        <div className={`p-3 rounded-xl transition-colors ${activeMode === 'upload' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                            <Film size={24} />
                        </div>
                        <div>
                            <h3 className={`font-bold ${activeMode === 'upload' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Local Upload</h3>
                            <p className="text-xs text-slate-400">MP4, WebM, MKV supported</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Input Area */}
            <motion.div
                layout
                className="bg-bgSurface dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl"
            >
                <AnimatePresence mode="wait">
                    {activeMode === 'url' ? (
                        <motion.div
                            key="url-mode"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-4"
                        >
                            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-300">Enter Video Link</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="flex-1 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium"
                                />
                                <button className="px-6 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all">Extract</button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload-mode"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-6"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                        >
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500/50 rounded-2xl p-12 flex flex-col items-center justify-center transition-all bg-slate-50 dark:bg-slate-950/30 relative">
                                <input
                                    type="file"
                                    accept="video/mp4,video/webm,video/x-matroska,.mkv"
                                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {file ? (
                                    <div className="text-center space-y-3">
                                        <Film size={48} className="text-blue-500 mx-auto" />
                                        <h4 className="font-bold text-slate-900 dark:text-white">{file.name}</h4>
                                        <p className="text-sm text-slate-400">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                                        <button
                                            onClick={() => setFile(null)}
                                            className="text-xs font-bold text-red-500 uppercase hover:underline"
                                        >
                                            Remove file
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={48} className="text-blue-500 mb-4 opacity-50" />
                                        <h4 className="font-bold text-slate-900 dark:text-white">Upload Video File</h4>
                                        <p className="text-sm text-slate-400 mt-2">MP4, WebM, MKV up to {maxUploadSize / (1024 * 1024)}MB</p>
                                    </>
                                )}
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            {file && !error && (
                                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all">
                                    Analyze Video
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
