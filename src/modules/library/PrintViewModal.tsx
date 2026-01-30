import { useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { Printer, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { motion } from 'framer-motion';

interface PrintViewModalProps {
    onClose: () => void;
}

export function PrintViewModal({ onClose }: PrintViewModalProps) {
    const { flashcards } = useStore();
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Flashcards-Print',
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
                        className="bg-white p-12 max-w-2xl mx-auto shadow-xl min-h-full print:shadow-none print:p-0 print:max-w-none"
                    >
                        <h1 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-900">
                            Flashcards Study Set
                        </h1>

                        <div className="grid grid-cols-1 gap-6">
                            {flashcards.map((card, idx) => (
                                <div key={card.id} className="border-2 border-slate-200 rounded-xl p-6 break-inside-avoid">
                                    <div className="flex items-start gap-4">
                                        <span className="bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded text-xs">
                                            #{idx + 1}
                                        </span>
                                        <div className="space-y-4 w-full">
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Question</p>
                                                <p className="text-lg font-medium text-slate-900">{card.front}</p>
                                            </div>
                                            <div className="h-px bg-slate-100 w-full" />
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Answer</p>
                                                <p className="text-slate-700 whitespace-pre-wrap">{card.back}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
