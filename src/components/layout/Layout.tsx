import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
    sidebar: ReactNode;
    className?: string; // Allow passing detailed className for background
}

export function Layout({ children, sidebar, className }: LayoutProps) {
    return (
        <div className={`flex min-h-screen ${className}`}>
            {sidebar}
            <main className="flex-1 p-8 overflow-y-auto h-screen relative">
                <div className="max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
                {/* Background Gradients/Orbs */}
                <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[128px] -z-10 pointer-events-none translate-x-[-20%] translate-y-[-20%]" />
                <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px] -z-10 pointer-events-none translate-x-[20%] translate-y-[20%]" />
            </main>
        </div>
    );
}
