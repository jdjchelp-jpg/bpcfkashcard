import { useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { Printer, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { motion } from 'framer-motion';

interface PrintViewModalProps {
    onClose: () => void;
}

export function PrintViewModal({ onClose }: PrintViewModalProps) {
    const { flashcards, studySets, activeSetId } = useStore();
    const componentRef = useRef<HTMLDivElement>(null);

    const activeSet = studySets.find(s => s.id === activeSetId);
    const title = activeSet?.title || 'Study Set';
    const firstType = flashcards[0]?.type || 'flashcards';

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `${title}-${firstType}`,
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Printer size={20} /> Print Preview
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2"
                        >
                            <Printer size={16} /> Print Now
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-8 bg-slate-500/10">
                    <div
                        ref={componentRef}
                        className="bg-white p-12 max-w-3xl mx-auto shadow-xl min-h-full print:shadow-none print:p-0 print:max-w-none"
                    >
                        <div className="mb-10 pb-6 border-b-2 border-slate-900">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-black mb-1">Generated Study Material</p>
                                    <h1 className="text-4xl font-extrabold text-slate-900 leading-none">
                                        {title}
                                    </h1>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                                        {firstType}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {flashcards.map((card, idx) => (
                                <div key={card.id} className="break-inside-avoid">
                                    <div className="flex items-start gap-4">
                                        <span className="bg-slate-900 text-white font-black px-3 py-1.5 rounded-lg text-sm">
                                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                        </span>
                                        <div className="space-y-4 w-full">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                                                    {firstType === 'flashcards' ? 'Question' : 'Problem / Question'}
                                                </p>
                                                <p className="text-xl font-bold text-slate-900 leading-snug">{card.front}</p>
                                            </div>

                                            {/* For worksheets, we might want to add space to write if we wanted a "Question Only" version,
                                                but for now we'll show both for study purposes. */}

                                            <div className="pl-4 border-l-4 border-slate-100 py-1">
                                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                                                    {firstType === 'exam' ? 'Answer Key / Explantion' : 'Answer / Explanation'}
                                                </p>
                                                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-base italic">{card.back}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {idx < flashcards.length - 1 && <div className="h-px bg-slate-100 w-full mt-8" />}
                                </div>
                            ))}
                        </div>

                        <div className="mt-20 pt-8 border-t border-slate-100 text-center">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                                Created with Flash.AI • {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
