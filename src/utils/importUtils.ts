import * as XLSX from 'xlsx';
import { FlashcardData } from '@/context/StoreContext';

const generateId = () => Math.random().toString(36).substring(2, 11);

/**
 * Parse JSON file to FlashcardData[]
 */
export const parseJSONImport = async (file: File): Promise<FlashcardData[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                if (Array.isArray(json)) {
                    const validated = json.map(item => ({
                        id: item.id || generateId(),
                        front: item.front || '',
                        back: item.back || '',
                    }));
                    resolve(validated);
                } else {
                    reject(new Error('Invalid JSON format: Expected an array.'));
                }
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('File reading failed.'));
        reader.readAsText(file);
    });
};

/**
 * Parse Excel/CSV file to FlashcardData[]
 */
export const parseExcelImport = async (file: File): Promise<FlashcardData[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

                // Expecting columns: Front, Back
                const flashcards: FlashcardData[] = json
                    .slice(1) // Skip header
                    .filter(row => row[0] || row[1]) // Skip empty rows
                    .map(row => ({
                        id: generateId(),
                        front: String(row[0] || ''),
                        back: String(row[1] || ''),
                    }));

                resolve(flashcards);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('File reading failed.'));
        reader.readAsArrayBuffer(file);
    });
};
