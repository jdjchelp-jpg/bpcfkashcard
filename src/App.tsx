import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Layout } from '@/components/layout/Layout'
import { GeneratorView } from '@/modules/generator/GeneratorView'
import { LibraryView } from '@/modules/library/LibraryView'
import { CatalogView } from '@/modules/library/CatalogView'
import { SettingsView } from '@/modules/settings/SettingsView'
function App() {
    const [activeTab, setActiveTab] = useState<'create' | 'catalog' | 'library' | 'settings'>('create')

    return (
        <div className="min-h-screen bg-bgApp text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Layout
                className="text-slate-900 dark:text-slate-100 transition-colors duration-300"
                sidebar={
                    <Sidebar
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                }
            >
                {activeTab === 'create' && (
                    <div className="h-[calc(100vh-8rem)]">
                        <header className="mb-8">
                            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Create Flashcards</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Generate new study sets from text, files, or videos.</p>
                        </header>
                        <GeneratorView />
                    </div>
                )}

                {activeTab === 'catalog' && (
                    <CatalogView onSelect={() => setActiveTab('library')} />
                )}

                {activeTab === 'library' && (
                    <LibraryView />
                )}

                {activeTab === 'settings' && (
                    <SettingsView />
                )}
            </Layout>
        </div>
    )
}

export default App
