import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, themes } from '@/utils/themes';

export interface FlashcardData {
    id: string;
    front: string;
    back: string;
}

interface StoreContextType {
    apiKey: string;
    setApiKey: (key: string) => void;
    flashcards: FlashcardData[];
    setFlashcards: (cards: FlashcardData[]) => void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
    currentTheme: Theme;
    setTheme: (themeId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey') || '');
    const [flashcards, setFlashcards] = useState<FlashcardData[]>(() => {
        const saved = localStorage.getItem('flashcards');
        return saved ? JSON.parse(saved) : [];
    });
    const [isGenerating, setIsGenerating] = useState(false);

    // Theme State
    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        const savedThemeId = localStorage.getItem('themeId');
        return themes.find(t => t.id === savedThemeId) || themes.find(t => t.id === 'classic') || themes[0];
    });

    useEffect(() => {
        localStorage.setItem('apiKey', apiKey);
    }, [apiKey]);

    useEffect(() => {
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }, [flashcards]);

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

        // Handle "Dark" class for any other utility/library that specifically looks for .dark
        // We assume themes with dark backgrounds are "dark"
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
            apiKey,
            setApiKey,
            flashcards,
            setFlashcards,
            isGenerating,
            setIsGenerating,
            currentTheme,
            setTheme
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
