export interface Theme {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        bgApp: string;
        bgSurface: string;
        slate50: string;
        slate100: string;
        slate200: string;
        slate300: string;
        slate400: string;
        slate500: string;
        slate600: string;
        slate700: string;
        slate800: string;
        slate900: string;
    };
}

export const themes: Theme[] = [
    {
        id: 'classic',
        name: 'Classic Card',
        colors: {
            primary: '#4F46E5', secondary: '#10B981', accent: '#F59E0B',
            bgApp: '#F9FAFB', bgSurface: '#FFFFFF',
            slate50: '#F8FAFC', slate100: '#F1F5F9', slate200: '#E2E8F0', slate300: '#CBD5E1', slate400: '#94A3B8',
            slate500: '#64748B', slate600: '#475569', slate700: '#334155', slate800: '#1E293B', slate900: '#0F172A',
        }
    },
    {
        id: 'emerald-forest',
        name: 'Emerald Forest',
        colors: {
            primary: '#059669', secondary: '#65A30D', accent: '#D97706',
            bgApp: '#F0FDF4', bgSurface: '#FFFFFF',
            slate50: '#F0FDF4', slate100: '#DCFCE7', slate200: '#BBF7D0', slate300: '#86EFAC', slate400: '#4ADE80',
            slate500: '#22C55E', slate600: '#16A34A', slate700: '#15803D', slate800: '#166534', slate900: '#14532D',
        }
    },
    {
        id: 'purple-galaxy',
        name: 'Purple Galaxy',
        colors: {
            primary: '#7C3AED', secondary: '#C026D3', accent: '#4ADE80',
            bgApp: '#F5F3FF', bgSurface: '#FFFFFF',
            slate50: '#F5F3FF', slate100: '#EDE9FE', slate200: '#DDD6FE', slate300: '#C4B5FD', slate400: '#A78BFA',
            slate500: '#8B5CF6', slate600: '#7C3AED', slate700: '#6D28D9', slate800: '#5B21B6', slate900: '#4C1D95',
        }
    },
    {
        id: 'sunset-orange',
        name: 'Sunset Orange',
        colors: {
            primary: '#EA580C', secondary: '#E11D48', accent: '#FBBF24',
            bgApp: '#FFF7ED', bgSurface: '#FFFFFF',
            slate50: '#FFF7ED', slate100: '#FFEDD5', slate200: '#FED7AA', slate300: '#FDBA74', slate400: '#FB923C',
            slate500: '#F97316', slate600: '#EA580C', slate700: '#C2410C', slate800: '#9A3412', slate900: '#7C2D12',
        }
    },
    {
        id: 'blue-ocean',
        name: 'Blue Ocean',
        colors: {
            primary: '#2563EB', secondary: '#06B6D4', accent: '#FACC15',
            bgApp: '#EFF6FF', bgSurface: '#FFFFFF',
            slate50: '#F0F9FF', slate100: '#E0F2FE', slate200: '#BAE6FD', slate300: '#7DD3FC', slate400: '#38BDF8',
            slate500: '#0EA5E9', slate600: '#0284C7', slate700: '#0369A1', slate800: '#075985', slate900: '#0C4A6E',
        }
    },
    {
        id: 'dark',
        name: 'Dark Mode',
        colors: {
            primary: '#818CF8', secondary: '#34D399', accent: '#FBBF24',
            bgApp: '#0F172A', bgSurface: '#1E293B',
            slate50: '#1E293B', slate100: '#334155', slate200: '#475569', slate300: '#64748B', slate400: '#94A3B8',
            slate500: '#CBD5E1', slate600: '#E2E8F0', slate700: '#F1F5F9', slate800: '#F8FAFC', slate900: '#FFFFFF',
        }
    },
    { id: 'matrix', name: 'Matrix', colors: { primary: '#00FF41', secondary: '#008F11', accent: '#FFFFFF', bgApp: '#0D0208', bgSurface: '#003B00', slate50: '#0D0208', slate100: '#001400', slate200: '#002800', slate300: '#003B00', slate400: '#005C00', slate500: '#008F11', slate600: '#00FF41', slate700: '#5CFF81', slate800: '#99FFB1', slate900: '#FFFFFF' } },
    { id: 'cyberpunk', name: 'Cyberpunk', colors: { primary: '#FF00FF', secondary: '#00FFFF', accent: '#FFFF00', bgApp: '#120424', bgSurface: '#280847', slate50: '#120424', slate100: '#2A0944', slate200: '#4C1D6E', slate300: '#75379B', slate400: '#A155C7', slate500: '#C775E6', slate600: '#E699FF', slate700: '#F2CCFF', slate800: '#FCE6FF', slate900: '#FFFFFF' } },
    { id: 'cherry-blossom', name: 'Cherry Blossom', colors: { primary: '#EC4899', secondary: '#F472B6', accent: '#FBBF24', bgApp: '#FDF2F8', bgSurface: '#FFFFFF', slate50: '#FDF2F8', slate100: '#FCE7F3', slate200: '#FBCFE8', slate300: '#F9A8D4', slate400: '#F472B6', slate500: '#EC4899', slate600: '#DB2777', slate700: '#BE185D', slate800: '#9D174D', slate900: '#831843' } },
    { id: 'golden-hour', name: 'Golden Hour', colors: { primary: '#D97706', secondary: '#B45309', accent: '#FDE047', bgApp: '#FFFBEB', bgSurface: '#FFFFFF', slate50: '#FFFBEB', slate100: '#FEF3C7', slate200: '#FDE68A', slate300: '#FCD34D', slate400: '#FBBF24', slate500: '#F59E0B', slate600: '#D97706', slate700: '#B45309', slate800: '#92400E', slate900: '#78350F' } },
    { id: 'midnight-depth', name: 'Midnight Depth', colors: { primary: '#6366F1', secondary: '#4338CA', accent: '#A5B4FC', bgApp: '#1E1B4B', bgSurface: '#312E81', slate50: '#1E1B4B', slate100: '#312E81', slate200: '#3730A3', slate300: '#4338CA', slate400: '#4F46E5', slate500: '#6366F1', slate600: '#818CF8', slate700: '#A5B4FC', slate800: '#C7D2FE', slate900: '#E0E7FF' } },
    { id: 'royal-velvet', name: 'Royal Velvet', colors: { primary: '#7E22CE', secondary: '#581C87', accent: '#D8B4FE', bgApp: '#3B0764', bgSurface: '#581C87', slate50: '#3B0764', slate100: '#581C87', slate200: '#6B21A8', slate300: '#7E22CE', slate400: '#9333EA', slate500: '#A855F7', slate600: '#C084FC', slate700: '#D8B4FE', slate800: '#E9D5FF', slate900: '#F3E8FF' } },
    { id: 'arctic-frost', name: 'Arctic Frost', colors: { primary: '#06B6D4', secondary: '#0891B2', accent: '#67E8F9', bgApp: '#ECFEFF', bgSurface: '#FFFFFF', slate50: '#ECFEFF', slate100: '#CFFAFE', slate200: '#A5F3FC', slate300: '#67E8F9', slate400: '#22D3EE', slate500: '#06B6D4', slate600: '#0891B2', slate700: '#0E7490', slate800: '#155E75', slate900: '#164E63' } },
    { id: 'volcanic-ash', name: 'Volcanic Ash', colors: { primary: '#EF4444', secondary: '#7F1D1D', accent: '#FCA5A5', bgApp: '#18181B', bgSurface: '#27272A', slate50: '#18181B', slate100: '#27272A', slate200: '#3F3F46', slate300: '#52525B', slate400: '#71717A', slate500: '#A1A1AA', slate600: '#D4D4D8', slate700: '#E4E4E7', slate800: '#F4F4F5', slate900: '#FAFAFA' } },
    { id: 'coffee-house', name: 'Coffee House', colors: { primary: '#78350F', secondary: '#451A03', accent: '#D97706', bgApp: '#FFF7ED', bgSurface: '#FFEDD5', slate50: '#FFF7ED', slate100: '#FFEDD5', slate200: '#FED7AA', slate300: '#FDBA74', slate400: '#FB923C', slate500: '#F97316', slate600: '#EA580C', slate700: '#C2410C', slate800: '#9A3412', slate900: '#7C2D12' } },
    { id: 'leafy-greens', name: 'Leafy Greens', colors: { primary: '#65A30D', secondary: '#365314', accent: '#BEF264', bgApp: '#F7FEE7', bgSurface: '#FFFFFF', slate50: '#F7FEE7', slate100: '#ECFCCB', slate200: '#D9F99D', slate300: '#BEF264', slate400: '#A3E635', slate500: '#84CC16', slate600: '#65A30D', slate700: '#4D7C0F', slate800: '#3F6212', slate900: '#365314' } },
    { id: 'ocean-breeze', name: 'Ocean Breeze', colors: { primary: '#14B8A6', secondary: '#0F766E', accent: '#5EEAD4', bgApp: '#F0FDFA', bgSurface: '#FFFFFF', slate50: '#F0FDFA', slate100: '#CCFBF1', slate200: '#99F6E4', slate300: '#5EEAD4', slate400: '#2DD4BF', slate500: '#14B8A6', slate600: '#0D9488', slate700: '#0F766E', slate800: '#115E59', slate900: '#134E4A' } },
    { id: 'lavender-dream', name: 'Lavender', colors: { primary: '#8B5CF6', secondary: '#5B21B6', accent: '#C4B5FD', bgApp: '#F5F3FF', bgSurface: '#FFFFFF', slate50: '#F5F3FF', slate100: '#EDE9FE', slate200: '#DDD6FE', slate300: '#C4B5FD', slate400: '#A78BFA', slate500: '#8B5CF6', slate600: '#7C3AED', slate700: '#6D28D9', slate800: '#5B21B6', slate900: '#4C1D95' } },
    { id: 'steel-city', name: 'Steel City', colors: { primary: '#52525B', secondary: '#18181B', accent: '#A1A1AA', bgApp: '#FAFAFA', bgSurface: '#FFFFFF', slate50: '#FAFAFA', slate100: '#F4F4F5', slate200: '#E4E4E7', slate300: '#D4D4D8', slate400: '#A1A1AA', slate500: '#71717A', slate600: '#52525B', slate700: '#3F3F46', slate800: '#27272A', slate900: '#18181B' } },
    { id: 'ruby-red', name: 'Ruby Red', colors: { primary: '#DC2626', secondary: '#991B1B', accent: '#FCA5A5', bgApp: '#FEF2F2', bgSurface: '#FFFFFF', slate50: '#FEF2F2', slate100: '#FEE2E2', slate200: '#FECACA', slate300: '#FCA5A5', slate400: '#F87171', slate500: '#EF4444', slate600: '#DC2626', slate700: '#B91C1C', slate800: '#991B1B', slate900: '#7F1D1D' } },
    { id: 'solarized-light', name: 'Solarized', colors: { primary: '#B58900', secondary: '#CB4B16', accent: '#2AA198', bgApp: '#FDF6E3', bgSurface: '#EEE8D5', slate50: '#FDF6E3', slate100: '#EEE8D5', slate200: '#93A1A1', slate300: '#839496', slate400: '#657B83', slate500: '#586E75', slate600: '#B58900', slate700: '#CB4B16', slate800: '#D33682', slate900: '#2AA198' } },
    { id: 'dracula', name: 'Dracula', colors: { primary: '#BD93F9', secondary: '#FF79C6', accent: '#50FA7B', bgApp: '#282A36', bgSurface: '#44475A', slate50: '#282A36', slate100: '#44475A', slate200: '#6272A4', slate300: '#8BE9FD', slate400: '#50FA7B', slate500: '#FFB86C', slate600: '#FF79C6', slate700: '#BD93F9', slate800: '#FF5555', slate900: '#F1FA8C' } },
    { id: 'monokai', name: 'Monokai', colors: { primary: '#A6E22E', secondary: '#F92672', accent: '#66D9EF', bgApp: '#272822', bgSurface: '#3E3D32', slate50: '#272822', slate100: '#3E3D32', slate200: '#75715E', slate300: '#A6E22E', slate400: '#F92672', slate500: '#66D9EF', slate600: '#FD971F', slate700: '#AE81FF', slate800: '#F8F8F2', slate900: '#E6DB74' } },
    { id: 'vaporwave', name: 'Vaporwave', colors: { primary: '#FF71CE', secondary: '#01CDFE', accent: '#B967FF', bgApp: '#2B1B4E', bgSurface: '#41326E', slate50: '#2B1B4E', slate100: '#41326E', slate200: '#5A4A8A', slate300: '#7664A9', slate400: '#9582C9', slate500: '#B5A3EA', slate600: '#FF71CE', slate700: '#01CDFE', slate800: '#05FFA1', slate900: '#B967FF' } },
    { id: 'high-contrast', name: 'High Contrast', colors: { primary: '#000000', secondary: '#FFFFFF', accent: '#FFFF00', bgApp: '#FFFFFF', bgSurface: '#000000', slate50: '#FFFFFF', slate100: '#E5E5E5', slate200: '#CCCCCC', slate300: '#B2B2B2', slate400: '#999999', slate500: '#7F7F7F', slate600: '#666666', slate700: '#4C4C4C', slate800: '#333333', slate900: '#191919' } }
];
