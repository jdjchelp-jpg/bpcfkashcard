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
                <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                    {children}
                </div>
                {/* Animated Background Blobs */}
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />
            </main>
        </div>
    );
}
