import { useState } from 'react';
import { motion } from 'framer-motion';

import ReactMarkdown from 'react-markdown';

interface FlashcardProps {
    front: string;
    back: string;
    isFlipped?: boolean;
}

export function Flashcard({ front, back }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleFlip = () => {
        if (!isAnimating) {
            setIsFlipped(!isFlipped);
            setIsAnimating(true);
        }
    };

    return (
        <div
            className="w-full h-80 perspective-1000 cursor-pointer group"
            onClick={handleFlip}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-transform duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                onAnimationComplete={() => setIsAnimating(false)}
                transition={{ duration: 0.6, ease: "backOut" }}
            >
                {/* Front Face */}
                <div className="absolute inset-0 backface-hidden w-full h-full">
                    <div className="w-full h-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-8 flex items-center justify-center text-center shadow-xl shadow-blue-900/5 group-hover:border-blue-500/30 transition-colors bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                        <div className="absolute top-6 left-6 text-xs font-bold text-slate-400 tracking-widest uppercase">Question</div>
                        <div className="text-2xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed max-w-prose prose prose-slate dark:prose-invert">
                            <ReactMarkdown>{front.replace(/\\n/g, '\n')}</ReactMarkdown>
                        </div>
                        <div className="absolute bottom-6 text-slate-400 text-sm opacity-50">Click to flip</div>
                    </div>
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 backface-hidden w-full h-full"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <div className="w-full h-full bg-blue-600/10 dark:bg-blue-900/20 border-2 border-blue-500/20 rounded-3xl p-8 flex items-center justify-center text-center shadow-xl backdrop-blur-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                        <div className="absolute top-6 left-6 text-xs font-bold text-blue-400 tracking-widest uppercase">Answer</div>
                        <div className="text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-prose overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent pr-2 prose prose-slate dark:prose-invert">
                            <ReactMarkdown>{back.replace(/\\n/g, '\n')}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
