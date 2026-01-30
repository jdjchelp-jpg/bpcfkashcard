import { useState } from 'react';
import { Youtube, Upload, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function VideoView() {
    const [videoUrl, setVideoUrl] = useState('');
    const [activeMode, setActiveMode] = useState<'url' | 'upload'>('url');

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Video to Flashcards</h2>
                <p className="text-slate-400 mt-2">Extract key concepts from YouTube videos or uploads.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mode Selection Cards */}
                <button
                    onClick={() => setActiveMode('url')}
                    className={`p-6 rounded-2xl border transition-all text-left group relative overflow-hidden ${activeMode === 'url' ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'bg-slate-900/50 border-white/10 hover:bg-white/5'}`}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Youtube size={100} />
                    </div>
                    <div className="relative z-10">
                        <Youtube size={32} className="text-red-500 mb-4" />
                        <h3 className="text-xl font-bold text-slate-100">YouTube Link</h3>
                        <p className="text-slate-400 mt-2 text-sm">Paste a URL to automatically extract chapters and concepts.</p>
                    </div>
                </button>

                <button
                    onClick={() => setActiveMode('upload')}
                    className={`p-6 rounded-2xl border transition-all text-left group relative overflow-hidden ${activeMode === 'upload' ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'bg-slate-900/50 border-white/10 hover:bg-white/5'}`}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Upload size={100} />
                    </div>
                    <div className="relative z-10">
                        <Film size={32} className="text-blue-500 mb-4" />
                        <h3 className="text-xl font-bold text-slate-100">Upload Video</h3>
                        <p className="text-slate-400 mt-2 text-sm">Upload a local video file (MP4, WEBM) to process.</p>
                    </div>
                </button>
            </div>

            {/* Input Area */}
            <motion.div
                layout
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg"
            >
                <AnimatePresence mode="wait">
                    {activeMode === 'url' ? (
                        <motion.div
                            key="url"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <label className="block text-sm font-medium text-slate-300">YouTube URL</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                />
                                <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all">
                                    Process
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="border-2 border-dashed border-slate-700 bg-slate-950/30 rounded-xl h-48 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500/50 transition-colors cursor-pointer"
                        >
                            <Upload size={32} className="mb-4 text-blue-500" />
                            <p className="font-medium text-slate-300">Drag & drop video here</p>
                            <p className="text-sm mt-1 text-slate-500">Max size: 500MB</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
