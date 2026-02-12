import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, themes } from '@/utils/themes';

export type ItemType = 'flashcards' | 'worksheet' | 'exam' | 'interactive_worksheet' | 'interactive_exam';

export interface FlashcardData {
    id: string;
    front: string;
    back: string;
    type?: ItemType;
}

export interface StudySet {
    id: string;
    title: string;
    items: FlashcardData[];
    createdAt: number;
}

export type AIProvider = 'openrouter' | 'poe';

interface StoreContextType {
    openRouterKey: string;
    setOpenRouterKey: (key: string) => void;
    poeKey: string;
    setPoeKey: (key: string) => void;
    preferredProvider: AIProvider;
    setPreferredProvider: (provider: AIProvider) => void;
    openRouterModel: string;
    setOpenRouterModel: (model: string) => void;
    poeModel: string;
    setPoeModel: (model: string) => void;
    flashcards: FlashcardData[];
    setFlashcards: (cards: FlashcardData[]) => void;
    studySets: StudySet[];
    setStudySets: (sets: StudySet[]) => void;
    activeSetId: string | null;
    setActiveSetId: (id: string | null) => void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
    currentTheme: Theme;
    setTheme: (themeId: string) => void;
    isPaid: boolean;
    setIsPaid: (val: boolean) => void;
    maxUploadSize: number;
    // Generator states for persistence
    genInstruction: string;
    setGenInstruction: (val: string) => void;
    genContent: string;
    setGenContent: (val: string) => void;
    genMode: string;
    setGenMode: (val: any) => void;
    genInputMode: 'text' | 'file' | 'website' | 'image';
    setGenInputMode: (val: 'text' | 'file' | 'website' | 'image') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
    const [openRouterKey, setOpenRouterKeyState] = useState(() => localStorage.getItem('openRouterKey') || '');
    const [poeKey, setPoeKeyState] = useState(() => localStorage.getItem('poeKey') || '');
    const [preferredProvider, setPreferredProviderState] = useState<AIProvider>(() =>
        (localStorage.getItem('preferredProvider') as AIProvider) || 'openrouter'
    );

    // Model States
    const [openRouterModel, setOpenRouterModelState] = useState(() =>
        localStorage.getItem('openRouterModel') || 'nvidia/nemotron-nano-12b-v2-vl:free'
    );
    const [poeModel, setPoeModelState] = useState(() =>
        localStorage.getItem('poeModel') || 'grok-4-fast-reasoning'
    );

    const [flashcards, setFlashcards] = useState<FlashcardData[]>(() => {
        const saved = localStorage.getItem('flashcards');
        return saved ? JSON.parse(saved) : [];
    });

    const [studySets, setStudySetsState] = useState<StudySet[]>(() => {
        const saved = localStorage.getItem('studySets');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeSetId, setActiveSetIdState] = useState<string | null>(() => {
        return localStorage.getItem('activeSetId');
    });

    const [isGenerating, setIsGenerating] = useState(false);

    // Pro Status State
    const [isPaid, setIsPaidState] = useState(() => localStorage.getItem('isPaid') === 'true');
    const maxUploadSize = isPaid ? 500 * 1024 * 1024 : 250 * 1024 * 1024;

    const setIsPaid = (val: boolean) => {
        setIsPaidState(val);
        localStorage.setItem('isPaid', String(val));
    };

    // Theme State
    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        const savedThemeId = localStorage.getItem('themeId');
        return themes.find(t => t.id === savedThemeId) || themes.find(t => t.id === 'classic') || themes[0];
    });

    // Generator States for Persistence
    const [genInstruction, setGenInstructionState] = useState(() => localStorage.getItem('genInstruction') || '');
    const [genContent, setGenContentState] = useState(() => localStorage.getItem('genContent') || '');
    const [genMode, setGenModeState] = useState(() => localStorage.getItem('genMode') || 'flashcards');
    const [genInputMode, setGenInputModeState] = useState<'text' | 'file' | 'website' | 'image'>(() => (localStorage.getItem('genInputMode') as 'text' | 'file' | 'website' | 'image') || 'text');

    const setGenInstruction = (val: string) => {
        setGenInstructionState(val);
        localStorage.setItem('genInstruction', val);
    };

    const setGenContent = (val: string) => {
        setGenContentState(val);
        localStorage.setItem('genContent', val);
    };

    const setGenMode = (val: string) => {
        setGenModeState(val);
        localStorage.setItem('genMode', val);
    };

    const setGenInputMode = (val: 'text' | 'file' | 'website' | 'image') => {
        setGenInputModeState(val);
        localStorage.setItem('genInputMode', val);
    };

    const setOpenRouterKey = (key: string) => {
        setOpenRouterKeyState(key);
        localStorage.setItem('openRouterKey', key);
    };

    const setPoeKey = (key: string) => {
        setPoeKeyState(key);
        localStorage.setItem('poeKey', key);
    };

    const setPreferredProvider = (provider: AIProvider) => {
        setPreferredProviderState(provider);
        localStorage.setItem('preferredProvider', provider);
    };

    const setOpenRouterModel = (model: string) => {
        setOpenRouterModelState(model);
        localStorage.setItem('openRouterModel', model);
    };

    const setPoeModel = (model: string) => {
        setPoeModelState(model);
        localStorage.setItem('poeModel', model);
    };

    const setStudySets = (sets: StudySet[]) => {
        setStudySetsState(sets);
        localStorage.setItem('studySets', JSON.stringify(sets));
    };

    const setActiveSetId = (id: string | null) => {
        setActiveSetIdState(id);
        if (id) localStorage.setItem('activeSetId', id);
        else localStorage.removeItem('activeSetId');
    };

    // Unified Persistence Effect
    useEffect(() => {
        localStorage.setItem('preferredProvider', preferredProvider);
        localStorage.setItem('openRouterModel', openRouterModel);
        localStorage.setItem('poeModel', poeModel);

        // Auto-switch discontinued model (March 2, 2026)
        const SOLAR_CUTOFF = new Date('2026-03-02').getTime();
        if (Date.now() >= SOLAR_CUTOFF && openRouterModel === 'upstage/solar-pro-3:free') {
            setOpenRouterModel('meta-llama/llama-3.3-70b-instruct:free');
        }
    }, [preferredProvider, openRouterModel, poeModel]);

    useEffect(() => {
        localStorage.setItem('flashcards', JSON.stringify(flashcards));

        // Sync with studySets if there's an active set
        if (activeSetId) {
            setStudySetsState(prevSets => {
                const updatedSets = prevSets.map(s =>
                    s.id === activeSetId ? { ...s, items: flashcards } : s
                );
                localStorage.setItem('studySets', JSON.stringify(updatedSets));
                return updatedSets;
            });
        }
    }, [flashcards, activeSetId]);

    // Apply Theme
    useEffect(() => {
        const root = document.documentElement;
        const colors = currentTheme.colors;

        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-secondary', colors.secondary);
        root.style.setProperty('--color-accent', colors.accent);
        root.style.setProperty('--color-bg-app', colors.bgApp);
        root.style.setProperty('--color-bg-surface', colors.bgSurface);

        root.style.setProperty('--color-slate-50', colors.slate50);
        root.style.setProperty('--color-slate-100', colors.slate100);
        root.style.setProperty('--color-slate-200', colors.slate200);
        root.style.setProperty('--color-slate-300', colors.slate300);
        root.style.setProperty('--color-slate-400', colors.slate400);
        root.style.setProperty('--color-slate-500', colors.slate500);
        root.style.setProperty('--color-slate-600', colors.slate600);
        root.style.setProperty('--color-slate-700', colors.slate700);
        root.style.setProperty('--color-slate-800', colors.slate800);
        root.style.setProperty('--color-slate-900', colors.slate900);

        localStorage.setItem('themeId', currentTheme.id);

        const isDarkTheme = ['dark', 'matrix', 'cyberpunk', 'midnight-depth', 'royal-velvet', 'volcanic-ash', 'vaporwave', 'dracula', 'monokai'].includes(currentTheme.id);
        if (isDarkTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

    }, [currentTheme]);

    const setTheme = (themeId: string) => {
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
            setCurrentTheme(theme);
        }
    };

    return (
        <StoreContext.Provider value={{
            openRouterKey,
            setOpenRouterKey,
            poeKey,
            setPoeKey,
            preferredProvider,
            setPreferredProvider,
            openRouterModel,
            setOpenRouterModel,
            poeModel,
            setPoeModel,
            flashcards,
            setFlashcards,
            studySets,
            setStudySets,
            activeSetId,
            setActiveSetId,
            isGenerating,
            setIsGenerating,
            currentTheme,
            setTheme,
            isPaid,
            setIsPaid,
            maxUploadSize,
            genInstruction,
            setGenInstruction,
            genContent,
            setGenContent,
            genMode,
            setGenMode,
            genInputMode,
            setGenInputMode
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}
