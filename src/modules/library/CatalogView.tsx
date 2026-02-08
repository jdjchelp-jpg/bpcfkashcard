import { useStore, StudySet } from '@/context/StoreContext';
import { Crown, Trash2, Calendar, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CatalogViewProps {
    onSelect: () => void;
}

export function CatalogView({ onSelect }: CatalogViewProps) {
    const { studySets, setStudySets, setActiveSetId, setFlashcards } = useStore();

    const handleSelectSet = (set: StudySet) => {
        setActiveSetId(set.id);
        setFlashcards(set.items);
        onSelect();
    };

    const handleDeleteSet = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this study set?')) {
            setStudySets(studySets.filter((s: StudySet) => s.id !== id));
        }
    };

    if (studySets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="p-6 bg-slate-900/50 rounded-full border border-white/5">
                    <Crown size={48} className="text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-300 dark:text-slate-100">No Study Sets Yet</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Generate content in the "Create" tab to build your catalog.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <header>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Study Catalog</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your generated worksheets, exams, and flashcards.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studySets.map((set: StudySet) => (
                    <motion.div
                        key={set.id}
                        whileHover={{ y: -5 }}
                        onClick={() => handleSelectSet(set)}
                        className="glass p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Sparkles size={80} />
                        </div>

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                <BookOpen size={24} />
                            </div>
                            <button
                                onClick={(e) => handleDeleteSet(set.id, e)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{set.title}</h3>

                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                                <Sparkles size={14} />
                                {set.items.length} Items
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(set.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {[...new Set(set.items.map((i: any) => i.type || 'flashcards'))].map((type: string) => (
                                <span key={type} className="px-2 py-1 bg-primary/10 text-primary dark:bg-white/5 dark:text-slate-300 rounded-md text-[10px] uppercase tracking-wider font-black ring-1 ring-primary/20">
                                    {type}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
