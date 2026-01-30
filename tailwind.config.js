/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                accent: 'var(--color-accent)',
                bgApp: 'var(--color-bg-app)',
                bgSurface: 'var(--color-bg-surface)',
                slate: {
                    50: 'var(--color-slate-50)',
                    100: 'var(--color-slate-100)',
                    200: 'var(--color-slate-200)',
                    300: 'var(--color-slate-300)',
                    400: 'var(--color-slate-400)',
                    500: 'var(--color-slate-500)',
                    600: 'var(--color-slate-600)',
                    700: 'var(--color-slate-700)',
                    800: 'var(--color-slate-800)',
                    900: 'var(--color-slate-900)',
                }
            },
            animation: {
                'flip': 'flip 0.6s preserve-3d',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                flip: {
                    '0%': { transform: 'rotateY(0deg)' },
                    '100%': { transform: 'rotateY(180deg)' },
                }
            }
        },
    },
    plugins: [],
}
