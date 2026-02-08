import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Flashcard } from '@/components/flashcard/Flashcard';
import { BookOpen, Download, Trash2, Pencil, X, Save, Printer, FileText, FileSpreadsheet, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToExcel, exportToPDF, exportToWord, exportToJSON } from '@/utils/exportUtils';
import { parseJSONImport, parseExcelImport } from '@/utils/importUtils';
import { PrintViewModal } from './PrintViewModal';

export function LibraryView() {
    const { flashcards, setFlashcards, studySets, activeSetId } = useStore();
    const activeSet = studySets.find(s => s.id === activeSetId);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'document'>('grid');
    const [activeExamHtml, setActiveExamHtml] = useState<string | null>(null);
    const [editFront, setEditFront] = useState('');
    const [editBack, setEditBack] = useState('');
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            let importedCards: any[] = [];
            if (file.name.endsWith('.json')) {
                importedCards = await parseJSONImport(file);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
                importedCards = await parseExcelImport(file);
            } else {
                alert('Unsupported file format. Please use JSON, Excel, or CSV.');
                return;
            }

            if (importedCards.length > 0) {
                if (confirm(`Import ${importedCards.length} cards?`)) {
                    setFlashcards([...flashcards, ...importedCards]);
                }
            }
        } catch (err) {
            console.error('Import failed:', err);
            alert('Failed to import cards. Please check the file format.');
        } finally {
            e.target.value = '';
        }
    };

    const handleQuickExportPDF = () => {
        if (!activeSet) return;
        const type = activeSet.items[0]?.type || 'flashcards';
        const filename = `${activeSet.title.replace(/\s+/g, '_')}_${type}.pdf`;
        exportToPDF(flashcards, filename, type);
    };


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
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {activeSet ? activeSet.title : 'Your Library'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        {flashcards.length} items in {activeSet ? 'this set' : 'deck'}
                    </p>
                </div>
                <div className="flex gap-2 relative">
                    {/* View Toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-900/50 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-inner mr-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('document')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'document' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Reader Mode"
                        >
                            <FileText size={18} />
                        </button>
                    </div>

                    <label className="px-4 py-2 bg-bgSurface hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm cursor-pointer">
                        <Download size={16} className="rotate-180" /> Import
                        <input type="file" className="hidden" accept=".json,.xlsx,.xls,.csv" onChange={handleImport} />
                    </label>
                    <button
                        onClick={handleQuickExportPDF}
                        className="px-4 py-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg text-sm font-bold flex items-center gap-2 border border-red-500/20 transition-all shadow-sm"
                    >
                        <Download size={16} /> PDF
                    </button>
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
                                    <button onClick={() => { exportToJSON(flashcards); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                        <FileText size={16} className="text-orange-500" /> JSON (.json)
                                    </button>
                                    <button onClick={() => { exportToExcel(flashcards); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                        <FileSpreadsheet size={16} className="text-green-500" /> Excel (.xlsx)
                                    </button>
                                    <button onClick={() => {
                                        const type = activeSet?.items[0]?.type || 'flashcards';
                                        exportToPDF(flashcards, `export_${type}.pdf`, type);
                                        setShowExportMenu(false);
                                    }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                        <FileText size={16} className="text-red-500" /> PDF (.pdf)
                                    </button>
                                    <button onClick={() => { exportToWord(flashcards); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                        <FileText size={16} className="text-blue-500" /> Word (.docx)
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {viewMode === 'document' ? (
                <div className="max-w-4xl mx-auto space-y-6">
                    {flashcards.map((card, index) => {
                        if (card.type === 'interactive_exam') {
                            return (
                                <div key={card.id} className="glass rounded-2xl p-8 shadow-xl border border-primary/20 bg-primary/5 group relative flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg shadow-primary/30">
                                            <FileSpreadsheet size={24} />
                                        </span>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.front}</h3>
                                            <p className="text-slate-500 dark:text-slate-400">Interactive Assessment</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveExamHtml(card.back)}
                                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all transform hover:scale-105"
                                    >
                                        Launch Exam
                                    </button>
                                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDelete(card.id)}
                                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        if (card.type === 'interactive_worksheet') {
                            return (
                                <div key={card.id} className="glass rounded-2xl p-8 shadow-xl border border-secondary/20 bg-secondary/5 group relative flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-secondary text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg shadow-secondary/30">
                                            <FileText size={24} />
                                        </span>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.front}</h3>
                                            <p className="text-slate-500 dark:text-slate-400">Interactive Worksheet</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveExamHtml(card.back)}
                                        className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold shadow-lg shadow-secondary/20 transition-all transform hover:scale-105"
                                    >
                                        Launch Worksheet
                                    </button>
                                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDelete(card.id)}
                                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={card.id} className="glass rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-white/5 group relative">
                                <div className="flex items-start gap-4">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {index + 1}
                                    </span>
                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Question</h4>
                                            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{card.front}</p>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Answer / Explanation</h4>
                                            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{card.back}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => startEditing(card)}
                                        className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {flashcards.map((card) => {
                        if (card.type === 'interactive_exam') {
                            return (
                                <div key={card.id} className="relative group bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 border border-primary/20 flex flex-col items-center justify-center text-center h-[300px] gap-6 card-shadow">
                                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                        <FileSpreadsheet size={40} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{card.front}</h3>
                                        <p className="text-slate-500 text-sm">Interactive CBT Module</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveExamHtml(card.back)}
                                        className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-xl shadow-primary/20 transition-all w-full max-w-[200px]"
                                    >
                                        Start
                                    </button>
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        }

                        if (card.type === 'interactive_worksheet') {
                            return (
                                <div key={card.id} className="relative group bg-gradient-to-br from-secondary/10 to-accent/10 rounded-3xl p-6 border border-secondary/20 flex flex-col items-center justify-center text-center h-[300px] gap-6 card-shadow">
                                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                        <FileText size={40} className="text-secondary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{card.front}</h3>
                                        <p className="text-slate-500 text-sm">Interactive Worksheet</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveExamHtml(card.back)}
                                        className="px-8 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold shadow-xl shadow-secondary/20 transition-all w-full max-w-[200px]"
                                    >
                                        Start
                                    </button>
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <div key={card.id} className="relative group">
                                <div className="scale-90 hover:scale-100 transition-transform duration-300 relative z-0">
                                    <Flashcard front={card.front} back={card.back} />
                                </div>

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
                        );
                    })}
                </div>
            )}

            {/* Exam Modal */}
            <AnimatePresence>
                {activeExamHtml && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <h2 className="font-bold text-lg text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FileSpreadsheet className="text-primary" /> Interactive Exam Session
                            </h2>
                            <button
                                onClick={() => setActiveExamHtml(null)}
                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <iframe
                            srcDoc={activeExamHtml}
                            className="flex-1 w-full border-none"
                            title="Interactive Exam"
                            sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

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
        </div >
    );
}
