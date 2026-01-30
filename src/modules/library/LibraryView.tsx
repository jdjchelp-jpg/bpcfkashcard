import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Flashcard } from '@/components/flashcard/Flashcard';
import { BookOpen, Download, Trash2, Pencil, X, Save, Printer, FileText, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToExcel, exportToPDF, exportToWord } from '@/utils/exportUtils';
import { PrintViewModal } from './PrintViewModal';

export function LibraryView() {
    const { flashcards, setFlashcards, currentTheme } = useStore();
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [editFront, setEditFront] = useState('');
    const [editBack, setEditBack] = useState('');
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this card?')) {
            setFlashcards(flashcards.filter(c => c.id !== id));
        }
    };

    const startEditing = (card: { id: string, front: string, back: string }) => {
        setEditingCardId(card.id);
        setEditFront(card.front);
        setEditBack(card.back);
    };

    const saveEdit = () => {
        if (editingCardId) {
            setFlashcards(flashcards.map(c =>
                c.id === editingCardId
                    ? { ...c, front: editFront, back: editBack }
                    : c
            ));
            setEditingCardId(null);
        }
    };

    if (flashcards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="p-6 bg-slate-900/50 rounded-full border border-white/5">
                    <BookOpen size={48} className="text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-300">Library is Empty</h2>
                <p className="text-slate-500 max-w-sm">
                    Generate some cards in the "Create" tab to see them here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 relative">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Your Library</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{flashcards.length} cards in deck</p>
                </div>
                <div className="flex gap-2 relative">
                    <button
                        onClick={() => setShowPrintModal(true)}
                        className="px-4 py-2 bg-bgSurface hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                    >
                        <Printer size={16} /> Print
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
                        >
                            <Download size={16} /> Export
                        </button>

                        <AnimatePresence>
                            {showExportMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20"
                                >
                                    <button onClick={() => exportToExcel(flashcards)} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                        <FileSpreadsheet size={16} className="text-green-500" /> Excel (.xlsx)
                                    </button>
                                    <button onClick={() => exportToPDF(flashcards)} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                        <FileText size={16} className="text-red-500" /> PDF (.pdf)
                                    </button>
                                    <button onClick={() => exportToWord(flashcards)} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                        <FileText size={16} className="text-blue-500" /> Word (.docx)
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcards.map((card) => (
                    <div key={card.id} className="relative group">
                        <div className="scale-90 hover:scale-100 transition-transform duration-300 relative z-0">
                            <Flashcard front={card.front} back={card.back} />
                        </div>

                        {/* Edit/Delete Overlay - Visible on Hover */}
                        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => startEditing(card)}
                                className="p-2 bg-blue-500/20 text-blue-500 rounded-full hover:bg-blue-500/40 backdrop-blur-md"
                                title="Edit"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(card.id)}
                                className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/40 backdrop-blur-md"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingCardId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-bgSurface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Edit Flashcard</h3>
                                <button onClick={() => setEditingCardId(null)} className="text-slate-400 hover:text-slate-500 dark:hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Front (Question)</label>
                                    <textarea
                                        rows={3}
                                        value={editFront}
                                        onChange={(e) => setEditFront(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Back (Answer)</label>
                                    <textarea
                                        rows={5}
                                        value={editBack}
                                        onChange={(e) => setEditBack(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    onClick={() => setEditingCardId(null)}
                                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-500 dark:text-slate-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveEdit}
                                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Print Modal */}
            <AnimatePresence>
                {showPrintModal && (
                    <PrintViewModal onClose={() => setShowPrintModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}
