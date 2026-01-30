import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { FlashcardData } from '@/context/StoreContext';

/**
 * Export to Excel (.xlsx)
 */
export const exportToExcel = (flashcards: FlashcardData[], filename = 'flashcards.xlsx') => {
    const worksheet = XLSX.utils.json_to_sheet(flashcards.map(c => ({
        Front: c.front,
        Back: c.back
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Flashcards");
    XLSX.writeFile(workbook, filename);
};

/**
 * Export to PDF (.pdf) - Simple list format
 */
export const exportToPDF = (flashcards: FlashcardData[], filename = 'flashcards.pdf') => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Flashcards Export", 20, 20);

    doc.setFontSize(12);
    let y = 40;

    flashcards.forEach((card, index) => {
        // Check for page break
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.text(`Q${index + 1}: ${card.front}`, 20, y);
        y += 10;

        doc.setFont("helvetica", "normal");
        const splitBack = doc.splitTextToSize(`A: ${card.back}`, 170);
        doc.text(splitBack, 20, y);

        y += (splitBack.length * 7) + 10;
    });

    doc.save(filename);
};

/**
 * Export to Word (.docx) - Table format
 */
export const exportToWord = async (flashcards: FlashcardData[], filename = 'flashcards.docx') => {

    const tableRows = flashcards.map(card =>
        new TableRow({
            children: [
                new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: card.front, bold: true })] })],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [new Paragraph(card.back)],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
            ],
        })
    );

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [new TextRun({ text: "Flashcards Set", size: 32, bold: true })],
                    spacing: { after: 400 },
                }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Term / Question", bold: true })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Definition / Answer", bold: true })] })] }),
                            ],
                        }),
                        ...tableRows
                    ],
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    }
                }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};
